
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  MenuItem,
  TextField,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import dayjs from "dayjs";
import {
  fetchAttendanceBreakType,
  fetchAttendanceSource,
  fetchAttendanceDeviationReason,
  fetchAttendanceDeviationReasonType,
} from "../../../Apis/Attendance";
import {
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";

function AttendanceTimelogsForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [employee, setEmployee] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    attendance_date: new Date().toISOString().slice(0, 10),
    attendance_log_type: "",
    attendance_log_time: "",
    attendance_break_type_id: "",
    attendance_source_type_id: "",
    remarks: "",
    deviation_reason_type_id: "",
    deviation_reason_id: "",
    work_shift_start_time: "",
    work_shift_end_time: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [breakType, setBraekType] = useState([]);
  const [source, setSource] = useState([]);
  const [deviationType, setDeviationType] = useState([]);
  const [deviation, setDeviation] = useState([]);
  const [shift, setworkshiftData] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchAttendanceBreakType(org?.organization_id)
        .then((data) => {
          setBraekType(data?.attendance_breaktype);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      fetchAttendanceDeviationReasonType(org?.organization_id)
        .then((data) => {
          setDeviationType(data?.attendance_deviation_reason_type);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  // get the shift data

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
          // ✔ Strip seconds from "HH:mm:ss" → "HH:mm"
          const shiftStart = workshift.work_shift_start_time?.slice(0, 5);
          const shiftEnd = workshift.work_shift_end_time?.slice(0, 5);

          // ✔ Update formData with clean HH:mm format
          setFormData((prev) => ({
            ...prev,
            work_shift_start_time: shiftStart,
            work_shift_end_time: shiftEnd,
          }));
        } else {
          // ✔ Reset if API doesn't have times
          setFormData((prev) => ({
            ...prev,
            work_shift_start_time: "",
            work_shift_end_time: "",
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

  console.log("shift is  ", shift);

  useEffect(() => {
    {
      fetchAttendanceSource(org?.organization_id)
        .then((data) => {
          setSource(data?.attendance_source);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    fetchOrganizationEmployee(org?.organization_id)
      .then((data) => 
      {
        const filteredEmployees = data?.filter(
          (item) => item.employment_status !== "Exited"
        );
        setEmployee(filteredEmployees);
      })
      .catch((err) => setFormErrors(err.message));
  }, []);

  useEffect(() => {
    if (!formData?.deviation_reason_type_id || !org?.organization_id) return;

    const fetchDeviationData = async () => {
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-deviation-reason/reasontype/${formData?.deviation_reason_type_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("response is ", response);

        const workshift = response?.data?.data;
        setDeviation(workshift);
      } catch (error) {
        console.error("Error fetching deviation reason data:", error);
        setFormErrors((prev) => ({
          ...prev,
          workshift: "Failed to fetch deviation reason data",
        }));
      }
    };

    fetchDeviationData();
  }, [formData?.deviation_reason_type_id, org?.organization_id]);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-time-logs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.timeLogs;
      setFormData(a);
      setLoading(false);
    };
    if ((mode === "edit" || mode === "view") && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleDateTimeChange = (name, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [name]: newValue ? dayjs(newValue).format("YYYY-MM-DD HH:mm:ss") : "",
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.attendance_date) {
      errors.attendance_date = "Attendance Date is required.";
    }

    if (!formData.employee_id) {
      errors.employee_id = "Employee is required.";
    }

    if (!formData.attendance_log_type) {
      errors.attendance_log_type = "Attendance Log Type is required.";
    }

    if (!formData.attendance_log_time) {
      errors.attendance_log_time = "Attendance Log Time is required.";
    }

    if( mode === "edit" && !formData.remarks){
      errors.remarks = "Remarks is required to Edit the time log.";
    }

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {

        let dd =  {
          ...formData,
          remarks: formData.remarks +   ` Edited By ${userData?.full_name} --   user Id is ${userData?.application_user_id} -- (Edited on ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')})`
        }


        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-time-logs/${id}`,
          dd,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {

        let dd =  {
          ...formData,
          remarks: ` Created By ${userData?.full_name} --   user Id is ${userData?.application_user_id} -- (created on ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')})`
        }



        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-time-logs`,
          dd,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      toast.success(
        mode === "edit"
          ? "Employee Attendance Time Log Updated!"
          : "Employee Attendance Time Log Created!"
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


const formatDisplayDate = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const formatToDatabase = (value) => {
  if (!value) return "";
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
};







  const isDeviationEnabled = (() => {
    if (
      !formData?.attendance_log_time ||
      !formData?.work_shift_start_time ||
      !formData?.work_shift_end_time
    ) {
      return false;
    }

    const attendanceTime = dayjs(formData.attendance_log_time);
    const shiftStart = dayjs(
      `1970-01-01T${formData.work_shift_start_time}`,
      "YYYY-MM-DDTHH:mm"
    );
    const shiftEnd = dayjs(
      `1970-01-01T${formData.work_shift_end_time}`,
      "YYYY-MM-DDTHH:mm"
    );

    if (formData?.attendance_log_type === "Clock In") {
      return attendanceTime.isAfter(shiftStart);
    }
    if (formData?.attendance_log_type === "Clock Out") {
      return attendanceTime.isAfter(shiftEnd);
    }
    return false;
  })();

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Attendance Time Log"}
        addMessage={"Attendance Time Log"}
        homeLink={"/attendance/time-logs"}
        homeText={"Attendance Time Log"}
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

                
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "100%", // ensures proper centering
                  }}
                >

                    <Autocomplete
                  fullWidth
                  options={employee || []}
                  getOptionLabel={(option) =>
                    `${option?.name || ""} -- ${option?.employee_code || ""}`.trim()
                  }
                  value={
                    employee?.find(
                      (emp) => emp.employee_id === formData?.employee_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "employee_id",
                        value: newValue?.employee_id || "",
                      },
                    });
                  }}
                  disabled={mode === "view" || employee?.length === 0  || mode === "view"}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Employee Name/ID"
                      name="employee_id"
                      error={!!formErrors.employee_id}
                      helperText={formErrors.employee_id}
                      required
                      fullWidth
                    />
                  )}
                />


                <TextField
                  select
                  fullWidth
                  label="Attendance Log Type"
                  name="attendance_log_type"
                  disabled= {mode === "view"}
                  value={formData?.attendance_log_type}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange(e);

                    handleChange({
                      target: { name: "deviation_reason_type_id", value: "" },
                    });
                    handleChange({
                      target: { name: "deviation_reason_id", value: "" },
                    });
                    if (value !== "Break Start" && value !== "Break End") {
                      handleChange({
                        target: {
                          name: "attendance_break_type_id",
                          value: "",
                        },
                      });
                    }
                  }}
                  error={!!formErrors.attendance_log_type}
                  helperText={formErrors.attendance_log_type}
                  required
                >
                  <MenuItem value="Clock In">Clock In</MenuItem>
                  <MenuItem value="Clock Out">Clock Out</MenuItem>
                  <MenuItem value="Break Start">Break Start</MenuItem>
                  <MenuItem value="Break End">Break End</MenuItem>
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Attendance Break Type"
                  name="attendance_break_type_id"
                  value={formData?.attendance_break_type_id}
                  onChange={handleChange}
                  error={!!formErrors.attendance_break_type_id}
                  helperText={formErrors.attendance_break_type_id}
                  disabled={
                    !(
                      formData?.attendance_log_type === "Break Start" ||
                      formData?.attendance_log_type === "Break End" || mode === "view"
                    ) || mode === "view"
                  }
                >
                  {breakType?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_attendance_break_type_id}
                        value={option?.organization_attendance_break_type_id}
                      >
                        {option?.attendance_break_type_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                </Box>


              
               

               
<TextField
  fullWidth
  label="Attendance Date"
  name="attendance_date"
  disabled={mode === "view"}
  value={formatDisplayDate(formData.attendance_date)}
  onChange={(e) =>
    handleChange({
      target: {
        name: "attendance_date",
        value: formatToDatabase(e.target.value),
      },
    })
  }
  placeholder="dd/mm/yy"
  error={!!formErrors.attendance_date}
  helperText={formErrors.attendance_date}
  required
/>


                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Shift Start Time"
                    views={["hours", "minutes"]}
                    ampm={true}
                    value={
                      formData?.work_shift_start_time
                        ? new Date(
                            `1970-01-01T${formData?.work_shift_start_time}`
                          )
                        : null
                    }
                    onChange={() => {}}
                    disabled={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        disabled
                        error={!!formErrors.work_shift_start_time}
                        helperText={formErrors.work_shift_start_time}
                      />
                    )}
                  />

                  <TimePicker
                    label="Shift End Time"
                    views={["hours", "minutes"]}
                    ampm={true}
                    value={
                      formData?.work_shift_end_time
                        ? new Date(
                            `1970-01-01T${formData?.work_shift_end_time}`
                          )
                        : null
                    }
                    onChange={() => {}}
                    disabled={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        disabled
                        fullWidth
                        error={!!formErrors.work_shift_end_time}
                        helperText={formErrors.work_shift_end_time}
                      />
                    )}
                  />
                </LocalizationProvider>

                <DateTimePicker
                disabled={mode === "view"}
                  label="Attendance Log Time"
                  value={
                    formData?.attendance_log_time
                      ? dayjs(formData.attendance_log_time)
                      : null
                  }
                  onChange={(newValue) =>
                    handleDateTimeChange("attendance_log_time", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      fullWidth
                      error={!!formErrors.attendance_log_time}
                      helperText={formErrors.attendance_log_time}
                    />
                  )}
                />

              
                <TextField
                  fullWidth
                  label="Remarks"
                  disabled= {mode === "view"}
                  name="remarks"
                  value={formData?.remarks}
                  onChange={handleChange}
                  error={!!formErrors.remarks}
                  helperText={formErrors.remarks}
                  inputProps={{ maxLength: 255 }}
                  multiline
                  required  = {mode === "edit" ? true : false}
                  minRows={3}
                  maxRows={5}
                />

                <TextField
                  select
                  fullWidth
                  label="Deviation Reason  Type"
                  name="deviation_reason_type_id"
                  value={formData?.deviation_reason_type_id}
                  onChange={handleChange}
                  error={!!formErrors.deviation_reason_type_id}
                  helperText={formErrors.deviation_reason_type_id}
                  disabled={!isDeviationEnabled  || mode === "view"}
                  
                >
                  {deviationType?.map((option) => {
                    return (
                      <MenuItem
                        key={
                          option.organization_attendance_deviation_reason_type_id
                        }
                        value={
                          option?.organization_attendance_deviation_reason_type_id
                        }
                      >
                        {option?.deviation_reason_type_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Deviation Reason"
                  name="deviation_reason_id"
                  value={formData?.deviation_reason_id}
                  onChange={handleChange}
                  error={!!formErrors.deviation_reason_id}
                  helperText={formErrors.deviation_reason_id}
                  disabled={!isDeviationEnabled   || mode === "view"}
                >
                  {deviation?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_attendance_deviation_reason_id}
                        value={
                          option?.organization_attendance_deviation_reason_id
                        }
                      >
                        {option?.attendance_deviation_reason_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

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
              </Grid>

              {mode === "edit" && (
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary" // blue color
                    size="medium"
                    onClick={() => navigate(-1)} // cancel navigates back
                    sx={{
                      borderRadius: 2,
                      minWidth: 120,
                      textTransform: "capitalize",
                      fontWeight: 500,
                      mt: 2,
                      backgroundColor: "#1976d2", // standard blue
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
      )}
    </Box>
  );
}

export default AttendanceTimelogsForm;