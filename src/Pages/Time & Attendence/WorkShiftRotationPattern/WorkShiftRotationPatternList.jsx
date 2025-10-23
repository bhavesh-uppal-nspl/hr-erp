import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {
  fetchEmployeeShiftAssignments,
  fetchRotationPatterns,
  fetchWorkShift,
} from "../../../Apis/Workshift-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import { format, parse } from "date-fns";

import axios from "axios";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

function RotationPatternList() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchRotationPatterns(org?.organization_id)
        .then((data) => {
          let a = data?.shiftPattern?.data || [];
          console.log("a os ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_work_shift_rotation_pattern_id,
                
              carddescription: item?.description,
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
        `${MAIN_URL}/api/organizations/${org_id}/workshift-rotation-pattern/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete Work Shift");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-pattern/${id}`,
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

         navigate(`/organization/work-shift-rotation-pattern/edit/${item.id}`);

    },

    [navigate]

  );


  return (
    <>
      <Layout4
        loading={loading}
        delete_action={"SHIFT_DELETE"}
        heading={"WorkShift Rotation Pattern"}
        btnName={"Add Pattern"}
        Data={shifts}
        tableHeaders={[
          { name: "pattern Name", value_key: "pattern_name" },
          { name: "Cycle Days", value_key: "cycle_days" },
          { name: "Description", value_key: "description" },
        ]}
        Icons={[
          <FormatAlignJustifyIcon
            sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
          />,
          <FormatAlignJustifyIcon color="primary" />,
          <NextWeekIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "WorkShift Rotation Patterns",
          "WorkShifts  Rotation Patterns",
          "Add Patterns",
          "WorkShift  Rotation Pattern",
        ]}
        Route={"/organization/work-shift-rotation-pattern"}
        setData={setShifts}
        DeleteFunc={deleteworkshifts}
      />

        <TableDataGeneric
          tableName="Employees"
          primaryKey="organization_work_shift_rotation_day_id"
          heading="Employees"
          data={shifts}
          sortname={"pattern_name"}
          showActions={true}
          // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-days`}
          Route="/work-shift-rotation-pattern"
          DeleteFunc={handleDelete}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}
        />
   
    </>
  );
}

export default RotationPatternList;
