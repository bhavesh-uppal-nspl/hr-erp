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
import { fetchInterns, fetchInternsss } from "../../../Apis/InternManagement";

const DEFAULT_COLUMNS = [
  {
    field: "Intern_Code",
    label: "Intern_Code",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "Name",
    label: "Name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "Department",
    label: "Department",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "Functional_Role",
    label: "Functional_Role",
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
    fetchInternsss(org.organization_id)
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Invalid data format:", data);
          setIntern([]);
          return;
        }
        // Filter out exited interns
        const activeInterns = data.filter(
          (item) => item.Internship_Status !== "Exited"
        );

        setIntern(activeInterns);
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

       if (response.status === 200) {
        toast.success(response.data.message);
           } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Intern";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }

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



     const handleShow = useCallback(
    (item) => {
      navigate(`/organization/intern/intern-details/view/${item.id}`)
    },
    [navigate],
  )


  return (
    <>
      <Layout4
        loading={loading}
        delete_action={"INTERN_DELETE"}
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
        DeleteFunc={handleDelete}
      />
      {fromDashboard ? (
        <TableDataGeneric
          tableName="Interns"
          primaryKey="id"
          heading="Interns"
          data={intern}
          sortname={"intern_name"}
          showActions={true}
          CardData={carddata}
          handleShow={handleShow}
          // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee`}
          Route="/organization/intern/intern-details"
          DeleteFunc={deleteIntern}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}
          configss={configColumns}
          {...(tableConfig && { config: tableConfig })}
        />
      ) : (
        <TableDataGeneric
          tableName="Interns"
          primaryKey="id"
          heading="Intern"
          data={intern}
          sortname={"Intern_name"}
          showActions={true}
          CardData={carddata}
          Route="/organization/intern/intern-details"
          DeleteFunc={deleteIntern}
          handleShow={handleShow}
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
