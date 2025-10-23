
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { fetchOrganizationDepartment } from "../../../Apis/Department-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fetchAttendanceBreakType } from "../../../Apis/Attendance";

function AttendanceBreakForm({ mode }) {
  const { id } = useParams(); // only used in edit mode
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [BreakType, setBreakType] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_attendance_break_type_id: "",
    attendance_break_name: "",
    description: "",
    break_duration_minutes: "",
    break_start_time: "",
    break_end_time: "",
    is_paid: "",
  });

  useEffect(() => {
    {
      fetchAttendanceBreakType(org.organization_id)
        .then((data) => {
          setBreakType(data?.attendance_breaktype);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/attendance-breaks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.Attendancebreak;
      console.log("KSBB", response.data);
      setFormData(a);
      setLoading(false);
    };
    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  console.log("formdata", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_attendance_break_type_id)
      errors.organization_attendance_break_type_id =
        "Atendance break type is required.";

    if (!formData.attendance_break_name)
      errors.attendance_break_name = "Break Name is required.";

    if (!formData.break_duration_minutes)
      errors.break_duration_minutes = "Break duration is required.";

    if (!formData.break_start_time)
      errors.break_start_time = "Start time is required.";

    if (!formData.break_end_time)
      errors.break_end_time = "End time is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        // Call edit API
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-breaks/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-breaks`,
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
          ? "Attendance Break Updated!"
          : "Attendance Break Created!"
      );
      setFormErrors({});
      navigate(-1);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
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
        updateMessage={"Attendance Break"}
        addMessage={"Attendance Break"}
        homeLink={"/organization/attendance-break"}
        homeText={"Attendance Break"}
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
                  select
                  fullWidth
                  label="Break Type"
                  name="organization_attendance_break_type_id"
                  value={formData.organization_attendance_break_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_attendance_break_type_id}
                  helperText={formErrors.organization_attendance_break_type_id}
                  required
                >
                  {BreakType?.map((option) => (
                    <MenuItem
                      key={option.organization_attendance_break_type_id}
                      value={option.organization_attendance_break_type_id}
                    >
                      {option?.attendance_break_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Break Name"
                  name="attendance_break_name"
                  value={formData.attendance_break_name}
                  onChange={handleChange}
                  error={!!formErrors.attendance_break_name}
                  helperText={formErrors.attendance_break_name}
                  required
                  inputProps={{ maxLength: 100 }}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  {/* Start Time */}
                  <TimePicker
                    label="Start Time"
                    views={["hours", "minutes"]}
                    ampm={true}
                    value={
                      formData.break_start_time
                        ? new Date(`1970-01-01T${formData.break_start_time}`)
                        : null
                    }
                    onChange={(newValue) => {
                      const formatted = newValue
                        ? format(newValue, "HH:mm")
                        : "";
                      setFormData((prev) => ({
                        ...prev,
                        break_start_time: formatted,
                      }));
                      setFormErrors((prev) => ({
                        ...prev,
                        break_start_time: "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!formErrors.break_start_time}
                        helperText={formErrors.break_start_time}
                        required
                      />
                    )}
                  />

                  {/* End Time */}
                  <TimePicker
                    label="End Time"
                    views={["hours", "minutes"]}
                    ampm={true}
                    value={
                      formData.break_end_time
                        ? new Date(`1970-01-01T${formData.break_end_time}`)
                        : null
                    }
                    onChange={(newValue) => {
                      const formatted = newValue
                        ? format(newValue, "HH:mm")
                        : "";
                      setFormData((prev) => ({
                        ...prev,
                        break_end_time: formatted,
                      }));
                      setFormErrors((prev) => ({
                        ...prev,
                        break_end_time: "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!formErrors.break_end_time}
                        helperText={formErrors.break_end_time}
                        required
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        formData.is_paid === "1" || formData.is_paid === true
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_paid: e.target.checked,
                        }))
                      }
                      color="primary"
                    />
                  }
                  label="Is Paid"
                />

                {["15", "30", "45", "60"].includes(
                  String(formData.break_duration_minutes)
                ) || formData.break_duration_minutes === "" ? (
                  <TextField
                    select
                    fullWidth
                    label="Break Duration (minutes)"
                    name="break_duration_minutes"
                    value={formData.break_duration_minutes}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        break_duration_minutes: value,
                      }));
                    }}
                  >
                    {[15, 30, 45, 60].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option} minutes
                      </MenuItem>
                    ))}
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                ) : (
                  <TextField
                    fullWidth
                    type="number"
                    label="Custom Break Duration (minutes)"
                    name="break_duration_minutes"
                    value={formData.break_duration_minutes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        break_duration_minutes: e.target.value,
                      }))
                    }
                    InputProps={{
                      endAdornment: (
                        <Button
                          size="small"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              break_duration_minutes: "",
                            }))
                          }
                        >
                          Cancel
                        </Button>
                      ),
                    }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  inputProps={{ maxLength: 255 }}
                  multiline
                  minRows={3} // Minimum visible height
                  maxRows={5}
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

export default AttendanceBreakForm;
