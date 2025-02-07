import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
} from "@egaranti/components";

import { MoreVertical } from "lucide-react";

const FieldEditorDialog = ({ field, onUpdate }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Field</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor={`label-${field.id}`}>Label</Label>
            <Input
              id={`label-${field.id}`}
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
            <Input
              id={`placeholder-${field.id}`}
              value={field.placeholder}
              onChange={(e) =>
                onUpdate(field.id, { placeholder: e.target.value })
              }
            />
          </div>
          {(field.type === "select" || field.type === "radio") && (
            <div className="grid gap-2">
              <Label htmlFor={`options-${field.id}`}>
                Options (one per line)
              </Label>
              <Textarea
                id={`options-${field.id}`}
                value={field.options?.join("\n") || ""}
                onChange={(e) =>
                  onUpdate(field.id, {
                    options: e.target.value.split("\n").filter(Boolean),
                  })
                }
              />
            </div>
          )}
          {field.type === "number" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`min-${field.id}`}>Min Value</Label>
                <Input
                  id={`min-${field.id}`}
                  type="number"
                  value={field.validation?.min || ""}
                  onChange={(e) =>
                    onUpdate(field.id, {
                      validation: {
                        ...field.validation,
                        min: e.target.value
                          ? Number.parseInt(e.target.value)
                          : undefined,
                      },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`max-${field.id}`}>Max Value</Label>
                <Input
                  id={`max-${field.id}`}
                  type="number"
                  value={field.validation?.max || ""}
                  onChange={(e) =>
                    onUpdate(field.id, {
                      validation: {
                        ...field.validation,
                        max: e.target.value
                          ? Number.parseInt(e.target.value)
                          : undefined,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FieldEditorDialog;
