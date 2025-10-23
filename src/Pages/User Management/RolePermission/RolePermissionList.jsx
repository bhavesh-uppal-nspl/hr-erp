import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import {fetchApplicationRolePermission} from '../../../Apis/ApplicationManagementApis'
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import toast from "react-hot-toast";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";


function RolePermissionList() {

 const [assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(true);

   const navigate = useNavigate();



useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchApplicationRolePermission();
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

      console.log("grouped  is ", grouped)

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
    }
    setLoading(false);
  };

  fetchData();
}, []);


  let deleteassignment = async (id) => {
    try {
   
      const response = await axios.delete(
        `${MAIN_URL}/api/application/role-permissions/particular/${id}`);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete User Role Assignment");
    }
  };

  return (
    <Layout1
      loading={loading}
      heading={"User Role Permissions"}
      btnName={"Add User Role Permission"}
      Data={assignment}

        tableHeaders={[
        {name : "Role" , value_key : "name" ,textStyle: "capitalize",},
       { name: "View", value_key: "view" },
       
      ]}


      Icons={[
        <FormatAlignJustifyIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <ViewModuleIcon color="primary" />,
        <DescriptionIcon sx={{ color: "text.secondary" }} />
      ]
      }
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

























