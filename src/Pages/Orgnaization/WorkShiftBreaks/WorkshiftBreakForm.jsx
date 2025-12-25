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
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import {
  fetchAttendanceBreak,
  fetchAttendanceBreakType,
} from "../../../Apis/Attendance";
import { fetchWorkShift } from "../../../Apis/Workshift-api";

function WorkshiftBreakForm({ mode }) {
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [BreakType, setBreakType] = useState([]);

  const [workshift, setWorkShift] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_attendance_break_id: "",
    organization_work_shift_id: "",
  });

  useEffect(() => {
    {
      fetchAttendanceBreak(org?.organization_id)
        .then((data) => {
          setBreakType(data?.attendance_break);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      fetchWorkShift(org?.organization_id)
        .then((data) => {
          setWorkShift(data?.workshifts?.data);
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
        `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-breaks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.Workshiftbreak;
      setFormData(a);
      setLoading(false);
    };
    if ((mode === "edit" || mode === "view") && id) {
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

    if (!formData.organization_attendance_break_id)
      errors.organization_attendance_break_id = "Atendance break is required.";

    if (!formData.organization_work_shift_id)
      errors.organization_work_shift_id = "Shift is required.";

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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-breaks/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-breaks`,
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
          ? "Workshift Break Updated!"
          : "Workshift Break Created!"
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
        updateMessage={"Workshift Break"}
        addMessage={"Workshift Break"}
        homeLink={"/organization/workshift-break"}
        homeText={"Workshift Break"}
      />
      {loading ? (
        <Grid container spacing={2}>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
      
            <Paper elevation={4} sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <TextField
                  select
                  fullWidth
                  label="Workshift"
                  name="organization_work_shift_id"
                  value={formData.organization_work_shift_id}
                
                  onChange={handleChange}
                  error={!!formErrors.organization_work_shift_id}
                  helperText={formErrors.organization_work_shift_id}
                  required
                    disabled={workshift?.length === 0 || mode === "view"}
                >
                  {workshift?.map((option) => (
                    <MenuItem
                      key={option.organization_work_shift_id}
                      value={option.organization_work_shift_id}
                    >
                      {option?.work_shift_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Break Type"
                  name="organization_attendance_break_id"
                  value={formData.organization_attendance_break_id}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  error={!!formErrors.organization_attendance_break_id}
                  helperText={formErrors.organization_attendance_break_id}
                  required
                >
                  {BreakType?.map((option) => (
                    <MenuItem
                      key={option.organization_attendance_break_id}
                      value={option.organization_attendance_break_id}
                    >
                      {option?.attendance_break_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

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
         
      )}
    </Box>
  );
}

export default WorkshiftBreakForm;
