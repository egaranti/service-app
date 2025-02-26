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

import PropTypes from "prop-types";

export const SpareFieldPreview = ({ field }) => {
  return (
    <BaseField>
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

export const SpareFieldEditor = ({ field, onUpdate }) => {
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

SpareFieldPreview.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
      ]),
    ).isRequired,
  }).isRequired,
};

SpareFieldEditor.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
      ]),
    ).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
