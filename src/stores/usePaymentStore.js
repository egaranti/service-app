import { paymentService } from "@/services/paymentService";

import { format } from "date-fns";
import { create } from "zustand";

const initialState = {
  payments: [],
  selectedPayments: [],
  providers: [],
  loading: {
    payments: false,
    providers: false,
    paymentDetail: false,
  },
  errors: {
    payments: null,
    providers: null,
    paymentDetail: null,
  },
  filters: {
    page: 1,
    size: 10,
    totalPages: 1,
    technicalService: null,
    dateRange: {
      from: null,
      to: null,
    },
    status: null,
    totalAllowanceGraterThan: -1,
  },
  stats: {
    allTotalAllowance: 0,
  },
};

const getInitialFilters = () => {
  if (typeof window === "undefined") return initialState.filters;

  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get("page");
  const filtersString = params.get("filters");

  let filters = { ...initialState.filters };

  if (pageParam) {
    filters.page = parseInt(pageParam);
  }

  if (filtersString) {
    try {
      const parsed = JSON.parse(decodeURIComponent(filtersString));
      filters = { ...filters, ...parsed };
    } catch (error) {
      console.error("Error parsing URL filters:", error);
    }
  }

  return filters;
};

export const usePaymentStore = create((set, get) => {
  // Internal actions that won't be exposed
  const actions = {
    setLoading: (key, value) =>
      set((state) => ({
        loading: { ...state.loading, [key]: value },
      })),

    setError: (key, value) =>
      set((state) => ({
        errors: { ...state.errors, [key]: value },
      })),

    setStats: (stats) =>
      set((state) => ({
        stats: { ...state.stats, ...stats },
      })),

    syncWithUrl: () => {
      if (typeof window === "undefined") return;

      const { filters } = get();
      const params = new URLSearchParams(window.location.search);

      if (filters.page > 1) {
        params.set("page", filters.page.toString());
      } else {
        params.delete("page");
      }

      const { page, size, totalPages, ...otherFilters } = filters;
      const nonEmptyFilters = Object.entries(otherFilters).reduce(
        (acc, [key, value]) => {
          if (
            value !== null &&
            value !== undefined &&
            value !== "" &&
            value !== false &&
            (typeof value !== "object" || Object.keys(value).length > 0)
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {},
      );

      if (Object.keys(nonEmptyFilters).length > 0) {
        params.set(
          "filters",
          encodeURIComponent(JSON.stringify(nonEmptyFilters)),
        );
      } else {
        params.delete("filters");
      }

      const newUrl =
        window.location.pathname +
        (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState(null, "", newUrl);
    },
  };

  return {
    // State
    ...initialState,
    filters: getInitialFilters(),

    // Public actions
    clearErrors: () =>
      set((state) => ({
        errors: Object.keys(state.errors).reduce(
          (acc, key) => ({ ...acc, [key]: null }),
          {},
        ),
      })),

    // Fetch payments
    fetchPayments: async () => {
      actions.setLoading("payments", true);
      actions.setError("payments", null);

      try {
        const { filters } = get();
        const { page, size, dateRange, ...restFilters } = filters;
        const data = await paymentService.getPayments({
          ...restFilters,
          page,
          size,
          fromDate: dateRange?.from
            ? format(dateRange.from, "dd-MM-yyyy")
            : null,
          toDate: dateRange?.to ? format(dateRange.to, "dd-MM-yyyy") : null,
        });

        set((state) => ({
          payments: data?.content || [],
          filters: {
            ...state.filters,
            totalPages: data?.totalPages || 1,
          },
        }));

        actions.syncWithUrl();
      } catch (error) {
        actions.setError("payments", error.message);
        console.error("Error fetching payments:", error);
      } finally {
        actions.setLoading("payments", false);
      }
    },

    fetchStats: async () => {
      actions.setLoading("stats", true);
      actions.setError("stats", null);

      try {
        const data = await paymentService.getPaymentsStats(get().filters);
        set((state) => ({
          stats: data,
        }));
      } catch (error) {
        actions.setError("stats", error.message);
        console.error("Error fetching stats:", error);
      } finally {
        actions.setLoading("stats", false);
      }
    },

    // Payment operations
    updatePaymentStatus: async (ids, status) => {
      try {
        actions.setLoading("payments", true);
        await paymentService.updatePaymentStatus(
          Array.isArray(ids) ? ids : [ids],
          status,
        );
        await get().fetchPayments();
        set({ selectedPayments: [] });
      } catch (error) {
        actions.setError("payments", error);
      } finally {
        actions.setLoading("payments", false);
      }
    },

    createPayment: async (paymentData) => {
      actions.setLoading("paymentDetail", true);
      actions.setError("paymentDetail", null);

      try {
        await paymentService.create(paymentData);
        await get().fetchPayments();
      } catch (error) {
        actions.setError("paymentDetail", error.message);
        console.error("Error creating payment:", error);
      } finally {
        actions.setLoading("paymentDetail", false);
      }
    },

    // Filter operations
    setFilter: (key, value) => {
      set((state) => {
        const newFilters = {
          ...state.filters,
          [key]: value,
        };
        return { filters: newFilters };
      });
      get().fetchPayments();
      actions.syncWithUrl();
    },

    resetFilters: () => {
      set((state) => ({
        filters: {
          ...initialState.filters,
          size: state.filters.size,
        },
      }));
      get().fetchPayments();
      actions.syncWithUrl();
    },

    // Selection operations
    setSelectedPayments: (selectedPayments) => {
      set({ selectedPayments });
      actions.syncWithUrl();
    },

    togglePaymentSelection: (paymentId) =>
      set((state) => ({
        selectedPayments: state.selectedPayments.includes(paymentId)
          ? state.selectedPayments.filter((id) => id !== paymentId)
          : [...state.selectedPayments, paymentId],
      })),

    toggleAllPayments: (allPaymentIds) =>
      set((state) => ({
        selectedPayments:
          state.selectedPayments.length === allPaymentIds.length
            ? []
            : allPaymentIds,
      })),
  };
});
