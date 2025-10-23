import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {fetchEmployeeAddress} from '../../../Apis/Employee-api'
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import Layout2 from "../../DataLayouts/Layout2";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HouseIcon from '@mui/icons-material/House';
import {MAIN_URL } from "../../../Configurations/Urls";

function EmployeeAddressList() {

  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [employeeaddress, setemployeeaddress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchEmployeeAddress(org.organization_id)
        .then((data) => {
          console.log("nnxc",data)
          let a = data?.employeesaddress;
          try {

                let b = a.map((item) => {

            return {
              id: item?.employee_address_id,
               name:item?.address_line1,
              description:`${item.address_type?.organization_employee_address_type_name} ➖ ${item.ownership_type.organization_employee_residential_ownership_type_name}`,
              info: `${item.city.city_name} ➖ ${item.postal_code}`
            };
          });
          console.log("b",b)
          setemployeeaddress(b);
            
          } catch (error) {
            console.log(error)
            
          }
      
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  console.log("employeeaddress",employeeaddress);

  let deleteemployeeaddress = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/employee-address/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete Employee Address");
    }
  };

  return (
    <Layout2
      loading={loading}
      heading={"Employee Addresses"}
      btnName={"Add Employee Address"}
      Data={employeeaddress}
      Icons={[
        <AutorenewIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <NextWeekIcon color="primary" />,
        <HouseIcon sx={{ color: "text.secondary" }} />,
        <LocationCityIcon sx={{ color: "text.secondary" }} />]
      }
      messages={[
        "employee address",
        "employee address",
        "Add Employee Adress",
        "employee address"
      ]}
      Route={"/employee/employee-addresses"}
      setData={setemployeeaddress}
      DeleteFunc={deleteemployeeaddress}
    />

  );
}

export default EmployeeAddressList;
