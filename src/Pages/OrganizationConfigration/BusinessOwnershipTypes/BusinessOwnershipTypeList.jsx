import React, { useCallback, useEffect, useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import useAuthStore from "../../../Zustand/Store/useAuthStore";

import { fetchOrgBusinessOwnershipType } from "../../../Apis/BusinessOwnershipType";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import toast from "react-hot-toast";
import Customisetable from "../../../Components/Table/Customisetable";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";


function BusinessOwnershipTypeList() {
  const [ownershipTypes, setOwnershipTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const navigate = useNavigate();

  const {id} = useParams();

    const defaultVisibleColumns=["organization_business_ownership_type_name","business_ownership_type_category"]; 
  const mandatoryColumns=["organization_business_ownership_type_name","business_ownership_type_category"];  


  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrgBusinessOwnershipType(org.organization_id)
        .then((data) => {
          let a = data.businessownershiptype;
          console.log("a is ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_business_ownership_type_id,
              business_ownership_type_category:item.generalownership_category[0].business_ownership_type_category_name,
           
            };
          });
          setOwnershipTypes(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  console.log("us", ownershipTypes);

  let deleteownership = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/businessownershiptype/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Business Ownership Type";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }


      console.log("ownership type->", response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Department Division"
      );
    }
  };


  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/business-ownership-type/edit/${item.id}`);

    },

    [navigate]

  );



                 const handleShow = useCallback(
    (item) => {
      navigate(`/organization-configration/business-ownership-type/view/${item.id}`)
    },
    [navigate],
  )



  return (
    <>
      <Layout4
        loading={loading}
        add_action={"BUSINESS_OWNERSHIP_TYPE_ADD"}
        heading={"Business Ownership Type"}
        btnName={"Add Business Ownership Type"}
        Data={ownershipTypes}
        delete_action={"BUSINESS_OWNERSHIP_TYPE_DELETE"}
        tableHeaders={[
          {
            name: "Business Ownership Type Name",
            value_key: "organization_business_ownership_type_name",
            textStyle: "capitalize",
          },
          {
            name: "Ownership Type Category",
            value_key: "business_ownership_type_category_name",
            textStyle: "capitalize",
          },
        ]}
        Icons={[
          <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <ViewHeadlineIcon color="primary" />,
          <ExitToAppIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Business Ownership Type",
          "Business Ownership Type",
          "Add Business Ownership Type",
          "Business Ownership Type",
        ]}
        Route={"/organization-configration/business-ownership-type"}
        setData={setOwnershipTypes}
        DeleteFunc={deleteownership}
      />

   

      <TableDataGeneric
        tableName="Business Ownership Types"
        primaryKey="organization_business_ownership_type_id"
        heading="Business Ownership Types"
        data={ownershipTypes}
        showActions={true}
          sortname={"organization_business_ownership_type_name"}
           apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/businessownershiptype`}
        Route="/organization-configration/business-ownership-type"
        DeleteFunc={deleteownership}
          EditFunc={handleEdit}
        token={localStorage.getItem("token")}
         organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        handleShow={handleShow}
        edit_delete_action={["BUSINESS_OWNERSHIP_TYPE_DELETE", "BUSINESS_OWNERSHIP_TYPE_EDIT"]}
        // Optional: Explicitly define visible columns
        config={{
          defaultVisibleColumns: defaultVisibleColumns,
          mandatoryColumns: mandatoryColumns
        }}
      
      />
 
    </>
  );
}

export default BusinessOwnershipTypeList;
