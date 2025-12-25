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
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import {
  fetchEmployeePayrollReimbursementTypes,
  fetchPayrollRuns,
} from "../../../Apis/Payroll";

function PayrollJourneyEntriesForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [employee, setEmployee] = useState([]);
  const [runs, setRun] = useState([]);

  const MAX_INCREMENT = 99999999999999;

  const [formData, setFormData] = useState({
    employee_id: "",
    organization_payroll_run_id: "",
    journal_date: "",
    account_code: "",
    account_name: "",
    debit_amount: "",
    credit_amount: "",
    reference_type: "",
    reference_id: "",
    remarks: "",
  });

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

  useEffect(() => {
    {
      fetchPayrollRuns(org?.organization_id)
        .then((data) => {
          setRun(data?.payroll);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-adjustment/${id}`,
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

    if (!formData.employee_id) errors.employee_id = "Employee is required.";

    if (!formData.journal_date)
      errors.journal_date = "Journal date is required.";

    if (!formData.account_code)
      errors.account_code = "Account Date is required.";
    setFormErrors(errors);

    if (!formData.account_name)
      errors.account_name = "Account Name is required.";
    setFormErrors(errors);

    if (!formData.debit_amount) errors.debit_amount = "Debit Amount is required.";

    if (!formData.credit_amount) errors.credit_amount = "Credit Amount is required.";

    if (!formData.reference_type) errors.reference_type = "Reference Type is required.";
    if (!formData.organization_payroll_run_id) errors.organization_payroll_run_id = "Payroll Run is required.";
    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-adjustment/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-adjustment`,
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
          ? "Payroll Adjustment updated!"
          : "Payroll Adjustment created!"
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
        updateMessage={"Payroll Adjustments"}
        addMessage={"Payroll Adjustments"}
        homeLink={"/payroll/adjustments"}
        homeText={"Payroll Adjustments"}
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
                  label="Payroll Run"
                  name="organization_payroll_run_id"
                  value={formData.organization_payroll_run_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_payroll_run_id}
                  helperText={formErrors.organization_payroll_run_id}
                  required
                >
                  {runs?.map((option) => (
                    <MenuItem
                      key={option.organization_payroll_run_id}
                      value={option.organization_payroll_run_id}
                    >
                      {option?.payroll_component_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Journal Date"
                  name="journal_date"
                  type="date"
                  value={formData.journal_date}
                  onChange={handleChange}
                  error={!!formErrors.journal_date}
                  helperText={formErrors.journal_date}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Account Code"
                  name="account_code"
                  value={formData.account_code}
                  onChange={handleChange}
                  required
                  error={!!formErrors.account_code}
                  helperText={formErrors.account_code}
                  inputProps={{ maxLength: 50 }}
                />

                <TextField
                  fullWidth
                  label="Account Name"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                  required
                  error={!!formErrors.account_name}
                  helperText={formErrors.account_name}
                  inputProps={{ maxLength: 255 }}
                />

                <TextField
                  fullWidth
                  label="Debit Amount"
                  name="debit_amount"
                  type="number"
                  value={formData?.debit_amount}
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
                  error={!!formErrors.debit_amount}
                  helperText={formErrors.debit_amount}
                  required
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 14,
                  }}
                />

                <TextField
                  fullWidth
                  label="Credit Amount"
                  name="credit_amount"
                  type="number"
                  value={formData?.credit_amount}
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
                  error={!!formErrors.credit_amount}
                  helperText={formErrors.credit_amount}
                  required
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 14,
                  }}
                />

                <TextField
                  select
                  fullWidth
                  label="Reference Type"
                  name="reference_type"
                  value={formData.reference_type}
                  onChange={handleChange}
                  error={!!formErrors.reference_type}
                  helperText={formErrors.reference_type}
                  required
                >
                  <MenuItem value="Component">Component</MenuItem>
                  <MenuItem value="Advance">Advance</MenuItem>
                  <MenuItem value="Loan">Loan</MenuItem>
                  <MenuItem value="Security">Security</MenuItem>
                  <MenuItem value="Reimbursement">Reimbursement</MenuItem>
                  <MenuItem value="Adjustment">Adjustment</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>

                <TextField
                  label="Reference ID"
                  name="reference_id"
                  value={formData.reference_id}
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  helperText={formErrors.reference_id}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
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

export default PayrollJourneyEntriesForm;
