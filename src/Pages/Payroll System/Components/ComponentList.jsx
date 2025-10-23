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
import { fetchPayrollComponents } from "../../../Apis/Payroll";

function ComponentList() {
  const [loading, setLoading] = useState(true);
  const [Break, setBreak] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchPayrollComponents(org?.organization_id)
        .then((data) => {
          let a = data?.payrollComponent;
          console.log("break", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_payroll_component_id,
              payroll_component_type: item?.payroll_component_type?.payroll_component_type_name,
              taxable: item?.taxable == null ? "" : item?.taxable,
              affects_net_pay:
                item?.affects_net_pay == null ? "" : item?.affects_net_pay,
              rounding_precision:
                item?.rounding_precision == null
                  ? ""
                  : item?.rounding_precision,
                 is_active: item?.is_active == null ? "" : item?.is_active,
                 formula_json:item?.formula_json== null ? "": item?.formula_json,
                 is_active: item?.is_active == 1 ? "✔" : "✖",
                 affects_net_pay: item?.affects_net_pay == 1 ? "✔" : "✖",
                 rounding_precision: item?.rounding_precision == 1 ? "✔" : "✖",
                 	taxable: item?.	taxable == 1 ? "✔" : "✖",
                    sort_order: item?.sort_order== null ? "" :item?.sort_order
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
        `${MAIN_URL}/api/organizations/${org_id}/payroll-component/${id}`,
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
      navigate(`/payroll/components/edit/${item.id}`);
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Payroll Components"}
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
        Route={"/payroll/components"}
        setData={setBreak}
        DeleteFunc={deleteBreak}
      />

      <TableDataGeneric
        tableName="Payroll Components"
        primaryKey="organization_payroll_component_id"
        heading="Payroll Components"
        data={Break}
        sortname={"payroll_component_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-breaks`}
        Route="/payroll/components"
        DeleteFunc={deleteBreak}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
      />
    </>
  );
}

export default ComponentList;
