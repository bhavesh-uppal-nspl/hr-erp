
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  CircularProgress,
  Autocomplete,
  FormControl,
  Switch,
  Select,
  InputLabel,
  FormHelperText,
  Typography,
  IconButton,
  Divider,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchSkills } from "../../../Apis/Skills";
import {
  fetchFunctionalRolesSpecialaByRole,
  fetchOrganizationFunctionalRoles,
} from "../../../Apis/FunctionalManagment";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function FunctionalRoleSkillForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [role, setRole] = useState([]);
  const [skill, setSkill] = useState([]);
  const [specialization, setSpecialization] = useState([]);

  const [formData, setFormData] = useState({
    organization_functional_role_id: "",
    organization_functional_role_specialization_id: "",
    skills: [
      {
        organization_skill_id: "",
        is_mandatory: 0,
        proficiency_level_required: "",
      },
    ],
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

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
          setSpecialization(data?.functional);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [formData.organization_functional_role_id]);

  useEffect(() => {
    {
      fetchSkills(org?.organization_id)
        .then((data) => {
          setSkill(data?.skill?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/func-role-skill/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response.data.skill;
      // Convert single skill to array format if editing existing
      if (a && !a.skills) {
        a = {
          ...a,
          skills: [
            {
              organization_skill_id: a.organization_skill_id,
              is_mandatory: a.is_mandatory,
              proficiency_level_required: a.proficiency_level_required,
            },
          ],
        };
      }
      setFormData(a);
      setLoading(false);
    };
    if ((mode === "edit" || mode === "view")  && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index][field] = value;
    setFormData((prev) => ({ ...prev, skills: updatedSkills }));

    const errorKey = `skills.${index}.${field}`;
    setFormErrors((prev) => ({ ...prev, [errorKey]: "" }));
  };

  const addSkillRow = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          organization_skill_id: "",
          is_mandatory: 0,
          proficiency_level_required: "",
        },
      ],
    }));
  };

  const removeSkillRow = (index) => {
    if (formData.skills.length > 1) {
      const updatedSkills = formData.skills.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, skills: updatedSkills }));
    }
  };

  const level = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const priorities = ["Low", "Medium", "High", "Critical"];

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_functional_role_id)
      errors.organization_functional_role_id = "Role is required.";

    if (!formData.organization_functional_role_specialization_id)
      errors.organization_functional_role_specialization_id =
        "Specialization is required.";

    formData.skills.forEach((skillItem, index) => {
      if (!skillItem.organization_skill_id)
        errors[`skills.${index}.organization_skill_id`] = "Skill is required.";

      if (!skillItem.proficiency_level_required)
        errors[`skills.${index}.proficiency_level_required`] =
          "Level is required.";
    });

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      // Prepare data for submission - can be single or multiple
      const submitData = {
        organization_functional_role_id:
          formData.organization_functional_role_id,
        organization_functional_role_specialization_id:
          formData.organization_functional_role_specialization_id,
        skills: formData.skills,
      };

      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/func-role-skill/${id}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/func-role-skill`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit"
          ? "Role skills updated successfully!"
          : "Skills assigned to role successfully!"
      );
      setFormErrors({});
      navigate("/organization/func-role-skill");
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

  return (
    <Box px={4} py={4} sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Header
        mode={mode}
        updateMessage={"Functional Role Skill"}
        addMessage={"Functional Role Skill"}
        homeLink={"/organization/func-role-skill"}
        homeText={"Functional Role Skills"}
      />
      {loading ? (
        <Grid container spacing={2}>
          <Box display="flex" justifyContent="center" py={4} width="100%">
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={10} xl={8}>
            {/* Role Selection Section */}
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  mb={3}
                  color="primary"
                >
                  Role Information
                </Typography>

                <Grid container spacing={3}>
                  <Autocomplete
                    fullWidth
                    options={role || []}
                    disabled={mode === "view" || role?.length === 0}
                    getOptionLabel={(option) =>
                      option.functional_role_name || ""
                    }
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
                    options={specialization || []}
                    disabled={mode === "view" || specialization?.length === 0}
                    getOptionLabel={(option) =>
                      option.functional_role_specialization_name || ""
                    }
                    value={
                      specialization?.find(
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
                        label="Role Specialization"
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
                </Grid>
              </CardContent>
            </Card>

            {/* Skills Assignment Section */}
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      Skill Requirements
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Define required skills with proficiency levels and
                      priorities
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {formData.skills.map((skillItem, index) => (
                  <Paper
                    key={index}
                    elevation={1}
                    sx={{
                      p: 3,
                      mb: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      position: "relative",
                      backgroundColor: "#fafbfc",
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Box
                        sx={{
                          display: "inline-block",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "16px",
                          px: 2,
                          py: 0.5,
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        Skill {index + 1}
                      </Box>

                      {mode !== "view" &&  index === formData.skills.length - 1 && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={addSkillRow}
                          sx={{
                            position: "sticky",
                            top: 0,
                            // zIndex: 10,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 500,
                            boxShadow: 2,
                            ml: 35,
                          }}
                        >
                          Add Skill
                        </Button>
                      )}



                      {mode !== "view" && formData.skills.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => removeSkillRow(index)}
                          sx={{
                            color: "error.main",
                            "&:hover": { backgroundColor: "error.lighter" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Autocomplete
                        fullWidth
                        options={skill || []}
                        disabled={mode === "view" || skill?.length === 0}
                        getOptionLabel={(option) => option.skill_name || ""}
                        value={
                          skill?.find(
                            (item) =>
                              item.organization_skill_id ===
                              skillItem.organization_skill_id
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleSkillChange(
                            index,
                            "organization_skill_id",
                            newValue ? newValue.organization_skill_id : ""
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Skill Name"
                            size="small"
                            error={
                              !!formErrors[
                                `skills.${index}.organization_skill_id`
                              ]
                            }
                            helperText={
                              formErrors[
                                `skills.${index}.organization_skill_id`
                              ]
                            }
                            required
                          />
                        )}
                      />

                      <FormControl
                        fullWidth
                        size="small"
                        required
                        error={
                          !!formErrors[
                            `skills.${index}.proficiency_level_required`
                          ]
                        }
                        disabled={mode === "view"}
                      >
                        <InputLabel>Proficiency Level</InputLabel>
                        <Select
                          value={skillItem.proficiency_level_required || ""}
                          onChange={(e) =>
                            handleSkillChange(
                              index,
                              "proficiency_level_required",
                              e.target.value
                            )
                          }
                          label="Proficiency Level"
                        >
                          {level.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {formErrors[
                          `skills.${index}.proficiency_level_required`
                        ] && (
                          <FormHelperText>
                            {
                              formErrors[
                                `skills.${index}.proficiency_level_required`
                              ]
                            }
                          </FormHelperText>
                        )}
                      </FormControl>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 1,
                              px: 2,
                              py: 0.5,
                              height: 40,
                            }}
                          >
                            <Typography variant="body2" fontWeight={500}>
                              Mandatory Skill
                            </Typography>
                            <Switch
                              disabled={mode === "view"}
                              checked={Boolean(skillItem.is_mandatory)}
                              onChange={(e) =>
                                handleSkillChange(
                                  index,
                                  "is_mandatory",
                                  e.target.checked ? 1 : 0
                                )
                              }
                              size="small"
                            />
                          </Box>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Grid container spacing={2} mt={2}>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={handleSubmit}
                  disabled={loading || btnLoading || mode === "view"}
                  sx={{
                    borderRadius: 2,
                    minWidth: 140,
                    textTransform: "capitalize",
                    fontWeight: 600,
                    px: 4,
                  }}
                >
                  {loading || btnLoading ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : mode === "edit" ? (
                    "Update Skills"
                  ) : (
                    "Assign Skills"
                  )}
                </Button>
              </Grid>

              {mode === "edit" && (
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="medium"
                    onClick={() => navigate("/organization/func-role-skill")}
                    sx={{
                      borderRadius: 2,
                      minWidth: 120,
                      textTransform: "capitalize",
                      fontWeight: 500,
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default FunctionalRoleSkillForm;
