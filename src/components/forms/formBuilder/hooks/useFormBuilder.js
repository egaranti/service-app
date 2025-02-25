import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { DEFAULT_TITLES, INITIAL_FORM } from "../constants";
import { validateFieldAddition } from "../constants/fieldRules";
import { createField } from "../fields";

export const useFormBuilder = (initialData) => {
  const [draggedType, setDraggedType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  // Extract default form values into a separate variable for better readability
  const defaultForms = Array.isArray(initialData)
    ? initialData.map((form) => ({
        orderKey: form.orderKey,
        title:
          form.title ||
          (form.parentFormId
            ? DEFAULT_TITLES.FOLLOW_UP_FORM
            : DEFAULT_TITLES.MAIN_FORM),

        fields: form.fields || [],
      }))
    : [INITIAL_FORM];

  const methods = useForm({
    defaultValues: { forms: defaultForms },
  });

  const { control, watch } = methods;

  // Add comments to clarify the purpose of the field arrays
  const mainFormArray = useFieldArray({
    control,
    name: "forms.0.fields", // Accessing the fields of the first form
  });

  const followUpFormArray = useFieldArray({
    control,
    name: "forms.1.fields", // Accessing the fields of the second form
  });

  // Get current fields for validation
  const mainFormFields = watch("forms.0.fields") || [];
  const followUpFormFields = watch("forms.1.fields") || [];

  const handleDragStart = (type) => setDraggedType(type);
  const handleDragEnd = () => setDraggedType(null);

  const handleDrop = (e, isFollowUpTarget) => {
    e.preventDefault();
    if (!draggedType) return;

    // Clear any previous error message
    setErrorMessage(null);
    setShowErrorBanner(false);

    // Get the current fields in the target form
    const currentFields = isFollowUpTarget
      ? followUpFormFields
      : mainFormFields;

    // Validate field addition based on rules
    const validation = validateFieldAddition(draggedType, currentFields);

    if (!validation.valid) {
      setErrorMessage(validation.message);
      setShowErrorBanner(true);
      setDraggedType(null);
      return;
    }

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

  // Removed renderErrorBanner function

  return {
    methods,
    mainFormArray,
    followUpFormArray,
    draggedType,
    errorMessage,
    showErrorBanner,
    setErrorMessage,
    setShowErrorBanner,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  };
};
