import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { fetchOrganizationLeaveReasonTypes, fetchOrganizationLeaveReasonTypesData } from "../../../Apis/Leave-api";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import Customisetable from "../../../Components/Table/Customisetable";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";

function LeaveReasonTypeList() {
  const [leaveReasonType, setLeaveReasonTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;
   const navigate = useNavigate();

  const {id} = useParams();


  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationLeaveReasonTypesData(org.organization_id)
        .then((data) => {
          let a = data?.leavereasontype;
          console.log("aaa", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_leave_reason_type_id,
              leaveType: item.leavetype[0].leave_type_name,
              leave_reason_type_name: item?.leave_reason_type_name,
              description: item?.description == null ? "" : item?.description,
        
            };
          });
          setLeaveReasonTypes(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deletereason = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/leave-reason-type/${id}`,
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
          "Failed to delete Leave Reason Type";

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
        error.response?.data?.error || "Failed to delete Leave Reason Type"
      );
    }
  };


  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/leave-reason-type/edit/${item.id}`);

    },

    [navigate]

  );



                       const handleShow = useCallback(
      (item) => {
        navigate(`/organization-configration/leave-reason-type/view/${item.id}`)
      },
      [navigate],
    )



    

  return (
    <>
      <Layout4
        loading={loading}
        add_action={"LEAVE_REASON_TYPE_ADD"}
        heading={"Leave Reason Types"}
        btnName={"Add Leave Reason Type"}
        Data={leaveReasonType}
        delete_action={"LEAVE_REASON_TYPE_DELETE"}
        tableHeaders={[
          {
            name: "Leave Reason Types",
            value_key: "leave_reason_type_name",
            textStyle: "capitalize",
          },
          {
            name: "Leave Type",
            value_key: "organization_leave_type_id",
            textStyle: "capitalize",
          },
          { name: "Description", value_key: "description" },
        ]}
        Icons={[
          <FormatAlignJustifyIcon
            sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
          />,
          <FormatAlignJustifyIcon color="primary" />,
          <NextWeekIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Leave Reasons Type",
          "Leave Reason Type",
          "Add Leave Reason Type",
          "Leave Reason Type",
        ]}
        Route={"/organization-configration/leave-reason-type"}
        setData={setLeaveReasonTypes}
        DeleteFunc={deletereason}
      />


      <TableDataGeneric
        tableName="Leave Reason Types"
        primaryKey="organization_leave_reason_type_id"
        heading="Leave Reason Type"
        data={leaveReasonType}
          sortname={"leave_reason_type_name"}
          showActions={true}
          //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/leave-reason-type`}
        Route="/organization-configration/leave-reason-type"
        DeleteFunc={deletereason}
        handleShow={handleShow}
         EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        edit_delete_action={["LEAVE_REASON_TYPE_DELETE", "LEAVE_REASON_TYPE_EDIT"]}
         organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["leave_reason_type_name","leavetype","description"],
          mandatoryColumns: ["leave_reason_type_name","leavetype","description"],
        }}
      
                 
      
      />

    </>
  );
}

export default LeaveReasonTypeList;
