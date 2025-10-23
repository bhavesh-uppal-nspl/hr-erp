// import React, { useCallback, useEffect, useState } from "react";
// import Layout1 from "../../DataLayouts/Layout1";
// import NextWeekIcon from "@mui/icons-material/NextWeek";
// import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
// import { fetchEmployeeLeaves } from "../../../Apis/Employee-api";
// import { MAIN_URL } from "../../../Configurations/Urls";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import PersonIcon from "@mui/icons-material/Person";
// import CategoryIcon from "@mui/icons-material/Category";
// import useAuthStore from "../../../Zustand/Store/useAuthStore";
// import toast from "react-hot-toast";
// import axios from "axios";
// import Layout2 from "../../DataLayouts/Layout2";
// import dayjs from "dayjs";
// import TableDataGeneric from "../../../Configurations/TableDataGeneric";
// import { useNavigate, useParams } from "react-router-dom";
// import Layout4 from "../../DataLayouts/Layout4";
// import { fetchLeavepolicy } from "../../../Apis/Leave-api";
// import { fetchIncrementTypes } from "../../../Apis/Salary";

// function SalaryIncrementTypesList() {
//   const [leaves, setLeaves] = useState([]);
//   const { userData } = useAuthStore();
//   const org = userData?.organization;
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   const { id } = useParams();

//   useEffect(() => {
//     if (org?.organization_id) {
//       setLoading(true);
//       fetchIncrementTypes(org?.organization_id)
//         .then((data) => {
//           let a = data?.increments;
//           console.log("a is ", a);
//           let b = a.map((item) => {
//             return {
//               ...item,
//               id: item.organization_employee_increment_type_id,
//               is_active: item?.is_active == null ? "✖" : "✔",
//                 employee_code:item?.employee?.employee_code,
//                employee_name: item?.employee
//                 ? `${item.employee.first_name || ""}  ${item.employee.middle_name || ""} ${item.employee.last_name || ""}`
//                 : "",
//             };
//           });
//           setLeaves(b);
//         })
//         .catch((err) => {});
//       setLoading(false);
//     }
//   }, [org]);

//   let deleteemployeeleave = async (id) => {
//     try {
//       const org_id = org.organization_id;
//       const response = await axios.delete(
//         `${MAIN_URL}/api/organizations/${org_id}/leave-policy/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         toast.error("Session Expired!");
//         window.location.href = "/login";
//       }
//       console.error("Delete failed:", error);
//       toast.error(
//         error.response?.data?.error || "Failed to delete Employee Leave"
//       );
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(
//         `${MAIN_URL}/api/organizations/${org?.organization_id}/increment-type/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       toast.success("Successfully deleted Leave policy with id:", id);
//       return Promise.resolve();
//     } catch (error) {
//       console.error("Delete failed:", error);
//       return Promise.reject(error);
//     }
//   };

//   const handleEdit = useCallback(
//     (item) => {
//       navigate(`/employee/increment-types/edit/${item.id}`);
//     },

//     [navigate]
//   );

//   return (
//     <>
//       <Layout4
//         loading={loading}
//         heading={"Increment Types"}
//         btnName={"Add Types"}
//         Data={leaves}
//         delete_action={"LEAVE_DELETE"}
//         Icons={[
//           <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
//           <FormatAlignJustifyIcon color="primary" />,
//           <CategoryIcon sx={{ color: "text.secondary" }} />,
//           <DateRangeIcon sx={{ color: "text.secondary" }} />,
//         ]}
//         // messages={[
//         //   "Leave Policy",
//         //   "Leaves Policy",
//         //   "Add Leave Policy",
//         //   "Leaves",
//         // ]}
//         Route={"/employee/increment-types"}
//         setData={setLeaves}
//         DeleteFunc={deleteemployeeleave}
//       />

//       <TableDataGeneric
//         tableName="Increment Types"
//         primaryKey="organization_employee_increment_type_id"
//         heading="Increment Types"
//         data={leaves}
//         sortname={"employee_increment_type_name"}
//         showActions={true}
//         Route="/employee/increment-types"
//         DeleteFunc={handleDelete}
//         EditFunc={handleEdit}
//         token={localStorage.getItem("token")}
//       />
//     </>
//   );
// }

// export default SalaryIncrementTypesList;



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
import { fetchLeavepolicy } from "../../../Apis/Leave-api";
import { fetchIncrementTypes } from "../../../Apis/Salary";


const DEFAULT_COLUMNS = [
  {
    field: "",
    label: "",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "",
    label: "",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "",
    label: "",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "",
    label: "",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function SalaryIncrementTypesList() {
  const [leaves, setLeaves] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
   const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

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
          const orgKey = `Increment Types_grid_${org.organization_id}`;
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

  // load incrementTypes data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchIncrementTypes(org?.organization_id)
        .then((data) => {
          let a = data?.increments;
          console.log("a is ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_employee_increment_type_id,
              is_active: item?.is_active == null ? "✖" : "✔️",
            };
          });
          setLeaves(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deleteemployeeleave = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/leave-policy/${id}`,
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
      toast.error(
        error.response?.data?.error || "Failed to delete Employee Leave"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/increment-type/${id}`,
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
      toast.success("Successfully deleted Leave policy with id:", id);
      return Promise.resolve();
    } catch (error) {
      console.error("Delete failed:", error);
      return Promise.reject(error);
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/employee/increment-types/edit/${item.id}`);
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Increment Types"}
        btnName={"Add Types"}
        Data={leaves}
        delete_action={"LEAVE_DELETE"}
        Icons={[
          <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <FormatAlignJustifyIcon color="primary" />,
          <CategoryIcon sx={{ color: "text.secondary" }} />,
          <DateRangeIcon sx={{ color: "text.secondary" }} />,
        ]}
        // messages={[
        //   "Leave Policy",
        //   "Leaves Policy",
        //   "Add Leave Policy",
        //   "Leaves",
        // ]}
        Route={"/employee/increment-types"}
        setData={setLeaves}
        DeleteFunc={deleteemployeeleave}
      />

      <TableDataGeneric
        tableName="Increment Types"
        primaryKey="organization_employee_increment_type_id"
        heading="Increment Types"
        data={leaves}
        sortname={"employee_increment_type_name"}
        showActions={true}
        Route="/employee/increment-types"
        DeleteFunc={handleDelete}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default SalaryIncrementTypesList;