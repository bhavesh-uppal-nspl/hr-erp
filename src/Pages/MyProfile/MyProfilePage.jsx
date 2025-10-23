import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../Configurations/Urls";

function OrganizationProfile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { userData } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [btnLoading, setbtnLoading] = useState(false);

  const [userprofile, setuserprofile] = useState({
    organization_id: "",
    user_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    {
      setuserprofile({
        organization_id: userData.organization_id || "",
        user_name: userData.full_name || "",
        email: userData.email || "",
        phone: userData.phone_number || "",
        phone_verified: userData.phone_verified || null,
        last_login: userData.last_login || "",
      });
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userprofile.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(userprofile.email.trim())) {
      newErrors.email = "Email must be a valid email address.";
    }

    const phoneRegex = /^[0-9]+$/;
    if (!userprofile.phone.trim()) {
      newErrors.phone = "Phone is required.";
    } else if (!phoneRegex.test(userprofile.phone.trim())) {
      newErrors.phone =
        "Phone must contain digits only, no letters or special characters.";
    } else if (userprofile.phone?.length < 10) {
      newErrors.phone = "Phone must be of 10 digits .";
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const formData = new FormData();
    formData.append("organization_id", userprofile.organization_id);
    formData.append("user_name ", userprofile.user_name);
    formData.append("email", userprofile.email);
    formData.append("phone", userprofile.phone);

    setbtnLoading(true);

    try {
      await axios.post(
        `${MAIN_URL}/api/organizations/${profile.organization_id}/user/${profile.organization_profile_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("My Profile updated successfully!");
      setFormErrors({});
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
    }
    setbtnLoading(false);
  };

  const handleCompanyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setuserprofile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <Box px={isMobile ? 2 : 5} py={4}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        My Profile
      </Typography>

      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Username"
            name="user_name"
            value={userprofile.user_name}
            onChange={handleCompanyChange}
            margin="normal"
            error={!!formErrors.user_name}
            helperText={formErrors.user_name}
            InputProps={{
              readOnly: true, 
            }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={userprofile.email}
            onChange={handleCompanyChange}
            margin="normal"
            error={!!formErrors.email}
            helperText={formErrors.email}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={userprofile.phone}
            onChange={handleCompanyChange}
            margin="normal"
            error={!!formErrors.phone}
            helperText={formErrors.phone}
            InputProps={{
              readOnly: true,
            }}
          />
        </Paper>
      </Grid>
    </Box>
  );
}

export default OrganizationProfile;
