import { Button, Input, ScrollArea, Tabs } from "@egaranti/components";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import DynamicForm from "../DynamicForm";

const RightSidebar = ({ onSave, mode }) => {
  const [activeView, setActiveView] = useState("settings"); // settings or preview
  const [activePreviewTab, setActivePreviewTab] = useState("main");
  const { watch, setValue } = useFormContext();
  const forms = watch("forms");
  const mainForm = forms[0];
  const followUpForm = forms[1];
  const hasFollowUpFields = followUpForm?.fields?.length > 0;

  const handleNameChange = (index, value) => {
    setValue(`forms.${index}.title`, value);
  };

  const formTitleOptions = [
    { value: "SERVICE", label: "Service" },
    { value: "WARRANTY", label: "Warranty" },
    { value: "DEMAND", label: "Demand" },
    { value: "SETUP", label: "Setup" },
    { value: "OPERATION", label: "Operation" },
  ];

  return (
    <div className="flex h-full flex-col justify-between border-l border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {activeView === "settings" ? "Form Ayarları" : "Önizleme"}
          </h2>
          <div className="relative">
            {/* blue dot effect right corner button live effect  */}
            {activeView === "settings" && (
              <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-blue-600"></span>
            )}
            <Button
              onClick={() =>
                setActiveView(
                  activeView === "settings" ? "preview" : "settings",
                )
              }
              variant="secondaryColor"
              size="sm"
            >
              {activeView === "settings" ? "Önizleme" : "Ayarlar"}
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {activeView === "settings" ? (
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Form Türü
                  </label>
                  <select
                    className="select select-bordered select-sm w-full"
                    value={mainForm.title}
                    onChange={(e) => handleNameChange(0, e.target.value)}
                  >
                    {formTitleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hasFollowUpFields && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Form Türü
                  </label>
                  <select
                    className="select select-bordered select-sm w-full"
                    value={followUpForm.title}
                    onChange={(e) => handleNameChange(1, e.target.value)}
                  >
                    {formTitleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <Button onClick={onSave} className="w-full">
                {mode === "edit" ? "Güncelle" : "Kaydet"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {hasFollowUpFields ? (
                <>
                  <Tabs
                    tabs={[
                      {
                        id: "main",
                        title: forms[0].title || "Ana Form",
                      },
                      {
                        id: "followUp",
                        title: forms[1].title || "Takip Formu",
                      },
                    ]}
                    selectedTabId={activePreviewTab}
                    onTabChange={setActivePreviewTab}
                  />
                  <div className="mt-4">
                    <DynamicForm
                      fields={
                        activePreviewTab === "main"
                          ? mainForm.fields?.map((field) => ({
                              name: `field_${field.id}`,
                              label: field.label,
                              type: field.type,
                              required: field.required,
                              placeholder: field.placeholder,
                              options: field.options,
                              status: field.status,
                              employees: field.employees,
                              hidden: field.hiddenForCustomer,
                            }))
                          : followUpForm.fields?.map((field) => ({
                              name: `field_${field.id}`,
                              label: field.label,
                              type: field.type,
                              required: field.required,
                              placeholder: field.placeholder,
                              options: field.options,
                              status: field.status,
                              employees: field.employees,
                              hidden: field.hiddenForCustomer,
                            }))
                      }
                      className="space-y-4"
                    />
                  </div>
                </>
              ) : (
                <DynamicForm
                  fields={mainForm.fields?.map((field) => ({
                    name: `field_${field.id}`,
                    label: field.label,
                    type: field.type,
                    required: field.required,
                    placeholder: field.placeholder,
                    options: field.options,
                    hidden: field.hiddenForCustomer,
                  }))}
                  className="space-y-4"
                />
              )}
              {mainForm.fields.length === 0 &&
                followUpForm.fields.length === 0 && (
                  <p className="mt-4 rounded-lg bg-blue-200 p-1 text-center text-sm text-gray-50 text-gray-500">
                    Sol menüden bir form oluşturunuz.
                  </p>
                )}
            </div>
          )}
        </div>
      </ScrollArea>

      <span className="p-2 pb-1 text-end text-xs text-gray-300">
        egaranti form builder v1.0
      </span>
    </div>
  );
};

export default RightSidebar;
