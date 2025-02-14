import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ScrollArea, useToast } from "@egaranti/components";

import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";

import FieldPreview from "./fieldPreview";
import { createField, getAllFieldTypes } from "./fields";
import FollowUpFormSection from "./FollowUpFormSection";
import LeftSidebar from "./leftSidebar";
import RightSidebar from "./rightSidebar";
import SortableFieldItem from "./sortableFieldItem";

import Breadcrumb from "@/components/shared/breadcrumb";

export default function FormBuilder({
  initialData,
  onSubmit,
  mode = "new", // new or edit
}) {
  const { toast } = useToast();
  const methods = useForm({
    defaultValues: {
      forms: [
        {
          order_key: "form_1",
          name: initialData?.name || "",
          description: initialData?.description || "",
          fields: initialData?.fields || [],
        },
        {
          order_key: "form_2",
          name: "Follow-up Form",
          description: "",
          fields: [],
        },
      ],
    },
  });
  const { control, handleSubmit, reset } = methods;
  const {
    fields: mainFormFields,
    append: appendMainForm,
    remove: removeMainForm,
    move: moveMainForm,
    update: updateMainForm,
  } = useFieldArray({
    control,
    name: "forms.0.fields",
  });

  const {
    fields: followUpFields,
    append: appendFollowUp,
    remove: removeFollowUp,
    move: moveFollowUp,
    update: updateFollowUp,
  } = useFieldArray({
    control,
    name: "forms.1.fields",
  });

  const [draggedType, setDraggedType] = useState(null);

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
    // Check if the drop target is within the follow-up form section
    const isFollowUpTarget = e.target.closest("[data-follow-up-form]");
    if (!draggedType) return;
    const newField = createField(draggedType);
    if (newField) {
      if (isFollowUpTarget) {
        appendFollowUp(newField);
      } else {
        appendMainForm(newField);
      }
    }
    setDraggedType(null);
  };

  // Güncelleme fonksiyonu: Herhangi bir alana ait güncelleme yapıldığında
  const handleUpdateField = (id, updates, isFollowUp = false) => {
    const fields = isFollowUp ? followUpFields : mainFormFields;
    const update = isFollowUp ? updateFollowUp : updateMainForm;
    const index = fields.findIndex((field) => field.id === id);
    if (index !== -1) {
      update(index, { ...fields[index], ...updates });
    }
  };

  // Alanı kaldırma
  const handleRemoveField = (id, isFollowUp = false) => {
    const fields = isFollowUp ? followUpFields : mainFormFields;
    const remove = isFollowUp ? removeFollowUp : removeMainForm;
    const index = fields.findIndex((field) => field.id === id);
    if (index !== -1) {
      remove(index);
    }
  };

  // dnd-kit sıralama işlemi: Sürükleme bitince, iki alanın yerini değiştir.
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const isFollowUpSource = active.data.current?.isFollowUp;
    const isFollowUpTarget = over.data.current?.isFollowUp;

    // Only allow reordering within the same form section
    if (isFollowUpSource !== isFollowUpTarget) return;

    const fields = isFollowUpSource ? followUpFields : mainFormFields;
    const move = isFollowUpSource ? moveFollowUp : moveMainForm;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    move(oldIndex, newIndex);
  };

  // Form verilerini hazırlama
  const prepareFormData = (data) => {
    return data.forms.map((form, index) => ({
      order_key: `form_${index + 1}`,
      name: form.name,
      description: form.description,
      fields: form.fields,
      ...(mode === "edit" && initialData?.forms?.[index]?.id
        ? { id: initialData.forms[index].id }
        : {}),
    }));
  };

  // Formu kaydetme
  const onSave = handleSubmit((data) => {
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
    <FormProvider {...methods}>
      <div className="flex h-screen bg-gray-50">
        <LeftSidebar
          fieldTypes={fieldTypes}
          draggedType={draggedType}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
        <div
          className="flex-1"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="p-6">
            <Breadcrumb
              className="mb-8"
              items={[
                { label: "Formlar", path: "/forms" },
                { label: mode === "edit" ? "Form Düzenle" : "Yeni Form" },
              ]}
            />
            <div className="mx-auto max-w-3xl">
              <ScrollArea className="h-[calc(100vh-100px)]">
                <h2 className="mb-4 text-xl font-semibold">
                  {methods.watch("forms.0.name") || "Ana Form"}
                </h2>
                {mainFormFields.length > 0 ? (
                  <div className="rounded-lg border-2 border-dashed p-4 text-center">
                    <DndContext
                      collisionDetection={closestCenter}
                      onDragEnd={onDragEnd}
                    >
                      <SortableContext
                        items={mainFormFields.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {mainFormFields.map((field, index) => (
                            <SortableFieldItem
                              key={field.id}
                              field={field}
                              index={index}
                              onRemove={(id) => handleRemoveField(id, false)}
                              onUpdate={(id, updates) =>
                                handleUpdateField(id, updates, false)
                              }
                            >
                              <FieldPreview field={field} />
                            </SortableFieldItem>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed py-12 text-center">
                    <p className="text-muted-foreground">
                      Form elemanı sürükleyip bırakarak bu alanı
                      doldurabilirsiniz.
                    </p>
                  </div>
                )}
                <FollowUpFormSection draggedType={draggedType} />
              </ScrollArea>
            </div>
          </div>
        </div>
        <RightSidebar onSave={onSave} mode={mode} />
      </div>
    </FormProvider>
  );
}
