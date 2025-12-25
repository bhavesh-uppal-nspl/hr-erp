import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchWorkShift, fetchWorkShiftDays } from "../../../Apis/Workshift-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import { format, parse } from "date-fns";

import axios from "axios";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

const DEFAULT_COLUMNS = [
  {
    field: "work_shift_name",
    label: "Work Shift",
    visible: true,
    width: 200,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: true,
  },
  {
    field: "working_days_display",
    label: "Working Days",
    visible: true,
    width: 200,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: true,
  },
  {
    field: "working_hours",
    label: "Working Hours",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: true,
  },
  {
    field: "remarks",
    label: "Remarks",
    visible: true,
    width: 200,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function WorkShiftDayList() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const { userData } = useAuthStore();
  const org = userData?.organization;
  console.log("org", org);

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
          const orgKey = `WorkshiftDays_grid_${org.organization_id}`;
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

  // load workShifts data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchWorkShiftDays(org.organization_id)
        .then((data) => {
          let a = data.workshiftDay?.data;
          console.log("Grouped workshift data:", a);
          
          // Map the grouped data
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_work_shift_id, // Use workshift ID as primary key
              work_shift_name: item.work_shift_name,
              working_days_display: item.working_days_display, // e.g., "5 (M,T,W,T,F)"
              working_hours: item.working_hours ? `${parseFloat(item.working_hours)} hrs per/day` : "-",
              remarks: item.remarks || "-",
              // Store the detailed days info for edit functionality
              days_detail: item.days_detail,
            };
          });
          
          setShifts(b);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching work shift days:", err);
          toast.error("Failed to load workshift days");
          setLoading(false);
        });
    }
  }, [org]);

  const handleDelete = async (id) => {
    try {
      // Delete all days for this workshift
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-days/${id}`,
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
      
      const result = await response.json();
      toast.success(result.message || "WorkShift days deleted successfully!");
      console.log("Successfully deleted workshift days for shift:", id);
      return Promise.resolve();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete WorkShift days");
      return Promise.reject(error);
    }
  };

  const navigate = useNavigate();
  const { id } = useParams();

  // Handle edit - navigate to edit form with workshift ID
  const handleEdit = useCallback(
    (item) => {
      // Pass the workshift ID to edit all its days
      navigate(`/organization/work-shift-days/edit/${item.id}`);
    },
    [navigate]
  );

      const handleShow = useCallback(
      (item) => {
        navigate(`/organization/work-shift-days/view/${item.id}`)
      },
      [navigate],
    )
  

  return (
    <>
      <Layout4
        loading={loading}
        heading={"WorkShift Days"}
        btnName={"Add Days"}
        add_action={"SHIFT_DAYS_ADD"}
        Data={shifts}
        delete_action={"SHIFT_DAYS_DELETE"}
        tableHeaders={[
          { name: "WorkShift Name", value_key: "work_shift_name" },
          { name: "Working Days", value_key: "working_days_display" },
          { name: "Working Hours", value_key: "working_hours" },
          { name: "Remarks", value_key: "remarks" },
        ]}
        Icons={[
          <FormatAlignJustifyIcon
            sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
          />,
          <FormatAlignJustifyIcon color="primary" />,
          <NextWeekIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={["WorkShift Days", "WorkShift Days", "Add WorkShift Days", "WorkShift Days"]}
        Route={"/organization/work-shift-days"}
        setData={setShifts}
        DeleteFunc={handleDelete}
      />

      <TableDataGeneric
        tableName="Workshift Days"
        primaryKey="organization_work_shift_id"
        heading="Workshift Days"
        data={shifts}
        sortname={"work_shift_name"}
        showActions={true}
        Route="/organization/work-shift-days"
        DeleteFunc={handleDelete}
        EditFunc={handleEdit}
        handleShow={handleShow}
        edit_delete_action={["SHIFT_DAYS_DELETE", "SHIFT_DAYS_EDIT"]}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default WorkShiftDayList;