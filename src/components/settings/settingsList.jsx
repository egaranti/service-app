import { Button } from "@egaranti/components";

import React from "react";

import { Check, Edit2, Loader2, Plus, Trash2, X } from "lucide-react";

const SettingsList = ({
  items,
  isLoading,
  onEdit,
  onDelete,
  editingItem,
  editComponent,
  renderItemContent,
  renderItemActions,
}) => {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border bg-slate-50 p-8 text-center">
        <p className="text-[#717680]">Henüz öğe eklenmemiş.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className="flex items-center justify-between rounded-lg border bg-white p-4 hover:bg-slate-50"
        >
          {editingItem?.id === item.id ? (
            <>
              {editComponent}
              <div className="ml-4 flex items-center gap-2">
                <Button
                  onClick={() => onEdit.onSave(item)}
                  disabled={isLoading || !onEdit.isValid}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondaryGray"
                  onClick={onEdit.onCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              {renderItemContent(item)}
              <div className="flex items-center gap-2">
                {renderItemActions?.(item)}
                <button
                  onClick={() => onEdit.onStart(item)}
                  disabled={isLoading}
                  className="text-primary hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-full"
                  aria-label="Düzenle"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  disabled={isLoading}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-full"
                  aria-label="Sil"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SettingsList;
