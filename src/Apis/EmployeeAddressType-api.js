import axios from 'axios';
import {   MAIN_URL } from "../Configurations/Urls";

export async function fetchOrganizationEmployeeAddressTypes(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/employemnt-addresstype`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
   console.log("address type",response.data);
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