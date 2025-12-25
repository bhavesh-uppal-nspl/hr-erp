// "use client";
// import { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Paper,
//   Typography,
//   CircularProgress
// } from "@mui/material";
// import useAuthStore from "../../Zustand/Store/useAuthStore";
// import TableConfigForm from "./TableConfigForm";
// import { MAIN_URL } from "../../Configurations/Urls";

// export default function MultiTableConfig() {
//   const { userData } = useAuthStore();
//   const org = userData?.organization;

//   const tables = useMemo(() => [
//     {
//       id: "employees",
//       tablename: "Employees",
//       tableheading: "employee-list",
//       apiFieldsConfig:    `${MAIN_URL}/api/organization/${org?.organization_id}/employee-all`,
//       datagridKeyProp: `employee_grid_${org?.organization_id}`,
//     },
//     {
//       id: "departments",
//       tablename: "Departments",
//       tableheading: "Departments",
//       apiFieldsConfig:  `${MAIN_URL}/api/organizations/${org?.organization_id}/department-all`,
//       datagridKeyProp: `department_grid_${org?.organization_id}`,
//     },
//     {
//       id: "designation",
//       tablename: "Designation",
//       tableheading: "Designation",
//       apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/designation-all`,
//       datagridKeyProp: `designation_grid_${org?.organization_id}`,
//     },
//     //  {
//     //   id: "employee_leaves",
//     //   tablename: "Employee Leaves",
//     //   tableheading: "employee-leaves",
//     //   apiFieldsConfig: "https://api.erp.nsplprojects.com/api/organizations/5/employee-leaves-all",
//     //   datagridKeyProp: `employee_leave_grid_${org?.organization_id}`,
//     // },
//     // Add more tables as needed
//   ], [org?.organization_id]);

//   const [activeTableId, setActiveTableId] = useState("");
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [autoColumns, setAutoColumns] = useState([]);

//   // Set initial active table
//   useEffect(() => {
//     if (tables?.length > 0 && !activeTableId) {
//       setActiveTableId(tables[0].id);
//     }
//   }, [tables, activeTableId]);

//   // Get current active table object
//   const activeTable = useMemo(() => {
//     return tables.find(t => t.id === activeTableId);
//   }, [tables, activeTableId]);

//   // Fetch data when active table changes
//   useEffect(() => {
//     if (!activeTable?.apiFieldsConfig) return;

//     setLoading(true);
//     setData([]);
   
//     fetch(activeTable.apiFieldsConfig)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((result) => {
//         // Handle different response formats
//         const dataArray = result.data || result.rows || result || [];
//         setData(Array.isArray(dataArray) ? dataArray : []);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Fetch error:", error);
//         setData([]);
//         setLoading(false);
//       });
//   }, [activeTable]);

 
//   // Handle dropdown change
//   const handleTableChange = (event) => {
//     setActiveTableId(event.target.value);
//   };

//   return (
//     <Box>
//         <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
//           <InputLabel id="table-select-label">Select Table</InputLabel>
//           <Select
//             labelId="table-select-label"
//             id="table-select"
//             value={activeTableId}
//             label="Select Table"
//             onChange={handleTableChange}
//           >
//             {tables.map((table) => (
//               <MenuItem key={table.id} value={table.id}>
//                 {table.tablename}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {loading && (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
//             <CircularProgress />
//             <Typography sx={{ ml: 2 }}>Loading {activeTable?.tablename}...</Typography>
//           </Box>
//         )}
       
//         {!loading && activeTable && (
//           <TableConfigForm
//             tablename={activeTable.tablename}
//             tableheading={activeTable.tableheading}
//             apiFieldsConfig={activeTable.apiFieldsConfig}
//             datagridKeyProp={activeTable.datagridKeyProp}
//             data={data}
//             autoColumns={autoColumns}
//           />
//         )}
//     </Box>
//   );
// }



"use client";
import { useEffect, useMemo, useState } from "react";

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  CircularProgress
} from "@mui/material";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import TableConfigForm from "./TableConfigForm";
import { MAIN_URL } from "../../Configurations/Urls";
import axios from "axios";

