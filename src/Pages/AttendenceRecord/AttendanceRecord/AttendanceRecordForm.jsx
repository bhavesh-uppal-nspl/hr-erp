import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  MenuItem,
  TextField,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import { fetchAttendanceStatus } from "../../../Apis/Attendance";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import dayjs from "dayjs";

function AttendanceRecordForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [StatusType, setStatusType] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [shift, setworkshiftData] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    attendance_date: "",
    attendance_status_type_id: "",
    clock_in_time: "",
    clock_out_time: "",
    workshift_total_minutes: "",
    total_work_minutes: "",
    break_duration_minutes: "",
    has_deviations: "",
    number_of_deviations: "",
  });

  let navigate = useNavigate();

  useEffect(() => {
    fetchOrganizationEmployee(org?.organization_id)
      .then((data) => setEmployee(data?.employees))
      .catch((err) => setFormErrors(err.message));
  }, []);

  useEffect(() => {
    fetchAttendanceStatus(org?.organization_id)
      .then((data) => setStatusType(data?.attendance_status_types))
      .catch((err) => setFormErrors(err.message));
  }, []);

  useEffect(() => {
    if (!formData?.employee_id || !org?.organization_id) return;

    const fetchWorkshiftData = async () => {
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift/shiftdata/${formData?.employee_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const workshift = response?.data?.workshift;
        setworkshiftData(workshift);
        if (
          workshift?.work_shift_start_time &&
          workshift?.work_shift_end_time
        ) {
          const shiftStart = dayjs(workshift?.work_shift_start_time, "HH:mm");
          const shiftEnd = dayjs(workshift?.work_shift_end_time, "HH:mm");

          const totalShiftMinutes =
            shiftEnd.diff(shiftStart, "minute") -
            (workshift?.break_duration_minutes || 0);

          setFormData((prev) => ({
            ...prev,
            workshift_total_minutes:
              totalShiftMinutes >= 0 ? totalShiftMinutes : 0,
            break_duration_minutes: workshift?.break_duration_minutes || 0,
          }));
        }
      } catch (error) {
        console.error("Error fetching workshift data:", error);
        setFormErrors((prev) => ({
          ...prev,
          workshift: "Failed to fetch workshift data",
        }));
      }
    };

    fetchWorkshiftData();
  }, [formData?.employee_id, org?.organization_id]);

  useEffect(() => {
    if (formData?.clock_in_time && formData?.clock_out_time) {
      const clockIn = dayjs(formData.clock_in_time);
      const clockOut = dayjs(formData.clock_out_time);

      const totalMinutes =
        clockOut.diff(clockIn, "minute") -
        (formData?.break_duration_minutes || 0);

      setFormData((prev) => ({
        ...prev,
        total_work_minutes: totalMinutes >= 0 ? totalMinutes : 0,
      }));
    }
  }, [
    formData?.clock_in_time,
    formData?.clock_out_time,
    formData?.break_duration_minutes,
  ]);

  useEffect(() => {
    const getdataById = async () => {
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-employee-record/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const a = response?.data?.AttendenceRecord;

        // Just set form data from backend (don't calculate total_work_minutes)
        setFormData({
          ...a,
          clock_in_time: a.clock_in_time ? dayjs(a?.clock_in_time) : null,
          clock_out_time: a.clock_out_time ? dayjs(a?.clock_out_time) : null,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setLoading(false);
      }
    };

    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  console.log("formdata is ", formData);

  const handleSwitchChange = (field) => (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? 1 : 0,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateTimeChange = (name, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [name]: newValue ? dayjs(newValue).format("YYYY-MM-DD HH:mm:ss") : "",
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.employee_id)
      errors.employee_id = "Employee Name is required.";
    if (!formData.attendance_status_type_id)
      errors.attendance_status_type_id = "Attendance status is required.";
    if (!formData.attendance_date)
      errors.attendance_date = "Attendance date is required.";
    if (!formData.clock_in_time)
      errors.clock_in_time = "Clock-in time is required.";
    if (!formData.clock_out_time)
      errors.clock_out_time = "Clock-out time is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    const payload = {
      ...formData,
      clock_in_time: formData.clock_in_time
        ? dayjs(formData.clock_in_time).format("YYYY-MM-DD HH:mm:ss")
        : null,
      clock_out_time: formData.clock_out_time
        ? dayjs(formData.clock_out_time).format("YYYY-MM-DD HH:mm:ss")
        : null,
    };

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-employee-record/${id}`,
          payload, // ✔ Use payload here, not formData
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-employee-record`,
          payload, // ✔ Use payload here too
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      toast.success(
        mode === "edit"
          ? "Employee Attendance Record Updated!"
          : "Employee Attendance Record Created!"
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
        updateMessage={"Employee Attendance Record"}
        addMessage={"Employee Attendance Record"}
        homeLink={"/attendance/employee-records"}
        homeText={"Employee Attendance Records"}
      />
      {loading ? (
        <Grid container spacing={2}>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper elevation={4} sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {/* Employee Name */}
                  <TextField
                    select
                    fullWidth
                    label="Employee Name/ID"
                    name="employee_id"
                    value={formData?.employee_id}
                    onChange={handleChange}
                    error={!!formErrors.employee_id}
                    helperText={formErrors.employee_id}
                    required
                  >
                    {employee?.map((option) => {
                      const fullName =
                        `${option?.name || ""} -- ${option?.employee_code || ""}`.trim();
                      return (
                        <MenuItem
                          key={option?.employee_id}
                          value={option?.employee_id}
                        >
                          {fullName ? fullName : option?.employee_id}
                        </MenuItem>
                      );
                    })}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    label="Attendance Status Type"
                    name="attendance_status_type_id"
                    value={formData.attendance_status_type_id}
                    onChange={handleChange}
                    error={!!formErrors.attendance_status_type_id}
                    helperText={formErrors.attendance_status_type_id}
                    required
                  >
                    {StatusType.map((option) => (
                      <MenuItem
                        key={option.organization_attendance_status_type_id}
                        value={option.organization_attendance_status_type_id}
                      >
                        {option?.attendance_status_type_name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    type="date"
                    label="Attendance Date"
                    name="attendance_date"
                    value={formData.attendance_date}
                    onChange={handleChange}
                    error={!!formErrors.attendance_date}
                    helperText={formErrors.attendance_date}
                    required
                    InputLabelProps={{ shrink: true }}
                  />

                  <DateTimePicker
                    label="Clock In Time"
                    value={
                      formData.clock_in_time
                        ? dayjs(formData.clock_in_time)
                        : null
                    }
                    onChange={(newValue) =>
                      handleDateTimeChange("clock_in_time", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!formErrors.clock_in_time}
                        helperText={formErrors.clock_in_time}
                      />
                    )}
                  />

                  <DateTimePicker
                    label="Clock Out Time"
                    value={
                      formData.clock_out_time
                        ? dayjs(formData.clock_out_time)
                        : null
                    }
                    onChange={(newValue) =>
                      handleDateTimeChange("clock_out_time", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!formErrors.clock_out_time}
                        helperText={formErrors.clock_out_time}
                      />
                    )}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          formData?.has_deviations === 1 ||
                          formData?.has_deviations === "1"
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          handleSwitchChange("has_deviations")(e);
                          if (!checked) {
                            handleChange({
                              target: {
                                name: "number_of_deviations",
                                value: "",
                              },
                            });
                          }
                        }}
                        color="primary"
                      />
                    }
                    label="Has Deviations"
                  />

                  <TextField
                    fullWidth
                    type="text"
                    label="No. of Deviations"
                    name="number_of_deviations"
                    value={formData.number_of_deviations}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,11}$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    error={!!formErrors.number_of_deviations}
                    helperText={formErrors.number_of_deviations}
                    required={
                      formData?.has_deviations === 1 ||
                      formData?.has_deviations === "1"
                    }
                    disabled={
                      !(
                        formData?.has_deviations === 1 ||
                        formData?.has_deviations === "1"
                      )
                    }
                    inputProps={{
                      maxLength: 11,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    fullWidth
                    type="text"
                    label="Break Duration Minutes"
                    name="break_duration_minutes"
                    value={formData?.break_duration_minutes}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,3}(\.\d{0,2})?$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    error={!!formErrors.break_duration_minutes}
                    helperText={formErrors.break_duration_minutes}
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      inputMode: "decimal",
                      maxLength: 6,
                    }}
                     disabled 
                  />

                  <TextField
                    fullWidth
                    type="text"
                    label="Total Work Mintutes"
                    name="total_work_minutes"
                    value={formData?.total_work_minutes}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,3}(\.\d{0,2})?$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    error={!!formErrors.total_work_minutes}
                    helperText={formErrors.total_work_minutes}
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      inputMode: "decimal",
                      maxLength: 6,
                    }}
                     disabled 
                  />

                  <TextField
                    fullWidth
                    type="text"
                    label="WorkShift Total Minutes"
                    name="workshift_total_minutes"
                    value={formData?.workshift_total_minutes}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,3}(\.\d{0,2})?$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    error={!!formErrors.workshift_total_minutes}
                    helperText={formErrors.workshift_total_minutes}
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      inputMode: "decimal",
                      maxLength: 6,
                    }}
                     disabled 
                  />

                  <TextField
                    fullWidth
                    label="Remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    error={!!formErrors.remarks}
                    helperText={formErrors.remarks}
                    inputProps={{ maxLength: 100 }}
                    multiline
                    minRows={3}
                    maxRows={5}
                  />

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
                      <CircularProgress size={24} color="inherit" />
                    ) : mode === "edit" ? (
                      "Submit"
                    ) : (
                      "Submit"
                    )}
                  </Button>

                  {/* Cancel Button in Edit Mode */}
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
                        mt: 2,
                        backgroundColor: "#1976d2",
                        "&:hover": { backgroundColor: "#115293" },
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                )}
              </Paper>
            </Grid>
          </Grid>
        </LocalizationProvider>
      )}
    </Box>
  );
}

export default AttendanceRecordForm;
