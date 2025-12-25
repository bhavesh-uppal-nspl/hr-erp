import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchPayrollComponents } from "../../../Apis/Payroll";

function PayrollSlabsForm({ mode }) {
  const { id } = useParams(); // only used in edit mode
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [component, setComponent] = useState([]);

    const MAX_INCREMENT = 999999999.99;

  const [formData, setFormData] = useState({
    organization_payroll_component_id: "",
    slab_min: "",
    slab_max: "",
    slab_value_type: "",
    slab_value: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  useEffect(() => {
    {
      fetchPayrollComponents(org?.organization_id)
        .then((data) => {
          setComponent(data?.payrollComponent);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-component-slab/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.payrollSlab;
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

    if (!formData.organization_payroll_component_id)
      errors.organization_payroll_component_id =
        "Payroll component is required.";

    if (!formData.slab_min) errors.slab_min = "slab min is required.";

    if (!formData.slab_max) errors.slab_max = "slab max is required.";

    if (!formData.slab_value_type)
      errors.slab_value_type = "slab value type is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-component-slab/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-component-slab`,
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
          ? "Payroll Component Slab updated!"
          : "Payroll Component Slab created!"
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
        updateMessage={"Payroll Component Slabs"}
        addMessage={"Component Slabs"}
        homeLink={"/payroll/component-slabs"}
        homeText={"Component Slabs"}
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
                  label="payroll Component"
                  name="organization_payroll_component_id"
                  value={formData.organization_payroll_component_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_payroll_component_id}
                  helperText={formErrors.organization_payroll_component_id}
                  required
                >
                  {component?.map((option) => (
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
                  label="Min Slab"
                  name="slab_min"
                  type="number"
                  value={formData?.slab_min}
                  onChange={(e) => {
                    let value = e.target.value;

                    // Allow only numbers or empty value
                    if (/^\d*$/.test(value)) {
                      if (value === "" || Number(value) <= MAX_INCREMENT) {
                        handleChange(e);
                      } else {
                        e.target.value = MAX_INCREMENT;
                        handleChange(e);
                      }
                    }
                  }}
                  error={!!formErrors.slab_min}
                  helperText={formErrors.slab_min}
                  required
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 13,
                  }}
                />

                
                <TextField
                  fullWidth
                  label="Max Slab"
                  name="slab_max"
                  type="number"
                  value={formData?.slab_max}
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
                  error={!!formErrors.slab_max}
                  helperText={formErrors.slab_max}
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
                  label="Slab Value Type"
                  name="slab_value_type"
                  value={formData.slab_value_type}
                  onChange={handleChange}
                  error={!!formErrors.slab_value_type}
                  helperText={formErrors.slab_value_type}
                  required
                >
                  <MenuItem value="Fixed">Fixed</MenuItem>
                  <MenuItem value="Percentage">Percentage</MenuItem>
                </TextField>

                   <TextField
                  fullWidth
                  label="Slab Value"
                  name="slab_value"
                  type="number"
                  value={formData?.slab_value}
                  onChange={(e) => {
                    let value = e.target.value;

                    // Allow only numbers or empty value
                    if (/^\d*$/.test(value)) {
                      if (value === "" || Number(value) <= MAX_INCREMENT) {
                        handleChange(e);
                      } else {
                        e.target.value = MAX_INCREMENT;
                        handleChange(e);
                      }
                    }
                  }}
                  error={!!formErrors.slab_value}
                  helperText={formErrors.slab_value}
                  required
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 13,
                  }}
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
                    color="primary" // blue color
                    size="medium"
                    onClick={() => navigate(-1)} // cancel navigates back
                    sx={{
                      borderRadius: 2,
                      minWidth: 120,
                      textTransform: "capitalize",
                      fontWeight: 500,
                      mt: 2,
                      backgroundColor: "#1976d2", // standard blue
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

export default PayrollSlabsForm;
