import { toast } from "@egaranti/components";

import SparePartsService from "@/services/sparePartsService";

import { create } from "zustand";

export const useSparePartsStore = create((set, get) => ({
  // State
  loading: false,
  error: null,
  products: [],
  filteredProducts: [],
  searchQuery: "",
  selectedProduct: null,
  productSpareParts: [],
  // Pagination state
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalElements: 0,

  // Dialog state
  isAddPartOpen: false,
  isEditPartOpen: false,
  isDeleteDialogOpen: false,
  currentPart: null,

  // Methods for products and spare parts
  fetchProducts: async (searchQuery = "") => {
    try {
      set({ loading: true, error: null });
      const { currentPage, pageSize } = get();
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
        searchQuery,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({
        error: "Ürünler yüklenirken bir hata oluştu.",
        loading: false,
      });
    }
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchProducts(get().searchQuery);
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 }); // Reset to first page on new search
    get().fetchProducts(query);
  },

  setSelectedProduct: (product) => {
    set({ selectedProduct: product });
    if (product) {
      get().fetchProductSpareParts(product.id);
    } else {
      set({ productSpareParts: [] });
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

  setIsAddPartOpen: (isOpen) => {
    set({ isAddPartOpen: isOpen });
    if (!isOpen) {
      set({ currentPart: null });
    }
  },

  setIsEditPartOpen: (isOpen) => {
    set({ isEditPartOpen: isOpen });
    if (!isOpen) {
      set({ currentPart: null });
    }
  },

  setIsDeleteDialogOpen: (isOpen) => {
    set({ isDeleteDialogOpen: isOpen });
    if (!isOpen) {
      set({ currentPart: null });
    }
  },

  setCurrentPart: (part) => {
    set({ currentPart: part });
  },

  createProductSparePart: async (values) => {
    const { selectedProduct } = get();
    if (!selectedProduct) return;

    try {
      set({ loading: true, error: null });

      const sparePart = await SparePartsService.createSparePart({
        ...values,
        productId: selectedProduct.id,
      });

      set((state) => ({
        productSpareParts: [...state.productSpareParts, sparePart],
        loading: false,
        isAddPartOpen: false,
      }));

      toast.success("Yedek parça başarıyla eklendi");
    } catch (error) {
      console.error("Error creating spare part:", error);
      set({
        error: "Yedek parça eklenirken bir hata oluştu.",
        loading: false,
      });
    }
  },

  updateProductSparePart: async (id, values) => {
    try {
      set({ loading: true, error: null });

      await SparePartsService.updateSparePart(id, values);

      // Refetch spare parts after update
      const { selectedProduct } = get();
      await get().fetchProductSpareParts(selectedProduct.id);

      set({ loading: false, isEditPartOpen: false });
      toast.success("Yedek parça başarıyla güncellendi");
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

      // Refetch spare parts after deletion
      const { selectedProduct } = get();
      await get().fetchProductSpareParts(selectedProduct.id);

      set({ loading: false, isDeleteDialogOpen: false });
      toast.success("Yedek parça başarıyla silindi");
    } catch (error) {
      console.error("Error deleting spare part:", error);
      set({
        error: "Yedek parça silinirken bir hata oluştu.",
        loading: false,
      });
    }
  },
}));
