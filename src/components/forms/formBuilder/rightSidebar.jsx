import { Button, Input, ScrollArea, Textarea } from "@egaranti/components";

import React from "react";

const RightSidebar = ({
  formName,
  formDescription,
  onNameChange,
  onDescriptionChange,
  onSave,
  mode,
}) => {
  return (
    <div className="flex w-[300px] flex-col justify-between border-l border-gray-200 bg-white">
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Form Ayarları</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Form Adı
              </label>
              <Input
                value={formName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Form adını giriniz"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Form Açıklaması
              </label>
              <Textarea
                value={formDescription}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="Form açıklamasını giriniz"
                rows={2}
              />
            </div>
          </div>
          <div className="mt-8">
            <Button onClick={onSave} className="w-full">
              {mode === "edit" ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </div>
      </ScrollArea>
      <span className="p-2 pb-1 text-end text-xs text-gray-300">
        egaranti form builder v1.0
      </span>
    </div>
  );
};

export default RightSidebar;
