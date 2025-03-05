import { Button, Input } from "@egaranti/components";

import React, { useEffect, useState } from "react";

import { useSettingsStore } from "@/stores/useSettingsStore";

import FormContainer from "@/components/settings/formContainer";

import { Check, Edit2, Loader2, Plus, Settings, Trash2, X } from "lucide-react";

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
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatusName, setEditingStatusName] = useState("");

  useEffect(() => {
    fetchRequestStatuses();
  }, [fetchRequestStatuses]);

  const handleAddStatus = async () => {
    if (newStatus?.trim()) {
      try {
        await addRequestStatus({ status: newStatus?.trim() });
        setNewStatus("");
        // No need to refetch as it's now handled in the store
      } catch (error) {
        console.error("Failed to add status:", error);
      }
    }
  };

  const handleRemoveStatus = async (id) => {
    try {
      await deleteRequestStatus(id);
      // No need to refetch as it's now handled in the store
    } catch (error) {
      console.error("Failed to delete status:", error);
    }
  };

  const handleEditStatus = (status) => {
    setEditingStatusId(status.id);
    setEditingStatusName(status.status);
  };

  const handleUpdateStatus = async () => {
    if (editingStatusName.trim()) {
      try {
        await updateRequestStatus({
          id: editingStatusId,
          status: editingStatusName.trim(),
        });
        setEditingStatusId(null);
        setEditingStatusName("");
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingStatusId(null);
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

      {requestStatuses.length === 0 ? (
        <div className="rounded-xl border bg-slate-50 p-8 text-center">
          <p className="text-[#717680]">Henüz durum eklenmemiş.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {requestStatuses.map((status) => (
            <div
              key={status.id}
              className="flex items-center justify-between rounded-lg border bg-white p-4 hover:bg-slate-50"
            >
              {editingStatusId === status.id ? (
                <>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      value={editingStatusName}
                      onChange={(e) => setEditingStatusName(e.target.value)}
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <Button
                      onClick={handleUpdateStatus}
                      disabled={isLoading || !editingStatusName.trim()}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondaryGray"
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[#111729]">
                      {status.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditStatus(status)}
                      disabled={isLoading}
                      className="text-primary hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-full"
                      aria-label="Düzenle"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveStatus(status.id)}
                      disabled={isLoading}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </FormContainer>
  );
};

export default RequestStatuses;
