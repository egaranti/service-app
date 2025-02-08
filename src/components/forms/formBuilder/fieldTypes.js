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
} from "lucide-react";

export const FIELD_TYPES = [
  {
    type: "text",
    icon: Type,
    label: "Text Input",
    defaultProps: {
      placeholder: "Enter text",
    },
  },
  {
    type: "textarea",
    icon: FileText,
    label: "Text Area",
    defaultProps: {
      placeholder: "Enter text",
    },
  },
  {
    type: "select",
    icon: ChevronDown,
    label: "Dropdown",
    defaultProps: {
      options: ["Option 1", "Option 2"],
    },
  },
  {
    type: "number",
    icon: ListOrdered,
    label: "Number",
    defaultProps: {
      placeholder: "Enter number",
    },
  },
  {
    type: "checkbox",
    icon: CheckSquare,
    label: "Checkbox",
    defaultProps: {
      options: ["Option 1", "Option 2"],
    },
  },
  {
    type: "date",
    icon: CalendarIcon,
    label: "Date",
    defaultProps: {
      placeholder: "Select date",
    },
  },
  {
    type: "radio",
    icon: ToggleLeft,
    label: "Radio Group",
    defaultProps: {
      options: ["Option 1", "Option 2"],
    },
  },
  {
    type: "file",
    icon: Paperclip,
    label: "File Upload",
    defaultProps: {
      accept: "*/*",
    },
  },
  {
    type: "status",
    icon: Tag,
    label: "Status",
    defaultProps: {
      options: [
        { label: "Active", color: "#10B981" },
        { label: "Inactive", color: "#6B7280" },
        { label: "Pending", color: "#F59E0B" },
      ],
    },
    customField: true,
  },
];

export const getDefaultProps = (type) => {
  const fieldType = FIELD_TYPES.find((field) => field.type === type);
  return {
    id: `field-${Date.now()}`,
    type: type,
    label: `New ${type} field`,
    key: `field_${Date.now()}`,
    required: false,
    ...fieldType?.defaultProps,
  };
};
