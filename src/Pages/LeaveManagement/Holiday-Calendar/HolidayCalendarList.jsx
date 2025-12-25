import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import { fetchholidaycalendar } from "../../../Apis/Holidays-api";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventIcon from "@mui/icons-material/Event";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import dayjs from "dayjs";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";

const DEFAULT_COLUMNS = [
  {
    field: "holiday_calendar_name",
    label: "holiday_calendar_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "holiday_calendar_year_start_date",
    label: "holiday_calendar_year_start_date",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "holiday_calendar_year_end_date",
    label: "holiday_calendar_year_end_date",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function HolidayCalendarList() {
  const [holidaycalendar, setholidaycalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const { userData } = useAuthStore();
  const org = userData?.organization;

  const navigate = useNavigate();

  const { id } = useParams();

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dayjs(dateStr).format("DD-MM-YYYY");
  };

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
          const orgKey = `Holiday Calendar_grid_${org.organization_id}`;
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
      fetchholidaycalendar(org.organization_id)
        .then((data) => {
          let a = data?.Holidaycalenders?.data;
          console.log("a of caledar ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_holiday_calendar_id,
              holiday_calendar_year_end_date: `${formatDate(item?.holiday_calendar_year_start_date)}`,
              holiday_calendar_year_start_date: `${formatDate(item?.holiday_calendar_year_end_date)}`,
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
        `${MAIN_URL}/api/organizations/${org_id}/holiday-calendar/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        console.log("Holiday Calendar deleted:", response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Calendar";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }


    } catch (error) {
      if (error.response && error.response.status === 401) {
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


   
      const handleShow = useCallback(
    (item) => {
      navigate(`/leave/holiday-calendar/view/${item.id}`)
    },
    [navigate],
  )


  return (
    <>
      <Layout4
        loading={loading}
        heading={"Holiday Calendar"}
        add_action={"HOLIDAY_CALENDAR_ADD"}
        btnName={"ADD Holiday Calendar"}
        delete_action={"HOLIDAY_CALENDAR_DELETE"}
        Data={holidaycalendar}
        tableHeaders={[
          {
            name: "Calendar Name",
            value_key: "holiday_calendar_name",
            textStyle: "capitalize",
          },
          {
            name: "Holidays Starts",
            value_key: "holiday_calendar_year_start_date",
          },
          {
            name: "Holidays Ends",
            value_key: "holiday_calendar_year_end_date",
          },
        ]}
        Icons={[
          <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <CalendarTodayIcon color="primary" />,
          <EventIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "holiday calendar",
          "holiday calendar",
          "Add holiday calendar",
          "holiday calendar",
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
        edit_delete_action={["HOLIDAY_CALENDAR_DELETE", "HOLIDAY_CALENDAR_EDIT"]}
        EditFunc={handleEdit}
        handleShow={handleShow}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default HolidayCalendarList;
