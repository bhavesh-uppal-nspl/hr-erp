import React, { useCallback, useEffect, useState } from "react";

import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import PlaceIcon from "@mui/icons-material/Place";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import Layout1 from "../../DataLayouts/Layout1";
import { fetchOrganizationLocation } from "../../../Apis/OrganizationLocation";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { Description } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import Layout2 from "../../DataLayouts/Layout2";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";

function OrganizationLocationList() {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationLocation(org.organization_id)
        .then((data) => {
          let a = data.locations;
          console.log("dafahh", data)
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_location_id,
              City:item?.city?.city_name,
              Country:item.country.country_name,
              State:item?.state?.state_name,
           
              location_latitude: item?.location_latitude == null ? "" :item?.location_latitude,
              location_longitude: item?.location_longitude == null ? "" :item?.location_longitude,
              postal_code: item?.postal_code == null ? "" :item?.postal_code,
              area_sq_ft: item?.area_sq_ft == null ? "" :item?.area_sq_ft,
              number_of_floors: item?.number_of_floors == null ? "" :item?.number_of_floors,
              LocationOwnershiptype: item?.location_ownershiptype[0]?.location_ownership_type_name == null ? "" :item?.location_ownershiptype[0]?.location_ownership_type_name,
            

            };
          });
          setLocations(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  console.log("locations  ", locations);
  let deletelocation = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/location/${id}`,
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
      toast.error(error.response?.data?.error || "Failed to delete location");
    }
  };

  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization/location/edit/${item.id}`);

    },

    [navigate]

  );


  return (
    <>
      <Layout4
        loading={loading}
        heading={" Locations"}
        btnName={"Add Location"}
        Data={locations}
         delete_action={"ORG_STRUCTURE_DELETE"}
        tableHeaders={[
          { name: "Location ", value_key: "location_name", width: "130px",textStyle: "capitalize",},
          { name: "Address ", value_key: "addressline1",width: "200px" },
          {name : "Country" , value_key : "general_country_id",width: "100px" ,textStyle: "capitalize",},
           {name : "State" , value_key : "general_state_id",width: "130px",textStyle: "capitalize", },
            {name : "City" , value_key : "general_city_id" ,width: "130px",textStyle: "capitalize",},
          { name: "Postal Code", value_key: "postal_code" ,width: "130px"},
        ]}
        Icons={[
          <AddLocationAltIcon
            sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
          />,
          <PlaceIcon color="primary" />,
          <PlaceIcon color="primary" />,

          <LocationCityIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "locations",
          "organisation locations",
          "Add Location",
          "Location, Removing this location will delete its associated organizations and all related data permanently.",
        ]}
        Route={"/organization/location"}
        setData={setLocations}
        DeleteFunc={deletelocation}
      />

      
   
        <TableDataGeneric
          tableName="Locations"
          primaryKey="organization_location_id"
          heading="Locations"
          data={locations}
          sortname={"location_name"}
          showActions={true}
          // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/location`}
          Route="/organization/location"
          DeleteFunc={deletelocation}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}

           
                  organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["location_name","addressline1","city","state","country","postal_code"],
          mandatoryColumns: ["location_name","addressline1","city","state","country","postal_code"],
        }}
        />
   

    </>
  );
}

export default OrganizationLocationList;
