import { Input, Label } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

export const TextFieldPreview = ({ field }) => {
  return (
    <BaseField>
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
    <div className="flex flex-col gap-4">
      <Label htmlFor={`placeholder-${field.id}`}>{field.label}</Label>
      <Input
        id={`placeholder-${field.id}`}
        value={field.placeholder}
        onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
      />
    </div>
  );
};
