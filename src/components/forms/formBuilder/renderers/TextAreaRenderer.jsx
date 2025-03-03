import { Textarea } from "@egaranti/components";

import React from "react";

import BaseFieldRenderer from "./BaseFieldRenderer";

import PropTypes from "prop-types";

const TextAreaRenderer = ({
  field,
  value,
  onChange,
  error,
  touched = false,
  disabled,
}) => {
  return (
    <BaseFieldRenderer field={field} error={error} touched={touched}>
      <Textarea
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={4}
      />
    </BaseFieldRenderer>
  );
};

TextAreaRenderer.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.arrayOf(PropTypes.string),
  touched: PropTypes.bool,
  disabled: PropTypes.bool,
};


export default TextAreaRenderer;
