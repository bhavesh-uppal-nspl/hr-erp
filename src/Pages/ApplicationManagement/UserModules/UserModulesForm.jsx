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
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";

function UserModuleForm({ mode }) 
{
  const { id } = useParams();
  const [formData, setFormData] = useState({
    module_name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/application/module/${id}`
      );
      let a = response.data.modules;
      console.log("a", a);
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

    if (!formData.module_name)
      errors.module_name = "User module name is required.";

    if (!formData.description) errors.description = "Description is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        // Call edit API
        await axios.put(`${MAIN_URL}/api/application/module/${id}`, formData);
      } else {
        await axios.post(`${MAIN_URL}/api/application/module`, formData);
      }

      toast.success(
        mode === "edit" ? "User Module Updated!" : "User Module Created!"
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
        updateMessage={"User Module"}
        addMessage={"Application User Module"}
        homeLink={"/application/user-modules"}
        homeText={"Application User Modules"}
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
                  label="User Module Name"
                  name="module_name"
                  value={formData.module_name}
                  onChange={handleChange}
                  error={!!formErrors.module_name}
                  helperText={formErrors.module_name}
                  required
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
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

export default UserModuleForm;
