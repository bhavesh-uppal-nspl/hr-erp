import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextField,
  FormHelperText,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchIntershipStatus } from "../../../Apis/InternManagement";


function InternStagesForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_internship_status_id : "",
    internship_stage_name: "",
    description: "",
   
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
const [Status , setStatus]=useState([])
  let navigate = useNavigate();



    useEffect(() => {
      {
        fetchIntershipStatus(org?.organization_id)
          .then((data) => {
            setStatus(data?.intership?.data);
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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/internship-stages/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const a = response.data.intership;
        setFormData(a);
      } catch (error) {
        console.error("Error fetching employee exit data:", error);
      } finally {
        setLoading(false);
      }
    };

    if ((mode === "edit" || mode ==="view") && id) {
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

    if (!formData.organization_internship_status_id ) errors.organization_internship_status_id  = "Intern  Status is required.";

    if (!formData.internship_stage_name) {
      errors.internship_stage_name = "Status Name is required.";
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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/internship-stages/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/internship-stages`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      toast.success(
        mode === "edit" ? "Intern Stages  Updated!" : "Intern Stages Created!"
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

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Intern Stages"}
        addMessage={"Intern  Stages"}
        homeLink={"/intern/intern-stages"}
        homeText={"Intern Stages"}
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
                  options={Status || []}
                  getOptionLabel={(option) =>
                    option.internship_status_name || ""
                  }
                  value={
                    Status?.find(
                      (option) =>
                        option.organization_internship_status_id ===
                        formData.organization_internship_status_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "organization_internship_status_id",
                        value:
                          newValue?.organization_internship_status_id ||
                          "",
                      },
                    });
                  }}
                  disabled={mode === "view" || Status?.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Internship Status"
                      error={
                        !!formErrors.organization_internship_status_id
                      }
                      helperText={
                        formErrors.organization_internship_status_id
                      }
                      required
                      fullWidth
                    />
                  )}
                />


              
              
                <TextField
                  fullWidth
                  label="Internship Stages Name"
                  name="internship_stage_name"
                  value={formData.internship_stage_name}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  error={!!formErrors.internship_stage_name}
                  helperText={formErrors.internship_stage_name}
                
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                   disabled={mode === "view"}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  multiline
                  rows={2} // Makes it two lines high
                
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

export default InternStagesForm;
