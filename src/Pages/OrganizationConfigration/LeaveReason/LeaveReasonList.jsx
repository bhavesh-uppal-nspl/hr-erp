import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { fetchLeaveReason } from "../../../Apis/Leave-api";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import {MAIN_URL } from "../../../Configurations/Urls";
import Customisetable from "../../../Components/Table/Customisetable";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";

function LeaveReasonList() {
  const [leaveReason, setLeaveReason] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;
   const navigate = useNavigate();

  const {id} = useParams();

    useEffect(() => {
      if (org?.organization_id) {
        setLoading(true);
        fetchLeaveReason(org.organization_id)
          .then((data) => {
            let a = data.leavereasons.data;
            console.log(a);
            
            let b = a.map((item) => {
              return {
               ...item,
                id:item.organization_leave_reason_id,
                reason_type:item?.leavereasontype[0]?.leave_reason_type_name,
              
                description:item?.description==null ? "" :item?.description
              
  
              };
            });
            setLeaveReason(b);
          })
          .catch((err) => {});
        setLoading(false);
      }
    }, [org]);

  let deletereason = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/leave-reason/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Leave Reason"
      );
    }
  };


const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/leave-reason/edit/${item.id}`);

    },

    [navigate]

  );



  return (
    <>
    <Layout4
      loading={loading}
      heading={"Leave Reasons"}
      btnName={"Add Leave Reason"}
      Data={leaveReason}
       delete_action={"ORG_CONFIG_DELETE"}
      tableHeaders={[
        {name : "Leave Reasons" , value_key : "leave_reason_name" ,textStyle: "capitalize",},
          {name : "Leave Reason Type" , value_key : "reason_type" ,textStyle: "capitalize",},
           {name : "Description" , value_key : "description" },
        
      ]}
      Icons={[
        <FormatAlignJustifyIcon
          sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
        />,
        <FormatAlignJustifyIcon color="primary" />,
        <NextWeekIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "leave reasons",
        "leave reasons",
        "Add Leave Reasons",
        "leave reasons",
      ]}
      Route={"/organization-configration/leave-reason"}
      setData={setLeaveReason}
      DeleteFunc={deletereason}
    />




      <TableDataGeneric
        tableName="Leave Reasons"
        primaryKey="organization_leave_reason_id"
        heading="Leave Reasons"
        data={leaveReason}
          sortname={"leave_reason_name"}
          showActions={true}
          //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/leave-reason`}
        Route="/organization-configration/leave-reason"
        DeleteFunc={deletereason}
          EditFunc={handleEdit}
        token={localStorage.getItem("token")}
                   organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["leave_reason_name","leavereasontype","description"],
          mandatoryColumns: ["leave_reason_name","leavereasontype","description"],
        }}
      
      
      />
 
    </>
  );
}

export default LeaveReasonList;
