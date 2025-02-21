import formService from "@/services/formService";

import { create } from "zustand";

const useFormStore = create((set, get) => ({
  forms: [],
  loading: false,
  error: null,
  selectedForm: null,
  merchantId: 25, // Added to store merchant ID

  // Actions
  setMerchantId: (id) => {
    set({ merchantId: id });
  },

  fetchForms: async () => {
    const merchantId = get().merchantId;
    if (!merchantId) {
      set({ error: "Merchant ID is required" });
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await formService.getAllForms(merchantId);
      set({ forms: data });
    } catch (error) {
      set({ error: error.message || "Form listesi alınamadı" });
      console.error("Error fetching forms:", error);
    } finally {
      set({ loading: false });
    }
  },

  getFormById: async (formId) => {
    const merchantId = get().merchantId;
    if (!merchantId) {
      set({ error: "Merchant ID is required" });
      return null;
    }

    set({ loading: true, error: null });
    try {
      const data = await formService.getFormById(formId, merchantId);
      set({ selectedForm: data }); // API returns an array with single form
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
    const merchantId = get().merchantId;
    if (!merchantId) {
      set({ error: "Merchant ID is required" });
      return null;
    }

    set({ loading: true, error: null });
    try {
      const data = await formService.createForm(formData, merchantId);
      set((state) => ({
        forms: [...state.forms, data],
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

  updateForm: async (formId, formData) => {
    const merchantId = get().merchantId;
    if (!merchantId) {
      set({ error: "Merchant ID is required" });
      return null;
    }

    set({ loading: true, error: null });
    try {
      await formService.updateForm(formId, formData, merchantId);
      await get().fetchForms();
      return formData;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Form güncellenemedi";
      set({ error: errorMessage });
      console.error("Error updating form:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteForm: async (formId) => {
    const merchantId = get().merchantId;
    if (!merchantId) {
      set({ error: "Merchant ID is required" });
      return;
    }

    set({ loading: true, error: null });
    try {
      await formService.deleteForm(formId, merchantId);
      set((state) => ({
        forms: state.forms.filter((form) => form.id !== formId),
        selectedForm:
          state.selectedForm?.id === formId ? null : state.selectedForm,
      }));
    } catch (error) {
      set({ error: error.message || "Form silinemedi" });
      console.error("Error deleting form:", error);
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useFormStore;
