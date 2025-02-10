import {
  Button,
  Calendar,
  Checkbox,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@egaranti/components";

import { useEffect, useMemo, useState } from "react";

import { fieldRegistry } from "./formBuilder/fields/registry";

const DynamicForm = ({
  fields,
  onSubmit,
  defaultValues,
  isEditing = true,
  className,
  customRenderers,
  validationRules,
  submitButtonProps,
}) => {
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

    // Validate field
    if (validationRules?.[name]) {
      const fieldErrors = validateField(name, value, validationRules[name]);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors }));
    }
  };

  const validateField = (name, value, rules) => {
    const errors = [];
    if (rules.required && !value) {
      errors.push("This field is required");
    }
    if (rules.min && value < rules.min) {
      errors.push(`Value must be at least ${rules.min}`);
    }
    if (rules.max && value > rules.max) {
      errors.push(`Value must be at most ${rules.max}`);
    }
    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      errors.push("Invalid format");
    }
    if (rules.custom) {
      const customError = rules.custom(value, formData);
      if (customError) errors.push(customError);
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    let hasErrors = false;

    fields.forEach((field) => {
      if (validationRules?.[field.name]) {
        const fieldErrors = validateField(
          field.name,
          formData[field.name],
          validationRules[field.name],
        );
        if (fieldErrors.length > 0) {
          newErrors[field.name] = fieldErrors;
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
    return fields.filter((field) => {
      if (!field.showIf) return true;
      return field.showIf(formData);
    });
  }, [fields, formData]);

  const renderFormField = (field) => {
    // Check if there's a custom renderer for this field
    if (customRenderers?.[field.type]) {
      return customRenderers[field.type]({
        field,
        value: formData[field.name] || "",
        onChange: (value) => handleChange(field.name, value),
        error: errors[field.name],
        disabled: !isEditing,
      });
    }

    const value = formData[field.name] || "";
    const fieldErrors = errors[field.name] || [];
    const isFieldTouched = touched[field.name];

    const commonProps = {
      className: `mb-4 ${fieldErrors.length > 0 ? "error" : ""}`,
    };

    const renderLabel = () => (
      <label className="mb-2 block text-sm font-medium text-gray-900">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </label>
    );

    const renderError = () =>
      isFieldTouched &&
      fieldErrors.length > 0 && (
        <div className="mt-1 text-sm text-red-500">
          {fieldErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      );

    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return (
          <div {...commonProps}>
            {renderLabel()}
            <Input
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              disabled={!isEditing}
            />
            {renderError()}
          </div>
        );

      case "select":
        return (
          <div {...commonProps}>
            {renderLabel()}
            <Select
              value={value}
              onValueChange={(val) => handleChange(field.name, val)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderError()}
          </div>
        );

      case "textarea":
        return (
          <div {...commonProps}>
            {renderLabel()}
            <Textarea
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              disabled={!isEditing}
              rows={4}
            />
            {renderError()}
          </div>
        );

      case "checkbox":
        return (
          <div {...commonProps}>
            <div className="flex items-center">
              <Checkbox
                checked={value}
                onCheckedChange={(checked) => handleChange(field.name, checked)}
                disabled={!isEditing}
              />
              <label className="ml-2 text-sm font-medium text-gray-900">
                {field.label}
              </label>
            </div>
            {renderError()}
          </div>
        );

      case "radio":
        return (
          <div {...commonProps}>
            {renderLabel()}
            <RadioGroup
              value={value}
              onValueChange={(val) => handleChange(field.name, val)}
              disabled={!isEditing}
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <label htmlFor={option.value}>{option.label}</label>
                </div>
              ))}
            </RadioGroup>
            {renderError()}
          </div>
        );

      case "date":
        return (
          <div {...commonProps}>
            {renderLabel()}
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => handleChange(field.name, date)}
              disabled={!isEditing}
            />
            {renderError()}
          </div>
        );

      case "file":
        return (
          <div {...commonProps}>
            {renderLabel()}
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                disabled={!isEditing}
                onClick={() => {
                  // Handle file upload
                }}
              >
                Upload File
              </Button>
            </div>
            {renderError()}
          </div>
        );

      default:
        // Try to get renderer from registry
        const registeredField = fieldRegistry.get(field.type);
        if (registeredField?.render) {
          return registeredField.render({
            field,
            value,
            onChange: (val) => handleChange(field.name, val),
            disabled: !isEditing,
            error: fieldErrors,
          });
        }
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {visibleFields.map((field) => renderFormField(field))}
      {isEditing && submitButtonProps && (
        <div className="mt-4">
          <Button type="submit" {...submitButtonProps} />
        </div>
      )}
    </form>
  );
};

export default DynamicForm;
