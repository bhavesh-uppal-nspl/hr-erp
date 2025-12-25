import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import { fetchApplicationUserRoles } from "../../../Apis/ApplicationManagementApis";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import toast from "react-hot-toast";
import DescriptionIcon from "@mui/icons-material/Description";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../Zustand/Store/useAuthStore";

const DEFAULT_COLUMNS = [
  {
    field: "name",
    label: "name",
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

function UserRoleList() {
  const [userroles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

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
          const orgKey = `User Roles_grid_${org.organization_id}`;
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
    {
      setLoading(true);
      fetchApplicationUserRoles()
        .then((data) => {
          let a = data.userroles;
          try {
            let b = a.map((item) => {
              return {
                id: item.application_user_role_id,
                name: item.user_role_name,
                description: item?.description == null ? "" : item?.description,
              };
            });
            setUserRoles(b);
          } catch (error) {
            if (error.response && error.response.status === 401) {
              toast.error("Session Expired!");
              window.location.href = "/login";
            }
            console.log(error);
          }
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, []);

  let deleteuserroles = async (id) => {
    try {
      const response = await axios.delete(
        `${MAIN_URL}/api/application/userrole/${id}`
      );

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Role";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete User Roles");
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/application/user-roles/edit/${item.id}`);
    },

    [navigate]
  );

  const handleShow = useCallback(
    (item) => {
      navigate(`/application/user-roles/view/${item.id}`);
    },
    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        delete_action={"USER_ROLE_DELETE"}
        heading={"User Roles"}
        btnName={"Add User Roles"}
        Data={userroles}
        Icons={[
          <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <AdminPanelSettingsIcon color="primary" />,
          <DescriptionIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          " User Roles",
          " User Roles",
          "Add  User Roles",
          " User Roles",
        ]}
        Route={"/application/user-roles"}
        setData={setUserRoles}
        DeleteFunc={deleteuserroles}
      />

      <TableDataGeneric
        tableName="User Roles"
        primaryKey="id"
        heading="User Roles"
        data={userroles}
        sortname={"user_role_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/userrole`}
        Route="/application/user-roles"
        DeleteFunc={deleteuserroles}
        EditFunc={handleEdit}
        edit_delete_action={["USER_ROLE_DELETE", "USER_ROLE_EDIT"]}
        token={localStorage.getItem("token")}
        configss={configColumns}
        handleShow={handleShow}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default UserRoleList;
