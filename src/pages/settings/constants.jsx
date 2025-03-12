import { Button, Input } from "@egaranti/components";

import React, { useEffect, useState } from "react";

import { useSettingsStore } from "@/stores/useSettingsStore";

import FormContainer from "@/components/settings/formContainer";
import SettingsList from "@/components/settings/settingsList";

import { Loader2, Plus, Settings2 } from "lucide-react";

const Constants = () => {
  const {
    constants,
    isLoading,
    error,
    fetchConstants,
    addConstant,
    updateConstant,
    deleteConstant,
  } = useSettingsStore();
  const [newConstant, setNewConstant] = useState({ name: "", value: "" });
  const [editingConstant, setEditingConstant] = useState(null);
  const [editingValues, setEditingValues] = useState({ name: "", value: "" });

  useEffect(() => {
    fetchConstants();
  }, [fetchConstants]);

  const handleAddConstant = async () => {
    if (newConstant.name) {
      try {
        await addConstant(newConstant);
        setNewConstant({ name: "", value: "" });
      } catch (error) {
        console.error("Failed to add constant:", error);
      }
    }
  };

  const handleEditConstant = (constant) => {
    setEditingConstant(constant);
    setEditingValues({ name: constant.name, value: constant.value.toString() });
  };

  const handleUpdateConstant = async () => {
    if (editingValues.name.trim() && String(editingValues.value).trim()) {
      try {
        await updateConstant(editingConstant.id, {
          ...editingConstant,
          ...editingValues,
        });
        setEditingConstant(null);
        setEditingValues({ name: "", value: "" });
      } catch (error) {
        console.error("Failed to update constant:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingConstant(null);
    setEditingValues({ name: "", value: "" });
  };

  return (
    <FormContainer
      title="Sabitler Ayarları"
      description="Bu sayfada sabit değerlerinizi oluşturabilir, düzenleyebilirsiniz."
      icon={Settings2}
      hasChanges={false}
      isLoading={isLoading}
      onSave={() => {}}
    >
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-medium text-[#111729]">Sabitler</h2>
      </div>

      <div className="mb-6 flex gap-3">
        <Input
          value={newConstant.name}
          onChange={(e) =>
            setNewConstant({ ...newConstant, name: e.target.value })
          }
          placeholder="KM Başı Ücret"
          className="flex-1"
          disabled={isLoading}
        />
        <Input
          value={newConstant.value}
          onChange={(e) =>
            setNewConstant({ ...newConstant, value: e.target.value.toString() })
          }
          type="number"
          placeholder="Değer (örn: 0.18, 30.5)"
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          onClick={handleAddConstant}
          disabled={
            isLoading || !newConstant.name.trim() || !newConstant.value.trim()
          }
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Ekle
        </Button>
      </div>

      <SettingsList
        items={constants}
        isLoading={isLoading}
        onEdit={{
          onStart: handleEditConstant,
          onSave: handleUpdateConstant,
          onCancel: handleCancelEdit,
          isValid:
            editingValues.name.trim() && String(editingValues.value).trim(),
        }}
        onDelete={(constant) => deleteConstant(constant.id)}
        editingItem={editingConstant}
        editComponent={
          <div className="flex w-full items-center gap-3">
            <Input
              value={editingValues.name}
              onChange={(e) =>
                setEditingValues({ ...editingValues, name: e.target.value })
              }
              disabled={isLoading}
              className="w-full"
              placeholder="Sabit adı"
            />
            <Input
              value={editingValues.value}
              onChange={(e) =>
                setEditingValues({
                  ...editingValues,
                  value: e.target.value.toString(),
                })
              }
              disabled={isLoading}
              className="w-full"
              placeholder="Değer"
              type="number"
            />
          </div>
        }
        renderItemContent={(constant) => (
          <div className="flex items-center gap-6">
            <span className="font-medium text-[#111729]">{constant.name}</span>
            <span className="text-[#717680]">{constant.value}</span>
          </div>
        )}
      />
    </FormContainer>
  );
};

export default Constants;
