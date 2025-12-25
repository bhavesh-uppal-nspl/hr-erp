import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import { fetchOrganizationEmploymenentCategories, fetchOrganizationEmploymenentExiReasons } from "../../../Apis/Employment-exit-reason";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import Customisetable from "../../../Components/Table/Customisetable";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";
import { Description } from "@mui/icons-material";

function EmploymentCategoryList() {
  const [ExitReasons, setExitReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const navigate = useNavigate();

  const { id } = useParams();

  const org = userData?.organization;
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationEmploymenentCategories(org?.organization_id)
        .then((data) => {
          let a = data?.category?.data;
          console.log("data of exit is ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_employment_category_id,
              description:item?.description ? item?.description : "-",
              
            
             
            };
          });
          setExitReasons(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteexitreason = async (id) => {
    try {
      const org_id = org?.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/categories/${id}`,
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
          "Failed to delete Employment Category";

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
        error.response?.data?.error || "Failed to delete Exit Reason"
      );
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(
        `/organization-configration/employement-category/edit/${item.id}`
      );
    },

    [navigate]
  );

                   const handleShow = useCallback(
      (item) => {
        navigate(`/organization-configration/employement-category/view/${item.id}`)
      },
      [navigate],
    )


  return (
    <>
      <Layout4
        loading={loading}
        heading={"Employment Categories"}
        btnName={"Add Category"}
        add_action={"EMPLOYMENT_CATEGORY_ADD"}
        Data={ExitReasons}
        delete_action={"EMPLOYMENT_CATEGORY_DELETE"}
        tableHeaders={[
          {
            name: "Exit Reason",
            value_key: "employment_exit_reason_name",
            textStyle: "capitalize",
          },
          {
            name: "Exit Reason Type",
            value_key: "ExitReasonType",
            textStyle: "capitalize",
          },
          {
            name: "Description",
            value_key: "description",
            textStyle: "capitalize",
          },
        ]}
        Icons={[
          <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <ViewHeadlineIcon color="primary" />,
          <ExitToAppIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Empoloyment Category",
          "Employment Category",
          "Add  Ctaegory",
          "Employment Category",
        ]}
        Route={"/organization-configration/employement-category"}
        setData={setExitReasons}
        DeleteFunc={deleteexitreason}
      />

      <TableDataGeneric
        tableName="Employment Category"
        primaryKey="organization_employment_category_id"
        heading="Employment Category"
        data={ExitReasons}
        sortname={"exit_reason_type_name"}
        showActions={true}
        //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employement-exit-reason`}
        Route="/organization-configration/employement-category"
        DeleteFunc={deleteexitreason}
        handleShow={handleShow}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        edit_delete_action={["EMPLOYMENT_CATEGORY_DELETE", "EMPLOYMENT_CATEGORY_EDIT"]}
        organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["employment_category_name","description"],
          mandatoryColumns: ["employment_category_name","description"],
        }}
      />
    </>
  );
}
export default EmploymentCategoryList;
