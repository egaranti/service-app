import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { DEFAULT_TITLES, INITIAL_FORM } from "../constants";
import { validateFieldAddition } from "../constants/fieldRules";
import { createField } from "../fields";

export const useFormBuilder = (initialData) => {
  const [draggedType, setDraggedType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  // Convert initialData to a standardized format
  const defaultForms = Array.isArray(initialData)
    ? initialData.map((form, index) => ({
        orderKey: form.orderKey || index,
        title:
          form.title ||
          (index === 0
            ? DEFAULT_TITLES.MAIN_FORM
            : DEFAULT_TITLES.FOLLOW_UP_FORM),
        fields: form.fields || [],
        parentFormId: form.parentFormId || null,
      }))
    : [INITIAL_FORM];

  const methods = useForm({
    defaultValues: { forms: defaultForms },
  });

  const handleDragStart = (type) => setDraggedType(type);
  const handleDragEnd = () => setDraggedType(null);

  return {
    methods,
    draggedType,
    errorMessage,
    showErrorBanner,
    setErrorMessage,
    setShowErrorBanner,
    handleDragStart,
    handleDragEnd,
  };
};
