import AuthService from "@/services/authService";

import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  isAuth: false,
  loading: false,
  token: localStorage.getItem("token"),
  user: null,
  merchantId: 25,
  merchants: [
    { id: 25, name: "Merchant A" },
    { id: 26, name: "Merchant B" },
    { id: 27, name: "Merchant C" },
  ],
  setMerchantId: (id) => {
    set({ merchantId: id });
  },
  generateOtp: async (phone) => {
    set({ loading: true });
    return AuthService.generateOtp(phone)
      .then((response) => {
        set({
          isAuth: false,
          loading: false,
          token: null,
          tempCredentials: { phone },
        });
        return response;
      })
      .catch((err) => {
        set({ loading: false });
        throw err;
      });
  },

  login: async (data) => {
    set({ loading: true });

    return AuthService.login(data)
      .then((response) => {
        if (response.jwtToken) {
          set({
            isAuth: true,
            loading: false,
            token: response.jwtToken,
            user: response.user,
          });
          localStorage.setItem("token", response.jwtToken.split(" ")[1]);
        }
        return response;
      })
      .catch((err) => {
        set({ loading: false });
        throw err;
      });
  },

  resendOtp: async () => {
    const { tempCredentials } = get();
    set({ loading: true });

    return AuthService.generateOtp(tempCredentials.phone)
      .then(() => {
        set({ loading: false });
      })
      .catch((err) => {
        set({ loading: false });
        throw err;
      });
  },
  checkAuth: async () => {
    set({ loading: true });
    return AuthService.checkAuth()
      .then((response) => {
        response
          ? set({ isAuth: true, loading: false, user: response })
          : set({ isAuth: false, loading: false, user: null });
        return response;
      })
      .catch((err) => {
        set({ isAuth: false, loading: false, user: null });
        throw err;
      });
  },
  logout: () => {
    set({
      isAuth: false,
      token: null,
      tempCredentials: null,
    });
    localStorage.removeItem("token");
    window.location.replace("/login");
  },
}));

export default useAuthStore;
