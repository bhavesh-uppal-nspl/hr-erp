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
  Autocomplete,
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
  if (!org?.organization_id) return;

  fetchInterns(org.organization_id)
    .then((data) => {
      const interns = data?.intership?.data || [];

      // Remove exited interns
      let activeInterns = interns.filter(
        (item) => item?.status?.internship_status_name !== "Exited"
      );

      const selectedInternId = formData?.intern_id;

      // Add selected intern back in BOTH edit and view modes
      if ((mode === "edit" || mode === "view") && selectedInternId) {
        const selectedIntern = interns.find(
          (i) => i.intern_id === selectedInternId
        );

        if (selectedIntern) {
          const exists = activeInterns.some(
            (i) => i.intern_id === selectedInternId
          );

          if (!exists) {
            activeInterns.push(selectedIntern);
          }
        }
      }

      setIntern(activeInterns);
    })
    .catch((err) => {
      setFormErrors({ general: err.message });
    });
}, [org?.organization_id, mode, formData?.intern_id]);

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

    fetchCountries();
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

    if ((mode === "edit" || mode === "view") && id) {
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
        <Paper elevation={4} sx={{ p: 3 }}>
          <Grid container spacing={2}>
           
            <Autocomplete
              fullWidth
              options={Intern || []}
              getOptionLabel={(option) =>
                `${option?.first_name || ""} ${option?.middle_name}  ${option?.last_name} (${option?.intern_code || ""})`.trim()
              }
              value={
                Intern?.find(
                  (intern) => intern?.intern_id === formData?.intern_id
                ) || null
              }
              onChange={(event, newValue) => {
                handleChange({
                  target: {
                    name: "intern_id",
                    value: newValue?.intern_id || "",
                  },
                });
              }}
              disabled={Intern?.length === 0 || mode === "view"}
              isOptionEqualToValue={(option, value) =>
                option?.intern_id === value?.intern_id
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Intern Name/ID"
                  name="intern_id"
                  required
                  error={!!formErrors?.intern_id}
                  helperText={formErrors?.intern_id}
                  fullWidth
                />
              )}
            />

              
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "100%", // ensures proper centering
                  }}
                >
                  
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
              disabled={Status?.length === 0 || mode === "view"}
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
                  disabled={countrycode?.length === 0 || mode === "view"}
                >
                  {(countrycode || []).map((option) => (
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
                  disabled={mode === "view"}
                  inputProps={{ min: 0 }}
                />

                  
                </Box>
          </Grid>

          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleSubmit}
                disabled={loading || btnLoading || mode === "view"}
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
      )}
    </Box>
  );
}

export default InternStipendForm;
