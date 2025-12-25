import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchOrganizationEmpExitReasonType } from "../../../Apis/ExitReason.js";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls.js";
import toast from "react-hot-toast";
import Customisetable from "../../../Components/Table/Customisetable.jsx";
import TableDataGeneric from "../../../Configurations/TableDataGeneric.js";
import Layout4 from "../../DataLayouts/Layout4.jsx";
import { useNavigate, useParams } from "react-router-dom";

function OrganizationEmployementExitReasonTypeList() {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
  const [ExitReasonType, setExitReasonType] = useState([]);
   const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationEmpExitReasonType(org.organization_id)
        .then((data) => {
          let a = data?.exitreason?.data;
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_employment_exit_reason_type_id,
         
            };
          });
          setExitReasonType(b);
        })
        .catch((err) => {
          console.error("Failed to fetch Organization Exit Reason Type", err);
        })
        .finally(() => setLoading(false));
    }
  }, [org]);

  let deleteExitReasonType = async (id) => {
    try {
      console.log("id", id);
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/employment-exit-reason-type/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
       if (response.status === 200) {
        toast.success(response.data.message);
           } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Exit Reason Type";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Exit Reason Type"
      );
    }
  };


  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/employement-exit-reason-type/edit/${item.id}`);

    },

    [navigate]

  );



                        const handleShow = useCallback(
      (item) => {
        navigate(`/organization-configration/employement-exit-reason-type/view/${item.id}`)
      },
      [navigate],
    )


 
  return (

    <>
    <Layout4
      loading={loading}
      heading={"Exit Reason Types"}
      btnName={"Add Exit Reason Type"}
      Data={ExitReasonType}
      add_action={"EXIT_REASON_TYPE_ADD"}
      delete_action={"EXIT_REASON_TYPE_DELETE"}
      tableHeaders={[
        {
          name: "Exit Reason Type",
          value_key: "employment_exit_reason_type_name",
          textStyle: "capitalize",
        },
        { name: "Description", value_key: "description" },
      ]}
      Icons={[
        <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <ViewHeadlineIcon color="primary" />,
        <ExitToAppIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "Employment Exit Reason Type",
        "Employment Exit Reason Type",
        "Add Employment ExitReason Type",
        "Employment ExitReason Type",
      ]}
      Route={"/organization-configration/employement-exit-reason-type"}
      setData={setExitReasonType}
      DeleteFunc={deleteExitReasonType}
    />

      
    
      
            <TableDataGeneric
              tableName="Exit Reason Types"
              primaryKey="organization_employment_exit_reason_type_id"
              heading="Exit Reason Types"
              data={ExitReasonType}
                sortname={"exit_reason_type_name"}
                showActions={true}
                //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employement-exit-reason-type`}
              Route="/organization-configration/employement-exit-reason-type"
              DeleteFunc={deleteExitReasonType}
                EditFunc={handleEdit}
              token={localStorage.getItem("token")}
              handleShow={handleShow}
              edit_delete_action={["EXIT_REASON_TYPE_DELETE", "EXIT_REASON_TYPE_EDIT"]}

               organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["employment_exit_reason_type_name","description"],
          mandatoryColumns: ["employment_exit_reason_type_name","description"],
        }}
            
            />
      
       
    </>
  );
}

export default OrganizationEmployementExitReasonTypeList;
