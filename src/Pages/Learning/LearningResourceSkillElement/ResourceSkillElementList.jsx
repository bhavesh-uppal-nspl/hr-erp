import React, { useEffect, useState } from "react";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import toast from "react-hot-toast";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import { useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Layout4 from "../../DataLayouts/Layout4";
import { fetchProviderTypes, fetchResourceSkillElement } from "../../../Apis/Learning";


const DEFAULT_COLUMNS = [
  {
    field: "resource_name",
    label: "resource_name",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "skill_element",
    label: "skill_element",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },

];

function ResourceSkillElementList() {
  const [exit, setexit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableConfig, setTableConfig] = useState(null);
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const { userData } = useAuthStore();
  const org = userData?.organization;

  // Load table configuration from general-datagrids API
  useEffect(() => {
    const loadTableConfiguration = async () => {
      if (!org?.organization_id) {
        setLoadingConfig(false);
        return;
      }

      try {
        const configRes = await fetch(`${MAIN_URL}/api/general-datagrids`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (configRes.ok) {
          const configResponse = await configRes.json();
          const datagrids = configResponse.datagrids || [];
          const orgKey = `Employment Stages_grid_${org.organization_id}`;
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

  // load employeeLeave data
  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchResourceSkillElement(org?.organization_id)
        .then((data) => {
          let a = data?.learning?.data;
          console.log("data is   ", a);
          let b = a.map((item) => {
            return {
              ...item,
              id: item.organization_learning_resource_skill_element_id ,
              resource_name:item?.resources?.resource_title,
              skill_element:item?.skill_element?.skill_element_name,

            };
          });
          setexit(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

let deleteSkillElement = async (id) => {
  try {
    const org_id = org.organization_id;

    const response = await axios.delete(
      `${MAIN_URL}/api/organizations/${org_id}/learning-skill-element/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // SUCCESS CASE (200)
    toast.success(response.data.message || "Learning Resource Slill Element deleted successfully");
  } catch (error) {
    console.error("Delete failed:", error);

    // -------------------------
    // 🔥 HANDLE ALL ERROR CASES
    // -------------------------
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // SESSION EXPIRED
      if (status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
        return;
      }

      // CUSTOM BACKEND MESSAGE: Already Assigned (400)
      if (status === 400 && data.message?.includes("already assigned")) {
        toast.error("This Skill Element is already assigned and cannot be deleted.");
        return;
      }

      // VALIDATION ERROR (422)
      if (status === 422) {
        let firstError =
          data.errors?.[Object.keys(data.errors)[0]]?.[0] ||
          "Validation failed.";
        toast.error(firstError);
        return;
      }

      // FOREIGN KEY CONSTRAINT (409)
      if (status === 409) {
        toast.error(data.error || "This Skill Element is linked to other records.");
        return;
      }

      // GENERAL ERROR
      toast.error(data.message || data.error || "Failed to delete Skill Element");
      return;
    }

    // NETWORK ERROR
    toast.error("Network error! Please try again.");
  }
};

  const navigate = useNavigate();
  const { id } = useParams();
  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/learning-skill-element/edit/${item.id}`);
    },
    [navigate]
  );

  const handleShow = useCallback(
    (item) => {
      navigate(`/organization/learning-skill-element/view/${item.id}`)
    },
    [navigate],
  )

  return (
    <>
      <Layout4
        loading={loading}
        delete_action={"LEARNING_SKILL_ELEMENT_DELETE"}
        add_action={"LEARNING_SKILL_ELEMENT_ADD"}
        heading={"Learning Skill Element"}
        btnName={"Add Skill"}
        Data={exit}
        messages={[
          "Learning Resource Skill Element",
          "Learning Resource Skill Element",
          "Add Learning Resource Skill Element",
          "Learning Resource Skill Element",
        ]}
        Route={"/organization/learning-skill-element"}
        setData={setexit}
        DeleteFunc={deleteSkillElement}
      />

      <TableDataGeneric
        tableName="Learning Resource Skill Element"
        primaryKey="organization_learning_resource_skill_element_id"
        heading="Learning Resource Skill Element"
        data={exit}
        sortname={"provider_type_name"}
        showActions={true}
        // apiUrl={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee-exit`}
        Route="/organization/learning-skill-element"
        DeleteFunc={deleteSkillElement}
        edit_delete_action={["LEARNING_SKILL_ELEMENT_DELETE", "LEARNING_SKILL_ELEMENT_EDIT"]}
        EditFunc={handleEdit}
        handleShow={handleShow}
        token={localStorage.getItem("token")}
        configss={configColumns}
        {...(tableConfig && { config: tableConfig })}
      />
    </>
  );
}

export default ResourceSkillElementList;
