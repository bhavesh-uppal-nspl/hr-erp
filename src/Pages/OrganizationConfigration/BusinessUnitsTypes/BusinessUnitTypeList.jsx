import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import { fetchOrganizationUnitTypes } from "../../../Apis/OrganizationUnit";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import BorderInnerIcon from '@mui/icons-material/BorderInner';
import toast from "react-hot-toast";
import Customisetable from "../../../Components/Table/Customisetable";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";



function BusinessUnitTypeList() {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unitTypes, setUnitTypes] = useState([]);
  const navigate = useNavigate();



  const {id} = useParams();


  const defaultVisibleColumns=["unit_type_name"]; 
  const mandatoryColumns=["unit_type_name"];  

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationUnitTypes(org.organization_id)
        .then((data) => {
          let a = data.unitTypes.data;
          // Keep original field names for TableDataGeneric
          let b = a.map((item) => {
            return {
              ...item,
              // Keep both for compatibility
              id: item.organization_unit_type_id,
              organization_unit_type_id: item.organization_unit_type_id
            };
          });
          console.log("Fetched unit types:", b); // Debug log
          setUnitTypes(b);
        })
        .catch((err) => {
          console.error("Failed to fetch organization units", err);
          toast.error("Failed to fetch unit types");
        })
        .finally(() => setLoading(false));
    }
  }, [org]);

  let deleteunittypes = async (id) => {
    try {
      console.log("Deleting unit type with id:", id);
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/units-types/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // Remove deleted item from state
      setUnitTypes(prev => prev.filter(item => item.organization_unit_type_id !== id));
      toast.success("Unit type deleted successfully");
      
    } catch (error) { 
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete unit type");
    }
  };

  const handleEdit = useCallback(
    (item) => {
      console.log("Editing item:", item); // Debug log
      navigate(`/organization-configration/unit-types/edit/${item.organization_unit_type_id || item.id}`);
    },
    [navigate]
  );


                   const handleShow = useCallback(
        (item) => {
          navigate(`/organization-configration/unit-types/view/${item.id}`)
        },
        [navigate],
      )
  

  return (
    <>
      <Layout4
        loading={loading}
        add_action={"BUSINESS_UNIT_TYPE_ADD"}
        heading={"Business Unit Types"}
        btnName={"Add Business Unit Type"}
        Data={unitTypes}
        delete_action={"BUSINESS_UNIT_TYPE_DELETE"}
        tableHeaders={[
          {
            name: "Business Unit Type Name", 
            value_key: "unit_type_name",
            textStyle: "capitalize"
          },
        ]}
        Icons={[
          <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <BorderInnerIcon color="primary" />,
        ]}
        messages={[
          "Organization Business Unit Type",
          "Organization Business Unit Type",
          "Add Organization Business Unit Type",
          "Organization Business Unit Type",
        ]}
        Route={"/organization-configration/unit-types"}
        setData={setUnitTypes}
        DeleteFunc={deleteunittypes}
      />

      <TableDataGeneric
        tableName="Business_Unit_Types"
        primaryKey="organization_unit_type_id"
        heading="Business Unit Types"
        data={unitTypes}
        sortname="unit_type_name"
        showActions={true}
        Route="/organization-configration/unit-types"
        DeleteFunc={deleteunittypes}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        edit_delete_action={["BUSINESS_UNIT_TYPE_DELETE", "BUSINESS_UNIT_TYPE_EDIT"]}
        handleShow={handleShow}
        organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        // Optional: Explicitly define visible columns
        config={{
          defaultVisibleColumns: defaultVisibleColumns,
          mandatoryColumns: mandatoryColumns
        }}
      />
    </>
  );
}

export default BusinessUnitTypeList;