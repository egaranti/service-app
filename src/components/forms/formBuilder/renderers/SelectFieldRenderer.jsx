import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import React from "react";

import BaseFieldRenderer from "./BaseFieldRenderer";

import PropTypes from "prop-types";

const SelectFieldRenderer = ({
  field,
  value,
  onChange,
  error,
  touched,
  disabled,
}) => {
  return (
    <BaseFieldRenderer field={field} error={error} touched={touched}>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        error={error}
      >
        <SelectTrigger>
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
    </BaseFieldRenderer>
  );
};

SelectFieldRenderer.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        }),
      ]),
    ).isRequired,
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  touched: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default SelectFieldRenderer;
