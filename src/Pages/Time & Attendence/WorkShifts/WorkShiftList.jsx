// import React, { useCallback, useEffect, useState } from "react";
// import Layout1 from "../../DataLayouts/Layout1";
// import NextWeekIcon from "@mui/icons-material/NextWeek";
// import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
// import useAuthStore from "../../../Zustand/Store/useAuthStore";
// import { fetchWorkShift } from "../../../Apis/Workshift-api";
// import { MAIN_URL } from "../../../Configurations/Urls";
// import toast from "react-hot-toast";
// import { format, parse } from "date-fns";

// import axios from "axios";
// import TableDataGeneric from "../../../Configurations/TableDataGeneric";
// import { useNavigate, useParams } from "react-router-dom";
// import Layout4 from "../../DataLayouts/Layout4";


// function WorkShiftList() {
//   const [shifts, setShifts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { userData } = useAuthStore();
//   const org = userData?.organization;
//   console.log("org", org);

//   const formatTimeWithAMPM = (timeStr) => {
//     try {
//       const date = parse(timeStr, "HH:mm:ss", new Date());
//       return format(date, "hh:mm a"); // e.g., "04:00 AM", "09:00 PM"
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         toast.error("Session Expired!");
//         window.location.href = "/login";
//       }
//       console.error("Invalid time:", timeStr);
//       return "";
//     }
//   };

// const convertMinutesToHours = (minutes) => {
//   if (!minutes || isNaN(minutes) || minutes < 0) return "0 minutes";

//   const hrs = Math.floor(minutes / 60);
//   const mins = minutes % 60;

//   let result = [];

//   if (hrs > 0) {
//     result.push(`${hrs} ${hrs === 1 ? "h" : "h"}`);
//   }

//   if (mins > 0) {
//     result.push(`${mins} ${mins === 1 ? "min" : "min"}`);
//   }

//   // If both hrs and mins are 0
//   if (result?.length === 0) {
//     return "0 minutes";
//   }

//   return result.join(" ");
// };


//   useEffect(() => {
//     if (org?.organization_id) {
//       setLoading(true);
//       fetchWorkShift(org.organization_id)
//         .then((data) => {
//           let a = data.workshifts.data;
//           console.log(a);
//           let b = a.map((item) => {
//             return {
//               ...item,
//               id: item.organization_work_shift_id,
//               work_shift_start_time: formatTimeWithAMPM(
//                 item.work_shift_start_time
//               ),
//               work_shift_end_time: formatTimeWithAMPM(item.work_shift_end_time),
             
//               shift_type: item.shift_type[0]?.work_shift_type_name,
//               location: item.location?.location_name,
          
//               work_duration_minutes: `${convertMinutesToHours(item?.work_duration_minutes)}`,
//               is_active: item?.is_active == 1 ? "✔" : "✖",
//               break_duration_minutes : `${item?.break_duration_minutes} min`,
          
             
//             };
//           });
//           setShifts(b);
//         })
//         .catch((err) => {});
//       setLoading(false);
//     }
//   }, [org]);

//   let deleteworkshifts = async (id) => {
//     try {
//       const org_id = org.organization_id;
//       const response = await axios.delete(
//         `${MAIN_URL}/api/organizations/${org_id}/workshift/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         toast.error("Session Expired!");
//         window.location.href = "/login";
//       }
//       console.error("Delete failed:", error);
//       toast.error(error.response?.data?.error || "Failed to delete Work Shift");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(
//         `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       console.log("Successfully deleted units-types with id:", id);
//       return Promise.resolve();
//     } catch (error) {
//       console.error("Delete failed:", error);
//       return Promise.reject(error);
//     }
//   };

//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Add handleEdit function using useCallback
//   const handleEdit = useCallback(
//     (item) => {
//       // Adjust the route and key as needed for your app
//       navigate(`/organization/work-shift/edit/${item.id}`);
//     },
//     [navigate]
//   );

//   return (
//     <>
//       <Layout4
//         loading={loading}
//         heading={"WorkShifts"}
//         btnName={"Add WorkShift"}
//         Data={shifts}
//         delete_action={"SHIFT_DELETE"}
//         tableHeaders={[
//           { name: "WorkShift Name", value_key: "work_shift_name" },
//           { name: "Shift Start Time", value_key: "work_shift_start_time" },
//           { name: "Shift End Time", value_key: "work_shift_end_time" },
//           { name: "Work Duration", value_key: "work_duration_minutes" },
//           {
//             name: "Break Duration (minutes)",
//             value_key: "break_duration_minutes",
//           },
//         ]}
//         Icons={[
//           <FormatAlignJustifyIcon
//             sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
//           />,
//           <FormatAlignJustifyIcon color="primary" />,
//           <NextWeekIcon sx={{ color: "text.secondary" }} />,
//         ]}
//         messages={["WorkShifts", "WorkShifts", "Add WorkShifts", "WorkShifts"]}
//         Route={"/organization/work-shift"}
//         setData={setShifts}
//         DeleteFunc={deleteworkshifts}
//       />

