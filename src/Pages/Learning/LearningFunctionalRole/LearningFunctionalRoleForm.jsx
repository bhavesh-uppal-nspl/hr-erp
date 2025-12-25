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
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchResources } from "../../../Apis/Learning";
import {
  fetchFunctionalRolesSpecialaByRole,
  fetchOrganizationFunctionalRoles,
  fetchOrganizationFunctionalRolesSpecial,
} from "../../../Apis/FunctionalManagment";

function LearningFunctionalRoleForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_learning_resource_id: "",
    organization_functional_role_id: "",
    organization_functional_role_specialization_id: "",
    importance_level: "",
    created_by: "user",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [resource, setResource] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [role, setRole] = useState([]);
  const [spec, setSpec] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchResources(org?.organization_id)
        .then((data) => {
          setResource(data?.learning?.data || []);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      fetchOrganizationFunctionalRoles(org?.organization_id)
        .then((data) => {
          setRole(data?.functional?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      fetchFunctionalRolesSpecialaByRole(
        org?.organization_id,
        formData?.organization_functional_role_id
      )
        .then((data) => {
          setSpec(data?.functional);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [formData.organization_functional_role_id]);

  useEffect(() => {
    const getdataById = async () => {
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/learning-func-role/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response?.data?.learning;

        if (data) {
          // Set main formData
          setFormData({
            organization_functional_role_id:
              data.organization_functional_role_id,
            organization_functional_role_specialization_id:
              data.organization_functional_role_specialization_id,
            importance_level: "recommended", // fallback default
          });

          // Set selectedResources for the Autocomplete
          const mappedResources = (data.resources || []).map((r) => ({
            id: r.organization_learning_resource_functional_role_id, // <-- REQUIRED FOR EDIT
            organization_learning_resource_id:
              r.organization_learning_resource_id,
            resource_title: r.title || r.resource_title,
            importance_level: r.importance_level || "recommended",
          }));
          setSelectedResources(mappedResources);
        }
      } catch (error) {
        console.error("Error fetching learning functional role data:", error);
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
    // require at least one selected resource for create mode
    if (
      mode !== "edit" &&
      (!selectedResources || selectedResources.length === 0)
    ) {
      errors.organization_learning_resource_id =
        "At least one Learning Resource is required.";
    }

    // ensure each selected resource has importance_level
    if (selectedResources && selectedResources.length > 0) {
      selectedResources.forEach((r, i) => {
        if (!r.importance_level) {
          errors[`resource_${i}_importance`] =
            "Importance level required for each resource.";
        }
      });
    }
    if (!formData.organization_functional_role_id) {
      errors.organization_functional_role_id = "Functional Role is required.";
    }

    if (!formData.organization_functional_role_specialization_id) {
      errors.organization_functional_role_specialization_id =
        "Role Specialization is required.";
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
        for (const r of selectedResources) {
          await axios.put(
            `${MAIN_URL}/api/organizations/${org?.organization_id}/learning-func-role/${r.id}`,
            {
              organization_learning_resource_functional_role_id: r.id, // ✅ send this
              organization_functional_role_id:
                formData.organization_functional_role_id,
              organization_functional_role_specialization_id:
                formData.organization_functional_role_specialization_id,
              organization_learning_resource_id:
                r.organization_learning_resource_id,
              importance_level: r.importance_level || "recommended",
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        }
      } else {
        // Create one mapping per selected resource
        const payloads = selectedResources.map((r) => ({
          ...formData,
          organization_learning_resource_id:
            r.organization_learning_resource_id ||
            r.id ||
            r.organization_learning_resource_id,
          importance_level:
            r.importance_level || formData.importance_level || "recommended",
        }));

        // Send requests sequentially to avoid race issues; collect results
        for (const p of payloads) {
          await axios.post(
            `${MAIN_URL}/api/organizations/${org?.organization_id}/learning-func-role`,
            p,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        }
      }

      toast.success(
        mode === "edit"
          ? "Functional Role Updated!"
          : "Functional Role Created!"
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
        updateMessage={"Learning Functional Role"}
        addMessage={"Learning Functional Role"}
        homeLink={"/organization/learning-functional-role"}
        homeText={"Learning Functional Role"}
      />
      {loading ? (
        <Grid container spacing={2}>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        <Grid item xs={12} md={8}>
          <Paper elevation={4} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Autocomplete
                fullWidth
                options={role || []}
                disabled={mode === "view" || role?.length === 0}
                getOptionLabel={(option) => option.functional_role_name || ""}
                value={
                  role?.find(
                    (item) =>
                      item.organization_functional_role_id ===
                      formData.organization_functional_role_id
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "organization_functional_role_id",
                      value: newValue
                        ? newValue.organization_functional_role_id
                        : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Functional Role"
                    error={!!formErrors.organization_functional_role_id}
                    helperText={formErrors.organization_functional_role_id}
                    required
                  />
                )}
              />

              <Autocomplete
                fullWidth
                options={spec || []}
                disabled={mode === "view" || spec?.length === 0}
                getOptionLabel={(option) =>
                  option.functional_role_specialization_name || ""
                }
                value={
                  spec?.find(
                    (item) =>
                      item.organization_functional_role_specialization_id ===
                      formData.organization_functional_role_specialization_id
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "organization_functional_role_specialization_id",
                      value: newValue
                        ? newValue.organization_functional_role_specialization_id
                        : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Functional Role Specialization"
                    error={
                      !!formErrors.organization_functional_role_specialization_id
                    }
                    helperText={
                      formErrors.organization_functional_role_specialization_id
                    }
                    required
                  />
                )}
              />

              <Autocomplete
                multiple
                fullWidth
                // REMOVE selected resources from options:
                options={(resource || []).filter(
                  (res) =>
                    !selectedResources.some(
                      (s) =>
                        s.organization_learning_resource_id ===
                        res.organization_learning_resource_id
                    )
                )}
                disabled={mode === "view" || resource?.length === 0}
                getOptionLabel={(option) => option.resource_title || ""}
                value={selectedResources}
                onChange={(event, newValues) => {
                  const mapped = (newValues || []).map((v) => {
                    const existing = selectedResources.find(
                      (s) =>
                        s.organization_learning_resource_id ===
                        v.organization_learning_resource_id
                    );

                    return {
                      ...v,
                      id: existing?.id || v.id || null, // <-- PRESERVE ID
                      importance_level:
                        existing?.importance_level ||
                        v.importance_level ||
                        formData.importance_level ||
                        "recommended",
                    };
                  });

                  setSelectedResources(mapped);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Learning Resources"
                    error={!!formErrors.organization_learning_resource_id}
                    helperText={formErrors.organization_learning_resource_id}
                    required
                  />
                )}
              />

              {/* Per-resource importance selector + remove */}
              <Box sx={{ mt: 2, width: "50%" }}>
                {selectedResources.map((r, idx) => (
                  <Box
                    key={r.organization_learning_resource_id || r.id || idx}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.02)",
                      backdropFilter: "blur(10px)",
                      border: (theme) =>
                        theme.palette.mode === "dark"
                          ? "1px solid rgba(255, 255, 255, 0.1)"
                          : "1px solid rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: (theme) =>
                          theme.palette.mode === "dark"
                            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                            : "0 4px 12px rgba(0, 0, 0, 0.08)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={7}>
                        <TextField
                          fullWidth
                          size="small"
                          value={r.resource_title || r.title || "Untitled"}
                          InputProps={{
                            readOnly: true,
                            sx: {
                              borderRadius: 2,
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(0, 0, 0, 0.2)"
                                  : "rgba(255, 255, 255, 0.7)",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} width={200}>
                        <FormControl fullWidth size="small">
                          <InputLabel id={`imp-${idx}`}>Importance</InputLabel>
                          <Select
                          disabled={mode === "view"}
                            labelId={`imp-${idx}`}
                            value={
                              r.importance_level ||
                              formData.importance_level ||
                              "recommended"
                            }
                            label="Importance"
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedResources((prev) => {
                                const copy = [...prev];
                                copy[idx] = {
                                  ...copy[idx],
                                  importance_level: val,
                                };
                                return copy;
                              });
                            }}
                            sx={{
                              borderRadius: 2,
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(0, 0, 0, 0.2)"
                                  : "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            <MenuItem value="recommended">Recommended</MenuItem>
                            <MenuItem value="optional">Optional</MenuItem>
                            <MenuItem value="mandatory">Mandatory</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button
                        disabled={mode === "view"}
                          size="small"
                          color="error"
                          onClick={() =>
                            setSelectedResources((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          sx={{
                            minWidth: "30px",
                            minHeight: "30px",
                            borderRadius: "50%",
                            px: 1,
                            backgroundColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(211, 47, 47, 0.15)"
                                : "rgba(211, 47, 47, 0.08)",
                            "&:hover": {
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(211, 47, 47, 0.25)"
                                  : "rgba(211, 47, 47, 0.15)",
                              transform: "scale(1.05)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          X
                        </Button>
                      </Grid>
                    </Grid>

                    {r.importance_level === "mandatory" && (
                      <Box
                        sx={{
                          mt: 1.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          fontSize: "0.75rem",
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? "#ffb74d"
                              : "#f57c00",
                        }}
                      >
                        <span>⚠</span>
                        <span>This resource is required</span>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
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
      )}
    </Box>
  );
}

export default LearningFunctionalRoleForm;
