import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchWorkShift } from "../../../Apis/Workshift-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import { format, parse } from "date-fns";
import {
  fetchOrganizations,
  getOrganizationBySerach,
} from "../../../Apis/Organization-apis";

import axios from "axios";
import { fr } from "date-fns/locale";
import { Button, TableCell } from "@mui/material";

function OrganizationAddInList() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData, login } = useAuthStore();
  console.log("usersdata", userData);
  const org = userData?.organization;

  const [searchTerm, setSearchTerm] = useState("");
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
      getOrganizationBySerach(org.client_id, searchTerm)
        .then((data) => {
          let a = data?.organizations?.data;
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
                // <div
                //   style={{
                //     position: "relative",
                //     width: "60px",
                //     height: "30px",
                //     borderRadius: "15px",
                //     backgroundColor:
                //       org.organization_id == item.organization_id
                //         ? "#4CAF50"
                //         : "#ccc",
                //     cursor: isSingleOrg ? "not-allowed" : "pointer",
                //     opacity: isSingleOrg ? 0.4 : 1,
                //     pointerEvents: isSingleOrg ? "none" : "auto",
                //     transition: "background-color 0.3s ease",
                //     display: "inline-block",
                //   }}
                //   onClick={() => stats(item.organization_id)}
                // >
                //   <div
                //     style={{
                //       position: "absolute",
                //       top: "3px",
                //       left:
                //         org.organization_id == item.organization_id
                //           ? "33px"
                //           : "3px",
                //       width: "24px",
                //       height: "24px",
                //       borderRadius: "50%",
                //       backgroundColor: "white",
                //       transition: "left 0.3s ease",
                //       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                //     }}
                //   />
                // </div>

                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  {/* Tooltip */}
                  <div
                    className="tooltip"
                    style={{
                      position: "absolute",
                      bottom: "120%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#333",
                      color: "#fff",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      opacity: 0,
                      visibility: "hidden",
                      transition: "opacity 0.3s ease, visibility 0.3s ease",
                      pointerEvents: "none",
                      zIndex: 1000,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {org.organization_id == item.organization_id
                      ? `Currently Active: ${item.organization_name}`
                      : `Open ${item.organization_name}`}
                    {/* Tooltip Arrow */}
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "6px solid #333",
                      }}
                    />
                  </div>

                  {/* Toggle Button */}
                  <div
                    style={{
                      position: "relative",
                      width: "68px",
                      height: "34px",
                      borderRadius: "17px",
                      background:
                        org.organization_id == item.organization_id
                          ? "#4CAF50"
                          : "#e0e5ec",
                      cursor: isSingleOrg ? "not-allowed" : "pointer",
                      opacity: isSingleOrg ? 0.4 : 1,
                      pointerEvents: isSingleOrg ? "none" : "auto",
                      transition: "all 0.3s ease",
                      display: "inline-block",
                      boxShadow:
                        org.organization_id == item.organization_id
                          ? "inset 5px 5px 10px #3d9142, inset -5px -5px 10px #5bc95e"
                          : "5px 5px 10px #b8bdc7, -5px -5px 10px #ffffff",
                    }}
                    onClick={() => stats(item.organization_id)}
                    onMouseEnter={(e) => {
                      const tooltip = e.currentTarget.previousSibling;
                      if (tooltip) {
                        tooltip.style.opacity = "1";
                        tooltip.style.visibility = "visible";
                      }
                    }}
                    onMouseLeave={(e) => {
                      const tooltip = e.currentTarget.previousSibling;
                      if (tooltip) {
                        tooltip.style.opacity = "0";
                        tooltip.style.visibility = "hidden";
                      }
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "3px",
                        left:
                          org.organization_id == item.organization_id
                            ? "36px"
                            : "3px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background:
                          org.organization_id == item.organization_id
                            ? "linear-gradient(145deg, #5fdc6a, #4fba5a)"
                            : "linear-gradient(145deg, #ffffff, #e6e6e6)",
                        transition: "all 0.3s ease",
                        boxShadow:
                          org.organization_id == item.organization_id
                            ? "3px 3px 6px #3d9142, -3px -3px 6px #5bc95e"
                            : "3px 3px 6px #b8bdc7, -3px -3px 6px #ffffff",
                      }}
                    />
                  </div>
                </div>
              ),
            };
          });
          setOrganizations(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org, searchTerm]);

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
      add_action={"ORGANIZATION_ADD"}
      edit_action={"ORGANIZATION_EDIT"}
      delete_action={"ORGANIZATION_DELETE"}
      btnName={"Add Organization"}
      Data={organizations}
      search={searchTerm} // NEW
      setSearch={setSearchTerm} // NEW
      tableHeaders={[
        {
          name: "Organization Name",
          value_key: "organization_name",
          textStyle: "capitalize",
        },
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
