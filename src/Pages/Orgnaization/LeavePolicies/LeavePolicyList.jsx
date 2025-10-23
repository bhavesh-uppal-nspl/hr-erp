import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { fetchEmployeeLeaves } from "../../../Apis/Employee-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import Layout2 from "../../DataLayouts/Layout2";
import dayjs from "dayjs";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";
import { fetchLeavepolicy } from "../../../Apis/Leave-api";

function LeavePolicyList() {
  const [leaves, setLeaves] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const {id} = useParams();

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  };

  useEffect(() => {
     if (org?.organization_id) {
       setLoading(true);
       fetchLeavepolicy(org.organization_id)
         .then((data) => {
           let a = data?.Policydata;
           console.log("a is ", a)
           let b = a.map((item) => {
             return {
               ...item,
               id: item.organization_leave_policy_id,   
               is_active:item?.is_active== null ?"✖": "✔" ,
               leave_entitlement:item?.leave_entitlement?.leavetype?.leave_type_name,
               max_leaves_per_period:item?.max_leaves_per_period==null ? "":Math.floor(item?.max_leaves_per_period),
               custom_period_days:item?.custom_period_days==null ? "":Math.floor(item?.custom_period_days)

             };
           });
           setLeaves(b);
         })
         .catch((err) => {});
       setLoading(false);
     }
   }, [org]);


 

  let deleteemployeeleave = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/leave-policy/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Employee Leave"
      );
    }
  };


  
    const handleDelete = async (id) => {
      try {
        const response = await fetch(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/leave-policy/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast.success("Successfully deleted Leave policy with id:", id);
        return Promise.resolve();
      } catch (error) {
        console.error("Delete failed:", error);
        return Promise.reject(error);
      }
    };


    const handleEdit = useCallback(

    (item) => {

         navigate(`/organization/leave-policy/edit/${item.id}`);
    },

    [navigate]

  );


  return (

    <>
    <Layout4
      loading={loading}
      heading={"Leave Policies"}
      btnName={"Add Policy"}
      Data={leaves}
      delete_action={"LEAVE_DELETE"}
      tableHeaders={[
        {
          name: "Employee Name",
          value_key: "fullName",
          textStyle: "capitalize",
        },
        { name: "Leave Starts", value_key: "startDate" },
        { name: "Leave Ends", value_key: "endDate" },
        {
          name: "Employee Remarks",
          value_key: "employee_remarks",
          textStyle: "capitalize",
        },
        { name: "Leave Status", value_key: "leave_status" },
      ]}
      Icons={[
        <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <FormatAlignJustifyIcon color="primary" />,
        <CategoryIcon sx={{ color: "text.secondary" }} />,
        <DateRangeIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "Leave Policy",
        "Leaves Policy",
        "Add Leave Policy",
        "Leaves",
      ]}
      Route={"/organization/leave-policy"}
      setData={setLeaves}
      DeleteFunc={deleteemployeeleave}
    />

    
    
    
          <TableDataGeneric
            tableName="Organization Leave Policy"
            primaryKey="organization_leave_policy_id"
            heading="Organization Leave Policy"
            data={leaves}
              sortname={"policy_name"}
              showActions={true}
              //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee-leave`}
            Route="/organization/leave-policy"
            DeleteFunc={handleDelete}
            EditFunc={handleEdit}
            token={localStorage.getItem("token")}

                organizationUserId={userData?.organization_user_id} // Pass user ID
          showLayoutButtons={true}
          config={{
            defaultVisibleColumns: [
            "policy_name",
            "leave_entitlement",
            "max_leaves_per_period",
            "usage_period",
            "is_active",
         
          ],
          mandatoryColumns: [
            "policy_name",
            "leave_entitlement",
            "max_leaves_per_period",
            "usage_period",
            "is_active",
           
          ],
        }}
          
          />
   
    </>
  );
}

export default LeavePolicyList;
