import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {
  fetchEmployeeExit,
  fetchEmployeRecord,
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

const DEFAULT_COLUMNS = [
  {
    field: "employee_name",
    label: "employee_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "designation",
    label: "designation",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "department",
    label: "department",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "increment_type",
    label: "increment_type",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function EmployeeRecordList() {
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
          const orgKey = `Employee Records_grid_${org.organization_id}`;
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

  // load employeeRecord data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);

      fetchEmployeRecord(org?.organization_id)
        .then((data) => {
          let a = data?.records || [];
          console.log("Fetched Records:", a);

          let b = a.map((item) => ({
            ...item,

            // ✔ Correct ID
            id: item?.employee_employment_record_id,
            employee_name: item?.employee
              ? `${capitalize(item.employee.first_name)} ${capitalize(item.employee.middle_name || "")} ${capitalize(item.employee.last_name || "")}`.trim()
              : `Employee #${item.employee_id}`,
            increment_type: item?.employee_increment?.increment_type?.employee_increment_type_name || "",
            start_date: item?.start_date ? formatDate(item.start_date) : "",
            end_date: item?.end_date ? formatDate(item.end_date) : "",

            change_reason: item?.change_reason || "N/A",
            remarks: item?.remarks || "",

            designation: item?.designation?.designation_name || "N/A",
            department: item?.department?.department_name || "N/A",

            // ✔ Increment details
            increment_type:
              item?.employee_increment?.increment_type
                ?.employee_increment_type_name || "",
          }));

          console.log("Mapped Records:", b);
          setexit(b);
        })
        .catch((err) => {
          console.log("Error fetching records:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [org]);

  console.log("exits", exit);

  let deleteExit = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/employee-records/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        console.log("Employee Record deleted:", response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Employee Record";

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
      navigate(`/organization/employee/records/edit/${item.id}`);
    },
    [navigate]
  );

   const handleShow = useCallback(
    (item) => {
      navigate(`/organization/employee/records/view/${item.id}`)
    },
    [navigate],
  )

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Employement Records"}
        btnName={"Add Records"}
        add_action={"EMPLOYEE_RECORD_ADD"}
        delete_action={"EMPLOYEE_RECORD_DELETE"}
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
        Route={"/organization/employee/records"}
        setData={setexit}
        DeleteFunc={deleteExit}
      />

      <TableDataGeneric
        tableName="Employee Records"
        primaryKey="employee_employment_record_id  "
        heading="Employee Record"
        data={exit}
        sortname={"change_reason"}
        showActions={true}
        edit_delete_action={["EMPLOYEE_RECORD_EDIT", "EMPLOYEE_RECORD_DELETE"]}
        Route="/organization/employee/records"
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

export default EmployeeRecordList;