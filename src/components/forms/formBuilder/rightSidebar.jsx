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
    <div className="w-[300px] border-l border-gray-200 bg-white">
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
    </div>
  );
};

export default RightSidebar;
