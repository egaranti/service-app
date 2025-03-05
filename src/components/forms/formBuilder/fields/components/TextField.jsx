import { Input, Label } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

import PropTypes from "prop-types";

export const TextFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <Input
        type="text"
        id={field.id}
        placeholder={field.placeholder}
        className="w-full"
      />
    </BaseField>
  );
};

export const TextFieldEditor = ({ field, onUpdate }) => {
  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor={`label-${field.id}`}>Label</Label>
      <Input
        id={`label-${field.id}`}
        value={field.label}
        onChange={(e) => onUpdate(field.id, { label: e.target.value })}
      />
      <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
      <Input
        id={`placeholder-${field.id}`}
        value={field.placeholder}
        onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
      />
    </div>
  );
};

TextFieldPreview.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
  }).isRequired,
};

TextFieldEditor.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
