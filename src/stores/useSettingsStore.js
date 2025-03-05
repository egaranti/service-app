import { settingsService } from "../services/settingsService";

import { create } from "zustand";

export const useSettingsStore = create((set) => ({
  requestStatuses: [],
  isLoading: false,
  error: null,

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
}));
