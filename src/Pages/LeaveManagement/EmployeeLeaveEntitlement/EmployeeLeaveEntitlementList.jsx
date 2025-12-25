import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { fetchEmployeeLeaveEntitlements, fetchEmployeeLeaves } from "../../../Apis/Employee-api";
import { MAIN_URL } from "../../../Configurations/Urls";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

const DEFAULT_COLUMNS = [
  {
    field: "carry_forward_days",
    label: "carry_forward_days",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "department",
    label: "department",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "leavetype",
    label: "leavetype",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

  {
    field: "location",
    label: "location",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function EmployeeLeaveEntitlementList() {
  const [leaves, setLeaves] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);
   const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const navigate = useNavigate();

  const {id} = useParams();

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
          const orgKey = `Employees Leave Entitlement_grid_${org.organization_id}`;
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
      fetchEmployeeLeaveEntitlements(org?.organization_id)
        .then((data) => {
          let a = data?.orgleaveEntitle;
          console.log("a of entile is ", a)
          let b = a.map((item) => {
            return {
              ...item,
              id:item.organization_leave_entitlement_id ,
         
              department:item?.department?.department_name ==null ? "":item?.department?.department_name,
              location:item?.location?.location_name ==null ? "":item?.location?.location_name,
              leavetype:item?.leavetype?.leave_type_name ==null ? "":item?.leavetype?.leave_type_name,
              // entitledays:item?.entitled_days ===null ? "":item.entitled_days,
              workshifttype:item?.workshifttype?.work_shift_type_name ==null ? "":item?.workshifttype?.work_shift_type_name,
              workshift:item?.workshift?.work_shift_name ==null ? "":item?.workshift?.work_shift_name,
              requires_approval:item?.requires_approval ==null ? "✖":"✔",
              is_active:item?.is_active ==null ? "✖":"✔",
              priority_level:item?.priority_level ==null ? "":item?.priority_level,
              encashment_allowed:item?.encashment_allowed ==true ? "✔":"✖"


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
        `${MAIN_URL}/api/organizations/${org_id}/employee-entitlements/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

       if (response.status === 200) {
              toast.success(response.data.message);
              console.log(" Leave Entitlment Deleted:", response.data.message);
            } else {
              const errorMessage =
                response.data.message ||
                response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
                "Failed to delete Entitlment";
      
              toast.error(errorMessage);
              console.warn("Deletion error:", response.status, response.data);
            }


    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete Employee Leave Entitlement"
      );
    }
  };


  
    const handleDelete = async (id) => {
      try {
        const response = await fetch(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-entitlements/${id}`,
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

         navigate(`/leave/employee-entitlements/edit/${item.id}`);

    },

    [navigate]

  );



   
      const handleShow = useCallback(
    (item) => {
      navigate(`/leave/employee-entitlements/view/${item.id}`)
    },
    [navigate],
  )


  


  return (
    <>
    <Layout4
      loading={loading}
      heading={"Employee Leave Entitlement"}
      btnName={"Add Employee Leave Entitlement"}
      add_action={"EMPLOYEE_ENTITLEMENT_ADD"}
      delete_action={"EMPLOYEE_ENTITLEMENT_DELETE"}
      Data={leaves}
      tableHeaders={[
        { name: "Leave Type", value_key: "leavetype" },
        {
          name: "Entitle days",
          value_key: "entitledays",
          textStyle: "capitalize",
        },
        { name: "Entitle Period", value_key: "entitlement_period" },
         {
          name: "Department Name",
          value_key: "fullname",
          textStyle: "capitalize",
        },
        { name: "Location", value_key: "location" },
      ]}
      Icons={[
        <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <FormatAlignJustifyIcon color="primary" />,
        <CategoryIcon sx={{ color: "text.secondary" }} />,
        <DateRangeIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "Employee Leave Entitlement",
        "Employee Leave Entitlement",
        "Add Employee Leaves Entitlement",
        "Employee Leaves Entitlement",
      ]}
      Route={"/leave/employee-entitlements"}
      setData={setLeaves}
      DeleteFunc={deleteemployeeleave}
    />

    
 
    
          <TableDataGeneric
            tableName="Employees Leave Entitlement"
            primaryKey="organization_leave_entitlement_id"
            heading="Employee Leave Entitlement"
            data={leaves}
              sortname={"holiday_calendar_name"}
              showActions={true}
              //  apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee-entitlements`}
            Route="/leave/employee-entitlements"
            DeleteFunc={handleDelete}
            handleShow={handleShow}
            EditFunc={handleEdit}
            edit_delete_action={["EMPLOYEE_ENTITLEMENT_DELETE", "EMPLOYEE_ENTITLEMENT_EDIT"]}
            token={localStorage.getItem("token")}
configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
          
          />
 
    </>
  );
}

export default EmployeeLeaveEntitlementList;
