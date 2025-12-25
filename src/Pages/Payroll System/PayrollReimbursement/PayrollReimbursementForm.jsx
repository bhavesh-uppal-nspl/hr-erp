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
import { fetchEmployeePayrollReimbursementTypes } from "../../../Apis/Payroll";

function PayrollReimbursementForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [employee,setEmployee] = useState([]);
  const [reim,setReim] = useState([]);

  const MAX_INCREMENT = 99999999999999;

  const [formData, setFormData] = useState({
    employee_id: "",
    organization_payroll_reimbursement_type_id: "",
    claim_date: "",
    claim_amount: "",
    approved_amount: "",
    status: "",
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
        fetchEmployeePayrollReimbursementTypes(org?.organization_id)
          .then((data) => {
            setReim(data?.payroll);
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
        `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-reimbursements/${id}`,
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

    if (!formData.claim_date) errors.claim_date = "Claim date is required.";

    if (!formData.claim_amount)
      errors.claim_amount = "Claim Amount is required.";
    setFormErrors(errors);

    if (!formData.approved_amount)
      errors.approved_amount = "Approved Amt is required.";
    setFormErrors(errors);

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
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-reimbursements/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-reimbursements`,
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
          ? "Payroll Reimbursements updated!"
          : "Payroll Reimbursements created!"
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
        updateMessage={"Payroll Reimbursements"}
        addMessage={"Payroll Reimbursements"}
        homeLink={"/payroll/reimbursements"}
        homeText={"Payroll Reimbursements"}
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
                  label="Payroll Reimbursement Type"
                  name="organization_payroll_reimbursement_type_id"
                  value={formData.organization_payroll_reimbursement_type_id}
                  onChange={handleChange}
                  error={
                    !!formErrors.organization_payroll_reimbursement_type_id
                  }
                  helperText={
                    formErrors.organization_payroll_reimbursement_type_id
                  }
                  required
                >
                  {reim?.map((option) => (
                    <MenuItem
                      key={option.organization_payroll_reimbursement_type_id}
                      value={option.organization_payroll_reimbursement_type_id}
                    >
                      {option?.reimbursement_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Claim Date"
                  name="claim_date"
                  type="date"
                  value={formData.claim_date}
                  onChange={handleChange}
                  error={!!formErrors.claim_date}
                  helperText={formErrors.claim_date}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Claim Amount"
                  name="claim_amount"
                  type="number"
                  value={formData?.claim_amount}
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
                  error={!!formErrors.claim_amount}
                  helperText={formErrors.claim_amount}
                  required
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 14,
                  }}
                />

                <TextField
                  fullWidth
                  label="Approved Amount"
                  name="approved_amount"
                  type="number"
                  value={formData?.approved_amount}
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
                  error={!!formErrors.approved_amount}
                  helperText={formErrors.approved_amount}
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
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  error={!!formErrors.status}
                  helperText={formErrors.status}
                  required
                >
                  <MenuItem value="Requested">Requested</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
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
                  inputProps={{ maxLength: 100 }}
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

export default PayrollReimbursementForm;
