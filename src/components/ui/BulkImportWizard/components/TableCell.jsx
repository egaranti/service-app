import React, { useCallback, useEffect, useRef, useState } from "react";

// Debounce kaldırıldı, yerine daha iyi UX için batch update yaklaşımı kullanıldı
const TableCell = React.memo(
  React.forwardRef(({ value, onChange, expectedKey, index, error }, ref) => {
    // Dışarıdan gelen ref veya yeni bir ref oluştur
    const inputRef = ref || useRef(null);
    // Controlled input için state
    const [inputValue, setInputValue] = useState(value || "");
    // Değerin değişip değişmediğini takip etmek için ref
    const previousValueRef = useRef(value || "");
    // Aktif düzenleme durumunu takip etmek için ref
    const isEditingRef = useRef(false);
    // Değişiklik yapıldı mı?
    const isDirtyRef = useRef(false);

    // Dışarıdan gelen value değiştiğinde input değerini güncelle
    // Ancak bu input aktif olarak düzenlenirken yapılmasın
    useEffect(() => {
      if (!isEditingRef.current && !isDirtyRef.current) {
        setInputValue(value || "");
        previousValueRef.current = value || "";
      }
    }, [value]);

    // Kullanıcı input'a her yazdığında çalışır - anında görsel geri bildirim
    const handleChange = useCallback((e) => {
      const newValue = e.target.value;
      isEditingRef.current = true;
      isDirtyRef.current = true;
      setInputValue(newValue); // Anında görsel geri bildirim için state'i güncelle
    }, []);

    // Değişiklikleri kaydet - sadece blur veya Enter tuşunda çağrılır
    const saveChanges = useCallback(() => {
      isEditingRef.current = false;

      // Değer gerçekten değiştiyse ve önceki değerden farklıysa onChange'i çağır
      if (inputValue !== previousValueRef.current) {
        onChange(index, expectedKey, inputValue);
        previousValueRef.current = inputValue;
      }

      // Değişiklik yapıldı bayrağını sıfırla
      isDirtyRef.current = false;
    }, [inputValue, onChange, index, expectedKey]);

    const handleBlur = useCallback(() => {
      saveChanges();
    }, [saveChanges]);

    // Enter tuşuna basıldığında da değişiklikleri hemen kaydet
    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          saveChanges();
          // Bir sonraki input'a geç
          const form = inputRef.current.form;
          if (form) {
            const inputs = Array.from(form.elements);
            const currentIndex = inputs.indexOf(inputRef.current);
            const nextInput = inputs[currentIndex + 1];
            if (nextInput) {
              nextInput.focus();
            }
          }
        }
      },
      [saveChanges],
    );

    return (
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
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
            : isDirtyRef.current
              ? "border-yellow-300 bg-yellow-50 focus:border-yellow-500 focus:ring-yellow-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        }`}
        aria-invalid={error ? "true" : "false"}
        title={error || ""}
      />
    );
  }),
);

export default TableCell;
