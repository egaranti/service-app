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
                    Form Adı
                  </label>
                  <Input
                    value={mainForm.title}
                    onChange={(e) => handleNameChange(0, e.target.value)}
                    placeholder="Form adını giriniz"
                  />
                </div>
              </div>

              {hasFollowUpFields && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Form Adı
                  </label>
                  <Input
                    value={followUpForm.title}
                    onChange={(e) => handleNameChange(1, e.target.value)}
                    placeholder="Form adını giriniz"
                  />
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
                          ? mainForm.fields
                          : followUpForm.fields
                      }
                      isEditing={false}
                      className="space-y-4"
                    />
                  </div>
                </>
              ) : (
                <DynamicForm
                  fields={mainForm.fields}
                  isEditing={false}
                  className="space-y-4"
                />
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
