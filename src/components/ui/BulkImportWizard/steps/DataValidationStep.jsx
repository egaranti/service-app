import { Button, useToast } from "@egaranti/components";

import React, { useCallback, useMemo, useRef, useState } from "react";
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

  // Hata satırına gitme fonksiyonu
  const scrollToRow = (rowIndex) => {
    if (listRef.current) {
      // Gerçek veri indeksini hesapla (header satırını dikkate alarak)
      const dataIndex = rowIndex - 2; // -2 çünkü row 1-indexed ve header offset var

      if (dataIndex >= 0 && dataIndex < filteredData.length) {
        listRef.current.scrollToItem(dataIndex, "center");
      }
    }
  };

  // Satır silme fonksiyonu
  const deleteRow = (index) => {
    const newData = [...filteredData];
    newData.splice(index, 1);
    setProcessedData(newData);
  };

  // Yeni satır ekleme fonksiyonu
  const addNewRow = () => {
    const emptyRow = {};
    Object.keys(columnMapping).forEach((key) => {
      emptyRow[key] = "";
    });

    setProcessedData([...filteredData, emptyRow]);

    // Yeni eklenen satıra scroll
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollToItem(filteredData.length, "center");
      }
    }, 100);
  };

  // Hücre değişikliği için daha optimize edilmiş fonksiyon
  const handleCellChange = useCallback(
    (index, expectedKey, value) => {
      setProcessedData((prevData) => {
        // Eğer değer aynıysa, state'i değiştirme
        if (prevData[index]?.[expectedKey] === value) {
          return prevData;
        }

        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          [expectedKey]: value,
        };
        return newData;
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

  // Validasyon fonksiyonu
  const validateData = useCallback(() => {
    const errors = {};
    let hasErrors = false;
    let firstErrorRowIndex = -1;
    let firstErrorColumnKey = null;

    filteredData.forEach((row, rowIndex) => {
      expectedColumns.forEach((column) => {
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
          if (!validationRules.pattern.validate(value, column.pattern.regex)) {
            errors[cellKey] =
              column.pattern.message || validationRules.pattern.message();
            hasErrors = true;
            if (firstErrorRowIndex === -1) {
              firstErrorRowIndex = rowIndex;
              firstErrorColumnKey = column.key;
            }
          }
        }
      });
    });

    setCellErrors(errors);

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
      return false;
    }

    return true;
  }, [filteredData, expectedColumns, validationRules]);

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

  return (
    <div className="space-y-6">
      <div className="mb-2 flex items-center justify-between">
        <Button size="sm" onClick={validateData}>
          <AlertCircleIcon className="mr-2 h-4 w-4" />
          Doğrula
        </Button>

        <Button size="sm" variant="secondaryColor" onClick={addNewRow}>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Yeni Satır Ekle
        </Button>
      </div>

      <div ref={tableRef} className="overflow-hidden rounded-md border">
        {/* Tablo başlığı */}
        <div className="flex border-b bg-gray-50 font-medium text-gray-700">
          {Object.keys(columnMapping).map((expectedKey) => (
            <div key={expectedKey} className="flex-1 p-3 text-left">
              {expectedColumns.find((col) => col.key === expectedKey)?.label ||
                expectedKey}
            </div>
          ))}
          <div className="w-12 p-3 text-center">İşlem</div>
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
