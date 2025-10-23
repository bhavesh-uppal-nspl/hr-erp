import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { fetchholidaytypes } from "../../../Apis/Holidays-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import { brown } from "@mui/material/colors";
import Customisetable from "../../../Components/Table/Customisetable";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
function HolidayTypesList() {
  const [holidaytypes, setholidaytypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchholidaytypes(org.organization_id)
        .then((data) => {
          let a = data.holidaytypes.data;
          console.log(a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_holiday_type_id,
              HolidayType: item.holiday_type_name,
           
            };
          });
          setholidaytypes(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteCalendar = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/holiday-type/${id}`,
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

         navigate(`/organization-configration/holiday-types/edit/${item.id}`);

    },

    [navigate]

  );



  return (
    <>
      <Layout4
        loading={loading}
        heading={"Holiday Types"}
        btnName={"Add Holiday Type"}
        Data={holidaytypes}
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
        Route={"/organization-configration/holiday-types"}
        setData={setholidaytypes}
        DeleteFunc={deleteCalendar}
      />

  
        <TableDataGeneric
          tableName="Holiday Types"
          primaryKey="organization_holiday_type_id"
          heading="Holiday Types"
          data={holidaytypes}
          sortname={"holiday_type_name"}
          showActions={true}
          // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/holiday-type`}
          Route="/organization-configration/holiday-types"
          DeleteFunc={deleteCalendar}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}

               organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["employment_exit_reason_name","exit_reason_type","description"],
          mandatoryColumns: ["employment_exit_reason_name","exit_reason_type","description"],
        }}
        />

    </>
  );
}

export default HolidayTypesList;
