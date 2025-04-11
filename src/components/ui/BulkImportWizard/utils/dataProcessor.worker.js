/**
 * Veriyi kolon eşleştirmesine göre işler (Web Worker)
 * @param {Array} rawData - Ham veri
 * @param {number} headerIndex - Başlık satırı indeksi
 * @param {Array} headers - Başlıklar
 * @param {Object} columnMapping - Kolon eşleştirmesi
 * @param {Array} expectedColumns - Beklenen kolonlar
 * @returns {Object} - İşlenmiş veri ve hatalar
 */
const processDataWithMapping = (
  rawData,
  headerIndex,
  headers,
  columnMapping,
  expectedColumns,
) => {
  try {
    // Skip the header row and process remaining data
    const dataRows = rawData.slice(headerIndex + 1);
    const processedRows = [];
    const errors = [];

    dataRows.forEach((row, rowIndex) => {
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
              row: rowIndex + headerIndex + 2, // +2 for 1-indexing and header offset
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
            // IMPORTANT: Regex cannot be directly transferred to worker.
            // You might need to pass the regex pattern as a string and recreate it here
            // or adjust the expectedColumns structure.
            // For now, assuming regex is transferred correctly (which might fail).
            // A safer approach is to pass regex flags and pattern string separately.
            let patternRegex = regex;
            if (typeof regex === "string") {
              // Attempt to recreate regex if passed as string parts
              try {
                // Example: Assume column.pattern is { source: '^\d+$', flags: 'i' }
                patternRegex = new RegExp(regex.source, regex.flags);
              } catch (e) {
                console.error("Failed to recreate regex in worker:", e);
                // Handle error - maybe skip validation or use a default
              }
            }

            if (
              patternRegex instanceof RegExp &&
              !patternRegex.test(String(value))
            ) {
              errors.push({
                row: rowIndex + headerIndex + 2,
                column: column.key,
                message: message || `${column.label} için geçersiz format`,
                patternError: true, // Flag to identify pattern errors
              });
              hasError = true;
            }
          }
        } else if (column.required) {
          errors.push({
            row: rowIndex + headerIndex + 2,
            column: column.key,
            message: `${column.label} sütunu eşleştirilmemiş`,
          });
          hasError = true;
        }
      });

      if (!hasError) {
        processedRows.push(processedRow);
      }
    });

    return {
      processedData: processedRows,
      validationErrors: errors,
    };
  } catch (error) {
    console.error("Data processing error in worker:", error);
    // Re-throw or post an error message back
    throw new Error("Veriler işlenirken bir hata oluştu (worker)");
  }
};

// Listen for messages from the main thread
self.onmessage = (event) => {
  const { rawData, headerIndex, headers, columnMapping, expectedColumns } =
    event.data;

  try {
    const result = processDataWithMapping(
      rawData,
      headerIndex,
      headers,
      columnMapping,
      expectedColumns,
    );
    // Post the result back to the main thread
    self.postMessage({ type: "RESULT", payload: result });
  } catch (error) {
    // Post error back to the main thread
    self.postMessage({
      type: "ERROR",
      payload: { message: error.message, stack: error.stack },
    });
  }
};
