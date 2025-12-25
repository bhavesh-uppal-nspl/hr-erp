import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {
  fetchEmployeeShiftAssignments,
  fetchWorkShift,
} from "../../../Apis/Workshift-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import { format, parse } from "date-fns";

import axios from "axios";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

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
    field: "employee_code",
    label: "employee_code",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "assignment_date",
    label: "assignment_date",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "is_override",
    label: "is_override",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function WorkshiftAssignmentList() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const { userData } = useAuthStore();
  const org = userData?.organization;

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
          const orgKey = `Employee WorkShift Assignments_grid_${org.organization_id}`;
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
      fetchEmployeeShiftAssignments(org?.organization_id)
        .then((data) => {
          let a = data[0]?.data;
          let b = a.map((item) => {
            return {
              ...item,
              id: item.employee_work_shift_assignment_id,
              employee_code: item?.employee?.employee_code,
              employee_name: item?.employee
                ? `${item.employee.first_name}  ${item.employee.middle_name || ""} ${item.employee.last_name || ""}`
                : "",
              assignment_date: item?.assignment_date,
              remarks: item?.remarks || "",
              workshift: item?.workshift?.work_shift_name,
              is_override: item?.is_override == null ? "✔" : "✖",
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
        `${MAIN_URL}/api/organizations/${org_id}/workshift-assignment/${id}`,
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

  console.log("shifts", shifts);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-assignment/${id}`,
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

  const navigate = useNavigate();
  const { id } = useParams();

  // Add handleEdit function using useCallback
  const handleEdit = useCallback(
    (item) => {
      // Adjust the route and key as needed for your app
      navigate(`/organization/work-shift-assignment/edit/${item.id}`);
    },
    [navigate]
  );


      const handleShow = useCallback(
    (item) => {
      navigate(`/organization/work-shift-assignment/view/${item.id}`)
    },
    [navigate],
  )






  return (
    <>
      <Layout4
        loading={loading}
        heading={"Employee WorkShift Assignments"}
        btnName={"Add WorkShift"}
        delete_action={"SHIFT_ASSIGNMENT_DELETE"}
        add_action={"SHIFT_ASSIGNMENT_ADD"}
        Data={shifts}
        tableHeaders={[
          {
            name: "Employee Name",
            value_key: "fullname",
            textStyle: "capitalize",
          },
          {
            name: "Workshift",
            value_key: "workshift",
            textStyle: "capitalize",
          },
          {
            name: "Assign date",
            value_key: "assignment_date",
            textStyle: "capitalize",
          },
          { name: "Is override", value_key: "is_override" },
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
          "WorkShift Assignments",
          "WorkShifts Assignments",
          "Add WorkShift",
          "WorkShift Assignments",
        ]}
        Route={"/organization/work-shift-assignment"}
        setData={setShifts}
        DeleteFunc={deleteworkshifts}
      />

      <TableDataGeneric
        tableName="Employee WorkShift Assignments"
        primaryKey="employee_work_shift_assignment_id"
        heading="Employee WorkShift Assignments"
        data={shifts}
        sortname={"employee_name"}
        showActions={true}
        //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-assignment`}
        Route="/organization/work-shift"
        DeleteFunc={handleDelete}
        EditFunc={handleEdit}
        handleShow={handleShow}
        edit_delete_action={["SHIFT_ASSIGNMENT_DELETE", "SHIFT_ASSIGNMENT_EDIT"]}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default WorkshiftAssignmentList;
