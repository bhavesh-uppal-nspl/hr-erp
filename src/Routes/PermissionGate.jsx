import { useEffect, useState } from "react";
import axios from "axios";
import { MAIN_URL } from "../Configurations/Urls";
import useAuthStore from "../Zustand/Store/useAuthStore";

const PermissionGate = ({ action, children }) => {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const { userData } = useAuthStore();
  const org = userData;
  console.log("org is ", org)
  const userId = org?.application_user_id;

  useEffect(() => {
    const checkPermission = async () => {
      try {
       const res= await axios.get(`${MAIN_URL}/api/user/${userId}/has-access`);
       console.log("repon", res)
        setAllowed(res.data.has_access);
      } catch (error) {
        console.error("Permission check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [action, userId]);

//   if (loading) return <div>Loading...</div>;
//   if (!allowed) return <div>Access Denied</div>;

  return children;
};

export default PermissionGate;
