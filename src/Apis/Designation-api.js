import axios from 'axios';
import {   MAIN_URL } from "../Configurations/Urls";
import toast from 'react-hot-toast';

export async function fetchOrganizationDesignation(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/designation`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("designation", response.data);
    return response.data;

  } catch (error) {
        if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}


    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch profile');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}




export async function fetchOrganizationDesignationss(orgId, mode = null) {
  try {
    const params = {};
    if (mode !== null) {
      params.mode = mode;
    }

    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/designation`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: params,
      }
    );

    console.log("designation", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error("Session Expired!");
      window.location.href = "/login";
    }
    if (error.response) {
      console.error("API Response Error:", error.response.data);
      throw new Error(error.response.data.error || "Failed to fetch designations");
    } else if (error.request) {
      console.error("No Response Received:", error.request);
      throw new Error("No response from server.");
    } else {
      console.error("Error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
}

