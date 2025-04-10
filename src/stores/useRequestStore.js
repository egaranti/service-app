import requestService from "@/services/requestService";
import { settingsService } from "@/services/settingsService";

import { create } from "zustand";

const useRequestStore = create((set, get) => ({
  // Data states
  requests: [],
  selectedRequest: null,
  statusDefinitions: [],

  // Loading states
  loading: {
    requests: false,
    statusDefinitions: false,
    requestDetail: false,
  },

  // Error states
  errors: {
    requests: null,
    statusDefinitions: null,
    requestDetail: null,
  },

  fetchStatusDefinitions: async () => {
    set((state) => ({
      loading: { ...state.loading, statusDefinitions: true },
      errors: { ...state.errors, statusDefinitions: null },
    }));
    return settingsService
      .getAllRequestStatuses()
      .then((data) => {
        set({ statusDefinitions: data?.data });
        return data?.data;
      })
      .catch((error) => {
        set({ errors: { ...state.errors, statusDefinitions: error.message } });
        return null;
      })
      .finally(() => {
        set((state) => ({
          loading: { ...state.loading, statusDefinitions: false },
        }));
      });
  },

  // Pagination and filters
  filters: (() => {
    const defaultFilters = {
      page: 1,
      totalPages: 1,
      size: 10,
      status: null,
      dateRange: null,
    };
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      // Handle direct page parameter
      const pageParam = params.get("page");
      if (pageParam) {
        defaultFilters.page = parseInt(pageParam);
      }

      // Handle other filters
      const filtersString = params.get("filters");
      if (filtersString) {
        try {
          const parsed = JSON.parse(decodeURIComponent(filtersString));
          return { ...defaultFilters, ...parsed };
        } catch (error) {
          console.error("Error parsing URL filters:", error);
        }
      }
    }
    return defaultFilters;
  })(),

  // URL State Management
  syncWithUrl: () => {
    const { filters, selectedRequest } = get();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      // Handle default filters (page, size)
      if (filters.page > 1) {
        params.set("page", filters.page.toString());
        params.set(
          "dateRange",
          JSON.stringify({
            from: filters.dateRangeFrom,
            to: filters.dateRangeTo,
          }),
        );
      } else {
        params.delete("page");
        params.delete("dateRange");
      }

      // Sync other filters
      const { page, size, totalPages, ...otherFilters } = filters;
      const nonEmptyFilters = Object.entries(otherFilters).reduce(
        (acc, [key, value]) => {
          if (
            value !== null &&
            value !== undefined &&
            value !== "" &&
            value !== false
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {},
      );

      // Only set filters if there are non-empty values
      if (Object.keys(nonEmptyFilters).length > 0) {
        params.set(
          "filters",
          encodeURIComponent(JSON.stringify(nonEmptyFilters)),
        );
      } else {
        params.delete("filters");
      }

      // Sync selected request
      if (selectedRequest?.id) {
        params.set("selectedRequestId", selectedRequest.id);
      } else {
        params.delete("selectedRequestId");
      }

      // Update URL only if there are parameters, otherwise clear search params
      const newUrl =
        window.location.pathname +
        (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState(null, "", newUrl);
    }
  },

  // Request Selection
  setSelectedRequest: (request) => {
    set({ selectedRequest: request });
    get().syncWithUrl();
  },

  fetchRequests: async () => {
    set((state) => ({
      loading: { ...state.loading, requests: true },
      errors: { ...state.errors, requests: null },
    }));

    try {
      const data = await requestService.getRequests(get().filters);
      set((state) => ({
        requests: data?.content || [],
        filters: {
          ...state.filters,
          totalPages: data?.totalPages || 1,
        },
        loading: { ...state.loading, requests: false },
      }));
      get().syncWithUrl();
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, requests: error.message },
        loading: { ...state.loading, requests: false },
      }));
      console.error("Error fetching requests:", error);
    }
  },

  fetchRequestById: async (requestId) => {
    set((state) => ({
      loading: { ...state.loading, requestDetail: true },
      errors: { ...state.errors, requestDetail: null },
    }));

    try {
      const data = await requestService.getRequestById(requestId);
      set((state) => ({
        loading: { ...state.loading, requestDetail: false },
      }));
      return data;
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, requestDetail: error.message },
        loading: { ...state.loading, requestDetail: false },
      }));
      console.error("Error fetching request details:", error);
      throw error;
    }
  },

  setFilters: (newFilters) => {
    set((state) => {
      // Handle both callback functions and direct objects
      const updatedFilters =
        typeof newFilters === "function"
          ? newFilters(state.filters)
          : { ...state.filters, ...newFilters };

      return {
        filters: updatedFilters,
      };
    });
    get().syncWithUrl();
    get().fetchRequests();
  },

  updateDemandData: async (requestId, demandData) => {
    set((state) => ({
      loading: { ...state.loading, requestDetail: true },
      errors: { ...state.errors, requestDetail: null },
    }));

    try {
      const data = await requestService.updateDemandData(requestId, demandData);
      set((state) => ({
        loading: { ...state.loading, requestDetail: false },
      }));

      // Refresh the request list to reflect the updated data
      get().fetchRequests();

      return data;
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, requestDetail: error.message },
        loading: { ...state.loading, requestDetail: false },
      }));
      console.error("Error updating demand data:", error);
      throw error;
    }
  },

  clearErrors: () => {
    set({
      errors: { requests: null, statusDefinitions: null, requestDetail: null },
    });
  },

  // Default filter values
  defaultFilters: {
    page: 1,
    totalPages: 1,
    size: 10,
    status: null,
    title: null,
    technicalServiceId: null,
    fromDate: null,
    toDate: null,
    dateRange: null,
  },

  // Reset filters to default values
  resetFilter: () => {
    set((state) => ({
      filters: { ...state.defaultFilters },
    }));
    get().syncWithUrl();
    get().fetchRequests();
  },
}));

export default useRequestStore;
