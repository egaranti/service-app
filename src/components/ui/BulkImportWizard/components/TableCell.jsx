import React, { useCallback, useEffect, useRef, useState } from "react";

import { useDebouncedCallback } from "use-debounce";

// forwardRef kullanarak ref'i alt bileşene aktarma
const TableCell = React.memo(
  React.forwardRef(({ value, onChange, expectedKey, index, error }, ref) => {
    // Dışarıdan gelen ref veya yeni bir ref oluştur
    const inputRef = ref || useRef(null);
    // Değerin değişip değişmediğini takip etmek için ref
    const previousValueRef = useRef(value || "");
    // Aktif düzenleme durumunu takip etmek için ref
    const isEditingRef = useRef(false);

    // Debounce ile değişiklikleri geciktirerek performansı artırma
    const debouncedOnChange = useDebouncedCallback(
      (newValue) => {
        // Değer gerçekten değiştiyse ve boş değilse onChange'i çağır
        if (newValue !== previousValueRef.current) {
          onChange(index, expectedKey, newValue);
          previousValueRef.current = newValue;
        }
      },
      1500, // 300ms gecikme
    );

    // Dışarıdan gelen value değiştiğinde input değerini güncelle
    // Ancak bu input aktif olarak düzenlenirken yapılmasın
    useEffect(() => {
      if (!isEditingRef.current && inputRef.current) {
        inputRef.current.value = value || "";
        previousValueRef.current = value || "";
      }
    }, [value]);

    const handleChange = useCallback(
      (e) => {
        const newValue = e.target.value;
        isEditingRef.current = true;
        debouncedOnChange(newValue);
      },
      [debouncedOnChange],
    );

    const handleBlur = useCallback(() => {
      isEditingRef.current = false;
      // Son değişikliği hemen uygula
      debouncedOnChange.flush();
    }, [debouncedOnChange]);

    // Enter tuşuna basıldığında da değişiklikleri hemen kaydet
    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter") {
          isEditingRef.current = false;
          debouncedOnChange.flush();
        }
      },
      [debouncedOnChange],
    );

    return (
      <input
        ref={inputRef}
        type="text"
        defaultValue={value || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        className={`rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-1 ${
          error
            ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        }`}
        aria-invalid={error ? "true" : "false"}
        title={error || ""}
      />
    );
  }),
);

export default TableCell;
