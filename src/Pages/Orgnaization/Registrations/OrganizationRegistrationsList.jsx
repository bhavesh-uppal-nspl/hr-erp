import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NumbersIcon from "@mui/icons-material/Numbers";
import BusinessIcon from "@mui/icons-material/Business";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { fetchOrganizationRegistration } from "../../../Apis/Registration-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import HttpIcon from "@mui/icons-material/Http";
import toast from "react-hot-toast";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import dayjs from "dayjs";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

const DEFAULT_COLUMNS = [
  {
    field: "registration_applicable",
    label: "registration_applicable",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "registration_date",
    label: "registration_date",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "registration_number",
    label: "registration_number",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function OrganizationRegistrationsList() {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [registration, setRegistration] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const navigate = useNavigate();

  const { id } = useParams();

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dayjs(dateStr).format("DD-MM-YYYY");
  };

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
          const orgKey = `Registrations_grid_${org.organization_id}`;
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
      fetchOrganizationRegistration(org.organization_id)
        .then((data) => {
          let a = data.organizationbusinessregistration.data;
          const registrations = Array.isArray(a) ? a : [a];
          const b = registrations.filter(Boolean).map((item) => ({
            ...item,
            id: item.organization_business_registration_id,
            registration_date: `${formatDate(item.registration_date)}`,
            registration_expiry_date: `${formatDate(item.registration_expiry_date)}`,
            registration_applicable:
              item?.registration_applicable == 0 ? "✖" : "✔",
            registration_expiry_date_applicable:
              item?.registration_expiry_date_applicable == 0 ? "✖" : "✔",
            RegistrationType:
              item?.registration_type[0]?.business_registration_type_name ==
              null
                ? ""
                : item?.registration_type[0]?.business_registration_type_name,
          }));

          setRegistration(b);
        })
        .catch((err) => {
          console.error("Fetch error", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [org]);

  let deleteregistration = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/business-registration/${id}`,
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
        error.response?.data?.error || "Failed to delete Business Registration"
      );
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/registrations/edit/${item.id}`);
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Registrations"}
        btnName={"Add Registrations"}
        Data={registration}
        delete_action={"ORG_STRUCTURE_DELETE"}
        Icons={[
          <BusinessIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <NumbersIcon color="primary" />,
          <HttpIcon sx={{ color: "text.secondary" }} />,
        ]}
        tableHeaders={[
          {
            name: "Registration No.",
            value_key: "registration_number",
            textStyle: "capitalize",
          },
          { name: "Document Url", value_key: "registration_document_url" },
          { name: "Registration Date", value_key: "registration_date" },
          { name: "Expiry Date", value_key: "registration_expiry_date" },
        ]}
        messages={[
          "registrations",
          "organization registrations",
          "Add  Registrations",
          "registrations",
        ]}
        Route={"/organization/registrations"}
        setData={setRegistration}
        DeleteFunc={deleteregistration}
      />

      <TableDataGeneric
        tableName="Registrations"
        primaryKey="organization_business_registration_id"
        heading="Registrations"
        data={registration}
        sortname={"registration_number"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/business-registration`}
        Route="/organization/registrations"
        DeleteFunc={deleteregistration}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default OrganizationRegistrationsList;
