

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
  Autocomplete,
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
  const [internList, setInternList] = useState([]);
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

  useEffect(() => {
    if (!org?.organization_id) return;
    
    fetchInterns(org.organization_id)
      .then((data) => {
        setInternList(data?.intership?.data || []);
        console.log("Interns loaded:", data?.intership?.data);
      })
      .catch((err) => {
        console.error("Error fetching interns:", err);
        setFormErrors({ general: err.message });
      });
  }, [org?.organization_id]);


  useEffect(() => {
    if (!org?.organization_id) return;

    fetchOrganizationEmployee(org.organization_id)
      .then((data) => {
        let filteredEmployees = data?.filter(
          (item) =>
            item?.employment_status !== "Exited"
        );

        // Include current employee in edit mode even if exited
        if (mode === "edit" && formData?.issued_by_employee_id) {
          const currentEmp = data?.employees?.find(
            (e) => String(e.employee_id) === String(formData.issued_by_employee_id)
          );

          if (
            currentEmp &&
            !filteredEmployees.find(
              (e) => String(e.employee_id) === String(currentEmp.employee_id)
            )
          ) {
            filteredEmployees = [currentEmp, ...filteredEmployees];
          }
        }

        setEmployee(filteredEmployees || []);
        console.log("Employees loaded:", filteredEmployees);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        setFormErrors({ general: err.message });
      });
  }, [org?.organization_id, formData.issued_by_employee_id, mode]);


  useEffect(() => {
    if ((mode !== "edit" && mode !=="view" )|| !id || !org?.organization_id) return;

    const getData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org.organization_id}/intern-certificate/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response?.data?.intership;
        console.log("Loaded certificate data:", data);

        setFormData({
          intern_id: String(data?.intern_id || ""),
          certificate_type: data?.certificate_type || "",
          certificate_title: data?.certificate_title || "",
          certificate_number: data?.certificate_number || "",
          issue_date: data?.issue_date || "",
          certificate_file_url: data?.certificate_file_url || "",
          issued_by_employee_id: String(data?.issued_by_employee_id || ""),
          remarks: data?.remarks || "",
        });

        setCertificateUrl(data?.certificate_file_url || "");
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Failed to load certificate data.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [mode, id, org?.organization_id]);

  // ============================
  // Handlers
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("File selected:", selectedFile.name);
      setFile(selectedFile);
      setCertificateUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handlePreview = () => {
    const url = certificateUrl || formData?.certificate_file_url;
    if (url) {
      console.log("Opening preview:", url);
      window.open(url, "_blank");
    }
  };

  const handleRemoveFile = () => {
    console.log("File removed");
    setFile(null);
    setCertificateUrl("");
    setFormData((prev) => ({ ...prev, certificate_file_url: "" }));
  };

  // ============================
  // Validation
  // ============================
  const validateForm = () => {
    const errors = {};

    if (!formData.intern_id) errors.intern_id = "Intern is required.";
    if (!formData.certificate_title)
      errors.certificate_title = "Certificate Title is required.";
    if (!formData.certificate_type)
      errors.certificate_type = "Certificate Type is required.";
    if (!formData.issued_by_employee_id)
      errors.issued_by_employee_id = "Issued By is required.";
    if (!formData.issue_date)
      errors.issue_date = "Issue Date is required.";

    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
    }
    
    return Object.keys(errors).length === 0;
  };

  // ============================
  // Submit Handler
  // ============================
  const handleSubmit = async () => {
    // In edit mode, file is optional if one already exists
    if (mode !== "edit" && !file) {
      toast.error("Please choose a file.");
      return;
    }
    
    if (!validateForm()) return;

    setbtnLoading(true);
    const submitFormData = new FormData();

    // Append all form fields except file
    Object.keys(formData).forEach((key) => {
      if (key !== "certificate_file_url" && formData[key]) {
        submitFormData.append(key, formData[key]);
        console.log(`Appending ${key}:`, formData[key]);
      }
    });

    // Append file if selected
    if (file) {
      submitFormData.append("certificate_file_url", file);
      console.log("Appending file:", file.name);
    }

    // Log FormData contents
    console.log("=== FormData Contents ===");
    for (let pair of submitFormData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    try {
      const url = mode === "edit"
        ? `${MAIN_URL}/api/organizations/${org.organization_id}/intern-certificate/${id}`
        : `${MAIN_URL}/api/organizations/${org.organization_id}/intern-certificate`;

      console.log("Submitting to:", url);
      console.log("Method:", mode === "edit" ? "PUT" : "POST");

      let response;
      
      if (mode === "edit") {
        // Use POST with _method override for Laravel
        submitFormData.append("_method", "PUT");
        response = await axios.post(url, submitFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.post(url, submitFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log("Response:", response.data);

      toast.success(
        mode === "edit"
          ? "Intern Certificate updated successfully!"
          : "Intern Certificate created successfully!"
      );

      setTimeout(() => navigate(-1), 500);
    } catch (err) {
      console.error("Error submitting form:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.status === 401) {
        toast.error("Session expired! Please login again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        return;
      }

      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        setFormErrors(validationErrors);

        const errorMessages = Object.values(validationErrors)
          .flat()
          .join(", ");

        toast.error(errorMessages || "Validation failed!");
      } else {
        toast.error(
          err.response?.data?.error || 
          err.response?.data?.message || 
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setbtnLoading(false);
    }
  };

  // ============================
  // JSX RETURN
  // ============================
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
             
                
                  <Autocomplete
                    fullWidth
                    options={internList}
                    getOptionLabel={(option) =>
                      `${option.first_name || ""} ${option.middle_name || ""} ${
                        option.last_name || ""
                      } -- ${option.intern_code || ""}`.trim()
                    }
                    value={
                      internList.find(
                        (i) => String(i.intern_id) === String(formData.intern_id)
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      handleChange({
                        target: {
                          name: "intern_id",
                          value: newValue?.intern_id ? String(newValue.intern_id) : "",
                        },
                      });
                    }}
                    isOptionEqualToValue={(option, value) =>
                      String(option.intern_id) === String(value?.intern_id)
                    }
                    disabled={internList.length === 0 || mode === "view"}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Intern Name / Code"
                        name="intern_id"
                        error={!!formErrors.intern_id}
                        helperText={formErrors.intern_id || (internList.length === 0 ? "No interns available" : "")}
                        required
                      />
                    )}
                  />
               

                {/* CERTIFICATE TITLE */}
               
                  <TextField
                    fullWidth
                    label="Certificate Title"
                    name="certificate_title"
                    value={formData.certificate_title}
                    onChange={handleChange}
                    error={!!formErrors.certificate_title}
                    helperText={formErrors.certificate_title}
                    inputProps={{ maxLength: 100 }}
                    disabled={mode === "view"}
                    required
                  />
              

                {/* CERTIFICATE TYPE */}
                
                  <TextField
                    select
                    fullWidth
                    label="Certificate Type"
                    name="certificate_type"
                    value={formData.certificate_type}
                    onChange={handleChange}
                    error={!!formErrors.certificate_type}
                    helperText={formErrors.certificate_type}
                    disabled={mode === "view"}
                    required
                  >
                    {CertiType.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
              

                {/* CERTIFICATE NUMBER */}
               
                  <TextField
                    fullWidth
                    label="Certificate Number"
                    name="certificate_number"
                    value={formData.certificate_number}
                    onChange={handleChange}
                    error={!!formErrors.certificate_number}
                    helperText={formErrors.certificate_number}
                    disabled={mode === "view"}
                    inputProps={{ maxLength: 50 }}
                  />
             

                {/* ISSUE DATE */}
               
                  <TextField
                    fullWidth
                    type="date"
                    label="Issue Date"
                    name="issue_date"
                    value={formData.issue_date}
                    onChange={handleChange}
                    error={!!formErrors.issue_date}
                    disabled={mode === "view"}
                    helperText={formErrors.issue_date}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
              

                {/* ISSUED BY - EMPLOYEE AUTOCOMPLETE */}
               
                  <Autocomplete
                    fullWidth
                    options={employee}
                    getOptionLabel={(option) =>
                      `${option?.name|| ""
                      } (${option.employee_code || ""})`.trim()
                    }
                    value={
                      employee.find(
                        (emp) =>
                          String(emp.employee_id) === String(formData.issued_by_employee_id)
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      handleChange({
                        target: {
                          name: "issued_by_employee_id",
                          value: newValue?.employee_id ? String(newValue.employee_id) : "",
                        },
                      });
                    }}
                    isOptionEqualToValue={(option, value) =>
                      String(option.employee_id) === String(value?.employee_id)
                    }
                    disabled={employee.length === 0  || mode === "view"}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Issued By"
                        name="issued_by_employee_id"
                        error={!!formErrors.issued_by_employee_id}
                        helperText={formErrors.issued_by_employee_id || (employee.length === 0 ? "No employees available" : "")}
                        required
                      />
                    )}
                  />
             

                {/* REMARKS */}
                
                  <TextField
                    fullWidth
                    label="Remarks"
                    name="remarks"
                    disabled={mode === "view"}
                    value={formData.remarks}
                    onChange={handleChange}
                    error={!!formErrors.remarks}
                    helperText={formErrors.remarks}
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 255 }}
                  />
            

                {/* FILE UPLOAD SECTION */}
               
                  <Typography variant="h6" sx={{ mt: 1, mb: 1, fontWeight: 600 }}>
                    {mode === "edit" ? "Update Certificate File" : "Upload Certificate File"}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box display="flex" alignItems="center" gap={1}>
                    <Button disabled={mode === "view"}
                    variant="contained" component="label">
                      {file || certificateUrl ? "Change File" : "Choose File"}
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                    </Button>

                    {(file || certificateUrl) && (
                      <IconButton 
                        onClick={handlePreview}
                        sx={{ 
                          bgcolor: "#e3f2fd", 
                          color: "#1976d2",
                          "&:hover": { bgcolor: "#bbdefb" }
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    )}

                    {file && (
                      <IconButton 
                        color="error" 
                        onClick={handleRemoveFile}
                        sx={{ 
                          bgcolor: "#f5f5f5",
                          "&:hover": { bgcolor: "#ffcdd2" }
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Box>

                  {file && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: "#2e7d32",
                        fontWeight: 500,
                      }}
                    >
                      Selected: {file.name}
                    </Typography>
                  )}
                  
                  {!file && certificateUrl && mode === "edit" && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: "#1976d2",
                        fontWeight: 500,
                      }}
                    >
                      Current file exists. Upload new file to replace.
                    </Typography>
                  )}
                
              </Grid>

              {/* SUBMIT BUTTONS */}
              <Box display="flex" gap={2} mt={3}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={btnLoading}
                >
                  {btnLoading ? (
                    <CircularProgress size={22} sx={{ color: "white" }} />
                  ) : (
                    "Submit"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={btnLoading}
                >
                  Cancel
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default InternCertificateForm;