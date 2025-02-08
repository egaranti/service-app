import { create } from "zustand";
import formService from "@/services/formService";

const useFormStore = create((set, get) => ({
  filterDefinitions: [],
  forms: [],
  loading: false,
  filters: {},

  
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchForms();
  },

  fetchForms: async () => {
    set({ loading: true });
    try {
      const { data } = await formService.getForms(get().filters);
      set({ 
        forms: data.content,
        filterDefinitions: data.filters
      });
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useFormStore;
