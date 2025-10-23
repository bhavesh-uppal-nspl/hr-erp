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
import { fetchPayrollComponentTypes } from "../../../Apis/Payroll";

function ComponentForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const MAX_INCREMENT = 999999999.99;
  const [formData, setFormData] = useState({
    organization_payroll_component_type_id: "",
    payroll_component_name: "",
    calculation_method: "",
    fixed_amount: "",
    percentage_of_component: "",
    formula_json: "",
    taxable: "",
    affects_net_pay: "",
    rounding_rule: "",
    rounding_precision: "",
    sort_order: "",
    is_active: "",
    effective_from: "",
    effective_to: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [ComponentTypes, setComponentTypes] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchPayrollComponentTypes(org?.organization_id)
        .then((data) => {
          setComponentTypes(data?.payrollTypes);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-component/${id}`,
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

    if (!formData.payroll_component_name)
      errors.payroll_component_name = "Payroll component is required.";

    if (!formData.organization_payroll_component_type_id)
      errors.organization_payroll_component_type_id =
        "Payroll component type is required.";

    if (!formData.percentage_of_component)
      errors.percentage_of_component = "% of component is required.";
    if (!formData.calculation_method)
      errors.calculation_method = "cal method is required.";

    if (!formData.rounding_rule)
      errors.rounding_rule = "Rounding Rule is required.";

    if (!formData.fixed_amount) errors.fixed_amount = "Fixed Amt is required.";

    if (!formData.effective_from)
      errors.effective_from = "Start date is required.";

    if (!formData.effective_to) errors.effective_to = "End date is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-component/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll-component`,
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
          ? "Payroll Component updated!"
          : "Payroll Component created!"
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
        updateMessage={"Payroll Component"}
        addMessage={"Component"}
        homeLink={"/payroll/components"}
        homeText={"Payroll Component"}
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
                  label="Component Type"
                  name="organization_payroll_component_type_id"
                  value={formData.organization_payroll_component_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_payroll_component_type_id}
                  helperText={formErrors.organization_payroll_component_type_id}
                  required
                >
                  {ComponentTypes?.map((option) => (
                    <MenuItem
                      key={option.organization_payroll_component_type_id}
                      value={option.organization_payroll_component_type_id}
                    >
                      {option?.payroll_component_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Component Name"
                  name="payroll_component_name"
                  value={formData.payroll_component_name}
                  onChange={handleChange}
                  error={!!formErrors.payroll_component_name}
                  helperText={formErrors.payroll_component_name}
                  inputProps={{ maxLength: 50 }}
                  required
                />

                <TextField
                  select
                  fullWidth
                  label="Calculation Method"
                  name="calculation_method"
                  value={formData.calculation_method}
                  onChange={handleChange}
                  error={!!formErrors.calculation_method}
                  helperText={formErrors.calculation_method}
                  required
                >
                  <MenuItem value="Fixed">Fixed</MenuItem>
                  <MenuItem value="Percentage">Percentage</MenuItem>
                  <MenuItem value="Formula">Formula</MenuItem>
                  <MenuItem value="Slab">Slab</MenuItem>
                </TextField>

                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        formData.taxable === "1" || formData.taxable === true
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          taxable: e.target.checked,
                        }))
                      }
                      color="primary"
                    />
                  }
                  label="Taxable"
                />

                <TextField
                  select
                  fullWidth
                  label="Rounding Rule"
                  name="rounding_rule"
                  value={formData.rounding_rule}
                  onChange={handleChange}
                  error={!!formErrors.rounding_rule}
                  helperText={formErrors.rounding_rule}
                  required
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Nearest">Nearest</MenuItem>
                  <MenuItem value="Up">Up</MenuItem>
                  <MenuItem value="Down">Down</MenuItem>
                </TextField>

                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        formData.affects_net_pay === "1" ||
                        formData.affects_net_pay === true
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          affects_net_pay: e.target.checked,
                        }))
                      }
                      color="primary"
                    />
                  }
                  label="Affects net pay"
                />

                <TextField
                  fullWidth
                  label="Fixed Amount"
                  name="fixed_amount"
                  type="number"
                  value={formData?.fixed_amount}
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
                  error={!!formErrors.fixed_amount}
                  helperText={formErrors.fixed_amount}
                  required
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 13,
                  }}
                />

                <TextField
                  fullWidth
                  label="Percentage of Component"
                  name="percentage_of_component"
                  value={formData.percentage_of_component}
                  onChange={handleChange}
                  error={!!formErrors.percentage_of_component}
                  helperText={formErrors.percentage_of_component}
                  inputProps={{ maxLength: 50 }}
                />

                <TextField
                  fullWidth
                  label="Formula JSON"
                  name="formula_json"
                  value={formData.formula_json}
                  onChange={handleChange}
                  error={!!formErrors.formula_json}
                  helperText={formErrors.formula_json}
                  inputProps={{ maxLength: 50 }}
                  multiline
                  rows={6}
                />

                <TextField
                  fullWidth
                  label="Sort Order"
                  name="sort_order"
                  type="number"
                  value={formData?.sort_order}
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
                  error={!!formErrors.sort_order}
                  helperText={formErrors.sort_order}
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 13,
                  }}
                />

                <TextField
                  fullWidth
                  label="Rounding Precision"
                  name="rounding_precision"
                  type="number"
                  value={formData?.rounding_precision}
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
                  error={!!formErrors.rounding_precision}
                  helperText={formErrors.rounding_precision}
                  inputProps={{
                    min: 0,
                    max: 127, // or 255 if unsigned
                    maxLength: 3, // enough for tinyint
                  }}
                />

                <TextField
                  fullWidth
                  label="Effective From"
                  name="effective_from"
                  type="date"
                  value={formData.effective_from}
                  onChange={handleChange}
                  error={!!formErrors.effective_from}
                  helperText={formErrors.effective_from}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Effective to"
                  name="effective_to"
                  type="date"
                  value={formData.effective_to}
                  onChange={handleChange}
                  error={!!formErrors.effective_to}
                  helperText={formErrors.effective_to}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
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

export default ComponentForm;
