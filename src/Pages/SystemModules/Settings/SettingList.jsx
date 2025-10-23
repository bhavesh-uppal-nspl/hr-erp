import React, { useCallback, useEffect, useState } from "react";
import {fetchOrganizationSetting} from '../../../Apis/OrganizationSetting-api'
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import {MAIN_URL } from "../../../Configurations/Urls";
import Layout4 from "../../DataLayouts/Layout4";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";

function SettingList() {
 const [settings, setSetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const navigate= useNavigate()

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationSetting(org.organization_id)
        .then((data) => {
          let a = data.settings;
          console.log(a);
          let b = a.map((item) => {
            return {

              ...item,
              id: item.organization_setting_id,
            
              setting_type:item?.setting_type?.setting_type_name,
                 customizable: item?.customizable == 1 ? "✔" : "✖",
                 is_required: item?.is_required == 1 ? "✔" : "✖",
                 has_predefined_values: item?.has_predefined_values == 1 ? "✔" : "✖",
            
              
           

            };
          });
          setSetings(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

   let deleteBreak = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/setting/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        console.log("Break:", response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Break";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/settings/edit/${item.id}`);
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Organization Settings"}
        btnName={"Add Settings"}
        Data={settings}
        delete_action={"ORG_STRUCTURE_DELETE"}
        tableHeaders={[
          {
            name: "Attendance Break",
            value_key: "breaktype",
            textStyle: "capitalize",
          },
          {
            name: "Workshift",
            value_key: "workshift",
            textStyle: "capitalize",
          },
        ]}
        Icons={[
          <LocalPoliceIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <NextWeekIcon color="primary" />,
          <LocalPoliceIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Workshift Break ",
          "Workshift Break",
          "Add Workshift Break",
          "Workshift Break, Deleting this Break will also remove all related employees",
        ]}
        Route={"/organization/settings"}
        setData={setSetings}
        DeleteFunc={deleteBreak}
      />

      <TableDataGeneric
        tableName="Organization Settings"
        primaryKey="organization_setting_id"
        heading="Organization Settings"
        data={settings}
        sortname={"setting_name"}
        showActions={true}
        Route="/organization/settings"
        DeleteFunc={deleteBreak}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}

          organizationUserId={userData?.organization_user_id}
          showLayoutButtons={true}
           config={{
          defaultVisibleColumns: ["setting_name","setting_type","setting_value"],
          mandatoryColumns: ["setting_name","setting_type","setting_value"]
        }}
      />
    </>
  );
}

export default SettingList;
