import { Button } from "@egaranti/components";

import React, { useEffect, useState } from "react";

import AddSparePartDialog from "@/components/spare-parts/addSparePartDialog";
import BulkUploadDialog from "@/components/spare-parts/bulkUploadDialog";
import SparePartsTable from "@/components/spare-parts/sparePartsTable";
import { useSparePartsStore } from "@/stores/useSparePartsStore";

import { Plus, Upload } from "lucide-react";

const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
    <p className="mb-4 text-red-600">{error}</p>
    <Button onClick={onRetry} variant="outline">
      Tekrar Dene
    </Button>
  </div>
);

const SpareParts = () => {
  const { spareParts, loading, error, fetchSpareParts } = useSparePartsStore();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    fetchSpareParts();
  }, [fetchSpareParts]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          fetchSpareParts();
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
              Bu sayfada yedek parçaları oluşturabilir, düzenleyebilirsiniz.
            </p>
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <Button
              variant="secondaryColor"
              className="flex items-center gap-2"
              onClick={() => setOpenBulkUpload(true)}
            >
              <Upload className="h-4 w-4" />
              Toplu Yükle
            </Button>

            <Button
              className="flex items-center gap-2"
              onClick={() => {
                setEditingData(null);
                setOpenAddDialog(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Yeni Yedek Parça
            </Button>
          </div>
        </div>

        <SparePartsTable
          spareParts={spareParts}
          onEdit={(part) => {
            setEditingData(part);
            setOpenAddDialog(true);
          }}
        />
      </main>

      <BulkUploadDialog
        open={openBulkUpload}
        onOpenChange={setOpenBulkUpload}
        onSuccess={fetchSpareParts}
      />

      <AddSparePartDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onSuccess={fetchSpareParts}
        editData={editingData}
      />
    </div>
  );
};

export default SpareParts;
