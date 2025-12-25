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
import { fetchWorkShift } from "../../../Apis/Workshift-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";

function WorkShiftRotationPatternForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    pattern_name: "",
    cycle_days: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.pattern_name)
      errors.pattern_name = "Pattern name is required.";

    if (!formData.cycle_days) errors.cycle_days = "cycle days are required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-pattern/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.shiftpatterns;
      setFormData(a);
      setLoading(false);
    };
    if ((mode === "edit"  || mode ==="view") && id) {
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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-pattern/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-pattern`,
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
          ? "WorkShift rotation pattern updated!"
          : "WorkShift  rotation pattern created!"
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
        updateMessage={"WorkShift Rotation Pattern"}
        addMessage={"WorkShift Rotation Pattern"}
        homeLink={"/organization/work-shift-rotation-pattern"}
        homeText={"WorkShift Rotation Pattern"}
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
                  label="Pattern Name"
                  name="pattern_name"
                  disabled={mode === "view"}
                  value={formData.pattern_name}
                  onChange={handleChange}
                  error={!!formErrors.pattern_name}
                  helperText={formErrors.pattern_name}
                  inputProps={{ maxLength: 100 }}
                  required
                />

                <TextField
                  fullWidth
                  type="number"
                  disabled= {mode === "view"}
                  label="pattern Days"
                  name="cycle_days"
                  value={formData?.cycle_days}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) <= 366) {
                      handleChange(e);
                    }
                  }}
                  error={!!formErrors.cycle_days}
                  helperText={formErrors.cycle_days}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: "1", max: "366" }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  disabled={mode === "view"}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  inputProps={{ maxLength: 255 }}
                  multiline
                  minRows={3}
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
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default WorkShiftRotationPatternForm;
