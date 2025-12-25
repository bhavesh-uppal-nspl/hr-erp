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
} from "@mui/material";
import { useNavigate, useParams  , useLocation } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchSkillSubCategories } from "../../../Apis/Skills";

function SkillForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const location = useLocation();

  const [subcategory, setSubCategory] = useState([]);

  const [formData, setFormData] = useState({
    organization_skill_subcategory_id: location.state?.stateData?.organization_skill_subcategory_id,
    skill_name: "",
    skill_short_name: "",
    description: "",
    created_by:"user"
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

  console.log("org is ", org)

  useEffect(() => {
    {
      fetchSkillSubCategories(org?.organization_id)
        .then((data) => {
          setSubCategory(data?.skill?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/skills/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response.data.skill;
      setFormData(a);
      setLoading(false);
    };
    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_skill_subcategory_id)
      errors.organization_skill_subcategory_id = "SubCategory is required.";

    if (!formData.skill_name) errors.skill_name = "name is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/skills/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/skills`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit" ? "Functional updated!" : "Functional created!"
      );
      setFormErrors({});
      navigate("/organization/skill-category");
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
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Skills"}
        addMessage={"Skills"}
        homeLink={"/organization/skill-category"}
        homeText={"Skills"}
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
                  options={subcategory || []}
                  disabled={mode === "view" || subcategory?.length === 0}
                  getOptionLabel={(option) =>
                    option.skill_subcategory_name || ""
                  }
                  value={
                    subcategory?.find(
                      (item) =>
                        item.organization_skill_subcategory_id ===
                        formData.organization_skill_subcategory_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "organization_skill_subcategory_id",
                        value: newValue
                          ? newValue.organization_skill_subcategory_id
                          : "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Skill SubCategory"
                      error={!!formErrors.organization_skill_subcategory_id}
                      helperText={formErrors.organization_skill_subcategory_id}
                      required
                    />
                  )}
                />

                <TextField
                  fullWidth
                  label="Skill Name"
                  name="skill_name"
                  value={formData.skill_name}
                  onChange={handleChange}
                  error={!!formErrors.skill_name}
                  helperText={formErrors.skill_name}
                  required
                  inputProps={{ maxLength: 50 }}
                />

                <TextField
                  fullWidth
                  label="Short Name"
                  name="skill_short_name"
                  value={formData.skill_short_name}
                  onChange={handleChange}
                  error={!!formErrors.skill_short_name}
                  helperText={formErrors.skill_short_name}
                  inputProps={{ maxLength: 20 }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  inputProps={{ maxLength: 20 }}
                />
              </Grid>

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
                      onClick={() => navigate("/organization/skill-category")}
                      sx={{
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

export default SkillForm;
