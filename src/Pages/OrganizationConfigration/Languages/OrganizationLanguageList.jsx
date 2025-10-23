import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchOrganizationLanguages } from "../../../Apis/fetchLanguages";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import Customisetable from "../../../Components/Table/Customisetable";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";

function OrganizationLanguageList() {
  const [Languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;
   const navigate = useNavigate();

  const {id} = useParams();


  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationLanguages(org?.organization_id)
        .then((data) => {
          let a = data.Languages.data;
          console.log("gyguyg", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_language_id,
          
            };
          });
          setLanguages(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteLanguages = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/languages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete Languages");
    }
  };

  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/languages/edit/${item.id}`);

    },

    [navigate]

  );




  return (
    <>
      <Layout4
        loading={loading}
        heading={"Languages"}
        btnName={"Add Languages"}
        Data={Languages}
        delete_action={"ORG_CONFIG_DELETE"}
        tableHeaders={[
          {
            name: "Language Code",
            value_key: "language_code",
            width: "300px",
            textStyle: "capitalize",
          },
          {
            name: "Language ",
            value_key: "language_name",
            width: "300px",
            textStyle: "capitalize",
          },
          { name: "Description", value_key: "description", width: "400px" },
        ]}
        Icons={[
          <FormatAlignJustifyIcon
            sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
          />,
          <FormatAlignJustifyIcon color="primary" />,
          <NextWeekIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={["Languages", "Languages", "Add Languages", "Languages"]}
        Route={"/organization-configration/languages"}
        setData={setLanguages}
        DeleteFunc={deleteLanguages}
      />




      
            <TableDataGeneric
              tableName="Languages"
              primaryKey="organization_language_id"
              heading="Languages"
              data={Languages}
                sortname={"language_name"}
                //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/languages`}
                showActions={true}
              Route="/organization-configration/languages"
              DeleteFunc={deleteLanguages}
               EditFunc={handleEdit}
              token={localStorage.getItem("token")}

              
                  organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["language_code","language_name","description"],
          mandatoryColumns: ["language_code","language_name","description"],
        }}
            
            />
      
    </>
  );
}

export default OrganizationLanguageList;
