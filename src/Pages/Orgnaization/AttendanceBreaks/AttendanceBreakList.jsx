import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchOrganizationDesignation } from "../../../Apis/Designation-api";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import usePermissionDataStore from "../../../Zustand/Store/usePermissionDataStore";
import NotAllowed from "../../../Exceptions/NotAllowed";
import { fetchAttendanceBreak } from "../../../Apis/Attendance";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";

function AttendanceBreakList() {

  const [loading, setLoading] = useState(true);
  const [Break , setBreak]=useState([])
  const { userData } = useAuthStore();
  const { Permission, setPermission } = usePermissionDataStore();
  const org = userData?.organization;

  
 const navigate = useNavigate();

  const {id} = useParams();


  function convertTo12HourFormat(time24) {
  if (!time24) return "";
  const [hourStr, minuteStr] = time24.split(":");
  let hours = parseInt(hourStr, 10);
  const minutes = minuteStr.padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
}

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchAttendanceBreak(org?.organization_id)
        .then((data) => {
          let a = data?.attendance_break
          console.log("break", a)
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_attendance_break_id,
           
              breaktype:item?.break_type?.attendance_break_type_name,
              break_start_time:convertTo12HourFormat(item?.break_start_time),
              break_end_time:convertTo12HourFormat(item?.break_end_time),
              break_type:item?.break_type?.attendance_break_type_name,
              is_paid:item?.is_paid == 1 ? "✔" :"✖"
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
        `${MAIN_URL}/api/organizations/${org_id}/attendance-breaks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: function (status) {
            return status >= 200 && status < 500; // handle 4xx errors gracefully
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

         navigate(`/organization/attendance-break/edit/${item.id}`);

    },

    [navigate]

  );




  return (
    <>
    <Layout4
      loading={loading}
      heading={"Attendance Break"}
      btnName={"Add Break"}
      Data={Break}
      delete_action={"ORG_STRUCTURE_DELETE"}
      tableHeaders={[
        {
          name: "Break Name",
          value_key: "attendance_break_name",
          textStyle: "capitalize",
        },
        {
          name: "Break Type",
          value_key: "breaktype",
          textStyle: "capitalize",
        },
        {
          name: "Break Duration",
          value_key: "break_duration_minutes",
        },
        {
          name: "Break Start",
          value_key: "start_time",
        },
        {
          name: "Break End",
          value_key: "end_time",
        },
      ]}
      Icons={[
        <LocalPoliceIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <NextWeekIcon color="primary" />,
        <LocalPoliceIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "Attendance Break ",
        "Attendance Break",
        "Add Attendance Break",
        "Attendance Break, Deleting this Break will also remove all related employees",
      ]}
      Route={"/organization/attendance-break"}
      setData={setBreak}
      DeleteFunc={deleteBreak}
    />

    

        <TableDataGeneric
          tableName="Attendance Break"
          primaryKey="organization_attendance_break_id"
          heading="Attendance Break"
          data={Break}
          sortname={"attendance_break_name"}
          showActions={true}
          // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-breaks`}
          Route="/organization/attendance-break"
          DeleteFunc={deleteBreak}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}

           organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: [
            "attendance_break_name",
            "break_duration_minutes",
            "break_start_time",
            "break_end_time",
            "break_type",
            "is_paid",
          ],
          mandatoryColumns: [
            "attendance_break_name",
            "break_duration_minutes",
            "break_start_time",
            "break_end_time",
            "break_type",
            "is_paid",
          ],
        }}
        />
   
    </>
  );
}

export default AttendanceBreakList;
