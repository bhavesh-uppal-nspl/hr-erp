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
  FormLabel,
  Switch,
  FormHelperText,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchProviders, fetchProviderTypes } from "../../../Apis/Learning";

function LearningResourcesForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_learning_provider_id: "",
    resource_title: "",
    resource_short_name: "",
    resource_type: "",
    difficulty_level: "",
    resource_url: "",
    duration_minutes: "",
    resource_cost_type: "free",
    cost: "",
    certification_available: 0,
    tags: "",
    description: "",
    created_by: "user",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [provider, setProvider] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchProviders(org?.organization_id)
        .then((data) => {
          setProvider(data?.learning?.data);
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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/learning-resources/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const a = response?.data?.learning;
        setFormData(a);
      } catch (error) {
        console.error("Error fetching learning Resouces data:", error);
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
    if (!formData.organization_learning_provider_id) {
      errors.organization_learning_provider_id = "Provider Name is required.";
    }
    if (!formData.resource_title) {
      errors.resource_title = "title is required.";
    }

    if (!formData.resource_type) {
      errors.resource_type = "resource type is required.";
    }
    if (!formData.resource_url) {
      errors.resource_url = "resource url is required.";
    }
    if (!formData.duration_minutes) {
      errors.duration_minutes = "duration minutes required.";
    }
    if (!formData.resource_cost_type) {
      errors.resource_cost_type = "duration minutes required.";
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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/learning-resources/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/learning-resources`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      toast.success(
        mode === "edit" ? "Resource  Updated!" : "Resource Created!"
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
        updateMessage={"Learning Resources"}
        addMessage={"Learning Resorces"}
        homeLink={"/organization/learning-resources"}
        homeText={"Learning Resources"}
      />
      {loading ? (
        <Grid container spacing={2}>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper elevation={4} sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Autocomplete
                  fullWidth
                  options={provider || []}
                  disabled={mode === "view" || provider?.length === 0}
                  getOptionLabel={(option) => option.provider_name || ""}
                  value={
                    provider?.find(
                      (item) =>
                        item.organization_learning_provider_id ===
                        formData.organization_learning_provider_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "organization_learning_provider_id",
                        value: newValue
                          ? newValue.organization_learning_provider_id
                          : "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Provider"
                      error={!!formErrors.organization_learning_provider_id}
                      helperText={formErrors.organization_learning_provider_id}
                      required
                    />
                  )}
                />

                <TextField
                  fullWidth
                  label="Resource Title"
                  name="resource_title"
                  value={formData.resource_title}
                  onChange={handleChange}
                  error={!!formErrors.resource_title}
                  helperText={formErrors.resource_title}
                  disabled={mode === "view"}
                  required
                />

                <TextField
                  fullWidth
                  label="Short Name"
                  name="resource_short_name"
                  value={formData.resource_short_name}
                  onChange={handleChange}
                  error={!!formErrors.resource_short_name}
                  helperText={formErrors.resource_short_name}
                  disabled={mode === "view"}
                />
                {/* Difficulty Level */}
                <Autocomplete
                  fullWidth
                  options={["Beginner", "Intermediate", "Advanced", "Expert"]}
                  disabled={mode === "view"}
                  value={formData.difficulty_level || null}
                  onChange={(event, newValue) =>
                    handleChange({
                      target: {
                        name: "difficulty_level",
                        value: newValue || "",
                      },
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Difficulty Level"
                      error={!!formErrors.difficulty_level}
                      helperText={formErrors.difficulty_level}
                    />
                  )}
                />

                {/* Resource Type */}
                <Autocomplete
                  fullWidth
                  options={[
                    "course",
                    "video",
                    "playlist",
                    "article",
                    "document",
                    "classroom_training",
                    "certification_prep",
                  ]}
                  disabled={mode === "view"}
                  value={formData.resource_type || null}
                  onChange={(event, newValue) =>
                    handleChange({
                      target: { name: "resource_type", value: newValue || "" },
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Resource Type"
                      error={!!formErrors.resource_type}
                      helperText={formErrors.resource_type}
                      required
                    />
                  )}
                />

                {/* Duration Minutes */}
                <TextField
                  fullWidth
                  label="Duration (Minutes)"
                  name="duration_minutes"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  error={!!formErrors.duration_minutes}
                  helperText={formErrors.duration_minutes}
                  disabled={mode === "view"}
                  required
                />

                {/* Cost Type */}
                <FormControl
                  fullWidth
                  error={!!formErrors.resource_cost_type}
                  required
                >
                  <FormLabel component="legend">Resource Cost Type </FormLabel>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>Free</Typography>
                    <Switch
                      checked={formData.resource_cost_type === "paid"}
                      disabled={mode === "view"}
                      onChange={(event) =>
                        handleChange({
                          target: {
                            name: "resource_cost_type",
                            value: event.target.checked ? "paid" : "free",
                          },
                        })
                      }
                    />
                    <Typography>Paid</Typography>
                  </Box>
                  {formErrors.resource_cost_type && (
                    <FormHelperText>
                      {formErrors.resource_cost_type}
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Cost (only required when "paid") */}
                <TextField
                  fullWidth
                  label="Cost"
                  name="cost"
                  type="number"
                  value={formData.cost}
                  onChange={handleChange}
                  error={!!formErrors.cost}
                  helperText={formErrors.cost}
                  disabled={
                    mode === "view" || formData.resource_cost_type !== "paid"
                  }
                  required={formData.resource_cost_type === "paid"}
                />

                {/* Certification Available */}
                {/* <FormControl
                  fullWidth
                  error={!!formErrors.certification_available}
                >
                  <FormLabel component="legend">
                    Certification Available?
                  </FormLabel>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>No</Typography>
                    <Switch
                      checked={formData.certification_available === true}
                      disabled={mode === "view"}
                      onChange={(event) =>
                        handleChange({
                          target: {
                            name: "certification_available",
                            value: event.target.checked,
                          },
                        })
                      }
                    />
                    <Typography>Yes</Typography>
                  </Box>
                  {formErrors.certification_available && (
                    <FormHelperText>
                      {formErrors.certification_available}
                    </FormHelperText>
                  )}
                </FormControl> */}




 
<FormControlLabel
  control={
    <Switch
      checked={formData.certification_available === 1}
      disabled={mode === "view"}
      onChange={(event) =>
        handleChange({
          target: {
            name: "certification_available",
            value: event.target.checked ? 1 : 0,
          },
        })
      }
    />
  }
  label="Certification Available"
/>




                
                <TextField
                  fullWidth
                  label="Resource Url"
                  name="resource_url"
                  value={formData.resource_url}
                  onChange={handleChange}
                  error={!!formErrors.resource_url}
                  helperText={formErrors.resource_url}
                  disabled={mode === "view"}
                  required
                />

                <TextField
                  fullWidth
                  label="Tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  error={!!formErrors.tags}
                  helperText={formErrors.tags}
                  multiline
                  rows={2} // Makes it two lines high
                  disabled={mode === "view"}
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  multiline
                  rows={2} // Makes it two lines high
                  disabled={mode === "view"}
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
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default LearningResourcesForm;
