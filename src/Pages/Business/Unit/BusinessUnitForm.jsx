import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {MAIN_URL } from "../../../Configurations/Urls";

function BusinessUnitForm({ mode }) {
  const { id } = useParams(); 
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [busineesunit, setbusineesunit] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  const [formData, setFormData] = useState({
    business_unit_name: "",
    business_unit_short_name: "",
    description: "",
  });

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/business-unit/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
      console.log("response of unit 1", response);
      let a = response.data.businessunit;
      setFormData(a);
      setLoading(false);
    };
    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  let navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.business_unit_name)
      errors.business_unit_name = "Unit Name is required.";
    else if (formData.business_unit_name?.length > 50)
      errors.business_unit_name = "Max 50 characters.";

    if (!formData.business_unit_short_name)
      errors.business_unit_short_name = "Unit's Short Name Type is required.";

    if (!formData.description)
      errors.description = "Unit's Description is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);
    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/business-unit/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },},
          formData
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/business-unit`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },},
          formData
        );
      }
      toast.success(
        mode === "edit"
          ? "Business Unit updated!"
          : "Business Unit created!"
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
        updateMessage={"Business Division"}
        addMessage={"Business Division"}
        homeLink={"/business/division"}
        homeText={"Business Divisions"}
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
                  fullWidth
                  label="Unit Name"
                  name="business_unit_name"
                  value={formData.business_unit_name}
                  onChange={handleChange}
                  error={!!formErrors.business_unit_name}
                  helperText={formErrors.business_unit_name}
                />
                <TextField
                  fullWidth
                  label="Short Name"
                  name="business_unit_short_name"
                  value={formData.business_unit_short_name}
                  onChange={handleChange}
                  error={!!formErrors.business_unit_short_name}
                  helperText={formErrors.business_unit_short_name}
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  margin="normal"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
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
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default BusinessUnitForm;
