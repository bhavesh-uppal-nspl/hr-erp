// import React, { useCallback, useEffect, useState } from "react";
// import Layout1 from "../../DataLayouts/Layout1";
// import NextWeekIcon from "@mui/icons-material/NextWeek";
// import BusinessIcon from "@mui/icons-material/Business";
// import SegmentIcon from "@mui/icons-material/Segment";
// import PersonIcon from "@mui/icons-material/Person";
// import StoreIcon from "@mui/icons-material/Store";
// import { fetchOrganizationDepartment } from "../../../Apis/Department-api";
// import useAuthStore from "../../../Zustand/Store/useAuthStore";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { MAIN_URL } from "../../../Configurations/Urls";
// import usePermissionDataStore from "../../../Zustand/Store/usePermissionDataStore";
// import NotAllowed from "../../../Exceptions/NotAllowed";
// import TableDataGeneric from "../../../Configurations/TableDataGeneric";
// import { useNavigate, useParams } from "react-router-dom";
// import Layout4 from "../../DataLayouts/Layout4";


// function OrganizationDepartmentsList() {
//   const { userData } = useAuthStore();
//   const { Permission, setPermission } = usePermissionDataStore();
//   const org = userData?.organization;
//   const [loading, setLoading] = useState(true);
//   const [departments, setDepartments] = useState([]);
//    const navigate = useNavigate();

//   const {id} = useParams();

//   useEffect(() => {
//     if (org?.organization_id) {
//       setLoading(true);
//       fetchOrganizationDepartment(org.organization_id)
//         .then((data) => {
//           let a = data?.Departments;
//           let b = a.map((item) => {
//             return {
//               ...item,
//               id: item.organization_department_id,
            
//               description:item?.description==null ? "" :item?.description,
//               department_mail:item?.department_mail_id==null ? "" :item?.department_mail_id,
//               department_short_name:item?.department_short_name==null ? "" :item?.department_short_name,
//               department_employees_count:item?.department_employees_count==null ? "" :item?.department_employees_count
//             };
//           });
//           setDepartments(b);
//         })
//         .catch((err) => {});
//       setLoading(false);
//     }
//   }, [org]);

//   console.log("departmenrts", departments);

//   const deletedepartment = async (id) => {

//     try {
//       const org_id = org.organization_id;
//       const response = await axios.delete(
//         `${MAIN_URL}/api/organizations/${org_id}/department/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       if (response.data?.error || response.data?.errors) {
//         toast.error(response.data.message || "Failed to delete department.");
//         return;
//       }

//       if (response.status === 200) {
//         toast.success(
//           response.data.message || "Department deleted successfully."
//         );
//       }
//     } catch (error) {
//       console.error("Delete failed:", error);

//       const status = error.response?.status;
//       const message = error.response?.data?.message;
//       const errors = error.response?.data?.errors;
//       const fallback = "Failed to delete department. Please try again later.";

//       if (status === 409) {
//         toast.error(
//           message || "This department is in use and cannot be deleted."
//         );
//       } else if (status === 422) {
//         toast.error("Validation failed.");
//         if (errors) {
//           console.table(errors);
//         }
//       } else if (status === 401) {
//         toast.error("Unauthorized.");
//       } else {
//         toast.error(message || fallback);
//       }
//     }
//   };

//   const handleEdit = useCallback(

//     (item) => {

//          navigate(`/organization/departments/edit/${item.id}`);

//     },

//     [navigate]

//   );

