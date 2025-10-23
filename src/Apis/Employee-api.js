import axios from 'axios';
import {   MAIN_URL } from "../Configurations/Urls";
import toast from 'react-hot-toast';

export async function fetchOrganizationEmployee(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/employee?mode=1`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
   console.log("employee",response.data);
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



export async function fetchOrganizationEmployeess(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/employee?mode=2`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
   console.log("sgygy",response.data);
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

export async function fetchEmployeeAddress(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/employee-address`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    return response.data;

  } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Employee Address');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}


export async function fetchEmployeeExit(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/employee-exit`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("respon",response)
    return response.data;

  } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Employee Address');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}



export async function fetchEmployeeLeaves(orgId) {
  try {

    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/employee-leave`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    console.log("respon",response)
    return response.data;

  } catch (error) {
    if (error.response) {
        if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Employee Address');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}


export async function fetchEmployeeConatct(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/employee-contact`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
   console.log(response.data)
    return response.data;

  } catch (error) {
    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Employee Address',  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}

export async function fetchEmployeeLeaveEntitlements(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/employee-entitlements`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
   console.log("entitlments",response.data)
    return response.data;

  } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Employee Address',  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}

export async function fetchEmployeeLeaveBalanceReport(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/leave-balances/taken`, );
   console.log("reports ",response?.data)
    return response.data;

  } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Employee Address',  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}



export async function fetchEmployeeLeaveMonthlySummaryReport(orgId) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/organizations/${orgId}/employee-monthlyleave-summary`, );
   console.log("summary ",response?.data)
    return response.data;

  } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Employee Address',  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}


export async function fetchEmployeRecord(orgId) {

    try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/employee-records`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
       
      
    );
    console.log("my records", response);
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



export async function fetchEmployeStages(orgId) {

    try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/employment-stages`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
       
      
    );
    console.log("my records", response);
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
