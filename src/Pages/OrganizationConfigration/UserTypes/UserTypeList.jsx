import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchWorkShiftTypes } from "../../../Apis/Workshift-api";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchUserTypes } from "../../../Apis/UserTypes.js";
import TableDataGeneric from "../../../Configurations/TableDataGeneric.js";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4.jsx";

function UserTypeList() {
  const [UserTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

   const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchUserTypes(org.organization_id)
        .then((data) => {
          let a = data?.userTypes?.data;
          console.log(a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_user_type_id,
              description: item.description===null ? "" :item?.description,
              user_type_code: item.user_type_code===null ? "" :item?.user_type_code,
            };
          });
          setUserTypes(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteUserTypes = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/user-type/${id}`,
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
          "Failed to delete User Type";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete User Type");
    }
  };

  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/user-types/edit/${item.id}`);

    },

    [navigate]

  );



                        const handleShow = useCallback(
      (item) => {
        navigate(`/organization-configration/user-types/view/${item.id}`)
      },
      [navigate],
    )



  return (
    <>
      <Layout4
        loading={loading}
        heading={"User Types"}
        btnName={"Add User types"}
        add_action={"USER_TYPE_ADD"}
        Data={UserTypes}
        delete_action={"USER_TYPE_DELETE"}
        tableHeaders={[
          {
            name: "Employee Type",
            value_key: "user_type_name",
            textStyle: "capitalize",
          },
          { name: "Description", value_key: "description" },
        ]}
        Icons={[
          <FormatAlignJustifyIcon
            sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
          />,
          <FormatAlignJustifyIcon color="primary" />,
        ]}
        messages={["User Types", "User Types", "Add User types", "User Types"]}
        Route={"/organization-configration/user-types"}
        setData={setUserTypes}
        DeleteFunc={deleteUserTypes}
      />

        <TableDataGeneric
          tableName="User Types"
          primaryKey="organization_user_type_id"
          heading="User Types"
          data={UserTypes}
          sortname={"user_type_name"}
          showActions={true}
          handleShow={handleShow}
          // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/user-type`}
          Route="/organization-configration/user-types"
          DeleteFunc={deleteUserTypes}
          
  EditFunc={handleEdit}
          token={localStorage.getItem("token")}
          edit_delete_action={["USER_TYPE_DELETE", "USER_TYPE_EDIT"]}

                  organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["user_type_code","user_type_name","description"],
          mandatoryColumns: ["user_type_code","user_type_name","description"],
        }}
        />
 
    </>
  );
}

export default UserTypeList;
