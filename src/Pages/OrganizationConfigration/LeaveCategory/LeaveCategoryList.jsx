import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import { fetchLeaveCategory } from "../../../Apis/Leave-api";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import Customisetable from "../../../Components/Table/Customisetable";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

function LeaveCategoryList() {
  const [leaveCategory, setLeaveCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

   const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchLeaveCategory(org.organization_id)
        .then((data) => {
          let a = data.leavecategory.data;
          console.log(a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_leave_category_id,
          
            };
          });
          setLeaveCategory(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteCalendar = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/leave-category/${id}`,
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
          "Failed to delete Category";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Leave Category"
      );
    }
  };


  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/leave-category/edit/${item.id}`);

    },

    [navigate]

  );


                     const handleShow = useCallback(
      (item) => {
        navigate(`/organization-configration/leave-category/view/${item.id}`)
      },
      [navigate],
    )




  return (
    <>
      <Layout4
        loading={loading}
        heading={"Leave Categories"}
        btnName={"Add Leave Category"}
        add_action={"LEAVE_CATEGORY_ADD"}
        Data={leaveCategory}
        delete_action={"LEAVE_CATEGORY_DELETE"}
        tableHeaders={[
          {
            name: "Leave Category",
            value_key: "leave_category_name",
            textStyle: "capitalize",
          },
          { name: "Leave Category Code", value_key: "leave_category_code" },
          { name: "Description", value_key: "description" },
        ]}
        Icons={[
          <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <ViewHeadlineIcon color="primary" />,
          <ExitToAppIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Leave Category",
          "Leave Category",
          "Add Leave Category",
          "Leave Categories",
        ]}
        Route={"/organization-configration/leave-category"}
        setData={setLeaveCategory}
        DeleteFunc={deleteCalendar}
      />



      
            <TableDataGeneric
              tableName="Leave Categories"
              primaryKey="organization_leave_category_id"
              heading="Leave Categories"
              data={leaveCategory}
                sortname={"leave_category_name"}
                //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/leave-category`}
              showActions={true}
                Route="/organization-configration/leave-category"
              DeleteFunc={deleteCalendar}
                EditFunc={handleEdit}
                handleShow={handleShow}
                edit_delete_action={["LEAVE_CATEGORY_DELETE", "LEAVE_CATEGORY_EDIT"]}
              token={localStorage.getItem("token")}
                   organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["leave_category_code","leave_category_name","description"],
          mandatoryColumns: ["leave_category_code","leave_category_name","description"],
        }}
            
            />
      
       
    
    </>
  );
}

export default LeaveCategoryList;
