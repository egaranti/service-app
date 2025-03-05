import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@egaranti/components";

import { useState } from "react";

import DynamicForm from "./dynamicForm";

export default function FollowUpFormDialog({
  open,
  onOpenChange,
  followUpFields,
  onSubmit,
  defaultValues = {},
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedValues = followUpFields.map((field) => ({
        ...field,
        sparePartsValue: field.type === "SPARE_PARTS" ? field.value : null,
      }));

      await onSubmit(formattedValues);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting follow-up form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>İşlem Formu</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <DynamicForm
            fields={followUpFields}
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            isEditing={true}
            submitButtonProps={{
              className: "mt-6 w-full",
              disabled: loading,
              children: loading ? "Gönderiliyor..." : "İşlemi Kaydet",
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
