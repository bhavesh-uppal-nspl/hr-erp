import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchWorkShift } from "../../../Apis/Workshift-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import { format, parse } from "date-fns";
import { fetchOrganizations } from "../../../Apis/Organization-apis";

import axios from "axios";
import { fr } from "date-fns/locale";
import { Button, TableCell } from "@mui/material";
import { fetchEntity } from "../../../Apis/Entity";
import { Description } from "@mui/icons-material";

function OrganizationAddInList() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData, login } = useAuthStore();
  console.log("usersdata", userData);
  const org = userData?.organization;
  console.log("org", org);

  const stats = async (id) => {
    try {
      const response = await axios.post(
        `${MAIN_URL}/api/organizations/extra/active`,
        {
          organization_id: id,
          application_user_id: userData.application_user_id,
        }
      );

      const { user } = response.data;

      let dd = user.organization.find(
        (item) =>
          item.organization_id == user.user_active_organization.organization_id
      );

      let mm = {
        ...user,
        organization: dd,
      };
      login(mm);
      toast.success("Status Updated Sucessfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error);
    }
  };

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchEntity(org.organization_id)
        .then((data) => {
          let a = data.entity;
          const isSingleOrg = a?.length === 1;
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_entity_id,
              organization_name: item.entity_name,
              organization_short_name: item.entity_type?.organization_entity_type_name,
              name: item.organization_name,
              description: item.location?.location_name,
              status: (
                <div
                  style={{
                    cursor: "pointer",
                    color:
                      org.organization_id == item.organization_id
                        ? "green"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  {org.organization_id == item.organization_id
                    ? "ACTIVE"
                    : "DISACTIVE"}
                  {/* </div> */}
                </div>
              ),

              toggle: (
                <div
                  style={{
                    borderRadius: "8px",
                    color: "white",
                    padding: "10px 15px",
                    textAlign: "center",
                    fontWeight: "bold",
                    backgroundColor:
                      org.organization_id == item.organization_id
                        ? "green"
                        : "blue",
                    cursor: isSingleOrg ? "not-allowed" : "pointer", 
                    opacity: isSingleOrg ? 0.4 : 1,
                    pointerEvents: isSingleOrg ? "none" : "auto",
                  }}
                  onClick={() => stats(item.organization_id)}
                >
                  {org.organization_id != item.organization_id
                    ? "Open"
                    : "Currently Open"}
                  {/* </div> */}
                </div>
              ),
            };
          });
          setOrganizations(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

   let deleteOrganization = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/entity/${id}`,
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
          "Failed to delete Registration";

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
        error.response?.data?.error || "Failed to delete Business Registration"
      );
    }
  };



  return (
    <Layout1
      loading={loading}
      heading={"Organization Entity"}
      btnName={"Add Entity"}

      Data={organizations}
      add_action={"ENTITY_ADD"}
      edit_action={"ENTITY_EDIT"}
       delete_action={"ENTITY_DELETE"}
      tableHeaders={[
        { name: "Entity Name", value_key: "organization_name" ,textStyle: "capitalize",},
        {
          name: "Entity Type",
          value_key: "organization_short_name",
          textStyle: "capitalize",
        },
        { name: "Location", value_key: "description" },
        // { name: "Status", value_key: "toggle" },
      ]}
      Icons={[
        <FormatAlignJustifyIcon
          sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
        />,
        <FormatAlignJustifyIcon color="primary" />,
        <NextWeekIcon sx={{ color: "text.secondary" }} />,
      ]}
      showActions={false}
      messages={[
        "Organization Entity",
        "Organization Entity",
        "Add Entity",
        "Organization Entity",
      ]}
      Route={"/organization/entity"}
      setData={setOrganizations}
      DeleteFunc={deleteOrganization}
    />
  );
}

export default OrganizationAddInList;
