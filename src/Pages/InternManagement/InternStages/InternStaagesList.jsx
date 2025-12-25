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
import { fetchInternStages } from "../../../Apis/InternManagement";

function InternStaagesList() {
  const [exit, setexit] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchInternStages(org?.organization_id)
        .then((data) => {
          let a = data?.intership?.data;
          console.log("data is   ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_internship_stage_id,

              Intern_status: item?.status?.internship_status_name || "",
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
        `${MAIN_URL}/api/organizations/${org_id}/internship-stages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Stages";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }
    } catch (error) {
      console.log("error is ", error);
      // 🔹 Handle different error responses from backend
      if (error.response) {
        const status = error.response.status;

        console.log("stataus ", status);
        const backendMessage =
          error.response.data?.message || error.response.data?.error;

        console.log("backend message ", backendMessage);

        if (status === 400 && backendMessage?.includes("already assigned")) {
          // Custom message from Laravel when type is assigned
          toast.error("This Stages is already assigned and cannot be deleted.");
        } else if (status === 401) {
          toast.error("Session Expired!");
          window.location.href = "/login";
        } else {
          toast.error(backendMessage || "Failed to delete Intership Stages");
        }

        console.error("Delete failed:", error.response);
      } else {
        // Network or other unexpected errors
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred while deleting.");
      }
    }
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const handleEdit = useCallback(
    (item) => {
      navigate(`/intern/intern-stages/edit/${item.id}`);
    },
    [navigate]
  );

  const handleShow = useCallback(
    (item) => {
      navigate(`/intern/intern-stages/view/${item.id}`);
    },
    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Intern Stages"}
        btnName={"Add Stages"}
        Data={exit}
        delete_action={"INTERN_STAGES_DELETE"}
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
        Route={"/intern/intern-stages"}
        setData={setexit}
        DeleteFunc={deleteExit}
      />

      <TableDataGeneric
        tableName="Intern Stages"
        primaryKey="organization_internship_stage_id"
        heading="Intern Stages"
        data={exit}
        sortname={"intern_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee-exit`}
        Route="/intern/intern-stages"
        DeleteFunc={deleteExit}
        EditFunc={handleEdit}
        handleShow={handleShow}
        token={localStorage.getItem("token")}
        organizationUserId={userData?.organization_user_id}
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: [
            "internship_stage_name",
            "status",
            "description",
          ],
          mandatoryColumns: ["internship_stage_name", "status", "description"],
        }}
      />
    </>
  );
}

export default InternStaagesList;
