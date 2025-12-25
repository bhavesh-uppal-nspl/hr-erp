import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchProviderTypes } from "../../../Apis/Learning";

function LearningProviderForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_learning_provider_type_id: "",
    provider_name: "",
    provider_short_name: "",
    description: "",
    website_url: "",
    created_by: "user",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [type, setType] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchProviderTypes(org?.organization_id)
        .then((data) => {
          setType(data?.learning?.data);
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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/learning-provider/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const a = response?.data?.learning;
        setFormData(a);
      } catch (error) {
        console.error("Error fetching learning provider data:", error);
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
    if (!formData.organization_learning_provider_type_id) {
      errors.organization_learning_provider_type_id =
        "Provider Type Name is required.";
    }
    if (!formData.provider_name) {
      errors.provider_name = "Provider Name is required.";
    }

    if (!formData.website_url) {
      errors.website_url = "Url is required.";
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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/learning-provider/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/learning-provider`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      toast.success(
        mode === "edit" ? "Provider Type  Updated!" : "Provider Type Created!"
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
        updateMessage={"Learning Provider"}
        addMessage={"Learning Provider"}
        homeLink={"/organization/learning-provider"}
        homeText={"Learning Provider"}
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
                  options={type || []}
                  disabled={mode === "view" || type?.length === 0}
                  getOptionLabel={(option) => option.provider_type_name || ""}
                  value={
                    type?.find(
                      (item) =>
                        item.organization_learning_provider_type_id ===
                        formData.organization_learning_provider_type_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "organization_learning_provider_type_id",
                        value: newValue
                          ? newValue.organization_learning_provider_type_id
                          : "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Provider Type"
                      error={
                        !!formErrors.organization_learning_provider_type_id
                      }
                      helperText={
                        formErrors.organization_learning_provider_type_id
                      }
                      required
                    />
                  )}
                />

                <TextField
                  fullWidth
                  label="Provider Name"
                  name="provider_name"
                  value={formData.provider_name}
                  onChange={handleChange}
                  error={!!formErrors.provider_name}
                  helperText={formErrors.provider_name}
                  disabled={mode === "view"}
                  required
                />

                <TextField
                  fullWidth
                  label="Short Name"
                  name="provider_short_name"
                  value={formData.provider_short_name}
                  onChange={handleChange}
                  error={!!formErrors.provider_short_name}
                  helperText={formErrors.provider_short_name}
                  disabled={mode === "view"}
                />

                <TextField
                  fullWidth
                  label="Website Url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  error={!!formErrors.website_url}
                  helperText={formErrors.website_url}
                  disabled={mode === "view"}
                  required
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

export default LearningProviderForm;