//   return (
//     <>
//       <Layout4
//         loading={loading}
//         heading={"Departments"}
//         btnName={"Add  Departments"}
//         Data={departments}
//         delete_action={"ORG_STRUCTURE_DELETE"}
//         tableHeaders={[
//           {
//             name: "Department",
//             value_key: "department_name",
//             width: "25%",
//             textStyle: "capitalize",
//           },
//           { name: "Email", value_key: "department_mail_id", width: "25%" },
//           {
//             name: "Short Name",
//             value_key: "department_short_name",
//             width: "10%",
//             textStyle: "capitalize",
//           },
//           { name: "Description", value_key: "description", width: "20%" },
//         ]}
//         Icons={[
//           <StoreIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
//           <StoreIcon color="primary" />,
//           <PersonIcon sx={{ color: "text.secondary" }} />,
//         ]}
//         messages={[
//           "departments",
//           "organisation departments",
//           "Add Departments",
//           "department, Deleting this department will also remove all related designations and employees",
//         ]}
//         Route={"/organization/departments"}
//         setData={setDepartments}
//         DeleteFunc={deletedepartment}
//       />

     
//         <TableDataGeneric
//           tableName="Departments"
//           primaryKey="organization_department_id"
//           heading="Departments"
//           data={departments}
//           sortname={"department_name"}
//           showActions={true}
//           // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/department`}
//           Route="/organization/departments"
//           DeleteFunc={deletedepartment}
//           EditFunc={handleEdit}
//           token={localStorage.getItem("token")}
//         />
  

//     </>
  


  
//   );
// }

// export default OrganizationDepartmentsList;




"use client";

import React, { useCallback, useEffect, useState } from "react";
import Layout4 from "../../DataLayouts/Layout4";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import { fetchOrganizationDepartment } from "../../../Apis/Department-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import usePermissionDataStore from "../../../Zustand/Store/usePermissionDataStore";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";

const DEFAULT_COLUMNS = [
  {
    field: "department_name",
    label: "Department",
    visible: true,
    width: 180,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "department_mail_id",
    label: "Email",
    visible: true,
    width: 220,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "department_short_name",
    label: "Short Name",
    visible: true,
    width: 120,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "description",
    label: "Description",
    visible: true,
    width: 250,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "department_employees_count",
    label: "Employees Count",
    visible: true,
    width: 120,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function OrganizationDepartmentsList() {
  const { userData } = useAuthStore();
  const { Permission, setPermission } = usePermissionDataStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  // Load departments data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchOrganizationDepartment(org.organization_id)
        .then((data) => {
          let a = data?.Departments || [];
          let b = a.map((item) => ({
            ...item,
            id: item.organization_department_id,
            department_name: item.department_name || "",
            department_mail_id: item.department_mail_id || "",
            department_short_name: item.department_short_name || "",
            description: item.description || "",
            department_employees_count: item.department_employees_count || 0,
          }));
          setDepartments(b);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [org]);

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
          const orgKey = `Departments_grid_${org.organization_id}`;
          const savedConfig = datagrids.find((dg) => dg.datagrid_key === orgKey);

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

  const deletedepartment = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/department/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.error || response.data?.errors) {
        toast.error(response.data.message || "Failed to delete department.");
        return;
      }
      if (response.status === 200) {
        toast.success(response.data.message || "Department deleted successfully.");
        setDepartments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(
          error.response.data.message || "This department is in use and cannot be deleted."
        );
      } else if (error.response?.status === 422) {
        toast.error("Validation failed.");
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized.");
      } else {
        toast.error("Failed to delete department. Please try again later.");
      }
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/departments/edit/${item.id}`);
    },
    [navigate]
  );

  return (
    <>
      <Layout4
        loading={loading}
        heading={"Departments"}
        btnName={"Add Departments"}
        Data={departments}
        delete_action={"ORG_STRUCTURE_DELETE"}
        Icons={[
          <StoreIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <StoreIcon color="primary" />,
          <PersonIcon sx={{ color: "text.secondary" }} />,
        ]}
        messages={[
          "departments",
          "organisation departments",
          "Add Departments",
          "department, Deleting this department will also remove all related designations and employees",
        ]}
        Route={"/organization/departments"}
        setData={setDepartments}
        DeleteFunc={deletedepartment}
      />

      {!loadingConfig && (
        <TableDataGeneric
          tableName="Departments"
          primaryKey="organization_department_id"
          heading="Departments"
          data={departments}
          sortname={"department_name"}
          showActions={true}
          Route="/organization/departments"
          DeleteFunc={deletedepartment}
          EditFunc={handleEdit}
          token={localStorage.getItem("token")}
          configss={configColumns}
          {...(tableConfig && { config: tableConfig })}
        />
      )}
    </>
  );
}

export default OrganizationDepartmentsList;
