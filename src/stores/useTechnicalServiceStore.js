import technicalService from "@/services/technicalService";

import { create } from "zustand";

export const useTechnicalServiceStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async (filters) => {
    set({ loading: true });
    return technicalService
      .getUsers(filters)
      .then((users) => {
        set({ users, loading: false });
      })
      .catch((error) => {
        set({ error: error.message, loading: false });
      });
  },

  addUser: async (userData) => {
    set({ loading: true });
    return technicalService
      .addUser(userData)
      .then((newUser) => {
        set((state) => ({
          users: [...state.users, newUser],
          loading: false,
        }));
        return get().fetchUsers();
      })
      .catch((error) => {
        set({ error: error.message, loading: false });
        throw error;
      });
  },

  deleteUser: async (userId) => {
    set({ loading: true });
    return technicalService
      .deleteUser(userId)
      .then(() => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== userId),
          loading: false,
        }));
        return get().fetchUsers();
      })
      .catch((error) => {
        set({ error: error.message, loading: false });
      });
  },

  bulkUploadUsers: async (file, type, filters) => {
    set({ loading: true });
    return technicalService
      .bulkUpload(file, type)
      .then(() => {
        return get().fetchUsers(filters);
      })
      .catch((error) => {
        set({ error: error.message, loading: false });
      });
  },
}));
