import { Button, useToast } from "@egaranti/components";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FixedSizeList as List } from "react-window";

import TableRow from "../components/TableRow";

import { AlertCircleIcon, PlusCircleIcon } from "lucide-react";

const DataValidationStep = ({
  tableRef,
  tableWidth,
  columnMapping,
  expectedColumns,
  filteredData,
  validationErrors,
  ROW_HEIGHT,
  LIST_HEIGHT,
  setProcessedData,
}) => {
  const listRef = useRef(null);
  const { toast } = useToast();

  // Daha önce gösterilen hata mesajlarını takip etmek için ref
  const shownPatternErrorsRef = useRef(new Set());

  // Performans optimizasyonu için önceki veriyi takip et
  const prevDataRef = useRef(filteredData);

  // Validasyon işlemi durumu için state
  const [validationStatus, setValidationStatus] = useState({
    isValidating: false,
    progress: 0,
    totalRows: 0,
  });

  // Hata satırına gitme fonksiyonu - useCallback ile optimize edildi
  const scrollToRow = useCallback(
    (rowIndex) => {
      if (listRef.current) {
        // Gerçek veri indeksini hesapla (header satırını dikkate alarak)
        const dataIndex = rowIndex - 2; // -2 çünkü row 1-indexed ve header offset var

        if (dataIndex >= 0 && dataIndex < filteredData.length) {
          listRef.current.scrollToItem(dataIndex, "center");
        }
      }
    },
    [filteredData.length],
  );

  // Satır silme fonksiyonu - useCallback ile optimize edildi
  const deleteRow = useCallback(
    (index) => {
      setProcessedData((prevData) => {
        const newData = [...prevData];
        newData.splice(index, 1);
        return newData;
      });
    },
    [setProcessedData],
  );

  // Boş satır oluşturma fonksiyonu - useMemo ile optimize edildi
  const emptyRow = useMemo(() => {
    const row = {};
    Object.keys(columnMapping).forEach((key) => {
      row[key] = "";
    });
    return row;
  }, [columnMapping]);

  // Yeni satır ekleme fonksiyonu - useCallback ile optimize edildi
  const addNewRow = useCallback(() => {
    setProcessedData((prevData) => {
      const newData = [...prevData, emptyRow];

      // Yeni eklenen satıra scroll - requestAnimationFrame ile optimize edildi
      requestAnimationFrame(() => {
        if (listRef.current) {
          listRef.current.scrollToItem(prevData.length, "center");
        }
      });

      return newData;
    });
  }, [emptyRow, setProcessedData]);

  // Hücre değişikliği için daha optimize edilmiş fonksiyon
  const handleCellChange = useCallback(
    (index, expectedKey, value) => {
      setProcessedData((prevData) => {
        // Eğer değer aynıysa, state'i değiştirme
        if (prevData[index]?.[expectedKey] === value) {
          return prevData;
        }

        // Immutable güncelleme ile performansı artır
        return prevData.map((row, i) =>
          i === index ? { ...row, [expectedKey]: value } : row,
        );
      });
    },
    [setProcessedData],
  );

  // Validation kuralları
  const validationRules = useMemo(
    () => ({
      required: {
        validate: (value) => value && value.trim() !== "",
        message: "Bu alan boş bırakılamaz",
      },
      pattern: {
        validate: (value, pattern) => {
          if (!value) return true; // Boş değer için pattern kontrolü yapma
          return pattern.test(value.toString());
        },
        message: (customMessage) => customMessage || "Geçersiz format",
      },
    }),
    [],
  );

  // Hücre validasyonu için state
  const [cellErrors, setCellErrors] = useState({});
  const firstErrorRef = useRef(null);

  // Validasyon işlemini iptal etmek için ref
  const validationCancelRef = useRef(false);

  // Validasyon fonksiyonu - Web Worker benzeri yaklaşımla optimize edildi
  const validateData = useCallback(() => {
    // Eğer zaten validasyon çalışıyorsa, işlemi iptal et
    if (validationStatus.isValidating) {
      validationCancelRef.current = true;
      setValidationStatus((prev) => ({
        ...prev,
        isValidating: false,
        progress: 0,
      }));
      toast({
        title: "Doğrulama İptal Edildi",
        description: "Doğrulama işlemi kullanıcı tarafından iptal edildi.",
        variant: "success",
      });
      return;
    }

    // Validasyon başlangıcı
    validationCancelRef.current = false;
    setValidationStatus({
      isValidating: true,
      progress: 0,
      totalRows: filteredData.length,
    });

    // Kullanıcıya bildir
    toast({
      title: "Doğrulama Başlatıldı",
      description: "Veriler doğrulanıyor...",
      variant: "success",
    });

    // Validasyon için gerekli değişkenler
    const errors = {};
    let hasErrors = false;
    let firstErrorRowIndex = -1;
    let firstErrorColumnKey = null;

    // Veri boyutuna göre chunk boyutunu dinamik olarak belirle
    // Büyük veri setleri için daha küçük chunk'lar kullan
    const totalRows = filteredData.length;
    const chunkSize = totalRows > 1000 ? 50 : totalRows > 500 ? 100 : 200;

    // İlerleme durumunu takip etmek için değişkenler
    let processedRows = 0;

    // Validasyon işlemini chunk'lara bölerek performansı artırma
    const processChunk = (startIndex) => {
      // İptal edildi mi kontrol et
      if (validationCancelRef.current) {
        setValidationStatus((prev) => ({
          ...prev,
          isValidating: false,
          progress: 0,
        }));
        return;
      }

      const endIndex = Math.min(startIndex + chunkSize, filteredData.length);
      const currentChunkSize = endIndex - startIndex;

      // Web Worker benzeri bir yaklaşımla validasyonu ana thread'den ayırma
      // requestAnimationFrame ile UI thread'in bloklanmasını önleme
      requestAnimationFrame(() => {
        for (let rowIndex = startIndex; rowIndex < endIndex; rowIndex++) {
          const row = filteredData[rowIndex];

          for (let i = 0; i < expectedColumns.length; i++) {
            const column = expectedColumns[i];
            const value = row[column.key];
            const cellKey = `${rowIndex}-${column.key}`;

            // Required validation
            if (column.required && !validationRules.required.validate(value)) {
              errors[cellKey] = validationRules.required.message;
              hasErrors = true;
              if (firstErrorRowIndex === -1) {
                firstErrorRowIndex = rowIndex;
                firstErrorColumnKey = column.key;
              }
            }

            // Pattern validation (if specified)
            if (column.pattern && value) {
              if (
                !validationRules.pattern.validate(value, column.pattern.regex)
              ) {
                errors[cellKey] =
                  column.pattern.message || validationRules.pattern.message();
                hasErrors = true;
                if (firstErrorRowIndex === -1) {
                  firstErrorRowIndex = rowIndex;
                  firstErrorColumnKey = column.key;
                }
              }
            }
          }
        }

        // İlerleme durumunu güncelle
        processedRows += currentChunkSize;
        const progress = Math.min(
          Math.round((processedRows / totalRows) * 100),
          100,
        );

        setValidationStatus((prev) => ({
          ...prev,
          progress,
        }));

        // Tüm veri işlendiyse sonuçları uygula
        if (endIndex >= filteredData.length) {
          setCellErrors(errors);
          setValidationStatus({
            isValidating: false,
            progress: 100,
            totalRows: 0,
          });

          // Hata varsa ilk hataya odaklan
          if (hasErrors) {
            if (listRef.current) {
              listRef.current.scrollToItem(firstErrorRowIndex, "center");

              // İlk hatalı hücreye referansı kaydet
              firstErrorRef.current = {
                rowIndex: firstErrorRowIndex,
                columnKey: firstErrorColumnKey,
              };

              // Kullanıcıya bildir
              toast({
                title: "Doğrulama Hatası",
                description: "Lütfen hatalı alanları kontrol edin.",
                variant: "error",
              });
            }
          } else {
            toast({
              title: "Doğrulama Başarılı",
              description: "Tüm veriler geçerli.",
              variant: "success",
            });
          }
        } else {
          // Sonraki chunk'ı işle - requestIdleCallback veya setTimeout kullan
          // requestIdleCallback tarayıcı boşta kaldığında çalışır, daha iyi performans sağlar
          if (window.requestIdleCallback) {
            window.requestIdleCallback(() => processChunk(endIndex), {
              timeout: 500,
            });
          } else {
            // Fallback olarak setTimeout kullan
            setTimeout(() => processChunk(endIndex), 0);
          }
        }
      });
    };

    // İlk chunk'ı işlemeye başla
    processChunk(0);

    return true;
  }, [
    filteredData,
    expectedColumns,
    validationRules,
    toast,
    validationStatus.isValidating,
  ]);

  // Validation prop'u
  const validation = useMemo(
    () => ({
      rules: validationRules,
      errors: cellErrors,
      firstErrorRef: firstErrorRef,
    }),
    [validationRules, cellErrors],
  );

  // List için gerekli itemData'yı memoize et
  const itemData = useMemo(
    () => ({
      filteredData,
      columnMapping,
      handleCellChange,
      deleteRow,
      validation,
    }),
    [filteredData, columnMapping, handleCellChange, deleteRow, validation],
  );

  // Pattern validation hatalarını toast olarak göster
  useEffect(() => {
    if (validationErrors && validationErrors.length > 0) {
      // Sadece pattern hatalarını filtrele
      const patternErrors = validationErrors.filter(
        (error) => error.patternError,
      );

      // Yeni pattern hatalarını göster
      patternErrors.forEach((error) => {
        const errorKey = `${error.row}-${error.column}`;

        // Bu hata daha önce gösterilmediyse göster
        if (!shownPatternErrorsRef.current.has(errorKey)) {
          toast({
            title: "Format Hatası",
            description: `Satır ${error.row}: ${error.message}`,
            variant: "error",
            duration: 5000,
          });

          // Bu hatayı gösterildi olarak işaretle
          shownPatternErrorsRef.current.add(errorKey);
        }
      });
    }

    // Component unmount olduğunda veya validationErrors değiştiğinde temizle
    return () => {
      if (validationErrors.length === 0) {
        shownPatternErrorsRef.current.clear();
      }
    };
  }, [validationErrors, toast]);

  return (
    <div className="space-y-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={validateData}
            variant={validationStatus.isValidating ? "secondaryColor" : ""}
          >
            <AlertCircleIcon className="mr-2 h-4 w-4" />
            {validationStatus.isValidating ? "İptal Et" : "Doğrula"}
          </Button>

          {validationStatus.isValidating && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
                  style={{ width: `${validationStatus.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                %{validationStatus.progress}
              </span>
            </div>
          )}
        </div>

        <Button size="sm" variant="secondaryColor" onClick={addNewRow}>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Yeni Satır Ekle
        </Button>
      </div>

      <div ref={tableRef} className="overflow-hidden rounded-md border">
        {/* Tablo başlığı */}
        <div className="flex border-b bg-gray-50 font-medium text-gray-700">
          {Object.keys(columnMapping).map((expectedKey) => (
            <div
              key={expectedKey}
              style={{
                flex: 1,
                maxWidth: "200px",
                padding: "12px 8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              className="text-left"
            >
              {expectedColumns.find((col) => col.key === expectedKey)?.label ||
                expectedKey}
            </div>
          ))}
          <div
            style={{ width: "60px", padding: "12px 8px" }}
            className="text-center"
          >
            İşlem
          </div>
        </div>

        {/* Tablo içeriği */}
        <div style={{ height: LIST_HEIGHT }}>
          {filteredData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              Veri bulunmamaktadır. Yeni satır ekleyebilirsiniz.
            </div>
          ) : (
            <List
              ref={listRef}
              height={LIST_HEIGHT}
              itemCount={filteredData.length}
              itemSize={ROW_HEIGHT}
              width={tableWidth || "100%"}
              itemData={itemData}
            >
              {({ index, style, data }) => (
                <TableRow
                  key={`row-${index}`}
                  index={index}
                  style={style}
                  item={data.filteredData[index]}
                  columnMapping={data.columnMapping}
                  handleCellChange={data.handleCellChange}
                  deleteRow={data.deleteRow}
                  validation={data.validation}
                />
              )}
            </List>
          )}
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="mb-2 font-semibold">Doğrulama Hataları:</p>
          <ul className="list-inside list-disc space-y-1">
            {validationErrors.map((error, index) => (
              <li
                role="button"
                key={index}
                onClick={() => scrollToRow(error.row)}
                className="cursor-pointer transition-colors hover:text-red-800 hover:underline"
              >
                Satır {error.row}: {error.column} - {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DataValidationStep;
