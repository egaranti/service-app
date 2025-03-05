import { Input, Label } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

import PropTypes from "prop-types";

export const DateFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <Input
        type="date"
        id={field.id}
        placeholder={field.placeholder}
        className="w-full"
      />
    </BaseField>
  );
};

export const DateFieldEditor = ({ field, onUpdate }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="grid gap-2">
          <Label htmlFor={`label-${field.id}`}>Label</Label>
          <Input
            id={`label-${field.id}`}
            value={field.label}
            onChange={(e) => onUpdate(field.id, { label: e.target.value })}
          />
        </div>
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

DateFieldPreview.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
  }).isRequired,
};

DateFieldEditor.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
