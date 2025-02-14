import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, ScrollArea } from "@egaranti/components";

import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import FieldPreview from "./fieldPreview";
import { createField } from "./fields";
import SortableFieldItem from "./sortableFieldItem";

export default function FollowUpFormSection({ draggedType }) {
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: "forms.1.fields",
  });

  // Sol panelden bırakıldığında, yeni alanı ekle
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up to main form
    if (!draggedType) return;
    const newField = createField(draggedType);
    if (newField) {
      append(newField);
    }
  };

  // Güncelleme fonksiyonu: Herhangi bir alana ait güncelleme yapıldığında
  const handleUpdateField = (id, updates) => {
    const index = fields.findIndex((field) => field.id === id);
    if (index !== -1) {
      update(index, { ...fields[index], ...updates });
    }
  };

  // Alanı kaldırma
  const handleRemoveField = (id) => {
    const index = fields.findIndex((field) => field.id === id);
    if (index !== -1) {
      remove(index);
    }
  };

  // dnd-kit sıralama işlemi
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    move(oldIndex, newIndex);
  };

  if (fields.length === 0) {
    return (
      <div className="mt-8">
        <Button
          variant="secondaryGray"
          className="w-full"
          onClick={() => append(createField("TEXT"))}
        >
          + İşlem Formu Ekle
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{watch('forms.1.name') || 'İşlem Formu'}</h2>
        <Button
          variant="secondaryGray"
          onClick={() => {
            remove();
            setValue("forms.1.fields", []);
          }}
        >
          Kaldır
        </Button>
      </div>

      <div
        data-follow-up-form
        className="rounded-lg border-2 border-dashed p-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <ScrollArea className="h-[400px]">
          {fields.length > 0 ? (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <SortableFieldItem
                      key={field.id}
                      field={field}
                      index={index}
                      onRemove={handleRemoveField}
                      onUpdate={handleUpdateField}
                      isFollowUp={true}
                    >
                      <FieldPreview field={field} />
                    </SortableFieldItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                Form elemanı sürükleyip bırakarak işlem formunu
                oluşturabilirsiniz.
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
