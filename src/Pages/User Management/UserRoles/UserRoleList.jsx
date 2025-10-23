import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import {fetchApplicationUserRoles} from '../../../Apis/ApplicationManagementApis'
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import toast from "react-hot-toast";
import DescriptionIcon from '@mui/icons-material/Description';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../Zustand/Store/useAuthStore";

function UserRoleList() {

 
  const [userroles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);
    const { userData } = useAuthStore();

   const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    {
      setLoading(true);
      fetchApplicationUserRoles()
        .then((data) => {
          console.log("nnxc",data)
          let a = data.userroles;
          try {
                let b = a.map((item) => {
            return {
               id: item.application_user_role_id,
               name:item.user_role_name,
               description: item?.description == null ? "" :item?.description,
            };
          });
          setUserRoles(b);
            
          } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
            console.log(error)
          }
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, []);


  let deleteuserroles = async (id) => {
    try {
   
      const response = await axios.delete(
        `${MAIN_URL}/api/application/userrole/${id}`);
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete User Roles");
    }
  };

  
const handleEdit = useCallback(

    (item) => {

         navigate(`/application/user-roles/edit/${item.id}`);

    },

    [navigate]

  );

  return (
    <>
    <Layout4
      loading={loading}
      heading={"User Roles"}
      btnName={"Add User Roles"}
      Data={userroles}
      Icons={[
        <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <AdminPanelSettingsIcon color="primary" />,
        <DescriptionIcon sx={{ color: "text.secondary" }} />]
      }
      messages={[
        " User Roles",
        " User Roles",
        "Add  User Roles",
        " User Roles"
      ]}
      Route={"/application/user-roles"}
      setData={setUserRoles}
      DeleteFunc={deleteuserroles}
    />

            <TableDataGeneric
              tableName="User Roles"
              primaryKey="application_user_role_id"
              heading="User Roles"
              data={userroles}
              sortname={"user_role_name"}
              showActions={true}
              // apiUrl={`${MAIN_URL}/api/organizations/userrole`}
              Route="/application/user-roles"
              DeleteFunc={deleteuserroles}
               EditFunc={handleEdit}
              token={localStorage.getItem("token")}

              organizationUserId={userData?.organization_user_id} 
          showLayoutButtons={true}
           config={{
          defaultVisibleColumns: ["name","description"],
          mandatoryColumns: ["name","description"]
        }}
            />
        
    </>

  );
}

export default UserRoleList;
