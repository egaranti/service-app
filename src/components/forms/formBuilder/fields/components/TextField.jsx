import { Input, Label } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

export const TextFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <Label htmlFor={field.id}>{field.label}</Label>
      <Input
        type="text"
        id={field.id}
        placeholder={field.placeholder}
        className="w-full"
      />
    </BaseField>
  );
};

export const TextFieldEditor = ({ field, onUpdate }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
        <Input
          id={`placeholder-${field.id}`}
          value={field.placeholder}
          onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
        />
      </div>
    </div>
  );
};
