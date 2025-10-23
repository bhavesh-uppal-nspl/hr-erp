"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import {
  fetchDocumentTypes,
  fetchEmployeeProfileSection,
} from "../../../Apis/Documents";

function DocumentForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const navigate = useNavigate();

  const [employee, setEmployee] = useState([]);
  const [docType, setDocType] = useState([]);

  const [file, setFile] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [profileSection, setProfileSection] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    employee_document_type_id: "",
    organization_id: "",
    document_name: "",
    organization_entity_id: "",
    document_url: "",
    organization_employee_profile_section_id: [], // Changed to array for multiple selections
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);

  // Load profile sections immediately
  useEffect(() => {
    fetchEmployeeProfileSection(org?.organization_id)
      .then((data) => {
        console.log("Profile Sections loaded:", data?.profileSections);
        setProfileSection(data?.profileSections);
      })
      .catch((err) => setFormErrors(err.message));
  }, [org?.organization_id]);

  useEffect(() => {
    fetchOrganizationEmployee(org?.organization_id)
      .then((data) => setEmployee(data?.employees))
      .catch((err) => setFormErrors(err.message));
  }, []);

  // Other data can load after profile sections
  useEffect(() => {
    if (org?.organization_id) {
      fetchDocumentTypes(org?.organization_id)
        .then((data) => setDocType(data?.documentType?.data))
        .catch((err) => setFormErrors(err.message));
    }
  }, [org?.organization_id]);

  useEffect(() => {
    fetchDocumentTypes(org?.organization_id)
      .then((data) => setDocType(data?.documentType?.data))
      .catch((err) => setFormErrors(err.message));
  }, []);

  useEffect(() => {
    const getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/employemnt-document/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const a = response?.data?.employeeDocument;
      console.log("a is", a);

      const sectionIds =
        a?.section_link?.map(
          (link) => link?.organization_employee_profile_section_id
        ) || [];

      setFormData({
        ...a,
        employee_id: a?.employee_id?.toString() || "",
        employee_document_type_id:
          a?.employee_document_type_id?.toString() || "",
        document_name: a?.document_name || "",
        organization_id: a?.organization_id?.toString() || "",
        organization_entity_id: a?.organization_entity_id?.toString() || "",
        organization_employee_profile_section_id: sectionIds,
        document_url: a?.document_url || "",
      });
      setDocumentUrl(a?.document_url || "");
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

  const handleFileChange = (e) => {
    const selectedFile = e?.target?.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDocumentUrl(URL.createObjectURL(selectedFile)); // Keep this for preview purposes
      // setFormData((prev) => ({ ...prev, document_url: selectedFile })); // Store the file object directly
    }
  };

  const handlePreview = () => {
    // Use file if selected, otherwise use backend URL
    const url = documentUrl || formData?.document_url;
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

  console.log("formdata is ", formData);

  const validateForm = () => {
    const errors = {};

    if (!formData.document_name)
      errors.document_name = "Document Name is required.";

    if (!formData.employee_document_type_id)
      errors.employee_document_type_id = "Document Type is required.";

    if (!formData.employee_id)
      errors.employee_id = "Employee Name is required.";

    if (
      !formData.organization_employee_profile_section_id ||
      formData.organization_employee_profile_section_id?.length === 0
    ) {
      errors.organization_employee_profile_section_id =
        "At least one profile section is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!file && !documentUrl) {
      // allow edit mode to submit existing file
      toast.error("Please choose a file first!");
      return;
    }

    if (!validateForm()) return;
    setbtnLoading(true);

    const submitFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "document_url") {
        if (
          key === "organization_employee_profile_section_id" &&
          Array.isArray(formData[key])
        ) {
          formData[key].forEach((value, index) => {
            submitFormData.append(`${key}[${index}]`, value);
          });
        } else {
          submitFormData.append(key, formData[key]);
        }
      }
    });
    if (file) {
      submitFormData.append("document_url", file);
    }
    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/employemnt-document/${id}`,
          submitFormData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/employemnt-document`,
          submitFormData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit"
          ? "Employee Document updated!"
          : "Employee Document created!"
      );
      setFormErrors({});

      // Use setTimeout to ensure navigation happens after state updates
      setTimeout(() => {
        navigate(-1);
      }, 100);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Session Expired!");
        // Don't use navigate here, use window.location for hard redirect
        window.location.href = "/login";
        return; // Add return to prevent further execution
      }
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

  const handleRemoveFile = () => {
    setFile(null);
    setDocumentUrl("");
    setFormData((prev) => ({ ...prev, document_url: "" }));
  };

  const handleCheckboxChange = (sectionId) => {
    setFormData((prev) => {
      // Initialize the current selections array if it doesn't exist
      const currentSelections =
        prev.organization_employee_profile_section_id || [];
      const isSelected = currentSelections.includes(sectionId);

      // If the checkbox is already selected, remove it. If not, add it
      const newSelections = isSelected
        ? currentSelections.filter((id) => id !== sectionId)
        : [...currentSelections, sectionId];

      return {
        ...prev,
        organization_employee_profile_section_id: newSelections,
      };
    });

    // Clear error when user makes a selection
    setFormErrors((prev) => ({
      ...prev,
      organization_employee_profile_section_id: "",
    }));
  };

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Documents"}
        addMessage={"Documents"}
        homeLink={"/employee/documents"}
        homeText={"Documents"}
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
                  label="Employee Name/ID"
                  name="employee_id"
                  value={formData?.employee_id}
                  onChange={handleChange}
                  error={!!formErrors.employee_id}
                  helperText={formErrors.employee_id}
                  required
                >
                  {employee?.map((option) => {
                    const fullName =
                      `${option?.first_name || ""} ${option?.middle_name || ""} ${option?.last_name || ""} -- ${option?.employee_code || ""}`.trim();
                    return (
                      <MenuItem
                        key={option?.employee_id}
                        value={option?.employee_id}
                      >
                        {fullName ? fullName : option?.employee_id}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Document Type"
                  name="employee_document_type_id"
                  value={formData.employee_document_type_id}
                  onChange={handleChange}
                  error={!!formErrors.employee_document_type_id}
                  helperText={formErrors.employee_document_type_id}
                  required
                >
                  {docType.map((option) => (
                    <MenuItem
                      key={option.employee_document_type_id}
                      value={option.employee_document_type_id}
                    >
                      {option?.document_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Document Name"
                  name="document_name"
                  value={formData.document_name}
                  onChange={handleChange}
                  error={!!formErrors.document_name}
                  helperText={formErrors.document_name}
                  inputProps={{ maxLength: 100 }}
                  required
                />

                {/* <FormControl
                  component="fieldset"
                  fullWidth
                  error={!!formErrors.organization_employee_profile_section_id}
                >
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>
                    Profile Sections *
                  </FormLabel>
                  <FormGroup>
                    {profileSection?.map((option) => (
                      <FormControlLabel
                        key={option.organization_employee_profile_section_id}
                        control={
                          <Checkbox
                            checked={
                              formData.organization_employee_profile_section_id?.includes(
                                option.organization_employee_profile_section_id
                              ) || false
                            }
                            onChange={() =>
                              handleCheckboxChange(
                                option.organization_employee_profile_section_id
                              )
                            }
                            name="organization_employee_profile_section_id"
                          />
                        }
                        label={option?.employee_profile_section_name}
                      />
                    ))}
                  </FormGroup>
                  {formErrors.organization_employee_profile_section_id && (
                    <FormHelperText>
                      {formErrors.organization_employee_profile_section_id}
                    </FormHelperText>
                  )}
                </FormControl> */}


                <FormControl
  component="fieldset"
  fullWidth
  error={!!formErrors.organization_employee_profile_section_id}
>
  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>
    Profile Sections *
  </FormLabel>

  <FormGroup row>
    {profileSection?.map((option) => (
      <FormControlLabel
        key={option.organization_employee_profile_section_id}
        control={
          <Checkbox
            checked={
              formData.organization_employee_profile_section_id?.includes(
                option.organization_employee_profile_section_id
              ) || false
            }
            onChange={() =>
              handleCheckboxChange(
                option.organization_employee_profile_section_id
              )
            }
            name="organization_employee_profile_section_id"
          />
        }
        label={option?.employee_profile_section_name}
      />
    ))}
  </FormGroup>

  {formErrors.organization_employee_profile_section_id && (
    <FormHelperText>
      {formErrors.organization_employee_profile_section_id}
    </FormHelperText>
  )}
</FormControl>

                <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
              </Grid>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
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

                {mode === "edit" && (
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
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default DocumentForm;
