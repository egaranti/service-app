import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

export const SelectFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <Label htmlFor={field.id}>{field.label}</Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BaseField>
  );
};

export const SelectFieldEditor = ({ field, onUpdate }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
        <Input
          id={`placeholder-${field.id}`}
          value={field.placeholder}
          onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
          className="w-full"
        />
      </div>
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
