import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import {
  fetchEmployeeLeaveEntitlements,
  fetchEmployeeLeaves,
} from "../../../Apis/Employee-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import {
  fetchAttendanceBreakType,
  fetchAttendanceSource,
} from "../../../Apis/Attendance";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

function AttendenceBreakTypesList() {
  const [source, setSource] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchAttendanceBreakType(org?.organization_id)
        .then((data) => {
          let a = data?.attendance_breaktype;
          console.log("a of entile is ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item?.organization_attendance_break_type_id,

              is_active: item?.is_active == 1 ? "✔" : "✖",
            };
          });
          setSource(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteSource = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/attendance-break-type/${id}`,
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
        error.response?.data?.error || "Failed to delete Attendance BreakType"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-break-type/${id}`,
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
      navigate(`/attendance/break-type/edit/${item?.id}`);
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Attendance BreakType"}
        btnName={"Add BreakType"}
        delete_action={"ATTENDANCE_DELETE"}
        Data={source}
        tableHeaders={[
          {
            name: "BreakType Name",
            value_key: "attendance_break_type_name",
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
          "Attendance Break Type",
          "Attendance Break Type",
          "Add Attendance Break Type",
          "Attendance Break Type",
        ]}
        Route={"/attendance/break-type"}
        setData={setSource}
        DeleteFunc={deleteSource}
      />

      <TableDataGeneric
        tableName="Attendance Break Types"
        primaryKey="organization_attendance_break_type_id"
        heading="Atendance Break Type"
        data={source}
        sortname={"attendance_break_type_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-break-type`}
        Route="/attendance/break-type"
        DeleteFunc={handleDelete}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: [
            "attendance_break_type_name",
            "description",
            "is_active",
          ],
          mandatoryColumns: [
            "attendance_break_type_name",
            "description",
            "is_active",
          ],
        }}
      />
    </>
  );
}

export default AttendenceBreakTypesList;
