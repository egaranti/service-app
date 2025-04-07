import { Button } from "@egaranti/components";

import React, { useEffect, useRef } from "react";

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

    // İlk hatalı hücreye odaklanma
    useEffect(() => {
      if (
        validation?.firstErrorRef?.current &&
        validation.firstErrorRef.current.rowIndex === index &&
        rowRef.current
      ) {
        // Hatalı hücreyi bul ve odaklan
        const errorCell = rowRef.current.querySelector(
          `[data-column="${validation.firstErrorRef.current.columnKey}"] input`,
        );

        if (errorCell) {
          setTimeout(() => {
            errorCell.focus();
          }, 100);
        }
      }
    }, [index, validation?.firstErrorRef]);

    return (
      <div
        ref={rowRef}
        style={{
          ...style,
          display: "flex",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: index % 2 === 0 ? "#f8fafc" : "white",
        }}
        className="hover:bg-gray-50"
      >
        {Object.keys(columnMapping).map((expectedKey) => (
          <div
            key={expectedKey}
            data-column={expectedKey}
            style={{
              flex: 1,
              padding: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TableCell
              value={item[expectedKey] || ""}
              onChange={handleCellChange}
              expectedKey={expectedKey}
              index={index}
              error={validation?.errors?.[index]?.[expectedKey]}
            />
          </div>
        ))}
        <div style={{ padding: "8px", display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => deleteRow(index)}
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
