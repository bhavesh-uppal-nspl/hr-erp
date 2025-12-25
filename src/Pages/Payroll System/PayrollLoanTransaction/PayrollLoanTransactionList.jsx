import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchWorkBreaks } from "../../../Apis/Workshift-api";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";
import { fetchPayrollAdvances, fetchPayrollComponents, fetchPayrollLoan, fetchPayrollLoanTransaction } from "../../../Apis/Payroll";

function PayrollLoanTransactionList() {
  const [loading, setLoading] = useState(true);
  const [Break, setBreak] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchPayrollLoanTransaction(org?.organization_id)
        .then((data) => {
          let a = data?.payroll;
          console.log("break", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.organization_payroll_loan_transaction_id,
              payroll_loan:item?.payroll_loan?.loan_name,
                employee_code:item?.employee?.employee_code,
               employee_name: item?.employee
                ? `${item.employee.first_name || ""}  ${item.employee.middle_name || ""} ${item.employee.last_name || ""}`
                : "",
            };
          });
          setBreak(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteBreak = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/payroll-loan-transaction/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        console.log("Break:", response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Break";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/payroll/loan-transactions/edit/${item.id}`);
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        add_action={"PAYROLL_LOAN_TRANSACTION_ADD"}
        heading={"Payroll Loans Transactions"}
        btnName={"Add Loan Transactions"}
        Data={Break}
        delete_action={"ORG_STRUCTURE_DELETE"}
        tableHeaders={[
          {
            name: "Attendance Break",
            value_key: "breaktype",
            textStyle: "capitalize",
          },
          {
            name: "Workshift",
            value_key: "workshift",
            textStyle: "capitalize",
          },
        ]}
        Icons={[
          <LocalPoliceIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <NextWeekIcon color="primary" />,
          <LocalPoliceIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Workshift Break ",
          "Workshift Break",
          "Add Workshift Break",
          "Workshift Break, Deleting this Break will also remove all related employees",
        ]}
        Route={"/payroll/loan-transactions"}
        setData={setBreak}
        DeleteFunc={deleteBreak}
      />

      <TableDataGeneric
        tableName="Payroll Loans Transactions"
        primaryKey="organization_payroll_loan_transaction_id"
        heading="Payroll Loan Transactions"
        data={Break}
        sortname={"payment_mode"}
        edit_delete_action={["PAYROLL_LOAN_TRANSACTION_DELETE", "PAYROLL_LOAN_TRANSACTION_EDIT"]}
        showActions={true}
        Route="/payroll/loan-transactions"
        DeleteFunc={deleteBreak}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
      />
    </>
  );
}

export default PayrollLoanTransactionList;
