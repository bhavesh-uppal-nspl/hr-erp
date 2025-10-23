import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchholiday } from "../../../Apis/Holidays-api";
import TodayIcon from '@mui/icons-material/Today';
import axios from "axios";
import toast from "react-hot-toast";
import dayjs from 'dayjs';
import {MAIN_URL } from "../../../Configurations/Urls";

function HolidayList() {
  const [holiday, setholiday] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchholiday(org.organization_id)
        .then((data) => {
          let a = data.holidays;
          console.log("sev",a);
          let b = a.map((item) => {
            return {
              id: item.organization_holiday_id,
             name :`${item.holiday_name} 📅 ${dayjs(item.holiday_date).format('MMM D, YYYY')}`,
              description: `${item.description}`,
            };
          });
          setholiday(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteholiday = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/holiday/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete Holiday");
    }
  };

  return (
    <Layout1
      loading={loading}
      heading={"Holidays"}
      btnName={"Add Holiday"}
      Data={holiday}
      Icons={[
        <FormatAlignJustifyIcon
          sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
        />,
        <TodayIcon color="primary" />,
        <NextWeekIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={["Holiday", "Holiday", "Add Holiday", "Holiday"]}
      Route={"/holiday/holiday"}
      setData={setholiday}
      DeleteFunc={deleteholiday}
    />
  );
}

export default HolidayList;
