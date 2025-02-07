import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, ScrollArea, useToast } from "@egaranti/components";

import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import FieldPreview from "./fieldPreview";
import LeftSidebar from "./leftSidebar";
import SortableFieldItem from "./sortableFieldItem";

import {
  CalendarIcon,
  CheckSquare,
  ChevronDown,
  FileText,
  ListOrdered,
  Paperclip,
  ToggleLeft,
  Type,
} from "lucide-react";

// Sabit Form Elemanları tanımı
const FIELD_TYPES = [
  { type: "text", icon: Type, label: "Text Input" },
  { type: "textarea", icon: FileText, label: "Text Area" },
  { type: "select", icon: ChevronDown, label: "Dropdown" },
  { type: "number", icon: ListOrdered, label: "Number" },
  { type: "checkbox", icon: CheckSquare, label: "Checkbox" },
  { type: "date", icon: CalendarIcon, label: "Date" },
  { type: "radio", icon: ToggleLeft, label: "Radio Group" },
  { type: "file", icon: Paperclip, label: "File Upload" },
];

export default function FormBuilder() {
  const { toast } = useToast();
  const { control, handleSubmit } = useForm({
    defaultValues: { fields: [] },
  });
  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: "fields",
  });

  const [draggedType, setDraggedType] = useState(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");

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
    const newField = {
      id: `field-${Date.now()}`,
      order: fields.length,
      type: draggedType,
      label: `New ${draggedType} field`,
      key: `field_${fields.length + 1}`,
      required: false,
      placeholder: `Enter ${draggedType}`,
      options:
        draggedType === "select" || draggedType === "radio"
          ? ["Option 1", "Option 2"]
          : undefined,
      validation: {},
    };
    append(newField);
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
    const formConfig = {
      name: formName,
      description: formDescription,
      fields: data.fields,
      created: new Date().toISOString(),
      version: "1.0",
    };
    console.log("Saving form configuration:", formConfig);
    toast({
      title: "Success",
      description: "Form configuration saved",
    });
  });

  return (
    <div className="bg-background flex h-screen">
      {/* Sol Sidebar */}
      <LeftSidebar
        fieldTypes={FIELD_TYPES}
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
            <h1 className="text-2xl font-bold">egaranti Form Oluşturucu</h1>
            <Button onClick={onSave}>Save Form</Button>
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
                  Drag and drop form elements here to start building your form
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
