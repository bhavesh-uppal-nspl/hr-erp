import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { fetchEmployeeLeaves } from "../../../Apis/Employee-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import { fetchAttendanceDeviationReason } from "../../../Apis/Attendance";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";

function AttendanceDeviationReasonList() {
  const [leaves, setLeaves] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

  const {id} = useParams();


  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);

      fetchAttendanceDeviationReason(org?.organization_id)
        .then((data) => {
          const a = data?.attendance_deviation_reason;
          console.log("a sis s", a);
          const b = a.map((item) => {
            return {
              ...item,
              id: item.organization_attendance_deviation_reason_id,
            
              deviation_reason_type:item?.deviation_reason_type?.deviation_reason_type_name || "",
               is_active: item?.is_active == 1 ? "✔" : "✖",
            };
          });

          setLeaves(b);
        })
        .catch((err) => {
          console.error("Failed to fetch Deviation Reason:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [org]);

  let deleteemployeeleave = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/attendance-deviation-reason/${id}`,
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
        error.response?.data?.error ||
          "Failed to delete Attendance Deviation Reason"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-deviation-reason/${id}`,
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


  
const handleEdit = useCallback(

    (item) => {

         navigate(`/attendance/deviation-reason/edit/${item.id}`);

    },

    [navigate]

  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Attendance Deviation Reason"}
        btnName={"Add Deviation Reason"}
        Data={leaves}
        delete_action={"LEAVE_DELETE"}
        tableHeaders={[
          {
            name: "Deviation Reason",
            value_key: "attendance_deviation_reason_name",
            textStyle: "capitalize",
          },
          {
            name: "Deviation Reason Type",
            value_key: "deviation_reason_type",
            textStyle: "capitalize",
          },
          {
            name: "Description",
            value_key: "description",
            textStyle: "capitalize",
          },
        ]}
        Icons={[
          <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <FormatAlignJustifyIcon color="primary" />,
          <CategoryIcon sx={{ color: "text.secondary" }} />,
          <DateRangeIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Attendance Deviation Reason",
          "Attendance Deviation Reason",
          "Add Deviation Reason",
          "Attendance Deviation Reasons",
        ]}
        Route={"/attendance/deviation-reason"}
        setData={setLeaves}
        DeleteFunc={deleteemployeeleave}
      />

   
        <TableDataGeneric
          tableName="Atendance Deviation Reason"
          primaryKey="organization_attendance_deviation_reason_id"
          heading="Atendance Deviation Reason"
          data={leaves}
          sortname={"attendance_deviation_reason_name"}
          showActions={true}
          // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-deviation-reason`}
          Route="/attendance/deviation-reason"
          DeleteFunc={handleDelete}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}
        />
  
    </>
  );
}

export default AttendanceDeviationReasonList;
