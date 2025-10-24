import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {fetchWorkShiftTypes} from '../../../Apis/Workshift-api'
import axios from "axios";
import toast from "react-hot-toast";
import {MAIN_URL } from "../../../Configurations/Urls";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";


function WorkShiftTypeList() {

  const [workshiftTypes,setWorkshiftTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuthStore();
  const org = userData?.organization;
   const navigate = useNavigate();

  const {id} = useParams();


  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchWorkShiftTypes(org.organization_id)
        .then((data) => {
          let a = data.workshifttype.data;
          console.log(a);
          let b = a.map((item) => {
            return {
             ...item,
                id:item.organization_work_shift_type_id,
          
             

            };
          });
          setWorkshiftTypes(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

     let deleteworkshiftTypes = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/workshift-type/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete WorkShift Type"
      );
    }
  };



  
const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/workshift-types/edit/${item.id}`);

    },

    [navigate]

  );


  return (
    <>
    <Layout4
      loading={loading}
      heading={"WorkShift Types"}
      btnName={"Add WorkShift types"}
      Data={workshiftTypes}
       delete_action={"ORG_CONFIG_DELETE"}
      tableHeaders={[
        {name : "WorkShift Type" , value_key : "work_shift_type_name" ,textStyle: "capitalize",},
          {name : "WorkShift Type Short Name" , value_key : "work_shift_type_short_name" ,textStyle: "capitalize",},
          
        
      ]}
      Icons={[
        <FormatAlignJustifyIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <FormatAlignJustifyIcon color="primary" />,
        <NextWeekIcon sx={{ color: "text.secondary" }} />]
      }
      messages={[
        "workshift Types",
        "WorkShift Types",
        "Add WorkShift types",
        "Workshift Types"
      ]}
      Route={"/organization-configration/workshift-types"}
      setData={setWorkshiftTypes}
      DeleteFunc={deleteworkshiftTypes}
    />

   
            <TableDataGeneric
              tableName="Employees"
              primaryKey="organization_work_shift_type_id"
              heading="Workshift Types"
              data={workshiftTypes}
              sortname={"work_shift_type_name"}
              showActions={true}
              // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-type`}
              Route="/organization-configration/workshift-types"
              DeleteFunc={deleteworkshiftTypes}
                EditFunc={handleEdit}
              token={localStorage.getItem("token")}
                      organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["work_shift_name","work_shift_start_name","work_shift_end_name","work_shift_type_name",],
          mandatoryColumns: ["work_shift_name","work_shift_start_name","work_shift_end_name","work_shift_type_name"],
        }}
            />
     
    </>

  );
}


export default WorkShiftTypeList;
