import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import {fetchApplicationUserErrorLogs} from '../../../Apis/ApplicationManagementApis'
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import toast from "react-hot-toast";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DescriptionIcon from '@mui/icons-material/Description';
import Layout2 from "../../DataLayouts/Layout2";
import CodeIcon from '@mui/icons-material/Code';

function ApplicationErrorLogList() {

 const [errorlogs, setErrorlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    {
      setLoading(true);
      fetchApplicationUserErrorLogs()
        .then((data) => {
          let a = data.errorlogs;
          try {
                let b = a.map((item) => {
            return {
               id: item.error_log_id ,
               name:`${item.module_name}`,
               description:`${item.error_type}`,
               info:`${item.severity}`,
            };
          });
          setErrorlogs(b);
            
          } catch (error) {
            console.log(error)
          }
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, []);


  let deleterror = async (id) => {
    try {
   
      const response = await axios.delete(
        `${MAIN_URL}/api/application/error-logs/${id}`);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete Error Logs");
    }
  };

  return (
    <Layout2
      loading={loading}
      heading={"Error Logs"}
      btnName={"Add Application Error Logs"}
      Data={errorlogs}
      Icons={[
        <FormatAlignJustifyIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <ViewModuleIcon color="primary" />,
        <CodeIcon sx={{ color: "text.secondary" }} />,
        <DescriptionIcon sx={{ color: "text.secondary" }} />
      ]
      }
      messages={[
        "Error Logs",
        "Error Logs",
        "Add Application Error Logs",
        "Module Action"
      ]}
      Route={"/application/user-errorlogs"}
      setData={setErrorlogs}
      DeleteFunc={deleterror}
    />

  );
}

export default ApplicationErrorLogList;
