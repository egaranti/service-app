import requestService from "@/services/requestService";

import { create } from "zustand";

const CACHE_DURATION = 2 * 60 * 1000; // 5 minutes

const useRequestStore = create((set, get) => ({
  // Data states
  requests: [],
  selectedRequest: null,
  requestCache: new Map(), // { requestId: { data, timestamp } }
  filterDefinitions: [],

  // Loading states
  loading: {
    requests: false,
    filterDefinitions: false,
    requestDetail: false,
  },

  // Error states
  errors: {
    requests: null,
    filterDefinitions: null,
    requestDetail: null,
  },

  // Pagination and filters
  filters: (() => {
    const defaultFilters = { page: 0, totalPage: 1, size: 10 };
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
      if (filters.page > 0) {
        params.set("page", filters.page.toString());
      } else {
        params.delete("page");
      }

      // Sync other filters
      const { page, size, totalPage, ...otherFilters } = filters;
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

  // Cache Management
  getCachedRequest: (requestId) => {
    const cache = get().requestCache;
    const cachedData = cache.get(requestId);

    if (!cachedData) return null;

    const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
    if (isExpired) {
      cache.delete(requestId);
      return null;
    }

    return cachedData.data;
  },

  cacheRequest: (requestId, data) => {
    const cache = get().requestCache;
    cache.set(requestId, {
      data,
      timestamp: Date.now(),
    });
  },

  // API Actions
  fetchFilterDefinitions: async () => {
    set((state) => ({
      loading: { ...state.loading, filterDefinitions: true },
      errors: { ...state.errors, filterDefinitions: null },
    }));

    try {
      const response = await requestService.getFilterDefinitions();
      // Ensure the response has the expected structure
      const definitions = Array.isArray(response.data)
        ? response.data
        : response.data?.definitions || [];

      // Transform the data if needed
      const formattedDefinitions = definitions.map((def) => ({
        key: def.key || def.id,
        label: def.label || def.name,
        type: def.type || "text",
        options: def.options?.map((opt) => ({
          value: opt.value || opt.id,
          label: opt.label || opt.name,
        })),
      }));

      set((state) => ({
        filterDefinitions: formattedDefinitions,
        loading: { ...state.loading, filterDefinitions: false },
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch filter definitions";
      set((state) => ({
        errors: { ...state.errors, filterDefinitions: errorMessage },
        loading: { ...state.loading, filterDefinitions: false },
      }));
      console.error("Error fetching filter definitions:", error);
    }
  },

  fetchRequests: async () => {
    set((state) => ({
      loading: { ...state.loading, requests: true },
      errors: { ...state.errors, requests: null },
    }));

    try {
      const data = await requestService.getRequests(get().filters);
      set((state) => ({
        requests: data?.demandModel || [],
        filters: {
          ...state.filters,
          totalPage: data?.totalPage || 1,
          page: data?.currentPage || 0,
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
    const cachedRequest = get().getCachedRequest(requestId);
    if (cachedRequest) {
      return cachedRequest;
    }

    set((state) => ({
      loading: { ...state.loading, requestDetail: true },
      errors: { ...state.errors, requestDetail: null },
    }));

    try {
      const data = await requestService.getRequestById(requestId);
      get().cacheRequest(requestId, data);
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
      // Handle filter clearing
      const updatedFilters = { ...state.filters };

      // Process each filter
      Object.entries(newFilters).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === false
        ) {
          // Remove the filter if it's empty or false
          delete updatedFilters[key];
        } else {
          // Update the filter with the new value
          updatedFilters[key] = value;
        }
      });

      // Ensure default pagination values are maintained
      return {
        filters: {
          ...updatedFilters,
          page: newFilters.hasOwnProperty("page") ? newFilters.page : 0,
          size: updatedFilters.size || 10,
          totalPage: updatedFilters.totalPage || 1,
        },
      };
    });
    get().syncWithUrl();
    get().fetchRequests();
  },

  clearErrors: () => {
    set({
      errors: { requests: null, filterDefinitions: null, requestDetail: null },
    });
  },
}));

export default useRequestStore;
