import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import BusinessIcon from "@mui/icons-material/Business";
import { fetchOrganizationEmploymentStatus } from "../../../Apis/OrganizationEmploymentStatus";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";
function OrganizationEmployementStatusesList() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;
   const navigate = useNavigate();

  const {id} = useParams();


  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationEmploymentStatus(org.organization_id)
        .then((data) => {
          let a = data.status.data;
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_employment_status_id,
           

            };
          });
          setStatuses(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteemploymentstatus = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/employment-status/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Employment status"
      );
    }
  };


  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/employee-status/edit/${item.id}`);

    },

    [navigate]

  );



 

  return (

    <>
    <Layout4
      loading={loading}
      heading={"Employment Status"}
      btnName={"Employment Status"}
      Data={statuses}
      delete_action={""}
      tableHeaders={[
        {
          name: "Employment Status Types",
          value_key: "employment_status_name",
          textStyle: "capitalize",
        },
      ]}
      Icons={[
        <AutorenewIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <NextWeekIcon color="primary" />,
        <BusinessIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "Employment status",
        "Employment statuses",
        "Add Employment status",
        "Employment status",
      ]}
      Route={"/organization-configration/employee-status"}
      setData={setStatuses}
      DeleteFunc={deleteemploymentstatus}
    />

    
    
          <TableDataGeneric
            tableName="Employees Status"
            primaryKey="organization_employment_status_id"
            heading="Employment Status"
            data={statuses}
              sortname={"employment_status_name"}
              showActions={true}
              //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employment-status`}
            Route="/organization-configration/employee-status"
            DeleteFunc={deleteemploymentstatus}
             EditFunc={handleEdit}
            token={localStorage.getItem("token")}
           organizationUserId={userData?.organization_user_id} // Pass user ID
          showLayoutButtons={true}
           config={{
          defaultVisibleColumns: ["employment_status_name"],
          mandatoryColumns: ["employment_status_name"]
        }}

          
          />
      
    </>
  );
}

export default OrganizationEmployementStatusesList;
