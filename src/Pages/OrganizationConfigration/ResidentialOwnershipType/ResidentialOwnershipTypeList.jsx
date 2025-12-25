import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {fetchOrganizationResidentialOwnerType} from '../../../Apis/ResidentialOwnershipType-api'
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import {MAIN_URL } from "../../../Configurations/Urls";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";


function ResidentialOwnershipTypeList() {

const { userData } = useAuthStore();
  const org = userData?.organization;
  const [residentialType, setresidentialType] = useState([]);
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

  const {id} = useParams();


  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationResidentialOwnerType(org?.organization_id)
        .then((data) => {
          let a = data?.residentialtype?.data;
          let b = a.map(item => {
            return {
              ...item,
               id:item.organization_residential_ownership_type_id,
          
               
            };
          });
          setresidentialType(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteresidentailtype = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/residential-ownership-type/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );

       if (response.status === 200) {
        toast.success(response.data.message);
           } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Residentail Ownership Type";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }

    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Ownership Type"
      );
    }
  };



  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/residential-ownership-type/edit/${item.id}`);

    },

    [navigate]

  );

 



  return (

    <>
    <Layout4
      loading={loading}
      heading={"Residential Ownership Types"}
      btnName={"Add  Residential Ownership Type"}
      add_action={"RESIDENTIAL_OWNERSHIP_TYPE_ADD"}
      Data={residentialType}
       delete_action={"RESIDENTIAL_OWNERSHIP_TYPE_DELETE"}
          tableHeaders={[
        {name : "Residential Ownership Types" , value_key : "residential_ownership_type_name" ,textStyle: "capitalize",},
          {name : "Description" , value_key : "description" },
        
      ]}
      

      Icons={[
        <AutorenewIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <HomeIcon color="primary" />,
        <BusinessIcon sx={{ color: "text.secondary" }} />]
      }
      messages={[
        "Organization residential ownership type",
        "Organization residential ownership type",
        "Add Organization Residential Ownership Type",
        "Organization residential ownership type"
      ]}
      Route={"/organization-configration/residential-ownership-type"}
      setData={setresidentialType}
      DeleteFunc={deleteresidentailtype}
    />

    

      <TableDataGeneric
        tableName="Residential OwnershipType"
        primaryKey="organization_residential_ownership_type_id"
        heading="Residential OwnershipType"
        data={residentialType}
          sortname={"residential_ownership_type_name"}
          showActions={true}
          //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/residential-ownership-type`}
        Route="/organization-configration/residential-ownership-type"
        DeleteFunc={deleteresidentailtype}
         EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        edit_delete_action={["RESIDENTIAL_OWNERSHIP_TYPE_DELETE", "RESIDENTIAL_OWNERSHIP_TYPE_EDIT"]}
        // Optional: Explicitly define visible columns    
        config={{
          defaultVisibleColumns: ["residential_ownership_type_name","description"],
          mandatoryColumns: ["residential_ownership_type_name","description"]
        }}
      
      />

    </>

  );
}

export default ResidentialOwnershipTypeList;
