import axios from 'axios';
import {   MAIN_URL } from "../Configurations/Urls";

export async function fetchOrganizationRegistration() {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/change-password`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("my regitration response",response);
    return response.data;

  } catch (error) {
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



export const changePassword = async (data, token) => {
    try {
        const response = await axios.post(
            `${MAIN_URL}/api/auth/change-password`, // Change to your actual endpoint
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { error: "Unknown error" };
    }
};