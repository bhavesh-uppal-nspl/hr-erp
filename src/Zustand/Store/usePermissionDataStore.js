// src/Zustand/AuthStore.js
import { create } from "zustand";
const usePermissionDataStore = create((set) => ({
  Permission: [],
  setPermission: (data) => set({ Permission: data }),
}));
export default usePermissionDataStore;
