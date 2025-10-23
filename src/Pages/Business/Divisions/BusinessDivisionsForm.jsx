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
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { fetchBusinessDivision } from "../../../Apis/BusineesDivision-api";
import axios from "axios";
import {   MAIN_URL } from "../../../Configurations/Urls";

function BusinessDivisionForm({ mode }) {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [busineesdivision, setbusineesdivision] = useState([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [formErrors, setFormErrors] = useState({});
  const [btnLoading, setbtnLoading] = useState(false);
  const { id } = useParams();

  const [formData, setFormData] = useState({
    business_division_name: "",
    business_division_short_name: "",
    description: "",
  });
  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/business-division/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
      console.log("response", response);
      let a = response.data.businessDivision;
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
    if (!formData.business_division_name)
      errors.business_division_name = "Division Name is required.";
    else if (formData.business_division_name?.length > 50)
      errors.business_division_name = "Max 50 characters.";

    if (!formData.business_division_short_name)
      errors.business_division_short_name =
        "Divison's Short Name Type is required.";

    if (!formData.description)
      errors.description = "Divison's Description is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);
    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/business-division/${id}`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/business-division`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      }
      toast.success(
        mode === "edit"
          ? "Business Division updated!"
          : "Business Division created!"
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
                  label="Division Name"
                  name="business_division_name"
                  value={formData.business_division_name}
                  onChange={handleChange}
                  error={!!formErrors.business_division_name}
                  helperText={formErrors.business_division_name}
                />
                <TextField
                  fullWidth
                  label="Division Short Name"
                  name="business_division_short_name"
                  value={formData.business_division_short_name}
                  onChange={handleChange}
                  error={!!formErrors.business_division_short_name}
                  helperText={formErrors.business_division_short_name}
                />
                <TextField
                  fullWidth
                  label="Division Discription"
                  name="description"
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

export default BusinessDivisionForm;
