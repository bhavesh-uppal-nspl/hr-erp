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

function PayrollRunForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const MAX_INCREMENT = 999999999.99;
  const [formData, setFormData] = useState({
    payroll_cycle_id: "",
    period_start_date: "",
    period_end_date: "",
    status: "",
    remarks: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [cycle, setCycle]=useState([])
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
        `${MAIN_URL}/api/organizations/${org?.organization_id}/payroll-runs/${id}`,
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
    
    if (!formData.payroll_cycle_id)
      errors.payroll_cycle_id = "Period Cycle is required.";

    if (!formData.period_start_date )
      errors.period_start_date  = "Period Start date is  required.";

    if (!formData.period_end_date)
      errors.period_end_date = "Period End date is  required.";

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
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-runs/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-runs`,
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
          ? "Payroll Run updated!"
          : "Payroll Run created!"
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
        updateMessage={"Payroll Runs"}
        addMessage={"Payroll Runs"}
        homeLink={"/payroll/runs"}
        homeText={"Payroll Runs"}
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
                  name="payroll_cycle_id"
                  value={formData.payroll_cycle_id}
                  onChange={handleChange}
                  error={!!formErrors.payroll_cycle_id}
                  helperText={formErrors.payroll_cycle_id}
                  required
                >
                  {cycle?.map((option) => (
                    <MenuItem
                      key={option.payroll_cycle_id}
                      value={option.payroll_cycle_id}
                    >
                      {option?.payroll_cycle_name}
                    </MenuItem>
                  ))}
                </TextField>
               

                <TextField
                  fullWidth
                  label="Period Start Date"
                  name="period_start_date"
                  type="date"
                  value={formData.period_start_date}
                  onChange={handleChange}
                  error={!!formErrors.period_start_date}
                  helperText={formErrors.period_start_date}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Period End Date"
                  name="period_end_date"
                  type="date"
                  value={formData.period_end_date}
                  onChange={handleChange}
                  error={!!formErrors.period_end_date}
                  helperText={formErrors.period_end_date}
                  required
                  InputLabelProps={{
                    shrink: true,
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
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
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

export default PayrollRunForm;
