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
import { fetchBusinessRegistrationType } from "../../../Apis/Registration-api";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import{fetchApplicationUserModules} from '../../../Apis/ApplicationManagementApis'

function ModuleActionForm({ mode }) {
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [modules, setModules] = useState([]);
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [formData, setFormData] = useState({
    module_action_name: "",
    module_action_code : "",
    description: "",
    application_module_id : "",
  });


  useEffect(() => {
    {
      fetchApplicationUserModules()
        .then((data) => {
          setModules(data.modules.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);


  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/application/module-action/${id}`,
      );
      let a = response.data.modulesaction;
      console.log("a of edit", a);

      setFormData(a);
      setLoading(false);
    };
    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  console.log("formdata", formData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.application_module_id ) {
      errors.application_module_id  =
        "Module Type is required.";
    }

     if (!formData.module_action_name) {
      errors.module_action_name =
        "Module Action Name is required.";
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
          `${MAIN_URL}/api/application/module-action/${id}`,
          formData,
          
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/application/module-action`,
          formData,
          
        );
      }

      toast.success(
        mode === "edit"
          ? "Module Action Updated!"
          : "Module Action Created!"
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
        updateMessage={"Module Action"}
        addMessage={"Module Action"}
        homeLink={"/organization/module-action"}
        homeText={"Module Action"}
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
                  label="Module Type"
                  name="application_module_id"
                  value={formData.application_module_id}
                  onChange={handleChange}
                  error={
                    !!formErrors.application_module_id
                  }
                  helperText={
                    formErrors.application_module_id
                  }
                  required
                >
                  {modules.map((option) => (
                    <MenuItem
                      key={option.application_module_id}
                      value={option.application_module_id}
                    >
                      {option.module_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Module Action Name"
                  name="module_action_name"
                  value={formData.module_action_name}
                  onChange={handleChange}
                  error={!!formErrors.module_action_name}
                  helperText={formErrors.module_action_name}
                  required
                    inputProps={{ maxLength: 100 }}
                />

                <TextField
                  fullWidth
                  label="Action Code"
                  name="module_action_code"
                  value={formData.module_action_code}
                  onChange={handleChange}
                  error={!!formErrors.module_action_code}
                  helperText={formErrors.module_action_code}
                    inputProps={{ style:{textTransform:"uppercase"}, maxLength: 20 }}
                />

                <TextField
                  fullWidth
                  label="Description"
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

export default ModuleActionForm;
