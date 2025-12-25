import React, { useState, useEffect } from "react";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import {
  fetchOrganizationEmploymenentExiReason,
  fetchOrganizationEmploymenentExiReasonTpes,
} from "../../../Apis/Employment-exit-reason";
import {
  Box,
  Button,
  Grid,
  Paper,
  MenuItem,
  FormControlLabel,
  Autocomplete,
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
import { fetchIncrements } from "../../../Apis/Salary";
import { fetchOrganizationDepartment } from "../../../Apis/DepartmentLocation-api";

function EmployeeRecordForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    employee_id: "",
    organization_designation_id: "",
    organization_department_id: "",
    employee_increment_id: "",
    start_date: "",
    end_date: "",
    change_reason: "",
    remarks: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [Designation, setDesignation] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [Increment, setIncrement] = useState([]);

  let navigate = useNavigate();

  // call for exit reason type

  useEffect(() => {
    {
      fetchIncrements(org.organization_id)
        .then((data) => {
          setIncrement(data?.incrementdata);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      fetchOrganizationEmployee(org?.organization_id)
        .then((data) => {
            const filteredEmployees = data?.filter((item) => item.employment_status !== "Exited")
          setEmployee(filteredEmployees);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);


  useEffect(() => {
    {
      fetchOrganizationDepartment(org?.organization_id)
        .then((data) => {
          setDepartment(data?.Departments);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    const fetchDepartmentDesignation = async () => {
      if (!formData?.organization_department_id || !org?.organization_id)
        return;

      try {
        const res = await axios.get(
          `${MAIN_URL}/api/department-designation/all`,
          {
            params: {
              department_id: formData.organization_department_id,
              organization_id: org.organization_id,
            },
          }
        );
        setDesignation(res?.data?.data);
      } catch (error) {
        console.error("Failed to fetch department designation", error);
      }
    };

    fetchDepartmentDesignation();
  }, [formData?.organization_department_id, org?.organization_id]);

  useEffect(() => {
    const getdataById = async () => {
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employee-records/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const a = response?.data?.records;
        setFormData(a);
      } catch (error) {
        console.error("Error fetching employee exit data:", error);
      } finally {
        setLoading(false);
      }
    };

    if ((mode === "edit"  || mode === "view"  ) && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "employee_id") {
    const selectedEmployee = employee?.find(
      (emp) => emp.employee_id === Number(value)
    );

    if (selectedEmployee) {
      setFormData((prevData) => ({
        ...prevData,
        employee_id: value,
        organization_department_id:
          selectedEmployee?.organization_department_id ||
          selectedEmployee?.designation?.organization_department_id ||
          "",
        organization_designation_id:
          selectedEmployee?.organization_designation_id ||
          selectedEmployee?.designation?.organization_designation_id ||
          "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        employee_id: value,
      }));
    }
  } else {
    // ✔ Fix for Change Reason, Increment, Remarks, etc.
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};


  const validateForm = () => {
    const errors = {};

    if (!formData.employee_id) errors.employee_id = "Employee ID is required.";

    if (!formData.organization_designation_id  ) {
      errors.organization_designation_id   = "designation is required.";
    }
    if (!formData.organization_department_id ) {
      errors.organization_department_id  = "Department is required.";
    }
   
    
    

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
          `${MAIN_URL}/api/organizations/${org.organization_id}/employee-records/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employee-records`,
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
          ? "Employee Record Updated!"
          : "Employee Record Created!"
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
        updateMessage={"Employement Records "}
        addMessage={"Employement Records"}
        homeLink={"/organization/employee/records"}
        homeText={"Employement Records"}
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



                 <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "100%", // ensures proper centering
                  }}
                >

                   <Autocomplete
                                  fullWidth
                                  options={employee || []}
                                  getOptionLabel={(option) =>
                                    `${option?.name || ""} -- ${option?.employee_code || ""}`.trim()
                                  }
                                  value={
                                    employee?.find(
                                      (emp) => emp.employee_id === formData?.employee_id
                                    ) || null
                                  }
                                  onChange={(event, newValue) => {
                                    handleChange({
                                      target: {
                                        name: "employee_id",
                                        value: newValue?.employee_id || "",
                                      },
                                    });
                                  }}
                                  disabled={mode === "view" || employee?.length === 0}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Employee Name/ID"
                                      name="employee_id"
                                      error={!!formErrors.employee_id}
                                      helperText={formErrors.employee_id}
                                      required
                                      fullWidth
                                    />
                                  )}
                                />

                                
<Autocomplete
                fullWidth
                  options={Department || []}
                  getOptionLabel={(option) =>
                    option.department_name || ""
                  }
                  value={
                    Department?.find(
                      (option) =>
                        option.organization_department_id ===
                        formData.organization_department_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "organization_department_id",
                        value:
                          newValue?.organization_department_id ||
                          "",
                      },
                    });
                  }}
                  disabled={mode === "view" || Department?.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Department"
                      error={
                        !!formErrors.organization_department_id
                      }
                      helperText={
                        formErrors.organization_department_id
                      }
                      required
                      fullWidth
                    />
                  )}
                />

                
                 <Autocomplete
                fullWidth
                  options={Designation || []}
                  getOptionLabel={(option) =>
                    option.designation_name || ""
                  }
                  value={
                    Designation?.find(
                      (option) =>
                        option.organization_designation_id ===
                        formData.organization_designation_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "organization_designation_id",
                        value:
                          newValue?.organization_designation_id ||
                          "",
                      },
                    });
                  }}
                  disabled={mode === "view" || Designation?.length === 0  ||  Department?.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Designation"
                      error={
                        !!formErrors.organization_designation_id
                      }
                      helperText={
                        formErrors.organization_designation_id
                      }
                      required
                      fullWidth
                    />
                  )}
                />


                </Box>
              
                  
                






 <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "100%", // ensures proper centering
                  }}
                >

                  
