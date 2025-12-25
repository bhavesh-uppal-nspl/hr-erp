import React, { useCallback, useEffect, useState } from "react";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEmployeeFunctionalRolesSpecial, fetchOrganizationFunctionalRoles } from "../../../Apis/FunctionalManagment";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import dayjs from "dayjs";

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
    field: "function_role",
    label: "functional_role",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "role_specialization",
    label: "role_specialization",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function EmployeeRoleList() {
  const [func, setFunc] = useState([]);
  const [loading, setLoading] = useState(true);
 const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const { userData } = useAuthStore();

 const navigate = useNavigate();

  const {id} = useParams();
  const org = userData?.organization;


 function formatDate(date) {
  if (!date) return null;

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');      // 1 → "01"
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}


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
          const orgKey = `Employee Functional Roles_grid_${org.organization_id}`;
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
      fetchEmployeeFunctionalRolesSpecial(org?.organization_id)
        .then((data) => {
          let a = data?.functional?.data;

          let filteredData = a.filter((item) => !item.unassigned_on);
          let b = filteredData.map((item) => {
            return {
              ...item,
              id: item.employee_functional_role_id,
             employee_name: item?.employee
                ? `${item.employee?.first_name || ""} ${item?.employee?.middle_name|| ""} ${item?.employee?.last_name || ""}`
                : "",
              function_role:item?.function_role?.functional_role_name,
              role_specialization:item?.role_specialization?.functional_role_specialization_name,
             is_active: item?.is_active == 1 ? "✔" : "✖",
              assigned_on: formatDate(item?.assigned_on),
           
            };
          });
          setFunc(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);


let deleteRole = async (id) => {
  try {
    const org_id = org.organization_id;
    const response = await axios.delete(
      `${MAIN_URL}/api/organizations/${org_id}/emp-func-role/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        validateStatus: function (status) {
          return status >= 200 && status < 500; // allow 4xx
        },
      }
    );

    // SUCCESS
    if (response.status === 200) {
      toast.success(response.data.message);
      console.log("Employee Functional Roles deleted:", response.data.message);
      return;
    }

    // ALL OTHER CASES (400, 404, 409…)
    const errorMessage =
      response.data?.message ||
      response.data?.error ||
      response.data?.errors?.[Object.keys(response.data.errors || {})[0]]?.[0] ||
      "Failed to delete Roles";

    toast.error(errorMessage);
    console.warn("Deletion error:", response.status, response.data);

  } catch (error) {
    // SESSION EXPIRED
    if (error.response?.status === 401) {
      toast.error("Session Expired!");
      window.location.href = "/login";
      return;
    }

    // UNEXPECTED ERRORS
    console.error("Delete failed:", error);
    toast.error("Something went wrong. Please try again later.");
  }
};


  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization/employee/functional-role/edit/${item.id}`);

    },

    [navigate]

  );


   const handleShow = useCallback(
    (item) => {
      navigate(`/organization/employee/functional-role/view/${item.id}`)
    },
    [navigate],
  )


  return (
    <>
      <Layout4
        loading={loading}
        delete_action={"EMPLOYEE_FUNCTIONAL_ROLE_DELETE"}
        heading={"Employee Functional Roles"}
        add_action={"EMPLOYEE_FUNCTIONAL_ROLE_ADD"}
        btnName={"Add Roles"}
        Data={func}
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
          "Employee Functional Roles",
          "Emloyee Functional Roles",
          "Add Employee Functional Roless",
          "Employee Functional Roles",
        ]}
        Route={"/organization/employee/functional-role"}
        setData={setFunc}
        DeleteFunc={deleteRole}
      />

      <TableDataGeneric
        tableName="Employee Functional Roles"
        primaryKey="employee_functional_role_id"
        
        heading="Employee Functional Roles"
        data={func}
        sortname={"intern_name"}
        showActions={true}
        Route="/organization/employee/functional-role"
        DeleteFunc={deleteRole}
        EditFunc={handleEdit}
        edit_delete_action={["EMPLOYEE_FUNCTIONAL_ROLE_EDIT", "EMPLOYEE_FUNCTIONAL_ROLE_DELETE"]}
        handleShow={handleShow}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default EmployeeRoleList;
