import { Button, Input, Pagination, ScrollArea } from "@egaranti/components";

import React, { useEffect } from "react";

import { useSparePartsStore } from "@/stores/useSparePartsStore";

import AddSparePartDialog from "@/components/spare-parts/addSparePartDialog";
import DeleteSparePartDialog from "@/components/spare-parts/deleteSparePartDialog";
import SparePartsTable from "@/components/spare-parts/sparePartsTable";

import { Plus, Search, X } from "lucide-react";

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
    loading,
    error,

    // State properties
    products,
    filteredProducts,
    searchQuery,
    productSpareParts,
    selectedProduct,

    // Pagination state
    currentPage,
    totalPages,

    // Methods
    fetchProducts,
    setSearchQuery,
    setSelectedProduct,
    setPage,

    // Dialog state
    isAddPartOpen,
    isEditPartOpen,
    isDeleteDialogOpen,
    currentPart,

    // Dialog methods
    setIsAddPartOpen,
    setIsEditPartOpen,
    setIsDeleteDialogOpen,
    setCurrentPart,
    deleteProductSparePart,
  } = useSparePartsStore();

  useEffect(() => {
    // Fetch products on mount
    fetchProducts();
  }, [fetchProducts]);

  if (loading && products.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          fetchProducts();
        }}
      />
    );
  }

  const handleOpenAddDialog = () => {
    setIsAddPartOpen(true);
  };

  const handleEditPart = (part) => {
    setCurrentPart(part);
    setIsEditPartOpen(true);
  };

  const handleDeletePart = (part) => {
    setCurrentPart(part);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (currentPart) {
      await deleteProductSparePart(currentPart.id);
    }
  };

  // Arama işlevi - debounce eklenebilir
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

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
        {/* Left sidebar - Products */}
        <div className="flex rounded-lg border bg-white shadow-sm">
          <div className="w-1/3 overflow-auto rounded-lg rounded-r border-r bg-white">
            <div className="border-b p-4">
              <h2 className="text-lg font-medium">Ürünler</h2>
              {/* Arama kutusu */}
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-4 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Ürün ara..."
                  className="pl-8 pr-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button
                    className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400 hover:text-gray-600"
                    onClick={clearSearch}
                    aria-label="Aramayı temizle"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <ScrollArea className="max-h-[calc(100vh-350px)] divide-y overflow-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`cursor-pointer border-b p-4 ${
                    selectedProduct?.id === product.id
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {product.model}
                    </span>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  Arama kriterine uygun ürün bulunamadı
                </div>
              )}
            </ScrollArea>
            {/* Pagination */}
            <div className="border-t p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageSize={10}
              />
            </div>
          </div>
          {/* Right side - Product details and spare parts */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-lg">
            {selectedProduct ? (
              <>
                {/* Product header */}
                <div className="border-b bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold">
                        {selectedProduct.name}
                      </h1>
                      <p className="text-gray-500">
                        Model: {selectedProduct.model}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Spare parts section */}
                <div className="flex-1 overflow-auto rounded-r p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Yedek Parçalar</h2>
                    <Button size="sm" onClick={handleOpenAddDialog}>
                      <Plus className="mr-2 h-4 w-4" />
                      Yeni Parça Ekle
                    </Button>
                  </div>

                  {/* Spare parts table */}
                  <SparePartsTable
                    spareParts={productSpareParts}
                    onEdit={handleEditPart}
                    onDelete={handleDeletePart}
                    loading={loading}
                  />
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                Lütfen soldan bir ürün seçin
              </div>
            )}
          </div>
        </div>
      </main>

      <AddSparePartDialog
        open={isAddPartOpen || isEditPartOpen}
        onOpenChange={(open) => {
          if (!open) {
            isEditPartOpen ? setIsEditPartOpen(false) : setIsAddPartOpen(false);
          }
        }}
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
