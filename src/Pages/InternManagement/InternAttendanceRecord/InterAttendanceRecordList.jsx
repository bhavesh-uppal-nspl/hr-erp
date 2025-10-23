
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
import { fetchInternAttendanceRecord } from "../../../Apis/InternManagement";

function InterAttendanceRecordList() {
  const [attendance, setAttendance] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);

  // Format time into HH:mm format
 const formatTime = (dateTime) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // ✔ 12-hour format with AM/PM
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
  if (!minutes || minutes === 0) return "0 mins";

  const hrs = Math.floor(minutes / 60); 
  const mins = minutes % 60;          
  if (hrs > 0 && mins > 0) {
    return `${hrs} hrs ${mins} mins`; 
  } else if (hrs > 0) {
    return `${hrs} hrs`;             
  } else {
    return `${mins} mins`;            
  }
};



  // Calculate total working minute
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);

      fetchInternAttendanceRecord(org?.organization_id)
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
              id: item?.intern_attendance_record_id ,
              name: `${item?.intern?.first_name || ""} ${item?.intern?.middle_name || ""} ${item?.employee?.last_name || ""}`.trim(),
              status_type: item?.status_type?.attendance_status_type_name || "Present",
              check_in: formatTime(item?.clock_in_time),
              check_out: formatTime(item?.clock_out_time),
              workshift_total_break_minutes: formatMinutesToHours(item?.workshift_total_break_minutes),
              actual_total_break_minutes: formatMinutesToHours(item?.actual_total_break_minutes),
              workshift_total_work_minutes: formatMinutesToHours(item?.workshift_total_work_minutes),
              actual_total_work_minutes: formatMinutesToHours(item?.actual_total_work_minutes),
              overtime_minutes: formatMinutesToHours(item?.overtime_minutes),
              hasdeviation: item?.has_deviations === 1 ? "✔" : "✖",
              NoOfdeviation: item?.has_deviations,
              intern_code: item?.intern?.intern_code,
            };
          });

          setAttendance(b);
        })
        .catch((err) => {
          console.error("Failed to fetch employee Attendance record:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [org]);

  // Delete Employee Attendance Record
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
      // Update UI after delete
      setAttendance((prev) => prev.filter((leave) => leave.id !== id));
      toast.success("Intern Attendance Record Deleted Successfully");
    } catch (error) {
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
      heading={"Intern Attendance Records"}
      btnName={"Add Attendance Record"}
      Data={attendance}
      delete_action={"LEAVE_DELETE"}
      tableHeaders={[
             { name: "Intern Code", value_key: "intern_code"},
        { name: "Intern Name", value_key: "name", textStyle: "capitalize" },
        { name: "Attendance Status", value_key: "status_type", textStyle: "capitalize" },
        { name: "Attendance Date", value_key: "attendance_date" },
        { name: "Check In", value_key: "check_in" },
        { name: "Check Out", value_key: "check_out" },
        { name: "Workshift Break", value_key: "workshift_total_break_minutes" },
        { name: "Actual Break", value_key: "actual_total_break_minutes" },
        { name: "Total Workshift", value_key: "workshift_total_work_minutes" },
        { name: "Actual TotalWork", value_key: "actual_total_work_minutes" },
        { name: "OverTime", value_key: "overtime_minutes" },
        { name: "Has Deviation", value_key: "hasdeviation" },
        { name: "No. of Deviation", value_key: "number_of_deviations" },
      ]}
      Icons={[
        <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <FormatAlignJustifyIcon color="primary" />,
        <CategoryIcon sx={{ color: "text.secondary" }} />,
        <DateRangeIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "Intern Attendance Record",
        "Intern Attendance Record",
        "Add Intern Attendance Record",
        "Intern Attendance Record, On Deleting Employee Time Log ,  The Related Atendance Deviation ,, Attendance Report , Attandence Overtime Report all Deleted permanently",
      ]}
      Route={"/attendance/employee-reco"}
      setData={setAttendance}
      DeleteFunc={deleteemployeeleave}
    />
  );
}

export default InterAttendanceRecordList;