import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls.js";
import OrganizationData from "./OrganizationData.jsx";

function Organisation() {
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_name: "",
    organization_short_name: "",
  });
  const [btnLoading, setbtnLoading] = useState(false);
  const [errors, setErrors] = useState({
    organization_name: "",
    organization_short_name: "",
  });

  const [showOrganizationData, setShowOrganizationData] = useState(false); // <-- toggle state

  useEffect(() => {
    if (org) {
      setFormData({
        organization_name: org?.organization_name || "",
        organization_short_name: org?.organization_short_name || "",
      });
    }
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.organization_name.trim())
      newErrors.organization_name = "Organization name is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setbtnLoading(true);

    try {
      await axios.put(
        `${MAIN_URL}/api/organizations/${org.organization_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Organization updated successfully!");
      setErrors({});
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        toast.error("Something went wrong.");
      }
    }
    setbtnLoading(false);
  };

  return (
    <Box px={isMobile ? 2 : 5} py={4}>
      {/* Toggle Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="outlined"
          onClick={() => setShowOrganizationData(!showOrganizationData)}
        >
          {showOrganizationData ? "Close Add Organization" : "Add Organization"}
        </Button>
      </Box>

      {/* Conditionally Show OrganizationData */}
      {showOrganizationData && (
        <OrganizationData
          data={{
            organization_name: "",
            organization_short_name: "",
            general_cuntry_id: "",
            general_state_id: "",
            application_user_id: "",
            hash_password: "",
            email: "",
            general_business_ownership_type_category_id: "",
            general_industry_id: "",
            general_city_id: "",
          }}
        />
      )}

      <Typography variant="h5" fontWeight={600} mb={3}>
        Organization
      </Typography>

      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 3 }}>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Organization Name"
              name="organization_name"
              value={formData.organization_name}
              onChange={handleChange}
              error={!!errors.organization_name}
              helperText={errors.organization_name}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Short Name"
              name="organization_short_name"
              value={formData.organization_short_name}
              onChange={handleChange}
              error={!!errors.organization_short_name}
              helperText={errors.organization_short_name}
              margin="normal"
            />

            <Box display="flex" justifyContent={isMobile ? "center" : "start"}>
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
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Box>
  );
}

export default Organisation;
