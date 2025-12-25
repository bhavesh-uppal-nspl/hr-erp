import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  Typography,
  Alert,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { fetchOrganizations } from "../../Apis/Organization-apis";
import { fetchOrganizationEmployee } from "../../Apis/Employee-api";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../Configurations/Urls";
import Header from "../DataLayouts/Header";

function EmployeeCopyForm() {
  const { userData } = useAuthStore();
  const org = userData?.organization;

  // State for organizations
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [filteredToOrganizations, setFilteredToOrganizations] = useState([]);

  // State for FROM organization and its employees
  const [fromOrganization, setFromOrganization] = useState(null);
  const [fromOrgEmployees, setFromOrgEmployees] = useState([]);
  const [selectedFromEmployee, setSelectedFromEmployee] = useState(null);
  const [loadingFromEmployees, setLoadingFromEmployees] = useState(false);

  // State for TO organization and its employees
  const [toOrganization, setToOrganization] = useState(null);
  const [toOrgEmployees, setToOrgEmployees] = useState([]);
  const [selectedToEmployee, setSelectedToEmployee] = useState(null);
  const [loadingToEmployees, setLoadingToEmployees] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  let navigate = useNavigate();

  // Fetch all organizations
  useEffect(() => {
    if (!org?.client_id) return;

    fetchOrganizations(org.client_id)
      .then((data) => {
        setAllOrganizations(data?.organizations || []);
        setLoading(false);
      })
      .catch((err) => {
        setFormErrors({ fetch: err.message });
        setLoading(false);
      });
  }, [org?.client_id]);

  // Fetch FROM organization employees when FROM organization is selected
  useEffect(() => {
    if (!fromOrganization?.organization_id) {
      setFromOrgEmployees([]);
      setSelectedFromEmployee(null);
      return;
    }

    setLoadingFromEmployees(true);
    fetchOrganizationEmployee(fromOrganization.organization_id)
      .then((data) => {
        setFromOrgEmployees(data || []);
        setLoadingFromEmployees(false);
      })
      .catch((err) => {
        console.error("Error fetching FROM org employees:", err);
        setFromOrgEmployees([]);
        setLoadingFromEmployees(false);
        toast.error("Failed to fetch employees from source organization");
      });
  }, [fromOrganization]);

  // Fetch TO organization employees when TO organization is selected
  useEffect(() => {
    if (!toOrganization?.organization_id) {
      setToOrgEmployees([]);
      setSelectedToEmployee(null);
      return;
    }

    setLoadingToEmployees(true);
    fetchOrganizationEmployee(toOrganization.organization_id)
      .then((data) => {
        setToOrgEmployees(data || []);
        setLoadingToEmployees(false);
      })
      .catch((err) => {
        console.error("Error fetching TO org employees:", err);
        setToOrgEmployees([]);
        setLoadingToEmployees(false);
        toast.error("Failed to fetch employees from target organization");
      });
  }, [toOrganization]);

  // Filter TO organizations (exclude FROM organization)
  useEffect(() => {
    if (!fromOrganization) {
      setFilteredToOrganizations(allOrganizations);
      return;
    }

    const filtered = allOrganizations.filter(
      (item) => item.organization_id !== fromOrganization.organization_id
    );
    setFilteredToOrganizations(filtered);

    // If TO organization is same as FROM, clear it
    if (toOrganization?.organization_id === fromOrganization.organization_id) {
      setToOrganization(null);
      setToOrgEmployees([]);
      setSelectedToEmployee(null);
    }
  }, [fromOrganization, allOrganizations, toOrganization]);

  const handleFromOrganizationChange = (event, newValue) => {
    setFromOrganization(newValue);
    setSelectedFromEmployee(null);
    setFromOrgEmployees([]);
    setFormErrors((prev) => ({ ...prev, fromOrganization: "" }));
  };

  const handleFromEmployeeChange = (event, newValue) => {
    setSelectedFromEmployee(newValue);
    setFormErrors((prev) => ({ ...prev, fromEmployee: "" }));
  };



  console.log("fromOrgEmployees", fromOrgEmployees)
  console.log("selectedFromEmployee", selectedFromEmployee)

  const handleToOrganizationChange = (event, newValue) => {
    setToOrganization(newValue);
    setSelectedToEmployee(null);
    setToOrgEmployees([]);
    setFormErrors((prev) => ({ ...prev, toOrganization: "" }));
  };

  const handleToEmployeeChange = (event, newValue) => {
    setSelectedToEmployee(newValue);
  };

  const validateForm = () => {
    const errors = {};

    if (!fromOrganization) {
      errors.fromOrganization = "Source organization is required.";
    }

    if (!selectedFromEmployee) {
      errors.fromEmployee = "Employee from source organization is required.";
    }

    if (!toOrganization) {
      errors.toOrganization = "Target organization is required.";
    }

    //  if (!selectedToEmployee) {
    //   errors.selectedToEmployee = "Target Employee is required.";
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setBtnLoading(true);

    try {
      const apiEndpoint = `${MAIN_URL}/api/organizations/${fromOrganization?.organization_id}/employee-store/copy`;

      const response = await axios.post(
        apiEndpoint,
        {
          from_organization_id: fromOrganization.organization_id,
          from_employee_id: selectedFromEmployee.employee_id,
          to_organization_id: toOrganization.organization_id,
          to_employee_id: selectedToEmployee?.employee_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Employee copied successfully!");
      setFormErrors({});

      // Reset form
      setFromOrganization(null);
      setFromOrgEmployees([]);
      setSelectedFromEmployee(null);
      setToOrganization(null);
      setToOrgEmployees([]);
      setSelectedToEmployee(null);

      // Optionally navigate back or refresh
      setTimeout(() => {
        navigate("/organization/employee-shift");
      }, 1500);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        setFormErrors(validationErrors);

        const errorMessages = Object.values(validationErrors).flat().join(" ");
        toast.error(errorMessages || "Validation failed.");
      } else if (err.response?.status === 403) {
        toast.error("You don't have permission to copy to this organization.");
      } else {
        toast.error(err.response?.data?.message || "Something went wrong.");
      }
    } finally {
      setBtnLoading(false);
    }
  };

  console.log("selectedToEmployee is", selectedToEmployee);

  return (
    <Box px={4} py={4}>
      {/* Main Form */}
      <Header
        mode="add"
        addMessage="Copy Employee"
        homeText={"Copy Employees"}
        homeLink="/"
      />

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={4} sx={{ p: 3 }}>
          {/* <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Copy Employee Between Organizations
          </Typography> */}

          {formErrors.fetch && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formErrors.fetch}
            </Alert>
          )}

          {/* <Grid container spacing={3}> */}
          {/* STEP 1: Select FROM Organization */}
          <Grid item xs={12} mt={3}>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Select Source Organization
            </Typography>
            <Autocomplete
              fullWidth
              options={allOrganizations}
              getOptionLabel={(option) => option?.organization_name || ""}
              value={fromOrganization}
              onChange={handleFromOrganizationChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="From Organization *"
                  error={!!formErrors.fromOrganization}
                  helperText={formErrors.fromOrganization}
                />
              )}
              noOptionsText="No organizations available"
              isOptionEqualToValue={(option, value) =>
                option.organization_id === value?.organization_id
              }
            />
            {/* </Grid> */}

            {/* STEP 2: Select FROM Employee */}
            {fromOrganization && (
              <Grid item xs={12} mt={4}>
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Select Employee from Source Organization
                </Typography>
                {loadingFromEmployees ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <Autocomplete
                    fullWidth
                    options={fromOrgEmployees}
                    getOptionLabel={(option) => {
                      const fullName = `${option?.name || ""} - ${
                        option?.employee_code || "No Code"
                      }`.trim();
                      return fullName || option?.employee_id || "";
                    }}
                    value={selectedFromEmployee}
                    onChange={handleFromEmployeeChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Employee *"
                        error={!!formErrors.fromEmployee}
                        helperText={formErrors.fromEmployee}
                      />
                    )}
                    noOptionsText="No employees available in this organization"
                    isOptionEqualToValue={(option, value) =>
                      option.employee_id === value?.employee_id
                    }
                  />
                )}
              </Grid>
            )}

            {/* Display selected FROM employee details */}
            {selectedFromEmployee && (
              <Grid item xs={12} mt={4}>
                <Alert severity="info">
                  <Typography variant="subtitle2">
                    <strong>Selected Employee (Source):</strong>
                  </Typography>
                  <Typography variant="body2">
                    Name: {selectedFromEmployee.name || ""}
                  </Typography>
                  <Typography variant="body2">
                    Code: {selectedFromEmployee.employee_code || "N/A"}
                  </Typography>
                  {/* <Typography variant="body2">
                    Organization: {fromOrganization?.organization_name}
                  </Typography> */}
                  <Typography variant="body2">
                    Department:{" "}
                    {
                      selectedFromEmployee?.department
                        ?.department_name
                    }
                  </Typography>
                  <Typography variant="body2">
                    Designation:{" "}
                    {selectedFromEmployee?.designation}
                  </Typography>
                </Alert>
              </Grid>
            )}

            {/* STEP 3: Select TO Organization */}
            {fromOrganization && (
              <Grid item xs={12} mt={4}>
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Select Target Organization
                </Typography>
                <Autocomplete
                  fullWidth
                  options={filteredToOrganizations}
                  getOptionLabel={(option) => option?.organization_name || ""}
                  value={toOrganization}
                  onChange={handleToOrganizationChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="To Organization *"
                      error={!!formErrors.toOrganization}
                      helperText={formErrors.toOrganization}
                    />
                  )}
                  noOptionsText="No other organizations available"
                  isOptionEqualToValue={(option, value) =>
                    option.organization_id === value?.organization_id
                  }
                />
              </Grid>
            )}

            {/* STEP 4: View TO Organization Employees */}
            {toOrganization && (
              <Grid item xs={12} mt={4}>
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  View Employees in Target Organization
                </Typography>
                {loadingToEmployees ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <Autocomplete
                    fullWidth
                    options={toOrgEmployees}
                    getOptionLabel={(option) => {
                      const fullName = `${option?.name || ""} - ${
                        option?.employee_code || "No Code"
                      }`.trim();
                      return fullName || option?.employee_id || "";
                    }}
                    value={selectedToEmployee}
                    onChange={handleToEmployeeChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="View Employees in Target Organization"
                        placeholder="Search to view existing employees..."
                      />
                    )}
                    noOptionsText="No employees available in this organization"
                    isOptionEqualToValue={(option, value) =>
                      option.employee_id === value?.employee_id
                    }
                  />
                )}
                {/* 
                {toOrgEmployees.length > 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 3 }}
                  >
                    Total employees in target organization: {toOrgEmployees.length}
                  </Typography>
                )} */}
              </Grid>
            )}

            {/* Display selected TO employee details (if any) */}
            {selectedToEmployee && (
              <Grid item xs={12} mt={4} mb={2}>
                <Alert severity="success">
                  <Typography variant="subtitle2">
                    <strong>Viewing Employee (Target Organization):</strong>
                  </Typography>
                  <Typography variant="body2">
                    Name: {selectedToEmployee.name}{" "}
                  </Typography>
                  <Typography variant="body2">
                    Code: {selectedToEmployee.employee_code || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    Designation:{" "}
                    {
                      selectedToEmployee?.department
                    }
                  </Typography>
                  <Typography variant="body2">
                    Designation:{" "}
                    {selectedToEmployee?.designation}
                  </Typography>
                </Alert>
              </Grid>
            )}

            {/* Warning/Info Message */}
            <Grid item xs={12} mt={3}>
              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>Important:</strong> Copying an employee will:
                </Typography>
                <ul style={{ marginTop: 8, paddingLeft: 20, marginBottom: 0 }}>
                  <li>
                    Create a duplicate employee in the target organization
                  </li>
                  <li>
                    Copy all personal information, education, experience, and
                    documents
                  </li>
                  <li>
                    The original employee will remain in the source organization
                  </li>
                  <li>
                    Organization-specific fields (department, designation,
                    shift, etc.) will be reset
                  </li>
                  <li>
                    Employee code will be set to null (you can assign it later
                    in the target organization)
                  </li>
                </ul>
              </Alert>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Grid container spacing={2} mt={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  btnLoading ||
                  !fromOrganization ||
                  !selectedFromEmployee ||
                  !toOrganization
                }
                sx={{
                  borderRadius: 2,
                  minWidth: 120,
                  textTransform: "capitalize",
                  fontWeight: 500,
                }}
              >
                {btnLoading ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : (
                  "Copy Employee"
                )}
              </Button>
            </Grid>

            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                onClick={() => navigate(-1)}
                disabled={btnLoading}
                sx={{
                  borderRadius: 2,
                  minWidth: 120,
                  textTransform: "capitalize",
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default EmployeeCopyForm;