//       <TableDataGeneric
//         tableName="Workshifts"
//         primaryKey="organization_work_shift_id"
//         heading="Workshifts"
//         data={shifts}
//         sortname={"work_shift_name"}
//         showActions={true}
//         //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/workshift`}
//         Route="/organization/work-shift"
//         DeleteFunc={handleDelete}
//         EditFunc={handleEdit}
//         token={localStorage.getItem("token")}
//       />
//     </>
//   );
// }

// export default WorkShiftList;


import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchWorkShift } from "../../../Apis/Workshift-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import { format, parse } from "date-fns";

import axios from "axios";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

const DEFAULT_COLUMNS = [
  {
    field: "work_shift_name",
    label: "Work Shift Name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "break_duration_minutes",
    label: "Break Duration Minutes",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "is_active",
    label: "Is Active",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "location",
    label: "Location",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function WorkShiftList() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const { userData } = useAuthStore();
  const org = userData?.organization;
  console.log("org", org);

  const formatTimeWithAMPM = (timeStr) => {
    try {
      const date = parse(timeStr, "HH:mm:ss", new Date());
      return format(date, "hh:mm a"); // e.g., "04:00 AM", "09:00 PM"
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Invalid time:", timeStr);
      return "";
    }
  };

  const convertMinutesToHours = (minutes) => {
    if (!minutes || isNaN(minutes) || minutes < 0) return "0 minutes";

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    let result = [];

    if (hrs > 0) {
      result.push(`${hrs} ${hrs === 1 ? "h" : "h"}`);
    }

    if (mins > 0) {
      result.push(`${mins} ${mins === 1 ? "min" : "min"}`);
    }

    // If both hrs and mins are 0
    if (result?.length === 0) {
      return "0 minutes";
    }

    return result.join(" ");
  };

  // Load table configuration from general-datagrids API
  useEffect(() => {
    const loadTableConfiguration = async () => {
      if (!org?.organization_id) {
        setLoadingConfig(false);
        return;
      }

      try {
        const configRes = await fetch(
          `${MAIN_URL}/api/general-datagrids`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (configRes.ok) {
          const configResponse = await configRes.json();
          const datagrids = configResponse.datagrids || [];
          const orgKey = `Workshifts_grid_${org.organization_id}`;
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

  // load workShifts data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchWorkShift(org.organization_id)
        .then((data) => {
          let a = data.workshifts.data;
          console.log(a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_work_shift_id,
              work_shift_start_time: formatTimeWithAMPM(
                item.work_shift_start_time
              ),
              work_shift_end_time: formatTimeWithAMPM(item.work_shift_end_time),
              cardname: item.work_shift_name,
              shift_type: item.shift_type[0]?.work_shift_type_name,
              location: item.location?.location_name,
              carddescription: `${formatTimeWithAMPM(item.work_shift_start_time)} — ${formatTimeWithAMPM(item.work_shift_end_time)}`,
              work_duration_minutes: `${convertMinutesToHours(item?.work_duration_minutes)}`,
              is_active: item?.is_active == 1 ? "✔" : "✖",
              break_duration_minutes: `${item?.break_duration_minutes} min`,
            };
          });
          setShifts(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteworkshifts = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/workshift/${id}`,
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
      toast.error(error.response?.data?.error || "Failed to delete Work Shift");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift/${id}`,
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

  const navigate = useNavigate();
  const { id } = useParams();

  // Add handleEdit function using useCallback
  const handleEdit = useCallback(
    (item) => {
      // Adjust the route and key as needed for your app
      navigate(`/organization/work-shift/edit/${item.id}`);
    },
    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"WorkShifts"}
        btnName={"Add WorkShift"}
        Data={shifts}
        delete_action={"SHIFT_DELETE"}
        tableHeaders={[
          { name: "WorkShift Name", value_key: "work_shift_name" },
          { name: "Shift Start Time", value_key: "work_shift_start_time" },
          { name: "Shift End Time", value_key: "work_shift_end_time" },
          { name: "Work Duration", value_key: "work_duration_minutes" },
          {
            name: "Break Duration (minutes)",
            value_key: "break_duration_minutes",
          },
        ]}
        Icons={[
          <FormatAlignJustifyIcon
            sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
          />,
          <FormatAlignJustifyIcon color="primary" />,
          <NextWeekIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={["WorkShifts", "WorkShifts", "Add WorkShifts", "WorkShifts"]}
        Route={"/organization/work-shift"}
        setData={setShifts}
        DeleteFunc={deleteworkshifts}
      />

      <TableDataGeneric
        tableName="Workshifts"
        primaryKey="organization_work_shift_id"
        heading="Workshifts"
        data={shifts}
        sortname={"work_shift_name"}
        showActions={true}
        //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/workshift`}
        Route="/organization/work-shift"
        DeleteFunc={handleDelete}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default WorkShiftList;