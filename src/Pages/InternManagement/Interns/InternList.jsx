"use client";

import { useCallback, useEffect, useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import CakeIcon from "@mui/icons-material/Cake";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import PeopleIcon from "@mui/icons-material/People";
import { MAIN_URL } from "../../../Configurations/Urls";
import Layout3 from "../../DataLayouts/Layout3";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Customisetable from "../../../Components/Table/Customisetable";
import { Avatar } from "@mui/material";
import CustomisetableReport from "../../../Components/Table/CustomisetableReport";
import { TableConfig } from "../../../Configurations/TableDataConfig";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { fetchInterns } from "../../../Apis/InternManagement";

const DEFAULT_COLUMNS = [
  {
    field: "intern_code",
    label: "intern_code",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "Intern_name",
    label: "Intern_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "date_of_birth",
    label: "date_of_birth",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "gender",
    label: "gender",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function InternList({ mode }) {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  console.log("org", org);

  const [intern, setIntern] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const location = useLocation();

  const { id } = useParams();

  const fromDashboard = location.state?.fromDashboard || false;

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
          const orgKey = `Interns_grid_${org.organization_id}`;
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
      fetchInterns(org?.organization_id)
        .then((data) => {
          const interns = data?.intership?.data || [];

          // ✅ Filter out interns where status is "Exited"
          const activeInterns = interns.filter(
            (item) => item.status?.internship_status_name !== "Exited"
          );

          // ✅ Map and transform the filtered data
          const formatted = activeInterns.map((item) => {
            const imageUrl = item.profile_image_url
              ? `${item.profile_image_url}`
              : "";
            const date_of_birth = item.date_of_birth
              ? new Date(item.date_of_birth).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "N/A";
            const date_of_joining = item.date_of_joining
              ? new Date(item.date_of_joining).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "N/A";

            return {
              ...item,
              id: item?.intern_id,
              Intern_name: [item.first_name, item.middle_name, item.last_name]
                .filter(Boolean)
                .join(" "),
              imageUrl,
              date_of_birth,
              date_of_joining,
            };
          });

          setIntern(formatted);
        })
        .catch((err) => console.error("Error fetching interns:", err))
        .finally(() => setLoading(false));
    }
  }, [org]);

  console.log("intern is ", intern);

  const deleteIntern = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/interns/${id}`,
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
    }
  };

  const navigate = useNavigate();
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/interns/${id}`,
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

      console.log("Successfully deleted intern with id:", id);
      return Promise.resolve();
    } catch (error) {
      console.error("Delete failed:", error);
      return Promise.reject(error);
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/intern/intern-details/edit/${item.id}`);
    },

    [navigate]
  );

  const carddata = [
    {
      key: "Employee_name",
      type: "String",
    },
    {
      key: "designation",
      type: "String",
    },
    {
      key: "profile_image_url",
      type: "photo",
    },
  ];

  return (
    <>
      <Layout4
        loading={loading}
        heading={
          <div style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
            Interns
          </div>
        }
        btnName={"Add Intern"}
        onAddBtClick={() => null}
        onEditBtClick={() => null}
        Data={intern}
        Icons={[
          {
            key: "exitToAppIcon",
            element: (
              <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />
            ),
          },
          {
            key: "viewHeadlineIcon",
            element: <ViewHeadlineIcon color="primary" />,
          },
          { key: "cakeIcon", element: <CakeIcon sx={{ color: "red" }} /> },
          {
            key: "peopleIcon",
            element: <PeopleIcon sx={{ color: "primary" }} />,
          },
        ]}
        messages={[
          "Intern details",
          "Intern details",
          "Add Intern",
          "Intern, Deleting This Employee will delete its Entire data from Employees Record of this Organization Permanently",
        ]}
        Route={"/organization/intern/intern-details"}
        setData={setIntern}
        DeleteFunc={deleteIntern}
      />
      {fromDashboard ? (
        <TableDataGeneric
          tableName="Interns"
          primaryKey="intern_id"
          heading="Interns"
          data={intern}
          sortname={"intern_name"}
          showActions={true}
          CardData={carddata}
          // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee`}
          Route="/organization/intern/intern-details"
          DeleteFunc={handleDelete}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}
          configss={configColumns}
          {...(tableConfig && { config: tableConfig })}
        />
      ) : (
        <TableDataGeneric
          tableName="Interns"
          primaryKey="intern_id"
          heading="Intern"
          data={intern}
          sortname={"Intern_name"}
          showActions={true}
          CardData={carddata}
          Route="/organization/intern/intern-details"
          DeleteFunc={handleDelete}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}
          configss={configColumns}
          {...(tableConfig && { config: tableConfig })}
        />
      )}
    </>
  );
}
export default InternList;
