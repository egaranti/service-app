import { settingsService } from "../services/settingsService";

import { create } from "zustand";

export const useSettingsStore = create((set, get) => ({
  requestStatuses: [],
  constants: [
    {
      id: 1,
      name: "KDV",
      value: 0.18,
    },
  ],
  isLoading: false,
  error: null,

  // Request Status Methods
  fetchRequestStatuses: async () => {
    set({ isLoading: true });
    try {
      const response = await settingsService.getAllRequestStatuses();
      set({ requestStatuses: response.data, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addRequestStatus: async (status) => {
    set({ isLoading: true });
    try {
      const response = await settingsService.addRequestStatus(status);
      const allResponse = await settingsService.getAllRequestStatuses();
      set({
        requestStatuses: allResponse.data,
        error: null,
      });
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteRequestStatus: async (id) => {
    set({ isLoading: true });
    try {
      await settingsService.deleteRequestStatus(id);
      const response = await settingsService.getAllRequestStatuses();
      set({
        requestStatuses: response.data,
        error: null,
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateRequestStatus: async (status) => {
    set({ isLoading: true });
    try {
      await settingsService.updateRequestStatus(status);
      const response = await settingsService.getAllRequestStatuses();
      set({
        requestStatuses: response.data,
        error: null,
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Constants Methods
  fetchConstants: async () => {
    set({ isLoading: true });
    try {
      const response = await settingsService.getAllConstants();
      set({ constants: response.data, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addConstant: async (constant) => {
    set({ isLoading: true });
    try {
      await settingsService.addConstant(constant);
      const response = await settingsService.getAllConstants();
      set({ constants: response.data, error: null });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateConstant: async (index, constant) => {
    set({ isLoading: true });
    try {
      await settingsService.updateConstant(constant);
      const response = await settingsService.getAllConstants();
      set({ constants: response.data, error: null });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteConstant: async (index) => {
    set({ isLoading: true });
    try {
      const constants = get().constants;
      await settingsService.deleteConstant(constants[index].id);
      const response = await settingsService.getAllConstants();
      set({ constants: response.data, error: null });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
