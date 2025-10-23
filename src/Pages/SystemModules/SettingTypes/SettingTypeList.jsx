import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {} from '../../../Apis/OrganizationSetting-api'
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {fetchOrganizationSettingType} from '../../../Apis/OrganizationSetting-api'
import {MAIN_URL } from "../../../Configurations/Urls";

function SettingTypeList() {

  const [settingtype, setSetingType] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationSettingType(org.organization_id)
        .then((data) => {
          let a = data.settingtypes;
          console.log(a);
          let b = a.map((item) => {
            return {
              id: item.organization_setting_type_id,
              name: item.setting_type_name,
            description: item.organization.organization_name

            };
          });
          setSetingType(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

     let deleteSettingType = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/setting-type/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Setting"
      );
    }
  };


  return (
    <Layout1
      loading={loading}
      heading={"Organization Settings Types"}
      btnName={"Add Organization Setting Type"}
      Data={settingtype}
      Icons={[
        <AutorenewIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <NextWeekIcon color="primary" />,
        <AutorenewIcon sx={{ color: "text.secondary"}} />]
      }
      messages={[
        "organization settings types",
        "organization settings types",
        "Add Organization Setting type",
        "organization setting type"
      ]}
      Route={"/setting/setting-type"}
      setData={setSetingType}
      DeleteFunc={deleteSettingType}
    />

  );
}

export default SettingTypeList;
