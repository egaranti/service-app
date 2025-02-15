import { Input, Label, Textarea } from "@egaranti/components";
import { RadioGroup } from "@egaranti/components";
import { RadioGroupItem } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

import { cn } from "@/lib/utils";

export const RadioFieldPreview = ({ field }) => {
  return (
    <BaseField>
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
              <RadioGroup value={value} onValueChange={() => {}}>
                <RadioGroupItem value={value} id={id} />
              </RadioGroup>
              <Label htmlFor={id}>{label}</Label>
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
    onUpdate(field.id, {
      options: text.split("\n").map((line) => {
        const [label, value] = line.split("|");
        return value ? { label, value } : label;
      }),
    });
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`options-${field.id}`}>
          Seçenekler (Her satırda bir seçenek olacak şekilde giriniz)
        </Label>
        <Textarea
          id={`options-${field.id}`}
          value={optionsText || ""}
          onChange={(e) => handleOptionsChange(e.target.value)}
        />
      </div>
    </div>
  );
};
