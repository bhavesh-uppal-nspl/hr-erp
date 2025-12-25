// src/Zustand/AuthStore.js
import { create } from "zustand";
import axios from "axios";
import { MAIN_URL } from "../../Configurations/Urls";

const usePermissionDataStore = create((set) => ({
  Permission: [],
  setPermission: (data) => set({ Permission: data }),

  updatePermissionStore: (updatedList) =>
    set((state) => ({
      Permission: updatedList, // overwrite with new API updated permissions
    })),

  // Function to refresh permissions from API
  refreshPermissions: async (organizationUserId) => {
    if (!organizationUserId) {
      console.warn("Organization User ID is required to refresh permissions");
      return;
    }

    try {
      const res = await axios.get(
        `${MAIN_URL}/api/user/${organizationUserId}/check-permission-access`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const allowed = res?.data?.allowed_actions || [];
      set({ Permission: allowed });
      console.log('Permissions refreshed:', allowed);
      return allowed;
    } catch (error) {
      console.error("Permission refresh error:", error);
      return null;
    }
  },
}));
export default usePermissionDataStore;
