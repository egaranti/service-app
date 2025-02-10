import { Input, Label, Textarea } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

export const CheckboxFieldPreview = ({ field }) => {
  return (
    <BaseField>
      {field.options?.map((option) => (
        <div className="flex items-center space-x-2">
          <Input
            type="checkbox"
            id={field.id}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor={field.id}>{option}</Label>
        </div>
      ))}
    </BaseField>
  );
};

export const CheckboxFieldEditor = ({ field, onUpdate }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`options-${field.id}`}>
          Seçenekler (bir satır bir seçenek)
        </Label>
        <Textarea
          id={`options-${field.id}`}
          value={field.options?.join("\n") || ""}
          onChange={(e) =>
            onUpdate(field.id, { options: e.target.value.split("\n") })
          }
        />
      </div>
    </div>
  );
};
