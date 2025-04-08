import { Button } from "@egaranti/components";

import React, { useCallback, useEffect, useMemo, useRef } from "react";

import TableCell from "./TableCell";

import { Trash2Icon } from "lucide-react";

const TableRow = React.memo(
  ({
    index,
    style,
    item,
    columnMapping,
    handleCellChange,
    deleteRow,
    validation,
  }) => {
    const rowRef = useRef(null);
    const cellRefs = useRef({});

    // İlk hatalı hücreye odaklanma - useCallback ile optimize edildi
    const focusErrorCell = useCallback(() => {
      if (
        validation?.firstErrorRef?.current &&
        validation.firstErrorRef.current.rowIndex === index
      ) {
        const errorKey = validation.firstErrorRef.current.columnKey;
        const errorCellRef = cellRefs.current[errorKey];

        if (errorCellRef && errorCellRef.current) {
          errorCellRef.current.focus();
        }
      }
    }, [index, validation?.firstErrorRef]);

    // Hata referansı değiştiğinde odaklanma işlemini gerçekleştir
    useEffect(() => {
      if (
        validation?.firstErrorRef?.current &&
        validation.firstErrorRef.current.rowIndex === index
      ) {
        // Mikro görev kuyruğuna ekleyerek DOM güncellemelerinin tamamlanmasını bekle
        requestAnimationFrame(focusErrorCell);
      }
    }, [focusErrorCell, index, validation?.firstErrorRef]);

    // Satır silme işlemi için memoize edilmiş callback
    const handleDeleteRow = useCallback(() => {
      deleteRow(index);
    }, [deleteRow, index]);

    // Satır stilini memoize et
    const rowStyle = useMemo(
      () => ({
        ...style,
        display: "flex",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: index % 2 === 0 ? "#f8fafc" : "white",
      }),
      [style, index],
    );

    // Kolon listesini memoize et
    const columnKeys = useMemo(
      () => Object.keys(columnMapping),
      [columnMapping],
    );

    return (
      <div ref={rowRef} style={rowStyle} className="hover:bg-gray-50">
        {columnKeys.map((expectedKey) => {
          // Her kolon için bir ref oluştur
          if (!cellRefs.current[expectedKey]) {
            cellRefs.current[expectedKey] = React.createRef();
          }

          return (
            <div
              key={expectedKey}
              style={{
                flex: 1,
                maxWidth: "200px",
                padding: "12px 8px",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <TableCell
                ref={cellRefs.current[expectedKey]}
                value={item[expectedKey] || ""}
                onChange={handleCellChange}
                expectedKey={expectedKey}
                index={index}
                error={validation?.errors?.[`${index}-${expectedKey}`]}
              />
            </div>
          );
        })}
        <div
          style={{
            width: "60px",
            padding: "12px 8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handleDeleteRow}
            variant="secondaryColor"
            title="Satırı sil"
            className="flex h-8 w-8 items-center justify-center rounded-md p-0 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  },
);

export default TableRow;
