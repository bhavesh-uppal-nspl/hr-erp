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
import {
  fetchAttendanceSource,
  fetchAttendanceStatus,
} from "../../../Apis/Attendance";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";

const DEFAULT_COLUMNS = [
  {
    field: "attendance_source_name",
    label: "attendance_source_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "description",
    label: "description",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "is_active",
    label: "is_active",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function AttendenceSourceList() {
  const [source, setSource] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const navigate = useNavigate();

  const { id } = useParams();

  // Load table configuration from general-datagrids API
  useEffect(() => {
    const loadTableConfiguration = async () => {
      if (!org?.organization_id) {
        setLoadingConfig(false);
        return;
      }

      try {
        const configRes = await fetch(`${MAIN_URL}/api/general-datagrids`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (configRes.ok) {
          const configResponse = await configRes.json();
          const datagrids = configResponse.datagrids || [];
          const orgKey = `Organization Functional Roles_grid_${org.organization_id}`;
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
      setLoading(true);
      fetchAttendanceSource(org?.organization_id)
        .then((data) => {
          let a = data?.attendance_source;
          console.log("a of entile is ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.organization_attendance_source_id,

              is_active: item?.is_active == 1 ? "✔" : "✖",
            };
          });
          setSource(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteSource = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/attendance-source/${id}`,
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
          "Failed to delete Source";

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
        error.response?.data?.error || "Failed to delete Attendance Source"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-source/${id}`,
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
      navigate(`/attendance/source/edit/${item.id}`);
    },

    [navigate]
  );


         const handleShow = useCallback(
    (item) => {
      navigate(`/attendance/source/view/${item.id}`)
    },
    [navigate],
  )

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Attendance Source"}
        btnName={"Add Source"}
        delete_action={"ATTENDANCE_SOURCE_DELETE"}
        add_action={"ATTENDANCE_SOURCE_ADD"}
        Data={source}
        tableHeaders={[
          {
            name: "Source Name",
            value_key: "attendance_source_name",
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
          "Attendance Source",
          "Attendance Source",
          "Add Attendance Source",
          "Attendance Source",
        ]}
        Route={"/attendance/source"}
        setData={setSource}
        DeleteFunc={deleteSource}
      />

      <TableDataGeneric
        tableName="Attendance Source"
        primaryKey="organization_attendance_source_id"
        heading="Atendance Sources"
        data={source}
        sortname={"attendance_source_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-sources`}
        Route="/attendance/source"
        DeleteFunc={handleDelete}
        EditFunc={handleEdit}
        handleShow={handleShow}
        edit_delete_action={["ATTENDANCE_SOURCE_DELETE", "ATTENDANCE_SOURCE_EDIT"]}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default AttendenceSourceList;
