import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

export const SpareFieldEditor = ({ field, onUpdate }) => {};

SpareFieldPreview.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
  }).isRequired,
};

SpareFieldEditor.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
