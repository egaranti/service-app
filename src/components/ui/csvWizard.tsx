import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@egaranti/components";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import React from "react";
import { useDropzone } from "react-dropzone";

import {
  Download,
  FileSpreadsheet,
  Plus,
  PlusIcon,
  Send,
  Trash2,
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface CSVEditorProps {
  onSubmit?: (data: Record<string, any>[]) => void;
  endpoint?: string;
  submitButtonText?: string;
}

// Memoized table row component to prevent unnecessary re-renders
const MemoizedTableRow = memo(
  ({
    row,
    rowIndex,
    headers,
    updateCell,
    removeRow,
  }: {
    row: Record<string, any>;
    rowIndex: number;
    headers: string[];
    updateCell: (rowIndex: number, header: string, value: string) => void;
    removeRow: (index: number) => void;
  }) => {
    return (
      <TableRow>
        {headers.map((header) => (
          <TableCell key={`${rowIndex}-${header}`}>
            <Input
              value={row[header] || ""}
              onChange={(e) => updateCell(rowIndex, header, e.target.value)}
              className="min-w-[100px]"
            />
          </TableCell>
        ))}
        <TableCell>
          <Button
            variant="secondaryGray"
            size="icon"
            onClick={() => removeRow(rowIndex)}
            className="h-8 w-8 text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    );
  },
);

// Add display name for React DevTools
MemoizedTableRow.displayName = "MemoizedTableRow";

export default function CSVEditor({
  onSubmit,
  endpoint,
  submitButtonText = "Gönder",
}: CSVEditorProps) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use a ref to track if we're in the middle of a batch update
  const batchUpdateRef = useRef(false);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const result = event.target?.result;

      if (typeof result === "string") {
        if (file.name.endsWith(".csv")) {
          // Parse CSV
          Papa.parse(result, {
            header: true,
            complete: (results) => {
              if (results.data && results.data.length > 0) {
                const data = results.data as Record<string, any>[];
                setHeaders(Object.keys(data[0]));
                setRows(data);
              }
            },
          });
        } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
          // Parse Excel
          const workbook = XLSX.read(result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet) as Record<
            string,
            any
          >[];

          if (data.length > 0) {
            setHeaders(Object.keys(data[0]));
            setRows(data);
          }
        }
      }
    };

    if (file.name.endsWith(".csv")) {
      fileReader.readAsText(file);
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      fileReader.readAsBinaryString(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  // Start with empty table
  const startEmpty = useCallback(() => {
    // Define two specific features with default headers
    setHeaders(["ad_soyad", "telefon"]);
    setRows([{ ad_soyad: "", telefon: "" }]);
  }, []);

  // Add new row - optimized to use functional updates
  const addRow = useCallback(() => {
    setRows((prevRows) => {
      const newRow: Record<string, any> = {};
      headers.forEach((header) => {
        newRow[header] = "";
      });
      return [...prevRows, newRow];
    });
  }, [headers]);

  // Add new column - optimized to use functional updates
  const addColumn = useCallback(() => {
    const newHeader = `column${headers.length + 1}`;

    setHeaders((prevHeaders) => [...prevHeaders, newHeader]);

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        [newHeader]: "",
      })),
    );
  }, [headers.length]);

  // Remove row - optimized for performance
  const removeRow = useCallback((index: number) => {
    // Use functional update to avoid stale state issues
    setRows((prevRows) => {
      // Create a new array without the row at the specified index
      // This is more efficient than splice which mutates the array
      return [...prevRows.slice(0, index), ...prevRows.slice(index + 1)];
    });
  }, []);

  // Update cell value - optimized with debounce for better performance
  const updateCell = useCallback(
    (rowIndex: number, header: string, value: string) => {
      setRows((prevRows) => {
        // Create a new array with the updated row
        const newRows = [...prevRows];
        // Create a new object for the updated row to maintain immutability
        newRows[rowIndex] = {
          ...newRows[rowIndex],
          [header]: value,
        };
        return newRows;
      });
    },
    [],
  );

  // Update header value - optimized
  const updateHeader = useCallback(
    (oldHeader: string, newHeader: string) => {
      if (newHeader.trim() === "") return;

      const headerIndex = headers.indexOf(oldHeader);
      if (headerIndex === -1) return;

      // Batch updates to reduce renders
      batchUpdateRef.current = true;

      setHeaders((prevHeaders) => {
        const updatedHeaders = [...prevHeaders];
        updatedHeaders[headerIndex] = newHeader;
        return updatedHeaders;
      });

      setRows((prevRows) => {
        return prevRows.map((row) => {
          const newRow: Record<string, any> = {};
          Object.keys(row).forEach((key) => {
            if (key === oldHeader) {
              newRow[newHeader] = row[key];
            } else {
              newRow[key] = row[key];
            }
          });
          return newRow;
        });
      });

      // End batch updates
      batchUpdateRef.current = false;
    },
    [headers],
  );

  // Submit data
  const handleSubmit = useCallback(async () => {
    if (rows.length === 0) return;

    if (onSubmit) {
      onSubmit(rows);
      return;
    }

    if (endpoint) {
      setIsLoading(true);
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rows),
        });

        if (!response.ok) {
          throw new Error("Failed to submit data");
        }

        alert("Data submitted successfully");
      } catch (error) {
        console.error("Error submitting data:", error);
        alert("Failed to submit data");
      } finally {
        setIsLoading(false);
      }
    }
  }, [rows, onSubmit, endpoint]);

  // Export as JSON
  const exportJSON = useCallback(() => {
    if (rows.length === 0) return;

    const jsonString = JSON.stringify(rows, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [rows]);

  // Memoize the table headers to prevent unnecessary re-renders
  const tableHeaders = useMemo(
    () => (
      <TableRow>
        {headers.map((header, index) => (
          <TableHead key={index}>
            <Input
              value={header}
              onChange={(e) => updateHeader(header, e.target.value)}
              className="min-w-[100px] font-medium"
            />
          </TableHead>
        ))}
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    ),
    [headers, updateHeader],
  );

  // Virtualized rendering for large datasets
  // Only render rows that are likely to be visible
  const visibleRows = useMemo(() => {
    // For very large datasets, we could implement windowing here
    // For now, we'll just return all rows since we're using memoization
    return rows;
  }, [rows]);

  return (
    <div className="w-full space-y-4">
      {/* File upload area */}
      {rows.length === 0 && (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "hover:border-primary/50 border-gray-300"
            }`}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? "Dosyayı buraya bırakın"
                : "CSV veya Excel dosyasını sürükleyip bırakın veya tıklayın"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Desteklenen formatlar: .csv, .xlsx, .xls
            </p>
          </div>

          <div className="text-center">
            <Button variant="secondaryGray" onClick={startEmpty}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Boş tablo ile başla
            </Button>
          </div>
        </div>
      )}

      {/* Table editor */}
      {rows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Tablo Düzenleyici</h2>
            <div className="flex gap-2">
              <Button variant="secondaryGray" size="sm" onClick={addColumn}>
                <Plus className="mr-2 h-4 w-4" />
                Sütun Ekle
              </Button>
              <Button variant="secondaryGray" size="sm" onClick={addRow}>
                <Plus className="mr-2 h-4 w-4" />
                Satır Ekle
              </Button>
              <Button variant="secondaryGray" size="sm" onClick={exportJSON}>
                <Download className="mr-2 h-4 w-4" />
                JSON İndir
              </Button>
            </div>
          </div>

          <div className="max-h-[500px] overflow-auto rounded-md border">
            <Table>
              <TableHeader>{tableHeaders}</TableHeader>
              <TableBody>
                {visibleRows.map((row, rowIndex) => (
                  <MemoizedTableRow
                    key={rowIndex}
                    row={row}
                    rowIndex={rowIndex}
                    headers={headers}
                    updateCell={updateCell}
                    removeRow={removeRow}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || rows.length === 0}
              className="gap-2"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submitButtonText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
