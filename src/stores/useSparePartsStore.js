import { MockSparePartsService as SparePartsService } from "@/services/mockSparePartsService";
import { create } from "zustand";

export const useSparePartsStore = create((set, get) => ({
  parts: [],
  selectedPart: null,
  loading: false,
  error: null,

  fetchParts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await SparePartsService.getAll();
      set({ parts: data, loading: false });
    } catch (error) {
      set({
        error: "Parçalar yüklenirken bir hata oluştu",
        loading: false,
      });
      console.error("Error fetching parts:", error);
    }
  },

  getPartById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await SparePartsService.getById(id);
      set({ selectedPart: data, loading: false });
      return data;
    } catch (error) {
      set({
        error: "Parça detayları yüklenirken bir hata oluştu",
        loading: false,
      });
      console.error("Error fetching part details:", error);
      return null;
    }
  },

  createPart: async (values) => {
    set({ loading: true, error: null });
    try {
      await SparePartsService.create(values);
      await get().fetchParts();
      return true;
    } catch (error) {
      set({ error: "Parça eklenirken bir hata oluştu", loading: false });
      console.error("Error creating part:", error);
      return false;
    }
  },

  updatePart: async (id, values) => {
    set({ loading: true, error: null });
    try {
      await SparePartsService.update(id, values);
      await get().fetchParts();
      return true;
    } catch (error) {
      set({
        error: "Parça güncellenirken bir hata oluştu",
        loading: false,
      });
      console.error("Error updating part:", error);
      return false;
    }
  },

  deletePart: async (id) => {
    set({ loading: true, error: null });
    try {
      await SparePartsService.delete(id);
      await get().fetchParts();
      return true;
    } catch (error) {
      set({
        error: "Parça silinirken bir hata oluştu",
        loading: false,
      });
      console.error("Error deleting part:", error);
      return false;
    }
  },

  addSubpart: async (parentId, subpart) => {
    set({ loading: true, error: null });
    try {
      await SparePartsService.addSubpart(parentId, subpart);
      await get().fetchParts();
      return true;
    } catch (error) {
      set({
        error: "Alt parça eklenirken bir hata oluştu",
        loading: false,
      });
      console.error("Error adding subpart:", error);
      return false;
    }
  },
}));
