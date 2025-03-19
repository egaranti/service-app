import { paymentService } from "@/services/paymentService";
import technicalService from "@/services/technicalService";

import { create } from "zustand";

export const usePaymentStore = create((set, get) => ({
  // Data states
  payments: [],
  selectedPayments: [],
  providers: [],

  // Loading states
  loading: {
    payments: false,
    providers: false,
    paymentDetail: false,
  },

  // Error states
  errors: {
    payments: null,
    providers: null,
    paymentDetail: null,
  },

  // Filters and Pagination
  filters: (() => {
    const defaultFilters = {
      page: 1,
      size: 10,
      totalPages: 1,
      providerId: null,
      dateRange: {
        from: null,
        to: null,
      },
      status: null,
      search: "",
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
    const { filters, selectedPayments } = get();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      // Handle default filters (page, size)
      if (filters.page > 1) {
        params.set("page", filters.page.toString());
      } else {
        params.delete("page");
      }

      // Sync other filters
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
    }
  },

  // Fetch Payments
  fetchPayments: async () => {
    set((state) => ({
      loading: { ...state.loading, payments: true },
      errors: { ...state.errors, payments: null },
    }));

    try {
      const { filters } = get();
      const { page, size, dateRange, ...restFilters } = filters;
      const data = await paymentService.getPayments({
        ...restFilters,
        page,
        size,
        fromDate: dateRange?.from || null,
        toDate: dateRange?.to || null,
      });

      set((state) => ({
        payments: data?.content || [],
        filters: {
          ...state.filters,
          totalPages: data?.totalPages || 1,
        },
        loading: { ...state.loading, payments: false },
      }));
      get().syncWithUrl();
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, payments: error.message },
        loading: { ...state.loading, payments: false },
      }));
      console.error("Error fetching payments:", error);
    }
  },

  // Filter Management
  setFilter: (key, value) => {
    set((state) => {
      const newFilters = {
        ...state.filters,
        [key]: value,
      };

      // Reset page to 1 when changing filters (except when changing page)
      if (key !== "page") {
        newFilters.page = 1;
      }

      return { filters: newFilters };
    });
    get().fetchPayments();
    get().syncWithUrl();
  },

  resetFilters: () =>
    set((state) => {
      const resetFilters = {
        ...state.filters,
        page: 1,
        providerId: null,
        dateRange: {
          from: null,
          to: null,
        },
        status: null,
        search: "",
      };
      return { filters: resetFilters };
    }),

  // Payment Selection Management
  setSelectedPayments: (selectedPayments) => {
    set({ selectedPayments });
    get().syncWithUrl();
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

  // Payment Operations
  updatePaymentStatus: async (paymentId, status) => {
    try {
      await paymentService.updatePaymentStatus(paymentId, status);
      set((state) => ({
        payments: state.payments.map((payment) =>
          payment.id === paymentId ? { ...payment, status } : payment,
        ),
      }));
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, payments: error.message },
      }));
    }
  },

  updateBulkPaymentStatus: async (paymentIds, status) => {
    try {
      await paymentService.updateBulkPaymentStatus(paymentIds, status);
      set((state) => ({
        payments: state.payments.map((payment) =>
          paymentIds.includes(payment.id) ? { ...payment, status } : payment,
        ),
        selectedPayments: [],
      }));
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, payments: error.message },
      }));
    }
  },

  createPayment: async (paymentData) => {
    try {
      const newPayment = await paymentService.createPayment(paymentData);
      set((state) => ({
        payments: [...state.payments, newPayment],
      }));
      return newPayment;
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, payments: error.message },
      }));
      throw error;
    }
  },

  clearErrors: () =>
    set((state) => ({
      errors: {
        payments: null,
        providers: null,
        paymentDetail: null,
      },
    })),
}));
