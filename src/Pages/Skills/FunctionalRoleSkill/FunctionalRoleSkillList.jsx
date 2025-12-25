import React, { useCallback, useEffect, useState } from "react";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { MAIN_URL } from "../../../Configurations/Urls";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";
import { fetchFuncRoleSkills } from "../../../Apis/Skills";
const DEFAULT_COLUMNS = [
  {
    field: "functional_role_name",
    label: "functional_role_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "functional_role_specialization_name",
    label: "functional_role_specialization_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "total_skills",
    label: "total_skills",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "mandatory_skills",
    label: "mandatory_skills",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "skills",
    label: "skills",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
];

function FunctionalRoleSkillList() {
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
      fetchFuncRoleSkills(org?.organization_id)
        .then((data) => {
          let a = data?.data;
          console.log("a is ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_functional_role_skill_id,
              // these are the skills which i want to show  on tooltip also when i put cursor the skills  
              // of the specific role  these skills  
               skills: item.skills?.map(s => s.skill_name).join(", ") || ""
            };
          });
          setLeaves(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);



  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/func-role-skill/${id}`,
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
      toast.success("Successfully deleted Increment");
      return Promise.resolve();
    } catch (error) {
      console.error("Delete failed:", error);
      return Promise.reject(error);
    }
  };

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/func-role-skill/edit/${item.id}`);
    },

    [navigate]
  );



       const handleShow = useCallback(
      (item) => {
        navigate(`/organization/func-role-skill/view/${item.id}`)
      },
      [navigate],
    )



  return (
    <>
      <Layout4
        loading={loading}
        heading={"Functional Role Skills"}
        btnName={"Add Skills"}
        add_action={"FUNCTIONAL_ROLE_SKILL_ADD"}
        Data={leaves}
        delete_action={"FUNCTIONAL_ROLE_SKILL_DELETE"}
        Icons={[
          <PersonIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
          <FormatAlignJustifyIcon color="primary" />,
          <CategoryIcon sx={{ color: "text.secondary" }} />,
          <DateRangeIcon sx={{ color: "text.secondary" }} />,
        ]}
        Route={"/organization/func-role-skill"}
        setData={setLeaves}
        DeleteFunc={handleDelete}
      />

      <TableDataGeneric
        tableName="Functional Role Skills"
        primaryKey="organization_functional_role_skill_id"
        heading="Role Skills"
        data={leaves}
        sortname={"proficiency_level_required"}
        showActions={true}
        Route="/organization/func-role-skill"
        DeleteFunc={handleDelete}
        EditFunc={handleEdit}
        handleShow={handleShow}
        edit_delete_action={["FUNCTIONAL_ROLE_SKILL_DELETE", "FUNCTIONAL_ROLE_SKILL_EDIT"]}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default FunctionalRoleSkillList;
