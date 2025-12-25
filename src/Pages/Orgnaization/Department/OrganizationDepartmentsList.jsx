"use client";

import React, { useCallback, useEffect, useState } from "react";
import Layout4 from "../../DataLayouts/Layout4";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import { fetchOrganizationDepartment } from "../../../Apis/Department-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import usePermissionDataStore from "../../../Zustand/Store/usePermissionDataStore";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";

const DEFAULT_COLUMNS = [
  {
    field: "department_name",
    label: "department_name",
    visible: true,
    width: 180,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "department_mail_id",
    label: "department_mail_id",
    visible: true,
    width: 220,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "department_short_name",
    label: "department_short_name",
    visible: true,
    width: 120,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "department_employees_count",
    label: "department_employees_count",
    visible: true,
    width: 120,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "description",
    label: "description",
    visible: true,
    width: 250,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  
];

function OrganizationDepartmentsList() {
  const { userData } = useAuthStore();
  const { Permission, setPermission } = usePermissionDataStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  // Load departments data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationDepartment(org.organization_id)
        .then((data) => {
          let a = data?.Departments || [];
          let b = a.map((item) => ({
            ...item,
            id: item.organization_department_id,
            department_name: item.department_name || "",
            department_mail_id: item.department_mail_id || "",
            department_short_name: item.department_short_name || "",
            description: item.description || "",
            department_employees_count: item.department_employees_count || 0,
          }));
          setDepartments(b);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [org]);

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
          const orgKey = `Departments_grid_${org.organization_id}`;
          const savedConfig = datagrids.find((dg) => dg.datagrid_key === orgKey);

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

  const deletedepartment = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/department/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.error || response.data?.errors) {
        toast.error(response.data.message || "Failed to delete department.");
        return;
      }
      if (response.status === 200) {
        toast.success(response.data.message || "Department deleted successfully.");
        setDepartments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(
          error.response.data.message || "This department is in use and cannot be deleted."
        );
      } else if (error.response?.status === 422) {
        toast.error("Validation failed.");
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized.");
      } else {
        toast.error("Failed to delete department. Please try again later.");
      }
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/departments/edit/${item.id}`);
    },
    [navigate]
  );


       const handleShow = useCallback(
    (item) => {
      navigate(`/organization/departments/view/${item.id}`)
    },
    [navigate],
  )

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Departments"}
        btnName={"Add Departments"}
        Data={departments}
        add_action={"DEPARTMENT_ADD"}
        delete_action={"DEPARTMENT_DELETE"}
        Icons={[
          <StoreIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <StoreIcon color="primary" />,
          <PersonIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "departments",
          "organisation departments",
          "Add Departments",
          "department, Deleting this department will also remove all related designations and employees",
        ]}
        Route={"/organization/departments"}
        setData={setDepartments}
        DeleteFunc={deletedepartment}
      />

      {!loadingConfig && (
        <TableDataGeneric
          tableName="Departments"
          primaryKey="organization_department_id"
          heading="Departments"
          data={departments}
          sortname={"department_name"}
          showActions={true}
          Route="/organization/departments"
          DeleteFunc={deletedepartment}
          EditFunc={handleEdit}
          handleShow={handleShow}
          edit_delete_action={["DEPARTMENT_DELETE", "DEPARTMENT_EDIT"]}
          token={localStorage.getItem("token")}
          configss={configColumns}
          {...(tableConfig && { config: tableConfig })}
        />
      )}
    </>
  );
}

export default OrganizationDepartmentsList;
