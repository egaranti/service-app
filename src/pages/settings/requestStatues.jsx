import { Button, Input } from "@egaranti/components";

import React, { useEffect, useState } from "react";

import { useSettingsStore } from "@/stores/useSettingsStore";

import FormContainer from "@/components/settings/formContainer";
import SettingsList from "@/components/settings/settingsList";

import { Loader2, Plus, Settings } from "lucide-react";

const RequestStatuses = () => {
  const {
    requestStatuses,
    isLoading,
    error,
    fetchRequestStatuses,
    addRequestStatus,
    deleteRequestStatus,
    updateRequestStatus,
  } = useSettingsStore();

  const [newStatus, setNewStatus] = useState("");
  const [editingStatus, setEditingStatus] = useState(null);
  const [editingStatusName, setEditingStatusName] = useState("");

  useEffect(() => {
    fetchRequestStatuses();
  }, [fetchRequestStatuses]);

  const handleAddStatus = async () => {
    if (newStatus?.trim()) {
      try {
        await addRequestStatus({ status: newStatus?.trim() });
        setNewStatus("");
      } catch (error) {
        console.error("Failed to add status:", error);
      }
    }
  };

  const handleEditStatus = (status) => {
    setEditingStatus(status);
    setEditingStatusName(status.status);
  };

  const handleUpdateStatus = async () => {
    if (editingStatusName.trim()) {
      try {
        await updateRequestStatus({
          id: editingStatus.id,
          status: editingStatusName.trim(),
        });
        setEditingStatus(null);
        setEditingStatusName("");
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingStatus(null);
    setEditingStatusName("");
  };

  return (
    <FormContainer
      title="Talep Ayarları"
      description="Bu sayfada talep durumlarınızı oluşturabilir, düzenleyebilirsiniz."
      icon={Settings}
      hasChanges={false}
      isLoading={isLoading}
      onSave={() => {}}
    >
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-medium text-[#111729]">Talep Durumları</h2>
      </div>

      <div className="mb-6 flex gap-3">
        <Input
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          placeholder="Yeni durum girin"
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          onClick={handleAddStatus}
          disabled={isLoading || !newStatus.trim()}
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
        items={requestStatuses}
        isLoading={isLoading}
        onEdit={{
          onStart: handleEditStatus,
          onSave: handleUpdateStatus,
          onCancel: handleCancelEdit,
          isValid: editingStatusName.trim(),
        }}
        onDelete={(status) => deleteRequestStatus(status.id)}
        editingItem={editingStatus}
        editComponent={
          <div className="flex w-full items-center gap-3">
            <Input
              value={editingStatusName}
              onChange={(e) => setEditingStatusName(e.target.value)}
              disabled={isLoading}
              className="w-full"
              placeholder="Durum adı"
            />
          </div>
        }
        renderItemContent={(status) => (
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#111729]">{status.status}</span>
          </div>
        )}
      />
    </FormContainer>
  );
};

export default RequestStatuses;