<Autocomplete
                fullWidth
                  options={Increment || []}
                  getOptionLabel={(option) =>
                    option?.increment_type?.employee_increment_type_name || ""
                  }
                  value={
                    Increment?.find(
                      (option) =>
                        option.employee_increment_id ===
                        formData.employee_increment_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "employee_increment_id",
                        value:
                          newValue?.employee_increment_id ||
                          "",
                      },
                    });
                  }}
                  disabled={mode === "view" || Increment?.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Increments"
                      error={
                        !!formErrors.employee_increment_id
                      }
                      helperText={
                        formErrors.employee_increment_id
                      }
                      required
                      fullWidth
                    />
                  )}
                />

                

                <TextField
                  fullWidth
                  type="date"
                  label="start Date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  error={!!formErrors.start_date}
                  helperText={formErrors.start_date}
                  disabled={mode === "view"}
                     
                  
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  error={!!formErrors.end_date}
                  helperText={formErrors.end_date}
                  disabled={mode === "view"}
                     
                  
                  InputLabelProps={{ shrink: true }}
                />


                </Box>













 <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "32.5%", // ensures proper centering
                  }}
                >

                  
                <TextField
                  select
                  fullWidth
                  label="Change Reason"
                  name="change_reason"
                  value={formData.change_reason}
                  onChange={handleChange}
                  error={!!formErrors.change_reason}
                  helperText={formErrors.change_reason}
                  disabled={mode === "view"}
                     
                  
                >
                  <MenuItem value="Promotion">Promotion</MenuItem>
                  <MenuItem value="Transfer">Transfer</MenuItem>
                  <MenuItem value="Demotion">Demotion</MenuItem>
                  <MenuItem value="Correction">Correction</MenuItem>
                </TextField>
                  
                </Box>
               


                <TextField
                  fullWidth
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  error={!!formErrors.remarks}
                  helperText={formErrors.remarks}
                  multiline
                  rows={3}
                  disabled={mode === "view"}
                     
                  
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
                    "Edit"
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

export default EmployeeRecordForm;
