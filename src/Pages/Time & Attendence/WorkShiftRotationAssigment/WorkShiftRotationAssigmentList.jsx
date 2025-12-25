import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchWorkshiftRotationAssignment } from "../../../Apis/Workshift-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";

import axios from "axios";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";

const DEFAULT_COLUMNS = [
  {
    field: "employee_name",
    label: "employee_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "anchor_day_number",
    label: "anchor_day_number",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "effective_start_date",
    label: "effective_start_date",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "effective_end_date",
    label: "effective_end_date",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function WorkshiftRotationAssignmentList() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const { userData } = useAuthStore();
  const org = userData?.organization;

  const navigate = useNavigate();

  const { id } = useParams();

  // Load table configuration from general-datagrids API
  useEffect(() => {
    const loadTableConfiguration = async () => {
      if (!org?.organization_id) {
        setLoadingConfig(false);
        return;
      }

      try {
        const configRes = await fetch(`${MAIN_URL}/api/general-datagrids`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (configRes.ok) {
          const configResponse = await configRes.json();
          const datagrids = configResponse.datagrids || [];
          const orgKey = `Employees Rotation Assignments_grid_${org.organization_id}`;
          const savedConfig = datagrids.find(
            (dg) => dg.datagrid_key === orgKey
          );

          if (savedConfig) {
            const serverCfg = savedConfig.datagrid_default_configuration;
            setTableConfig(serverCfg);

            if (
              serverCfg?.columns &&
              Array.isArray(serverCfg.columns) &&
              serverCfg.columns?.length > 0
            ) {
              setConfigColumns(serverCfg.columns);
            } else {
              setConfigColumns(DEFAULT_COLUMNS);
            }
          } else {
            setConfigColumns(DEFAULT_COLUMNS);
          }
        }
      } catch (error) {
        console.error("Error loading table configuration:", error);
        setConfigColumns(DEFAULT_COLUMNS);
      } finally {
        setLoadingConfig(false);
      }
    };

    loadTableConfiguration();
  }, [org?.organization_id]);

  // load data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchWorkshiftRotationAssignment(org?.organization_id)
        .then((data) => {
          let a = data?.data || [];
          let b = a.map((item) => {
            return {
              ...item,
              id: item.employee_work_shift_rotation_assignment_id,
              employee_code: item?.employee?.employee_code,
              employee_name: item?.employee
                ? `${item.employee?.first_name}  ${item.employee?.middle_name || ""} ${item?.employee.last_name || ""}`
                : "",
              effective_start_date: item?.effective_end_date,
              effective_end_date: item?.effective_end_date,
              remarks: item?.remarks,
              rotation_pattern: item?.rotation_pattern?.pattern_name,
              is_active: item?.is_active == 1 ? "✔" : "✖",
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
        `${MAIN_URL}/api/organizations/${org_id}/workshift-rotation-assignment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
       if (response.status === 200) {
              toast.success(response.data.message);
              console.log("Workshift Rotation Assignment Deleted:", response.data.message);
            } else {
              const errorMessage =
                response.data.message ||
                response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
                "Failed to delete Workshift Rotation Assignment";
      
              toast.error(errorMessage);
              console.warn("Deletion error:", response.status, response.data);
            }
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
        `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-assignment/${id}`,
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
      navigate(`/organization/work-shift-rotation-assignment/edit/${item.id}`);
    },

    [navigate]
  );


   
      const handleShow = useCallback(
    (item) => {
      navigate(`/organization/work-shift-rotation-assignment/view/${item.id}`)
    },
    [navigate],
  )


  return (
    <>
      <Layout4
        loading={loading}
        heading={"WorkShift Rotation Assignments"}
        btnName={"Add WorkShift"}
        delete_action={"SHIFT_ROTATION_ASSIGNMENT_DELETE"}
        Data={shifts}
        add_action={"SHIFT_ROTATION_ASSIGNMENT_ADD"}
        tableHeaders={[
          {
            name: "Employee Name",
            value_key: "fullname",
            textStyle: "capitalize",
          },
          { name: "Workshift Pattern", value_key: "pattern" },
          { name: "Start date", value_key: "start_date" },
          { name: "End date", value_key: "end_date" },
          { name: "Anchor Day No.", value_key: "anchor_day_number" },
          { name: "Remarks", value_key: "remarks", textStyle: "capitalize" },
        ]}
        Icons={[
          <FormatAlignJustifyIcon
            sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
          />,
          <FormatAlignJustifyIcon color="primary" />,
          <NextWeekIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "WorkShift Rotation Assignments",
          "WorkShifts Rotation Assignments",
          "Add Rotation",
          "WorkShift Rotation Assignments",
        ]}
        Route={"/organization/work-shift-rotation-assignment"}
        setData={setShifts}
        DeleteFunc={deleteworkshifts}
      />

      <TableDataGeneric
        tableName="Employees Rotation Assignments"
        primaryKey="employee_work_shift_rotation_assignment_id"
        heading="Employees Rotation Assignments"
        data={shifts}
        sortname={"employee_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-assignment`}
        Route="/organization/work-shift-rotation-assignment"
        DeleteFunc={handleDelete}
        handleShow={handleShow}
        EditFunc={handleEdit}
        edit_delete_action={["SHIFT_ROTATION_ASSIGNMENT_DELETE", "SHIFT_ROTATION_ASSIGNMENT_EDIT"]}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default WorkshiftRotationAssignmentList;
