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
      <div className="flex items-center">
        <Checkbox
          checked={value}
          onCheckedChange={(val) => onChange(val)}
          disabled={disabled}
        />
        <label className="ml-2 text-sm font-medium text-gray-900">
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
        </label>
      </div>
    </BaseFieldRenderer>
  );
};

CheckboxFieldRenderer.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
  }).isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.arrayOf(PropTypes.string),
  touched: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

export default CheckboxFieldRenderer;
