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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { fetchRotationPatterns, fetchWorkShift } from "../../../Apis/Workshift-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";

function WorkShiftRotationDayForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;


  const [formData, setFormData] = useState({
    day_number: "",
    organization_work_shift_rotation_pattern_id: "",
    organization_work_shift_id: "",
    assignment_date: "",
    is_off_day: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [Pattern, setPattern]=useState([])
  const [shift, setShift] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchWorkShift(org?.organization_id)
        .then((data) => {
          setShift(data?.workshifts?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);


    useEffect(() => {
    {
      fetchRotationPatterns(org?.organization_id)
        .then((data) => {
          setPattern(data?.shiftPattern?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_work_shift_rotation_pattern_id)
      errors.organization_work_shift_rotation_pattern_id =
        "Workshif pattern is required.";

    if (!formData.organization_work_shift_id)
      errors.organization_work_shift_id = "Workshift is required.";

    if (!formData.day_number) errors.day_number = "days are required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/workshift-rotation-days/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("respks", response)
      let a = response?.data;
      setFormData(a);
      setLoading(false);
    };
    if (mode === "edit" && id) {
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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-days/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-days`,
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
          ? "WorkShift Rotation days updated!"
          : "WorkShift Rotation days created!"
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
        updateMessage={"WorkShift Rotation days"}
        addMessage={"WorkShift Rotation days"}
        homeLink={"/organization/work-shift-rotation-days"}
        homeText={"WorkShift Rotation days"}
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
                  label="Rotation pattern"
                  name="organization_work_shift_rotation_pattern_id"
                  value={formData?.organization_work_shift_rotation_pattern_id}
                  onChange={handleChange}
                  error={
                    !!formErrors.organization_work_shift_rotation_pattern_id
                  }
                  helperText={
                    formErrors.organization_work_shift_rotation_pattern_id
                  }
                  required
                >
                  {Pattern?.map((option) => (
                    <MenuItem
                      key={option.organization_work_shift_rotation_pattern_id}
                      value={option.organization_work_shift_rotation_pattern_id}
                    >
                      {option?.pattern_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  type="number"
                  label="No. of days"
                  name="day_number"
                  value={formData?.day_number}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) <= 366) {
                      handleChange(e);
                    }
                  }}
                  error={!!formErrors.day_number}
                  helperText={formErrors.day_number}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: "1", max: "366" }}
                />

                 <FormControlLabel
                  control={
                    <Switch
                      checked={
                        formData.is_off_day === "1" ||
                        formData.is_off_day === true
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_off_day: e.target.checked,
                        }))
                      }
                      color="primary"
                    />
                  }
                  label="Day Off"
                />

                <TextField
                  select
                  fullWidth
                  label="Shift"
                  name="organization_work_shift_id"
                  value={formData?.organization_work_shift_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_work_shift_id}
                  helperText={formErrors.organization_work_shift_id}
                  required
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

export default WorkShiftRotationDayForm;

