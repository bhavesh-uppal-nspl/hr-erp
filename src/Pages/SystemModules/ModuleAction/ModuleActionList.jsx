import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NumbersIcon from "@mui/icons-material/Numbers";
import BusinessIcon from "@mui/icons-material/Business";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import {fetchApplicationUserModuleAction} from '../../../Apis/ApplicationManagementApis'
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import HttpIcon from "@mui/icons-material/Http";
import toast from "react-hot-toast";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";

function ModuleActionList() {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [moduleAction, setModuleAction] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchApplicationUserModuleAction()
        .then((data) => {
          let a = data.moduleaction;
          console.log("a", a);
          let b = a.map((item) => {
            return {
              ...item,
              module_name:item.modules[0].module_name,
              id: item.application_module_action_id,
              name: item.module_action_name,
              description: item.description,
              created_at: item.created_at,
              updated_at: item.updated_at,
            };
          });
          setModuleAction(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, []);



  let deleteregistration = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/application/module-action/${id}`,
       
      );
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Module Action"
      );
    }
  };

  return (
    <Layout1
      loading={loading}
      heading={"System Module Actions"}
      btnName={"Add Module Action"}
      Data={moduleAction}
       tableHeaders={[
        {name : "Module Action Name" , value_key : "module_action_name" },
         {name : "Action Code" , value_key : "module_action_code" },
          {name : "Module Type" , value_key : "module_name" },
   
      ]}
      
      Icons={[
        <BusinessIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <NumbersIcon color="primary" />,
        <HttpIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "Module Actions",
        "Module Action",
        "Add Module Action",
        "Module Action",
      ]}
      Route={"/organization/module-action"}
      setData={setModuleAction}
      DeleteFunc={deleteregistration}
    />
  );
}

export default ModuleActionList;
