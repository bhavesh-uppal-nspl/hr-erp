import React, { useEffect, useState } from "react";
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

function LevaeBalanceReportList() {
  const [leaves, setLeaves] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);

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
              fullname: item?.employee
                ? `${item.employee.first_name} ${item.employee.last_name}`
                : "",
              leave_type_name: item?.leave_type?.leave_type_name || "",
              description: item?.carry_forward_days || "",
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
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to delete Employee Leave Entitlement"
      );
    }
  };

  return (
    <Layout1
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
        { name: "Carry Forward Days", value_key: "carry_forward_days" },
        { name: "Balance Days", value_key: "balance_days" },
        { name: "Leave Taken Days", value_key: "leave_taken_days" },
        { name: "Adjusted Days", value_key: "adjusted_days" },
        {
          name: "Entitle days",
          value_key: "entitled_days",
          textStyle: "capitalize",
        },
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
  );
}

export default LevaeBalanceReportList;
