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
// import { fetchIncrements, fetchIncrementTypes } from "../../../Apis/Salary";

// function IncrementList() {
//   const [leaves, setLeaves] = useState([]);
//   const { userData } = useAuthStore();
//   const org = userData?.organization;
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   const { id } = useParams();

//   useEffect(() => {
//     if (org?.organization_id) {
//       setLoading(true);
//       fetchIncrements(org?.organization_id)
//         .then((data) => {
//           let a = data?.incrementdata;
//           console.log("a is ", a);
//           let b = a.map((item) => {
//             return {
//               ...item,
//               id: item.employee_increment_id,
//               increment_type:item?.increment_type?.employee_increment_type_name==null ? "" :item?.increment_type?.employee_increment_type_name,
//               increment_percentage:item?.increment_percentage== null ? "" :Math.floor(item?.increment_percentage),
//               previous_ctc_amount:item?.previous_ctc_amount== null ? "" :Math.floor(item?.previous_ctc_amount),
//               new_ctc_amount:item?.new_ctc_amount== null ? "" :Math.floor(item?.new_ctc_amount),
//               increment_amount:item?.increment_amount== null ? "" :Math.floor(item?.increment_amount)
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
//         `${MAIN_URL}/api/organizations/${org_id}/increment/${id}`,
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
//         `${MAIN_URL}/api/organizations/${org?.organization_id}/increment/${id}`,
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
//       navigate(`/employee/increment/edit/${item.id}`);
//     },

//     [navigate]
//   );

//   return (
//     <>
//       <Layout4
//         loading={loading}
//         heading={"Increments"}
//         btnName={"Add Increments"}
//         Data={leaves}
//         delete_action={"LEAVE_DELETE"}
//         Icons={[
//           <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
//           <FormatAlignJustifyIcon color="primary" />,
//           <CategoryIcon sx={{ color: "text.secondary" }} />,
//           <DateRangeIcon sx={{ color: "text.secondary" }} />,
//         ]}
      
//         Route={"/employee/increment"}
//         setData={setLeaves}
//         DeleteFunc={deleteemployeeleave}
//       />

//       <TableDataGeneric
//         tableName="Increment"
//         primaryKey="employee_increment_id"
//         heading="Increment"
//         data={leaves}
//         sortname={"ncrement_percentage"}
//         showActions={true}
//         Route="/employee/increment"
//         DeleteFunc={handleDelete}
//         EditFunc={handleEdit}
//         token={localStorage.getItem("token")}
//       />
//     </>
//   );
// }

// export default IncrementList;



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
import { fetchIncrements, fetchIncrementTypes } from "../../../Apis/Salary";
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

function IncrementList() {
  const [leaves, setLeaves] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const navigate = useNavigate();

  const { id } = useParams();
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
          const orgKey = `Increment_grid_${org.organization_id}`;
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

  // load increment data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchIncrements(org?.organization_id)
        .then((data) => {
          let a = data?.incrementdata;
          console.log("a is ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.employee_increment_id,
              increment_type:
                item?.increment_type?.employee_increment_type_name == null
                  ? ""
                  : item?.increment_type?.employee_increment_type_name,
              increment_percentage:
                item?.increment_percentage == null
                  ? ""
                  : Math.floor(item?.increment_percentage),
              previous_ctc_amount:
                item?.previous_ctc_amount == null
                  ? ""
                  : Math.floor(item?.previous_ctc_amount),
              new_ctc_amount:
                item?.new_ctc_amount == null
                  ? ""
                  : Math.floor(item?.new_ctc_amount),
              increment_amount:
                item?.increment_amount == null
                  ? ""
                  : Math.floor(item?.increment_amount),
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
        `${MAIN_URL}/api/organizations/${org_id}/increment/${id}`,
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
        `${MAIN_URL}/api/organizations/${org?.organization_id}/increment/${id}`,
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
      navigate(`/employee/increment/edit/${item.id}`);
    },

    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Increments"}
        btnName={"Add Increments"}
        Data={leaves}
        delete_action={"LEAVE_DELETE"}
        Icons={[
          <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <FormatAlignJustifyIcon color="primary" />,
          <CategoryIcon sx={{ color: "text.secondary" }} />,
          <DateRangeIcon sx={{ color: "text.secondary" }} />,
        ]}
        Route={"/employee/increment"}
        setData={setLeaves}
        DeleteFunc={deleteemployeeleave}
      />

      <TableDataGeneric
        tableName="Increment"
        primaryKey="employee_increment_id"
        heading="Increment"
        data={leaves}
        sortname={"ncrement_percentage"}
        showActions={true}
        Route="/employee/increment"
        DeleteFunc={handleDelete}
        EditFunc={handleEdit}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default IncrementList;
