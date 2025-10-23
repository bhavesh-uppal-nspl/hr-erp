import React, { useCallback, useEffect, useState } from "react";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOrganizationFunctionalRolesSpecial } from "../../../Apis/FunctionalManagment";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import LogoutIcon from "@mui/icons-material/Logout";


function FunctionRoleSpecializationList() {
  const [func, setFunc] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();

 const navigate = useNavigate();

  const {id} = useParams();
  const org = userData?.organization;

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationFunctionalRolesSpecial(org?.organization_id)
        .then((data) => {
          let a = data?.functional?.data;
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_functional_role_specialization_id  ,
              functional_role:item?.function_role?.functional_role_name,
                is_active: item?.is_active == 1 ? "✔" : "✖",
            };
          });
          setFunc(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);


  let deletedesignation = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/func-role-spec/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: function (status) {
            return status >= 200 && status < 500; // handle 4xx errors gracefully
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        console.log("Organization Functional Roles deleted:", response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Roles";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };


  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization/functional-role-specialization/edit/${item.id}`);

    },

    [navigate]

  );


  return (
    <>
      <Layout4
        loading={loading}
        heading={"Functional Role Specialization"}
        btnName={"Add Roles"}
        Data={func}
        tableHeaders={[
          { name: "Code", value_key: "employee_code", width: "50px" },
          { name: "Name", value_key: "name", width: "150px" },

          {
            name: "NoticePeriod Starts",
            value_key: "notice_period_start",
            width: "170px",
          },

          {
            name: "NoticePeriod Ends",
            value_key: "notice_period_end",
            width: "170px",
          },
          {
            name: "Resignation Date",
            value_key: "resignation_date",
            width: "150px",
          },
          {
            name: "Relieving Date",
            value_key: "relieving_date",
            width: "150px",
          },
          {
            name: "Interview",
            value_key: "exit_interview_done",
            width: "50px",
          },
        ]}
        Icons={[
          <AutorenewIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <NextWeekIcon color="primary" />,
          <AlarmAddIcon sx={{ color: "text.secondary" }} />,
          <LogoutIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          " Functional Role Specialization",
          " Functional Role Specialization",
          "Add  Functional Role Specialization",
          "Functional Role Specialization",
        ]}
        Route={"/organization/functional-role-specialization"}
        setData={setFunc}
        DeleteFunc={deletedesignation}
      />

      <TableDataGeneric
        tableName="Organization Functional Role Specialization"
        primaryKey="organization_functional_role_specialization_id "
        heading="Functional Role Specialization"
        data={func}
        sortname={"intern_name"}
        showActions={true}
        Route="/organization/functional-role-specialization"
        DeleteFunc={deletedesignation}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}

        
                organizationUserId={userData?.organization_user_id} 
          showLayoutButtons={true}
          config={{
            defaultVisibleColumns: [
            "functional_role_specialization_code",
            "functional_role_specialization_name",
            "function_role",
            "is_active",
         
          ],
          mandatoryColumns: [
            "functional_role_specialization_code",
            "functional_role_specialization_name",
            "function_role",
            "is_active",
           
          ],
        }}
      />
    </>
  );
}

export default FunctionRoleSpecializationList;
