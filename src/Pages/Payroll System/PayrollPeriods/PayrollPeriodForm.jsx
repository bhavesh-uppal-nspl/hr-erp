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
import { fetchPayrollCycle } from "../../../Apis/Payroll";

function PayrollPeriodForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const MAX_INCREMENT = 999999999.99;
  const [formData, setFormData] = useState({
    organization_payroll_cycle_id: "",
    period_name: "",
    period_start: "",
    period_end: "",
    period_month: "",
    period_year: "",
    is_closed: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [cycle, setCycle] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchPayrollCycle(org?.organization_id)
        .then((data) => {
          setCycle(data?.payroll);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);
  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-period/${id}`,
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
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_payroll_cycle_id)
      errors.organization_payroll_cycle_id = "Payroll cycle is required.";

    if (!formData.period_name) errors.period_name = "Loan Name is required.";

    if (!formData.period_start)
      errors.period_start = "Period start is required.";

    if (!formData.period_end) errors.period_end = "Period End is required.";

    if (!formData.period_month)
      errors.period_month = "Period Month is required.";

    if (!formData.period_year) errors.period_year = "Period yaer is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-period/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-period`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit" ? "Payroll Period updated!" : "Payroll Period created!"
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
        updateMessage={"Payroll Periods"}
        addMessage={"Payroll Periods"}
        homeLink={"/payroll/periods"}
        homeText={"Payroll Periods"}
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
                  label="Payroll Cycle"
                  name="organization_payroll_cycle_id"
                  value={formData.organization_payroll_cycle_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_payroll_cycle_id}
                  helperText={formErrors.organization_payroll_cycle_id}
                  required
                >
                  {cycle?.map((option) => (
                    <MenuItem
                      key={option.organization_payroll_cycle_id}
                      value={option.organization_payroll_cycle_id}
                    >
                      {option?.payroll_cycle_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Period Start Date"
                  name="period_start"
                  type="date"
                  value={formData.period_start}
                  onChange={handleChange}
                  error={!!formErrors.period_start}
                  helperText={formErrors.period_start}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Period End Date"
                  name="period_end"
                  type="date"
                  value={formData.period_end}
                  onChange={handleChange}
                  error={!!formErrors.period_end}
                  helperText={formErrors.period_end}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Period Month"
                  name="period_month"
                  type="number"
                  value={formData?.period_month}
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
                  error={!!formErrors.period_month}
                  helperText={formErrors.period_month}
                  required
                  inputProps={{
                    min: 0,
                    max: 127,
                    maxLength: 3,
                  }}
                />

                <TextField
                  fullWidth
                  label="Period Year"
                  name="period_year"
                  type="number"
                  required
                  value={formData?.period_year}
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
                  error={!!formErrors.period_year}
                  helperText={formErrors.period_year}
                  inputProps={{
                    min: 0,
                    max: 127,
                    maxLength: 3,
                  }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        formData?.is_closed === 1 || formData?.is_closed === "1"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "is_closed",
                            value: e.target.checked ? 1 : 0,
                          },
                        })
                      }
                      color="primary"
                    />
                  }
                  label="Is closed"
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

export default PayrollPeriodForm;
