import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, ScrollArea } from "@egaranti/components";

import React from "react";
import { useFormContext } from "react-hook-form";

import { validateFieldAddition } from "../constants/fieldRules";
import { createField } from "../fields";
import SortableFieldItem from "./sortableFieldItem";

const FormSection = ({
  formIndex,
  title,
  onRemove,
  onError,
  draggedType,
  canAdd = true,
  isFollowUp = false,
  dependsOn = null,
}) => {
  const { watch, setValue } = useFormContext();
  const fieldsPath = `forms.${formIndex}.fields`;
  const fields = watch(fieldsPath) || [];
  const mainFormFields = watch("forms.0.fields") || [];

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedType) return;

    const validation = validateFieldAddition(draggedType, fields);
    if (!validation.valid && onError) {
      onError(validation.message);
      return;
    }

    const newField = createField(draggedType);
    if (newField) {
      const currentFields = [...fields, newField];
      setValue(fieldsPath, currentFields);

      // Set follow-up form title to OPERATION and orderKey when first field is added
      if (isFollowUp && fields.length === 0) {
        setValue(`forms.${formIndex}.title`, "OPERATION");
        setValue(`forms.${formIndex}.orderKey`, `form_${formIndex + 1}`);
      }
    }
  };

  const handleUpdateField = (id, updates) => {
    // Find field by id or clientId
    const index = fields.findIndex(
      (field) =>
        field.id === id || (field.id === null && field.clientId === id),
    );

    if (index !== -1) {
      const updatedFields = [...fields];
      updatedFields[index] = { ...updatedFields[index], ...updates };
      setValue(fieldsPath, updatedFields);
    }
  };

  const handleRemoveField = (id) => {
    // Find field by id or clientId
    const index = fields.findIndex(
      (field) =>
        field.id === id || (field.id === null && field.clientId === id),
    );

    if (index !== -1) {
      const updatedFields = [...fields];
      updatedFields.splice(index, 1);
      setValue(fieldsPath, updatedFields);
    }
  };

  const handleMove = (oldIndex, newIndex) => {
    const updatedFields = [...fields];
    const [movedItem] = updatedFields.splice(oldIndex, 1);
    updatedFields.splice(newIndex, 0, movedItem);
    setValue(fieldsPath, updatedFields);
  };

  if (fields.length === 0) {
    if (isFollowUp && !mainFormFields.length) {
      return (
        <div className="mt-8">
          <Button
            variant="secondaryGray"
            className="w-full"
            onClick={() => setValue(fieldsPath, [createField("TEXT")])}
            disabled={true}
          >
            + İşlem Formu Ekle
          </Button>
        </div>
      );
    }

    return (
      <div
        className="mt-8"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="rounded-lg border-2 border-dashed py-12 text-center">
          {isFollowUp ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold">İşlem Formu</p>
              <p className="text-muted-foreground">
                İşlem formu oluşturmak için form elemanı sürükleyip bırakın
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Form elemanı sürükleyip bırakarak bu alanı doldurabilirsiniz.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {onRemove && (
          <Button
            variant="secondaryGray"
            onClick={() => {
              setValue(fieldsPath, []);
              onRemove();
            }}
          >
            Kaldır
          </Button>
        )}
      </div>
      <ScrollArea className="h-full rounded-md border p-4">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="space-y-4"
        >
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;

              // Find field by id or clientId
              const oldIndex = fields.findIndex(
                (f) =>
                  f.id === active.id ||
                  (f.id === null && f.clientId === active.id),
              );
              const newIndex = fields.findIndex(
                (f) =>
                  f.id === over.id || (f.id === null && f.clientId === over.id),
              );

              handleMove(oldIndex, newIndex);
            }}
          >
            <SortableContext
              items={fields.map((field) => field.id || field.clientId)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => {
                // Use clientId as fallback if id is null
                const fieldId = field.id || field.clientId;

                return (
                  <SortableFieldItem
                    key={fieldId}
                    field={field}
                    index={index}
                    onUpdate={(id, updates) => handleUpdateField(id, updates)}
                    onRemove={() => handleRemoveField(fieldId)}
                    isFollowUp={isFollowUp}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      </ScrollArea>
    </div>
  );
};

export default FormSection;
