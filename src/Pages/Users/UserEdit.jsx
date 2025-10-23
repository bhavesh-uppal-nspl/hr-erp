import React, { useState, useEffect } from "react";
import {
  ApplicationRoles,
  SystemRoles,
  fetchOrganizationDepartment,
} from "../../Apis/Organization-User";
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
} from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserTypes } from "../../Apis/UserTypes";
import Header from "../DataLayouts/Header";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../Configurations/Urls";
import { fetchGeneralCountriesall } from "../../Apis/OrganizationLocation";
import SelectWithImage from "../../Components/Inputs/SelectWithImage";

function UsersEdit() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [Roles, setRoles] = useState([]);
  const { userData } = useAuthStore();
  const [userTypes, setUserTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countryCode, setCountryCode] = useState(null);
  const org = userData?.organization;
  const [loading, setLoading] = useState();
  const { id } = useParams();

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

  const [userDetails, setUserDetails] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    organization_user_type_id: "",
    phone_code: "",
    application_user_role_id: "",
  });

  useEffect(() => {
    fetchUserTypes(org?.organization_id)
      .then((data) => {
        setUserTypes(data?.userTypes?.data);
      })
      .catch((err) => {
        setFormErrors(err.message);
      });
  }, []);

  // get user by id
  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("reponse sos id is ", response);
      let a = response.data.user;

      setUserDetails({
        email: a?.applicationuser?.[0]?.email,
        phone_number: a?.applicationuser?.[0]?.phone_number,
        full_name: a?.applicationuser?.[0]?.full_name,
        organization_user_type_id: a?.organization_user_type_id,
        phone_code: a?.applicationuser[0]?.country_phone_code,
        application_user_role_id:
          a?.role_assignment?.application_user_role?.application_user_role_id,
      });
      setLoading(false);
    };
    if (id) {
      setLoading(true);
      getdataById();
    }
  }, [id]);

  console.log("formdata", userDetails);

  const navigate = useNavigate();

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (countryCode?.phone_code) {
      setUserDetails((prev) => ({
        ...prev,
        phone_code: countryCode.phone_code,
      }));
    }
  }, [countryCode]);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const validateForm = () => {
    const errors = {};

    // if (!userDetails.email) errors.email = "User's email is required.";

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (!emailRegex.test(userDetails.email)) {
    //   errors.email = "Please enter a valid email address.";
    // }

    if (userDetails.email && !isValidEmail(userDetails.email)) {
      errors.email = "Enter a valid  email address.";
    }

    if (!userDetails.email) errors.email = "Email is required.";

    if (!userDetails.full_name) errors.full_name = "User's Name is required.";

    if (!userDetails.phone_number) errors.phone_number = "Phone is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleFinalSubmit = async () => {
    if (!validateForm()) return;
    setBtnLoading(true);

    try {
      // Prepare payload with only allowed fields for update
      const payload = {
        full_name: userDetails.full_name,
        email: userDetails.email,
        phone_number: userDetails.phone_number,
        phone_code: userDetails.phone_code,
        organization_user_type_id: userDetails.organization_user_type_id,
        email:userDetails?.email,
        application_user_role_id: userDetails?.application_user_role_id,
      };

      await axios.put(
        `${MAIN_URL}/api/organizations/${org.organization_id}/user/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("User Updated!");
      setFormErrors({});
      navigate(-1);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        const validationErrors =
          err.response.data.message || err.response.data.errors || {};
        setFormErrors(validationErrors);
        const errorMessages = Object.values(validationErrors).flat().join(" ");
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
        mode={"edit"}
        updateMessage={"User"}
        addMessage={"Edit User"}
        homeLink={"/users"}
        homeText={"Users"}
      />

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <TextField
            value={userDetails.full_name}
            error={!!formErrors.full_name}
            helperText={formErrors.full_name}
            fullWidth
            label="Full Name"
            name="full_name"
            onChange={handleDetailChange}
            required
          />

          <TextField
            value={userDetails.email}
            error={!!formErrors.email}
            helperText={formErrors.email}
            fullWidth
            label="Eamil"
            name="email"
            type="text"
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
                  // padding: "1px 8px",
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
              name="phone_number"
              value={userDetails.phone_number}
              error={!!formErrors.phone_number}
              helperText={formErrors.phone_number}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, ""); // Remove non-digits
                if (onlyDigits?.length <= 20) {
                  handleDetailChange({
                    target: { name: "phone_number", value: onlyDigits },
                  });
                }
              }}
              required
              inputProps={{
                maxLength: 20,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
          </div>

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
            select
            fullWidth
            label="User Type"
            name="organization_user_type_id"
            value={userDetails.organization_user_type_id}
            onChange={handleDetailChange}
            error={!!formErrors.organization_user_type_id}
            helperText={formErrors.organization_user_type_id}
            required
          >
            {userTypes?.map((option) => (
              <MenuItem
                key={option?.organization_user_type_id}
                value={option?.organization_user_type_id}
              >
                {option?.user_type_name}
              </MenuItem>
            ))}
          </TextField>
          {/* 
          <Button
            variant="contained"
            onClick={handleFinalSubmit}
            disabled={btnLoading}
          >
            {btnLoading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Update User"
            )}
          </Button> */}

          <Grid item>
            <Button
              variant="contained"
              onClick={handleFinalSubmit}
              disabled={btnLoading}
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
              {btnLoading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Update User"
              )}
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
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
        </Grid>
      </Paper>
    </Box>
  );
}

export default UsersEdit;
