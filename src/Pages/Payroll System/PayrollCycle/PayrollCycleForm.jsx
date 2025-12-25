import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  Switch,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchPayrollComponentTypes } from "../../../Apis/Payroll";

function PayrollCycleForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;


  const [formData, setFormData] = useState({
    pay_frequency: "",
    payroll_cycle_name : "",
    monthly_period_start_day: "",
    week_start_day: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  let navigate = useNavigate();


  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-cycle/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.payroll;
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

    if (!formData.monthly_period_start_day)
      errors.monthly_period_start_day = "Monthly period start day required.";

    if (!formData.week_start_day)
      errors.week_start_day =
        "Week start day is required.";

    if (!formData.pay_frequency)
      errors.pay_frequency = "pay frequency is required.";
    setFormErrors(errors);

    if (!formData.payroll_cycle_name)
      errors.payroll_cycle_name = "payroll cycle name  is required.";
    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-cycle/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-cycle`,
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
          ? "Payroll Cycle updated!"
          : "Payroll Cycle created!"
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
        updateMessage={"Payroll Cycles"}
        addMessage={"Payroll Cycles"}
        homeLink={"/payroll/cycles"}
        homeText={"Payroll Cycles"}
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
                  label="Payroll cycle Name"
                  name="payroll_cycle_name"
                  value={formData.payroll_cycle_name}
                  onChange={handleChange}
                  error={!!formErrors.payroll_cycle_name}
                  helperText={formErrors.payroll_cycle_name}
                  inputProps={{ maxLength: 100 }}
                />

                <TextField
                  fullWidth
                  label="Monthly period start day"
                  name="monthly_period_start_day"
                  type="number"
                  value={formData?.monthly_period_start_day}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      if (value === "" || Number(value) <= 127) {
                        handleChange(e);
                      } else {
                        e.target.value = 127;
                        handleChange(e);
                      }
                    }
                  }}
                  error={!!formErrors.monthly_period_start_day}
                  helperText={formErrors.monthly_period_start_day}
                  inputProps={{
                    min: 0,
                    max: 127,
                    maxLength: 3, 
                  }}
                />

                <TextField
                  select
                  fullWidth
                  label="Pay Frequency"
                  name="pay_frequency"
                  value={formData.pay_frequency}
                  onChange={handleChange}
                  error={!!formErrors.pay_frequency}
                  helperText={formErrors.pay_frequency}
                  required
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="SemiMonthly">SemiMonthly</MenuItem>
                  <MenuItem value="BiWeekly">BiWeekly</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Week day start"
                  name="week_start_day"
                  value={formData.week_start_day}
                  onChange={handleChange}
                  error={!!formErrors.week_start_day}
                  helperText={formErrors.week_start_day}
                  required
                >
                  <MenuItem value="Mon">Mon</MenuItem>
                  <MenuItem value="Tue">Tue</MenuItem>
                  <MenuItem value="Wed">Wed</MenuItem>
                  <MenuItem value="Thu">Thu</MenuItem>
                  <MenuItem value="Fri">Fri</MenuItem>
                  <MenuItem value="Sat">Sat</MenuItem>
                  <MenuItem value="Sun">Sun</MenuItem>
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
      )}
    </Box>
  );
}

export default PayrollCycleForm;
