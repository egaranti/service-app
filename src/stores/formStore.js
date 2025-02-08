import formService from "@/services/formService";

import { create } from "zustand";

const useFormStore = create((set, get) => ({
  // State
  filterDefinitions: [],
  forms: [],
  loading: false,
  error: null,
  filters: {},
  selectedForm: null,

  // Actions
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      error: null,
    }));
    get().fetchForms();
  },

  clearFilters: () => {
    set({ filters: {}, error: null });
    get().fetchForms();
  },

  fetchForms: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await formService.getForms(get().filters);
      set({
        forms: data.content,
        filterDefinitions: data.filters,
      });
    } catch (error) {
      set({ error: error.message || "Form listesi alınamadı" });
      console.error("Error fetching forms:", error);
    } finally {
      set({ loading: false });
    }
  },

  getFormById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await formService.getFormById(id);
      set({ selectedForm: data });
      return data;
    } catch (error) {
      set({ error: error.message || "Form detayları alınamadı" });
      console.error("Error fetching form details:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  createForm: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await formService.createForm(formData);
      set((state) => ({
        forms: [data, ...state.forms],
      }));
      return data;
    } catch (error) {
      set({ error: error.message || "Form oluşturulamadı" });
      console.error("Error creating form:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  updateForm: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await formService.updateForm(id, formData);
      set((state) => ({
        forms: state.forms.map((form) =>
          form.id === id ? { ...form, ...data } : form,
        ),
        selectedForm: data,
      }));
      return data;
    } catch (error) {
      set({ error: error.message || "Form güncellenemedi" });
      console.error("Error updating form:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useFormStore;
