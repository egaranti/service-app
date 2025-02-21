import { Input } from "@egaranti/components";

import React from "react";

import BaseFieldRenderer from "./BaseFieldRenderer";

import PropTypes from "prop-types";

const TextFieldRenderer = ({
  field,
  value,
  onChange,
  error,
  touched,
  disabled,
}) => {
  return (
    <BaseFieldRenderer field={field} error={error} touched={touched}>
      <Input
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </BaseFieldRenderer>
  );
};

TextFieldRenderer.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.arrayOf(PropTypes.string),
  touched: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

export default TextFieldRenderer;
