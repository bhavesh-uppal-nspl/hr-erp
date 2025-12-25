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

function PayrollSecurityForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const MAX_INCREMENT = 999999999.99;
  const [formData, setFormData] = useState({
    employee_id: "",
    advance_date: "",
    advance_amount: "",
    balance_amount: "",
    recovery_months: "",
    installment_amount: "",
    recovery_start_month: "",
    status: "",
    remarks: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  let navigate = useNavigate();

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
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-security/${id}`,
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

    if (!formData.employee_id)
      errors.employee_id = "Employee is required.";

    if (!formData.recovery_start_month)
      errors.recovery_start_month =
        "Recovery start date is required.";

    if (!formData.security_amount)
      errors.security_amount = "Security Amount is required.";

    if (!formData.balance_amount)
      errors.balance_amount = "Balance Amount is required.";

    if (!formData.recovery_months)
      errors.recovery_months = "Recovery Months are required.";

    if (!formData.installment_amount) errors.installment_amount = "Installment Amt required.";

    if (!formData.recovery_start_month)
      errors.recovery_start_month = "Recovery Start date required.";

    if (!formData.status) errors.status = "Status is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-security/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-security`,
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
          ? "Payroll Security  updated!"
          : "Payroll Security created!"
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
        updateMessage={"Payroll Security"}
        addMessage={"Payroll Security"}
        homeLink={"/payroll/securities"}
        homeText={" Payroll Security"}
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
                  fullWidth
                  label="Recovery Start Month"
                  name="recovery_start_month"
                  type="date"
                  value={formData.recovery_start_month}
                  onChange={handleChange}
                  error={!!formErrors.recovery_start_month}
                  helperText={formErrors.recovery_start_month}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Security Amount"
                  name="security_amount"
                  type="number"
                  value={formData?.security_amount}
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
                  error={!!formErrors.security_amount}
                  helperText={formErrors.security_amount}
                  required
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 13,
                  }}
                />

                <TextField
                  fullWidth
                  label="Balance Amount"
                  name="balance_amount"
                  type="number"
                  value={formData?.balance_amount}
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
                  error={!!formErrors.balance_amount}
                  helperText={formErrors.balance_amount}
                  required
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 13,
                  }}
                />

                <TextField
                  fullWidth
                  label="Recovry Months"
                  name="recovery_months"
                  type="number"
                  value={formData?.recovery_months}
                  onChange={(e) => {
                    let value = e.target.value;

                    // Allow only numbers or empty value
                    if (/^\d*$/.test(value)) {
                      if (value === "" || Number(value) <= 127) {
                        // tinyint signed max = 127
                        handleChange(e);
                      } else {
                        e.target.value = 127;
                        handleChange(e);
                      }
                    }
                  }}
                  error={!!formErrors.recovery_months}
                  helperText={formErrors.recovery_months}
                  inputProps={{
                    min: 0,
                    max: 127,
                    maxLength: 3,
                  }}
                />

                <TextField
                  fullWidth
                  label="Instalment Amount"
                  name="installment_amount"
                  type="number"
                  value={formData?.installment_amount}
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
                  error={!!formErrors.installment_amount}
                  helperText={formErrors.installment_amount}
                  required
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 13,
                  }}
                />

                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  error={!!formErrors.status}
                  helperText={formErrors.status}
                  required
                >
               
                  <MenuItem value="Agreed">Agreed</MenuItem>
                  <MenuItem value="InRecovery">InRecovery</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Refunded">Refunded</MenuItem>
                  <MenuItem value="Forfeited">Forfeited</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>

                </TextField>

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

export default PayrollSecurityForm;
