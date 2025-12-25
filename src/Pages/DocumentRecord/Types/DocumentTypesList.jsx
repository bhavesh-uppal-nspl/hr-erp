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

function DocumentTypesList() {
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

      fetchDocumentTypes(org?.organization_id)
        .then((data) => {
          let a = data?.documentType?.data;
          console.log("aaaa", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.employee_document_type_id,
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
        `${MAIN_URL}/api/organizations/${org_id}/employemnt-document-type/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
              toast.success(response.data.message);
              console.log("Document Type Deleted:", response.data.message);
            } else {
              const errorMessage =
                response.data.message ||
                response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
                "Failed to delete Type";
      
              toast.error(errorMessage);
              console.warn("Deletion error:", response.status, response.data);
            }
    } 
 catch (error) {
    // 🔹 Handle different error responses from backend
    if (error.response) {
      const status = error.response.status;
      const backendMessage = error.response.data?.message || error.response.data?.error;

      if (status === 400 && backendMessage?.includes("already assigned")) {
        // Custom message from Laravel when type is assigned
        toast.error("This document type is already assigned and cannot be deleted.");


      } else if (status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      } else {
        toast.error(backendMessage || "Failed to delete Document Type");
      }

      console.error("Delete failed:", error.response);
    } else {
      // Network or other unexpected errors
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred while deleting.");
    }
  }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/employee/document/types/edit/${item.id}`);
    },

    [navigate]
  );

  const handleShow = useCallback(
    (item) => {
      navigate(`/employee/document/types/view/${item.id}`)
    },
    [navigate],
  )

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Document Types"}
        add_action={"EMPLOYEE_DOCUMENT_TYPE_ADD"}
        btnName={"Add Types"}
        delete_action={"EMPLOYEE_DOCUMENT_TYPE_DELETE"}
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
        Route={"/employee/document/types"}
        setData={setTypes}
        DeleteFunc={deleteStatus}
      />

      <TableDataGeneric
        tableName="Document Types"
        primaryKey="employee_document_type_id"
        heading=" Document Types"
        data={types}
        sortname={"document_type_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-status-type`}
        Route="/employee/document/types"
        DeleteFunc={deleteStatus}
        EditFunc={handleEdit}
        edit_delete_action={["EMPLOYEE_DOCUMENT_TYPE_EDIT", "EMPLOYEE_DOCUMENT_TYPE_DELETE"]}
        handleShow={handleShow}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default DocumentTypesList;
