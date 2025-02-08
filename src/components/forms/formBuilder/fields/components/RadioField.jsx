import { Input, Label, Textarea } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

import { cn } from "@/lib/utils";

export const RadioFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <Label className="mb-4 block text-base">{field.label}</Label>
      <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
        {field.options?.map((option) => {
          const value = typeof option === "object" ? option.value : option;
          const label = typeof option === "object" ? option.label : option;
          const id = `${field.id}-${value}`;

          return (
            <div
              key={value}
              className="flex w-full flex-col items-center justify-center"
            >
              <input
                type="radio"
                name={field.id}
                id={id}
                value={value}
                className="peer hidden"
              />
              <label
                htmlFor={id}
                className={cn(
                  "flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 text-center transition-all hover:bg-gray-50",
                  "peer-checked:border-primary peer-checked:bg-primary/5",
                )}
              >
                <span className="text-sm font-medium">{label}</span>
              </label>
            </div>
          );
        })}
      </div>
    </BaseField>
  );
};

export const RadioFieldEditor = ({ field, onUpdate }) => {
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
