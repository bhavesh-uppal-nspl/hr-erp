import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import BusinessIcon from "@mui/icons-material/Business";
import SegmentIcon from "@mui/icons-material/Segment";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import {fetchApplicationUserModules} from '../../../Apis/ApplicationManagementApis'
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";

function SystemModulesList() {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
  const [systemmodule, setSystemModule] = useState([]);

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchApplicationUserModules()
        .then((data) => {
          let a = data.modules.data;
          console.log("a", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.application_module_id,
              name: item.module_name,
              description: item.description,
            
            };
          });
          setSystemModule(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  console.log("modules",systemmodule);

  let deletesystemmodule = async (id) => {
    try {
      console.log("id", id);
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/application/module/${id}`,
      );
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete System Module"
      );
    }
  };

  return (
    <>
      <Layout1
        loading={loading}
        heading={"System Modules"}
        btnName={"Add System Modules"}
        Data={systemmodule}
        tableHeaders={[
        {name : "Module Name" , value_key : "module_name" },
         {name : "Description" , value_key : "description" },
        
   
      ]}
        Icons={[
          <StoreIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <StoreIcon color="primary" />,
          <PersonIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "System Modules",
          "System Modules",
          "Add System module",
          "System Modules",
        ]}
        Route={"/organization/system-modules"}
        setData={setSystemModule}
        DeleteFunc={deletesystemmodule}
      />
    </>
  );
}

export default SystemModulesList;
