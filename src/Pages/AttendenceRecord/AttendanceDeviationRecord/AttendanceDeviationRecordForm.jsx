import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";

import {
  fetchLeaveCategory,
  fetchLeaveReason,
  fetchLeaveTypes,
  fetchOrganizationLeaveReasonTypes,
} from "../../../Apis/Leave-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import dayjs from "dayjs";
import { fetchAttendanceDeviationReasonType } from "../../../Apis/Attendance";

function AttendanceDeviationRecordForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_attendance_deviation_reason_type_id: "",
    attendance_deviation_reason_name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [deviationType, setDeviationType] = useState([]);


  let navigate = useNavigate();


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


  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/attendance-deviation-reason/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.deviationReason;
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

    if (!formData.organization_attendance_deviation_reason_type_id) {
      errors.organization_attendance_deviation_reason_type_id =
        "Attendance Deviation Reason Type is required.";
    }

    if (!formData.attendance_deviation_reason_name) {
      errors.attendance_deviation_reason_name =
        "Attendance Deviation Reason is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/attendance-deviation-reason/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/attendance-deviation-reason`,
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
          ? "Attendance Deviation Reason  Updated!"
          : "Attendance Deviation Reason Created!"
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
        updateMessage={"Attendance Deviation Reason"}
        addMessage={"Attendance Deviation Reason"}
        homeLink={"/attendance/deviation-reason"}
        homeText={"Attendance Deviation Reason"}
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
                  label="Deviation Reason Type"
                  name="organization_attendance_deviation_reason_type_id"
                  value={formData.organization_attendance_deviation_reason_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_attendance_deviation_reason_type_id}
                  helperText={formErrors.organization_attendance_deviation_reason_type_id}
                  required
                >
                  {deviationType.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_attendance_deviation_reason_type_id}
                        value={option.organization_attendance_deviation_reason_type_id}
                      >
                        {option?.deviation_reason_type_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  fullWidth
                  label="Deviation Reason"
                  name="attendance_deviation_reason_name"
                  value={formData.attendance_deviation_reason_name}
                  onChange={handleChange}
                  error={!!formErrors.attendance_deviation_reason_name}
                  helperText={formErrors.attendance_deviation_reason_name}
                  required
                  inputProps={{ maxLength: 100 }}
                />

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

export default AttendanceDeviationRecordForm;
