import { Button, Input, ScrollArea } from "@egaranti/components";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import PreviewDialog from "./PreviewDialog";

const RightSidebar = ({ onSave, mode }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { watch, setValue } = useFormContext();
  const forms = watch("forms");
  const mainForm = forms[0];
  const followUpForm = forms[1];
  const hasFollowUpFields = followUpForm?.fields?.length > 0;

  const handleNameChange = (index, value) => {
    setValue(`forms.${index}.title`, value);
  };
  console.log(forms);
  return (
    <div className="flex w-[300px] flex-col justify-between border-l border-gray-200 bg-white">
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Form Ayarları</h2>
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
              <div className="space-y-4">
                <h3 className="text-md font-medium">Takip Formu</h3>
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
              </div>
            )}
          </div>
          <div className="mt-8 space-y-4">
            <Button
              onClick={() => setPreviewOpen(true)}
              variant="secondaryColor"
              className="w-full"
            >
              Önizleme
            </Button>
            <Button onClick={onSave} className="w-full">
              {mode === "edit" ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </div>
      </ScrollArea>
      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        forms={forms}
      />
      <span className="p-2 pb-1 text-end text-xs text-gray-300">
        egaranti form builder v1.0
      </span>
    </div>
  );
};

export default RightSidebar;
