import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {fetchBusinessRegistrationType} from '../../../Apis/Registration-api'
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import toast from "react-hot-toast";
import Customisetable from "../../../Components/Table/Customisetable";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

function BusinessRegistrationTypeList() {

  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationtype,setRegistrationType]=useState([]);
    const { userData } = useAuthStore();
    const org = userData?.organization;
     const navigate = useNavigate();

  const {id} = useParams();



  
    useEffect(() => {
      if (org?.organization_id) {
        setLoading(true);
        fetchBusinessRegistrationType(org.organization_id)
          .then((data) => {
            let a = data.organizationbusinessregistrationtype.data;
            console.log("a is ", a)
            let b = a.map((item) => {
              return {
               ...item,
               id:item.organization_business_registration_type_id,
              
              };
            });
            setRegistrationType(b);
          })
          .catch((err) => {});
        setLoading(false);
      }
    }, [org]);
  
console.log("reguistyer type ", registrationtype)
  
    let deleteregistrationtype = async (id) => {
      try {
        const org_id = org.organization_id;
        const response = await axios.delete(
          `${MAIN_URL}/api/organizations/${org_id}/business-registration-type/${id}`,  { headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },}
        );
        console.log("registration type->", response.data.message);
      } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
        console.error("Delete failed:", error);
        toast.error(
          error.response?.data?.error || "Failed to delete Registration Type"
        );
      }
    };


    
const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/business-registration-type/edit/${item.id}`);

    },

    [navigate]

  );

  

  return (
    <>
    <Layout4
      loading={loading}
      heading={"Business Registration Type"}
      btnName={"Add Business Registration Type"}
      Data={registrationtype}
        delete_action={"ORG_CONFIG_DELETE"}
        tableHeaders={[
        {name : "Business Registration Type Name" , value_key : "business_registration_type_name" ,textStyle: "capitalize",},
           {name : "Business Registration Type Code" , value_key : "business_registration_type_code" ,textStyle: "capitalize",},
      ]}
      Icons={[
        <AutorenewIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <NextWeekIcon color="primary" />,
        <AutorenewIcon sx={{ color: "text.secondary" }} />]
      }
      messages={[
        "Business Registration Type",
        "Business Registration Type",
        "Add Business Registration Type",
        "Business Registration  Type"
      ]}
      Route={"/organization-configration/business-registration-type"}
      setData={setRegistrationType}
      DeleteFunc={deleteregistrationtype}
   
    />

    
    


      <TableDataGeneric
        tableName="Business registration Types"
        primaryKey="organization_business_registration_type_id"
        heading="Business registration Types"
        data={registrationtype}
          sortname={"business_registration_type_name"}
          showActions={true}
          //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/business-registration-type`}
        Route="/organization-configration/business-registration-type"
        DeleteFunc={deleteregistrationtype}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        // Optional: Explicitly define visible columns
        config={{
          defaultVisibleColumns: ["business_registration_type_name","business_registration_type_code","description"],
          mandatoryColumns: ["business_registration_type_name","business_registration_type_code","description"]
        }}
      
      />
  
    
    </>

    

  );
}

export default BusinessRegistrationTypeList;
