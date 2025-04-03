import SparePartsService from "@/services/sparePartsService";

import { create } from "zustand";

// State types
const initialState = {
  // Data
  products: [],
  filteredProducts: [],
  productSpareParts: [],
  selectedProduct: null,
  searchQuery: "",

  // UI State
  loading: false,
  error: null,

  // Pagination
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalElements: 0,

  // Dialogs
  isAddPartOpen: false,
  isEditPartOpen: false,
  isDeleteDialogOpen: false,
  currentPart: null,
};

// Store actions
const actions = (set, get) => ({
  // Data fetching
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const { currentPage, pageSize, searchQuery } = get();
      const response = await SparePartsService.getProducts(
        searchQuery,
        currentPage,
        pageSize,
      );

      set({
        products: response.content,
        filteredProducts: response.content,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ error: "Ürünler yüklenirken bir hata oluştu.", loading: false });
    }
  },

  fetchProductSpareParts: async (productId) => {
    try {
      set({ loading: true, error: null });
      const spareParts =
        await SparePartsService.getProductSpareParts(productId);
      set({ productSpareParts: spareParts, loading: false });
    } catch (error) {
      console.error("Error fetching product spare parts:", error);
      set({
        error: "Yedek parçalar yüklenirken bir hata oluştu.",
        loading: false,
      });
    }
  },

  // CRUD operations
  createProductSparePart: async (values) => {
    const { selectedProduct } = get();
    if (!selectedProduct) return;

    try {
      set({ loading: true, error: null });
      await SparePartsService.createSparePart({
        ...values,
        productId: selectedProduct.id,
      });

      // Fetch fresh data after creation
      await get().fetchProductSpareParts(selectedProduct.id);
      set({ isAddPartOpen: false });
    } catch (error) {
      console.error("Error creating spare part:", error);
      set({ error: "Yedek parça eklenirken bir hata oluştu.", loading: false });
    }
  },

  updateProductSparePart: async (id, values) => {
    try {
      set({ loading: true, error: null });
      await SparePartsService.updateSparePart(id, values);

      // Fetch fresh data after update
      const { selectedProduct } = get();
      await get().fetchProductSpareParts(selectedProduct.id);
      set({ isEditPartOpen: false });
    } catch (error) {
      console.error("Error updating spare part:", error);
      set({
        error: "Yedek parça güncellenirken bir hata oluştu.",
        loading: false,
      });
    }
  },

  deleteProductSparePart: async (id) => {
    try {
      set({ loading: true, error: null });
      await SparePartsService.deleteSparePart(id);

      // Fetch fresh data after deletion
      const { selectedProduct } = get();
      await get().fetchProductSpareParts(selectedProduct.id);
      set({ isDeleteDialogOpen: false });
    } catch (error) {
      console.error("Error deleting spare part:", error);
      set({ error: "Yedek parça silinirken bir hata oluştu.", loading: false });
    }
  },

  // Bulk operations
  bulkCreate: async (file) => {
    const { selectedProduct } = get();
    if (!selectedProduct) return false;

    try {
      set({ loading: true, error: null });
      await SparePartsService.bulkCreateSpareParts(file, selectedProduct.id);

      // Fetch fresh data after bulk creation
      await get().fetchProductSpareParts(selectedProduct.id);
      return true;
    } catch (error) {
      console.error("Error bulk creating spare parts:", error);
      set({
        error: "Toplu yükleme sırasında bir hata oluştu.",
        loading: false,
      });
      return false;
    }
  },

  // State setters
  setPage: (page) => {
    set({ currentPage: page });
    get().fetchProducts();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
  },

  setSelectedProduct: (product) => {
    set({ selectedProduct: product });
    if (product) {
      get().fetchProductSpareParts(product.id);
    } else {
      set({ productSpareParts: [] });
    }
  },

  setIsAddPartOpen: (isOpen) =>
    set({ isAddPartOpen: isOpen, ...(isOpen ? {} : { currentPart: null }) }),
  setIsEditPartOpen: (isOpen) =>
    set({ isEditPartOpen: isOpen, ...(isOpen ? {} : { currentPart: null }) }),
  setIsDeleteDialogOpen: (isOpen) =>
    set({
      isDeleteDialogOpen: isOpen,
      ...(isOpen ? {} : { currentPart: null }),
    }),
  setCurrentPart: (part) => set({ currentPart: part }),
});

export const useSparePartsStore = create((set, get) => ({
  ...initialState,
  ...actions(set, get),
}));
