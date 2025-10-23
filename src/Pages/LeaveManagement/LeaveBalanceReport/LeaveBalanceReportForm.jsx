import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  MenuItem,
  TextField,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import {
  fetchLeaveCategory,
  fetchLeaveReason,
  fetchLeaveTypes,
} from "../../../Apis/Leave-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import dayjs from "dayjs";
import { fetchOrganizationDesignation } from "../../../Apis/Designation-api";
import {
  fetchOrganizationDepartment,
  fetchOrganizationLocation,
} from "../../../Apis/DepartmentLocation-api";
import { fetchOrganizationEmploymentStatus } from "../../../Apis/OrganizationEmploymentStatus";
import { fetchOrganizationEmploymentTypes } from "../../../Apis/Organization-Employement-types";
import {
  fetchWorkShift,
  fetchWorkShiftTypes,
} from "../../../Apis/Workshift-api";
import { fetchBusinessRegistrationType } from "../../../Apis/Registration-api";
import { fetchOrgBusinessOwnershipType } from "../../../Apis/BusinessOwnershipType";

function EmployeeLeaveEntitlmentForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_location_id: "",
    organization_department_id: "",
    organization_designation_id: "",
    organization_employment_type_id: "",
    organization_employment_status_id: "",
    organization_work_shift_id: "",
    organization_work_shift_type_id: "",
    organization_business_registration_type_id: "",
    organization_business_ownership_type_id: "",
    organization_leave_type_id: "",
    entitled_days: "",
    carry_forward_days: "",
    entitlement_period:"",
    encashment_allowed: "",
    max_accumulated_days: "",
    requires_approval: "",
    priority_level: "",
    is_active: "",
    created_by: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  const [location, setLocation] = useState([]);
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [empType, setEmpType] = useState([]);
  const [empStatus, setEmpStatus] = useState([]);
  const [workshift, setWorkShift] = useState([]);
  const [workshiftType, setWorkShiftType] = useState([]);

  const [businessRegType, setBusinessRegType] = useState([]);

  const [businessOwnType, setBusinessOwnType] = useState([]);
  const [leavetype, setLeaveType] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchOrganizationDepartment(org.organization_id)
        .then((data) => {
          setDepartment(data?.Departments);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);
  console.log("organizationdepartment", department);

  useEffect(() => {
    {
      fetchOrganizationLocation(org.organization_id)
        .then((data) => {
          setLocation(data?.locations);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);
  console.log("organizationdepartment", department);

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

  console.log("designation is ", designation);

  useEffect(() => {
    {
      fetchLeaveTypes(org.organization_id)
        .then((data) => {
          setLeaveType(data?.leavetypes?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  console.log("emptypes ", empType);

  useEffect(() => {
    if (org?.organization_id) {
      fetchOrganizationLocation(org?.organization_id)
        .then((data) => {
          setLocation(data?.locations);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);

  useEffect(() => {
    if (org?.organization_id) {
      fetchOrganizationEmploymentTypes(org?.organization_id)
        .then((data) => {
          setEmpType(data?.employemtType?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);

  useEffect(() => {
    if (org?.organization_id) {
      fetchOrganizationEmploymentStatus(org?.organization_id)
        .then((data) => {
          setEmpStatus(data?.status?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);

  useEffect(() => {
    if (org?.organization_id) {
      fetchWorkShift(org?.organization_id)
        .then((data) => {
          setWorkShift(data?.workshifts?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);

  useEffect(() => {
    if (org?.organization_id) {
      fetchWorkShiftTypes(org?.organization_id)
        .then((data) => {
          setWorkShiftType(data?.workshifttype?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);

  useEffect(() => {
    if (org?.organization_id) {
      fetchBusinessRegistrationType(org?.organization_id)
        .then((data) => {
          setBusinessRegType(data?.organizationbusinessregistrationtype?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);

  useEffect(() => {
    if (org?.organization_id) {
      fetchOrgBusinessOwnershipType(org?.organization_id)
        .then((data) => {
          setBusinessOwnType(data?.businessownershiptype);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/employee-entitlements/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.leaveEntitle;
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

  const handleSwitchChange = (field) => (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? 1 : 0, // Always store as 1/0
    }));
  };

  const validateForm = () => {
    const errors = {};

   
    
    if (!formData.organization_employment_type_id) {
      errors.organization_employment_type_id = "Leave Type is required.";
    }


    
    if (!formData.entitled_days) {
      errors.entitled_days = "Entitle days  are required.";
    }

    
    if (!formData.entitlement_period) {
      errors.entitlement_period = "Entitlement period is required.";
    }

    

  

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-entitlements/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-entitlements`,
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
          ? "Employee Leave Entitlement Updated!"
          : "Employee Leave Entitlement Created!"
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
  // const calculateTotalLeaveHours = (startTime, endTime) => {
  //   if (!startTime || !endTime) return "0 hours 0 minutes";

  //   const refDate = "2000-01-01"; // arbitrary fixed date
  //   const start = dayjs(`${refDate} ${startTime}`, "YYYY-MM-DD HH:mm:ss");
  //   const end = dayjs(`${refDate} ${endTime}`, "YYYY-MM-DD HH:mm:ss");

  //   if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
  //     return "0 hours 0 minutes";
  //   }

  //   const diffMinutes = end.diff(start, "minute");
  //   const hours = Math.floor(diffMinutes / 60);
  //   const minutes = diffMinutes % 60;

  //   return ` ${hours} hours ${minutes} minutes `;
  // };

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Employee Leave Entitlement"}
        addMessage={"Employee Leave Entitlement"}
        homeLink={"/leave/employee-entitlements"}
        homeText={"Employee Leaves Entitlement"}
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
                  label="Leave Type"
                  name="organization_leave_type_id"
                  value={formData?.organization_leave_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_leave_type_id}
                  helperText={formErrors.organization_leave_type_id}
                  required
                >
                  {leavetype?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_leave_type_id}
                        value={option.organization_leave_type_id}
                      >
                        {option.leave_type_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  fullWidth
                  type="number"
                  label="Entitled Days"
                  name="entitled_days"
                  value={formData?.entitled_days}
                  onChange={handleChange}
                  error={!!formErrors.entitled_days}
                  helperText={formErrors.entitled_days}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: "0.01", max: "100" }}
                />

                <TextField
                  select
                  fullWidth
                  label="Entitlement Period"
                  name="entitlement_period"
                  value={formData?.entitlement_period}
                  onChange={handleChange}
                  error={!!formErrors.entitlement_period}
                  helperText={formErrors.entitlement_period}
                  required
                >
                  <MenuItem value="annual">Annual</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </TextField>




                <TextField
                  select
                  fullWidth
                  label="Department Name"
                  name="organization_department_id"
                  value={formData?.organization_department_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_department_id}
                  helperText={formErrors.organization_department_id}
                  
                >
                  {department?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_department_id}
                        value={option.organization_department_id}
                      >
                        {option?.department_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Designation Name"
                  name="organization_designation_id"
                  value={formData?.organization_designation_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_designation_id}
                  helperText={formErrors.organization_designation_id}
                  
                >
                  {designation?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_designation_id}
                        value={option.organization_designation_id}
                      >
                        {option?.designation_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Organization Location"
                  name="organization_location_id"
                  value={formData?.organization_location_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_location_id}
                  helperText={formErrors.organization_location_id}
                  
                >
                  {location?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_location_id}
                        value={option.organization_location_id}
                      >
                        {option?.location_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Employment Type"
                  name="organization_employment_type_id"
                  value={formData?.organization_employment_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_employment_type_id}
                  helperText={formErrors.organization_employment_type_id}
                  
                >
                  {empType?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_employment_type_id}
                        value={option.organization_employment_type_id}
                      >
                        {option?.employment_type_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Employment Status"
                  name="organization_employment_status_id"
                  value={formData?.organization_employment_status_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_employment_status_id}
                  helperText={formErrors.organization_employment_status_id}
                  
                >
                  {empStatus?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_employment_status_id}
                        value={option.organization_employment_status_id}
                      >
                        {option?.employment_status_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="WorkShift"
                  name="organization_work_shift_id"
                  value={formData?.organization_work_shift_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_work_shift_id}
                  helperText={formErrors.organization_work_shift_id}
                  
                >
                  {workshift?.map((option) => {
                    return (
                      <MenuItem
                        key={option?.organization_work_shift_id}
                        value={option.organization_work_shift_id}
                      >
                        {option?.work_shift_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="WorkShift Type"
                  name="organization_work_shift_type_id"
                  value={formData?.organization_work_shift_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_work_shift_type_id}
                  helperText={formErrors.organization_work_shift_type_id}
                  
                >
                  {workshiftType?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_work_shift_type_id}
                        value={option.organization_work_shift_type_id}
                      >
                        {option?.work_shift_type_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Business Registration Type"
                  name="organization_business_registration_type_id"
                  value={formData?.organization_business_registration_type_id}
                  onChange={handleChange}
                  error={
                    !!formErrors.organization_business_registration_type_id
                  }
                  helperText={
                    formErrors.organization_business_registration_type_id
                  }
                  
                >
                  {businessRegType?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_business_registration_type_id}
                        value={
                          option.organization_business_registration_type_id
                        }
                      >
                        {option?.business_registration_type_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Business Ownership Type"
                  name="organization_business_ownership_type_id"
                  value={formData?.organization_business_ownership_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_business_ownership_type_id}
                  helperText={
                    formErrors.organization_business_ownership_type_id
                  }
                  
                >
                  {businessOwnType?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_business_ownership_type_id}
                        value={option.organization_business_ownership_type_id}
                      >
                        {option?.organization_business_ownership_type_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

             
                <TextField
                  fullWidth
                  type="number"
                  label="Carry Forward Days"
                  name="carry_forward_days"
                  value={formData?.carry_forward_days}
                  onChange={handleChange}
                  error={!!formErrors.carry_forward_days}
                  helperText={formErrors.carry_forward_days}
                  
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: "0.01", max: "100" }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Max Accumulated Days"
                  name="max_accumulated_days"
                  value={formData?.max_accumulated_days}
                  onChange={handleChange}
                  error={!!formErrors.max_accumulated_days}
                  helperText={formErrors.max_accumulated_days}
                  
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: "0.01", max: "100" }}
                />

                {/* <TextField
                  fullWidth
                  type="number"
                  label="Priority Levels"
                  name="priority_level"
                  value={formData?.priority_level}
                  onChange={handleChange}
                  error={!!formErrors.priority_level}
                  helperText={formErrors.priority_level}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: "0.01", max: "100" }}
                /> */}

                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        formData?.requires_approval === 1 ||
                        formData?.requires_approval === "1"
                      }
                      onChange={handleSwitchChange("requires_approval")}
                      color="primary"
                    />
                  }
                  label="Required Approval"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        formData?.encashment_allowed === 1 ||
                        formData?.encashment_allowed === "1"
                      }
                      onChange={handleSwitchChange("encashment_allowed")}
                      color="primary"
                    />
                  }
                  label="Encashment Allowed"
                />

                {/* <FormControlLabel
                  control={
                    <Switch
                      checked={
                        formData?.is_active === 1 || formData?.is_active === "1"
                      }
                      onChange={handleSwitchChange("is_active")}
                      color="primary"
                    />
                  }
                  label="Is Active"
                /> */}

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
                    <CircularProgress size={24} color="inherit" />
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

export default EmployeeLeaveEntitlmentForm;
