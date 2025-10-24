import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { fetchOrganizationEmploymentTypes } from "../../../Apis/Organization-Employement-types";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import BusinessIcon from "@mui/icons-material/Business";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchDocumentTypes } from "../../../Apis/Documents";
import Layout4 from "../../DataLayouts/Layout4";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import TableDataGeneric from "../../../Configurations/TableDataGeneric.js";
import { useNavigate } from "react-router-dom";
import { DateRangeIcon } from "@mui/x-date-pickers";
import { fetchIntershipStatus } from "../../../Apis/InternManagement.js";

const DEFAULT_COLUMNS = [
  {
    field: "internship_status_name",
    label: "",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

];

function IntershipStatusList() {
  const [types, setTypes] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const navigate = useNavigate();

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
          const orgKey = `Internship Status_grid_${org.organization_id}`;
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

      fetchIntershipStatus(org?.organization_id)
        .then((data) => {
          let a = data?.intership?.data;
          console.log("aaaa", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.organization_internship_status_id,
            };
          });
          setTypes(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteStatus = async (id) => {
    try {
      console.log("is is ", id);
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/internship-status/${id}`,
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

  const handleEdit = useCallback(
    (item) => {
      navigate(`/intern/internship/status/edit/${item.id}`);
    },
    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Internship Status"}
        btnName={"Add Status"}
        delete_action={""}
        Data={types}
        tableHeaders={[
          {
            name: "Document Name",
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
        Route={"/intern/internship/status"}
        setData={setTypes}
        DeleteFunc={deleteStatus}
      />

      <TableDataGeneric
        tableName="Internship Status"
        primaryKey="organization_internship_status_id"
        heading="Intership Status"
        data={types}
        sortname={"internship_status_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-status-type`}
        Route="/intern/internship/status"
        DeleteFunc={deleteStatus}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default IntershipStatusList;
