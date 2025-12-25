import axios from "axios";
import { MAIN_URL } from "../Configurations/Urls";
import toast from "react-hot-toast";

export const getIndustry = async () => {
  try {
    const response = await axios.get(`${MAIN_URL}/api/general/industry`);
    console.log("njhjc", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error("Session Expired!");
      window.location.href = "/login";
    }

    console.error("Error fetching industry data:", error);
    throw error;
  }
};

export const getOwnerShipType = async () => {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/businessnownershiptype`
    );
    console.log("jfggbj", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error("Session Expired!");
      window.location.href = "/login";
    }

    console.error("Error fetching ownership types :", error);
    throw error;
  }
};

export const fetchOrganizations = async (client_id) => {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations`, {
      params: { client_id },
    });
    console.log("organizations", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error("Session Expired!");
      window.location.href = "/login";
    }

    console.error("Error fetching ownership types :", error);
    throw error;
  }
};





export const getOrganizationBySerach = async (client_id, search = "") => {
  const response = await axios.get(
    `${MAIN_URL}/api/organizations/v1`,
    {
      params: {
         client_id: client_id ,
        search: search || undefined,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return response.data;
};

