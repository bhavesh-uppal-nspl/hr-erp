"use client";

import { useCallback, useEffect, useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import {
  fetchOrganizationEmployee,
  fetchOrganizationEmployeess,
} from "../../../Apis/Employee-api";
import CakeIcon from "@mui/icons-material/Cake";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import PeopleIcon from "@mui/icons-material/People";
import { MAIN_URL } from "../../../Configurations/Urls";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";

const DEFAULT_COLUMNS = [
  {
    field: "Employee_Code",
    label: "Emp Code",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "Name",
    label: "Name",
    visible: true,
    width: 200,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "Department",
    label: "Department",
    visible: true,
    width: 180,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "Designation",
    label: "Designation",
    visible: true,
    width: 180,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
 
];

function EmployeeList({ mode }) {
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [employee, setemployee] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { id } = useParams();
  const fromDashboard = location.state?.fromDashboard || false;

  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

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
          const orgKey = `Employees_grid_${org.organization_id}`;
          const savedConfig = datagrids.find(
            (dg) => dg.datagrid_key === orgKey
          );

          if (savedConfig) {
            const serverCfg = savedConfig.datagrid_default_configuration;
            setTableConfig(serverCfg);

            // --- Only one 'Employee_name' column logic ---
            if (
              serverCfg?.columns &&
              Array.isArray(serverCfg.columns) &&
              serverCfg.columns?.length > 0
            ) {
              const normalizedColumns = serverCfg.columns
                .map((col) => {
                  const label =
                    typeof col.label === "string"
                      ? col.label.trim().toLowerCase()
                      : "";
                  if (label === "Name" || ["Name"].includes(col.field)) {
                    return {
                      ...col,
                      field: "Name",
                      label: "Name",
                    };
                  }
                  return col;
                })
                // Remove duplicate Employee_name columns
                .filter(
                  (col, idx, arr) =>
                    col.field !== "Name" ||
                    arr.findIndex((c) => c.field === "Name") === idx
                )
                // Remove any additional name-related columns
                .filter(
                  (col) =>
                    ![
                      "first_name",
                      "middle_name",
                      "last_name",
                      "Name",
                    ].includes(col.field)
                );

              // Ensure at least one Name column if not present
              const hasEmployeeName = normalizedColumns.some(
                (c) => c.field === "Name"
              );
              const finalColumns = hasEmployeeName
                ? normalizedColumns
                : [
                    {
                      field: "Name",
                      label: "Name",
                      visible: true,
                      width: 200,
                      filterable: true,
                      sortable: true,
                      pinned: "none",
                      required: false,
                    },
                    ...normalizedColumns,
                  ];
              setConfigColumns(finalColumns);
            } else {
              setConfigColumns(DEFAULT_COLUMNS);
            }
          } else {
            setConfigColumns(DEFAULT_COLUMNS);
          }
        }
      } catch (error) {
        console.error(" Error loading table configuration:", error);
        setConfigColumns(DEFAULT_COLUMNS);
      } finally {
        setLoadingConfig(false);
      }
    };

    loadTableConfiguration();
  }, [org?.organization_id]);

useEffect(() => {
  if (org?.organization_id) {
    setLoading(true);

    fetchOrganizationEmployeess(org?.organization_id)
      .then((data) => {
        const filteredEmployees = data.filter(
          (item) => item.Status !== "Exited"
        );
        setemployee(filteredEmployees);
      })
      .catch((err) => console.error("Error fetching employees:", err))
      .finally(() => setLoading(false));
  }
}, [org]);

console.log("Filtered employees: ", employee);


  const deleteemployee = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/employee/${id}`,
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
    }
  };

  const [showLayout, setLayout] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);


  const onclickRow= (row, rowIndex, currentPage,rowsPerPage, onEmployeeClick)=>{

    const employeeId =
      row?.employee_id || row?.id || row?.employeeId || row?.emp_code;
  
    if (typeof onEmployeeClick === "function") {
      onEmployeeClick(row);
    } else {
      // Use query parameters instead of state
      navigate(
        `/organization/employee/employee-details/employee-profile?id=${employeeId}&page=${currentPage}&index=${rowIndex}&pageSize=${rowsPerPage}`
      );
    }
  }

  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/employee/${id}`,
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

      console.log("Successfully deleted employee with id:", id);
      return Promise.resolve();
    } catch (error) {
      console.error("Delete failed:", error);
      return Promise.reject(error);
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/employee/employee-details/edit/${item.id}`);
    },
    [navigate]
  );

  const carddata = [
    {
      key: "Name",
      type: "String",
    },
    {
      key: "designation",
      type: "String",
    },
    {
      key: "profile_image_url",
      type: "photo",
    },
  ];

  return (
    <>
      <Layout4
        loading={loading}
        heading={
          <div style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
            Employees
          </div>
        }
        btnName={"Add Employee"}
        onAddBtClick={() => null}
        onEditBtClick={() => null}
        Data={employee}
        Icons={[
          {
            key: "exitToAppIcon",
            element: (
              <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />
            ),
          },
          {
            key: "viewHeadlineIcon",
            element: <ViewHeadlineIcon color="primary" />,
          },
          { key: "cakeIcon", element: <CakeIcon sx={{ color: "red" }} /> },
          {
            key: "peopleIcon",
            element: <PeopleIcon sx={{ color: "primary" }} />,
          },
        ]}
        messages={[
          "Employee details",
          "Employee details",
          "Add Employee",
          "Employee, Deleting This Employee will delete its Entire data from Employees Record of this Organization Permanently",
        ]}
        Route={"/organization/employee/employee-details"}
        setData={setemployee}
        DeleteFunc={deleteemployee}
      />
      {!loadingConfig && (
        <>
          {fromDashboard ? (
            <TableDataGeneric
              tableName="Employees"
              primaryKey="employee_id"
              heading="Employees"
              data={employee}
              sortname={"name"}
              showActions={false}
              CardData={carddata}
              Route="/organization/employee/employee-details"
              DeleteFunc={handleDelete}
              EditFunc={handleEdit}
              token={localStorage.getItem("token")}
              configss={configColumns}
              onclickRow={onclickRow}
              linkType={"Name"}
              {...(tableConfig && { config: tableConfig })}
            />
          ) : (
            <TableDataGeneric
              tableName="Employees"
              primaryKey="employee_id"
              heading="Employees"
              data={employee}
              sortname={"name"}
              showActions={true}
              CardData={carddata}
              Route="/organization/employee/employee-details"
              DeleteFunc={handleDelete}
              EditFunc={handleEdit}
                onclickRow={onclickRow}
              token={localStorage.getItem("token")}
              linkType={"name"}
              configss={configColumns}
              {...(tableConfig && { config: tableConfig })}
            />
          )}
        </>
      )}
    </>
  );
}

export default EmployeeList;
