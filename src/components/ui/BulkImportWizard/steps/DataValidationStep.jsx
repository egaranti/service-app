import { Button } from "@egaranti/components";

import React, { useCallback, useMemo, useRef } from "react";
import { FixedSizeList as List } from "react-window";

import TableRow from "../components/TableRow";

import { PlusCircleIcon } from "lucide-react";

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

  // List için gerekli itemData'yı memoize et
  const itemData = useMemo(
    () => ({
      filteredData,
      columnMapping,
      handleCellChange,
      deleteRow,
    }),
    [filteredData, columnMapping, handleCellChange, deleteRow],
  );

  return (
    <div className="space-y-6">
      <div className="mb-2 flex justify-end">
        <Button size="sm" variant="secondaryColor" onClick={addNewRow}>
          <PlusCircleIcon className="h-4 w-4" />
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
