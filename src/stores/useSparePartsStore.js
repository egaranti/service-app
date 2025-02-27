import { SparePartsService } from "@/services/sparePartsService";

import { create } from "zustand";

export const useSparePartsStore = create((set, get) => ({
  spareParts: [],
  loading: false,
  error: null,
  filters: {
    page: 1,
    size: 10,
    totalPage: 1,
  },

  fetchSpareParts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await SparePartsService.getAll();
      set({ spareParts: data, loading: false });
    } catch (error) {
      set({
        error: "Yedek parçalar yüklenirken bir hata oluştu",
        loading: false,
      });
      console.error("Error fetching spare parts:", error);
    }
  },

  createSparePart: async (values) => {
    set({ loading: true, error: null });
    try {
      await SparePartsService.create(values);
      await get().fetchSpareParts();
      return true;
    } catch (error) {
      set({ error: "Yedek parça eklenirken bir hata oluştu", loading: false });
      console.error("Error creating spare part:", error);
      return false;
    }
  },

  updateSparePart: async (id, values) => {
    set({ loading: true, error: null });
    try {
      await SparePartsService.update(id, values);
      await get().fetchSpareParts();
      return true;
    } catch (error) {
      set({
        error: "Yedek parça güncellenirken bir hata oluştu",
        loading: false,
      });
      console.error("Error updating spare part:", error);
      return false;
    }
  },

  updateStock: async (id, quantity) => {
    set({ loading: true, error: null });
    try {
      await SparePartsService.updateStock(id, quantity);
      await get().fetchSpareParts();
      return true;
    } catch (error) {
      set({
        error: "Stok adedi güncellenirken bir hata oluştu",
        loading: false,
      });
      console.error("Error updating stock:", error);
      return false;
    }
  },

  bulkCreate: async (file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("file", file);
      await SparePartsService.bulkCreate(formData);
      await get().fetchSpareParts();
      return true;
    } catch (error) {
      set({ error: "Toplu yükleme sırasında bir hata oluştu", loading: false });
      console.error("Error bulk creating spare parts:", error);
      return false;
    }
  },
}));
