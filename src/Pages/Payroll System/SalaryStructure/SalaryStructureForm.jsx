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
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";

function SalaryStructureForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const MAX_INCREMENT = 999999999.99;

  const [formData, setFormData] = useState({
    organization_payroll_component_type_id: "",
    payroll_component_name: "",
    calculation_method: "",
    fixed_amount: "",
    percentage_of_component: "",
    formula_json: "",
    taxable: "",
    affects_net_pay: "",
    rounding_rule: "",
    rounding_precision: "",
    sort_order: "",
    is_active: "",
    effective_from: "",
    effective_to: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [cycles, setCycles] = useState([]);
  const [employee, setEmployee] = useState([]);
  let navigate = useNavigate();
  const [time, setTime] = useState([]);

  useEffect(() => {
    {
      fetchPayrollCycle(org?.organization_id)
        .then((data) => {
          setCycles(data?.payroll);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      fetchOrganizationEmployee(org?.organization_id)
        .then((data) => {
          setEmployee(data?.employees);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  console.log("employees is ", employee);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/employee-salary-structure/${id}`,
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
  if (name === "salary_basis") {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      hourly_salary_amount: "",
      daily_salary_amount: "",
      monthly_salary_amount: "",
      annual_salary_amount: "",
    }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  setFormErrors((prev) => ({ ...prev, [name]: "" }));
};


  const validateForm = () => {
    const errors = {};

    if (!formData.employee_id) errors.employee_id = "Employee is required.";

    if (!formData.organization_payroll_cycle_id)
      errors.organization_payroll_cycle_id = "Payroll cycle type is required.";

    if (!formData.salary_basis)
      errors.salary_basis = "Basic salary is required.";

    if (!formData.effective_from)
      errors.effective_from = "Start date is required.";

    if (!formData.effective_to) errors.effective_to = "End date is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employee-salary-structure/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employee-salary-structure`,
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
          ? "Employee Salary Structure updated!"
          : "Employee Salary Structure created!"
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

  // Helper: calculate salaries from any basis
const calculateAllSalaries = ({ basis, value, durationMinutes }) => {
  if (!value) {
    return {
      hourly_salary_amount: "",
      daily_salary_amount: "",
      monthly_salary_amount: "",
      annual_salary_amount: "",
    };
  }

  const hoursPerDay = durationMinutes / 60 || 8;
  const workingDaysPerMonth = 30;
  const monthsPerYear = 12;

  let hourly = 0, daily = 0, monthly = 0, annual = 0;

  switch (basis) {
    case "Hourly":
      hourly = value;
      daily = hourly * hoursPerDay;
      monthly = daily * workingDaysPerMonth;
      annual = monthly * monthsPerYear;
      break;
    case "Daily":
      daily = value;
      hourly = daily / hoursPerDay;
      monthly = daily * workingDaysPerMonth;
      annual = monthly * monthsPerYear;
      break;
    case "Monthly":
      monthly = value;
      annual = monthly * monthsPerYear;
      daily = monthly / workingDaysPerMonth;
      hourly = daily / hoursPerDay;
      break;
    case "Yearly":
      annual = value;
      monthly = annual / monthsPerYear;
      daily = monthly / workingDaysPerMonth;
      hourly = daily / hoursPerDay;
      break;
  }

  return {
    hourly_salary_amount: parseFloat(hourly.toFixed(2)),
    daily_salary_amount: parseFloat(daily.toFixed(2)),
    monthly_salary_amount: parseFloat(monthly.toFixed(2)),
    annual_salary_amount: parseFloat(annual.toFixed(2)),
  };
};


  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Employee Salary Structure"}
        addMessage={"Salary Structure"}
        homeLink={"/payroll/employee-salary-structure"}
        homeText={"Employee Salary Structure"}
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
                  label="Payroll Cycle"
                  name="organization_payroll_cycle_id"
                  value={formData.organization_payroll_cycle_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_payroll_cycle_id}
                  helperText={formErrors.organization_payroll_cycle_id}
                  required
                >
                  {cycles?.map((option) => (
                    <MenuItem
                      key={option.organization_payroll_cycle_id}
                      value={option.organization_payroll_cycle_id}
                    >
                      {option?.payroll_cycle_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Salary Basis"
                  name="salary_basis"
                  value={formData.salary_basis}
                  onChange={handleChange}
                  error={!!formErrors.salary_basis}
                  helperText={formErrors.salary_basis}
                  required
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Hourly">Hourly</MenuItem>
                </TextField>

                {/* Hourly Salary */}
                <TextField
                  fullWidth
                  label="Hourly Salary Amount"
                  name="hourly_salary_amount"
                  type="number"
                  value={formData?.hourly_salary_amount || ""}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      if (value === "" || Number(value) <= MAX_INCREMENT) {
                        const selectedEmployee = employee?.find(
                          (emp) => emp.employee_id === formData.employee_id
                        );
                        const duration =
                          selectedEmployee?.workshift?.work_duration_minutes ||
                          480;

                        const salaries = calculateAllSalaries({
                          basis: "Hourly",
                          value: Number(value),
                          durationMinutes: duration,
                        });

                        setFormData((prev) => ({
                          ...prev,
                          ...salaries,
                        }));
                      }
                    }
                  }}
                  error={!!formErrors.hourly_salary_amount}
                  helperText={formErrors.hourly_salary_amount}
                  inputProps={{ min: 0, max: MAX_INCREMENT, maxLength: 13 }}
                />

                {/* Daily Salary */}
                <TextField
                  fullWidth
                  label="Daily Salary Amount"
                  name="daily_salary_amount"
                  type="number"
                  value={formData?.daily_salary_amount || ""}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      if (value === "" || Number(value) <= MAX_INCREMENT) {
                        const selectedEmployee = employee?.find(
                          (emp) => emp.employee_id === formData.employee_id
                        );
                        const duration =
                          selectedEmployee?.workshift?.work_duration_minutes ||
                          480;

                        const salaries = calculateAllSalaries({
                          basis: "Daily",
                          value: Number(value),
                          durationMinutes: duration,
                        });

                        setFormData((prev) => ({
                          ...prev,
                          ...salaries,
                        }));
                      }
                    }
                  }}
                  error={!!formErrors.daily_salary_amount}
                  helperText={formErrors.daily_salary_amount}
                  inputProps={{ min: 0, max: MAX_INCREMENT, maxLength: 13 }}
                />

                {/* Monthly Salary */}
                <TextField
                  fullWidth
                  label="Monthly Salary Amount"
                  name="monthly_salary_amount"
                  type="number"
                  value={formData?.monthly_salary_amount || ""}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      if (value === "" || Number(value) <= MAX_INCREMENT) {
                        const selectedEmployee = employee?.find(
                          (emp) => emp.employee_id === formData.employee_id
                        );
                        const duration =
                          selectedEmployee?.workshift?.work_duration_minutes ||
                          480;

                        const salaries = calculateAllSalaries({
                          basis: "Monthly",
                          value: Number(value),
                          durationMinutes: duration,
                        });

                        setFormData((prev) => ({
                          ...prev,
                          ...salaries,
                        }));
                      }
                    }
                  }}
                  error={!!formErrors.monthly_salary_amount}
                  helperText={formErrors.monthly_salary_amount}
                  inputProps={{ min: 0, max: MAX_INCREMENT, maxLength: 13 }}
                />

                {/* Annual Salary */}
                <TextField
                  fullWidth
                  label="Annual Salary Amount"
                  name="annual_salary_amount"
                  type="number"
                  value={formData?.annual_salary_amount || ""}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      if (value === "" || Number(value) <= MAX_INCREMENT) {
                        const selectedEmployee = employee?.find(
                          (emp) => emp.employee_id === formData.employee_id
                        );
                        const duration =
                          selectedEmployee?.workshift?.work_duration_minutes ||
                          480;

                        const salaries = calculateAllSalaries({
                          basis: "Yearly",
                          value: Number(value),
                          durationMinutes: duration,
                        });

                        setFormData((prev) => ({
                          ...prev,
                          ...salaries,
                        }));
                      }
                    }
                  }}
                  error={!!formErrors.annual_salary_amount}
                  helperText={formErrors.annual_salary_amount}
                  inputProps={{ min: 0, max: MAX_INCREMENT, maxLength: 13 }}
                />

                <TextField
                  fullWidth
                  label="Effective From"
                  name="effective_from"
                  type="date"
                  value={formData.effective_from}
                  onChange={handleChange}
                  error={!!formErrors.effective_from}
                  helperText={formErrors.effective_from}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Effective to"
                  name="effective_to"
                  type="date"
                  value={formData.effective_to}
                  onChange={handleChange}
                  error={!!formErrors.effective_to}
                  helperText={formErrors.effective_to}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  error={!!formErrors.remarks}
                  helperText={formErrors.remarks}
                  inputProps={{ maxLength: 255 }}
                  
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
export default SalaryStructureForm;
