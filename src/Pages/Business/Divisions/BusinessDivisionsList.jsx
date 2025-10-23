import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import BusinessIcon from "@mui/icons-material/Business";
import SegmentIcon from "@mui/icons-material/Segment";
import DescriptionIcon from "@mui/icons-material/Description";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchBusinessDivision } from "../../../Apis/BusineesDivision-api";
import axios from "axios";
import toast from "react-hot-toast";
import {MAIN_URL } from "../../../Configurations/Urls";

function BusinessDivisionsList() {

  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [divisions, setDivions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchBusinessDivision(org.organization_id)
        .then((data) => {
          let a = data.businessDivision;
          let b = a.map((item) => {
            return {
              id: item.organization_business_division_id,
              name: item.business_division_name,
              description: item.description,
            };
          });
          setDivions(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deletedivision = async (id) => {
  try {
    const org_id =org.organization_id
    const response = await axios.delete(
      `${MAIN_URL}/api/organizations/${org_id}/business-division/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
    );
    console.log(response.data.message);
  } catch (error) {
    console.error("Delete failed:", error);
    toast.error(
      error.response?.data?.error || "Failed to delete Business Division"
    );
  }
};


  return (
    <Layout1
      loading={loading}
      heading={"Business Divisions"}
      btnName={"Add Business Divisions"}
      Data={divisions}
      Icons={[
        <BusinessIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <SegmentIcon color="primary" />,
        <DescriptionIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "divisons",
        "business divisons",
        "Add Business Divisons",
        "divisons",
      ]}
      Route={"/business/division"}
      setData={setDivions}
      DeleteFunc={deletedivision}
    />
  );
}

export default BusinessDivisionsList;
