import React, { useEffect, useState } from "react";
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

function LeaveSummaryMonthlyReport() {
  const [leaves, setLeaves] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchEmployeeLeaveMonthlySummaryReport(org?.organization_id)
        .then((data) => {
          let a = data?.summary || [];
          console.log("a gbsg", a)
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.employee_leave_monthly_summary_id || "",
              // fullname: item?.employee_name,
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
        { name: "Approved Days", value_key: "approved_leave_days" },
        { name: "UnApproved Days", value_key: "unapproved_leave_days" },
        { name: "Casual  Leaves", value_key: "casual_leaves" },
        { name: "Medical Leaves", value_key: "medical_leaves" },
         { name: "Earned Leaves", value_key: "earned_leaves" },
         { name: "Compensatory Leaves", value_key: "compensatory_off_leaves" },
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
  );
}

export default LeaveSummaryMonthlyReport;
