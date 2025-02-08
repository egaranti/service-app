import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tag,
} from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

// Helper function to determine if a color is light
const isLightColor = (color) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

export const StatusFieldPreview = ({ field }) => {
  return (
    <BaseField field={field}>
      <div className="w-full">
        <Select defaultValue={field.options?.[0]?.label}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={field.placeholder || "Select status"} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.label} value={option.label}>
                <Tag
                  className="px-2 py-1"
                  style={{
                    backgroundColor: option.color,
                    color: isLightColor(option.color) ? "#000" : "#fff",
                  }}
                >
                  {option.label}
                </Tag>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </BaseField>
  );
};

export const StatusFieldEditor = ({ field, onUpdate }) => {
  return (
    <div className="grid gap-4">
      <Label>Status Options</Label>
      {field.options?.map((option, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={option.label}
            onChange={(e) => {
              const newOptions = [...field.options];
              newOptions[index] = { ...option, label: e.target.value };
              onUpdate(field.id, { options: newOptions });
            }}
            placeholder="Status Label"
          />
          <Input
            type="color"
            value={option.color}
            className="h-8 w-8 cursor-pointer rounded"
            onChange={(e) => {
              const newOptions = [...field.options];
              newOptions[index] = { ...option, color: e.target.value };
              onUpdate(field.id, { options: newOptions });
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newOptions = field.options.filter((_, i) => i !== index);
              onUpdate(field.id, { options: newOptions });
            }}
          >
            ×
          </Button>
        </div>
      ))}
      <Button
        onClick={() => {
          const newOptions = [...(field.options || [])];
          newOptions.push({ label: "", color: "#000000" });
          onUpdate(field.id, { options: newOptions });
        }}
        variant="outline"
      >
        Add Status Option
      </Button>
    </div>
  );
};
