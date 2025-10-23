import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {fetchOrganizationLocationOwnerType} from '../../../Apis/ResidentialOwnershipType-api'
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import {MAIN_URL } from "../../../Configurations/Urls";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";


function LocationOwnershipTypeList() {

const { userData } = useAuthStore();
  const org = userData?.organization;
  const [locationType, setlocationType] = useState([]);
  const [loading, setLoading] = useState(true);
  
 const navigate = useNavigate();

  const {id} = useParams();



  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationLocationOwnerType(org.organization_id)
        .then((data) => {
          let a = data.ownershiptypes.data;
          let b = a.map(item => {
            return {
              ...item,
              id:item.organization_location_ownership_type_id,
            
            };
          });
          setlocationType(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deletelocationtype = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/location-ownership-type/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Location Ownership Type"
      );
    }
  };


  
  
const handleEdit = useCallback(

    (item) => {

         navigate(`/oorganization-configration/location-ownership-type/edit/${item.id}`);

    },

    [navigate]

  );
  



  return (

    <>
    <Layout4
      loading={loading}
      heading={" Location Ownership Types"}
      btnName={"Add Location Ownership Type"}
      Data={locationType}
       delete_action={"ORG_CONFIG_DELETE"}
        tableHeaders={[
        {name : "Location Ownership Types" , value_key : "location_ownership_type_name" ,textStyle: "capitalize",},
          {name : "Description" , value_key : "description" },
        
      ]}
      Icons={[
        <AutorenewIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <HomeIcon color="primary" />,
        <BusinessIcon sx={{ color: "text.secondary" }} />]
      }
      messages={[
        "Organization location ownership type",
        "Organization location ownership type",
        "Add Organization Location Ownership Type",
        "Organization location ownership type"
      ]}
      Route={"/organization-configration/location-ownership-type"}
      setData={setlocationType}
      DeleteFunc={deletelocationtype}
    />



      <TableDataGeneric
        tableName="Location Ownership Types"
        primaryKey="organization_location_ownership_type_id"
        heading="Location OwnershipType"
        data={locationType}
          sortname={"location_ownership_type_name"}
          showActions={true}
           apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/location-ownership-type`}
        Route="/organization-configration/location-ownership-type"
        DeleteFunc={deletelocationtype}
         EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        organizationUserId={userData?.organization_user_id} // Pass user ID
          showLayoutButtons={true}
           config={{
          defaultVisibleColumns: ["location_ownership_type_name","description"],
          mandatoryColumns: ["location_ownership_type_name","description"]
        }}
      
      
      />
    </>

  );
}

export default LocationOwnershipTypeList;
