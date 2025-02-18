import { userService } from "@/services/userService";

import { create } from "zustand";

export const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async (filters) => {
    set({ loading: true });
    try {
      const users = await userService.getUsers(filters);
      set({ users, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addUser: async (userData) => {
    set({ loading: true });
    try {
      const newUser = await userService.addUser(userData);
      set((state) => ({
        users: [...state.users, newUser],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true });
    try {
      await userService.deleteUser(userId);
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  bulkUploadUsers: async (file, type) => {
    set({ loading: true });
    try {
      const newUsers = await userService.bulkUpload(file, type);
      await fetchUsers();
      set((state) => ({
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
