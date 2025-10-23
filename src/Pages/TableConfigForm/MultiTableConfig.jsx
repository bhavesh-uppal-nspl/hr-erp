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
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-records-all`,
        datagridKeyProp: `Employee Records_grid_${org?.organization_id}`,
      },
  
      {
        id: "work_shifts",
        tablename: "Work Shifts",
        tableheading: "work_shifts",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift?mode=1`,
        datagridKeyProp: `Workshifts_grid_${org?.organization_id}`,
      },
  
      {
        id: "attendande_time_logs",
        tablename: "Attendance Time Logs",
        tableheading: "attendande_time_logs",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/timelogs-all?mode=1`,
        datagridKeyProp: `Attendance Time Logs_grid_${org?.organization_id}`,
      },
  
      {
        id: "employee_leaves",
        tablename: "Employee Leaves",
        tableheading: "employee-leaves",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-leave?mode=1`,
        datagridKeyProp: `Employees Leaves_grid_${org?.organization_id}`,
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
        id: "designation",
        tablename: "Designation",
        tableheading: "Designation",
        apiFieldsConfig: `${MAIN_URL}/api/organizations/${org?.organization_id}/designation?mode=1`,
        datagridKeyProp: `Designations_grid_${org?.organization_id}`,
      },
  
  
  
       
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

