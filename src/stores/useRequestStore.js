import requestService from "@/services/requestService";

import { create } from "zustand";

const useRequestStore = create((set, get) => ({
  requests: [],
  loading: false,

  filters: {
    page: 1,
    totalPage: 1,
    size: 10,
  },
  filterDefinitions: [],
  fetchFilterDefinitions: async () => {
    try {
      const { data } = await requestService.getFilterDefinitions();

      set({ filterDefinitions: data });
    } catch (error) {
      console.error("❌ Store: Error fetching filter definitions:", error);
    }
  },

  fetchRequests: async () => {
    set({ loading: true });
    try {
      const { data } = await requestService.getRequests(get().filters);

      set({
        requests: data?.demandData,
        loading: false,
      });
    } catch (error) {
      console.error("❌ Store: Error fetching requests:", error);
    } finally {
      set({ loading: false });
    }
  },
  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().fetchRequests();
  },
}));

export default useRequestStore;
