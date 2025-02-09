import AuthService from "@/services/authService";

import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  isAuth: false,
  loading: false,
  token: localStorage.getItem("token"),
  user: null,

  login: async (data) => {
    set({ loading: true });
    try {
      const response = await AuthService.login(data);

      set({
        isAuth: false,
        loading: false,
        token: null,
        tempCredentials: data,
      });

      return response;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  verifyOtp: async (otp) => {
    const { tempCredentials } = get();
    set({ loading: true });

    try {
      const response = await AuthService.verifyOtp(
        tempCredentials.username,
        otp,
      );

      set({
        isAuth: true,
        loading: false,
        token: response.jwtToken.split(" ")[1],
      });
      localStorage.setItem("token", response.jwtToken.split(" ")[1]);

      return response;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  resendOtp: async () => {
    const { tempCredentials } = get();
    set({ loading: true });

    try {
      await AuthService.generateOtp(tempCredentials.username);
      set({ loading: false });
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
    set({
      isAuth: false,
      token: null,
      tempCredentials: null,
    });
    localStorage.removeItem("token");
  },
}));

export default useAuthStore;
