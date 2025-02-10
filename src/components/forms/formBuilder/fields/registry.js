import {
  CalendarIcon,
  CheckSquare,
  ChevronDown,
  FileText,
  ListOrdered,
  Paperclip,
  Tag,
  ToggleLeft,
  Type,
  Users,
} from "lucide-react";

class FieldRegistry {
  constructor() {
    this.fields = new Map();
  }

  register(type, config) {
    this.fields.set(type, config);
  }

  get(type) {
    return this.fields.get(type);
  }

  getAll() {
    return Array.from(this.fields.values());
  }
}

export const fieldRegistry = new FieldRegistry();

const baseFieldConfig = {
  getDefaultProps: (field) => ({
    id: `field-${Date.now()}`,
    type: field.type,
    label: `Yeni ${field.type} alan`,
    required: false,
    placeholder: `Yaz ${field.type}`,
  }),
};

// Register all field types
fieldRegistry.register("text", {
  ...baseFieldConfig,
  type: "text",
  icon: Type,
  label: "Text Input",
});

fieldRegistry.register("textarea", {
  ...baseFieldConfig,
  type: "textarea",
  icon: FileText,
  label: "Text Area",
});

fieldRegistry.register("select", {
  ...baseFieldConfig,
  type: "select",
  icon: ChevronDown,
  label: "Dropdown",
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    options: ["Option 1", "Option 2"],
  }),
});

fieldRegistry.register("number", {
  ...baseFieldConfig,
  type: "number",
  icon: ListOrdered,
  label: "Number",
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    validation: { min: undefined, max: undefined },
  }),
});

fieldRegistry.register("checkbox", {
  ...baseFieldConfig,
  type: "checkbox",
  icon: CheckSquare,
  label: "Checkbox",
});

fieldRegistry.register("date", {
  ...baseFieldConfig,
  type: "date",
  icon: CalendarIcon,
  label: "Date",
});

fieldRegistry.register("radio", {
  ...baseFieldConfig,
  type: "radio",
  icon: ToggleLeft,
  label: "Radio Group",
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    options: ["Option 1", "Option 2"],
  }),
});

fieldRegistry.register("file", {
  ...baseFieldConfig,
  type: "file",
  icon: Paperclip,
  label: "File Upload",
});

fieldRegistry.register("status", {
  ...baseFieldConfig,
  type: "status",
  icon: Tag,
  label: "Status",
  customField: true,
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    options: [
      { label: "Active", color: "#10B981" },
      { label: "Inactive", color: "#6B7280" },
      { label: "Pending", color: "#F59E0B" },
    ],
  }),
});

fieldRegistry.register("assignee", {
  ...baseFieldConfig,
  type: "assignee",
  icon: Users,
  label: "Personel Seçimi",
  customField: true,
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    placeholder: "Personel seç",
  }),
});
