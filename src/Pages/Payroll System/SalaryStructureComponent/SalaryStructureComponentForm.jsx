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
import { fetchPayrollComponents, fetchSalaryStructure } from "../../../Apis/Payroll";

function SalaryStructureComponentForm({ mode }) {
  const { id } = useParams(); // only used in edit mode
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_payroll_employee_salary_structure_id: "",
    descriorganization_payroll_component_id: "",
    calculation_method: "",
    fixed_amount: "",
    percentage_value: "",
    percentage_of_component: "",
    custom_formula_json: "",
    sort_order: "",
    is_active: "",
  });






  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [structure , setStructure]=useState([])
  const [component, setComponent]=useState([]);

  let navigate = useNavigate();

    const MAX_INCREMENT = 999999999.99;


    useEffect(() => {
      {
        fetchSalaryStructure(org?.organization_id)
          .then((data) => {
            setStructure(data?.payroll);
          })
          .catch((err) => {
            setFormErrors(err.message);
          });
      }
    }, []);

    
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



  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/payroll/salary-component/${id}`,
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

    if (!formData.organization_payroll_employee_salary_structure_id)
      errors.organization_payroll_employee_salary_structure_id =
        "salary structure  is required.";

    if (!formData.calculation_method)
      errors.calculation_method = "calculation method  is required.";

    if (!formData.fixed_amount)
      errors.fixed_amount = "fixed amount is required.";

    if (!formData.percentage_value)
      errors.percentage_value = "Percentage value is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll/salary-component/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/payroll/salary-component`,
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
          ? "Payroll Salary Structure Component  updated!"
          : "Payroll Salary Structure Component  created!"
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
        updateMessage={"Salary Structure Component"}
        addMessage={"Salary Structure Component"}
        homeLink={"/payroll/salary-structure/components"}
        homeText={"Salary Structure Component"}
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
                  label="Payroll Salary Structure"
                  name="organization_payroll_employee_salary_structure_id"
                  value={
                    formData.organization_payroll_employee_salary_structure_id
                  }
                  onChange={handleChange}
                  error={
                    !!formErrors.organization_payroll_employee_salary_structure_id
                  }
                  helperText={
                    formErrors.organization_payroll_employee_salary_structure_id
                  }
                  required
                >
                  {structure?.map((option) => (
                    <MenuItem
                      key={
                        option.organization_payroll_employee_salary_structure_id
                      }
                      value={
                        option.organization_payroll_employee_salary_structure_id
                      }
                    >
                      {option?.payroll_component_type_name}
                    </MenuItem>
                  ))}
                </TextField>

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

                <TextField
                  fullWidth
                  label="Percentage Value"
                  name="percentage_value"
                  type="number"
                  value={formData?.percentage_value}
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
                  error={!!formErrors.percentage_value}
                  helperText={formErrors.percentage_value}
                  required
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 13,
                  }}
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
                  label="Custom Formula JSON"
                  name="custom_formula_json"
                  value={formData.custom_formula_json}
                  onChange={handleChange}
                  error={!!formErrors.custom_formula_json}
                  helperText={formErrors.custom_formula_json}
                  inputProps={{ maxLength: 500 }}
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

export default SalaryStructureComponentForm;
