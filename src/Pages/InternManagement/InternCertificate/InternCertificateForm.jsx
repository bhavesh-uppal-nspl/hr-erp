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
import { fetchInterns } from "../../../Apis/InternManagement";

function InternCertificateForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const navigate = useNavigate();

  const [employee, setEmployee] = useState([]);
  const [Intern, setIntern] = useState([]);
  const [file, setFile] = useState(null);
  const [certificateUrl, setCertificateUrl] = useState("");

  const [formData, setFormData] = useState({
    intern_id: "",
    certificate_type: "",
    certificate_title: "",
    certificate_number: "",
    issue_date: "",
    certificate_file_url: "",
    issued_by_employee_id: "",
    remarks: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);

  const CertiType = ["Completion", "Recommendation", "Appreciation", "Custom"];

  // Fetch interns
  useEffect(() => {
    fetchInterns(org?.organization_id)
      .then((data) => setIntern(data?.intership?.data || []))
      .catch((err) => setFormErrors({ general: err.message }));
  }, [org?.organization_id]);

  // Fetch employees
  useEffect(() => {
    fetchOrganizationEmployee(org?.organization_id)
      .then((data) => setEmployee(data?.employees || []))
      .catch((err) => setFormErrors({ general: err.message }));
  }, [org?.organization_id]);

  useEffect(() => {
    {
      fetchInterns(org?.organization_id)
        .then((data) => {
          setIntern(data?.intership?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);



    useEffect(() => {
      const getdataById = async () => {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-certificate/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const a = response?.data?.intership;
        console.log("a is", a);
  
        setFormData({
          ...a,
          intern_id: a?.intern_id?.toString() || "",
          certificate_type:
            a?.certificate_type?.toString() || "",
          certificate_title: a?.certificate_title || "",
          organization_id: a?.organization_id?.toString() || "",
          organization_entity_id: a?.organization_entity_id?.toString() || "",
          issue_date: a?.issue_date?.toString() || "",
          issued_by_employee_id: a?.issued_by_employee_id?.toString() || "",
          certificate_file_url: a?.certificate_file_url || "",
          certificate_number: a?.certificate_number || "",
        });
        setCertificateUrl(a?.certificate_file_url || "");
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
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCertificateUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handlePreview = () => {
    const url = certificateUrl || formData?.certificate_file_url;
    if (!url) return;
    window.open(url, "_blank");
  };

  const handleRemoveFile = () => {
    setFile(null);
    setCertificateUrl("");
    setFormData((prev) => ({ ...prev, certificate_file_url: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.certificate_title)
      errors.certificate_title = "Certificate Title is required.";
    if (!formData.certificate_type)
      errors.certificate_type = "Certificate Type is required.";
    if (!formData.issued_by_employee_id)
      errors.issued_by_employee_id = "Issued By is required.";
    if (!formData.issue_date) errors.issue_date = "Issue Date is required.";
    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!file && !certificateUrl) {
      toast.error("Please choose a file first!");
      return;
    }
    if (!validateForm()) return;

    setbtnLoading(true);
    const submitFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "certificate_file_url")
        submitFormData.append(key, formData[key]);
    });
    if (file) submitFormData.append("certificate_file_url", file);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-certificate/${id}`,
          submitFormData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-certificate`,
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
          ? "Intern Certificate updated!"
          : "Intern Certificate created!"
      );
      setFormErrors({});
      setTimeout(() => navigate(-1), 100);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
        return;
      }
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        setFormErrors(validationErrors);
        toast.error(
          Object.values(validationErrors)
            .map((arr) => arr[0])
            .join(" ") || "Validation failed."
        );
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
        updateMessage="Certificates"
        addMessage="Certificates"
        homeLink="/intern/certificates"
        homeText="Certificates"
      />
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper elevation={4} sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <TextField
                  select
                  fullWidth
                  label="Intern Name/ID"
                  name="intern_id"
                  value={formData?.intern_id}
                  onChange={handleChange}
                  error={!!formErrors.intern_id}
                  helperText={formErrors.intern_id}
                  required
                >
                  {Intern?.map((option) => {
                    const fullName =
                      `${option?.first_name || ""} ${option?.middle_name || ""} ${option?.last_name || ""} -- ${option?.intern_code || ""}`.trim();
                    return (
                      <MenuItem
                        key={option?.intern_id}
                        value={option?.intern_id}
                      >
                        {fullName}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  fullWidth
                  label="Certificate Title"
                  name="certificate_title"
                  value={formData.certificate_title}
                  onChange={handleChange}
                  error={!!formErrors.certificate_title}
                  helperText={formErrors.certificate_title}
                  inputProps={{ maxLength: 100 }}
                  required
                />

                <TextField
                  select
                  fullWidth
                  label="Certificate Type"
                  name="certificate_type"
                  value={formData.certificate_type}
                  onChange={handleChange}
                  error={!!formErrors.certificate_type}
                  helperText={formErrors.certificate_type}
                  required
                >
                  {CertiType.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Certificate Number"
                  name="certificate_number"
                  value={formData.certificate_number}
                  onChange={handleChange}
                  error={!!formErrors.certificate_number}
                  helperText={formErrors.certificate_number}
                />

                <TextField
                  fullWidth
                  type="date"
                  label="Issued Date"
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  error={!!formErrors.issue_date}
                  helperText={formErrors.issue_date}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  error={!!formErrors.remarks}
                  helperText={formErrors.remarks}
                  multiline
                  rows={2}
                />

                <TextField
                  select
                  fullWidth
                  label="Issued By"
                  name="issued_by_employee_id"
                  value={formData.issued_by_employee_id}
                  onChange={handleChange}
                  error={!!formErrors.issued_by_employee_id}
                  helperText={formErrors.issued_by_employee_id}
                  required
                >
                  {employee.map((option) => {
                    const fullName =
                      `${option?.first_name || ""} ${option?.middle_name || ""} ${option?.last_name || ""} -- ${option?.employee_code || ""}`.trim();
                    return (
                      <MenuItem
                        key={option?.employee_id}
                        value={option?.employee_id}
                      >
                        {fullName || option?.employee_id}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
                  {mode === "edit" ? "Update Certificate" : "Upload Certificate"}
                </Typography>
                <Divider sx={{ mb: 1 }} />

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ flexGrow: 1, textTransform: "none" }}
                  >
                    {file || certificateUrl ? "Change File" : "Choose File"}
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>

                  {(file || certificateUrl) && (
                    <IconButton
                      size="small"
                      onClick={handlePreview}
                      sx={{
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                        "&:hover": { bgcolor: "#bbdefb" },
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
                        bgcolor: "#f5f5f5",
                        "&:hover": { bgcolor: "#e57373", color: "#fff" },
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
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Selected: {file.name}
                  </Typography>
                )}
              </Grid>

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading || btnLoading}
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
                    color="secondary"
                    onClick={() => navigate(-1)}
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

export default InternCertificateForm;
