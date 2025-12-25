import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchEmployeeExit } from "../../../Apis/Employee-api";
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

const DEFAULT_COLUMNS = [
  {
    field: "employee_name",
    label: "Employee Name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "employee_code",
    label: "Employee Code",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "resignation_date",
    label: "Resignation Date",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "last_working_date",
    label: "Last Working Date",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function EmployeeExitList() {
  const [exit, setexit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const { userData } = useAuthStore();
  const org = userData?.organization;

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  
  const date = new Date(dateStr);
  if (isNaN(date)) return ""; // avoid invalid date errors

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};


  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  };

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
          const orgKey = `Employee Exit_grid_${org.organization_id}`;
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

  // load EmpoyeeExit data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchEmployeeExit(org.organization_id)
        .then((data) => {
          let a = data.employeexit.data;
          console.log("data is   ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.employee_exit_id,

              employee_name:
                `${capitalize(item.employee.first_name)} ${capitalize(item.employee.middle_name || "")} ${capitalize(item.employee.last_name || "")}
             `.trim(),
            
              // info: formatDate(item.last_working_date),
              resignation_date: `${formatDate(item.resignation_date)}`,

              relieving_date: `${formatDate(item.relieving_date)}`,
              notice_period_start: `${formatDate(item.notice_period_start)}`,
              notice_period_end: `${formatDate(item.notice_period_end)}`,
              last_working_date: `${formatDate(item.last_working_date)}`,
              exit_interview_done:
                item.exit_interview_done == true ? "✔" : "✖",
              employee_code: item.employee.employee_code || "N/A",
              exit_reason: item?.exit_reason == null ? " " : item?.exit_reason,
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
        `${MAIN_URL}/api/organizations/${org_id}/employee-exit/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
       if (response.status === 200) {
        toast.success(response.data.message);
        console.log("Exit Employee  deleted:", response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Exit Employee";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Employee Exit Details"
      );
    }
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/employee/employee-exits/edit/${item.id}`);
    },
    [navigate]
  );

  const handleShow = useCallback(
    (item) => {
      navigate(`/organization/employee/employee-exits/view/${item.id}`)
    },
    [navigate],
  )

  return (
    <>
      <Layout4
        loading={loading}
        add_action={"EMPLOYEE_EXIT_ADD"}
        heading={"Employee Exit"}
        btnName={"Add Employee Exit"}
        delete_action={"EMPLOYEE_EXIT_DELETE"}
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
          "Employee exit details",
          "Employee exit details",
          "Add Employee Exit Details",
          "Employee Exit Deatils",
        ]}
        Route={"/organization/employee/employee-exits"}
        setData={setexit}
        DeleteFunc={deleteExit}
      />

      <TableDataGeneric
        tableName="Employee Exit"
        primaryKey="employee_exit_id"
        heading="Employee Exit"
        data={exit}
        sortname={"employee_name"}
        showActions={true}
        edit_delete_action={["EMPLOYEE_EXIT_EDIT", "EMPLOYEE_EXIT_DELETE"]}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee-exit`}
        Route="/organization/employee/employee-exits"
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

export default EmployeeExitList;

