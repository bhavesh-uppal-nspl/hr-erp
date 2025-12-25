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

const DEFAULT_COLUMNS = [
  {
    field: "intern_code",
    label: "intern_code",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "intern_name",
    label: "intern_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "attendance_date",
    label: "attendance_date",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "attendance_log_time",
    label: "attendance_log_time",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "attendance_log_type",
    label: "attendance_log_type",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function InternAttendanceTimelogsList() {
  const [leaves, setLeaves] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
   const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

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

  // Load table configuration from general-datagrids API
  useEffect(() => {
    const loadTableConfiguration = async () => {
      if (!org?.organization_id) {
        setLoadingConfig(false);
        return;
      }

      try {
        const configRes = await fetch(
          `${MAIN_URL}/api/general-datagrids`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (configRes.ok) {
          const configResponse = await configRes.json();
          const datagrids = configResponse.datagrids || [];
          const orgKey = `Intern Time Logs_grid_${org.organization_id}`;
          const savedConfig = datagrids.find(
            (dg) => dg.datagrid_key === orgKey
          );

          if (savedConfig) {
            const serverCfg = savedConfig.datagrid_default_configuration;
            setTableConfig(serverCfg);

            if (
              serverCfg?.columns &&
              Array.isArray(serverCfg.columns) &&
              serverCfg.columns?.length > 0
            ) {
              setConfigColumns(serverCfg.columns);
            } else {
              setConfigColumns(DEFAULT_COLUMNS);
            }
          } else {
            setConfigColumns(DEFAULT_COLUMNS);
          }
        }
      } catch (error) {
        console.error("Error loading table configuration:", error);
        setConfigColumns(DEFAULT_COLUMNS);
      } finally {
        setLoadingConfig(false);
      }
    };

    loadTableConfiguration();
  }, [org?.organization_id]);

  // load data
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

    const data = await response.json(); // ✅ Parse JSON manually

    if (response.ok) {
      toast.success(data.message || "Attendance log deleted successfully");
    
      setLeaves((prev) => prev.filter((item) => item.id !== id));

       window.location.reload();
      console.log("Successfully deleted time log with id:", id);
      return;
    }

    // ❌ If not ok, throw to go into catch()
    throw new Error(data.error || data.message || "Failed to delete record");

  } catch (error) {
    console.error("Delete failed:", error);
    toast.error(error.message || "An unexpected error occurred while deleting.");
  }
};


  const handleEdit = useCallback(
    (item) => {
      navigate(`/intern/attendance/time-logs/edit/${item.id}`);
    },

    [navigate]
  );


               const handleShow = useCallback(
    (item) => {
      navigate(`/intern/attendance/time-logs/view/${item.id}`)
    },
    [navigate],
  )


  return (
    <>
      <Layout4
        loading={loading}
        heading={"Intern Attendance Time Logs"}
        btnName={"Add Time Log"}
        Data={leaves}
        delete_action={"INTERN_TIME_LOG_DELETE"}
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
        DeleteFunc={handleDelete}
      />

      <TableDataGeneric
        tableName="Intern Time Logs"
        primaryKey="intern_attendance_timelog_id"
        heading="Intern Atendance Time Logs"
        data={leaves}
        sortname={"attendance_log_type"}
        showActions={true}
     
        Route="/intern/attendance/time-logs"
        DeleteFunc={handleDelete}
        handleShow={handleShow}
        token={localStorage.getItem("token")}
configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default InternAttendanceTimelogsList;

