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
    console.log("📘 Store: Fetching filter definitions...");
    try {
      const { data } = await requestService.getFilterDefinitions();
      console.log("📙 Store: Filter definitions fetched successfully:", data);
      set({ filterDefinitions: data });
    } catch (error) {
      console.error("❌ Store: Error fetching filter definitions:", error);
    }
  },

  fetchRequests: async () => {
    console.log("📘 Store: Fetching requests...");
    set({ loading: true });
    try {
      const { data } = await requestService.getRequests(get().filters);
      console.log("📙 Store: Requests fetched successfully:", data);
      set({ requests: data });
    } catch (error) {
      console.error("❌ Store: Error fetching requests:", error);
    } finally {
      set({ loading: false });
    }
  },
  setFilters: (newFilters) => {
    console.log("📘 Store: Setting new filters:", newFilters);
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchRequests();
  },
}));

export default useRequestStore;
