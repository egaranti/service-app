import { ScrollArea, useToast } from "@egaranti/components";

import React from "react";
import { FormProvider } from "react-hook-form";

import FormSection from "./components/FormSection";
import LeftSidebar from "./components/leftSidebar";
import RightSidebar from "./components/rightSidebar";
import { DEFAULT_TITLES, FORM_MODES } from "./constants";
import { getAllFieldTypes } from "./fields";
import { useFormBuilder } from "./hooks/useFormBuilder";

import Breadcrumb from "@/components/ui/breadcrumb";
import { MessageBanner } from "@/components/ui/messageBanner";
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
    draggedType,
    handleDragStart,
    handleDragEnd,
    errorMessage,
    showErrorBanner,
    setErrorMessage,
    setShowErrorBanner,
  } = useFormBuilder(initialData);

  const { handleSubmit } = methods;
  const fieldTypes = getAllFieldTypes();

  const handleError = (message) => {
    setErrorMessage(message);
    setShowErrorBanner(true);
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
        fields: form.fields.map((field) => {
          // If field has no id but has clientId, use clientId as temporary id
          // The backend will replace this with a real ID when saving
          const fieldData = {
            ...field,
            // Use clientId as temporary id if id is null
            id: field.id,
            order: field.order || 0,
            required: field.required || false,
            hiddenForCustomer: field.hiddenForCustomer || false,
            placeholder: field.placeholder || "",
            options: field.options || [],
            merchantConstantId: field.merchantConstantId || null,
            hasMultiplier: field.hasMultiplier || false,
          };

          // Remove clientId from the data sent to backend
          if (fieldData.clientId) {
            delete fieldData.clientId;
          }

          return fieldData;
        }),
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
                {showErrorBanner && (
                  <MessageBanner
                    message={errorMessage}
                    type="warning"
                    onClose={() => setShowErrorBanner(false)}
                    autoCloseTime={5000}
                  />
                )}

                {/* Main Form Section */}
                <FormSection
                  formIndex={0}
                  title={
                    methods.watch("forms.0.title") || DEFAULT_TITLES.MAIN_FORM
                  }
                  draggedType={draggedType}
                  onError={handleError}
                />

                {/* Follow-up Form Section */}
                <FormSection
                  formIndex={1}
                  title={
                    methods.watch("forms.1.title") ||
                    DEFAULT_TITLES.FOLLOW_UP_FORM
                  }
                  draggedType={draggedType}
                  onError={handleError}
                  isFollowUp
                  dependsOn={0}
                  onRemove={() => {
                    methods.setValue("forms.1.fields", []);
                    methods.setValue("forms.1.title", "");
                    methods.setValue("forms.1.orderKey", "form_2");
                  }}
                />
              </ScrollArea>
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
