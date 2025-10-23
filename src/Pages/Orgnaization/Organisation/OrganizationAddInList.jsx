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
      fetchOrganizations(org.client_id)
        .then((data) => {
          let a = data.organizations;
          const isSingleOrg = a?.length === 1;
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_id,
              organization_name: item.organization_name,
              organization_short_name: item.organization_short_name,
              name: item.organization_name,
              description: item.organization_short_name,
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

  let deleteorganizations = async (id) => {
    try {

      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${id}`
      );
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Organizations"
      );
    }
  };
  return (
    <Layout1
      loading={loading}
      heading={"Organizations"}
      btnName={"Add Organization"}
      Data={organizations}
       delete_action={"ORG_STRUCTURE_DELETE"}
      tableHeaders={[
        { name: "Organization Name", value_key: "organization_name" ,textStyle: "capitalize",},
        {
          name: "Organization Short Name",
          value_key: "organization_short_name",
          textStyle: "capitalize",
        },
        // { name: "Status", value_key: "status" },
        { name: "Status", value_key: "toggle" },
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
        "Organizations",
        "Organizations",
        "Add Organizations",
        "Organizations",
      ]}
      Route={"/organization/details"}
      setData={setOrganizations}
      DeleteFunc={deleteorganizations}
    />
  );
}

export default OrganizationAddInList;
