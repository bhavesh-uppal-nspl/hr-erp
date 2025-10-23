import React, { useState, useEffect } from "react";
import { fetchOrgBusinessOwnershipType } from "../../../Apis/BusinessOwnershipType.js";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Paper,
  MenuItem,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls.js";

function OrganizationProfile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formErrors, setFormErrors] = useState({});
  const [btnLoading, setbtnLoading] = useState(false);
  const [BusinessOwnershipType, setBusinessOwnershipType] = useState([]);

  const [profile, setProfile] = useState({
    organization_id: "",
    website: "",
    email: "",
    phone: "",
    logo_file: null,
    logo_url: "",
    establishment_date: "",
    organization_business_ownership_type_id: "",
    general_industry_id: "",
    general_business_ownership_type_category_id: "",
  });

  // get the data from table
  useEffect(() => {
    const fetchOrganizationProfile = async () => {
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org.organization_id}/business-identity-profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response?.data?.profile;
        console.log("data of profile is ", data);
        setProfile((prev) => ({
          ...prev,
          ...data, // merged identity + business data
        }));
      } catch (err) {
        console.error(err);
      }
    };

    if (org?.organization_id) {
      fetchOrganizationProfile();
    }
  }, [org]);

  useEffect(() => {
    if (!org) return;

    setProfile((prev) => ({
      ...prev,
      organization_id: org.organization_id || "",
    }));

    fetchOrgBusinessOwnershipType(org.organization_id)
      .then((data) => {
        setBusinessOwnershipType(data?.businessownershiptype);
      })
      .catch((err) => {
        setFormErrors({ fetch: err.message });
      });
  }, [org]);

  const validateForm = () => {
    const newErrors = {};
    const urlRegex =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]+$/;

if (profile.website.trim()) {
  if (!urlRegex.test(profile.website.trim())) {
    newErrors.website = "Website must be a valid URL.";
  }
}

    if (!profile.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(profile.email.trim())) {
      newErrors.email = "Email must be a valid email address.";
    }

    if (!profile.phone.trim()) {
      newErrors.phone = "Phone is required.";
    } else if (!phoneRegex.test(profile.phone.trim())) {
      newErrors.phone = "Phone must contain digits only.";
    } else if (profile.phone?.length < 10) {
      newErrors.phone = "Phone must be of 10 digits.";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      logo_file: file,
      logo_url: previewURL,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("organization_id", profile.organization_id);
    formData.append("website", profile.website);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);
    if (profile.establishment_date) {
  formData.append("establishment_date", profile.establishment_date);
}
    formData.append(
      "organization_business_ownership_type_id",
      profile.organization_business_ownership_type_id
    );
    formData.append("logo_url", profile.logo_file);

    setbtnLoading(true);
    try {
      await axios.post(
        `${MAIN_URL}/api/organizations/${org.organization_id}/business-identity-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Organization Profile saved successfully!");
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

  return (
    <Box px={isMobile ? 2 : 5} py={4}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Organization Profile
      </Typography>

      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              src={profile.logo_url}
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <IconButton color="primary" component="label">
              <PhotoCamera />
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="Website"
            name="website"
            value={profile.website}
            onChange={handleProfileChange}
            margin="normal"
            error={!!formErrors.website}
            helperText={formErrors.website}
            inputProps={{ maxLength: 255 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            margin="normal"
            error={!!formErrors.email}
            helperText={formErrors.email}
            required
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={profile.phone}
            onChange={(e) => {
              const input = e.target.value;
              // ✔ Only allow digits (0–15 characters)
              if (/^\d{0,15}$/.test(input)) {
                handleProfileChange(e);
              }
            }}
            margin="normal"
            error={!!formErrors.phone}
            helperText={formErrors.phone}
            required
            inputProps={{
              maxLength: 25,
              inputMode: "numeric", 
              pattern: "[0-9]*", 
            }}
          />

          <TextField
            select
            fullWidth
            label="Business Ownership Type"
            name="organization_business_ownership_type_id"
            value={profile.organization_business_ownership_type_id}
            onChange={handleProfileChange}
            margin="normal"
            error={!!formErrors.organization_business_ownership_type_id}
            helperText={formErrors?.organization_business_ownership_type_id}
          >
            {BusinessOwnershipType?.map((option) => (
              <MenuItem
                key={option.organization_business_ownership_type_id}
                value={option.organization_business_ownership_type_id}
              >
                {option.organization_business_ownership_type_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Business Category"
            inputProps={{ min: 1 }}
            value={
              profile?.general_category
                ?.business_ownership_type_category_name || ""
            }
            margin="normal"
          />

          <TextField
           style={{ marginTop: "12px" }}
            fullWidth
            label="Industry Type"
            value={profile?.general_industry?.industry_name || ""}
          />

          <TextField
            fullWidth
            label="Establishment Date"
            name="establishment_date"
            type="date"
            value={profile.establishment_date}
            InputLabelProps={{ shrink: true }}
            onChange={handleProfileChange}
            margin="normal"
            error={!!formErrors.establishment_date}
            helperText={formErrors.establishment_date}
          />
          {/* <TextField
            fullWidth
            label="No of Employees"
            name="number_of_employees"
            type="number"
            inputProps={{ min: 1 }}
            value={profile.number_of_employees}
            onChange={handleProfileChange}
            margin="normal"
            error={!!formErrors.number_of_employees}
            helperText={formErrors.number_of_employees}
          /> */}

          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={handleSubmit}
            disabled={btnLoading}
            sx={{
              marginTop: 1,
              borderRadius: 2,
              minWidth: 120,
              textTransform: "capitalize",
              fontWeight: 500,
            }}
          >
            {btnLoading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Submit"
            )}
          </Button>
        </Paper>
      </Grid>
    </Box>
  );
}

export default OrganizationProfile;
