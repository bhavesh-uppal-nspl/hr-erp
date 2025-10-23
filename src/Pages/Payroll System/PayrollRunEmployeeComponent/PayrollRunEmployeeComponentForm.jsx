import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  Switch,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import {
  fetchPayrollComponents,
  fetchPayrollComponentTypes,
  fetchPayrollRuns,
} from "../../../Apis/Payroll";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";

function PayrollRunEmployeeComponentForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const MAX_INCREMENT = 999999999.99;
  const [formData, setFormData] = useState({
    organization_payroll_run_employee_id: "",
    organization_payroll_component_id: "",
    component_type: "",
    amount: "",
    remarks: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [component, setComponent] = useState([]);
  const [runs, setRuns] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchPayrollComponents(org?.organization_id)
        .then((data) => {
          setRuns(data?.payroll);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);
  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-employee-runs/components/${id}`,
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
    if (!formData.organization_payroll_run_employee_id)
      errors.organization_payroll_run_employee_id =
        "Payroll Employee Run is required.";
    if (!formData.organization_payroll_component_id)
      errors.organization_payroll_component_id =
        "Payroll Component is required.";
    if (!formData.component_type)
      errors.component_type = "Component Type is required.";
    if (!formData.amount) errors.amount = "Amount is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-employee-run/components/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-employee-run/components`,
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
          ? "Payroll Employee Run Components updated!"
          : "Payroll Employee Run Components created!"
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
        updateMessage={"Payroll Employee Run Components"}
        addMessage={"Payroll Employee Run Components"}
        homeLink={"/payroll/employee-run/components"}
        homeText={"Payroll Employee Runs"}
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
                  label="Payroll Run Employee"
                  name="organization_payroll_run_employee_id"
                  value={formData.organization_payroll_run_employee_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_payroll_run_employee_id}
                  helperText={formErrors.organization_payroll_run_employee_id}
                  required
                >
                  {runs?.map((option) => (
                    <MenuItem
                      key={option.organization_payroll_run_employee_id}
                      value={option.organization_payroll_run_employee_id}
                    >
                      {option?.loan_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Payroll Component"
                  name="organization_payroll_component_id"
                  value={formData.organization_payroll_component_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_payroll_component_id}
                  helperText={formErrors.organization_payroll_component_id}
                  required
                >
                  {runs?.map((option) => (
                    <MenuItem
                      key={option.organization_payroll_component_id}
                      value={option.organization_payroll_component_id}
                    >
                      {option?.payroll_component_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Component Type"
                  name="component_type"
                  value={formData.component_type}
                  onChange={handleChange}
                  error={!!formErrors.component_type}
                  helperText={formErrors.component_type}
                  required
                >
                  <MenuItem value="Earning">Earning</MenuItem>
                  <MenuItem value="Deduction">Deduction</MenuItem>
                  <MenuItem value="EmployerContribution">
                    EmployerContribution
                  </MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData?.amount}
                  onChange={(e) => {
                    let value = e.target.value;

                    if (/^\d*$/.test(value)) {
                      if (value === "" || Number(value) <= MAX_INCREMENT) {
                        handleChange(e);
                      } else {
                        e.target.value = MAX_INCREMENT;
                        handleChange(e);
                      }
                    }
                  }}
                  error={!!formErrors.amount}
                  helperText={formErrors.amount}
                  required
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 13,
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
                  rows={6}
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

export default PayrollRunEmployeeComponentForm;
