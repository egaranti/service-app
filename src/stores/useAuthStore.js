import AuthService from "@/services/authService";

import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  isAuth: true,
  loading: false,
  token: localStorage.getItem("token"),
  user: null,
  userType: localStorage.getItem("user") || null,
  merchantId: 25,
  merchants: [
    { id: 25, name: "Merchant A" },
    { id: 26, name: "Merchant B" },
    { id: 27, name: "Merchant C" },
  ],
  setMerchantId: (id) => {
    set({ merchantId: id });
  },
  setUserType: (type) => {
    localStorage.setItem("user", type);
    set({ userType: type });
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
            user: response.xfrom,
          });
          localStorage.setItem("token", response.jwtToken.split(" ")[1]);
          localStorage.setItem("user", get().userType || response.xfrom);
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
        response?.status === 200
          ? set({ isAuth: true, loading: false, user: "user" })
          : set({ isAuth: false, loading: false, user: null });
        return response;
      })
      .catch((err) => {
        console.log(err);
        set({ isAuth: false, loading: false, user: null });
        throw err;
      });
  },
  logout: () => {
    const userType = localStorage.getItem("user");
    set({
      isAuth: false,
      token: null,
      tempCredentials: null,
    });
    localStorage.removeItem("token");
    // Keep the user type when logging out
    if (userType) {
      set({ userType });
    } else {
      localStorage.removeItem("user");
    }
    window.location.replace("/login");
  },
}));

export default useAuthStore;
