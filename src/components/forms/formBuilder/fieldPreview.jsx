import React from "react";

import { getFieldComponent } from "./fields";

const FieldPreview = ({ field }) => {
  const FieldComponent = getFieldComponent(field.type, "Preview");
  if (!FieldComponent) return null;

  return <FieldComponent field={field} />;
};

export default FieldPreview;
