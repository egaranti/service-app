import React from "react";

import PropTypes from "prop-types";

const BaseFieldRenderer = ({ field, error, touched, children }) => {
  const renderLabel = () => (
    <label className="mb-2 block text-sm font-medium text-gray-900">
      {field.label}
      {field.required && <span className="text-red-500">*</span>}
    </label>
  );

  const renderError = () =>
    touched &&
    error &&
    error.length > 0 && (
      <div className="mt-1 text-sm text-red-500">
        {error.map((err, index) => (
          <div key={index}>{err}</div>
        ))}
      </div>
    );

  return (
    <div className={`mb-4 ${error && error.length > 0 ? "error" : ""}`}>
      {renderLabel()}
      {children}
      {renderError()}
    </div>
  );
};

BaseFieldRenderer.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
  }).isRequired,
  error: PropTypes.arrayOf(PropTypes.string),
  touched: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default BaseFieldRenderer;
