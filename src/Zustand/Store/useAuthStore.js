// src/Zustand/AuthStore.js
import { create } from "zustand";
const useAuthStore = create((set) => ({
  isLoggedIn: false,
  userData: null,
  access : "User",
  login: (data) => set({ isLoggedIn: true, userData: data }),
  logout: () => {
    localStorage.removeItem("token");
    return set({ isLoggedIn: false, userData: null, access: "User" });
  },
  setAccess: (access = "User") => set({ access: access})
}));
export default useAuthStore;
