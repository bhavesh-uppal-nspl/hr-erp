import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Switch,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { fetchWorkModel } from "../../../Apis/Workshift-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";

function WorkModelDayForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_work_model_id: "",
    remarks: "",
  });

  const [daysData, setDaysData] = useState([
    { day: "Monday", is_working_day: 1 },
    { day: "Tuesday", is_working_day: 1 },
    { day: "Wednesday", is_working_day: 1 },
    { day: "Thursday", is_working_day: 1 },
    { day: "Friday", is_working_day: 1 },
    { day: "Saturday", is_working_day: 0 },
    { day: "Sunday", is_working_day: 0 },
  ]);

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [workModels, setWorkModels] = useState([]);

  let navigate = useNavigate();

  // Fetch work models on component mount
  useEffect(() => {
    if (org?.organization_id) {
      fetchWorkModel(org.organization_id)
        .then((data) => {
          setWorkModels(data?.workmodel?.data || []);
        })
        .catch((err) => {
          toast.error("Failed to fetch work models");
          console.error(err);
        });
    }
  }, [org?.organization_id]);

  // Fetch data for edit mode
  useEffect(() => {
    const getDataById = async () => {
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org.organization_id}/workmodel-days/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Edit data response:", response.data);
        
        const workshift = response.data.workshift;
        
        // Set form data
        setFormData({
          organization_work_model_id: workshift.organization_work_model_id || "",
          remarks: workshift.remarks || "",
        });

        // Update days data based on the response
        if (workshift.days && Array.isArray(workshift.days)) {
          setDaysData((prev) =>
            prev.map((day) => {
              const foundDay = workshift.days.find(
                (d) => d.day_of_week === day.day
              );
              return foundDay
                ? { ...day, is_working_day: foundDay.is_working_day ? 1 : 0 }
                : day;
            })
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch work model days");
      } finally {
        setLoading(false);
      }
    };

    if ( (mode === "edit"  || mode === "view"   )&& id && org?.organization_id) {
      setLoading(true);
      getDataById();
    }
  }, [mode, id, org?.organization_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDayToggle = (index) => {
    setDaysData((prev) => {
      const updated = [...prev];
      updated[index].is_working_day =
        updated[index].is_working_day === 1 ? 0 : 1;
      return updated;
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_work_model_id) {
      errors.organization_work_model_id = "Work Model is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setbtnLoading(true);
    try {
      const payload = {
        organization_work_model_id: parseInt(formData.organization_work_model_id),
        remarks: formData.remarks || "",
        days: daysData.map((dayData) => ({
          day_of_week: dayData.day,
          is_working_day: dayData.is_working_day === 1, // Convert to boolean
        })),
      };

      console.log("Payload being sent:", payload);

      const url =
        mode === "edit"
          ? `${MAIN_URL}/api/organizations/${org?.organization_id}/workmodel-days/${id}`
          : `${MAIN_URL}/api/organizations/${org?.organization_id}/workmodel-days`;

      const method = mode === "edit" ? "put" : "post";

      const response = await axios[method](url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);

      toast.success(
        mode === "edit"
          ? "Work Model days updated successfully!"
          : "Work Model days created successfully!"
      );
      navigate(-1);
    } catch (err) {
      console.error("Error details:", err);
      console.error("Error response:", err.response?.data);
      
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        setFormErrors(validationErrors);
        
        // Show specific validation errors
        Object.keys(validationErrors).forEach((key) => {
          const errorMsg = Array.isArray(validationErrors[key])
            ? validationErrors[key][0]
            : validationErrors[key];
          toast.error(errorMsg);
        });
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized access");
      } else if (err.response?.status === 404) {
        toast.error("Work Model not found");
      } else {
        toast.error(err.response?.data?.error || "Something went wrong");
      }
    } finally {
      setbtnLoading(false);
    }
  };

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Work Model Days"}
        addMessage={"Work Model Days"}
        homeLink={"/organization/work-model-days"}
        homeText={"Work Model Days"}
      />
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={4} sx={{ p: 3 }}>
          <Grid container spacing={5}>
            {/* Work Model Selection */}
          
              <TextField
                select
                fullWidth
                
                label="Work Model"
                name="organization_work_model_id"
                value={formData.organization_work_model_id}
                onChange={handleChange}
                error={!!formErrors.organization_work_model_id}
                helperText={formErrors.organization_work_model_id}
                required
                disabled={workModels.length === 0 || mode === "edit"  || mode === "view"}
              >
                {workModels.length === 0 ? (
                  <MenuItem disabled>No work models available</MenuItem>
                ) : (
                  workModels.map((option) => (
                    <MenuItem
                      key={option.organization_work_model_id}
                      value={option.organization_work_model_id}
                    >
                      {option.work_model_name}
                    </MenuItem>
                  ))
                )}
              </TextField>
         

            {/* Days of Week with Toggles */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1, ml:6, fontWeight: 600 }}>
                Working Days
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  width: "fit-content",
                  backgroundColor: "#f5f5f5",
                  p: 2,
                  ml:5,
                  borderRadius: 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              >
                {daysData.map((dayData, index) => (
                  <Box
                    key={dayData.day}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minWidth: 200,
                      backgroundColor: "#fff",
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 , mr:4}}>
                      {dayData.day}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: dayData.is_working_day === 1 ? "success.main" : "text.secondary",
                          fontWeight: 500,
                        }}
                      >
                        {dayData.is_working_day === 1 ? "Working" : "Off"}
                      </Typography>
                      <Switch
                        disabled={mode === "view"}
                        checked={dayData.is_working_day === 1}
                        onChange={() => handleDayToggle(index)}
                        color="primary"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Remarks */}
            
              <TextField
                fullWidth
                label="Remarks"
                name="remarks"
                  disabled={mode === "view"}
                value={formData.remarks}
                onChange={handleChange}
                error={!!formErrors.remarks}
                helperText={formErrors.remarks}
                inputProps={{ maxLength: 1000 }}
                multiline
                minRows={3}
                maxRows={5}
              />
          
          </Grid>

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
                  minWidth: 120,
                  textTransform: "capitalize",
                  fontWeight: 500,
                }}
              >
                {loading || btnLoading ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : mode === "edit" ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>

            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                onClick={() => navigate(-1)}
                disabled={btnLoading}
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
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default WorkModelDayForm;