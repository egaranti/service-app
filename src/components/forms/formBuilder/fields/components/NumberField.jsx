import { Input, Label } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

export const NumberFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <Input
        type="number"
        id={field.id}
        placeholder={field.placeholder}
        min={field.validation?.min}
        max={field.validation?.max}
        className="w-full"
      />
    </BaseField>
  );
};

export const NumberFieldEditor = ({ field, onUpdate }) => {
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
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`min-${field.id}`}>Min Value</Label>
          <Input
            id={`min-${field.id}`}
            type="number"
            value={field.validation?.min || ""}
            onChange={(e) =>
              onUpdate(field.id, {
                validation: {
                  ...field.validation,
                  min: e.target.value ? Number(e.target.value) : undefined,
                },
              })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`max-${field.id}`}>Max Value</Label>
          <Input
            id={`max-${field.id}`}
            type="number"
            value={field.validation?.max || ""}
            onChange={(e) =>
              onUpdate(field.id, {
                validation: {
                  ...field.validation,
                  max: e.target.value ? Number(e.target.value) : undefined,
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
