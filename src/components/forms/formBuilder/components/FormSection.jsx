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
import SortableFieldItem from "../sortableFieldItem";

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
  const { control, watch, setValue } = useFormContext();
  const fieldsPath = `forms.${formIndex}.fields`;
  const fields = watch(fieldsPath) || [];
  const mainFormFields = watch("forms.0.fields") || [];
  const shouldBeDisabled = isFollowUp && !mainFormFields.length;

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
    }
  };

  const handleUpdateField = (id, updates) => {
    const index = fields.findIndex((field) => field.id === id);
    if (index !== -1) {
      const updatedFields = [...fields];
      updatedFields[index] = { ...updatedFields[index], ...updates };
      setValue(fieldsPath, updatedFields);
    }
  };

  const handleRemoveField = (id) => {
    const index = fields.findIndex((field) => field.id === id);
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
    return (
      <div className="mt-8">
        <Button
          variant="secondaryGray"
          className="w-full"
          onClick={() => setValue(fieldsPath, [createField("TEXT")])}
          disabled={shouldBeDisabled}
        >
          + {isFollowUp ? "İşlem Formu Ekle" : "Alan Ekle"}
        </Button>
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
              const oldIndex = fields.findIndex((f) => f.id === active.id);
              const newIndex = fields.findIndex((f) => f.id === over.id);
              handleMove(oldIndex, newIndex);
            }}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <SortableFieldItem
                  key={field.id}
                  field={field}
                  index={index}
                  onUpdate={(updates) => handleUpdateField(field.id, updates)}
                  onRemove={() => handleRemoveField(field.id)}
                  isFollowUp={isFollowUp}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </ScrollArea>
    </div>
  );
};

export default FormSection;
