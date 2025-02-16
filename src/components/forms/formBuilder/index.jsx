import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ScrollArea, useToast } from "@egaranti/components";

import React from "react";
import { FormProvider } from "react-hook-form";

import { DEFAULT_TITLES, FORM_MODES } from "./constants";
import { getAllFieldTypes } from "./fields";
import FollowUpFormSection from "./FollowUpFormSection";
import { useFormBuilder } from "./hooks/useFormBuilder";
import LeftSidebar from "./leftSidebar";
import RightSidebar from "./rightSidebar";
import SortableFieldItem from "./sortableFieldItem";

import Breadcrumb from "@/components/shared/breadcrumb";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizeable";

export default function FormBuilder({
  initialData,
  onSubmit,
  mode = FORM_MODES.NEW,
}) {
  const { toast } = useToast();
  const {
    methods,
    mainFormArray,
    followUpFormArray,
    draggedType,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  } = useFormBuilder(initialData);

  const { handleSubmit } = methods;
  const fieldTypes = getAllFieldTypes();

  // Güncelleme fonksiyonu: Herhangi bir alana ait güncelleme yapıldığında
  const handleUpdateField = (id, updates, isFollowUp = false) => {
    const fields = isFollowUp ? followUpFormArray.fields : mainFormArray.fields;
    const index = fields.findIndex((field) => field.id === id);
    if (index !== -1) {
      if (isFollowUp) {
        followUpFormArray.update(index, { ...fields[index], ...updates });
      } else {
        mainFormArray.update(index, { ...fields[index], ...updates });
      }
    }
  };

  // Alanı kaldırma
  const handleRemoveField = (id, isFollowUp = false) => {
    const fields = isFollowUp ? followUpFormArray.fields : mainFormArray.fields;
    const index = fields.findIndex((field) => field.id === id);
    if (index !== -1) {
      if (isFollowUp) {
        followUpFormArray.remove(index);
      } else {
        mainFormArray.remove(index);
      }
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

    const fields = isFollowUpSource
      ? followUpFormArray.fields
      : mainFormArray.fields;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);

    if (isFollowUpSource) {
      followUpFormArray.move(oldIndex, newIndex);
    } else {
      mainFormArray.move(oldIndex, newIndex);
    }
  };

  // Form verilerini hazırlama
  const prepareFormData = (data) => {
    return data.forms
      .filter((form) => form.fields && form.fields.length > 0) // Remove forms with empty fields
      .map((form) => ({
        id: form.id,
        orderKey: form.orderKey,
        title: form.title,
        parentFormId: form.parentFormId,
        fields: form.fields.map((field) => ({
          ...field,
          order: field.order || 0,
          required: field.required || false,
          hiddenForCustomer: field.hiddenForCustomer || false,
          placeholder: field.placeholder || "",
          options: field.options || [],
          status: field.status || [],
          merchantId: 25,
        })),
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
      <ResizablePanelGroup
        className="max-h-screen bg-gray-50"
        direction="horizontal"
      >
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <LeftSidebar
            fieldTypes={fieldTypes}
            draggedType={draggedType}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60} minSize={10}>
          <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
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
                    {methods.watch("forms.0.title") || DEFAULT_TITLES.MAIN_FORM}
                  </h2>
                  {mainFormArray.fields.length > 0 ? (
                    <div className="rounded-lg border-2 border-dashed p-4 text-center">
                      <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={onDragEnd}
                      >
                        <SortableContext
                          items={mainFormArray.fields.map((f) => f.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-4">
                            {mainFormArray.fields.map((field, index) => (
                              <SortableFieldItem
                                key={field.id}
                                field={field}
                                index={index}
                                onRemove={(id) => handleRemoveField(id, false)}
                                onUpdate={(id, updates) =>
                                  handleUpdateField(id, updates, false)
                                }
                              />
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
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={15} maxSize={45}>
          <RightSidebar onSave={onSave} mode={mode} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </FormProvider>
  );
}
