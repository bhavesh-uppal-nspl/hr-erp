import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {MAIN_URL } from "../../../Configurations/Urls";

function OrganizationEmployementStatusesForm({ mode }) {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  const [formData, setFormData] = useState({
    employment_status_name: "",
  });

  let navigate = useNavigate();
  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/employment-status/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
      let a = response.data.status;
      console.log("reponse of status ", a);
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

    if (!formData.employment_status_name)
      errors.employment_status_name = "Status's Name is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    console.log("formdarta",formData)
    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employment-status/${id}`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employment-status`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      }
      toast.success(mode === "edit" ? "Status updated!" : "Status created!");
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
        updateMessage={"Employment's Status"}
        addMessage={"Employment's Status"}
        homeLink={"/organization-configration/employee-status"}
        homeText={"Employment Status"}
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
                <TextField
                  fullWidth
                  label="Employment Status"
                  name="employment_status_name"
                  value={formData.employment_status_name}
                  onChange={handleChange}
                  error={!!formErrors.employment_status_name}
                  helperText={formErrors.employment_status_name}
                     inputProps={{ maxLength: 30 }}
                  required
                />

              </Grid>

               <Grid container spacing={2} mt={2}>
                              <Grid item>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="medium"
                                  onClick={handleSubmit}
                                  disabled={loading || btnLoading}
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
                                    onClick={() => navigate(-1)}
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

export default OrganizationEmployementStatusesForm;
