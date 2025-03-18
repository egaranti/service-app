import { paymentService } from "@/services/paymentService";
import technicalService from "@/services/technicalService";

import { create } from "zustand";

export const usePaymentStore = create((set, get) => ({
  payments: [],
  loading: false,
  error: null,
  selectedPayments: [],
  providers: [],
  filters: {
    pagination: {
      currentPage: 1,
      size: 10,
      total: 0,
    },
    providerId: null,
    dateRange: {
      from: null,
      to: null,
    },
    status: null,
    search: "",
  },

  // fetch again data with new filters
  setFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
    get().fetchPayments();
  },

  setPagination: (paginationData) =>
    set((state) => ({
      filters: {
        ...state.filters,
        pagination: {
          ...state.filters.pagination,
          ...paginationData,
        },
      },
    })),

  resetFilters: () =>
    set((state) => ({
      filters: {
        ...state.filters,
        providerId: null,
        dateRange: {
          from: null,
          to: null,
        },
        status: null,
        search: "",
        pagination: {
          ...state.filters.pagination,
          currentPage: 1,
        },
      },
    })),

  setSelectedPayments: (selectedPayments) => set({ selectedPayments }),

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

  fetchPayments: async () => {
    set({ loading: true });
    try {
      const state = get(); // Get current state
      const data = await paymentService.getPayments({
        ...state.filters,
        page: state.filters.pagination.currentPage,
        size: state.filters.pagination.size,
      });

      set((state) => ({
        payments: data?.content || [],
        filters: {
          ...state.filters,
          pagination: {
            ...state.filters.pagination,
            totalPages: data?.totalPages || 1,
          },
        },
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Error fetching payments:", error);
      set({ error: error.message, loading: false });
    }
  },

  updatePaymentStatus: async (paymentId, status) => {
    try {
      await paymentService.updatePaymentStatus(paymentId, status);
      set((state) => ({
        payments: state.payments.map((payment) =>
          payment.id === paymentId ? { ...payment, status } : payment,
        ),
      }));
    } catch (error) {
      set({ error: error.message });
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
      set({ error: error.message });
    }
  },

  createPayment: async (paymentData) => {
    try {
      const newPayment = await paymentService.createPayment(paymentData);
      set((state) => ({
        payments: [...state.payments, newPayment],
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
