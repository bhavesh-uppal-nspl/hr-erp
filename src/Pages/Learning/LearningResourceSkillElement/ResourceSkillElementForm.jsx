import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  Autocomplete,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchResources } from "../../../Apis/Learning";
import { fetchSkillElement } from "../../../Apis/Skills";

function ResourceSkillElementForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_learning_resource_id: "",
    organization_skill_element_id: "",
    created_by: "user",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [resource, setResource] = useState([]);
  const [element, setElement] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchResources(org?.organization_id)
        .then((data) => {
          setResource(data?.learning?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      fetchSkillElement(org?.organization_id)
        .then((data) => {
          setElement(data?.skill?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    const getdataById = async () => {
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/learning-skill-element/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const a = response?.data?.learning;
        setFormData(a);
      } catch (error) {
        console.error("Error fetching learning Skill Element  data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (org?.organization_id && id && (mode === "edit" || mode === "view")) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.organization_learning_resource_id) {
      errors.organization_learning_resource_id =
        "Learning Resource is  required.";
    }
    if (!formData.organization_skill_element_id) {
      errors.organization_skill_element_id = "Skill Element is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  console.log("formdata is iosksn ", formData);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        // Call edit API
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/learning-skill-element/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/learning-skill-element`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      toast.success(
        mode === "edit"
          ? "Learning Skill Element Updated!"
          : "Learning Skill Element Created!"
      );
      setFormErrors({});
      navigate(-1);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        setFormErrors(validationErrors);
        const errorMessages = Object.values(validationErrors)
          .map((arr) => arr[0])
          .join(" ");
        toast.error(errorMessages || "Validation failed.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setbtnLoading(false);
    }
  };

  console.log("mode is ", mode);

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Learning Resource Skill Elements"}
        addMessage={"Learning Resource Skill Elements"}
        homeLink={"/organization/learning-skill-element"}
        homeText={"Learning Resource Skill Elements"}
      />
      {loading ? (
        <Grid container spacing={2}>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        <Paper elevation={4} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Autocomplete
              fullWidth
              options={resource || []}
              disabled={mode === "view" || resource?.length === 0}
              getOptionLabel={(option) => option.resource_title || ""}
              value={
                resource?.find(
                  (item) =>
                    item.organization_learning_resource_id ===
                    formData.organization_learning_resource_id
                ) || null
              }
              onChange={(event, newValue) => {
                handleChange({
                  target: {
                    name: "organization_learning_resource_id",
                    value: newValue
                      ? newValue.organization_learning_resource_id
                      : "",
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Learning Resource"
                  error={!!formErrors.organization_learning_resource_id}
                  helperText={formErrors.organization_learning_resource_id}
                  required
                />
              )}
            />

            <Autocomplete
              fullWidth
              options={element || []}
              disabled={mode === "view" || element?.length === 0}
              getOptionLabel={(option) => option.skill_element_name || ""}
              value={
                element?.find(
                  (item) =>
                    item.organization_skill_element_id ===
                    formData.organization_skill_element_id
                ) || null
              }
              onChange={(event, newValue) => {
                handleChange({
                  target: {
                    name: "organization_skill_element_id",
                    value: newValue
                      ? newValue.organization_skill_element_id
                      : "",
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Resource Skill Element"
                  error={!!formErrors.organization_skill_element_id}
                  helperText={formErrors.organization_skill_element_id}
                  required
                />
              )}
            />
          </Grid>

          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleSubmit}
                disabled={loading || btnLoading || mode === "view"}
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  minWidth: 120,
                  textTransform: "capitalize",
                  fontWeight: 500,
                }}
              >
                {loading || btnLoading ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>

            {mode === "edit" && (
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={() => navigate(-1)}
                  sx={{
                    mt: 3,
                    borderRadius: 2,
                    minWidth: 120,
                    textTransform: "capitalize",
                    fontWeight: 500,
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#115293" },
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default ResourceSkillElementForm;