export default function MultiTableConfig() {
  const { userData } = useAuthStore();
  const org = userData?.organization;

  // const tables = useMemo(() => [

  //   {
  //     id: "employees",
  //     tablename: "Employees",
  //     tableheading: "employee-list",
  //     apiFieldsConfig:    `${MAIN_URL}/api/organizations/${org?.organization_id}/employee?mode=2`,
  //     datagridKeyProp: `employee_grid_${org?.organization_id}`,
  //   },

  //   {
  //     id: "employee_exit",
  //     tablename: "Employee Exit",
  //     tableheading: "employee_exit",
  //     apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-exit?mode=1`,
  //     datagridKeyProp: `employee_exit_grid_${org?.organization_id}`,
  //   },
   
  //   {
  //     id: "employment_records",
  //     tablename: "Employment Records",
  //     tableheading: "employment_records",
  //     apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-records-all`,
  //     datagridKeyProp: `employment_records_grid_${org?.organization_id}`,
  //   },

  //   {
  //     id: "work_shifts",
  //     tablename: "Work Shifts",
  //     tableheading: "work_shifts",
  //     apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift?mode=1`,
  //     datagridKeyProp: `work_shifts_grid_${org?.organization_id}`,
  //   },

  //   {
  //     id: "attendande_time_logs",
  //     tablename: "Attendance Time Logs",
  //     tableheading: "attendande_time_logs",
  //     apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/timelogs-all`,
  //     datagridKeyProp: `attendande_time_logs_grid_${org?.organization_id}`,
  //   },

  //   {
  //     id: "employee_leaves",
  //     tablename: "Employee Leaves",
  //     tableheading: "employee-leaves",
  //     apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-leave?mode=1`,
  //     datagridKeyProp: `employee_leave_grid_${org?.organization_id}`,
  //   },


  //   {
  //     id: "increment_types",
  //     tablename: "Increment Types",
  //     tableheading: "increment_types",
  //     apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/increment-type?mode=1`,
  //     datagridKeyProp: `increment_types_grid_${org?.organization_id}`,
  //   },

  //   {
  //     id: "increments",
  //     tablename: "Increments",
  //     tableheading: "increments",
  //     apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/increment?mode=1`,
  //     datagridKeyProp: `increments_grid_${org?.organization_id}`,
  //   },
   
  //   {
  //     id: "departments",
  //     tablename: "Departments",
  //     tableheading: "Departments",
  //     apiFieldsConfig:`${MAIN_URL}/api/organizations/${org?.organization_id}/department?mode=1`,
  //     datagridKeyProp: `department_grid_${org?.organization_id}`,
  //   },

  //   {
  //     id: "designation",
  //     tablename: "Designation",
  //     tableheading: "Designation",
  //     apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/designation?mode=1`,
  //     datagridKeyProp: `designation_grid_${org?.organization_id}`,
  //   },



     
  //   // Add more tables as needed
  // ], [org?.organization_id]);

    const tables = useMemo(() => [
  
      {
        id: "employees",
        tablename: "Employees",
        tableheading: "employee-list",
        apiFieldsConfig:    `${MAIN_URL}/api/organizations/${org?.organization_id}/employee?mode=2`,
        datagridKeyProp: `Employees_grid_${org?.organization_id}`,
      },
  
      {
        id: "employee_exit",
        tablename: "Employee Exit",
        tableheading: "employee_exit",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-exit?mode=1`,
        datagridKeyProp: `Employee Exit_grid_${org?.organization_id}`,
      },
     
      {
        id: "employment_records",
        tablename: "Employment Records",
        tableheading: "employment_records",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-records?mode=1`,
        datagridKeyProp: `Employee Records_grid_${org?.organization_id}`,
      },
  
      {
        id: "employee_functional_role",
        tablename: "Employee Functional Roles",
        tableheading: "employee_functional_role",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/emp-func-role?mode=1`,
        datagridKeyProp: `Employee Functional Roles_grid_${org?.organization_id}`,
      },
  
      {
        id: "employment_stages",
        tablename: "Employment Stages",
        tableheading: "employment_stages",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employment-stages?mode=1`,
        datagridKeyProp: `Employment Stages_grid_${org?.organization_id}`,
      },
  
      {
        id: "employee_document_types",
        tablename: "Document Types",
        tableheading: "employee_document_types",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employemnt-document-type?mode=1`,
        datagridKeyProp: `Document Types_grid_${org?.organization_id}`,
      },
  
      {
        id: "documents",
        tablename: "Employee Documents",
        tableheading: "documents",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employemnt-document?mode=1`,
        datagridKeyProp: `Employee Documents_grid_${org?.organization_id}`,
      },
  
      {
        id: "work_shifts",
        tablename: "Work Shifts",
        tableheading: "work_shifts",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift?mode=1`,
        datagridKeyProp: `Workshifts_grid_${org?.organization_id}`,
      },
  
      {
        id: "employee_shift_assignments",
        tablename: "Employee WorkShift Assignments",
        tableheading: "employee_shift_assignments",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-assignment?mode=1`,
        datagridKeyProp: `Employee WorkShift Assignments_grid_${org?.organization_id}`,
      },
  
      {
        id: "employee_shift_rotation_pattern",
        tablename: "Employees Shift Rotation Pattern",
        tableheading: "employee_shift_rotation_pattern",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-pattern?mode=1`,
        datagridKeyProp: `Employees Shift Rotation Pattern_grid_${org?.organization_id}`,
      },
  
      {
        id: "employee_shift_rotation_days",
        tablename: "Employees Rotation Days",
        tableheading: "employee_shift_rotation_days",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-days?mode=1`,
        datagridKeyProp: `Employees Rotation Days_grid_${org?.organization_id}`,
      },
  
      {
        id: "employee_shift_rotation_assignments",
        tablename: "Employees Rotation Assignments",
        tableheading: "employee_shift_rotation_assignments",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-assignment?mode=1`,
        datagridKeyProp: `Employees Rotation Assignments_grid_${org?.organization_id}`,
      },
  
      {
        id: "attendande_time_logs",
        tablename: "Attendance Time Logs",
        tableheading: "attendande_time_logs",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-time-logs?mode=1`,
        datagridKeyProp: `Attendance Time Logs_grid_${org?.organization_id}`,
      },
  
      {
        id: "holiday_calender",
        tablename: "Holiday Calendar",
        tableheading: "holiday_calender",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/holiday-calendar?mode=1`,
        datagridKeyProp: `Holiday Calendar_grid_${org?.organization_id}`,
      },
  
      {
        id: "employee_leaves",
        tablename: "Employee Leaves",
        tableheading: "employee-leaves",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-leave?mode=1`,
        datagridKeyProp: `Employees Leaves_grid_${org?.organization_id}`,
      },
  
      {
        id: "employee_entitlements",
        tablename: "Employees Leave Entitlement",
        tableheading: "employee_entitlements",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-entitlements?mode=1`,
        datagridKeyProp: `Employees Leave Entitlement_grid_${org?.organization_id}`,
      },
  
      {
        id: "leave_summary",
        tablename: "Leave Summary Report",
        tableheading: "leave_summary",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-monthlyleave-summary?mode=1`,
        datagridKeyProp: `Leave Summary Report_grid_${org?.organization_id}`,
      },
  
      {
        id: "leave_balance_report",
        tablename: "Leave Balance Report",
        tableheading: "leave_balance_report",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/leave-balances/taken?mode=1`,
        datagridKeyProp: `Leave Balance Report_grid_${org?.organization_id}`,
      },
  
  
      {
        id: "increment_types",
        tablename: "Increment Types",
        tableheading: "increment_types",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/increment-type?mode=1`,
        datagridKeyProp: `Increment Types_grid_${org?.organization_id}`,
      },
  
      {
        id: "increments",
        tablename: "Increments",
        tableheading: "increments",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/increment?mode=1`,
        datagridKeyProp: `Increment_grid_${org?.organization_id}`,
      },
     
      {
        id: "departments",
        tablename: "Departments",
        tableheading: "Departments",
        apiFieldsConfig:`${MAIN_URL}/api/organizations/${org?.organization_id}/department?mode=1`,
        datagridKeyProp: `Departments_grid_${org?.organization_id}`,
      },
  
      {
        id: "locations",
        tablename: "Locations",
        tableheading: "locations",
        apiFieldsConfig:`${MAIN_URL}/api/organizations/${org?.organization_id}/location?mode=1`,
        datagridKeyProp: `Locations_grid_${org?.organization_id}`,
      },
  
      {
        id: "organization_units",
        tablename: "Organization Units",
        tableheading: "organization_units",
        apiFieldsConfig:`${MAIN_URL}/api/organizations/${org?.organization_id}/units?mode=1`,
        datagridKeyProp: `Organization Units_grid_${org?.organization_id}`,
      },
  
      {
        id: "designation",
        tablename: "Designation",
        tableheading: "Designation",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/designation?mode=1`,
        datagridKeyProp: `Designations_grid_${org?.organization_id}`,
      },
  
      {
        id: "registration",
        tablename: "Registrations",
        tableheading: "registration",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/business-registration?mode=1`,
        datagridKeyProp: `Registrations_grid_${org?.organization_id}`,
      },
  
      {
        id: "attendance_status_types",
        tablename: "Attendance Status Type",
        tableheading: "attendance_status_types",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-status-type?mode=1`,
        datagridKeyProp: `Attendance Status Type_grid_${org?.organization_id}`,
      },
  
      // {
      //   id: "attendance_deviation_reasons",
      //   tablename: "Atendance Deviation Reason",
      //   tableheading: "attendance_deviation_reasons",
      //   apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/designation?mode=1`,
      //   datagridKeyProp: `Atendance Deviation Reason_grid_${org?.organization_id}`,
      // },
  
      {
        id: "attendance_break_types",
        tablename: "Attendance Break Types",
        tableheading: "attendance_break_types",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-break-type?mode=1`,
        datagridKeyProp: `Attendance Break Types_grid_${org?.organization_id}`,
      },
  
      {
        id: "attendance_sources",
        tablename: "Attendance Source",
        tableheading: "attendance_sources",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-source?mode=1`,
        datagridKeyProp: `Attendance Source_grid_${org?.organization_id}`,
      },
  
      {
        id: "attendance_breaks",
        tablename: "Attendance Break",
        tableheading: "attendance_breaks",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-breaks?mode=1`,
        datagridKeyProp: `Attendance Break_grid_${org?.organization_id}`,
      },
  
      // {
      //   id: "workshift_breaks",
      //   tablename: "Workshift Break",
      //   tableheading: "workshift_breaks",
      //   apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/designation?mode=1`,
      //   datagridKeyProp: `Workshift Break_grid_${org?.organization_id}`,
      // },
  
      {
        id: "leave_policies",
        tablename: "Organization Leave Policy",
        tableheading: "leave_policies",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/leave-palicy?mode=1`,
        datagridKeyProp: `Organization Leave Policy_grid_${org?.organization_id}`,
      },
  
      {
        id: "organization_functional_roles",
        tablename: "Organization Functional Roles",
        tableheading: "organization_functional_roles",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/func-role?mode=1`,
        datagridKeyProp: `Organization Functional Roles_grid_${org?.organization_id}`,
      },
  
      {
        id: "functional_role_specialization",
        tablename: "Functional Role Specialization",
        tableheading: "functional_role_specialization",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/func-role-spec?mode=1`,
        datagridKeyProp: `Functional Role Specialization_grid_${org?.organization_id}`,
      },

      {
        id: "internship_types",
        tablename: "Internship Types",
        tableheading: "internship_types",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/internship-type?mode=1`,
        datagridKeyProp: `Internship Types_grid_${org?.organization_id}`,
      },
  
      {
        id: "internship_status",
        tablename: "Internship Status",
        tableheading: "internship_status",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/internship-status?mode=1`,
        datagridKeyProp: `Internship Status_grid_${org?.organization_id}`,
      },
  
      {
        id: "interns",
        tablename: "Interns",
        tableheading: "interns",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/interns?mode=1`,
        datagridKeyProp: `Interns_grid_${org?.organization_id}`,
      },
  
      {
        id: "intern_exit",
        tablename: "Intern Exit",
        tableheading: "intern_exit",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-exit?mode=1`,
        datagridKeyProp: `Intern Exit_grid_${org?.organization_id}`,
      },
  
      {
        id: "intern_leaves",
        tablename: "Intern Leaves",
        tableheading: "intern_leaves",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-leaves?mode=1`,
        datagridKeyProp: `Intern Leaves_grid_${org?.organization_id}`,
      },
  
      {
        id: "intern_document_types",
        tablename: "Intern Document Types",
        tableheading: "intern_document_types",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-document-type?mode=1`,
        datagridKeyProp: `Intern Document Types_grid_${org?.organization_id}`,
      },
  
      {
        id: "intern_stipend",
        tablename: "Intern Stipend",
        tableheading: "intern_stipend",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-stipend?mode=1`,
        datagridKeyProp: `Intern Stipend_grid_${org?.organization_id}`,
      },
  
      {
        id: "intern_time_logs",
        tablename: "Intern Time Logs",
        tableheading: "intern_time_logs",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-time-logs?mode=1`,
        datagridKeyProp: `Intern Time Logs_grid_${org?.organization_id}`,
      },

      {
        id: "intern_certificate",
        tablename: "Intern Certificate",
        tableheading: "intern_certificate",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-certificate?mode=1`,
        datagridKeyProp: `Intern Certificate_grid_${org?.organization_id}`,
      },

      // {
      //   id: "internship_status",
      //   tablename: "Internship Status",
      //   tableheading: "internship_status",
      //   apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/internship-status?mode=1`,
      //   datagridKeyProp: `Internship Status_grid_${org?.organization_id}`,
      // },
  
      {
        id: "user_role",
        tablename: "User Roles",
        tableheading: "user_role",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/userrole?mode=1`,
        datagridKeyProp: `User Roles_grid_${org?.organization_id}`,
      },
  
      // {
      //   id: "settings",
      //   tablename: "Settings",
      //   tableheading: "settings",
      //   apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/designation?mode=1`,
      //   datagridKeyProp: `Settings_grid_${org?.organization_id}`,
      // },
  
  
  
  
  
  
       
      // Add more tables as needed
    ], [org?.organization_id]);

  



  const [activeTableId, setActiveTableId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoColumns, setAutoColumns] = useState([]);

  // Set initial active table
  useEffect(() => {
    if (tables?.length > 0 && !activeTableId) {
      setActiveTableId(tables[0].id);
    }
  }, [tables, activeTableId]);

  // Get current active table object
  const activeTable = useMemo(() => {
    return tables.find(t => t.id === activeTableId);
  }, [tables, activeTableId]);

  // Fetch data when active table changes
  // useEffect(() => {
  //   if (!activeTable?.apiFieldsConfig) return;

  //   setLoading(true);
  //   setData([]);
   
  //   fetch(activeTable.apiFieldsConfig)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((result) => {
  //       // Handle different response formats
  //       const dataArray = result.data || result.rows || result || [];
  //       setData(Array.isArray(dataArray) ? dataArray : []);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Fetch error:", error);
  //       setData([]);
  //       setLoading(false);
  //     });
  // }, [activeTable]);

  useEffect(() => {
  if (!activeTable?.apiFieldsConfig) return;

  setLoading(true);
  setData([]);

  const token = localStorage.getItem("token");

  axios
    .get(activeTable.apiFieldsConfig, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const result = response.data;
      // Handle different possible structures
      const dataArray = result.data || result.rows || result || [];
      setData(Array.isArray(dataArray) ? dataArray : []);
    })
    .catch((error) => {
      console.error("Axios error:", error);
      setData([]);
    })
    .finally(() => {
      setLoading(false);
    });
}, [activeTable]);

 
  // Handle dropdown change
  const handleTableChange = (event) => {
    setActiveTableId(event.target.value);
  };

  return (
    <Box>
        <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
          <InputLabel id="table-datagrid-label">Select DataGrid</InputLabel>
          <Select
            labelId="table-datagrid-label"
            id="table-datagrid"
            value={activeTableId}
            label="Select DataGrid"
            onChange={handleTableChange}
          >
            {tables.map((table) => (
              <MenuItem key={table.id} value={table.id}>
                {table.tablename}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading {activeTable?.tablename}...</Typography>
          </Box>
        )}
       
        {!loading && activeTable && (
          <TableConfigForm
            tablename={activeTable.tablename}
            tableheading={activeTable.tableheading}
            apiFieldsConfig={activeTable.apiFieldsConfig}
            datagridKeyProp={activeTable.datagridKeyProp}
            data={data}
            autoColumns={autoColumns}
          />
        )}
    </Box>
  );
}

