import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";

function OrganizationEmployementTypesForm({ mode }) {

  const { id } = useParams(); // only used in edit mode

  const [formData, setFormData] = useState({
    organization_employment_type_name: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    if (mode === "edit" && id) {
      setLoading(true);

      setTimeout(() => {
        const success = true;
        if (success) {
          setFormData({
             organization_employment_type_name: ""
          });
          setLoading(false);
        } else {
          setLoading(false);
        }
      }, 1000);
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_employment_type_name)
      errors. organization_employment_type_name = "Type's Name is required.";

  
    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setbtnLoading(true);

    setTimeout(() => {
      const success = true;
      if (success) {
        toast.success(mode === "edit" ? "Employment's Type updated!" : "Employment's Type created!");
        navigate(-1);
      } else {

      }
      setbtnLoading(false);
    }, 1000);
  };

  return (
    <Box px={4} py={4}>
      <Header mode={mode}
        updateMessage={"Employment's Type"}
        addMessage={"Employment's Type"}
        homeLink={"/employement/types"}
        homeText={"Employment's Type"}
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
                  label="Status"
                  name="organization_employment_type_name"
                  value={formData.organization_employment_type_name}
                  onChange={handleChange}
                  error={!!formErrors.organization_employment_type_name}
                  helperText={formErrors.organization_employment_type_name}
    
                  required
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
                  {(loading || btnLoading) ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : (
                    mode === "edit" ? "Update" : "Submit"
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

export default OrganizationEmployementTypesForm;
