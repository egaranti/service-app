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
            <SelectItem
              key={typeof option === "object" ? option.value : option}
              value={typeof option === "object" ? option.value : option}
            >
              {typeof option === "object" ? option.label : option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BaseField>
  );
};

export const SelectFieldEditor = ({ field, onUpdate }) => {
  const optionsText = field.options
    ?.map((option) => {
      if (typeof option === "object") {
        return `${option.label}|${option.value}`;
      }
      return option;
    })
    .join("\n");

  const handleOptionsChange = (text) => {
    const options = text
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [label, value] = line.split("|");
        if (value) {
          return { label: label.trim(), value: value.trim() };
        }
        return line.trim();
      });

    onUpdate(field.id, { options });
  };

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
        <Label htmlFor={`options-${field.id}`}>
          Options (one per line, format: label|value)
        </Label>
        <Textarea
          id={`options-${field.id}`}
          value={optionsText || ""}
          onChange={(e) => handleOptionsChange(e.target.value)}
          placeholder="Option 1|value1\nOption 2|value2"
        />
      </div>
    </div>
  );
};
