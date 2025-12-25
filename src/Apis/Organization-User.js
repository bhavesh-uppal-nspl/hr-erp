import axios from "axios";
import { MAIN_URL } from "../Configurations/Urls";
import toast from "react-hot-toast";

export const getOrganizationUser = async (org_id, search = "", status = "") => {
  const response = await axios.get(
    `${MAIN_URL}/api/organizations/${org_id}/user`,
    {
      params: {
        search: search || undefined,
        status: status !== "all" ? status : undefined,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  console.log("abc", response.data);
  return response.data;
};

export async function SystemRoles() {
  try {
    const response = await axios.get(`${MAIN_URL}/api/general/systemrole`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }

      console.error("API Response Error:", error.response.data);
      throw new Error(error.response.data.error || "Failed to fetch profile");
    } else if (error.request) {
      console.error("No Response Received:", error.request);
      throw new Error("No response from server.");
    } else {
      console.error("Error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
}

export async function ApplicationRoles() {
  try {
    const response = await axios.get(`${MAIN_URL}/api/application/userrole`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error("Session Expired!");
      window.location.href = "/login";
    }

    if (error.response) {
      console.error("API Response Error:", error.response.data);
      throw new Error(error.response.data.error || "Failed to fetch profile");
    } else if (error.request) {
      console.error("No Response Received:", error.request);
      throw new Error("No response from server.");
    } else {
      console.error("Error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
}
