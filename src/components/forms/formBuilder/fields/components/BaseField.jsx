import React from "react";

import PropTypes from "prop-types";

export const BaseField = ({ children }) => {
  return <div className="flex flex-col items-start gap-2">{children}</div>;
};

BaseField.propTypes = {
  children: PropTypes.node.isRequired,
};
