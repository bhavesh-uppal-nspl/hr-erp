import React, { useCallback, useEffect, useState } from "react";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import Layout4 from "../../DataLayouts/Layout4";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import TableDataGeneric from "../../../Configurations/TableDataGeneric.js";
import { useNavigate } from "react-router-dom";
import { DateRangeIcon } from "@mui/x-date-pickers";
import { fetchInternDocumentTypes } from "../../../Apis/InternManagement.js";

const DEFAULT_COLUMNS = [
  {
    field: "document_type_name",
    label: "document_type_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "document_type_short_name",
    label: "document_type_short_name",
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

function InternDocumentTypeList() {
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
          const orgKey = `Document Types_grid_${org.organization_id}`;
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

      fetchInternDocumentTypes(org?.organization_id)
        .then((data) => {
          let a = data?.intership?.data;
          console.log("aaaa", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.intern_document_type_id,
              is_active: item?.is_active == 1 ? "✔" : "✖",
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
        `${MAIN_URL}/api/organizations/${org_id}/intern-document-types/${id}`,
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
        error.response?.data?.error || "Failed to delete Document Type Type"
      );
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/intern/document/types/edit/${item.id}`);
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Document Types"}
        btnName={"Add Types"}
        delete_action={"ATTENDANCE_DELETE"}
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
        Route={"/intern/document/types"}
        setData={setTypes}
        DeleteFunc={deleteStatus}
      />

      <TableDataGeneric
        tableName="Intern Document Types"
        primaryKey="intern_document_type_id "
        heading="Intern Document Types"
        data={types}
        sortname={"document_type_name"}
        showActions={true}
        Route="/intern/document/types"
        DeleteFunc={deleteStatus}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default InternDocumentTypeList;
