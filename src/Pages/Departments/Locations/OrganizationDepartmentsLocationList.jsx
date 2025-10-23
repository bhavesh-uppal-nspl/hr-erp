import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import StoreIcon from "@mui/icons-material/Store";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchDepartmentLocation } from "../../../Apis/DepartmentLocation-api.js";
import axios from "axios";
import toast from "react-hot-toast";
import {  MAIN_URL } from "../../../Configurations/Urls.js";

function OrganizationDepartmentsLocationList() {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [departmentLocation, setDepartmentLocation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchDepartmentLocation(org.organization_id)
        .then((data) => {
          let a = data.departmentlocations;
          let b = a.map((item) => {
            return {
              id: item.organization_department_location_id,
              name: item.department.department_name,
              description: item.location.location_name,
            };
          });
          setDepartmentLocation(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  console.log(departmentLocation);

  let deletedepartmentlocation = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org.organization_id}/department-location/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
      console.log("nnnzsdc", response.data.message);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Department Division"
      );
    }
  };

  return (
    <Layout1
      loading={loading}
      heading={"Organization Department Locations"}
      btnName={"Add Organization Department's Location"}
      Data={departmentLocation}
      Icons={[
        <StoreIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <StoreIcon color="primary" />,
        <NextWeekIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "departments location",
        "organisation department location",
        "Add Organisation Department Locations",
        "departments location",
      ]}
      Route={"/departments/locations"}
      setData={setDepartmentLocation}
      DeleteFunc={deletedepartmentlocation}
    />
  );
}

export default OrganizationDepartmentsLocationList;
