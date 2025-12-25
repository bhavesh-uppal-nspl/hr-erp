import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { fetchLeaveTypes } from "../../../Apis/Leave-api";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import {MAIN_URL } from "../../../Configurations/Urls";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";
import { Description } from "@mui/icons-material";

function LeaveReasonList() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  
 const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchLeaveTypes(org.organization_id)
        .then((data) => {
          let a = data.leavetypes.data;
          console.log(a);
          let b = a.map((item) => {
            return {
             ...item,
             id:item.organization_leave_type_id,
              max_days_allowed: item?.max_days_allowed >1 ? `${item?.max_days_allowed} days`: `${item?.max_days_allowed} day`,
              carry_forward: item?.carry_forward == 1 ? "✔" : "✖",
              requires_approval: item?.requires_approval == 1 ? "✔" : "✖",
              is_active: item?.is_active == 1 ? "✔" : "✖",
              leave_code: item?.leave_code ? item.leave_code  : '-',
          
              description: item?.description== null ? "" :item?.description
             
            };
          });
          setLeaveTypes(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deletetypes = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/leave-type/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );

       if (response.status === 200) {
        toast.success(response.data.message);
           } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Leave Type";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }



    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Leave Type"
      );
    }
  };


  
  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/leave-types/edit/${item.id}`);

    },

    [navigate]

  );



                       const handleShow = useCallback(
      (item) => {
        navigate(`/organization-configration/leave-types/view/${item.id}`)
      },
      [navigate],
    )


    
    

  return (
    <>
    <Layout4
      loading={loading}
      heading={"Leave Types"}
      btnName={"Add Leave Type"}
      add_action={"LEAVE_TYPE_ADD"}
      Data={leaveTypes}
       delete_action={"LEAVE_TYPE_DELETE"}
       tableHeaders={[
        {name : "Leave Types" , value_key : "leave_type_name",textStyle: "capitalize", },
          {name : "Leave Type Code" , value_key : "leave_type_code" },
           {name : "Max.days Allowed" , value_key : "max_days_allowed" },
        
        
      ]}
      Icons={[
        <FormatAlignJustifyIcon
          sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
        />,
        <FormatAlignJustifyIcon color="primary" />,
        <NextWeekIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "leave types",
        "leave types",
        "Add Leave Types",
        "leave types",
      ]}
      Route={"/organization-configration/leave-types"}
      setData={setLeaveTypes}
      DeleteFunc={deletetypes}
    />

    
  
      
      <TableDataGeneric
        tableName="Leave Types"
        primaryKey="organization_leave_type_id"
        heading="Leave Type"
        data={leaveTypes}
          sortname={"leave_type_name"}
          showActions={true}
          //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/leave-type`}
        Route="/organization-configration/leave-types"
        DeleteFunc={deletetypes}
          EditFunc={handleEdit}
          handleShow={handleShow}
        token={localStorage.getItem("token")}
        edit_delete_action={["LEAVE_TYPE_DELETE", "LEAVE_TYPE_EDIT"]}

                    organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["leave_type_code","leave_type_name","max_days_allowed","leave_compensation_type"],
          mandatoryColumns: ["leave_type_code","leave_type_name","max_days_allowed","leave_compensation_type"],
        }}
      
      />
  
  
    </>
  );
}

export default LeaveReasonList;
