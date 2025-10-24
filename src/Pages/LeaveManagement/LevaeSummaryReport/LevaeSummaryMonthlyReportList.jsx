import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { fetchEmployeeLeaveMonthlySummaryReport } from "../../../Apis/Employee-api";
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
    field: "employee_code",
    label: "employee_code",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "approved_leave_days",
    label: "approved_leave_days",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "casual_leaves",
    label: "casual_leaves",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function LeaveSummaryMonthlyReport() {
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
          const orgKey = `Leave Summary Report_grid_${org.organization_id}`;
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
      fetchEmployeeLeaveMonthlySummaryReport(org?.organization_id)
        .then((data) => {
          let a = data?.summary || [];
          console.log("a gbsg", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.employee_leave_monthly_summary_id || "",

              // employee_code: item?.employee_code || "",
              // year: item?.year || "",
              // month: item?.month || "",
              // total_leave_days: item?.total_leave_days || "",
              // approved_leave_days: item?.approved_leave_days || "",

              // unapproved_leave_days: item?.unapproved_leave_days || "",
              //   casual_leaves: item?.casual_leaves || "",
              // medical_leaves: item?.medical_leaves || "",
              //  earned_leaves: item?.earned_leaves || "",
              //  compensatory_off_leaves: item?.compensatory_off_leaves || "",
              // leave_without_pay: item?.leave_without_pay || "",
              // leave_with_pay: item?.leave_with_pay || "",
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
        `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-monthlyleave-summary/${id}`,
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
        heading={"Employee Leave Monthly Summary Report"}
        btnName={" Report"}
        Data={leaves}
        tableHeaders={[
          {
            name: "Employee Name",
            value_key: "fullname",
            textStyle: "capitalize",
          },
          { name: "Employee Code", value_key: "employee_code" },
          { name: "Year", value_key: "year" },
          { name: "Month", value_key: "month" },
          { name: "Total Leave Days", value_key: "total_leave_days" },
          { name: "Approved", value_key: "approved_leave_days" },
          { name: "UnApproved", value_key: "unapproved_leave_days" },
          { name: "Casual", value_key: "casual_leaves" },
          { name: "Medical", value_key: "medical_leaves" },
          { name: "Earned", value_key: "earned_leaves" },
          { name: "Compensatory", value_key: "compensatory_off_leaves" },
          { name: "Leave Without Pay", value_key: "leave_without_pay" },
          { name: "Leave With Pay", value_key: "leave_with_pay" },
        ]}
        Icons={[
          <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <FormatAlignJustifyIcon color="primary" />,
          <CategoryIcon sx={{ color: "text.secondary" }} />,
          <DateRangeIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Employee Leave Monthly Summary Report",
          "Employee Leave Monthly Summary Report",
          "Add Employee Monthly Summary Report",
          "Employee Leaves Monthly Summary Report",
        ]}
        Route={"employee-leave-balance-report"}
        setData={setLeaves}
        DeleteFunc={deleteemployeeleave}
      />

      <TableDataGeneric
        tableName="Leave Summary Report"
        primaryKey="organization_leave_entitlement_id"
        heading="Employee Leave Monthly Summary Report"
        data={leaves}
        sortname={"employee_name"}
        showActions={true}
        //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee-monthlyleave-summary`}
        Route="/employee-leave-summary"
        DeleteFunc={handleDelete}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default LeaveSummaryMonthlyReport;
