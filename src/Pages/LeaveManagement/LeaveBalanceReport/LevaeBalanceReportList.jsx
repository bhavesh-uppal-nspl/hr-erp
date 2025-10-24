import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { fetchEmployeeLeaveBalanceReport } from "../../../Apis/Employee-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

const DEFAULT_COLUMNS = [
  {
    field: "Employee_name",
    label: "Employee_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  // {
  //   field: "employee_code",
  //   label: "employee_code",
  //   visible: true,
  //   width: 150,
  //   filterable: true,
  //   sortable: true,
  //   pinned: "none",
  //   required: false,
  // },

  {
    field: "leave_type_name",
    label: "leave_type_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "adjusted_days",
    label: "adjusted_days",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function LevaeBalanceReportList() {
  const [leaves, setLeaves] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
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
          const orgKey = `Leave Balance Report_grid_${org.organization_id}`;
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
      fetchEmployeeLeaveBalanceReport(org?.organization_id)
        .then((data) => {
          let a = data?.data || [];
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.employee_leave_balance_id || "",
              employee_code: item?.employee?.employee_code,
              Employee_name: item?.employee
                ? `${item.employee.first_name ?? ''} ${item.employee.last_name ?? ''}`
                : "",
              leave_type_name: item?.leave_type?.leave_type_name || "",

              entitled_days: item?.entitled_days || "",
              leave_period_end_date: item?.leave_period_end_date || "",
              leave_period_start_date: item?.leave_period_start_date || "",
              leave_taken_days: item?.leave_taken_days || "",
              leave_taken_days: item?.leave_taken_days || "",
              balance_days: item?.balance_days || "",
              adjusted_days: item?.adjusted_days || "",
            };
          });
          setLeaves(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteemployeeleave = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/employee-entitlements/${id}`,
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
        error.response?.data?.error ||
          "Failed to delete Employee Leave Entitlement"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/leave-balances/taken/${id}`,
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
      console.log("Successfully deleted units-types with id:", id);
      return Promise.resolve();
    } catch (error) {
      console.error("Delete failed:", error);
      return Promise.reject(error);
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/employee/employee-exits/edit/${item.id}`);
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Employee Leave Balance Report"}
        btnName={" Report"}
        Data={leaves}
        tableHeaders={[
          {
            name: "Employee Name",
            value_key: "fullname",
            textStyle: "capitalize",
          },
          { name: "Leave Type", value_key: "leave_type_name" },
          { name: "Leave Start Date", value_key: "leave_period_start_date" },
          { name: "Leave End Date", value_key: "leave_period_end_date" },
          { name: "Leave Taken Days", value_key: "leave_taken_days" },
          { name: "Balance Days", value_key: "balance_days" },
          {
            name: "Entitle days",
            value_key: "entitled_days",
            textStyle: "capitalize",
          },
          { name: "Carry Forward Days", value_key: "carry_forward_days" },
          { name: "Adjusted Days", value_key: "adjusted_days" },
        ]}
        Icons={[
          <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <FormatAlignJustifyIcon color="primary" />,
          <CategoryIcon sx={{ color: "text.secondary" }} />,
          <DateRangeIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Employee Leave Balance Report",
          "Employee Leave Balance Report",
          "Add Employee Balance Report",
          "Employee Leaves Balance Report",
        ]}
        Route={"employee-leave-balance-report"}
        setData={setLeaves}
        DeleteFunc={deleteemployeeleave}
      />

      <TableDataGeneric
        tableName="Leave Balance Report"
        primaryKey="employee_leave_balance_id"
        heading="Employee Leave Balance Report"
        data={leaves}
        sortname={"employee_name"}
        y
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/leave-balances/taken`}
        Route="/employee-leave-balance-report"
        DeleteFunc={handleDelete}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default LevaeBalanceReportList;
