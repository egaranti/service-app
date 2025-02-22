import userService from "@/services/userService";

import { create } from "zustand";

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async (filters) => {
    set({ loading: true });
    return userService
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
    return userService
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
      });
  },

  deleteUser: async (userId) => {
    set({ loading: true });
    return userService
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

  bulkUploadUsers: async (file, type) => {
    set({ loading: true });
    return userService
      .bulkUpload(file, type)
      .then((newUsers) => {
        return get()
          .fetchUsers()
          .then(() => {
            set((state) => ({
              loading: false,
            }));
          });
      })
      .catch((error) => {
        set({ error: error.message, loading: false });
      });
  },
}));
