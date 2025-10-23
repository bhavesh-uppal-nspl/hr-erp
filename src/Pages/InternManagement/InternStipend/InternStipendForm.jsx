import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextField,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchInterns } from "../../../Apis/InternManagement";
import { fetchGeneralCountries } from "../../../Apis/OrganizationLocation";

function InternStipendForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    intern_id: "",
    stipend_type: "",
    stipend_amount: "",
    currency_code: "",
    payment_cycle: "",
    effective_start_date: "",
    effective_end_date: "",
    is_active: "",
    last_payment_date: "",
    remarks: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [Intern, setIntern] = useState([]);

  const [countrycode, setCountryData] = useState("");
  let navigate = useNavigate();

  const Status = ["Fixed", "Hourly", "Monthly", "Project-Based", "Unpaid"];
  const Cycle = ["One-Time", "Monthly", "Quarterly", "End-of-Internship"];
useEffect(() => {
  fetchInterns(org?.organization_id)
    .then((data) => {
      // Filter interns with is_paid === 1
      const paidInterns = data?.intership?.data?.filter(
        (intern) => intern.is_paid === 1
      );
      setIntern(paidInterns);
    })
    .catch((err) => {
      setFormErrors(err.message);
    });
}, []);



useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${MAIN_URL}/api/general/countries/v1`);

        console.log("responres for countries ", res);
        setCountryData(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    
      fetchCountries()
  }, []);







  useEffect(() => {
    const getdataById = async () => {
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-stipend/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const a = response.data.intership;
        setFormData(a);
      } catch (error) {
        console.error("Error fetching employee exit data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.intern_id) errors.intern_id = "Intern is required.";

    if (!formData.stipend_type) {
      errors.stipend_type = "Stipend Type is required.";
    }
    if (!formData.stipend_amount) {
      errors.stipend_amount = "Amount is required.";
    }

    // if (!formData.payment_cycle) {
    //   errors.payment_cycle = "Payment cycle is required.";
    // }

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  console.log("formdata is iosksn ", formData);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        // Call edit API
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-stipend/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-stipend`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      toast.success(
        mode === "edit" ? "Intern Stipend  Updated!" : "Intern Stipend Created!"
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
        updateMessage={"Intern Stipends"}
        addMessage={"Intern  Stipends"}
        homeLink={"/organization/intern/intern-stipend"}
        homeText={"Intern Stipends"}
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
                  label="Intern Name/ID"
                  name="intern_id"
                  value={formData?.intern_id}
                  onChange={handleChange}
                  error={!!formErrors.intern_id}
                  helperText={formErrors.intern_id}
                  required
                >
                  {Intern?.map((option) => {
                    const fullName =
                      `${option?.first_name || ""} ${option?.middle_name || ""} ${option?.last_name || ""} -- ${option?.intern_code || ""}`.trim();
                    return (
                      <MenuItem
                        key={option?.intern_id}
                        value={option?.intern_id}
                      >
                        {fullName}
                      </MenuItem>
                    );
                  })}
                </TextField>

                {/* <TextField
                  fullWidth
                  type="date"
                  label="Effective Start Date"
                  name="effective_start_date"
                  value={formData.effective_start_date}
                  onChange={handleChange}
                  error={!!formErrors.effective_start_date}
                  helperText={formErrors.effective_start_date}
                  required
                  InputLabelProps={{ shrink: true }}
                /> */}

                {/* <TextField
                  fullWidth
                  type="date"
                  label="Effective End Date"
                  name="effective_end_date"
                  value={formData.effective_end_date}
                  onChange={handleChange}
                  error={!!formErrors.effective_end_date}
                  helperText={formErrors.effective_end_date}
                  InputLabelProps={{ shrink: true }} */}
                {/* /> */}


                 <TextField
                  select
                  fullWidth
                  label="Stipend Type"
                  name="stipend_type"
                  value={formData.stipend_type}
                  onChange={handleChange}
                  error={!!formErrors.stipend_type}
                  helperText={formErrors.stipend_type}
                  required
                >
                  {Status?.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Currency Code"
                  name="currency_code"
                  value={formData?.currency_code}
                  onChange={handleChange}
                  error={!!formErrors.currency_code}
                  helperText={formErrors.currency_code}
                >
                  {(countrycode || [])?.map((option) => (
                    <MenuItem
                      key={option.currency_code}
                      value={option?.currency_code}
                    >
                      {option.currency_code}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Stipend Amount"
                  name="stipend_amount"
                  type="number"
                  value={formData.stipend_amount}
                  onChange={handleChange}
                  error={!!formErrors.stipend_amount}
                  helperText={formErrors.stipend_amount}
                  inputProps={{ min: 0 }}
                />

                {/* <TextField
                  fullWidth
                  type="date"
                  label="Last Payment Date"
                  name="last_payment_date"
                  value={formData.last_payment_date}
                  onChange={handleChange}
                  error={!!formErrors.last_payment_date}
                  helperText={formErrors.last_payment_date}
                  InputLabelProps={{ shrink: true }}
                /> */}

                {/* <TextField
                  fullWidth
                  type="date"
                  label="Next Payment Date"
                  name="next_payment_date"
                  value={formData.next_payment_date}
                  onChange={handleChange}
                  error={!!formErrors.next_payment_date}
                  helperText={formErrors.next_payment_date}
                  InputLabelProps={{ shrink: true }}
                /> */}

               

                {/* <TextField
                  select
                  fullWidth
                  label="Payment Cycle"
                  name="payment_cycle"
                  value={formData.payment_cycle}
                  onChange={handleChange}
                  error={!!formErrors.payment_cycle}
                  helperText={formErrors.payment_cycle}
                  required
                >
                  {Cycle?.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField> */}

                {/* <TextField
                  fullWidth
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  error={!!formErrors.remarks}
                  helperText={formErrors.remarks}
                  multiline
                  rows={2} // Makes it two lines high
                /> */}
              </Grid>

              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={handleSubmit}
                    disabled={loading || btnLoading}
                    sx={{
                      mt: 3,
                      borderRadius: 2,
                      minWidth: 120,
                      textTransform: "capitalize",
                      fontWeight: 500,
                    }}
                  >
                    {loading || btnLoading ? (
                      <CircularProgress size={22} sx={{ color: "#fff" }} />
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
                        mt: 3,
                        borderRadius: 2,
                        minWidth: 120,
                        textTransform: "capitalize",
                        fontWeight: 500,
                        backgroundColor: "#1976d2",
                        "&:hover": { backgroundColor: "#115293" },
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default InternStipendForm;
