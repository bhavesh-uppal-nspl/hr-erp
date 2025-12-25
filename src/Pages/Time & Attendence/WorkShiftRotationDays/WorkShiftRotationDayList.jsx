import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {
  fetchEmployeeShiftAssignments,
  fetchRotationDays,
} from "../../../Apis/Workshift-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import axios from "axios";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";

const DEFAULT_COLUMNS = [
  {
    field: "day_number",
    label: "day_number",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "is_off_day",
    label: "is_off_day",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "workshift",
    label: "workshift",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "workshift_pattern",
    label: "workshift_pattern",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function WorkshiftRotationDayList() {
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
          const orgKey = `Employees Rotation Days_grid_${org.organization_id}`;
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
      fetchRotationDays(org?.organization_id)
        .then((data) => {
          console.log("data os ", data);

          let a = data?.rotationDays?.data || [];
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_work_shift_rotation_day_id,
              workshift_pattern: item?.workshift_pattern?.pattern_name,
              workshift: item?.workshift?.work_shift_name,
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
        `${MAIN_URL}/api/organizations/${org_id}/workshift-rotation-days/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
       if (response.status === 200) {
              toast.success(response.data.message);
              console.log("Workshift Rotation Days Deleted:", response.data.message);
            } else {
              const errorMessage =
                response.data.message ||
                response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
                "Failed to delete Workshift Rotation Days";
      
              toast.error(errorMessage);
              console.warn("Deletion error:", response.status, response.data);
            }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to delete work Shift rotation days"
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


  
      const handleShow = useCallback(
    (item) => {
      navigate(`/organization/work-shift-rotation-days/view/${item.id}`)
    },
    [navigate],
  )


  return (
    <>
      <Layout4
        loading={loading}
        heading={"Workshift Rotation Days"}
        btnName={"Add Days"}
        add_action={"SHIFT_ROTATION_DAYS_ADD"}
        delete_action={"SHIFT_ROTATION_DAYS_DELETE"}
        Data={shifts}
        tableHeaders={[
          {
            name: "Rotation pattern",
            value_key: "pattern",
            textStyle: "capitalize",
          },
          { name: "Workshift", value_key: "workshift" },
          { name: "No. of days", value_key: "day_number" },
          { name: "Is Off Day", value_key: "is_off_day" },
        ]}
        Icons={[
          <FormatAlignJustifyIcon
            sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
          />,
          <FormatAlignJustifyIcon color="primary" />,
          <NextWeekIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "WorkShift Rotation Days",
          "WorkShifts Rotation Days",
          "Add WorkShift Rotation Days",
          "WorkShift Rotation Days",
        ]}
        Route={"/organization/work-shift-rotation-days"}
        setData={setShifts}
        DeleteFunc={deleteworkshifts}
      />

      <TableDataGeneric
        tableName="Employees Rotation Days"
        primaryKey="organization_work_shift_rotation_day_id"
        heading="Employees Rotation Days"
        data={shifts}
        sortname={"employee_name"}
        showActions={true}
        //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-days`}
        Route="/organization/work-shift-rotation-days"
        DeleteFunc={handleDelete}
        handleShow={handleShow}
        EditFunc={handleEdit}
        edit_delete_action={["SHIFT_ROTATION_DAYS_DELETE", "SHIFT_ROTATION_DAYS_EDIT"]}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default WorkshiftRotationDayList;
