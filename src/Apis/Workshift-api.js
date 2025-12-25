import axios from 'axios';
import {   MAIN_URL } from "../Configurations/Urls";
import toast from 'react-hot-toast';

export async function fetchWorkShift(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/workshift`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("work shift",response);
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


export async function fetchWorkShiftTypes(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/workshift-type`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("work shift types",response);
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



export async function fetchWorkModel(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/work-model`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("work models",response);
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

export async function fetchWorkBreaks(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/workshift-breaks`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("work shift breaks",response);
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



export async function fetchEmployeeShiftAssignments(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/workshift-assignment`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("work",response);
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



export async function fetchRotationPatterns(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/workshift-rotation-pattern`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("work",response);
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



export async function fetchRotationDays(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/workshift-rotation-days`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("work",response);
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




export async function fetchWorkshiftRotationAssignment(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/workshift-rotation-assignment`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("work",response);
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






export async function fetchWorkShiftDays(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/workshift-days`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("work shift",response);
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





export async function fetchWorkModelDays(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/workmodel-days`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("work shift",response);
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
