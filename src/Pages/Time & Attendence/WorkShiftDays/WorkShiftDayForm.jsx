

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import {
  fetchRotationPatterns,
  fetchWorkShift,
} from "../../../Apis/Workshift-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";

function WorkShiftDayForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_work_shift_id: "",
    remarks: "",
    working_hours: "",
  });

  const [daysData, setDaysData] = useState([
    { day: "Monday", is_working_day: 1, working_hours: "" },
    { day: "Tuesday", is_working_day: 1, working_hours: "" },
    { day: "Wednesday", is_working_day: 1, working_hours: "" },
    { day: "Thursday", is_working_day: 1, working_hours: "" },
    { day: "Friday", is_working_day: 1, working_hours: "" },
    { day: "Saturday", is_working_day: 0, working_hours: "" },
    { day: "Sunday", is_working_day: 0, working_hours: "" },
  ]);

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [shift, setShift] = useState([]);

  let navigate = useNavigate();

  // Fetch available workshifts
  useEffect(() => {
    fetchWorkShift(org?.organization_id)
      .then((data) => {
        setShift(data?.workshifts?.data);
      })
      .catch((err) => {
        console.error("Error fetching workshifts:", err);
      });
  }, [org?.organization_id]);

  // Fetch workshift days data for edit mode
  useEffect(() => {
    const getDataById = async () => {
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org.organization_id}/workshift-days/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Edit mode data:", response.data);
        const workshiftData = response.data?.workshift;

        if (workshiftData) {
          // Set form data
          setFormData({
            organization_work_shift_id: workshiftData.organization_work_shift_id,
            remarks: workshiftData.remarks || "",
            working_hours: workshiftData.days?.[0]?.working_hours || "",
          });

          // Map the days data from backend
          if (workshiftData.days && Array.isArray(workshiftData.days)) {
            setDaysData((prev) => {
              return prev.map((day) => {
                const backendDay = workshiftData.days.find(
                  (d) => d.day_of_week === day.day
                );
                if (backendDay) {
                  return {
                    ...day,
                    is_working_day: backendDay.is_working_day,
                    working_hours: backendDay.working_hours || "",
                  };
                }
                return day;
              });
            });
          }
        }
      } catch (err) {
        console.error("Error fetching workshift days:", err);
        toast.error("Failed to load workshift days data");
      } finally {
        setLoading(false);
      }
    };

    if ( (mode === "edit" || mode === "view" )  && id) {
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
      
      if (updated[index].is_working_day === 0) {
        updated[index].working_hours = "";
      } else {
        // When turning ON, use the calculated working_hours from formData
        updated[index].working_hours = formData.working_hours || "";
      }
      return updated;
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_work_shift_id)
      errors.organization_work_shift_id = "Workshift is required.";

    // Validate each working day
    daysData.forEach((dayData, index) => {
      if (dayData.is_working_day === 1 && !dayData.working_hours) {
        errors[`working_hours_${index}`] =
          `Working hours required for ${dayData.day}`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setbtnLoading(true);
    try {
      const payload = {
        organization_work_shift_id: formData.organization_work_shift_id,
        remarks: formData.remarks,
        days: daysData.map((dayData) => ({
          day_of_week: dayData.day,
          is_working_day: dayData.is_working_day,
          working_hours:
            dayData.is_working_day === 1 ? dayData.working_hours : null,
        })),
      };

      const url =
        mode === "edit"
          ? `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-days/${id}`
          : `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-days`;

      if (mode === "edit") {
        await axios.put(url, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post(url, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      toast.success(
        mode === "edit"
          ? "WorkShift days updated successfully!"
          : "WorkShift days created successfully!"
      );
      navigate(-1);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        setFormErrors(validationErrors);
        toast.error("Validation failed.");
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
        updateMessage={"WorkShift days"}
        addMessage={"WorkShift days"}
        homeLink={"/organization/work-shift-days"}
        homeText={"WorkShift days"}
      />

      {loading ? (
        <Grid container spacing={2}>
          <Box display="flex" justifyContent="center" py={4} width="100%">
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        <Paper elevation={4} sx={{ p: 3 }}>
         
            {/* Work Shift Selection */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Work Shift"
                name="organization_work_shift_id"
                value={formData?.organization_work_shift_id}
                onChange={(e) => {
                  const { name, value } = e.target;

                  const selectedShift = shift.find(
                    (s) => s.organization_work_shift_id === value
                  );

                  // Helper function to calculate hours
                  const calculateShiftHours = (start, end) => {
                    if (!start || !end) return "";
                    const [startH, startM] = start.split(":").map(Number);
                    const [endH, endM] = end.split(":").map(Number);

                    let startMinutes = startH * 60 + startM;
                    let endMinutes = endH * 60 + endM;

                    // Handle overnight shifts
                    if (endMinutes < startMinutes) {
                      endMinutes += 24 * 60;
                    }

                    const totalMinutes = endMinutes - startMinutes;
                    return (totalMinutes / 60).toFixed(2);
                  };

                  const hours = selectedShift
                    ? calculateShiftHours(
                        selectedShift.work_shift_start_time,
                        selectedShift.work_shift_end_time
                      )
                    : "";

                  // Update formData
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    working_hours: hours,
                  }));

                  // Update all working days with the calculated hours
                  setDaysData((prevDays) => {
                    return prevDays.map((day) => ({
                      ...day,
                      working_hours: day.is_working_day === 1 ? hours : "",
                    }));
                  });
                }}
                error={!!formErrors.organization_work_shift_id}
                helperText={formErrors.organization_work_shift_id}
                required
                disabled={shift?.length === 0 || mode === "edit"   ||  mode === "view"}
              >
                {shift?.map((option) => (
                  <MenuItem
                    key={option.organization_work_shift_id}
                    value={option.organization_work_shift_id}
                  >
                    {option?.work_shift_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Days Configuration */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  width: "100%",
                  backgroundColor: "#fff",
                  p: 2,
                  borderRadius: 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              >
                {daysData.map((dayData, index) => {
                  const selectedShift = shift.find(
                    (s) =>
                      s.organization_work_shift_id ===
                      formData.organization_work_shift_id
                  );

                  const formatToAmPm = (timeStr) => {
                    if (!timeStr) return "";
                    const [hours, minutes] = timeStr.split(":");
                    const date = new Date();
                    date.setHours(Number(hours));
                    date.setMinutes(Number(minutes));
                    return date.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });
                  };

                  const calculateShiftHours = (start, end) => {
                    if (!start || !end) return 0;
                    const [startH, startM] = start.split(":").map(Number);
                    const [endH, endM] = end.split(":").map(Number);

                    let startMinutes = startH * 60 + startM;
                    let endMinutes = endH * 60 + endM;

                    if (endMinutes < startMinutes) {
                      endMinutes += 24 * 60;
                    }

                    const totalMinutes = endMinutes - startMinutes;
                    return (totalMinutes / 60).toFixed(2);
                  };

                  const shiftHours = selectedShift
                    ? calculateShiftHours(
                        selectedShift.work_shift_start_time,
                        selectedShift.work_shift_end_time
                      )
                    : 0;

                  const shiftTime = selectedShift
                    ? `${formatToAmPm(
                        selectedShift.work_shift_start_time
                      )} - ${formatToAmPm(selectedShift.work_shift_end_time)}`
                    : "";

                  return (
                    <Box
                   
                      key={dayData.day}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: 3,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, minWidth: 100 }}
                      >
                        {dayData.day}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flex: 1,
                        }}
                      >
                        <Switch
                        disabled={mode === "view"}
                          checked={dayData.is_working_day === 1}
                          onChange={() => handleDayToggle(index)}
                          color="primary"
                        />

                        {shiftTime && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              visibility:
                                dayData.is_working_day === 1
                                  ? "visible"
                                  : "hidden",
                            }}
                          >
                            {shiftTime} ({shiftHours} hrs)
                          </Typography>
                        )}
                      </Box>

                      {formErrors[`working_hours_${index}`] && (
                        <Typography variant="caption" color="error">
                          {formErrors[`working_hours_${index}`]}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Grid>

            {/* Summary Display */}
            {formData.working_hours && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 2,
                    mb:2,
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Working hours per day:{" "}
                    <strong>{formData.working_hours} hrs</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total weekly hours:{" "}
                    <strong>
                      {(
                        parseFloat(formData.working_hours) *
                        daysData.filter((d) => d.is_working_day === 1).length
                      ).toFixed(2)}{" "}
                      hrs
                    </strong>
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Remarks */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                name="remarks"
                 disabled={mode === "view"}
                value={formData.remarks}
                onChange={handleChange}
                error={!!formErrors.remarks}
                helperText={formErrors.remarks}
                inputProps={{ maxLength: 256 }}
                multiline
                minRows={3}
                maxRows={5}
              />
            </Grid>
       

          {/* Submit + Cancel Buttons */}
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
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default WorkShiftDayForm;