import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { fetchOrganizationEmploymentTypes } from "../../../Apis/Organization-Employement-types";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import BusinessIcon from "@mui/icons-material/Business";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

function OrganizationEmployementTypesList() {
  const [types, setTypes] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);

      fetchOrganizationEmploymentTypes(org.organization_id)
        .then((data) => {
          let a = data.employemtType.data;
          console.log("aaaa", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_employment_type_id,
            };
          });
          setTypes(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteemplomenttype = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/employemnt-type/${id}`,
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
      toast.error(
        error.response?.data?.error || "Failed to delete Department Division"
      );
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization-configration/employement-type/edit/${item.id}`);
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Employment Types"}
        btnName={"Add Employment type"}
        delete_action={"ORG_CONFIG_DELETE"}
        Data={types}
        tableHeaders={[
          {
            name: "Employment Types",
            value_key: "employment_type_name",
            textStyle: "capitalize",
          },
        ]}
        Icons={[
          <FormatAlignJustifyIcon
            sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
          />,
          <FormatAlignJustifyIcon color="primary" />,
          <BusinessIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "types",
          "employment types",
          "Add Employment types",
          "Employment types",
        ]}
        Route={"/organization-configration/employement-type"}
        setData={setTypes}
        DeleteFunc={deleteemplomenttype}
      />

      <TableDataGeneric
        tableName="Employees"
        primaryKey="organization_employment_type_id"
        heading="Employment Types"
        data={types}
        sortname={"employment_type_name"}
        showActions={true}
        //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employemnt-type`}
        Route="/organization-configration/employement-type"
        DeleteFunc={deleteemplomenttype}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["employment_type_name"],
          mandatoryColumns: ["employment_type_name"],
        }}
      />
    </>
  );
}

export default OrganizationEmployementTypesList;
