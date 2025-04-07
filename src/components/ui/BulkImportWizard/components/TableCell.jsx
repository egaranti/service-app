import React, { useCallback, useEffect, useRef, useState } from "react";

const TableCell = React.memo(
  ({ value, onChange, expectedKey, index, error }) => {
    const [localValue, setLocalValue] = useState(value || "");
    const inputRef = useRef(null);
    const isDirty = useRef(false);

    // Dışarıdan gelen value değiştiğinde local state'i güncelle
    // Ancak bu input aktif olarak düzenlenirken yapılmasın
    useEffect(() => {
      if (document.activeElement !== inputRef.current) {
        setLocalValue(value || "");
      }
    }, [value]);

    const handleChange = useCallback((e) => {
      setLocalValue(e.target.value);
      isDirty.current = true;
    }, []);

    const handleBlur = useCallback(() => {
      if (isDirty.current) {
        onChange(index, expectedKey, localValue);
        isDirty.current = false;
      }
    }, [localValue, onChange, index, expectedKey]);

    // Enter tuşuna basıldığında da değişiklikleri kaydet
    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" && isDirty.current) {
          onChange(index, expectedKey, localValue);
          isDirty.current = false;
        }
      },
      [localValue, onChange, index, expectedKey],
    );

    return (
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
          error
            ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        }`}
        aria-invalid={error ? "true" : "false"}
      />
    );
  },
);

export default TableCell;
