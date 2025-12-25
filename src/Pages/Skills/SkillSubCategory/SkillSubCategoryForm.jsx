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
import { useNavigate, useParams , useLocation } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchSkillCategories } from "../../../Apis/Skills";

function SkillSubCategoryForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();

  const location = useLocation();

  console.log("locataion is ", location)
  const org = userData?.organization;
  const [category, setCategory] = useState([]);
  const [formData, setFormData] = useState({
    organization_skill_category_id: location.state?.stateData?.organization_skill_category_id,
    skill_subcategory_name: "",
    skill_subcategory_short_name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  let navigate = useNavigate();

  console.log("organization coming is ", org);
  useEffect(() => {
    {
      fetchSkillCategories(org?.organization_id)
        .then((data) => {
          setCategory(data?.skill?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/skill-subcategory/${id}`,
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

    if (!formData.organization_skill_category_id)
      errors.organization_skill_category_id = "skill category is required.";

    if (!formData.skill_subcategory_name)
      errors.skill_subcategory_name = "skill category name is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/skill-subcategory/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/skill-subcategory`,
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
          ? "Skill Subcategory updated!"
          : "Skill Subcategory created!"
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
        updateMessage={"Skill SubCategory"}
        addMessage={"Skill SubCategory"}
        homeLink={"/organization/skill-category"}
        homeText={"Skill SubCategory"}
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
                  options={category || []}
                  disabled={mode === "view" || category?.length === 0}
                  getOptionLabel={(option) => option.skill_category_name || ""}
                  value={
                    category?.find(
                      (item) =>
                        item.organization_skill_category_id ===
                        formData.organization_skill_category_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "organization_skill_category_id",
                        value: newValue
                          ? newValue.organization_skill_category_id
                          : "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Skill Category"
                      error={!!formErrors.organization_skill_category_id}
                      helperText={formErrors.organization_skill_category_id}
                    />
                  )}
                />

                <TextField
                  fullWidth
                  label="SubCategory Name"
                  name="skill_subcategory_name"
                  value={formData.skill_subcategory_name}
                  onChange={handleChange}
                  error={!!formErrors.skill_subcategory_name}
                  helperText={formErrors.skill_subcategory_name}
                  required
                  inputProps={{ maxLength: 50 }}
                />

                <TextField
                  fullWidth
                  label="Short Name"
                  name="skill_subcategory_short_name"
                  value={formData.skill_subcategory_short_name}
                  onChange={handleChange}
                  error={!!formErrors.skill_subcategory_short_name}
                  helperText={formErrors.skill_subcategory_short_name}
                  inputProps={{ maxLength: 50 }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  inputProps={{ maxLength: 250 }}
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

export default SkillSubCategoryForm;






