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
    type: field.type,
    label: `Yeni ${field.type} alan`,
    required: false,
    placeholder: `Yaz ${field.type}`,
  }),
};

// Register all field types
fieldRegistry.register("TEXT", {
  ...baseFieldConfig,
  type: "TEXT",
  icon: Type,
  label: "Text Input",
});

fieldRegistry.register("TEXTAREA", {
  ...baseFieldConfig,
  type: "TEXTAREA",
  icon: FileText,
  label: "Text Area",
});

fieldRegistry.register("DROPDOWN", {
  ...baseFieldConfig,
  type: "DROPDOWN",
  icon: ChevronDown,
  label: "Dropdown",
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    options: ["Option 1", "Option 2"],
  }),
});

fieldRegistry.register("NUMBER", {
  ...baseFieldConfig,
  type: "NUMBER",
  icon: ListOrdered,
  label: "Number",
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    validation: { min: undefined, max: undefined },
  }),
});

fieldRegistry.register("CHECKBOX", {
  ...baseFieldConfig,
  type: "CHECKBOX",
  icon: CheckSquare,
  label: "Checkbox",
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    options: ["Seçenek 1", "Seçenek 2"],
  }),
});

fieldRegistry.register("DATE", {
  ...baseFieldConfig,
  type: "DATE",
  icon: CalendarIcon,
  label: "Date",
});

fieldRegistry.register("RADIO", {
  ...baseFieldConfig,
  type: "RADIO",
  icon: ToggleLeft,
  label: "Radio Group",
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    options: ["Option 1", "Option 2"],
  }),
});

fieldRegistry.register("FILE", {
  ...baseFieldConfig,
  type: "FILE",
  icon: Paperclip,
  label: "File Upload",
});

fieldRegistry.register("STATUS", {
  ...baseFieldConfig,
  type: "STATUS",
  icon: Tag,
  label: "Status",
  customField: true,
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    label: "Durum",
    placeholder: "Durum seç",
    status: [
      { label: "Beklemede", color: "#10B981" },
      { label: "İşlemde", color: "#6B7280" },
      { label: "Bitti", color: "#F59E0B" },
    ],
  }),
});

fieldRegistry.register("ASSIGNEE", {
  ...baseFieldConfig,
  type: "ASSIGNEE",
  icon: Users,
  label: "Personel Seçimi",
  customField: true,
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    placeholder: "Personel seç",
  }),
});
