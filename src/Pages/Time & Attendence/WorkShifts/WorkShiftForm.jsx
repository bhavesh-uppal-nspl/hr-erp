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
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { fetchWorkShiftTypes } from "../../../Apis/Workshift-api";
import { fetchOrganizationLocation } from "../../../Apis/DepartmentLocation-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";

function WorkShiftForm({ mode }) {
  const { id } = useParams(); // only used in edit mode
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_work_shift_type_id: "",
    organization_location_id: "",
    work_shift_name: "",
    work_shift_start_time: "",
    work_shift_end_time: "",
    break_duration_minutes: "",
    work_duration_minutes: "",
    is_active: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [location, setLocation] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchWorkShiftTypes(org.organization_id)
        .then((data) => {
          setShiftTypes(data.workshifttype.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      fetchOrganizationLocation(org.organization_id)
        .then((data) => {
          setLocation(data.locations);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);
  console.log("locations ", location);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_work_shift_type_id)
      errors.organization_work_shift_type_id = "Shift Type is required.";

    if (!formData.organization_location_id)
      errors.organization_location_id = "Location is required.";

    if (!formData.work_shift_name)
      errors.work_shift_name = "Shift Name is required.";

    if (!formData.work_duration_minutes)
      errors.work_duration_minutes = "Work duration is required.";

    if (!formData.work_shift_start_time)
      errors.work_shift_start_time = "Start Time is required.";

    if (!formData.work_shift_end_time)
      errors.work_shift_end_time = "End Time is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/workshift/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response.data.workshift;

      console.log("updated data is ", a);

      setFormData({
        ...a,
        work_shift_start_time: a.work_shift_start_time?.slice(0, 5),
        work_shift_end_time: a.work_shift_end_time?.slice(0, 5),
        is_active: a.is_active === 1 || a.is_active === "1",
      });
      setLoading(false);
    };
    if ((mode === "edit"  || mode === "view" ) && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setbtnLoading(true);
    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/workshift/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/workshift`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit" ? "WorkShift updated!" : "WorkShift created!"
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
        updateMessage={"WorkShift"}
        addMessage={"WorkShift"}
        homeLink={"/organization/work-shift"}
        homeText={"WorkShift"}
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
                  label="Shift Name"
                  name="work_shift_name"
                  value={formData.work_shift_name}
                  onChange={handleChange}
                  error={!!formErrors.work_shift_name}
                  disabled={mode === "view"}
                  helperText={formErrors.work_shift_name}
                  required
                />
{/* 
                <TextField
                  select
                  fullWidth
                  label="Shift Type"
                  name="organization_work_shift_type_id"
                  value={formData.organization_work_shift_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_work_shift_type_id}
                  helperText={formErrors.organization_work_shift_type_id}
                  required
                       disabled={mode === "view"   ||  shiftTypes?.length === 0}
                >
                  {shiftTypes?.map((option) => (
                    <MenuItem
                      key={option.organization_work_shift_type_id}
                      value={option.organization_work_shift_type_id}
                    >
                      {option.work_shift_type_name}
                    </MenuItem>
                  ))}
                </TextField> */}



<Autocomplete
                fullWidth
                  options={shiftTypes || []}
                  getOptionLabel={(option) =>
                    option.work_shift_type_name || ""
                  }
                  value={
                    shiftTypes?.find(
                      (option) =>
                        option.organization_work_shift_type_id ===
                        formData.organization_work_shift_type_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "organization_work_shift_type_id",
                        value:
                          newValue?.organization_work_shift_type_id ||
                          "",
                      },
                    });
                  }}
                  disabled={mode === "view" || shiftTypes?.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Shift Type"
                      error={
                        !!formErrors.organization_work_shift_type_id
                      }
                      helperText={
                        formErrors.organization_work_shift_type_id
                      }
                      required
                      fullWidth
                    />
                  )}
                />






                 <Autocomplete
                fullWidth
                  options={location || []}
                  getOptionLabel={(option) =>
                    option.location_name || ""
                  }
                  value={
                    location?.find(
                      (option) =>
                        option.organization_location_id ===
                        formData.organization_location_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "organization_location_id",
                        value:
                          newValue?.organization_location_id ||
                          "",
                      },
                    });
                  }}
                  disabled={mode === "view" || location?.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Location"
                      error={
                        !!formErrors.organization_location_id
                      }
                      helperText={
                        formErrors.organization_location_id
                      }
                      required
                      fullWidth
                    />
                  )}
                />






                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  {/* Start Time */}
                  <TimePicker
                    label="Start Time"
                     disabled={mode === "view"}
                    views={["hours", "minutes"]}
                    ampm={true}
                    value={
                      formData.work_shift_start_time
                        ? new Date(
                            `1970-01-01T${formData.work_shift_start_time}`
                          )
                        : null
                    }
                    onChange={(newValue) => {
                      const formatted = newValue
                        ? format(newValue, "HH:mm")
                        : "";
                      setFormData((prev) => ({
                        ...prev,
                        work_shift_start_time: formatted,
                      }));
                      setFormErrors((prev) => ({
                        ...prev,
                        work_shift_start_time: "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                       
                        error={!!formErrors.work_shift_start_time}
                        helperText={formErrors.work_shift_start_time}
                        required
                      />
                    )}
                  />

                  {/* End Time */}
                  <TimePicker
                    label="End Time"
                     disabled={mode === "view"}
                    views={["hours", "minutes"]}
                    ampm={true}
                    value={
                      formData.work_shift_end_time
                        ? new Date(`1970-01-01T${formData.work_shift_end_time}`)
                        : null
                    }
                    onChange={(newValue) => {
                      const formatted = newValue
                        ? format(newValue, "HH:mm")
                        : "";
                      setFormData((prev) => ({
                        ...prev,
                        work_shift_end_time: formatted,
                      }));
                      setFormErrors((prev) => ({
                        ...prev,
                        work_shift_end_time: "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                       
                        error={!!formErrors.work_shift_end_time}
                        helperText={formErrors.work_shift_end_time}
                        required
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormControlLabel
                  control={
                    <Switch
                     disabled={mode === "view"}
                      checked={
                        formData.is_active === "1" ||
                        formData.is_active === true
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_active: e.target.checked,
                        }))
                      }
                      color="primary"
                    />
                  }
                  label="Is Active"
                />

                {["15", "30", "45", "60"].includes(
                  String(formData.break_duration_minutes)
                ) || formData.break_duration_minutes === "" ? (
                  <TextField
                    select
                    fullWidth
                    label="Break Duration (minutes)"
                     disabled={mode === "view"}
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
                     disabled={mode === "view"}
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
                        disabled={mode === "view"}
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
                  type="number"
                  label="Work Duration (minutes)"
                  name="work_duration_minutes"
                   disabled={mode === "view"}
                  value={formData.work_duration_minutes}
                  onChange={(e) => {
                    let value = e.target.value;

                    // Prevent going above max
                    if (value !== "" && Number(value) > 24860) {
                      value = 24860;
                    }

                    setFormData((prev) => ({
                      ...prev,
                      work_duration_minutes: value,
                    }));
                  }}
                  InputProps={{
                    inputProps: {
                      min: 1,
                      max: 24860, // <-- max allowed
                      step: 1,
                    },
                    endAdornment: (
                      <Button
                        size="small"
                         disabled={mode === "view"}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            work_duration_minutes: "",
                          }))
                        }
                      >
                        Cancel
                      </Button>
                    ),
                  }}
                  error={!!formErrors.work_duration_minutes}
                  helperText={formErrors.work_duration_minutes}
                  required
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
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
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

export default WorkShiftForm;
