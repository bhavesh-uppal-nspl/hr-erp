import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {
  fetchEmployeeExit,
  fetchEmployeStages,
} from "../../../Apis/Employee-api";
import { Info } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";
import { fetchInternStages } from "../../../Apis/InternManagement";

const DEFAULT_COLUMNS = [
  {
    field: "employment_stage_name",
    label: "employment_stage_name",
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

  {
    field: "Employment_status",
    label: "Employment_status",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function EmploymentStagesList() {
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
      fetchEmployeStages(org?.organization_id)
        .then((data) => {
          let a = data?.stages?.data;
          console.log("data is   ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_employment_stage_id,

              Employment_status: item?.status?.employment_status_name || "",
            };
          });
          setexit(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

let deleteExit = async (id) => {
  try {
    const org_id = org.organization_id;

    const response = await axios.delete(
      `${MAIN_URL}/api/organizations/${org_id}/employment-stages/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // SUCCESS CASE (200)
    toast.success(response.data.message || "Stage deleted successfully");
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
        toast.error("This Stage is already assigned and cannot be deleted.");
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
        toast.error(data.error || "This Stage is linked to other records.");
        return;
      }

      // GENERAL ERROR
      toast.error(data.message || data.error || "Failed to delete Stage");
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
      navigate(`/employment/employee-stages/edit/${item.id}`);
    },
    [navigate]
  );

  const handleShow = useCallback(
    (item) => {
      navigate(`/employment/employee-stages/view/${item.id}`)
    },
    [navigate],
  )

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Employment Stages"}
        add_action={"EMPLOYEE_STAGE_ADD"}
        delete_action={"EMPLOYEE_STAGE_DELETE"}
        btnName={"Add Stages"}
        Data={exit}
        tableHeaders={[
          { name: "Code", value_key: "employee_code", width: "50px" },
          { name: "Name", value_key: "name", width: "150px" },

          {
            name: "NoticePeriod Starts",
            value_key: "notice_period_start",
            width: "170px",
          },

          {
            name: "NoticePeriod Ends",
            value_key: "notice_period_end",
            width: "170px",
          },
          {
            name: "Resignation Date",
            value_key: "resignation_date",
            width: "150px",
          },
          {
            name: "Relieving Date",
            value_key: "relieving_date",
            width: "150px",
          },
          {
            name: "Interview",
            value_key: "exit_interview_done",
            width: "50px",
          },
        ]}
        Icons={[
          <AutorenewIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <NextWeekIcon color="primary" />,
          <AlarmAddIcon sx={{ color: "text.secondary" }} />,
          <LogoutIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Intern exit details",
          "Intern exit details",
          "Add Intern Exit Details",
          "Intern Exit Deatils",
        ]}
        Route={"/employment/employee-stages"}
        setData={setexit}
        DeleteFunc={deleteExit}
      />

      <TableDataGeneric
        tableName="Employment Stages"
        primaryKey="organization_employment_stage_id"
        heading="Employment Stages"
        data={exit}
        sortname={"intern_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee-exit`}
        Route="/employement/employee-stages"
        DeleteFunc={deleteExit}
        EditFunc={handleEdit}
        handleShow={handleShow}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default EmploymentStagesList;
