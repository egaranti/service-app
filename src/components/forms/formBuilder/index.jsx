import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, ScrollArea, useToast } from "@egaranti/components";

import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import FieldPreview from "./fieldPreview";
import { createField, getAllFieldTypes } from "./fields";
import LeftSidebar from "./leftSidebar";
import SortableFieldItem from "./sortableFieldItem";

export default function FormBuilder({
  initialData,
  onSubmit,
  mode = "new", // new or edit
}) {
  const { toast } = useToast();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: initialData || { fields: [], name: "", description: "" },
  });
  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: "fields",
  });

  const [draggedType, setDraggedType] = useState(null);
  const [formName, setFormName] = useState(initialData?.name || "");
  const [formDescription, setFormDescription] = useState(
    initialData?.description || "",
  );

  // Get all field types from registry
  const fieldTypes = getAllFieldTypes();

  // Sol sidebar’dan yeni eleman sürüklenmeye başlandığında
  const handleDragStart = (type) => {
    setDraggedType(type);
  };

  // Sürükleme bittiğinde
  const handleDragEnd = () => {
    setDraggedType(null);
  };

  // Sol panelden bırakıldığında, yeni alanı ekle
  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedType) return;
    const newField = createField(draggedType);
    if (newField) {
      append({ ...newField, order: fields.length });
    }
    setDraggedType(null);
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

  // dnd-kit sıralama işlemi: Sürükleme bitince, iki alanın yerini değiştir.
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    move(oldIndex, newIndex);
  };

  // Form verilerini hazırlama
  const prepareFormData = (data) => {
    return {
      name: formName,
      description: formDescription,
      fields: data.fields,
      version: initialData?.version || "1.0",
      ...(mode === "edit" && initialData?.id ? { id: initialData.id } : {}),
    };
  };

  // Formu kaydetme
  const onSave = handleSubmit((data) => {
    // Alan key’lerinin benzersizliğini kontrol et
    const keys = data.fields.map((f) => f.key);
    const uniqueKeys = new Set(keys);
    if (keys.length !== uniqueKeys.size) {
      toast({
        title: "Error",
        description: "Field keys must be unique",
        variant: "destructive",
      });
      return;
    }
    const formData = prepareFormData(data);

    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log(
        `${mode === "edit" ? "Updating" : "Creating"} form:`,
        formData,
      );
      toast({
        title: "Success",
        description: `Form ${mode === "edit" ? "updated" : "created"} successfully`,
      });
    }
  });

  return (
    <div className="bg-background flex h-screen">
      {/* Sol Sidebar */}
      <LeftSidebar
        fieldTypes={fieldTypes}
        draggedType={draggedType}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      {/* Ana İçerik */}
      <div
        className="flex-1 p-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="w-full space-y-4">
              <h1 className="text-2xl font-bold">
                {mode === "edit" ? "Form Düzenle" : "Yeni Form Oluştur"}
              </h1>
            </div>
            <Button onClick={onSave}>
              {mode === "edit" ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {fields.length > 0 ? (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={fields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-6">
                    {fields.map((field, index) => (
                      <SortableFieldItem
                        key={field.id}
                        field={field}
                        index={index}
                        onRemove={handleRemoveField}
                        onUpdate={handleUpdateField}
                      >
                        <FieldPreview field={field} />
                      </SortableFieldItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="rounded-lg border-2 border-dashed py-12 text-center">
                <p className="text-muted-foreground">
                  Form elemanı sürükleyip bırakarak bu alanı doldurabilirsiniz.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
