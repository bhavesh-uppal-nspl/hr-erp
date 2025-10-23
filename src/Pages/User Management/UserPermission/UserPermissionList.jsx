import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import {fetchApplicationRoleAssignment} from '../../../Apis/ApplicationManagementApis'
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import toast from "react-hot-toast";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DescriptionIcon from '@mui/icons-material/Description';


function UserPermissionList() {

 const [permission, setPermission] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     {
       setLoading(true);
       fetchApplicationRoleAssignment()
         .then((data) => {
           let a = data.roleAssignment;
           console.log("a",a)
           try {
                 let b = a.map((item) => {
             return {
                id: item.application_user_role_assignment_id,
                name:item.application_user.full_name,
                description:`${item.application_user_roles.user_role_name}`,
             };
           });
           setAssignment(b);
             
           } catch (error) {
             console.log(error)
           }
         })
         .catch((err) => {});
       setLoading(false);
     }
   }, []);


  let deleteassignment = async (id) => {
    try {
   
      const response = await axios.delete(
        `${MAIN_URL}/api/application/userrole-assignment/${id}`);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete User Role Assignment");
    }
  };

  return (
    <Layout1
      loading={loading}
      heading={"User Role Assignment"}
      btnName={"Add User Module Assignment"}
      Data={assignment}
      Icons={[
        <FormatAlignJustifyIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <ViewModuleIcon color="primary" />,
        <DescriptionIcon sx={{ color: "text.secondary" }} />
      ]
      }
      messages={[
        "User Role Assignment",
        "User Role Assignment",
        "Add Application User Role Assignment",
        "User Role Assignment"
      ]}
      Route={"/application/userrole-assignments"}
      setData={setAssignment}
      DeleteFunc={deleteassignment}
    />

  );
}

export default UserPermissionList;
