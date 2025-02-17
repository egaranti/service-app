import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { DEFAULT_TITLES, INITIAL_FORM } from "../constants";
import { createField } from "../fields";

export const useFormBuilder = (initialData) => {
  const [draggedType, setDraggedType] = useState(null);

  // Extract default form values into a separate variable for better readability
  const defaultForms = Array.isArray(initialData)
    ? initialData.map((form) => ({
        id: form.id,
        orderKey: form.orderKey,
        title:
          form.title ||
          (form.parentFormId
            ? DEFAULT_TITLES.FOLLOW_UP_FORM
            : DEFAULT_TITLES.MAIN_FORM),
        parentFormId: form.parentFormId,
        fields: form.fields || [],
      }))
    : [INITIAL_FORM];

  const formMethods = useForm({
    defaultValues: { forms: defaultForms },
  });

  const { control } = formMethods;

  // Add comments to clarify the purpose of the field arrays
  const mainFormArray = useFieldArray({
    control,
    name: "forms.0.fields", // Accessing the fields of the first form
  });

  const followUpFormArray = useFieldArray({
    control,
    name: "forms.1.fields", // Accessing the fields of the second form
  });

  const handleDragStart = (type) => setDraggedType(type);
  const handleDragEnd = () => setDraggedType(null);

  const handleDrop = (e, isFollowUpTarget) => {
    e.preventDefault();
    if (!draggedType) return;

    const newField = createField(draggedType);
    if (newField) {
      if (isFollowUpTarget) {
        followUpFormArray.append(newField);
      } else {
        mainFormArray.append(newField);
      }
    }
    setDraggedType(null);
  };

  return {
    formMethods,
    mainFormArray,
    followUpFormArray,
    draggedType,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  };
};
