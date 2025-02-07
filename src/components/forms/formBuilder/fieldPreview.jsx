import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@egaranti/components";

const FieldPreview = ({ field }) => {
  const commonProps = {
    id: field.id,
    placeholder: field.placeholder,
    className: "w-full",
  };

  switch (field.type) {
    case "text":
      return <Input type="text" {...commonProps} />;
    case "textarea":
      return <Textarea {...commonProps} />;
    case "select":
      return (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "number":
      return (
        <Input
          type="number"
          {...commonProps}
          min={field.validation?.min}
          max={field.validation?.max}
        />
      );
    case "date":
      return <Input type="date" {...commonProps} />;
    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <input type="checkbox" id={field.id} />
          <Label htmlFor={field.id}>{field.label}</Label>
        </div>
      );
    case "radio":
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name={field.id}
                id={`${field.id}-${option}`}
                value={option}
              />
              <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      );
    case "file":
      return <Input type="file" {...commonProps} />;
    default:
      return null;
  }
};

export default FieldPreview;
