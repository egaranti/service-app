import {
  CheckboxFieldEditor,
  CheckboxFieldPreview,
} from "./components/CheckboxField";
import { DateFieldEditor, DateFieldPreview } from "./components/DateField";
import {
  EmployeeFieldEditor,
  EmployeeFieldPreview,
} from "./components/EmployeeField";
import { FileFieldEditor, FileFieldPreview } from "./components/FileField";
import {
  NumberFieldEditor,
  NumberFieldPreview,
} from "./components/NumberField";
import { RadioFieldEditor, RadioFieldPreview } from "./components/RadioField";
import {
  SelectFieldEditor,
  SelectFieldPreview,
} from "./components/SelectField";
import { SpareFieldEditor, SpareFieldPreview } from "./components/SpareField";
import {
  TextareaFieldEditor,
  TextareaFieldPreview,
} from "./components/TextareaField";
import { TextFieldEditor, TextFieldPreview } from "./components/TextField";
import { fieldRegistry } from "./registry";

// Register field components
const fieldComponents = {
  ASSIGNEE: { Preview: EmployeeFieldPreview, Editor: EmployeeFieldEditor },
  TEXT: { Preview: TextFieldPreview, Editor: TextFieldEditor },
  RADIO_BUTTON: { Preview: RadioFieldPreview, Editor: RadioFieldEditor },
  DROPDOWN: { Preview: SelectFieldPreview, Editor: SelectFieldEditor },
  RADIO: { Preview: RadioFieldPreview, Editor: RadioFieldEditor },
  NUMBER: { Preview: NumberFieldPreview, Editor: NumberFieldEditor },
  TEXTAREA: { Preview: TextareaFieldPreview, Editor: TextareaFieldEditor },
  DATE: { Preview: DateFieldPreview, Editor: DateFieldEditor },
  CHECKBOX: { Preview: CheckboxFieldPreview, Editor: CheckboxFieldEditor },
  FILE: { Preview: FileFieldPreview, Editor: FileFieldEditor },
  SPARE_PART: {
    Preview: SpareFieldPreview,
    Editor: SpareFieldEditor,
  },
};

export const getFieldComponent = (type, variant = "Preview") => {
  const components = fieldComponents[type];
  if (!components) return null;
  return components[variant];
};

export const getFieldConfig = (type) => {
  return fieldRegistry.get(type);
};

export const getAllFieldTypes = () => {
  return fieldRegistry.getAll();
};

export const createField = (type) => {
  const config = getFieldConfig(type);
  if (!config) return null;

  // Generate a unique client ID for frontend operations
  const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    ...config.getDefaultProps(config),
    id: null, // This will be set by the backend when saved
    clientId: clientId, // Used for frontend operations before saving to DB
  };
};
