import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchWorkBreaks } from "../../../Apis/Workshift-api";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

function WorkshiftBreakList() {

  const [loading, setLoading] = useState(true);
  const [Break , setBreak]=useState([])
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const navigate = useNavigate();

  const {id} = useParams();



  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchWorkBreaks(org?.organization_id)
        .then((data) => {
          let a = data?.workshiftbreak
          console.log("break", a)
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_work_shift_break_id,
              attendance_break:item?.attendance_break?.attendance_break_name,
              workshift:item?.workshift?.work_shift_name
              
            };
          });
          setBreak(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);


  let deleteBreak = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/workshifts-breaks/${id}`,
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

         navigate(`/organization/workshift-break/edit/${item.id}`);

    },

    [navigate]

  );


  return (
    <>
    <Layout4
      loading={loading}
      heading={"Workshift Break"}
      btnName={"Add Break"}
      Data={Break}
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
      Route={"/organization/workshift-break"}
      setData={setBreak}
      DeleteFunc={deleteBreak}
    />

   
        <TableDataGeneric
          tableName="Workshift Break"
          primaryKey="organization_work_shift_break_id"
          heading="Workshift Break"
          data={Break}
          sortname={"registration_number"}
          showActions={true}
         // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-breaks`}
          Route="/organization/workshift-break"
          DeleteFunc={deleteBreak}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}
        />
  
    </>
  );
}

export default WorkshiftBreakList;
