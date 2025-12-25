import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Grid,
  Alert,
  MenuItem,
  capitalize,
  Autocomplete,
} from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../DataLayouts/Header";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import axios from "axios";
import { ApplicationRoles, SystemRoles } from "../../Apis/Organization-User";
import { MAIN_URL } from "../../Configurations/Urls";
import { fetchUserTypes } from "../../Apis/UserTypes";
import SelectWithImage from "../../Components/Inputs/SelectWithImage";
import { fetchGeneralCountriesall } from "../../Apis/OrganizationLocation";
import { fetchOrganizationEmployee } from "../../Apis/Employee-api";
import { fetchInterns } from "../../Apis/InternManagement";

const steps = ["Enter Email", "Verify OTP", "Complete Details"];

function UsersAdd() {
  const [activeStep, setActiveStep] = useState(0);
  const [countryCode, setCountryCode] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const { userData } = useAuthStore();
  const [Roles, setRoles] = useState([]);
  const org = userData?.organization;
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [userTypes, setUserTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [Employees, setEmployees] = useState([]);

  const [Interns , setInterns]= useState([])

  const [debugOtp, setDebugOtp] = useState("");

  useEffect(() => {
    fetchGeneralCountriesall()
      .then((data) => {
        const formatted = data.countries.map((item) => ({
          name: item.country_name,
          code: item.country_code,
          phone_code: item.country_phone_code,
        }));
        setCountries(formatted);
        setCountryCode(formatted.find((item) => item.code === "IN"));
      })
      .catch((err) => setFormErrors(err.message));
  }, []);

  console.log("countryCode is ", countryCode);

  console.log("isers types ", userTypes);

  const [userDetails, setUserDetails] = useState({
    user_name: "",
    phone: "",
    application_user_role_id: null,
    password_hash: "",
    organization_user_type_id: "",
    phone_code: "",
    organization_id: org?.organization_id,
    email: "",
    employee_id: "",
  });

  useEffect(() => {
    if (countryCode?.phone_code) {
      setUserDetails((prev) => ({
        ...prev,
        phone_code: countryCode.phone_code,
      }));
    }
  }, [countryCode]);

  useEffect(() => {
    fetchOrganizationEmployee(org?.organization_id)
      .then((data) => {
        const filteredEmployees = data?.filter(
          (item) => item.employment_status !== "Exited"
        );

        setEmployees(filteredEmployees);
      })
      .catch((err) => {
        setFormErrors(err.message);
      });
  }, []);
  console.log("employees sus ", Employees);



  // fetch interns 
  useEffect(() => {
    if (!org?.organization_id) return;

    fetchInterns(org.organization_id)
      .then((data) => {
        const interns = data?.intership?.data || [];
        const filteredInterns = interns.filter(
          (intern) =>
            intern?.status?.internship_status_name !== "Exited"
        );
        setInterns(filteredInterns);
      })
      .catch((err) => {
        setFormErrors({ general: err.message });
      });
  }, [org?.organization_id]);





  useEffect(() => {
    fetchUserTypes(org?.organization_id)
      .then((data) => {
        setUserTypes(data?.userTypes?.data);
      })
      .catch((err) => {
        setFormErrors(err.message);
      });
  }, []);
  console.log("user types ", userTypes);

  const navigate = useNavigate();

  console.log("user details ", userDetails);

  // get system roles
  useEffect(() => {
    ApplicationRoles()
      .then((data) => {
        setRoles(data?.userroles);
      })
      .catch((err) => {
        setFormErrors(err.message);
      });
  }, []);
  console.log("system roles", Roles);

  const selectedUserType = userTypes?.find(
    (type) =>
      type.organization_user_type_id === userDetails.organization_user_type_id
  );

  const isEmployeeUser =
    selectedUserType?.user_type_name?.toLowerCase() === "employee";


    const isInternUser = selectedUserType?.user_type_name?.toLowerCase() === "intern";

  const handleDetailChange = (e) => {
    const { name, value } = e.target;

    if (name === "employee_id") {
      const selectedEmp = Employees.find(
        (emp) => emp.employee_id === parseInt(value)
      );
      console.log("selected employed  ios ", selectedEmp);

      if (selectedEmp) {
        setUserDetails((prev) => ({
          ...prev,
          employee_id: value,
          user_name: `${selectedEmp?.name|| ""}`.trim(),
          phone: selectedEmp?.contact?.personal_phone_number || "",
          email: selectedEmp?.contact?.personal_email || "",
        }));
      }
    } 

    else if (name === "intern_id") {
    const selectedIntern = Interns.find(
      (i) => i.intern_id === parseInt(value)
    );

    if (selectedIntern) {
      setUserDetails((prev) => ({
        ...prev,
        intern_id: value,
        user_name: `${selectedIntern?.first_name} ${selectedIntern?.middle_name || ""} ${selectedIntern?.last_name || ""}`.trim(),
        phone: selectedIntern?.contact?.personal_phone_number || "",
        email: selectedIntern?.contact?.personal_email || "",
      }));
    }
  }

    else if (name === "organization_user_type_id") {
      const selectedType = userTypes.find(
        (type) => type.organization_user_type_id === parseInt(value)
      );

      const isEmployee =
        selectedType?.user_type_name?.toLowerCase() === "employee";

      setUserDetails((prev) => ({
        ...prev,
        organization_user_type_id: value,
        // If not employee, clear these fields
        employee_id: isEmployee ? prev.employee_id : "",
        user_name: isEmployee ? prev.user_name : "",
        phone: isEmployee ? prev.phone : "",
        email: isEmployee ? prev.email : "",
      }));
    } else {
      setUserDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!userDetails.user_name) errors.user_name = "User's Name is required.";

    if (!userDetails.phone) errors.phone = "Phone is required.";

    if (!userDetails.organization_user_type_id)
      errors.organization_user_type_id = "User Type is required.";

    if (!userDetails.application_user_role_id)
      errors.application_user_role_id = "Role is required.";

    if (userDetails.email && !isValidEmail(userDetails.email)) {
      errors.email = "Enter a valid  email address.";
    }

    if (!userDetails.email) errors.email = "Email is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleFinalSubmit = async () => {
    if (!validateForm()) return;
    setBtnLoading(true);

    console.log({ ...userDetails, email, phone_verified: 0, is_active: 1 });

    try {
      // Call create user API
      await axios.post(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/user/create-new-user`,
        { ...userDetails, phone_verified: 0, is_active: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("User created successfully!");
      setFormErrors({});
      navigate("/users");
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
      setBtnLoading(false);
    }
  };

  return (
    <Box px={4} py={4} minHeight={"100vh"}>
      <Header
        mode={"add"}
        updateMessage={"User"}
        addMessage={"User"}
        homeLink={"/users"}
        homeText={"Users"}
      />

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <TextField
            select
            fullWidth
            label="User Type"
            name="organization_user_type_id"
            value={userDetails.organization_user_type_id}
            onChange={handleDetailChange}
            error={!!formErrors.organization_user_type_id}
            helperText={formErrors.organization_user_type_id}
            disabled={userTypes?.length === 0}
            required
            sx={{ textTransform: "capitalize" }}
          >
            {userTypes?.map((option) => (
              <MenuItem
                key={option?.organization_user_type_id}
                value={option?.organization_user_type_id}
                sx={{ textTransform: "capitalize" }}
              >
                {option?.user_type_name}
              </MenuItem>
            ))}
          </TextField>

          {/* {isEmployeeUser && (
            <TextField
              select
              fullWidth
              label="Select Employee"
              name="employee_id"
              value={userDetails.employee_id}
              onChange={handleDetailChange}
              error={!!formErrors.employee_id}
              helperText={formErrors.employee_id}
              required
            >
              {Employees?.map((option) => (
                <MenuItem key={option?.employee_id} value={option?.employee_id}>
                  {`${option?.first_name} ${option?.middle_name || ""}
${option?.last_name || ""} - ID: ${option?.employee_code}`}
                </MenuItem>
              ))}
            </TextField>
          )} */}

          {isEmployeeUser && (
            <Autocomplete
              fullWidth
              options={Employees || []}
              getOptionLabel={(option) =>
                `${option?.name || ""} - ID: ${option?.employee_code || ""}`.trim()
              }
              value={
                Employees?.find(
                  (emp) => emp?.employee_id === userDetails?.employee_id
                ) || null
              }
              onChange={(event, newValue) => {
                handleDetailChange({
                  target: {
                    name: "employee_id",
                    value: newValue?.employee_id || "",
                  },
                });
              }}
              isOptionEqualToValue={(option, value) =>
                option?.employee_id === value?.employee_id
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Employee"
                  name="employee_id"
                  required
                  error={!!formErrors?.employee_id}
                  helperText={formErrors?.employee_id}
                  fullWidth
                />
              )}
            />
          )}


          {isInternUser && (
  <Autocomplete
    fullWidth
    options={Interns || []}
    getOptionLabel={(option) =>
      `${option?.first_name || ""}  ${option?.middle_name || ""} ${option?.last_name || ""}( ${option?.intern_code || ""})`.trim()
    }
    value={
      Interns?.find(
        (i) => i?.intern_id === userDetails?.intern_id
      ) || null
    }
    onChange={(event, newValue) => {
      handleDetailChange({
        target: {
          name: "intern_id",
          value: newValue?.intern_id || "",
        },
      });
    }}
    isOptionEqualToValue={(option, value) =>
      option?.intern_id === value?.intern_id
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Select Intern"
        name="intern_id"
        required
        error={!!formErrors?.intern_id}
        helperText={formErrors?.intern_id}
        fullWidth
      />
    )}
  />
)}


          <TextField
            select
            fullWidth
            label="User Role"
            name="application_user_role_id"
            value={userDetails.application_user_role_id}
            onChange={handleDetailChange}
            error={!!formErrors.application_user_role_id}
            helperText={formErrors.application_user_role_id}
          >
            {Roles?.map((option) => (
              <MenuItem
                key={option.application_user_role_id}
                value={option.application_user_role_id}
              >
                {option.user_role_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            value={userDetails.user_name}
            error={!!formErrors.user_name}
            helperText={formErrors.user_name}
            fullWidth
            label="Full Name"
            name="user_name"
            onChange={handleDetailChange}
            required
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "25%",
              }}
            >
              <div
                style={{
                  border: "2px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "6px",
                }}
              >
                <SelectWithImage
                  value={countryCode}
                  error={false}
                  options={countries}
                  optionkey={"phone_code"}
                  onChange={(e, val) => setCountryCode(val)}
                  width="100%"
                  minWidth="20px"
                  disabled={false}
                  searchKeys={["name", "phone_code"]}
                />
              </div>
            </div>

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={userDetails.phone}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              onChange={handleDetailChange}
              required
              inputProps={{
                maxLength: 20, // Limit to 20 digits
                inputMode: "numeric", // Opens number pad on mobile
                onInput: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, ""); // remove all non-digits
                },
              }}
            />
          </div>

          <TextField
            fullWidth
            label="Email"
            type="text"
            name="email"
            value={userDetails.email}
            error={!!formErrors.email}
            helperText={formErrors.email}
            onChange={handleDetailChange}
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password_hash"
            value={userDetails.password_hash}
            error={!!formErrors.password_hash}
            helperText={formErrors.password_hash}
            onChange={handleDetailChange}
            required
          />

          <Button
            variant="contained"
            onClick={handleFinalSubmit}
            disabled={btnLoading}
          >
            {btnLoading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Create User"
            )}
          </Button>
        </Grid>
      </Paper>
    </Box>
  );
}

export default UsersAdd;
