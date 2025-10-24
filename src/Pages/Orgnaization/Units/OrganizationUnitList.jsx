import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import { fetchOrganizationUnit } from "../../../Apis/OrganizationUnit";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";

const DEFAULT_COLUMNS = [
  {
    field: "unit_name",
    label: "unit_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "unit_short_name",
    label: "unit_short_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "unit_type",
    label: "unit_type",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function OrganizationUnitList() {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const navigate = useNavigate();

  const { id } = useParams();

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
          const orgKey = `Organization Units_grid_${org.organization_id}`;
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
      fetchOrganizationUnit(org?.organization_id)
        .then((data) => {
          let a = data?.Unit?.data;
          console.log("a is s", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.organization_unit_id,

              unit_type: item.unit_types?.[0]?.unit_type_name,
            };
          });
          setUnits(b);
        })
        .catch((err) => {
          console.error("Failed to fetch organization units", err);
        })
        .finally(() => setLoading(false));
    }
  }, [org]);

  let deleteunits = async (id) => {
    try {
      console.log("id", id);
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/units/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("nnnzsdc", response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete units");
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
        heading={"Organization Units"}
        btnName={"Add Organization Units"}
        Data={units}
        delete_action={"ORG_STRUCTURE_DELETE"}
        tableHeaders={[
          {
            name: "Unit Name",
            value_key: "unit_name",
            textStyle: "capitalize",
          },
          {
            name: "Unit Short Name",
            value_key: "unit_short_name",
            textStyle: "capitalize",
          },
          {
            name: "Unit Type",
            value_key: "organization_unit_type_id",
            textStyle: "capitalize",
          },
        ]}
        Icons={[
          <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <ViewHeadlineIcon color="primary" />,
          <ExitToAppIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Organization Units",
          "Organization Units",
          "Add Organization Units",
          "Organization Units",
        ]}
        Route={"/organization/units"}
        setData={setUnits}
        DeleteFunc={deleteunits}
      />

      <TableDataGeneric
        tableName="Organization Units"
        primaryKey="organization_unit_id"
        heading="Organization Units"
        data={units}
        sortname={"location_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/units`}
        Route="/organization/units"
        DeleteFunc={deleteunits}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default OrganizationUnitList;
