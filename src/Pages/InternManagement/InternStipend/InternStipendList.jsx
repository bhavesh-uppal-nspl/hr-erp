import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchEmployeeExit } from "../../../Apis/Employee-api";
import { Info } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";
import {
  fetchInternExit,
  fetchInternStipends,
} from "../../../Apis/InternManagement";

function InternStipendList() {
  const [exit, setexit] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchInternStipends(org?.organization_id)
        .then((data) => {
          let a = data?.intership?.data;
          console.log("data is   ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.intern_stipend_id,
              intern_name:
                `${capitalize(item.intern?.first_name)} ${capitalize(item?.intern.middle_name || "")} ${capitalize(item?.intern.last_name || "")}
             `.trim(),
              employee_code: item?.intern?.intern_code,
              is_active: item?.is_active == 1 ? "✔" : "✖",
            };
          });
          setexit(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteExit = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/intern-stipend/${id}`,
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
      toast.error(
        error.response?.data?.error ||
          "Failed to delete Intern Stipend Details "
      );
    }
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/intern/intern-stipend/edit/${item.id}`);
    },
    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Intern Stipend"}
        btnName={"Add Record"}
        Data={exit}
        tableHeaders={[
          { name: "Code", value_key: "employee_code", width: "50px" },
          { name: "Name", value_key: "name", width: "150px" },

          {
            name: "NoticePeriod Starts",
            value_key: "notice_period_start",
            width: "170px",
          },

          {
            name: "NoticePeriod Ends",
            value_key: "notice_period_end",
            width: "170px",
          },
          {
            name: "Resignation Date",
            value_key: "resignation_date",
            width: "150px",
          },
          {
            name: "Relieving Date",
            value_key: "relieving_date",
            width: "150px",
          },
          {
            name: "Interview",
            value_key: "exit_interview_done",
            width: "50px",
          },
        ]}
        Icons={[
          <AutorenewIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <NextWeekIcon color="primary" />,
          <AlarmAddIcon sx={{ color: "text.secondary" }} />,
          <LogoutIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Intern exit details",
          "Intern exit details",
          "Add Intern Exit Details",
          "Intern Exit Deatils",
        ]}
        Route={"/organization/intern/intern-stipend"}
        setData={setexit}
        DeleteFunc={deleteExit}
      />

      <TableDataGeneric
        tableName="Intern Stipend"
        primaryKey="intern_stipend_id"
        heading="Intern Stipend"
        data={exit}
        sortname={"intern_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee-exit`}
        Route="/organization/intern/intern-stipend"
        DeleteFunc={deleteExit}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}

        
                organizationUserId={userData?.organization_user_id} 
          showLayoutButtons={true}
          config={{
            defaultVisibleColumns: [
            "internship_status_name",
            
         
          ],
          mandatoryColumns: [
            "internship_status_name",
           
           
          ],
        }}
      />
    </>
  );
}

export default InternStipendList;
