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
import {  fetchEmployeePayslipComponent, fetchPayrollRunEmployee } from "../../../Apis/Payroll";

function EmployeePayslipComponentList() {
  const [loading, setLoading] = useState(true);
  const [Break, setBreak] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchEmployeePayslipComponent(org?.organization_id)
        .then((data) => {
          let a = data?.payroll;
          console.log("break", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.employee_payslip_component_id,
             
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
        `${MAIN_URL}/api/organizations/${org_id}/payslip/components/${id}`,
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
      navigate(`/payslips/components/edit/${item.id}`);
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Employee Payslip Components"}
        btnName={"Add Component"}
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
        Route={"/payslips/components"}
        setData={setBreak}
        DeleteFunc={deleteBreak}
      />

      <TableDataGeneric
        tableName="Employee Payslip Components"
        primaryKey="employee_payslip_component_id"
        heading="Employee Payslip Components"
        data={Break}
        sortname={"component_name"}
        showActions={true}
        Route="/payslips/components"
        edit_delete_action={["EMPLOYEE_PAYS_COMPONENT_DELETE", "EMPLOYEE_PAYS_COMPONENT_EDIT"]}
        DeleteFunc={deleteBreak}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
      />
    </>
  );
}

export default EmployeePayslipComponentList;
