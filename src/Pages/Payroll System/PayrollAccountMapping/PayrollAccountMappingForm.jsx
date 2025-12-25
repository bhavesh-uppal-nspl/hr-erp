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
  fetchPayrollComponents,
  fetchPayrollRuns,
} from "../../../Apis/Payroll";

function PayrollAccountMappingForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [employee, setEmployee] = useState([]);
  const [runs, setRun] = useState([]);
  const [payroll,setPayroll]=useState([])

  const MAX_INCREMENT = 99999999999999;

  const [formData, setFormData] = useState({
    organization_payroll_component_id: "",
    account_code: "",
    account_name: "",
    posting_type: "",
    remarks: "",
  });

  useEffect(() => {
    {
      fetchPayrollComponents(org?.organization_id)
        .then((data) => {
          setPayroll(data?.payroll);
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
        `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-account-mapping/${id}`,
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

    if (!formData.organization_payroll_component_id)
      errors.organization_payroll_component_id = "Payroll Component is required.";
    setFormErrors(errors);

    if (!formData.account_code)
      errors.account_code = "Account code is required.";
    setFormErrors(errors);

    if (!formData.account_name)
      errors.account_name = "Account name is required.";
    setFormErrors(errors);

   
    if (!formData.posting_type) errors.posting_type = "Posting Type is required.";
 
    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-account-mapping/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-account-mapping`,
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
          ? "Payroll Account Mapping updated!"
          : "Payroll Account Mapping created!"
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
        updateMessage={"Payroll Account Mapping"}
        addMessage={"Payroll Account Mapping"}
        homeLink={"/payroll/account-mapping"}
        homeText={"Payroll Account Mapping"}
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
                  select
                  fullWidth
                  label="Posting Type"
                  name="posting_type"
                  value={formData.posting_type}
                  onChange={handleChange}
                  error={!!formErrors.posting_type}
                  helperText={formErrors.posting_type}
                  required
                >
                  <MenuItem value="Debit">Debit</MenuItem>
                  <MenuItem value="Credit">Credit</MenuItem>
                 
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

export default PayrollAccountMappingForm;
