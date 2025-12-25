import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  CircularProgress,
  Select,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import { fetchApplicationUser } from "../../../Apis/ApplicationManagementApis";

function ApplicationErrorLogForm({ mode }) {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    application_user_id: "",
    client_id: "",
    module_name: "",
    error_message: "",
    stack_trace: "",
    url_or_endpoint: "",
    payload_data: "",
    error_type: "",
    severity: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const errorTypes = ["frontend", "backend", "api", "db", "unknown"];
  const severitytypes = ["info", "info", "error", "critical"];

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchApplicationUser()
        .then((data) => {
          setUsers(data.users);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/application/error-logs/${id}`
      );
      let a = response.data.errorlogs;
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

 if (!formData.client_id) errors.client_id = "Client ID is required.";
  if (!formData.application_user_id)
    errors.application_user_id = "Application user is required.";
  if (!formData.module_name) errors.module_name = "Module name is required.";
  if (!formData.error_message)
    errors.error_message = "Error message is required.";
  if (!formData.stack_trace) errors.stack_trace = "Stack trace is required.";
  if (!formData.url_or_endpoint)
    errors.url_or_endpoint = "URL or Endpoint is required.";
  if (!formData.payload_data)
    errors.payload_data = "Payload data is required.";
  if (!formData.error_type) errors.error_type = "Error type is required.";
  if (!formData.severity)
    errors.severity = "Severity is required.";
  else if (!["info", "warning", "error", "critical"].includes(formData.severity))
    errors.severity = "Invalid severity selected.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  console.log("formdata", formData);
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/application/error-logs/${id}`,
          formData
        );
      } else {
        await axios.post(`${MAIN_URL}/api/application/error-logs`, formData);
      }

      toast.success(
        mode === "edit" ? "Error Logs Updated!" : "Error Logs Created!"
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
        updateMessage={"Error Logs"}
        addMessage={"Error Logs"}
        homeLink={"/application/user-errorlogs"}
        homeText={"Error Logs"}
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
                  label="Client ID"
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  error={!!formErrors.client_id}
                  helperText={formErrors.client_id}
                  required
                />

                <TextField
                  select
                  fullWidth
                  label="Application User"
                  name="application_user_id"
                  value={formData.application_user_id}
                  onChange={handleChange}
                  error={!!formErrors.application_user_id}
                  helperText={formErrors.application_user_id}
                  required
                >
                  {users.map((option) => (
                    <MenuItem
                      key={option.application_user_id}
                      value={option.application_user_id}
                    >
                      {option.full_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Module Name"
                  name="module_name"
                  value={formData.module_name}
                  onChange={handleChange}
                  error={!!formErrors.module_name}
                  helperText={formErrors.module_name}
                  required
                />

                <TextField
                  fullWidth
                  label="Error Message"
                  name="error_message"
                  value={formData.error_message}
                  onChange={handleChange}
                  error={!!formErrors.error_message}
                  helperText={formErrors.error_message}
                  required
                />

                <TextField
                  fullWidth
                  label="PayLoad Data"
                  name="payload_data"
                  value={formData.payload_data}
                  onChange={handleChange}
                  error={!!formErrors.payload_data}
                  helperText={formErrors.payload_data}
                  required
                />

                 <TextField
                  fullWidth
                  label="URL/Endpoint"
                  name="url_or_endpoint"
                  value={formData.url_or_endpoint}
                  onChange={handleChange}
                  error={!!formErrors.url_or_endpoint}
                  helperText={formErrors.url_or_endpoint}
                  required
                />

                 <TextField
                  fullWidth
                  label="Stack Trace"
                  name="stack_trace"
                  value={formData.stack_trace}
                  onChange={handleChange}
                  error={!!formErrors.stack_trace}
                  helperText={formErrors.stack_trace}
                  required
                />

                <FormControl fullWidth error={!!formErrors.error_type} required>
                  <InputLabel id="error-type-label">Error Type</InputLabel>
                  <Select
                    labelId="error-type-label"
                    id="error_type"
                    name="error_type"
                    value={formData.error_type}
                    onChange={handleChange}
                    label="Error Type"
                  >
                    {errorTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type?.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>

                  {formErrors.error_type && (
                    <div style={{ color: "red", fontSize: "0.8rem" }}>
                      {formErrors.error_type}
                    </div>
                  )}
                </FormControl>

                <FormControl fullWidth error={!!formErrors.severity} required>
                  <InputLabel id="severity-label">Severity</InputLabel>
                  <Select
                    labelId="severity-label"
                    id="severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    label="Severity"
                  >
                    {severitytypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type?.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>

                  {formErrors.severity && (
                    <div style={{ color: "red", fontSize: "0.8rem" }}>
                      {formErrors.severity}
                    </div>
                  )}
                </FormControl>

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

export default ApplicationErrorLogForm;
