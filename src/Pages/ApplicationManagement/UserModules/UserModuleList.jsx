import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {fetchApplicationUserModules} from '../../../Apis/ApplicationManagementApis'
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import toast from "react-hot-toast";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DescriptionIcon from '@mui/icons-material/Description';
function UserModuleList() {

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    {
      setLoading(true);
      fetchApplicationUserModules()
        .then((data) => {
          let a = data.modules;
          try {
                let b = a.map((item) => {
            return {
               id: item.application_module_id,
               name:item.module_name,
               description:`${item.description}`,
            };
          });
          setModules(b);
            
          } catch (error) {
            console.log(error)
          }
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, []);


  let deletemodule = async (id) => {
    try {
   
      const response = await axios.delete(
        `${MAIN_URL}/api/application/module/${id}`);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete User Roles");
    }
  };

  return (
    <Layout1
      loading={loading}
      heading={"Application User Modules"}
      btnName={"Add Application User Modules"}
      Data={modules}
      Icons={[
        <AutorenewIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <ViewModuleIcon color="primary" />,
        <DescriptionIcon sx={{ color: "text.secondary" }} />]
      }
      messages={[
        "Application User Modules",
        "Application User Modules",
        "Add Application User Modules",
        "Application User Modules"
      ]}
      Route={"/application/user-modules"}
      setData={setModules}
      DeleteFunc={deletemodule}
    />

  );
}

export default UserModuleList;
