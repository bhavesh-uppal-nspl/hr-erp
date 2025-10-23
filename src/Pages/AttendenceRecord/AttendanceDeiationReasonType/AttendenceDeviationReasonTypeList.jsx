import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { MAIN_URL } from "../../../Configurations/Urls";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import { fetchAttendanceDeviationReasonType } from "../../../Apis/Attendance";


function AttendenceDeviationReasonTypeList() {
  const [source, setSource] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchAttendanceDeviationReasonType(org?.organization_id)
        .then((data) => {
          let a = data?.attendance_deviation_reason_type;
          let b = a.map((item) => {
            return {
              ...item,
              id:item?.organization_attendance_deviation_reason_type_id  ,
              name: item?.deviation_reason_type_name || "",
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
        `${MAIN_URL}/api/organizations/${org_id}/attendance-deviation-reason-type/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Attendance Source"
      );
    }
  };

  return (
    <Layout1
      loading={loading}
      heading={"Attendance Deviation Reason Type"}
      btnName={"Add Deviation Reason Type"}
      delete_action={"ATTENDANCE_DELETE"}
      Data={source}
      tableHeaders={[
        {
          name: "Deviation Reason Type Name",
          value_key: "deviation_reason_type_name",
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
        "Attendance Deviation Reason Type",
        "Attendance Deviation Reason Type",
        "Add Attendance Deviation Reason Type",
        ",Deleting this Attendance Deviation Reason Type will permanently delete all associated Attendance Deviation Reasons. Please confirm before proceeding.",
      ]}
      Route={"/attendance/deviation-reason-type"}
      setData={setSource}
      DeleteFunc={deleteSource}
    />
  );
}

export default AttendenceDeviationReasonTypeList;
