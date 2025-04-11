import { Button, useToast } from "@egaranti/components";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { memo } from "react";
import { FixedSizeList as List } from "react-window";

import TableRow from "../components/TableRow";

import {
  AlertCircleIcon,
  CheckCircleIcon,
  LoaderIcon,
  PlusCircleIcon,
} from "lucide-react";

const DataValidationStep = ({
  tableRef,
  tableWidth,
  columnMapping,
  expectedColumns,
  filteredData,
  validationErrors,
  validationProgress = 0,
  firstErrorInfo = null,
  isProcessing = false,
  isSubmitting = false,
  onSubmit,
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

  // İlk hataya referans
  const firstErrorRef = useRef(null);

  // Validasyon hatalarını işle - useMemo ile optimize edildi
  const processedErrors = useMemo(() => {
    const errorMap = {};
    let firstError = null;

    // Validasyon hatalarını satır ve kolon bazında grupla
    validationErrors.forEach((error) => {
      const rowIndex = error.row - 2; // -2 çünkü row 1-indexed ve header offset var
      const key = `${rowIndex}-${error.column}`;

      errorMap[key] = {
        message: error.message,
        patternError: error.patternError || false,
      };

      // İlk hatayı kaydet
      if (!firstError) {
        firstError = {
          rowIndex,
          columnKey: error.column,
          message: error.message,
        };
      }
    });

    // İlk hata referansını güncelle
    firstErrorRef.current = firstError;

    return { errors: errorMap, firstError };
  }, [validationErrors]);

  // Hata mesajlarını göster - useCallback ile optimize edildi
  const showErrorToasts = useCallback(() => {
    // Sadece pattern hatalarını göster (diğer hatalar inline gösteriliyor)
    validationErrors.forEach((error) => {
      if (error.patternError) {
        const errorKey = `${error.row}-${error.column}`;

        // Bu hatayı daha önce göstermediyse göster
        if (!shownPatternErrorsRef.current.has(errorKey)) {
          shownPatternErrorsRef.current.add(errorKey);

          toast({
            title: "Format Hatası",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    });
  }, [validationErrors, toast]);

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
    const newRow = {};
    Object.keys(columnMapping).forEach((key) => {
      newRow[key] = "";
    });

    setProcessedData((prev) => [...prev, newRow]);

    // Yeni eklenen satıra kaydır
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollToItem(filteredData.length);
      }
    }, 0);
  }, [columnMapping, filteredData.length, setProcessedData]);

  // Optimize itemData to prevent unnecessary re-renders
  const itemData = useMemo(() => {
    return {
      items: filteredData,
      columnMapping,
      handleCellChange,
      deleteRow,
      validation: {
        errors: processedErrors.errors,
        firstErrorRef,
      },
    };
  }, [
    filteredData,
    columnMapping,
    handleCellChange,
    deleteRow,
    processedErrors.errors,
  ]);

  return (
    <div className="flex flex-col">
      {/* Validation Progress */}
      {isProcessing && (
        <div className="mb-4 flex items-center justify-center rounded-md bg-blue-50 p-4">
          <LoaderIcon className="mr-2 h-5 w-5 animate-spin text-blue-500" />
          <div>
            <p className="text-sm font-medium text-blue-700">
              Veriler doğrulanıyor... {validationProgress}%
            </p>
          </div>
        </div>
      )}

      {/* Validation Errors Summary */}
      {validationErrors.length > 0 && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex items-start">
            <AlertCircleIcon className="mr-2 mt-0.5 h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Toplamda {validationErrors.length} hata bulundu
              </p>
              <p className="mt-1 text-sm text-red-700">
                {firstErrorInfo ? (
                  <>
                    İlk hata: Satır {firstErrorInfo.row}, "
                    {expectedColumns.find(
                      (col) => col.key === firstErrorInfo.column,
                    )?.label || firstErrorInfo.column}
                    " alanında: {firstErrorInfo.message}
                  </>
                ) : (
                  "Lütfen aşağıdaki hataları düzeltip tekrar deneyin."
                )}
              </p>
              <div className="mt-2">
                <button
                  onClick={() =>
                    listRef.current.scrollToItem(firstErrorInfo.row - 2)
                  }
                  className="text-xs font-medium text-red-500 underline hover:font-semibold"
                >
                  İlk Hataya Git
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message when validation complete with no errors */}
      {validationProgress === 100 &&
        validationErrors.length === 0 &&
        filteredData.length > 0 && (
          <div className="mb-4 rounded-md bg-green-50 p-4">
            <div className="flex items-start">
              <CheckCircleIcon className="mr-2 mt-0.5 h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Doğrulama başarılı
                </p>
                <p className="mt-1 text-sm text-green-700">
                  {filteredData.length} satır başarıyla doğrulandı.
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Table Header */}
      <div
        ref={tableRef}
        className="flex border-b border-gray-200 bg-gray-100 text-sm font-medium"
      >
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

      {/* Table Body - Virtualized List */}
      <div style={{ height: LIST_HEIGHT }}>
        {filteredData.length > 0 ? (
          <List
            ref={listRef}
            height={LIST_HEIGHT}
            itemCount={filteredData.length}
            itemSize={ROW_HEIGHT}
            itemData={itemData}
            width="100%"
          >
            {({ index, style, data }) => (
              <TableRow
                key={`row-${index}`}
                index={index}
                style={style}
                item={data.items[index]}
                columnMapping={data.columnMapping}
                handleCellChange={data.handleCellChange}
                deleteRow={data.deleteRow}
                validation={data.validation}
              />
            )}
          </List>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Veri bulunmamaktadır. Yeni satır ekleyebilirsiniz.
          </div>
        )}
      </div>

      {/* Table Footer */}
      <div className="mt-4 flex items-center justify-between">
        <Button
          onClick={addNewRow}
          variant="secondaryColor"
          className="flex items-center gap-1"
        >
          <PlusCircleIcon className="h-4 w-4" />
          Yeni Satır Ekle
        </Button>
      </div>
    </div>
  );
};

export default memo(DataValidationStep);
