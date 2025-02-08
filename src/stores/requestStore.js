import requestService from "@/services/requestService";

import { create } from "zustand";

const useRequestStore = create((set, get) => ({
  requests: [],
  loading: false,
  filters: {
    search: "",
    status: "",
    priority: "",
    date: "",
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

      set({ requests: data });
    } catch (error) {
      console.error("❌ Store: Error fetching requests:", error);
    } finally {
      set({ loading: false });
    }
  },
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchRequests();
  },
}));

export default useRequestStore;
