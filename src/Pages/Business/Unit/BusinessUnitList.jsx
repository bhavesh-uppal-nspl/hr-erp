import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import BusinessIcon from "@mui/icons-material/Business";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ApartmentIcon from "@mui/icons-material/Apartment";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {fetchBusinessUnit} from '../../../Apis/Unit-api'
import toast from "react-hot-toast";
import axios from "axios";
import {MAIN_URL } from "../../../Configurations/Urls";

function BusinessUnitList() {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchBusinessUnit(org.organization_id)
        .then((data) => {
          let a = data.businessUnit;
          let b = a.map((item) => {
            return {
              id: item.organization_business_unit_id,
              name: item.business_unit_name,
              description: item.description,
            };
          });
          setUnits(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  console.log("units of busiubg",units);



  let deleteunit = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/business-unit/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
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
      heading={"Business Units"}
      btnName={"Add Business Units"}
      Data={units}
      Icons={[
        <ApartmentIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <AppRegistrationIcon color="primary" />,
        <NextWeekIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={["units", "business units", "Add Business Units", "units"]}
      Route={"/business/unit"}
      setData={setUnits}
      DeleteFunc={deleteunit}
    />
  );
}

export default BusinessUnitList;
