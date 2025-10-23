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
  IconButton,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { fetchBusinessRegistrationType } from "../../../Apis/Registration-api";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

function OrganizationRegistrationsForm({ mode }) {
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [documentUrl, setDocumentUrl] = useState("");
  const [file, setFile] = useState(null);
  const [registrationtypes, setregistrationtypes] = useState([]);
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [formData, setFormData] = useState({
    organization_business_registration_type_id: "",
    registration_applicable: false,
    registration_document_url: null,
    registration_number: "",
    registration_date: "",
    registration_expiry_date_applicable: false,
    registration_expiry_date: "",
  });

  // call registration type
  useEffect(() => {
    {
      fetchBusinessRegistrationType(org?.organization_id)
        .then((data) => {
          setregistrationtypes(data.organizationbusinessregistrationtype.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);
  console.log("registration types ", registrationtypes);

  let navigate = useNavigate();
  console.log("id is ", id);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/business-registration/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.organizationBusinessRegistration;

      if (a?.registration_document_url) {
        setDocumentUrl(a?.registration_document_url);
      }
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

  const handleFileChange = (e) => {
    const selectedFile = e?.target?.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDocumentUrl(URL.createObjectURL(selectedFile)); // Keep this for preview purposes
      setFormData((prev) => ({
        ...prev,
        registration_document_url: selectedFile,
      })); // Store the file object directly
    }
  };

  const handlePreview = () => {
    // Use file if selected, otherwise use backend URL
    const url = documentUrl || formData?.registration_document_url;
    if (!url) return;

    // Determine filename for extension and download
    const name = file?.name || url.split("/").pop();
    const fileExtension = name.split(".").pop().toLowerCase();

    if (
      ["pdf", "jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
        fileExtension
      )
    ) {
      // Open in new tab
      window.open(url, "_blank");
    } else {
      // Download other files
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setDocumentUrl("");
    setFormData((prev) => ({ ...prev, registration_document_url: "" }));
    setFileInputKey(Date.now()); // Reset the input
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_business_registration_type_id) {
      errors.organization_business_registration_type_id =
        "Registration type is required.";
    }

    if (formData.registration_applicable) {
      if (!formData.registration_number) {
        errors.registration_number = "Registration number is required.";
      } else if (formData.registration_number?.length > 20) {
        errors.registration_number = "Max 20 characters allowed.";
      }

      if (!formData.registration_date) {
        errors.registration_date = "Registration date is required.";
      }

      if (formData.registration_expiry_date_applicable) {
        if (!formData.registration_expiry_date) {
          errors.registration_expiry_date = "Expiry date is required.";
        } else if (
          formData.registration_date &&
          new Date(formData.registration_expiry_date) <=
            new Date(formData.registration_date)
        ) {
          errors.registration_expiry_date =
            "Expiry date must be after registration date.";
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  console.log("formdata is ", formData);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    // upload for the  file

    const payload = new FormData(); // <-- Use FormData

    payload.append(
      "organization_business_registration_type_id",
      formData.organization_business_registration_type_id
    );
    payload.append(
      "registration_applicable",
      formData.registration_applicable ? 1 : 0
    );

    payload.append("registration_number", formData.registration_number);
    payload.append("registration_date", formData.registration_date);
    payload.append(
      "registration_expiry_date_applicable",
      formData.registration_expiry_date_applicable ? 1 : 0
    );

    if (formData.registration_expiry_date_applicable) {
      payload.append(
        "registration_expiry_date",
        formData.registration_expiry_date || ""
      );
    } else {
      // Send empty string or null based on your API requirements
      payload.append("registration_expiry_date", "");
    }

    if (file) {
      payload.append("registration_document_url", file); // File appended properly
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/business-registration/${id}`,
          payload,
          config
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/business-registration`,
          payload,
          config
        );
      }

      toast.success(
        mode === "edit"
          ? "Business Registration Updated!"
          : "Business Registration Created!"
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
        updateMessage={"Registration"}
        addMessage={"Registration"}
        homeLink={"/organization/registrations"}
        homeText={"Registration"}
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
                  label="Registration Type"
                  name="organization_business_registration_type_id"
                  value={formData.organization_business_registration_type_id}
                  onChange={handleChange}
                  error={
                    !!formErrors.organization_business_registration_type_id
                  }
                  helperText={
                    formErrors.organization_business_registration_type_id
                  }
                  required
                >
                  {registrationtypes.map((option) => (
                    <MenuItem
                      key={option.organization_business_registration_type_id}
                      value={option.organization_business_registration_type_id}
                    >
                      {option.business_registration_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <Box mt={2}>
                  <label>
                    <input
                      type="checkbox"
                      name="registration_applicable"
                      checked={formData.registration_applicable}
                      onChange={handleChange}
                      style={{ marginRight: "10px" }}
                    />
                    Registration Applicable
                  </label>
                </Box>

                <TextField
                  fullWidth
                  label="Registration Number"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
                  error={!!formErrors.registration_number}
                  helperText={formErrors.registration_number}
                  inputProps={{
                    style: { textTransform: "uppercase" },
                    maxLength: 30,
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Registration Date"
                  name="registration_date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.registration_date}
                  onChange={handleChange}
                  error={!!formErrors.registration_date}
                  helperText={formErrors.registration_date}
                  required
                />

                <Typography variant="h6" sx={{ fontWeight: 100 }}>
                  {mode === "edit" ? "Update Document" : "Upload Document"}
                </Typography>
                <Divider />

                {/* File Picker */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      py: 1,
                      borderRadius: 2,
                      flexGrow: 1,
                    }}
                  >
                    {file || documentUrl ? "Change File" : "Choose File"}
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>

                  {(file || documentUrl) && (
                    <IconButton
                      size="small"
                      onClick={handlePreview}
                      key={fileInputKey}
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        "&:hover": { backgroundColor: "#bbdefb" },
                        border: "1px solid #ddd",
                        width: 32,
                        height: 32,
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  )}

                  {file && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={handleRemoveFile}
                      sx={{
                        backgroundColor: "#f5f5f5",
                        "&:hover": {
                          backgroundColor: "#e57373",
                          color: "#fff",
                        },
                        border: "1px solid #ddd",
                        width: 32,
                        height: 32,
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                {file && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#2e7d32",
                      fontWeight: 500,
                      mt: 0.5,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Selected: {file.name}
                  </Typography>
                )}

                <label style={{ width: "100%" }}>
                  <input
                    type="checkbox"
                    name="registration_expiry_date_applicable"
                    checked={formData.registration_expiry_date_applicable}
                    onChange={handleChange}
                    style={{ marginRight: "10px" }}
                  />
                  Expiry Date Applicable
                </label>

                {(formData.registration_expiry_date_applicable == 1 ||
                  formData.registration_expiry_date_applicable == true) && (
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    name="registration_expiry_date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.registration_expiry_date}
                    onChange={handleChange}
                    error={!!formErrors.registration_expiry_date}
                    helperText={formErrors.registration_expiry_date}
                  />
                )}
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid item>
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
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Grid>

                {mode === "edit" && (
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      onClick={() => navigate(-1)}
                      sx={{
                        borderRadius: 2,
                        minWidth: 120,
                        textTransform: "capitalize",
                        fontWeight: 500,
                        backgroundColor: "#1976d2",
                        "&:hover": { backgroundColor: "#115293" },
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default OrganizationRegistrationsForm;
