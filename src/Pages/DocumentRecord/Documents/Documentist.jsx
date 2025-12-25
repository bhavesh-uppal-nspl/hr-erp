import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1.jsx";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore.js";
import { fetchWorkShiftTypes } from "../../../Apis/Workshift-api.js";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls.js";
import { fetchUserTypes } from "../../../Apis/UserTypes.js";
import { Description } from "@mui/icons-material";
import Layout4 from "../../DataLayouts/Layout4.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import { DateRangeIcon } from "@mui/x-date-pickers";
import { fetchDocuments } from "../../../Apis/Documents.js";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import TableDataGeneric from "../../../Configurations/TableDataGeneric.js";

const DEFAULT_COLUMNS = [
  {
    field: "Employee_name",
    label: "Employee_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "emp_code",
    label: "emp_code",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "document_name",
    label: "document_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

export  default function Documentist() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const { userData } = useAuthStore();
  const org = userData?.organization;

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
          const orgKey = `Employee Documents_grid_${org.organization_id}`;
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
      fetchDocuments(org?.organization_id)
        .then((data) => {
          let a = data?.document?.data;
          console.log(a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.employee_document_id,
              Employee_name:
                `${item?.employee?.first_name || ""} ${item?.employee?.middle_name || ""} ${item?.employee?.last_name || ""}`.trim(),
              emp_code: item?.employee?.employee_code,
              document_type: item?.document_type?.document_type_name,
            };
          });
          setDocuments(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteStatus = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/employemnt-document/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
              toast.success(response.data.message);
              console.log("Employee Document deleted:", response.data.message);
            } else {
              const errorMessage =
                response.data.message ||
                response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
                "Failed to delete Document";
      
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
        error.response?.data?.error || "Failed to delete Attendance Status Type"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/employemnt-document/${id}`,
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
      navigate(`/employee/documents/edit/${item.id}`);
    },

    [navigate]
  );



     const handleShow = useCallback(
      (item) => {
        navigate(`/employee/documents/view/${item.id}`)
      },
      [navigate],
    )
  

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Employee Documents"}
        btnName={"Add Document"}
        add_action={"EMPLOYEE_DOCUMENT_ADD"}
        delete_action={"EMPLOYEE_DOCUMENT_DELETE"}
        Data={documents}
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
        Route={"/employee/documents"}
        setData={setDocuments}
        DeleteFunc={deleteStatus}
      />

      <TableDataGeneric
        tableName="Employee Documents"
        primaryKey="employee_document_id"
        heading="Employee Documents"
        data={documents}
        sortname={"document_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-status-type`}
        Route="/employee/documents"
        DeleteFunc={handleDelete}
        edit_delete_action={["EMPLOYEE_DOCUMENT_DELETE", "EMPLOYEE_DOCUMENT_DELETE"]}
        EditFunc={handleEdit}
        handleShow={handleShow}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}
