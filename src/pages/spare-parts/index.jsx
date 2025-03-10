import { Button } from "@egaranti/components";

import React, { useEffect, useState } from "react";

import { useSparePartsStore } from "@/stores/useSparePartsStore";

import AddPartDialog from "@/components/spare-parts/dialogs/add-part-dialog";
import ConfirmDialog from "@/components/spare-parts/dialogs/confirm-dialog";
import PartTreeView from "@/components/spare-parts/part-tree-view";

import { Plus } from "lucide-react";

const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
    <p className="mb-4 text-red-600">{error}</p>
    <Button onClick={onRetry} variant="secondaryGray">
      Tekrar Dene
    </Button>
  </div>
);

const SpareParts = () => {
  const {
    parts,
    loading,
    error,
    fetchParts,
    createPart,
    updatePart,
    deletePart,
    addSubpart,
  } = useSparePartsStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [partToDelete, setPartToDelete] = useState(null);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  const handleAddPart = (formData) => {
    if (editingPart) {
      updatePart(editingPart.id, formData);
    } else if (selectedParentId) {
      addSubpart(selectedParentId, formData);
    } else {
      createPart(formData);
    }
  };

  const handleAddClick = () => {
    setEditingPart(null);
    setSelectedParentId(null);
    setDialogOpen(true);
  };

  const handleAddSubpartClick = (parentId) => {
    setEditingPart(null);
    setSelectedParentId(parentId);
    setDialogOpen(true);
  };

  const handleEditClick = (part) => {
    setEditingPart(part);
    setSelectedParentId(null);
    setDialogOpen(true);
  };

  const handleDeleteClick = (partId) => {
    setPartToDelete(partId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (partToDelete) {
      deletePart(partToDelete);
    }
  };

  if (loading && parts.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          fetchParts();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafc]">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex flex-col sm:mb-0 md:gap-4">
            <h1 className="text-2xl font-semibold text-[#111729]">
              Yedek Parçalar
            </h1>
            <p className="text-[#717680]">
              Bu sayfada yedek parçaları ağaç yapısında görüntüleyebilir,
              düzenleyebilir ve yeni parçalar ekleyebilirsiniz.
            </p>
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <Button
              className="flex items-center gap-2"
              onClick={handleAddClick}
            >
              <Plus className="h-4 w-4" />
              Yeni Ana Parça Ekle
            </Button>
          </div>
        </div>

        <PartTreeView
          parts={parts}
          onAddSubpart={handleAddSubpartClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </main>

      <AddPartDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleAddPart}
        parentId={selectedParentId}
        editData={editingPart}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Parçayı Sil"
        message="Bu parçayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve alt parçalar da silinecektir."
      />
    </div>
  );
};

export default SpareParts;
