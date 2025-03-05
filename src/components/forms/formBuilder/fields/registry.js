import {
  CalendarIcon,
  CheckSquare,
  ChevronDown,
  FileText,
  ListOrdered,
  Paperclip,
  PuzzleIcon,
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
    placeholder: `${field.type}`,
  }),
};

// Register all field types
fieldRegistry.register("TEXT", {
  ...baseFieldConfig,
  type: "TEXT",
  icon: Type,
  label: "Yazı",
});

fieldRegistry.register("TEXTAREA", {
  ...baseFieldConfig,
  type: "TEXTAREA",
  icon: FileText,
  label: "Uzun Yazı",
});

fieldRegistry.register("DROPDOWN", {
  ...baseFieldConfig,
  type: "DROPDOWN",
  icon: ChevronDown,
  label: "Seçenekler",
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    options: ["Seçenek 1", "Seçenek 2"],
  }),
});

fieldRegistry.register("NUMBER", {
  ...baseFieldConfig,
  type: "NUMBER",
  icon: ListOrdered,
  label: "Sayı",
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    validation: { min: undefined, max: undefined },
  }),
});

fieldRegistry.register("CHECKBOX", {
  ...baseFieldConfig,
  type: "CHECKBOX",
  icon: CheckSquare,
  label: "Seçenek",
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    options: ["Seçenek 1", "Seçenek 2"],
  }),
});

fieldRegistry.register("DATE", {
  ...baseFieldConfig,
  type: "DATE",
  icon: CalendarIcon,
  label: "Tarih",
});

fieldRegistry.register("RADIO_BUTTON", {
  ...baseFieldConfig,
  type: "RADIO_BUTTON",
  icon: ToggleLeft,
  label: "Seçim Alanı",
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    options: ["Seçenek 1", "Seçenek 2"],
  }),
});

// fieldRegistry.register("FILE", {
//   ...baseFieldConfig,
//   type: "FILE",
//   icon: Paperclip,
//   label: "File Upload",
// });

fieldRegistry.register("SPARE_PART", {
  ...baseFieldConfig,
  type: "SPARE_PART",
  icon: PuzzleIcon,
  label: "Yedek Parça",
  getDefaultProps: (field) => ({
    ...baseFieldConfig.getDefaultProps(field),
    label: "Yedek Parça",
  }),
});
// fieldRegistry.register("ASSIGNEE", {
//   ...baseFieldConfig,
//   type: "ASSIGNEE",
//   icon: Users,
//   label: "Personel Seçimi",
//   customField: true,
//   getDefaultProps: (field) => ({
//     ...baseFieldConfig.getDefaultProps(field),
//     placeholder: "Personel seç",
//   }),
// });
