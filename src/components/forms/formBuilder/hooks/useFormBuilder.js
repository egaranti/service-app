import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  DEFAULT_TITLES,
  INITIAL_FOLLOW_UP_FORM,
  INITIAL_FORM,
} from "../constants";
import { createField } from "../fields";

export const useFormBuilder = (initialData) => {
  const [draggedType, setDraggedType] = useState(null);

  const methods = useForm({
    defaultValues: {
      forms: Array.isArray(initialData)
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
        : [INITIAL_FORM],
    },
  });

  const { control } = methods;

  const mainFormArray = useFieldArray({
    control,
    name: "forms.0.fields",
  });

  const followUpFormArray = useFieldArray({
    control,
    name: "forms.1.fields",
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
    methods,
    mainFormArray,
    followUpFormArray,
    draggedType,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  };
};
