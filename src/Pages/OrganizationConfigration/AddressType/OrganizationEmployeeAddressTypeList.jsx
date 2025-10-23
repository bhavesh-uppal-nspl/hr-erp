import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import { fetchOrganizationEmployeeAddressTypes } from "../../../Apis/EmployeeAddressType-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import BusinessIcon from "@mui/icons-material/Business";
import HomeIcon from "@mui/icons-material/Home";
import { MAIN_URL } from "../../../Configurations/Urls";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

function OrganizationEmployeeAddressTypeList() {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [addressType, setAddressType] = useState([]);
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

  const {id} = useParams();


  
  const defaultVisibleColumns=["unit_type_name"]; 
  const mandatoryColumns=["unit_type_name"];  


  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationEmployeeAddressTypes(org.organization_id)
        .then((data) => {
          let a = data.addresstype.data;
          let b = a.map((item) => {
            return {
              ...item,
              id:item.organization_employee_address_type_id,
          
            };
          });
          setAddressType(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteadddresstype = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/employemnt-addresstype/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete  Address Type"
      );
    }
  };

  console.log("data ",addressType);

  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/employee-address-types/edit/${item.id}`);

    },

    [navigate]

  );

  
  return (
    <>
    <Layout4
      loading={loading}
      heading={" Address Types"}
      btnName={" Address Types"}
      tableHeaders={[
        {name : "Employment Address Types" , value_key : "employee_address_type_name" ,textStyle: "capitalize",},
   
      ]}
      Data={addressType}
       delete_action={"ORG_CONFIG_DELETE"}
      Icons={[
        <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <HomeIcon color="primary" />,
        <BusinessIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "employee address types",
        "employee address types",
        "Add employee Address types",
        "employee address type",
      ]}
      Route={"/organization-configration/employee-address-types"}
      setData={setAddressType}
      DeleteFunc={deleteadddresstype}
    />

 
    
          <TableDataGeneric
            tableName="Address Types"
            primaryKey="organization_employee_address_type_id"
            heading="Address Types"
            data={addressType}
              sortname={"employee_address_type_name"}
              showActions={true}
              //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee-address-types`}
            Route="/organization-configration/employee-address-types"
            DeleteFunc={deleteadddresstype}
            EditFunc={handleEdit}
            token={localStorage.getItem("token")}
            
               organizationUserId={userData?.organization_user_id} 
          showLayoutButtons={true}
          config={{
            defaultVisibleColumns: [
              
           "employee_address_type_name",
           
          ],
          mandatoryColumns: [
           "employee_address_type_name",
           
          
          ],
        }}
          
          />
   
    </>
  );
}

export default OrganizationEmployeeAddressTypeList;
