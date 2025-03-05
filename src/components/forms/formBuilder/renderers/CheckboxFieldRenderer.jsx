import { Checkbox } from "@egaranti/components";

import React from "react";

import BaseFieldRenderer from "./BaseFieldRenderer";

import PropTypes from "prop-types";

const CheckboxFieldRenderer = ({
  field,
  value,
  onChange,
  error,
  touched,
  disabled,
}) => {
  return (
    <BaseFieldRenderer field={field} error={error} touched={touched}>
      <div className="space-y-2">
        {field.options?.map((option, index) => (
          <div key={index} className="flex items-center">
            <Checkbox
              checked={value === option}
              onCheckedChange={(checked) => onChange(checked ? option : "")}
              disabled={disabled}
            />
            <label className="ml-2 text-sm font-medium text-gray-900">
              {option}
              {field.required && index === 0 && (
                <span className="text-red-500">*</span>
              )}
            </label>
          </div>
        ))}
      </div>
    </BaseFieldRenderer>
  );
};

CheckboxFieldRenderer.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.arrayOf(PropTypes.string),
  touched: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

export default CheckboxFieldRenderer;
