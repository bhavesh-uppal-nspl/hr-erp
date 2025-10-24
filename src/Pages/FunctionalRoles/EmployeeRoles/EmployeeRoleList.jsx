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
    field: "functional_role",
    label: "functional_role",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "functional_role_specialization",
    label: "functional_role_specialization",
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
           
            };
          });
          setFunc(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);


  let deletedesignation = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/emp-func-role/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: function (status) {
            return status >= 200 && status < 500; // handle 4xx errors gracefully
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        console.log("Employee Functional Roles deleted:", response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Roles";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
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


  return (
    <>
      <Layout4
        loading={loading}
        heading={"Employee Functional Roles"}
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
        DeleteFunc={deletedesignation}
      />

      <TableDataGeneric
        tableName="Employee Functional Roles"
        primaryKey="employee_functional_role_id"
        heading="Employee Functional Roles"
        data={func}
        sortname={"intern_name"}
        showActions={true}
        Route="/organization/employee/functional-role"
        DeleteFunc={deletedesignation}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default EmployeeRoleList;
