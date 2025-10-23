import axios from 'axios';
import {   MAIN_URL } from "../Configurations/Urls";

export async function fetchOrganizationProfile(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/profile`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
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
