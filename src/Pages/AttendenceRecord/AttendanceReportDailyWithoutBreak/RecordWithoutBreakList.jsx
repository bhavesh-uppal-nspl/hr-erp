import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { MAIN_URL } from "../../../Configurations/Urls";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import { fetchAttendanceReport } from "../../../Apis/Attendance";

function RecordWithoutBreakList() {
  const [leaves, setLeaves] = useState([]);
  const { userData } = useAuthStore();

    const [summary, setSummary] = useState({date:null, total: 0, present: 0, absent: 0 });
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);

  // Format time into HH:mm format
 const formatTime = (dateTime) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


 const calculateTotalWorkMinutes = (clockIn, clockOut, breakMinutes) => {
    if (!clockIn || !clockOut) return 0;
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const diffMs = end - start;
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    return totalMinutes - (breakMinutes || 0);
  };


const formatMinutesToHours = (minutes) => {
  if (!minutes || minutes === 0) return "0 hrs";
  const hrs = Math.floor(minutes / 60);   // Convert total minutes → hours
  const mins = minutes % 60;              // Get remaining minutes
  return mins > 0 ? `${hrs} hrs ${mins} mins` : `${hrs} hrs`;
};


  // Calculate total working minute
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);

      fetchAttendanceReport(org?.organization_id)
        .then((data) => {
          const a = data?.attendance_records || [];
          console.log("Attendance Records:", a);

          const b = a.map((item) => {
            const totalWorkMinutes = calculateTotalWorkMinutes(
              item?.clock_in_time,
              item?.clock_out_time,
              item?.break_duration_minutes
            );

            return {
              ...item,
              id: item?.employee_attendance_record_id,
              name: `${item?.employee?.first_name || ""} ${item?.employee?.middle_name || ""} ${item?.employee?.last_name || ""}`.trim(),
              status_type: item?.status_type?.attendance_status_type_name || "Present",
              check_in: formatTime(item?.clock_in_time),
              check_out: formatTime(item?.clock_out_time),
              workshift_total_work_minutes: formatMinutesToHours(item?.workshift_total_work_minutes),
              actual_total_work_minutes: formatMinutesToHours(item?.actual_total_work_minutes),
              attendance_date:item?.attendance_date
            };
          });

          setLeaves(b);

         const date = b?.length > 0 ? b[0].attendance_date : null;
           const total = b?.length;
          const present = b.filter((e) => e.attendance_status === "Present")?.length;
          const absent = b.filter((e) => e.attendance_status === "Absent")?.length;

          setSummary({ date, total, present, absent });
        })
        .catch((err) => {
          console.error("Failed to fetch employee Attendance record:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [org]);


  const deleteemployeeleave = async (id) => {
    try {
      const org_id = org.organization_id;
      await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/attendance-employee-record/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setLeaves((prev) => prev.filter((leave) => leave.id !== id));
      toast.success("Employee Attendance Record Deleted Successfully");
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to delete Employee Attendance Record"
      );
    }
  };

  return (
    <Layout1
      loading={loading}
      add_action={"ADD_ACTION"}
      edit_action={"EDIT_ACTION"}
       heading={
          <div>
             Daily Attendance Report
            <div style={{ fontSize: "14px", marginTop: "5px", color: "#555" }}>
           <strong><b>Date</b>:</strong> <b>{summary.date}</b> &nbsp; | &nbsp;
              <strong>Total Employees:</strong> {summary.total} &nbsp; | &nbsp;
              <strong>Present:</strong>{" "}
              <span style={{ color: "green" }}>{summary.present}</span> &nbsp; | &nbsp;
              <strong>Absent:</strong>{" "}
              <span style={{ color: "red" }}>{summary.absent}</span>
            </div>
          </div>
        }
      btnName={null}
      Data={leaves}
      delete_action={"DELETE_ACTION"}
      tableHeaders={[
             { name: "Emp Code", value_key: "employee_code"},
        { name: "Employee Name", value_key: "employee_name", textStyle: "capitalize" },
        { name: "Status", value_key: "attendance_status", textStyle: "capitalize" },
        // { name: "Attendance Date", value_key: "attendance_date" },
        { name: "Clock In", value_key: "check_in" },
        { name: "Clock Out", value_key: "check_out" },
        { name: "Total Time", value_key: "actual_total_work_minutes" },
     
      ]}
      Icons={[
        <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <FormatAlignJustifyIcon color="primary" />,
        <CategoryIcon sx={{ color: "text.secondary" }} />,
        <DateRangeIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "",
        "",
        "",
        "",
      ]}
      Route={"/attendance/employee-recordss"}
      setData={setLeaves}
      DeleteFunc={deleteemployeeleave}
    />
  );
}

export default RecordWithoutBreakList;
