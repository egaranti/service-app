import { Button, Input, Pagination, ScrollArea } from "@egaranti/components";

import React, { useCallback, useEffect, useState } from "react";

import { useSparePartsStore } from "@/stores/useSparePartsStore";

import AddSparePartDialog from "@/components/spare-parts/addSparePartDialog";
import DeleteSparePartDialog from "@/components/spare-parts/deleteSparePartDialog";
import SparePartsTable from "@/components/spare-parts/sparePartsTable";
import BulkUploadDialog from "@/components/spare-parts/bulkUploadDialog";

import { Plus, Search, X } from "lucide-react";

import useDebounce from "@/hooks/useDebounce";

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

const ProductList = ({
  products,
  selectedProduct,
  onSelect,
  searchQuery,
  onSearchChange,
  onClearSearch,
  pagination,
}) => (
  <div className="w-1/3 overflow-auto rounded-lg rounded-r border-r bg-white">
    <div className="border-b p-4">
      <h2 className="text-lg font-medium">Ürünler</h2>
      <div className="relative mt-2">
        <Search className="absolute left-2.5 top-4 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Ürün ara..."
          className="pl-8 pr-8"
          value={searchQuery}
          onChange={onSearchChange}
        />
        {searchQuery && (
          <button
            className="absolute right-2.5 top-4 h-4 w-4 text-gray-400 hover:text-gray-600"
            onClick={onClearSearch}
            aria-label="Aramayı temizle"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
    <ScrollArea className="max-h-[calc(100vh-350px)] divide-y overflow-auto">
      {products.map((product) => (
        <div
          key={product.id}
          className={`cursor-pointer border-b p-4 ${selectedProduct?.id === product.id ? "bg-gray-100" : "hover:bg-gray-50"}`}
          onClick={() => onSelect(product)}
        >
          <div className="font-medium">{product.name}</div>
          <div className="mt-1 text-sm text-gray-500">{product.model}</div>
        </div>
      ))}
      {products.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          Arama kriterine uygun ürün bulunamadı
        </div>
      )}
    </ScrollArea>
    <div className="border-t p-4">
      <Pagination {...pagination} />
    </div>
  </div>
);

const SparePartsSection = ({
  product,
  spareParts,
  onAdd,
  onEdit,
  onDelete,
  loading,
}) => {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = React.useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg">
      <div className="border-b bg-white p-4">
        <h1 className="text-xl font-bold">{product.name}</h1>
        <p className="text-gray-500">Model: {product.model}</p>
      </div>
      <div className="flex-1 overflow-auto rounded-r p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Yedek Parçalar</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setIsBulkUploadOpen(true)} variant="secondaryGray">
              <Plus className="mr-2 h-4 w-4" /> Toplu Yükle
            </Button>
            <Button size="sm" onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" /> Yeni Parça Ekle
            </Button>
          </div>
        </div>
        <SparePartsTable
          spareParts={spareParts}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
        />
      </div>
      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        onSuccess={() => {
          // Refresh will happen automatically through the store
        }}
      />
    </div>
  );
};

const SpareParts = () => {
  const {
    loading,
    error,
    products,
    filteredProducts,
    searchQuery,
    productSpareParts,
    selectedProduct,
    currentPage,
    totalPages,
    isAddPartOpen,
    isEditPartOpen,
    isDeleteDialogOpen,
    currentPart,
    fetchProducts,
    setSearchQuery,
    setSelectedProduct,
    setPage,
    setIsAddPartOpen,
    setIsEditPartOpen,
    setIsDeleteDialogOpen,
    setCurrentPart,
    deleteProductSparePart,
  } = useSparePartsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const debouncedSearch = useDebounce(() => {
    fetchProducts();
  }, 500);

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchQuery(value);
      debouncedSearch();
    },
    [setSearchQuery, debouncedSearch],
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    fetchProducts();
  }, [setSearchQuery, fetchProducts]);

  const handlePageChange = useCallback((page) => setPage(page), [setPage]);
  const handleOpenAddDialog = useCallback(
    () => setIsAddPartOpen(true),
    [setIsAddPartOpen],
  );
  const handleEditPart = useCallback(
    (part) => {
      setCurrentPart(part);
      setIsEditPartOpen(true);
    },
    [setCurrentPart, setIsEditPartOpen],
  );
  const handleDeletePart = useCallback(
    (part) => {
      setCurrentPart(part);
      setIsDeleteDialogOpen(true);
    },
    [setCurrentPart, setIsDeleteDialogOpen],
  );
  const handleConfirmDelete = useCallback(async () => {
    if (currentPart) {
      await deleteProductSparePart(currentPart.id);
      fetchProducts();
    }
  }, [currentPart, deleteProductSparePart, fetchProducts]);

  if (loading && products.length === 0) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchProducts} />;

  return (
    <div className="min-h-screen bg-[#f9fafc]">
      <main className="container mx-auto flex flex-col px-4 py-8">
        <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold text-[#111729]">
              Yedek Parçalar
            </h1>
            <p className="text-md mt-1 text-[#717680]">
              Bu sayfada yedek parçaları oluşturabilir, düzenleyebilirsiniz.
            </p>
          </div>
        </div>
        <div className="flex rounded-lg border bg-white shadow-sm">
          <ProductList
            products={filteredProducts}
            selectedProduct={selectedProduct}
            onSelect={setSelectedProduct}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: handlePageChange,
              pageSize: 10,
            }}
          />
          {selectedProduct ? (
            <SparePartsSection
              product={selectedProduct}
              spareParts={productSpareParts}
              onAdd={handleOpenAddDialog}
              onEdit={handleEditPart}
              onDelete={handleDeletePart}
              loading={loading}
            />
          ) : (
            <div className="flex h-full flex-1 items-center justify-center py-12 text-gray-500">
              Lütfen soldan bir ürün seçin
            </div>
          )}
        </div>
      </main>
      <AddSparePartDialog
        open={isAddPartOpen || isEditPartOpen}
        onOpenChange={(open) =>
          isEditPartOpen ? setIsEditPartOpen(open) : setIsAddPartOpen(open)
        }
        editData={isEditPartOpen ? currentPart : null}
        selectedProduct={selectedProduct}
      />
      <DeleteSparePartDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        part={currentPart}
      />
    </div>
  );
};

export default SpareParts;
