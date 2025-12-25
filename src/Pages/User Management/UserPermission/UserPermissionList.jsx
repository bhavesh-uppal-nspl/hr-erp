import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import {
  fetchApplicationUserPermission,
} from "../../../Apis/ApplicationManagementApis";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import toast from "react-hot-toast";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import useAuthStore from "../../../Zustand/Store/useAuthStore";

function UserPermissionList() {
  const [assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchApplicationUserPermission(org?.organization_id);
        const permissions = res?.permissions || [];

        // Group permissions by unique user
        const grouped = permissions.reduce((acc, curr) => {
          const userId = curr.application_user_id;
          
          if (!acc[userId]) {
            acc[userId] = {
              id: userId,
              user_id: userId,
              user_name: curr.application_user?.full_name || "Unknown User",
              email: curr.application_user?.email || "N/A",
              // // Count how many permissions this user has
              // permission_count: 0,
            };
          }
          
          // Increment permission count for this user
          acc[userId].permission_count++;
          
          return acc;
        }, {});

        console.log("grouped users:", grouped);

        // Convert to array and add view button
        const userList = Object.values(grouped).map((item) => ({
          ...item,
          permissions: `${item.permission_count} Permission(s)`,
          view: (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() =>
                navigate(`/application/user-permission/view/${item.user_id}`)
              }
            >
              View
            </Button>
          ),
        }));

        setAssignment(userList);
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        toast.error("Failed to load user permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const deleteassignment = async (userId) => {
    try {
      const response = await axios.delete(
        `${MAIN_URL}/api/application/user-permissions/particular/${userId}`,
        {
          params: {
            organization_id: org?.organization_id,
          },
        }
      );

      if (response.status === 200) {
        toast.success("User permissions deleted successfully");
        
        // Remove deleted user from the list
        setAssignment((prev) => prev.filter((item) => item.user_id !== userId));
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete user permissions"
      );
    }
  };

  return (
    <Layout1
      loading={loading}
      delete_action={"USER_PERMISSION_DELETE"}
      heading={"User Permission Overrides"}
      add_action={"USER_PERMISSION_ADD"}
      edit_action={"USER_PERMISSION_EDIT"}
      
      btnName={"Add User Permission"}
      Data={assignment}
      tableHeaders={[
        { name: "User Name", value_key: "user_name", textStyle: "capitalize" },
        { name: "Email", value_key: "email" },
        // { name: "Permissions", value_key: "permissions" },
        { name: "View Permissions", value_key: "view" },
      ]}
      Icons={[
        <FormatAlignJustifyIcon
          sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
        />,
        <ViewModuleIcon color="primary" />,
        <DescriptionIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "User Permission",
        "User Permission",
        "Add User Permission",
        "User Permission",
      ]}
      Route={"/application/user-permission"}
      setData={setAssignment}
      DeleteFunc={deleteassignment}
    />
  );
}

export default UserPermissionList;