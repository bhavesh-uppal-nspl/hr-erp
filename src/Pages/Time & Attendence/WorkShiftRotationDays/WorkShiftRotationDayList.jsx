import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {fetchEmployeeShiftAssignments, fetchRotationDays} from '../../../Apis/Workshift-api'
import { MAIN_URL } from "../../../Configurations/Urls";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import axios from "axios";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";

function WorkshiftRotationDayList() {

  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

   const navigate = useNavigate();

  const {id} = useParams();



  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchRotationDays(org?.organization_id)
        .then((data) => {

            console.log("data os ", data)

          let a = data?.rotationDays?.data || [];
          let b = a.map((item) => {
            return {
              ...item,
              id: item.	organization_work_shift_rotation_day_id ,
              workshift_pattern:item?.workshift_pattern?.pattern_name,
              workshift:item?.workshift?.work_shift_name,
              is_off_day: item?.is_off_day == 1 ? "✔" : "✖",
            };
          });
          setShifts(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

     let deleteworkshifts = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/workshift-rotation-days/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete work Shift rotation days"
      );
    }
  };




  
    const handleDelete = async (id) => {
      try {
        const response = await fetch(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-days/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Successfully deleted units-types with id:", id);
        return Promise.resolve();
      } catch (error) {
        console.error("Delete failed:", error);
        return Promise.reject(error);
      }
    };


    const handleEdit = useCallback(

    (item) => {

         navigate(`/organization/work-shift-rotation-days/edit/${item.id}`);

    },

    [navigate]

  );

  


  return (
    <>
    <Layout4
      loading={loading}
      heading={"Workshift Rotation Days"}
      btnName={"Add Days"}
       delete_action={"SHIFT_DELETE"}
      Data={shifts}
         tableHeaders={[
        {name : "Rotation pattern" , value_key : "pattern"  ,  textStyle: "capitalize",},
          {name : "Workshift" , value_key : "workshift" },
          {name : "No. of days" , value_key : "day_number" },
            {name : "Is Off Day" , value_key : "is_off_day"},
          
      ]}
      Icons={[
        <FormatAlignJustifyIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <FormatAlignJustifyIcon color="primary" />,
        <NextWeekIcon sx={{ color: "text.secondary" }} />]
      }
      messages={[
        "WorkShift Rotation Days",
        "WorkShifts Rotation Days",
        "Add WorkShift Rotation Days",
        "WorkShift Rotation Days"
      ]}
      Route={"/organization/work-shift-rotation-days"}
      setData={setShifts}
      DeleteFunc={deleteworkshifts}
    />
    
        
              <TableDataGeneric
                tableName="Shift Rotation Days"
                primaryKey="organization_work_shift_rotation_day_id"
                heading="Workshift Rotation Days"
                data={shifts}
                  sortname={"employee_name"}
                  showActions={true}
                  //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-days`}
                Route="/organization/work-shift-rotation-days"
                DeleteFunc={handleDelete}
                EditFunc={handleEdit}
                token={localStorage.getItem("token")}
              
              />
      
    </>

  );
}

export default WorkshiftRotationDayList;
