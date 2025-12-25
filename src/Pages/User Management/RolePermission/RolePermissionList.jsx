import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import { fetchApplicationRolePermission } from '../../../Apis/ApplicationManagementApis';
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import toast from "react-hot-toast";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import useAuthStore from "../../../Zustand/Store/useAuthStore";

function RolePermissionList() {
  const [assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Pass organization_id as parameter
        const res = await fetchApplicationRolePermission(org?.organization_id);
        const a = res?.permissions;

        // Group permissions by unique role
        const grouped = a.reduce((acc, curr) => {
          const roleId = curr.application_user_role?.application_user_role_id;
          if (!acc[roleId]) {
            acc[roleId] = {
              id: roleId,
              name: curr.application_user_role?.user_role_name,
            };
          }
          return acc;
        }, {});

        console.log("grouped is ", grouped);

        const b = Object.values(grouped).map((item) => ({
          ...item,
          view: (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => navigate(`/application/user-role-permission/view/${item.id}`)}
            >
              View Permissions
            </Button>
          ),
        }));
        setAssignment(b);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch role permissions");
      }
      setLoading(false);
    };

    if (org?.organization_id) {
      fetchData();
    }
  }, [org?.organization_id, navigate]);

  const deleteassignment = async (id) => {
    try {
      const response = await axios.delete(
        `${MAIN_URL}/api/application/role-permissions/particular/${id}`,
        {
          params: {
            organization_id: org?.organization_id,
          },
        }
      );
      
      toast.success("Role permissions deleted successfully");
      
      // Refresh the list after deletion
      setAssignment((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete User Role Permission");
    }
  };

  return (
    <Layout1
      loading={loading}

      edit_action={"USER_ROLE_PERMISSION_EDIT"}
      delete_action={"USER_ROLE_PERMISSION_DELETE"}
      heading={"User Role Permissions"}
      btnName={"ADD ROLE PERMISSION"}
      Data={assignment}
      tableHeaders={[
        { name: "Role", value_key: "name", textStyle: "capitalize" },
        { name: "View", value_key: "view" },
      ]}
      Icons={[
        <FormatAlignJustifyIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <ViewModuleIcon color="primary" />,
        <DescriptionIcon sx={{ color: "text.secondary" }} />
      ]}
      messages={[
        " Role Permission",
        " Role Permission",
        "Add  Role Permission",
        "Role Permission"
      ]}
      Route={"/application/user-role-permission"}
      setData={setAssignment}
      DeleteFunc={deleteassignment}
    />
  );
}

export default RolePermissionList;