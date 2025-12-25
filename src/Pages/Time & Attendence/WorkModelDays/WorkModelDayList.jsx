import React, { useCallback, useEffect, useState } from "react";
import Layout4 from "../../DataLayouts/Layout4";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import axios from "axios";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate } from "react-router-dom";

const DEFAULT_COLUMNS = [
  {
    field: "work_model_name",
    label: "Work Model Name",
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
    width: 180,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  
  {
    field: "remarks",
    label: "Remarks",
    visible: true,
    width: 250,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function WorkModelDayList() {
  const [workModelDays, setWorkModelDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const { userData } = useAuthStore();
  const org = userData?.organization;
  const navigate = useNavigate();

  console.log("org", org);

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
          const orgKey = `WorkModelDays_grid_${org.organization_id}`;
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

  // Load work model days data
  useEffect(() => {
    const fetchWorkModelDays = async () => {
      if (!org?.organization_id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org.organization_id}/workmodel-days`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("API Response:", response.data);

        const data = response.data.workshiftDay?.data || [];
        
        // Map the data according to backend response structure
        const formattedData = data.map((item) => ({
          id: item.organization_work_model_id, // Used for edit/delete operations
          organization_work_model_id: item.organization_work_model_id,
          work_model_name: item.work_model_name || "N/A",
          working_days_display: item.working_days_display || "0 ()",
          working_days_count: item.working_days_count || 0,
          working_days_abbreviations: item.working_days_abbreviations || "",
          remarks: item.remarks || "-",
          days_detail: item.days_detail || [],
        }));

        console.log("Formatted Data:", formattedData);
        setWorkModelDays(formattedData);
      } catch (err) {
        console.error("Error fetching work model days:", err);
        
        if (err.response?.status === 401) {
          toast.error("Session Expired!");
          window.location.href = "/login";
        } else {
          toast.error(
            err.response?.data?.error || "Failed to fetch work model days"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkModelDays();
  }, [org?.organization_id]);

  // Delete function
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/workmodel-days/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          response.data.message || "Work model days deleted successfully"
        );
        
        // Refresh the list after deletion
        setWorkModelDays((prev) => 
          prev.filter((item) => item.organization_work_model_id !== id)
        );
        
        return Promise.resolve();
      }
    } catch (error) {
      console.error("Delete failed:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      } else if (error.response?.status === 409) {
        toast.error(
          error.response.data.error ||
            "Cannot delete - linked with other records"
        );
      } else {
        toast.error(
          error.response?.data?.error || "Failed to delete work model days"
        );
      }
      
      return Promise.reject(error);
    }
  };

  // Edit function
  const handleEdit = useCallback(
    (item) => {
      navigate(
        `/organization/work-model-days/edit/${item.organization_work_model_id}`
      );
    },
    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Work Model Days"}
        btnName={"Add Work Model Days"}
        Data={workModelDays}
        add_action={"SHIFT_MODEL_DAYS_ADD"}
        delete_action={"SHIFT_MODEL_DAYS_DELETE"}
        tableHeaders={[
          { name: "Work Model Name", value_key: "work_model_name" },
          { name: "Working Days", value_key: "working_days_display" },
          { name: "Days Count", value_key: "working_days_count" },
          { name: "Remarks", value_key: "remarks" },
        ]}
        Icons={[
          <FormatAlignJustifyIcon
            sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
          />,
          <FormatAlignJustifyIcon color="primary" />,
          <NextWeekIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Work Model Days",
          "Work Model Days",
          "Add Work Model Days",
          "Work Model Days",
        ]}
        Route={"/organization/work-model-days"}
        setData={setWorkModelDays}
        DeleteFunc={handleDelete}
      />

      <TableDataGeneric
        tableName="Work Model Days"
        primaryKey="organization_work_model_id"
        heading="Work Model Days"
        data={workModelDays}
        sortname={"work_model_name"}
        showActions={true}
        Route="/organization/work-model-days"
        DeleteFunc={handleDelete}
        EditFunc={handleEdit}
        edit_delete_action={["SHIFT_MODEL_DAYS_DELETE", "SHIFT_MODEL_DAYS_EDIT"]}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default WorkModelDayList;