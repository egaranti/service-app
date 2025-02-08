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
import {
  StatusFieldEditor,
  StatusFieldPreview,
} from "./components/StatusField";
import {
  TextareaFieldEditor,
  TextareaFieldPreview,
} from "./components/TextareaField";
import { TextFieldEditor, TextFieldPreview } from "./components/TextField";
import { fieldRegistry } from "./registry";

// Register field components
const fieldComponents = {
  assignee: {
    Preview: EmployeeFieldPreview,
    Editor: EmployeeFieldEditor,
  },
  text: {
    Preview: TextFieldPreview,
    Editor: TextFieldEditor,
  },
  status: {
    Preview: StatusFieldPreview,
    Editor: StatusFieldEditor,
  },
  select: {
    Preview: SelectFieldPreview,
    Editor: SelectFieldEditor,
  },
  radio: {
    Preview: RadioFieldPreview,
    Editor: RadioFieldEditor,
  },
  number: {
    Preview: NumberFieldPreview,
    Editor: NumberFieldEditor,
  },
  textarea: {
    Preview: TextareaFieldPreview,
    Editor: TextareaFieldEditor,
  },
  date: {
    Preview: DateFieldPreview,
    Editor: DateFieldEditor,
  },
  checkbox: {
    Preview: CheckboxFieldPreview,
    Editor: CheckboxFieldEditor,
  },
  file: {
    Preview: FileFieldPreview,
    Editor: FileFieldEditor,
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
  return config.getDefaultProps(config);
};
