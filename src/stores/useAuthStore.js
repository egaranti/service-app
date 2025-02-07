import AuthService from "@/services/authService";

import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuth: false,
  loading: false,
  token: localStorage.getItem("token"),
  user: null,

  login: async (data) => {
    set({ loading: true });
    try {
      const response = await AuthService.login(data);

      set({
        isAuth: true,
        loading: false,
        token: response.jwtToken.split(" ")[1],
      });
      localStorage.setItem("token", response.jwtToken.split(" ")[1]);
      set({ loading: false });

      return response;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },
  checkAuth: async () => {
    set({ loading: true });
    const response = await AuthService.checkAuth();

    response
      ? set({ isAuth: true, loading: false, user: response })
      : set({ isAuth: false, loading: false, user: null });

    return response;
  },
  logout: () => {
    set({ isAuth: false, token: null });
    localStorage.removeItem("token");
  },
}));

export default useAuthStore;
