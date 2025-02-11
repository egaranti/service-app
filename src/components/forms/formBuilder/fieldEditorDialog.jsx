import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@egaranti/components";

import React, { useEffect, useState } from "react";

import { getFieldComponent } from "./fields";

import { MoreVertical } from "lucide-react";

const FieldEditorDialog = ({ field, onUpdate }) => {
  const FieldEditor = getFieldComponent(field.type, "Editor");
  const [open, setOpen] = useState(false);
  const [localField, setLocalField] = useState({ ...field });

  useEffect(() => {
    if (open) {
      setLocalField({ ...field });
    }
  }, [open, field]);

  const handleLocalUpdate = (id, updates) => {
    setLocalField((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    onUpdate(field.id, localField);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Edit field"
          className="h-8 w-8 rounded p-2 hover:bg-gray-50 hover:text-gray-500"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
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
              value={localField.label || ""}
              onChange={(e) =>
                handleLocalUpdate(field.id, { label: e.target.value })
              }
            />
          </div>
          {FieldEditor && (
            <FieldEditor field={localField} onUpdate={handleLocalUpdate} />
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondaryGray" onClick={() => setOpen(false)}>
              Vazgeç
            </Button>
            <Button onClick={handleSave}>Kaydet</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FieldEditorDialog;
