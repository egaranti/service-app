import requestService from "@/services/requestService";

import { create } from "zustand";

const useRequestStore = create((set, get) => ({
  requests: [],
  loading: false,

  filters: {
    page: 0,
    totalPage: 1,
    size: 10,
  },
  filterDefinitions: [],
  fetchFilterDefinitions: async () => {
    return requestService
      .getFilterDefinitions()
      .then(({ data }) => {
        set({ filterDefinitions: data });
      })
      .catch((error) => {
        console.error("❌ Store: Error fetching filter definitions:", error);
      });
  },

  fetchRequests: async () => {
    set({ loading: true });
    return requestService
      .getRequests(get().filters)
      .then((data) => {
        console.log(data);
        set({
          requests: data?.demandModel,
          loading: false,
          filters: {
            ...get().filters,
            totalPage: data?.totalPage,
            page: data?.currentPage,
          },
        });
      })
      .catch((error) => {
        console.error("❌ Store: Error fetching requests:", error);
      })
      .finally(() => {
        set({ loading: false });
      });
  },
  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().fetchRequests();
  },
}));

export default useRequestStore;
