import { Label, Textarea } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

export const RadioFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <Label>{field.label}</Label>
      <div className="space-y-2">
        {field.options?.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Input
              type="radio"
              name={field.id}
              id={`${field.id}-${option}`}
              value={option}
            />
            <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
          </div>
        ))}
      </div>
    </BaseField>
  );
};

export const RadioFieldEditor = ({ field, onUpdate }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`options-${field.id}`}>Options (one per line)</Label>
        <Textarea
          id={`options-${field.id}`}
          value={field.options?.join("\n") || ""}
          onChange={(e) =>
            onUpdate(field.id, {
              options: e.target.value.split("\n").filter(Boolean),
            })
          }
        />
      </div>
    </div>
  );
};
