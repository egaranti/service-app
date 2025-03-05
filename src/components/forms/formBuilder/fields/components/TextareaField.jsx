import { Input, Label, Textarea } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

import PropTypes from "prop-types";

export const TextareaFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <Textarea
        id={field.id}
        placeholder={field.placeholder}
        className="w-full"
      />
    </BaseField>
  );
};

export const TextareaFieldEditor = ({ field, onUpdate }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`placeholder-${field.id}`}>Label</Label>
        <Input
          id={`label-${field.id}`}
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
        <Input
          id={`placeholder-${field.id}`}
          value={field.placeholder}
          onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
        />
      </div>
    </div>
  );
};

TextareaFieldPreview.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
  }).isRequired,
};

TextareaFieldEditor.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
