import { Input, Label } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

export const CheckboxFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <Label>{field.label}</Label>
      <div className="flex items-center space-x-2">
        <Input
          type="checkbox"
          id={field.id}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor={field.id}>
          {field.placeholder || "Check this box"}
        </Label>
      </div>
    </BaseField>
  );
};

export const CheckboxFieldEditor = ({ field, onUpdate }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`placeholder-${field.id}`}>Checkbox Label</Label>
        <Input
          id={`placeholder-${field.id}`}
          value={field.placeholder}
          onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
        />
      </div>
    </div>
  );
};
