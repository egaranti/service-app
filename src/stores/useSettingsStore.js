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
      set((state) => ({
        requestStatuses: [...state.requestStatuses, response.data],
        error: null,
      }));
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
      set((state) => ({
        requestStatuses: state.requestStatuses.filter(
          (status) => status.id !== id,
        ),
        error: null,
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateRequestStatuses: async (statuses) => {
    set({ isLoading: true });
    try {
      await settingsService.updateRequestStatuses(statuses);
      set({ requestStatuses: statuses, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
