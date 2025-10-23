import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import {fetchholidaycalendar} from '../../../Apis/Holidays-api'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {MAIN_URL } from "../../../Configurations/Urls";
import dayjs from "dayjs";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";

function HolidayCalendarList() {

  const [holidaycalendar, setholidaycalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

   const navigate = useNavigate();

  const {id} = useParams();

  const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return dayjs(dateStr).format("DD-MM-YYYY"); 
};

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchholidaycalendar(org.organization_id)
        .then((data) => {
          let a = data?.Holidaycalenders?.data;
          console.log("a of caledar ",a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_holiday_calendar_id,
           holiday_calendar_year_end_date:`${formatDate(item?.holiday_calendar_year_start_date)}`,
             holiday_calendar_year_start_date:`${formatDate(item?.holiday_calendar_year_end_date)}`,
             holiday_calendar_name: item?.holiday_calendar_name,

            };
          });
          setholidaycalendar(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

     let deleteCalendar = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/holiday-calendar/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Holiday Calendar"
      );
    }
  };


  const handleEdit = useCallback(

    (item) => {

         navigate(`/leave/holiday-calendar/edit/${item.id}`);

    },

    [navigate]

  );


  
  return (
    <>
    <Layout4
      loading={loading}
      heading={"Holiday Calendar"}
      btnName={"ADD Holiday Calendar"}
      Data={holidaycalendar}
       tableHeaders={[
        {name : "Calendar Name" , value_key : "holiday_calendar_name" ,textStyle: "capitalize"},
         {name : "Holidays Starts" , value_key : "holiday_calendar_year_start_date" },
          {name : "Holidays Ends" , value_key : "holiday_calendar_year_end_date" },
        
        
   
      ]}
      Icons={[
        <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <CalendarTodayIcon color="primary" />,
        <EventIcon sx={{ color: "text.secondary" }} />]
      }
      messages={[
        "holiday calendar",
        "holiday calendar",
        "Add holiday calendar",
        "holiday calendar"
      ]}
      Route={"/leave/holiday-calendar"}
      setData={setholidaycalendar}
      DeleteFunc={deleteCalendar}
    />

   
    
          <TableDataGeneric
            tableName="Holiday Calendar"
            primaryKey="organization_holiday_calendar_id"
            heading="Holiday Calendar"
            data={holidaycalendar}
              sortname={"holiday_calendar_name"}
              showActions={true}
              //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/holiday-calendar`}
            Route="/leave/holiday-calendar"
            DeleteFunc={deleteCalendar}
            EditFunc={handleEdit}
            token={localStorage.getItem("token")}

            
               organizationUserId={userData?.organization_user_id} 
          showLayoutButtons={true}
          config={{
            defaultVisibleColumns: [
              
            "holiday_calendar_name",
            "holiday_calendar_year_start_date",
            "holiday_calendar_year_end_date",
          
          ],
          mandatoryColumns: [
           "holiday_calendar_name",
            "holiday_calendar_year_start_date",
            "holiday_calendar_year_end_date",
          
          ],
        }}
          
          
          />
  
    </>

  );
}

export default HolidayCalendarList;
