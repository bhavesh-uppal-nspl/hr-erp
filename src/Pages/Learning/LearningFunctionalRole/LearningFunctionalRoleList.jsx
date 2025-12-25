import React, { useEffect, useState } from "react";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";
import { fetchProviders, fetchProviderTypes, fetchResourceFunctionalRole } from "../../../Apis/Learning";
import { Description } from "@mui/icons-material";

const DEFAULT_COLUMNS = [
  {
    field: "functional_role",
    label: "functional_role",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "specialization",
    label: "specialization",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
    {
    field: "resources_list",
    label: "resources",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

];

function LearningFunctionalRoleList() {
  const [exit, setexit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const { userData } = useAuthStore();
  const org = userData?.organization;

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
          const orgKey = `Employment Stages_grid_${org.organization_id}`;
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

useEffect(() => {
  if (!org?.organization_id) return;

  setLoading(true);

  fetchResourceFunctionalRole(org.organization_id)
    .then((data) => {
      const rows = data?.learning || [];

      let grouped = {};

      rows.forEach((item) => {
        const key = `${item.functional_role?.functional_role_name}-${item.specialization?.functional_role_specialization_name}`;

        if (!grouped[key]) {
          grouped[key] = {
            id: item.organization_learning_resource_functional_role_id,
            functional_role: item.functional_role?.functional_role_name || "",
            specialization: item.specialization?.functional_role_specialization_name || "",
            resources: [],
            resources_list: ""
          };
        }

        if (item.resources) {
          grouped[key].resources.push(item.resources.resource_title);
        }
      });

      const finalData = Object.values(grouped).map((item) => ({
        ...item,
        resources_list: item.resources.join(", ")
      }));

      setexit(finalData);
    })
    .catch(() => {})
    .finally(() => setLoading(false));
}, [org]);



let deleteProviderTpe = async (id) => {
  try {
    const org_id = org.organization_id;

    const response = await axios.delete(
      `${MAIN_URL}/api/organizations/${org_id}/learning-func-role/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // SUCCESS CASE (200)
    toast.success(response.data.message || "Provider deleted successfully");

  } catch (error) {
    console.error("Delete failed:", error);

    // -------------------------
    // 🔥 HANDLE ALL ERROR CASES
    // -------------------------
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // SESSION EXPIRED
      if (status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
        return;
      }

      // CUSTOM BACKEND MESSAGE: Already Assigned (400)
      if (status === 400 && data.message?.includes("already assigned")) {
        toast.error("This Provider is already assigned and cannot be deleted.");
        return;
      }

      // VALIDATION ERROR (422)
      if (status === 422) {
        let firstError =
          data.errors?.[Object.keys(data.errors)[0]]?.[0] ||
          "Validation failed.";
        toast.error(firstError);
        return;
      }

      // FOREIGN KEY CONSTRAINT (409)
      if (status === 409) {
        toast.error(data.error || "This Provider Type is linked to other records.");
        return;
      }

      // GENERAL ERROR
      toast.error(data.message || data.error || "Failed to delete Provider Type");
      return;
    }

    // NETWORK ERROR
    toast.error("Network error! Please try again.");
  }
};

  const navigate = useNavigate();
  const { id } = useParams();
  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/learning-functional-role/edit/${item.id}`);
    },
    [navigate]
  );

  const handleShow = useCallback(
    (item) => {
      navigate(`/organization/learning-functional-role/view/${item.id}`)
    },
    [navigate],
  )

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Learning Functional Role"}
        btnName={"Add Role"}
        add_action={"LEARNING_FUNCTIONAL_ROLE_ADD"}
        delete_action={"LEARNING_FUNCTIONAL_ROLE_DELETE"}
        Data={exit}
        messages={[
          "Learning Functional Role",
          "Learning Functional Role",
          "Add Learning Functional Role",
          "Learning Functional Role",
        ]}
        Route={"/organization/learning-functional-role"}
        setData={setexit}
        DeleteFunc={deleteProviderTpe}
      />

      <TableDataGeneric
        tableName="Learning Functional Role"
        primaryKey="organization_learning_resource_functional_role_id"
        heading="Learning Functional Role"
        data={exit}
        sortname={"importance_level"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee-exit`}
        Route="/organization/learning-functional-role"
        DeleteFunc={deleteProviderTpe}
        EditFunc={handleEdit}
        handleShow={handleShow}
        edit_delete_action={["LEARNING_FUNCTIONAL_ROLE_DELETE", "LEARNING_FUNCTIONAL_ROLE_EDIT"]}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default LearningFunctionalRoleList;
