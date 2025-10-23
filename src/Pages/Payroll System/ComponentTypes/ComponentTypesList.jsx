import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPayrollComponentTypes } from "../../../Apis/Payroll";
function ComponentTypesList() {
  const [componentTypes, setComponentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchPayrollComponentTypes(org?.organization_id)
        .then((data) => {
          let a = data?.payrollTypes;
          console.log(a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.organization_payroll_component_type_id,
                 is_active: item?.is_active == 1 ? "✔" : "✖",
            };
          });
          setComponentTypes(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteCalendar = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/payroll-component-type/${id}`,
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
        error.response?.data?.error || "Failed to delete Holiday Type"
      );
    }
  };

  const handleEdit = useCallback(

    (item) => {

         navigate(`/payroll/component-types/edit/${item.id}`);

    },

    [navigate]

  );



  return (
    <>
      <Layout4
        loading={loading}
        heading={"Payroll Component Types"}
        btnName={"Add Component Type"}
        Data={componentTypes}
        delete_action={"ORG_CONFIG_DELETE"}
        tableHeaders={[
          {
            name: "Holiday Types",
            value_key: "holiday_type_name",
            textStyle: "capitalize",
          },
          { name: "Description", value_key: "description" },
        ]}
        Icons={[
          <AutorenewIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <EventIcon color="primary" />,
          <CalendarMonthIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Holiday Type",
          "Holiday Type",
          "Add Holiday Type",
          "Holiday type",
        ]}
        Route={"/payroll/component-types"}
        setData={setComponentTypes}
        DeleteFunc={deleteCalendar}
      />

  
        <TableDataGeneric
          tableName="Payroll Component Types"
          primaryKey="organization_payroll_component_type_id"
          heading="Payroll Component Types"
          data={componentTypes}
          sortname={"payroll_component_type_name"}
          showActions={true}
          Route="/payroll/component-types"
          DeleteFunc={deleteCalendar}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}
        />

    </>
  );
}

export default ComponentTypesList;
