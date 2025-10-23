import axios from 'axios';
import { MAIN_URL } from '../Configurations/Urls';
import toast from 'react-hot-toast';

export async function fetchApplicationUserRoles() {
  try {
    const response = await axios.get(`${MAIN_URL}/api/application/userrole`
    );
    console.log("user roles",response);
    return response.data;

  } catch (error) {

    if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}


    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Application user roles');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}

export async function fetchApplicationUserModules() {
  try {
    const response = await axios.get(`${MAIN_URL}/api/application/module`
    );
    console.log("user module",response);
    return response.data;

  } catch (error) {

        if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}


    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Application user module');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}


export async function fetchApplicationUserModuleAction() {
  try {
    const response = await axios.get(`${MAIN_URL}/api/application/module-action`
    );
    return response.data;
  } catch (error) {
        if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}


    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Application user module actions');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}


export async function fetchApplicationUser() {
  try {
    const response = await axios.get(`${MAIN_URL}/api/application/user`
    );
    return response.data;
  } catch (error) {
        if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}


    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Application users');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}




export async function fetchApplicationUserBtId(Org_id) {
  try {
    const response = await axios.get(`${MAIN_URL}/api/application/user`,{
      organization_id:Org_id
    }
    );
    return response.data;
  } catch (error) {
        if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}


    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Application users');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}



export async function fetchApplicationUserErrorLogs() {
  try {
    const response = await axios.get(`${MAIN_URL}/api/application/error-logs`
    );
    console.log("errors data ",response.data);
    return response.data;
  } catch (error) {

        if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}



    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Application user module actions');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}


export async function fetchApplicationRoleAssignment() {
  try {
    const response = await axios.get(`${MAIN_URL}/api/application/userrole-assignment`
    );

    console.log("ALL DATA IS  ",response.data)
    return response.data;
  } catch (error) {

        if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}




    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Application user rolw assignment');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}


export async function fetchApplicationPermission() {
  try {
    const response = await axios.get(`${MAIN_URL}/api/application/user-permission`
    );

    console.log(response.data)
    return response.data;
  } catch (error) {

        if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}




    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Application user rolw assignment');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}


export async function fetchApplicationRolePermission() {
  try {
    const response = await axios.get(`${MAIN_URL}/api/application/role-permissions`
    );

    console.log(response.data)
    return response.data;
  } catch (error) {
        if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}


    if (error.response) {
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch Application user rolw assignment');
    } else if (error.request) {
      console.error('No Response Received:', error.request);
      throw new Error('No response from server.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}


