import axios from 'axios';
import { MAIN_URL } from "../Configurations/Urls";
import toast from 'react-hot-toast';

export async function fetchDocumentTypes(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/employemnt-document-type`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("document", response.data);
    return response.data;

  } catch (error) { if (error.response && error.response.status === 401) {
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



export async function fetchDocuments(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/employemnt-document`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("document", response.data);
    return response.data;

  } catch (error) { if (error.response && error.response.status === 401) {
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



export async function fetchEmployeeProfileSection(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/employee-profile-section`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("sections", response.data);
    return response.data;

  } catch (error) { if (error.response && error.response.status === 401) {
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