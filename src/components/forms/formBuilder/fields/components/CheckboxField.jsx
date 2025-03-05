import { Checkbox, Input, Label, Textarea } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

export const CheckboxFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <div className="space-y-2">
        {field.options?.map((option, index) => (
          <div key={index} className="flex items-center">
            <Checkbox disabled />
            <label className="ml-2 text-sm font-medium text-gray-900">
              {option}
            </label>
          </div>
        ))}
      </div>
    </BaseField>
  );
};

export const CheckboxFieldEditor = ({ field, onUpdate }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`label-${field.id}`}>Label</Label>
        <Input
          id={`label-${field.id}`}
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`options-${field.id}`}>
          Seçenekler (bir satır bir seçenek)
        </Label>
        <Textarea
          id={`options-${field.id}`}
          value={field.options?.join("\n") || ""}
          onChange={(e) => {
            const options = e.target.value
              .split("\n")
              .map((option) => option.trim());
            onUpdate(field.id, { options });
          }}
          placeholder="Seçenek 1&#13;Seçenek 2&#13;Seçenek 3"
        />
      </div>
    </div>
  );
};
