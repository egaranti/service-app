import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Switch,
} from "@egaranti/components";

import React, { useEffect, useState } from "react";

import { getFieldComponent } from "../fields";

import { MoreVertical } from "lucide-react";

/**
 * FieldEditorDialog component for editing field properties
 * Provides a modal dialog with field-specific editor and common field options
 */
const FieldEditorDialog = ({ field, onUpdate }) => {
  // Get the appropriate editor component for this field type
  const FieldEditor = getFieldComponent(field.type, "Editor");
  const [open, setOpen] = useState(false);
  const [localField, setLocalField] = useState({ ...field });

  // Get field ID (use clientId as fallback if id is null)
  const fieldId = field.id || field.clientId;

  // Reset local field state when dialog opens
  useEffect(() => {
    if (open) {
      setLocalField({ ...field });
    }
  }, [open, field]);

  // Update local field state
  const handleLocalUpdate = (_, updates) => {
    setLocalField((prev) => ({ ...prev, ...updates }));
  };

  // Save changes and close dialog
  const handleSave = () => {
    onUpdate(fieldId, { ...localField });
    setOpen(false);
  };

  // Render field option toggle with label
  const renderFieldOption = ({ id, label, checked, onChange }) => (
    <div className="flex items-center gap-2">
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Alan düzenle"
          className="h-8 w-8 rounded p-2 hover:bg-gray-50 hover:text-gray-500"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alan Düzenle</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Field-specific editor component */}
          {FieldEditor && (
            <FieldEditor field={localField} onUpdate={handleLocalUpdate} />
          )}

          {/* Common field options */}
          <div className="flex items-center justify-end gap-4">
            {/* Customer visibility option (only for main form fields) */}
            {!field.isFollowUp &&
              renderFieldOption({
                id: `hide-user-${fieldId}`,
                label: "Tüketici görmesin",
                checked: localField.hiddenForCustomer,
                onChange: (checked) =>
                  handleLocalUpdate(fieldId, {
                    hiddenForCustomer: checked,
                  }),
              })}

            {/* Required field option */}
            {renderFieldOption({
              id: `required-${fieldId}`,
              label: "Zorunlu",
              checked: localField.required,
              onChange: (checked) =>
                handleLocalUpdate(fieldId, {
                  required: checked,
                }),
            })}
          </div>

          {/* Dialog actions */}
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
