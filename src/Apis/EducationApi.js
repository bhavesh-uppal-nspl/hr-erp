import axios from "axios";
import { MAIN_URL } from "../Configurations/Urls";
import toast from "react-hot-toast";

export async function fetchEmployeeEducationLevel(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/education-level`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("education level", response.data);
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

export async function fetchEmployeeEducationStream(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/education-stream`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("education stream", response.data);
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

export async function fetchEmployeeEducationDegree(orgId, levelId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/education-level/${levelId}/education-degree`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("education degree", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error("Session Expired!");
      window.location.href = "/login";
    }

    if (error.response) {
      console.error("API Response Error:", error.response.data);
    } else if (error.request) {
      console.error("No Response Received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
  }
}

export async function fetchEmployeeLanguages(orgId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/language`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("education languages", response.data);
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




// fetch education streeam by level and degree
export async function fetchEmployeeEducationStreamByLevelDegree(orgId, levelId, degreeId) {
  try {
    const response = await axios.get(
      `${MAIN_URL}/api/organizations/${orgId}/education-stream/by-level-degree/${levelId}/${degreeId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data.streams; // important: return only the array
  } catch (error) {
    console.error("Failed to fetch streams:", error);
    throw error;
  }
}
