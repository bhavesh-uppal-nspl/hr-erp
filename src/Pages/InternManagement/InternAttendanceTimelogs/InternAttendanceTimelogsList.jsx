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
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";
import { fetchInternAttendanceTimeLogs } from "../../../Apis/InternManagement";

function InternAttendanceTimelogsList() {
  const [leaves, setLeaves] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { id } = useParams();

  const getFormattedAttendanceLogs = async (orgId) => {
    try {
      const data = await fetchInternAttendanceTimeLogs(orgId);
      const a = data?.attendance_time_logs || [];

      return a.map((item) => ({
        ...item,
        id: item.intern_attendance_timelog_id ,
        intern_name:
          `${item?.intern?.first_name || ""} ${item?.intern?.middle_name || ""} ${item?.intern?.last_name || ""} -- ${item?.intern?.intern_code}`.trim(),
        attendance_date: new Date(item.attendance_date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        ),
        intern_code: item?.intern?.intern_code,
        remarks: item?.remarks === null ? "" : item?.remarks,
        attendance_log_time: new Date(item.attendance_log_time).toLocaleString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          }
        ),
      }));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Failed to fetch attendance logs:", err);
      return [];
    }
  };

  useEffect(() => {
    if (org?.organization_id) {
      loadAttendanceLogs();
    }
  }, [org]);

  const loadAttendanceLogs = async () => {
    setLoading(true);
    const logs = await getFormattedAttendanceLogs(org?.organization_id);
    setLeaves(logs);
    setLoading(false);
  };

  let deleteemployeeleave = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/intern-time-logs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      loadAttendanceLogs();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Attendance Time Log"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-time-logs/${id}`,
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
      setLeaves((prev) => prev.filter((item) => item.id !== id));
      toast.success("Attendance log deleted successfully");
      console.log("Successfully deleted units-types with id:", id);
      return Promise.resolve();
    } catch (error) {
      console.error("Delete failed:", error);
      return Promise.reject(error);
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/intern/attendance/time-logs/edit/${item.id}`);
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Intern Attendance Time Logs"}
        btnName={"Add Time Log"}
        Data={leaves}
        delete_action={"LEAVE_DELETE"}
        tableHeaders={[
          { name: "Employee Code", value_key: "employee_code" },
          { name: "Employee Name", value_key: "name", textStyle: "capitalize" },
          { name: "Attendance Date", value_key: "attendance_date" },
          {
            name: "Attendance Log Type",
            value_key: "attendance_log_type",
            textStyle: "capitalize",
          },
          { name: "Attendance Log Time", value_key: "attendance_log_time" },
          { name: "Remarks", value_key: "remarks", textStyle: "capitalize" },
        ]}
        Icons={[
          <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <FormatAlignJustifyIcon color="primary" />,
          <CategoryIcon sx={{ color: "text.secondary" }} />,
          <DateRangeIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Attendance Time Logs",
          "Attendance Time Logs",
          "Add Time Logs",
          "Attendance Time Logs",
        ]}
        Route={"/intern/attendance/time-logs"}
        setData={setLeaves}
        DeleteFunc={deleteemployeeleave}
      />

      <TableDataGeneric
        tableName="Intern Attendance Time Logs"
        primaryKey="intern_attendance_timelog_id"
        heading="Intern Atendance Time Logs"
        data={leaves}
        sortname={"attendance_log_type"}
        showActions={true}
     
        Route="/intern/attendance/time-logs"
        DeleteFunc={handleDelete}
        token={localStorage.getItem("token")}


             
                organizationUserId={userData?.organization_user_id} 
          showLayoutButtons={true}
          config={{
            defaultVisibleColumns: [
            "intern_name",
            "intern_code",
            "attendance_date",
            "attendance_log_time",
            "attendance_log_type"
          
          ],
          mandatoryColumns: [
          "intern_name",
            "intern_code",
            "attendance_date",
            "attendance_log_time",
            "attendance_log_type"
           
          ],
        }}
      />
    </>
  );
}

export default InternAttendanceTimelogsList;

