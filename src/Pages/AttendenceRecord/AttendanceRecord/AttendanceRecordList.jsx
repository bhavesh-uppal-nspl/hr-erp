
import React, { useEffect, useState, useCallback } from "react";
import Layout4 from "../../DataLayouts/Layout4";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import PersonIcon from "@mui/icons-material/Person";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import CategoryIcon from "@mui/icons-material/Category";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchAttendanceRecord } from "../../../Apis/Attendance";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";

// -----------------------------------
// DEFAULT DATAGRID CONFIG COLUMNS
// -----------------------------------
const DEFAULT_COLUMNS = [
  { field: "employee_code", label: "Employee Code", visible: true, sortable: true },
  { field: "name", label: "Employee Name", visible: true, sortable: true },
  { field: "status_type", label: "Attendance Status", visible: true, sortable: true },
  { field: "attendance_date", label: "Attendance Date", visible: true, sortable: true },
  { field: "check_in", label: "Check In", visible: true },
  { field: "check_out", label: "Check Out", visible: true },
  { field: "workshift_total_break_minutes", label: "Workshift Break", visible: true },
  { field: "actual_total_break_minutes", label: "Actual Break", visible: true },
  { field: "workshift_total_work_minutes", label: "Total Workshift", visible: true },
  { field: "actual_total_work_minutes", label: "Actual Total Work", visible: true },
  { field: "overtime_minutes", label: "Overtime", visible: true },
  // { field: "hasdeviation", label: "Has Deviation", visible: true },
  // { field: "NoOfdeviation", label: "No. of Deviations", visible: true },
];

function AttendanceRecordList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // ------------------------------
  // Helpers for formatting
  // ------------------------------
  const formatTime = (dateTime) => {
    if (!dateTime) return "-";
    const d = new Date(dateTime);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatMinutesToHours = (minutes) => {
    if (!minutes || minutes === 0) return "0 mins";

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    if (h > 0 && m > 0) return `${h} hrs ${m} mins`;
    if (h > 0) return `${h} hrs`;
    return `${m} mins`;
  };

  // -----------------------------------
  // FETCH & FORMAT ATTENDANCE RECORDS
  // -----------------------------------
  const loadRecords = async () => {
    if (!org?.organization_id) return;

    setLoading(true);
    try {
      const res = await fetchAttendanceRecord(org.organization_id);
      const a = res?.attendance_records || [];

      const formatted = a.map((item) => ({
        ...item,
        id: item?.employee_attendance_record_id,
        employee_code: item?.employee?.employee_code,
        name:
          `${item?.employee?.first_name || ""} ${item?.employee?.middle_name || ""} ${item?.employee?.last_name || ""}`.trim(),
        status_type: item?.status_type?.attendance_status_type_name || "Present",
       attendance_date: new Date(item.attendance_date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        ),
        check_in: formatTime(item?.clock_in_time),
        check_out: formatTime(item?.clock_out_time),
        workshift_total_break_minutes: formatMinutesToHours(item?.workshift_total_break_minutes),
        actual_total_break_minutes: formatMinutesToHours(item?.actual_total_break_minutes),
        workshift_total_work_minutes: formatMinutesToHours(item?.workshift_total_work_minutes),
        actual_total_work_minutes: formatMinutesToHours(item?.actual_total_work_minutes),
        overtime_minutes: formatMinutesToHours(item?.overtime_minutes),
        hasdeviation: item?.has_deviations === 1 ? "✔" : "✖",
        NoOfdeviation: item?.has_deviations,
      }));

      setRows(formatted);
    } catch (err) {
      console.error("Failed to load attendance records", err);
    }

    setLoading(false);
  };

  // -----------------------------------
  // DELETE ATTENDANCE RECORD
  // -----------------------------------
  const deleteRecord = async (id) => {
    try {
      const res = await axios.delete(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-employee-record/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Record deleted successfully");
      setRows((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete record");
    }
  };

  // -----------------------------------------------
  // LOAD DATAGRID CONFIGURATION
  // -----------------------------------------------
  useEffect(() => {
    const loadConfig = async () => {
      if (!org?.organization_id) return setLoadingConfig(false);

      try {
        const req = await fetch(`${MAIN_URL}/api/general-datagrids`);
        const res = await req.json();

        const dg = res.datagrids || [];
        const key = `Attendance Records_grid_${org.organization_id}`;
        const saved = dg.find((x) => x.datagrid_key === key);

        if (saved?.datagrid_default_configuration) {
          setTableConfig(saved.datagrid_default_configuration);

          if (saved.datagrid_default_configuration.columns?.length > 0) {
            setConfigColumns(saved.datagrid_default_configuration.columns);
          }
        }
      } catch (err) {
        console.error("Config load error:", err);
      }

      setLoadingConfig(false);
    };

    loadConfig();
  }, [org]);

  // -----------------------------------------------
  // Load records on mount
  // -----------------------------------------------
  useEffect(() => {
    if (org?.organization_id) loadRecords();
  }, [org]);

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Employees Attendance Records"}
        btnName={null}
        Data={rows}
        add_action={"ATTENDANCE_RECORD_ADD"}
        delete_action={"ATTENDANCE_RECORD_DELETE"}
        tableHeaders={[
          { name: "Employee Code", value_key: "employee_code" },
          { name: "Employee Name", value_key: "name" },
          { name: "Attendance Status", value_key: "status_type" },
          { name: "Attendance Date", value_key: "attendance_date" },
          { name: "Check In", value_key: "check_in" },
          { name: "Check Out", value_key: "check_out" },
          { name: "Workshift Break", value_key: "workshift_total_break_minutes" },
          { name: "Actual Break", value_key: "actual_total_break_minutes" },
          { name: "Total Workshift", value_key: "workshift_total_work_minutes" },
          { name: "Actual TotalWork", value_key: "actual_total_work_minutes" },
          { name: "OverTime", value_key: "overtime_minutes" },
          { name: "Has Deviation", value_key: "hasdeviation" },
          { name: "No. of Deviation", value_key: "NoOfdeviation" },
        ]}
        Icons={[
          <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <FormatAlignJustifyIcon color="primary" />,
          <CategoryIcon sx={{ color: "text.secondary" }} />,
          <DateRangeIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Employee Attendance Record",
          "Employee Attendance Record",
          "Add Employee Attendance Record",
          "Employee Attendance Record & related logs will be deleted permanently.",
        ]}
        Route={"/attendance/employee-records"}
        setData={setRows}
        DeleteFunc={deleteRecord}
      />

      <TableDataGeneric
        tableName="Attendance Records"
        primaryKey="employee_attendance_record_id"
        heading="Attendance Records"
        data={rows}
        sortname="attendance_date"
        showActions={false}
        Route="/attendance/employee-records"
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default AttendanceRecordList;









