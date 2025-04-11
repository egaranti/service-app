/**
 * Veri validasyon işlemlerini gerçekleştiren worker
 * Bu worker, büyük veri setlerini chunk'lar halinde işleyerek
 * ana thread'in bloklanmasını önler
 */

// Chunk boyutu - kaç satırın bir seferde işleneceği
const CHUNK_SIZE = 200;
// Progress güncelleme aralığı (yüzde olarak)
const PROGRESS_UPDATE_INTERVAL = 5;

/**
 * Bir veri kümesini belirli bir kolon eşleştirmesine göre validate eder
 * @param {Array} dataChunk - İşlenecek veri kümesi
 * @param {number} startIndex - Başlangıç indeksi
 * @param {Array} headers - Başlıklar
 * @param {Object} columnMapping - Kolon eşleştirmesi
 * @param {Array} expectedColumns - Beklenen kolonlar
 * @returns {Object} - İşlenmiş veri ve hatalar
 */
const validateDataChunk = (
  dataChunk,
  startIndex,
  headers,
  columnMapping,
  expectedColumns,
) => {
  const processedRows = [];
  const errors = [];

  dataChunk.forEach((row, rowIndex) => {
    const actualRowIndex = startIndex + rowIndex;
    const processedRow = {};
    let hasError = false;

    // Process each expected column
    expectedColumns.forEach((column) => {
      const fileHeaderIndex = headers.indexOf(columnMapping[column.key]);

      if (fileHeaderIndex !== -1) {
        const value = row[fileHeaderIndex];
        processedRow[column.key] = value;

        // Validate required fields
        if (
          column.required &&
          (value === undefined || value === "" || value === null)
        ) {
          errors.push({
            row: actualRowIndex + 2, // +2 for 1-indexing and header offset
            column: column.key,
            message: `${column.label} alanı boş olamaz`,
          });
          hasError = true;
        }

        // Validate pattern if defined and value exists
        if (
          column.pattern &&
          value !== undefined &&
          value !== "" &&
          value !== null
        ) {
          const { regex, message } = column.pattern;
          let patternRegex = regex;

          if (typeof regex === "string") {
            // If regex is a string, create a new RegExp object
            try {
              patternRegex = new RegExp(regex);
            } catch (e) {
              console.error("Failed to create regex from string in worker:", e);
            }
          } else if (typeof regex === "object") {
            if (regex instanceof RegExp) {
              // Use the regex directly if it's already a RegExp
              patternRegex = regex;
            } else if (regex.source) {
              // Recreate the RegExp from source and flags
              try {
                patternRegex = new RegExp(regex.source, regex.flags || "");
              } catch (e) {
                console.error("Failed to recreate regex in worker:", e);
              }
            }
          }

          // Convert value to string before testing
          const stringValue = String(value).trim();

          if (
            patternRegex instanceof RegExp &&
            !patternRegex.test(stringValue)
          ) {
            errors.push({
              row: actualRowIndex + 2,
              column: column.key,
              message: message || `${column.label} için geçersiz format`,
              patternError: true, // Flag to identify pattern errors
            });
            hasError = true;
          }
        }
      } else if (column.required) {
        errors.push({
          row: actualRowIndex + 2,
          column: column.key,
          message: `${column.label} sütunu eşleştirilmemiş`,
        });
        hasError = true;
      }
    });

    // Always add the row to processedRows, even if it has errors
    // This ensures all data is displayed in the table
    processedRows.push({
      ...processedRow,
      _hasError: hasError, // Add a flag to indicate if the row has errors
      _rowIndex: actualRowIndex + 2, // Add the row index for reference
    });
  });

  return {
    processedRows,
    errors,
  };
};

/**
 * Veriyi chunk'lar halinde işler
 * @param {Array} rawData - Ham veri
 * @param {number} headerIndex - Başlık satırı indeksi
 * @param {Array} headers - Başlıklar
 * @param {Object} columnMapping - Kolon eşleştirmesi
 * @param {Array} expectedColumns - Beklenen kolonlar
 */
const processDataInChunks = (
  rawData,
  headerIndex,
  headers,
  columnMapping,
  expectedColumns,
) => {
  try {
    // Skip the header row
    const dataRows = rawData.slice(headerIndex + 1);
    const totalRows = dataRows.length;
    let processedRows = [];
    let allErrors = [];
    let firstErrorInfo = null;

    // İlk progress bilgisini gönder
    self.postMessage({
      type: "PROGRESS",
      payload: {
        progress: 0,
        totalRows,
        processedRows: 0,
      },
    });

    // Veriyi chunk'lara böl ve işle
    let processedCount = 0;
    let lastReportedProgress = 0;

    const processNextChunk = (startIndex) => {
      // Eğer tüm veriler işlendiyse sonuçları gönder
      if (startIndex >= totalRows) {
        self.postMessage({
          type: "RESULT",
          payload: {
            processedData: processedRows,
            validationErrors: allErrors,
            firstErrorInfo,
            progress: 100,
            totalRows,
            processedRows: processedCount,
          },
        });
        return;
      }

      // Chunk boyutunu hesapla (son chunk daha küçük olabilir)
      const endIndex = Math.min(startIndex + CHUNK_SIZE, totalRows);
      const currentChunk = dataRows.slice(startIndex, endIndex);

      // Chunk'ı işle
      const result = validateDataChunk(
        currentChunk,
        startIndex,
        headers,
        columnMapping,
        expectedColumns,
      );

      // Sonuçları birleştir
      processedRows = [...processedRows, ...result.processedRows];

      // İlk hatayı kaydet
      if (result.errors.length > 0 && !firstErrorInfo) {
        firstErrorInfo = result.errors[0];
      }

      allErrors = [...allErrors, ...result.errors];
      processedCount += currentChunk.length;

      // İlerleme yüzdesini hesapla
      const currentProgress = Math.floor((processedCount / totalRows) * 100);

      // Sadece belirli aralıklarla progress güncellemesi gönder
      if (
        currentProgress >= lastReportedProgress + PROGRESS_UPDATE_INTERVAL ||
        endIndex >= totalRows
      ) {
        lastReportedProgress = currentProgress;
        self.postMessage({
          type: "PROGRESS",
          payload: {
            progress: currentProgress,
            totalRows,
            processedRows: processedCount,
            currentErrors: result.errors,
          },
        });
      }

      // Bir sonraki chunk'ı işlemek için setTimeout kullan
      // Bu, UI thread'in ara sıra nefes almasını sağlar
      setTimeout(() => {
        processNextChunk(endIndex);
      }, 0);
    };

    // İlk chunk'ı işlemeye başla
    processNextChunk(0);
  } catch (error) {
    console.error("Data validation error in worker:", error);
    self.postMessage({
      type: "ERROR",
      payload: { message: error.message, stack: error.stack },
    });
  }
};

// Listen for messages from the main thread
self.onmessage = (event) => {
  const { rawData, headerIndex, headers, columnMapping, expectedColumns } =
    event.data;

  try {
    // Chunk'lar halinde işlemeyi başlat
    processDataInChunks(
      rawData,
      headerIndex,
      headers,
      columnMapping,
      expectedColumns,
    );
  } catch (error) {
    // Post error back to the main thread
    self.postMessage({
      type: "ERROR",
      payload: { message: error.message, stack: error.stack },
    });
  }
};
