import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchWorkBreaks } from "../../../Apis/Workshift-api";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";

const DEFAULT_COLUMNS = [
  {
    field: "attendance_break",
    label: "attendance_break",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "workshift",
    label: "workshift",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function WorkshiftBreakList() {

  const [loading, setLoading] = useState(true);
   const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [Break , setBreak]=useState([])
  const { userData } = useAuthStore();
  const org = userData?.organization;
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
          const orgKey = `Workshift Break_grid_${org.organization_id}`;
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
      fetchWorkBreaks(org?.organization_id)
        .then((data) => {
          let a = data?.workshiftbreak
          console.log("break", a)
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_work_shift_break_id,
              attendance_break:item?.attendance_break?.attendance_break_name,
              workshift:item?.workshift?.work_shift_name
              
            };
          });
          setBreak(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);


  let deleteBreak = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/workshifts-breaks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: function (status) {
            return status >= 200 && status < 500; 
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        console.log("Break:", response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Break";

        toast.error(errorMessage);
        console.warn("Deletion error:", response.status, response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };


  const handleEdit = useCallback(

    (item) => {

         navigate(`/organization/workshift-break/edit/${item.id}`);

    },

    [navigate]

  );



           const handleShow = useCallback(
    (item) => {
      navigate(`/organization/workshift-break/view/${item.id}`)
    },
    [navigate],
  )



  return (
    <>
    <Layout4
      loading={loading}
      heading={"Workshift Break"}
      btnName={"Add Break"}
      add_action={"WORKSHIFT_BREAK_ADD"}
      Data={Break}
      delete_action={"WORKSHIFT_BREAK_DELETE"}
      tableHeaders={[
       
        {
          name: "Attendance Break",
          value_key: "breaktype",
          textStyle: "capitalize",
        },
        {
          name: "Workshift",
          value_key: "workshift",
            textStyle: "capitalize",
        },
       
      ]}
      Icons={[
        <LocalPoliceIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <NextWeekIcon color="primary" />,
        <LocalPoliceIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "Workshift Break ",
        "Workshift Break",
        "Add Workshift Break",
        "Workshift Break, Deleting this Break will also remove all related employees",
      ]}
      Route={"/organization/workshift-break"}
      setData={setBreak}
      DeleteFunc={deleteBreak}
    />

   
        <TableDataGeneric
          tableName="Workshift Break"
          primaryKey="organization_work_shift_break_id"
          heading="Workshift Break"
          data={Break}
          sortname={"registration_number"}
          showActions={true}
         // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-breaks`}
          Route="/organization/workshift-break"
          DeleteFunc={deleteBreak}
          EditFunc={handleEdit}
          handleShow={handleShow}
          edit_delete_action={["WORKSHIFT_BREAK_DELETE", "WORKSHIFT_BREAK_EDIT"]}
          token={localStorage.getItem("token")}
          configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
        />
  
    </>
  );
}

export default WorkshiftBreakList;
