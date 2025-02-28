import { Button } from "@egaranti/components";

import { forwardRef, useEffect, useMemo, useState } from "react";

import { fieldRegistry } from "./formBuilder/fields/registry";
import CheckboxFieldRenderer from "./formBuilder/renderers/CheckboxFieldRenderer";
import DateFieldRenderer from "./formBuilder/renderers/DateFieldRenderer";
import EmployeeFieldRenderer from "./formBuilder/renderers/EmployeeFieldRenderer";
import FileFieldRenderer from "./formBuilder/renderers/FileFieldRenderer";
import NumberFieldRenderer from "./formBuilder/renderers/NumberFieldRenderer";
import RadioFieldRenderer from "./formBuilder/renderers/RadioFieldRenderer";
import SelectFieldRenderer from "./formBuilder/renderers/SelectFieldRenderer";
import SparePartFieldRenderer from "./formBuilder/renderers/SparePartFieldRenderer.jsx";
import StatusFieldRenderer from "./formBuilder/renderers/StatusFieldRenderer";
import TextAreaRenderer from "./formBuilder/renderers/TextAreaRenderer";
import TextFieldRenderer from "./formBuilder/renderers/TextFieldRenderer";

const DynamicForm = forwardRef(function DynamicForm(
  {
    fields,
    onSubmit,
    defaultValues,
    isEditing = true,
    className,
    customRenderers,
    validationRules,
    submitButtonProps,
  },
  ref,
) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (defaultValues) {
      setFormData(defaultValues);
    }
  }, [defaultValues]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (validationRules?.[name]) {
      const fieldErrors = validateField(name, value, validationRules[name]);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors }));
    }
  };

  const validateField = (name, value, rules) => {
    const errs = [];
    if (rules.required && !value) {
      errs.push("This field is required");
    }
    if (rules.min && value < rules.min) {
      errs.push(`Value must be at least ${rules.min}`);
    }
    if (rules.max && value > rules.max) {
      errs.push(`Value must be at most ${rules.max}`);
    }
    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      errs.push("Invalid format");
    }
    if (rules.custom) {
      const customError = rules.custom(value, formData);
      if (customError) errs.push(customError);
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let hasErrors = false;

    fields.forEach((field) => {
      if (validationRules?.[field.label]) {
        const fieldErrors = validateField(
          field.label,
          formData[field.label],
          validationRules[field.label],
        );
        if (fieldErrors.length > 0) {
          newErrors[field.label] = fieldErrors;
          hasErrors = true;
        }
      }
    });

    setErrors(newErrors);
    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  const visibleFields = useMemo(() => {
    return fields.filter((field) => !field.showIf || field.showIf(formData));
  }, [fields, formData]);

  const renderFormField = (field) => {
    if (customRenderers?.[field.type]) {
      return customRenderers[field.type]({
        field,
        value: formData[field.label] || "",
        onChange: (value) => handleChange(field.label, value),
        error: errors[field.label],
        disabled: !isEditing,
      });
    }

    const value = formData[field.label] || "";
    const fieldErrors = errors[field.label] || [];
    const isFieldTouched = touched[field.label];

    switch (field.type) {
      case "TEXT":
        return (
          <TextFieldRenderer
            field={field}
            value={value}
            onChange={(val) => handleChange(field.label, val)}
            error={fieldErrors}
            touched={isFieldTouched}
            disabled={!isEditing}
          />
        );
      case "TEXTAREA":
        return (
          <TextAreaRenderer
            field={field}
            value={value}
            onChange={(val) => handleChange(field.label, val)}
            error={fieldErrors}
            touched={isFieldTouched}
            disabled={!isEditing}
          />
        );
      case "CHECKBOX":
        return (
          <CheckboxFieldRenderer
            field={field}
            value={value}
            onChange={(val) => handleChange(field.label, val)}
            error={fieldErrors}
            touched={isFieldTouched}
            disabled={!isEditing}
          />
        );
      case "NUMBER":
        return (
          <NumberFieldRenderer
            field={field}
            value={value}
            onChange={(val) => handleChange(field.label, val)}
            error={fieldErrors}
            touched={isFieldTouched}
            disabled={!isEditing}
          />
        );
      case "DROPDOWN":
        return (
          <SelectFieldRenderer
            field={field}
            value={value}
            onChange={(val) => handleChange(field.label, val)}
            error={fieldErrors}
            touched={isFieldTouched}
            disabled={!isEditing}
          />
        );
      case "STATUS":
        return (
          <StatusFieldRenderer
            field={field}
            value={value}
            onChange={(val) => handleChange(field.label, val)}
            error={fieldErrors}
            touched={isFieldTouched}
            disabled={!isEditing}
          />
        );
      case "EMPLOYEE":
        return (
          <EmployeeFieldRenderer
            field={field}
            value={value}
            onChange={(val) => handleChange(field.label, val)}
            error={fieldErrors}
            touched={isFieldTouched}
            disabled={!isEditing}
          />
        );
      case "RADIO":
        return (
          <RadioFieldRenderer
            field={field}
            value={value}
            onChange={(val) => handleChange(field.label, val)}
            error={fieldErrors}
            touched={isFieldTouched}
            disabled={!isEditing}
          />
        );
      case "DATE":
        return (
          <DateFieldRenderer
            field={field}
            value={value}
            onChange={(val) => handleChange(field.label, val)}
            error={fieldErrors}
            touched={isFieldTouched}
            disabled={!isEditing}
          />
        );
      case "FILE":
        return (
          <FileFieldRenderer
            field={field}
            value={value}
            onChange={(val) => handleChange(field.label, val)}
            error={fieldErrors}
            touched={isFieldTouched}
            disabled={!isEditing}
          />
        );
      case "SPARE_PART":
        return (
          <SparePartFieldRenderer
            field={field}
            value={value}
            onChange={(val) => handleChange(field.label, val)}
            error={fieldErrors}
            touched={isFieldTouched}
            disabled={!isEditing}
            isEditing={isEditing}
          />
        );
      default:
        const registeredField = fieldRegistry.get(field.type);
        if (registeredField?.render) {
          return registeredField.render({
            field,
            value,
            onChange: (val) => handleChange(field.label, val),
            disabled: !isEditing,
            error: fieldErrors,
          });
        }
        return null;
    }
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className={className}>
      {visibleFields.map((field) => renderFormField(field))}
      {isEditing && submitButtonProps && (
        <div className="mt-4">
          <Button type="submit" {...submitButtonProps}>
            {submitButtonProps?.children || "Kaydet"}
          </Button>
        </div>
      )}
    </form>
  );
});

export default DynamicForm;
