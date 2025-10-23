"use client";

import React, { useCallback, useEffect, useState } from "react";
import Layout4 from "../../DataLayouts/Layout4";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchOrganizationDesignationss } from "../../../Apis/Designation-api";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import usePermissionDataStore from "../../../Zustand/Store/usePermissionDataStore";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";

const DEFAULT_COLUMNS = [
  {
    field: "designation_name",
    label: "Designation",
    visible: true,
    width: 180,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "designation_short_name",
    label: "Designation Short Name",
    visible: true,
    width: 160,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "departmentName",
    label: "Department Name",
    visible: true,
    width: 200,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function OrganizationDesignationsList() {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const { userData } = useAuthStore();
  const { Permission, setPermission } = usePermissionDataStore();
  const org = userData?.organization;

  const navigate = useNavigate();
  const { id } = useParams();

  // Load designations data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      // Call without mode parameter (default mode)
      fetchOrganizationDesignationss(org?.organization_id)
        .then((data) => {
          // Handle the response based on the structure
          let rawData = [];
          
          // Check if data has organizationdesignation property (mode = null/default)
          if (data?.organizationdesignation && Array.isArray(data.organizationdesignation)) {
            rawData = data.organizationdesignation;
          } 
          // Check if data is directly an array (mode = 1)
          else if (Array.isArray(data)) {
            rawData = data;
          }

          // Map the data to required format
          const mappedData = rawData.map((item) => {
            // Extract department name properly
            let deptName = "";
            if (typeof item.department === 'object' && item.department !== null) {
              deptName = item.department.department_name || "";
            } else if (typeof item.department === 'string') {
              deptName = item.department;
            }

            return {
              organization_designation_id: item.organization_designation_id,
              designation_name: item.designation_name || "",
              designation_short_name: item.designation_short_name || "",
              id: item.organization_designation_id,
              cardname: deptName.toUpperCase(),
              departmentName: deptName,
              carddescription: item.designation_name || "",
              // Keep all other properties
              ...item,
            };
          });

          setDesignations(mappedData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching designations:", error);
          setLoading(false);
        });
    }
  }, [org]);

  // Load table configuration dynamically for designation grid
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
          const orgKey = `Designations_grid_${org.organization_id}`;
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

  const deletedesignation = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/designation/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        setDesignations((prev) => prev.filter((d) => d.id !== id));
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Designation";

        toast.error(errorMessage);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/units/edit/${item.id}`);
    },
    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Designations"}
        btnName={"Add Designation"}
        Data={designations}
        delete_action={"ORG_STRUCTURE_DELETE"}
        Icons={[
          <LocalPoliceIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <NextWeekIcon color="primary" />,
          <LocalPoliceIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "department's designation",
          "department designations",
          "Add Department's designations",
          "department designation, Deleting this designation will also remove all related employees",
        ]}
        Route={"/organization/designation"}
        setData={setDesignations}
        DeleteFunc={deletedesignation}
      />

      {!loadingConfig && org && designations?.length > 0 && (
        <TableDataGeneric
          tableName="Designations"
          primaryKey="organization_designation_id"
          heading="Designations"
          data={designations}
          sortname={"designation_name"}
          showActions={true}
          Route="/organization/designation"
          DeleteFunc={deletedesignation}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}
          configss={configColumns}
          {...(tableConfig && { config: tableConfig })}
        />
      )}
    </>
  );
}

export default OrganizationDesignationsList;