import axios from "axios";
import { MAIN_URL } from "../Configurations/Urls";
import toast from "react-hot-toast";
export async function fetchIntershipTypes(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/internship-type`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("caledra ", response.data);
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



export async function fetchIntershipStatus(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/internship-status`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("caledra ", response.data);
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



export async function fetchInterns(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/interns`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("caledra ", response.data);
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

export async function fetchInternsss(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/interns?mode=1`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("caledra ", response.data);
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



export async function fetchInternExit(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/intern-exit`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("exit ", response.data);
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

export async function fetchInternLeaves(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/intern-leaves`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("exit ", response.data);
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


export async function fetchInternDocumentTypes(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/intern-document-type`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("exit ", response.data);
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

export async function fetchInternStipends(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/intern-stipend`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("exit ", response.data);
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

export async function fetchInternAttendanceTimeLogs(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/intern-time-logs`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("exit ", response.data);
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

export async function fetchInternAttendanceRecord(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/intern-attendance-record`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("exit ", response.data);
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


export async function fetchInternCertificates(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/intern-certificate`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("exit ", response.data);
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


export async function fetchInternStages(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/internship-stages`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("exit ", response.data);
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