import { SelectTrigger } from "@egaranti/components";
import { SelectItem } from "@egaranti/components";
import { Label } from "@egaranti/components";
import { SelectContent } from "@egaranti/components";
import { Select } from "@egaranti/components";

import React, { memo } from "react";

const ColumnMappingStep = ({
  expectedColumns,
  headers,
  columnMapping,
  updateColumnMapping,
  previewData,
  selectedHeaderIndex,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        <span className="font-semibold">*</span> işaretli alanlar zorunludur.
      </p>

      <div className="space-y-4">
        {expectedColumns.map((column) => (
          <div key={column.key} className="grid grid-cols-2 items-center gap-6">
            <Label>
              {column.label}
              {column.required && <span className="ml-1 text-red-500">*</span>}
            </Label>

            <Select
              value={columnMapping[column.key] || "Seçiniz"}
              onValueChange={(value) => updateColumnMapping(column.key, value)}
              className="w-full"
            >
              <SelectTrigger className="w-full">
                <span className="text-sm">
                  {columnMapping[column.key] || "Sütun seçin"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {headers.map((header, index) => (
                  <SelectItem key={index} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {headers.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium">Önizleme</h3>
          <div className="overflow-x-auto rounded-md border">
            {/* Tablo başlığı */}
            <div className="flex border-b bg-gray-50 font-medium text-gray-700">
              {headers.map((header, index) => (
                <div key={index} className="flex-1 p-3 text-left">
                  {header}
                </div>
              ))}
            </div>

            {/* Tablo içeriği */}
            <div>
              {previewData
                .slice(selectedHeaderIndex + 1, selectedHeaderIndex + 3)
                .map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex border-b last:border-b-0"
                    style={{
                      backgroundColor: rowIndex % 2 === 0 ? "#f8fafc" : "white",
                    }}
                  >
                    {row.map((cell, cellIndex) => (
                      <div key={cellIndex} className="flex-1 p-3 text-sm">
                        {cell || "-"}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ColumnMappingStep);
