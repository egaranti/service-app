import { RadioGroup, RadioGroupItem } from "@egaranti/components";

import React from "react";

import BaseFieldRenderer from "./BaseFieldRenderer";

import PropTypes from "prop-types";

const RadioFieldRenderer = ({
  field,
  value,
  onChange,
  error,
  touched,
  disabled,
}) => {
  return (
    <BaseFieldRenderer field={field} error={error} touched={touched}>
      <RadioGroup value={value} onValueChange={onChange} disabled={disabled}>
        {field.options?.map((option) => {
          const optionValue =
            typeof option === "object" ? option.value : option;
          const optionLabel =
            typeof option === "object" ? option.label : option;
          const id = `${field.id}-${optionValue}`;
          return (
            <div key={optionValue} className="flex items-center space-x-2">
              <RadioGroupItem value={optionValue} id={id} />
              <label htmlFor={id}>{optionLabel}</label>
            </div>
          );
        })}
      </RadioGroup>
    </BaseFieldRenderer>
  );
};

RadioFieldRenderer.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
      ]),
    ).isRequired,
  }).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.arrayOf(PropTypes.string),
  touched: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

export default RadioFieldRenderer;
