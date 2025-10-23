import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import {fetchApplicationUser} from '../../../Apis/ApplicationManagementApis'
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import toast from "react-hot-toast";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

function UserList() {

 const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    {
      setLoading(true);
      fetchApplicationUser()
        .then((data) => {
          let a = data.users;
          try {
                let b = a.map((item) => {
            return {
               id: item.application_user_id ,
               name:`${item.full_name}`,
               description:`${item.email}`
            };
          });
          setUser(b);
            
          } catch (error) {
            console.log(error)
          }
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, []);


  let deleteuser = async (id) => {
    try {
   
      const response = await axios.delete(
        `${MAIN_URL}/api/application/user/${id}`);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete User");
    }
  };

  return (
    <Layout1
      loading={loading}
      heading={"Application Users"}
      btnName={"Add Application User"}
      Data={user}
      Icons={[
        <FormatAlignJustifyIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <PersonIcon color="primary" />,
        <EmailIcon sx={{ color: "text.secondary" }} />
      ]
      }
      messages={[
        "Application User",
        "Application User",
        "Add Application User",
        "Application User"
      ]}
      Route={"/application/user"}
      setData={setUser}
      DeleteFunc={deleteuser}
    />

  );
}

export default UserList;
