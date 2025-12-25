import React, { useEffect, useState } from "react";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";
import { fetchProviderTypes } from "../../../Apis/Learning";
import { Description } from "@mui/icons-material";

const DEFAULT_COLUMNS = [
  {
    field: "provider_type_name",
    label: "provider_type_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "provider_type_short_name",
    label: "provider_type_short_name",
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
];

function LearningProviderTypeList() {
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

  // load employeeLeave data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchProviderTypes(org?.organization_id)
        .then((data) => {
          let a = data?.learning?.data;
          console.log("data is   ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_learning_provider_type_id,
              description:item?.description ? item?.description : "-",
              provider_type_short_name:item?.provider_type_short_name ? item?.provider_type_short_name : "-",

            };
          });
          setexit(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

let deleteProviderTpe = async (id) => {
  try {
    const org_id = org.organization_id;

    const response = await axios.delete(
      `${MAIN_URL}/api/organizations/${org_id}/learning-provider-type/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // SUCCESS CASE (200)
    toast.success(response.data.message || "Provider Type deleted successfully");
    console.log("Employment Stage deleted:", response.data.message);

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
        toast.error("This Provider Type is already assigned and cannot be deleted.");
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
      navigate(`/organization/learning-provider-type/edit/${item.id}`);
    },
    [navigate]
  );

  const handleShow = useCallback(
    (item) => {
      navigate(`/organization/learning-provider-type/view/${item.id}`)
    },
    [navigate],
  )

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Learning Provider Types"}
        delete_action={"LEARNING_PROVIDER_TYPE_DELETE"}
        btnName={"Add Types"}
        add_action={"LEARNING_PROVIDER_TYPE_ADD"}
        Data={exit}
        messages={[
          "Learning Provider Types",
          "Learning Provider Types",
          "Add Learning Provider Types",
          "Learning Provider Types",
        ]}
        Route={"/organization/learning-provider-type"}
        setData={setexit}
        DeleteFunc={deleteProviderTpe}
      />

      <TableDataGeneric
        tableName="Learning Provider Types"
        primaryKey="organization_learning_provider_type_id"
        heading="Learning Provider Types"
        data={exit}
        sortname={"provider_type_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee-exit`}
        Route="/organization/learning-provider-type"
        DeleteFunc={deleteProviderTpe}
        EditFunc={handleEdit}
        handleShow={handleShow}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default LearningProviderTypeList;
