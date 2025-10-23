import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import {
  fetchEmployeeLeaveEntitlements,
  fetchEmployeeLeaves,
} from "../../../Apis/Employee-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import { fetchAttendanceStatus } from "../../../Apis/Attendance";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

function AttendenceStatusTypeList() {
  const [statusType, setStatusType] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchAttendanceStatus(org?.organization_id)
        .then((data) => {
          let a = data?.attendance_status_types;
          console.log("a of entile is ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.organization_attendance_status_type_id,
            
              is_active:item?.is_active == 1 ? "✔": "✖"
            };
          });
          setStatusType(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteStatus = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/attendance-status-type/${id}`,
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
        error.response?.data?.error || "Failed to delete Attendance Status Type"
      );
    }
  };

  
    const handleDelete = async (id) => {
      try {
        const response = await fetch(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-status-type/${id}`,
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
        console.log("Successfully deleted units-types with id:", id);
        return Promise.resolve();
      } catch (error) {
        console.error("Delete failed:", error);
        return Promise.reject(error);
      }
    };


    const handleEdit = useCallback(

    (item) => {

         navigate(`/attendance/status-type/edit/${item.id}`);

    },

    [navigate]

  );
  

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Attendance Status Type"}
        btnName={"Add Status Type"}
        delete_action={"ATTENDANCE_DELETE"}
        Data={statusType}
        tableHeaders={[
          {
            name: "Status Name",
            value_key: "attendance_status_type_name",
            textStyle: "capitalize",
          },
          {
            name: "Status Type Code",
            value_key: "attendance_status_type_code",
            textStyle: "capitalize",
          },
          {
            name: "Description",
            value_key: "description",
            textStyle: "capitalize",
          },
        ]}
        Icons={[
          <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <FormatAlignJustifyIcon color="primary" />,
          <CategoryIcon sx={{ color: "text.secondary" }} />,
          <DateRangeIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Attendance Status Type",
          "Attendance Status Type",
          "Add Attendance Status Type",
          "Attendance Status Type",
        ]}
        Route={"/attendance/status-type"}
        setData={setStatusType}
        DeleteFunc={deleteStatus}
      />


        <TableDataGeneric
          tableName="Attendance Status Type"
          primaryKey="organization_attendance_status_type_id"
          heading="Attendance Status Type"
          data={statusType}
          sortname={"attendance_status_type_name"}
          showActions={true}
          // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-status-type`}
          Route="/attendance/source"
          DeleteFunc={handleDelete}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}
        />

    </>
  );
}

export default AttendenceStatusTypeList;
