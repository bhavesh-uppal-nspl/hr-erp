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

  const { id } = useParams();

  const defaultVisibleColumns = ["unit_type_name"];
  const mandatoryColumns = ["unit_type_name"];

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationEmployeeAddressTypes(org.organization_id)
        .then((data) => {
          let a = data.addresstype.data;
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_employee_address_type_id,
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
        validateStatus: function (status) {
          return status >= 200 && status < 500; // allow 4xx
        },
      }
    );

    // SUCCESS
    if (response.status === 200) {
      toast.success(response.data.message);
      console.log("Address Type deleted:", response.data.message);
      return;
    }

    // OTHER STATUS (400, 404, 422, etc.)
    const errorMessage =
      response.data?.message ||
      response.data?.error ||
      response.data?.errors?.[Object.keys(response.data.errors || {})[0]]?.[0] ||
      "Failed to delete Address Type";

    toast.error(errorMessage);
    console.warn("Deletion error:", response.status, response.data);

  } catch (error) {

    // SESSION EXPIRED
    if (error.response?.status === 401) {
      toast.error("Session Expired!");
      window.location.href = "/login";
      return;
    }

    // UNEXPECTED ERRORS
    console.error("Delete failed:", error);
    toast.error("Failed to delete Address Type");
  }
};


  console.log("data ", addressType);

  const handleEdit = useCallback(
    (item) => {
      navigate(
        `/organization-configration/employee-address-types/edit/${item.id}`
      );
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        add_action={"ADDRESS_TYPE_ADD"}
        heading={" Address Types"}
        btnName={" Address Types"}
          
        tableHeaders={[
          {
            name: "Employment Address Types",
            value_key: "employee_address_type_name",
            textStyle: "capitalize",
          },
        ]}
        Data={addressType}
        delete_action={"ADDRESS_TYPE_DELETE"}
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
        edit_delete_action={["ADDRESS_TYPE_DELETE", "ADDRESS_TYPE_EDIT"]}
        config={{
          defaultVisibleColumns: ["employee_address_type_name"],
          mandatoryColumns: ["employee_address_type_name"],
        }}
      />
    </>
  );
}

export default OrganizationEmployeeAddressTypeList;
