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

function PayslipPaymentForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const MAX_INCREMENT = 999999999.99;
  const [formData, setFormData] = useState({
    employee_payslip_id: "",
    payment_date: "",
    payment_mode: "",
    amount: "",
    reference_no: "",
    status: "",
    remarks: "",
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
        `${MAIN_URL}/api/organizations/${org.organization_id}/payslip-payment/${id}`,
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
      [name]:value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.payment_mode)
      errors.payment_mode = "Payment Mode is required.";
  

    if (!formData.payment_date)
      errors.payment_date = "Payment Date is required.";

    if (!formData.amount) errors.amount = "Amount is required.";

    if (!formData.reference_no)
      errors.reference_no = "Reference No. is required.";

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
          `${MAIN_URL}/api/organizations/${org.organization_id}/payslip-payment/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payslip-payment`,
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
          ? "Payslip Payment updated!"
          : "Payslip Payment created!"
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
        updateMessage={"Payslip Payments"}
        addMessage={"Payslip Payments"}
        homeLink={"/payslips/payments"}
        homeText={"Payslip Payments"}
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
                  label="Payslip ID"
                  name="employee_payslip_id"
                  value={formData.employee_payslip_id}
                  onChange={handleChange}
                  error={!!formErrors.employee_payslip_id}
                  helperText={formErrors.employee_payslip_id}
                  required
                >
                  {cycle?.map((option) => (
                    <MenuItem
                      key={option.employee_payslip_id}
                      value={option.employee_payslip_id}
                    >
                      {option?.employee_payslip_id}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Payment Date"
                  name="payment_date"
                  type="date"
                  value={formData.payment_date}
                  onChange={handleChange}
                  error={!!formErrors.payment_date}
                  helperText={formErrors.payment_date}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  select
                  fullWidth
                  label="Payment Mode"
                  name="payment_mode"
                  value={formData.payment_mode}
                  onChange={handleChange}
                  error={!!formErrors.payment_mode}
                  helperText={formErrors.payment_mode}
                  required
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                  <MenuItem value="BankTransfer">BankTransfer</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
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
                  label="Reference No."
                  name="reference_no"
                  value={formData.reference_no}
                  onChange={handleChange}
                  error={!!formErrors.reference_no}
                  helperText={formErrors.reference_no}
                  inputProps={{ maxLength: 50 }}
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
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
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

export default PayslipPaymentForm;
