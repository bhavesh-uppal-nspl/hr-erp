import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {fetchWorkModel} from '../../../Apis/Workshift-api'
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import toast from "react-hot-toast";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useNavigate, useParams } from "react-router-dom";

function WorkModelList() {

  const [statuses, setStatuses] = useState([]);
  const [workmodel, setWorkModel]=useState([]);
  const { userData } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const org = userData?.organization;
    
 const navigate = useNavigate();

  const {id} = useParams();
  
  
    useEffect(() => {
      if (org?.organization_id) {
        setLoading(true);
        fetchWorkModel(org.organization_id)
          .then((data) => {
            let a = data.workmodel.data;
            let b = a.map(item => {
              return {
               ...item,
                  id:item.organization_work_model_id,
              
               
              };
            });
            setWorkModel(b);
          })
          .catch((err) => {});
        setLoading(false);
      }
    }, [org]);
  
    let deleteWorkModel = async (id) => {
      try {
        const org_id = org.organization_id;
        const response = await axios.delete(
          `${MAIN_URL}/api/organizations/${org_id}/work-model/${id}`,  { headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },}
        );
      } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
        console.error("Delete failed:", error);
        toast.error(
          error.response?.data?.error || "Failed to delete Work Model"
        );
      }
    };
  
  

   
    const handleEdit = useCallback(

    (item) => {

         navigate(`/organization-configration/work-model/edit/${item.id}`);

    },

    [navigate]

  );


  return (

    <>
    <Layout4
      loading={loading}
      heading={"Work Model"}
      btnName={"Add Work Model"}
      Data={workmodel}
       delete_action={"ORG_CONFIG_DELETE"}
      Icons={[
        <AutorenewIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <NextWeekIcon color="primary" />,
     
        ]
      }

        tableHeaders={[
        {name : "Work Models" , value_key : "work_model_name",textStyle: "capitalize", },
      ]}
      messages={[
        "Work Model",
        "Work Model",
        "Add Work Model",
        "Work Model"
      ]}
      Route={"/organization-configration/work-model"}
      setData={setWorkModel}
      DeleteFunc={deleteWorkModel}
    />

    
        <TableDataGeneric
          tableName="Employees"
          primaryKey="organization_work_model_id"
          heading="Work Models"
          data={workmodel}
          sortname={"work_model_name"}
          showActions={true}
          // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/work-model`}
          Route="/organization-configration/work-model"
          DeleteFunc={deleteWorkModel}
            EditFunc={handleEdit}
          token={localStorage.getItem("token")}
                      organizationUserId={userData?.organization_user_id} // Pass user ID
        showLayoutButtons={true}
        config={{
          defaultVisibleColumns: ["work_model_name"],
          mandatoryColumns: ["work_model_name"],
        }}
        />

    </>

  );
}

export default WorkModelList;
