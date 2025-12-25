import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { fetchEmployeeLeaves } from "../../../Apis/Employee-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import Layout2 from "../../DataLayouts/Layout2";
import dayjs from "dayjs";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

const DEFAULT_COLUMNS = [
  {
    field: "employee_name",
    label: "Employee Name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "employee_code",
    label: "Employee Code",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  
  {
    field: "approval_date",
    label: "Approval Date",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function EmployeeLeaveList() {
  const [leaves, setLeaves] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const navigate = useNavigate();

  const { id } = useParams();

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  };

  // Load table configuration from general-datagrids API
  useEffect(() => {
    const loadTableConfiguration = async () => {
      if (!org?.organization_id) {
        setLoadingConfig(false);
        return;
      }

      try {
        const configRes = await fetch(
          `${MAIN_URL}/api/general-datagrids`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (configRes.ok) {
          const configResponse = await configRes.json();
          const datagrids = configResponse.datagrids || [];
          const orgKey = `Employees Leaves_grid_${org.organization_id}`;
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

  // load employeeLeave data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);

      fetchEmployeeLeaves(org.organization_id)
        .then((data) => {
          const a = data?.employeeleaves?.data;
          console.log("a sis s", a);

          const b = a.map((item) => {
            const fullName = [
              capitalize(item.employee?.first_name || ""),
              capitalize(item.employee?.middle_name || ""),
              capitalize(item.employee?.last_name || ""),
            ]
              .filter(Boolean)
              .join(" ");

            const employeeCode = item?.employee?.employee_code || "N/A";
            const designation =
              item?.employee?.designation?.designation_name || "";

            const startDate =
              item?.leave_start_date != null
                ? dayjs(item.leave_start_date).format("DD-MM-YYYY")
                : "";

            const endDate =
              item.leave_end_date != null
                ? dayjs(item?.leave_end_date).format("DD-MM-YYYY")
                : "";

            const approval_date =
              item.approval_date != null
                ? dayjs(item?.approval_date).format("DD-MM-YYYY")
                : "";
            const rejection_date =
              item.rejection_date != null
                ? dayjs(item?.rejection_date).format("DD-MM-YYYY")
                : "";

            return {
              ...item,
              id: item.employee_leave_id,
              employee_name: `${fullName}`,
            
              employee_code: item?.employee?.employee_code,
              leave_start_date: startDate,
              leave_reason:
                item?.leave_reason?.leave_reason_name == null
                  ? ""
                  : item?.leave_reason?.leave_reason_name,
              leave_type:
                item?.leave_type?.leave_type_name == null
                  ? ""
                  : item?.leave_type?.leave_type_name,
              leave_category:
                item?.leave_category?.leave_category_name == null
                  ? ""
                  : item?.leave_category?.leave_category_name,

              leave_start_time:
                item?.leave_start_time == null ? "" : item?.leave_start_time,
              leave_end_time:
                item?.leave_end_time == null ? "" : item?.leave_end_time,
              leave_rejection_reason:
                item?.leave_rejection_reason == null
                  ? ""
                  : item?.leave_rejection_reason,
              total_leave_hours:
                item?.total_leave_hours == null ? "" : item?.total_leave_hours,
              employee_remarks:
                item?.employee_remarks == null ? "" : item?.employee_remarks,
              leave_end_date: endDate,
              rejection_date: rejection_date,
              rejected_by: item?.rejected_by
                ? [
                    item?.rejected_by?.first_name || "",
                    item?.rejected_by?.middle_name || "",
                    item?.rejected_by?.last_name || "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                : "",

              approved_by: item?.approved_by
                ? [
                    item?.approved_by?.first_name || "",
                    item?.approved_by?.middle_name || "",
                    item?.approved_by?.last_name || "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                : "",

              approval_date: approval_date,
           
            };
          });

          setLeaves(b);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            toast.error("Session Expired!");
            window.location.href = "/login";
          }
          console.error("Failed to fetch employee leaves:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [org]);

  let deleteemployeeleave = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/employee-leave/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
       if (response.status === 200) {
        toast.success(response.data.message);
        console.log("Employee Leave deleted:", response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Leave";

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
        error.response?.data?.error || "Failed to delete Employee Leave"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-leave/${id}`,
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
      navigate(`/leave/employee-leaves/edit/${item.id}`);
    },

    [navigate]
  );


   
      const handleShow = useCallback(
    (item) => {
      navigate(`/leave/employee-leaves/view/${item.id}`)
    },
    [navigate],
  )


  console.log("leaves is ", leaves);

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Employee Leave"}
        btnName={"Add Employee Leave"}
        Data={leaves}
        delete_action={"EMPLOYEE_LEAVE_DELETE"}
        add_action={"EMPLOYEE_LEAVE_ADD"}
        tableHeaders={[
          {
            name: "Employee Name",
            value_key: "fullName",
            textStyle: "capitalize",
          },
          { name: "Leave Starts", value_key: "startDate" },
          { name: "Leave Ends", value_key: "endDate" },
          {
            name: "Employee Remarks",
            value_key: "employee_remarks",
            textStyle: "capitalize",
          },
          { name: "Leave Status", value_key: "leave_status" },
        ]}
        Icons={[
          <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <FormatAlignJustifyIcon color="primary" />,
          <CategoryIcon sx={{ color: "text.secondary" }} />,
          <DateRangeIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "Employee Leaves",
          "Employee Leaves",
          "Add Employee Leaves",
          "Employee Leaves",
        ]}
        Route={"/leave/employee-leaves"}
        setData={setLeaves}
        DeleteFunc={deleteemployeeleave}
      />

      <TableDataGeneric
        tableName="Employees Leaves"
        primaryKey="employee_leave_id"
        heading="Employment Leaves"
        data={leaves}
        sortname={"leave_status"}
        showActions={true}
        //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee-leave`}
        Route="/leave/employee-leaves"
        DeleteFunc={deleteemployeeleave}
        EditFunc={handleEdit}
        edit_delete_action={["EMPLOYEE_LEAVE_DELETE", "EMPLOYEE_LEAVE_EDIT"]}
        handleShow={handleShow}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default EmployeeLeaveList;