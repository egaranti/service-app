import { create } from "zustand";
import SparePartsService from "@/services/sparePartsService";
import { toast } from "@egaranti/components";

export const useSparePartsStore = create((set, get) => ({
  // State
  loading: false,
  error: null,
  products: [],
  filteredProducts: [], 
  searchQuery: "", 
  selectedProduct: null,
  productSpareParts: [],
  
  // Dialog state
  isAddPartOpen: false,
  isEditPartOpen: false,
  isDeleteDialogOpen: false,
  currentPart: null,

  // Methods for products and spare parts
  fetchProducts: async (searchQuery = "") => {
    try {
      set({ loading: true, error: null });
      const products = await SparePartsService.getProducts();
      
      if (searchQuery) {
        const filtered = products.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        set({ 
          products,
          filteredProducts: filtered, 
          searchQuery, 
          loading: false 
        });
      } else {
        set({ 
          products, 
          filteredProducts: products, 
          searchQuery, 
          loading: false 
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      set({
        error: "Ürünler yüklenirken bir hata oluştu.",
        loading: false,
      });
    }
  },

  setSearchQuery: (query) => {
    const { products } = get();
    set({ searchQuery: query });
    
    if (query) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      set({ filteredProducts: filtered });
    } else {
      set({ filteredProducts: products });
    }
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
      const spareParts = await SparePartsService.getProductSpareParts(productId);
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
      
      const updatedPart = await SparePartsService.updateSparePart(id, values);
      
      set((state) => ({
        productSpareParts: state.productSpareParts.map((part) =>
          part.id === id ? { ...part, ...updatedPart } : part
        ),
        loading: false,
        isEditPartOpen: false,
        currentPart: null,
      }));
      
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
      
      set((state) => ({
        productSpareParts: state.productSpareParts.filter((part) => part.id !== id),
        loading: false,
        isDeleteDialogOpen: false,
        currentPart: null,
      }));
      
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
