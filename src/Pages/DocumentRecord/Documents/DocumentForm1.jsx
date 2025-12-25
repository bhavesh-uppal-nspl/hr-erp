"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Select,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {
  fetchDocumentTypes,
  fetchEmployeeProfileSection,
} from "../../../Apis/Documents";
import useEmployeeDataStore from "../../../Zustand/Store/useEmployeeDataStore";

function DocumentForm1({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const navigate = useNavigate();

  const {
    setDocumentData,
    Document,
    DocumentErrors,
    addDocument,
    removeDocument,
  } = useEmployeeDataStore();

  const [expanded, setExpanded] = useState("Document 1");
  const [docType, setDocType] = useState([]);
  const [profileSection, setProfileSection] = useState([]);

  // Store files separately - one for each document (for preview purposes)
  const [documentUrls, setDocumentUrls] = useState({});

  const handleChangeAccordion = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };

  // Load profile sections
  useEffect(() => {
    if (org?.organization_id) {
      fetchEmployeeProfileSection(org.organization_id)
        .then((data) => {
          console.log("Profile Sections loaded:", data?.profileSections);
          setProfileSection(data?.profileSections || []);
        })
        .catch((err) => {
          console.log("Error loading profile sections:", err);
        });
    }
  }, [org?.organization_id]);

  // Load document types
  useEffect(() => {
    if (org?.organization_id) {
      fetchDocumentTypes(org.organization_id)
        .then((data) => setDocType(data?.documentType?.data || []))
        .catch((err) => {
          console.log("Error loading document types:", err);
        });
    }
  }, [org?.organization_id]);

  const handleChange = (e, idx) => {
    const { name, value } = e.target;
    setDocumentData(name, value?.value || value, idx);
  };

  const handleFileChange = (e, idx) => {
    const selectedFile = e?.target?.files[0];
    if (selectedFile) {
      // Create preview URL for local display

      const sizeInKB = (selectedFile.size / 1024).toFixed(2);
      if (sizeInKB > 10240) {
        setDocumentData("document_url", null, idx);
        setDocumentData("document_size_kb", sizeInKB, idx);
        return;
      }

      const url = URL.createObjectURL(selectedFile);
      setDocumentUrls((prev) => ({ ...prev, [idx]: url }));
      // Store the actual File object in Zustand
      setDocumentData("document_url", selectedFile, idx);
      setDocumentData("document_size_kb", sizeInKB, idx);
    }
  };

  // const handlePreview = (idx) => {
  //   const file = Document[idx]?.document_url;
  //   const url = documentUrls[idx];

  //   if (!file || !url) return;

  //   const name = file?.name || "document";
  //   const fileExtension = name.split(".").pop().toLowerCase();

  //   if (
  //     ["pdf", "jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
  //       fileExtension
  //     )
  //   ) {
  //     window.open(url, "_blank");
  //   } else {
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = name;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };

  const handlePreview = (idx) => {
    const file = Document[idx]?.document_url;
    const previewUrl = documentUrls[idx];

    // Case 1: Freshly uploaded file (File object, with a preview URL we generated)
    if (file instanceof File && previewUrl) {
      const name = file?.name || "document";
      const fileExtension = name.split(".").pop().toLowerCase();

      if (
        ["pdf", "jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
          fileExtension
        )
      ) {
        window.open(previewUrl, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = previewUrl;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      return;
    }

    // Case 2: Already stored file (string URL from DB)
    if (typeof file === "string" && file) {
      window.open(file, "_blank");
      return;
    }
  };

  const handleRemoveFile = (idx) => {
    // Clean up object URL to prevent memory leaks
    if (documentUrls[idx]) {
      URL.revokeObjectURL(documentUrls[idx]);
    }

    setDocumentUrls((prev) => {
      const newUrls = { ...prev };
      delete newUrls[idx];
      return newUrls;
    });

    // Clear the file in Zustand
    setDocumentData("document_url", "", idx);
  };

  const handleCheckboxChange = (sectionId, idx) => {
    const currentSelections =
      Document[idx]?.organization_employee_profile_section_id || [];
    const isSelected = currentSelections.includes(sectionId);

    const newSelections = isSelected
      ? currentSelections.filter((id) => id !== sectionId)
      : [...currentSelections, sectionId];

    setDocumentData(
      "organization_employee_profile_section_id",
      newSelections,
      idx
    );
  };

  const handleRemoveDocument = (idx) => {
    // Clean up file URL before removing document
    if (documentUrls[idx]) {
      URL.revokeObjectURL(documentUrls[idx]);
    }

    // Remove from URL state
    setDocumentUrls((prev) => {
      const newUrls = { ...prev };
      delete newUrls[idx];
      return newUrls;
    });

    // Remove from Zustand
    removeDocument(idx);
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(documentUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  return (
    <Box px={4}>
      <Box>
        {Document?.map((item, idx) => ({
          name: `Document ${idx + 1}`,
          mainData: item,
        }))?.map((section, idx) => (
          <Accordion
            sx={{ mb: 2 }}
            key={section.name}
            expanded={expanded === section.name}
            onChange={handleChangeAccordion(section.name)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontSize: "15px", fontWeight: "bold" }}
                >
                  {section.name}
                </Typography>
                {idx !== 0 && (
                  <DeleteOutlineIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveDocument(idx);
                    }}
                    sx={{
                      color: "error.main",
                      ml: 2,
                      cursor: "pointer",
                      "&:hover": { opacity: 0.7 },
                    }}
                  />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Box display="flex" gap={2} width="100%">
                  <Box flex={1}>
                    <FormControl
                      fullWidth
                      error={!!DocumentErrors?.[idx]?.employee_document_type_id}
                    >
                      <InputLabel id={`employee-document-type-label-${idx}`}>
                        Employee Document Type *
                      </InputLabel>
                      <Select
                        disabled={mode === "view" || docType?.length === 0}
                        labelId={`employee-document-type-label-${idx}`}
                        id={`employee_document_type_id-${idx}`}
                        name="employee_document_type_id"
                        value={
                          section?.mainData?.employee_document_type_id || ""
                        }
                        label="Employee Document Type *"
                        onChange={(e) => handleChange(e, idx)}
                        required
                      >
                        {docType?.map((option) => (
                          <MenuItem
                            key={option?.employee_document_type_id}
                            value={option?.employee_document_type_id}
                          >
                            {option?.document_type_name}
                          </MenuItem>
                        ))}
                      </Select>
                      {DocumentErrors?.[idx]?.employee_document_type_id && (
                        <FormHelperText>
                          {DocumentErrors?.[idx]?.employee_document_type_id}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <Box flex={1}>
                    <TextField
                      disabled={mode === "view"}
                      fullWidth
                      label="Document Name"
                      name="document_name"
                      value={section?.mainData?.document_name || ""}
                      onChange={(e) => handleChange(e, idx)}
                      error={!!DocumentErrors?.[idx]?.document_name}
                      helperText={DocumentErrors?.[idx]?.document_name}
                      inputProps={{ maxLength: 100 }}
                      required
                    />
                  </Box>
                </Box>

                {/* Profile Sections - 4 in a row */}
                <Grid item xs={12}>
                  <FormControl
                    component="fieldset"
                    fullWidth
                    error={
                      !!DocumentErrors?.[idx]
                        ?.organization_employee_profile_section_id
                    }
                  >
                    <FormLabel
                      component="legend"
                      sx={{ mb: 1, fontWeight: 500 }}
                    >
                      Profile Sections *
                    </FormLabel>
                    <Grid container spacing={1}>
                      {profileSection?.map((option) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          key={option.organization_employee_profile_section_id}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled={mode === "view"}
                                checked={
                                  section?.mainData?.organization_employee_profile_section_id?.includes(
                                    option.organization_employee_profile_section_id
                                  ) || false
                                }
                                onChange={() =>
                                  handleCheckboxChange(
                                    option.organization_employee_profile_section_id,
                                    idx
                                  )
                                }
                                name="organization_employee_profile_section_id"
                              />
                            }
                            label={option?.employee_profile_section_name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    {DocumentErrors?.[idx]
                      ?.organization_employee_profile_section_id && (
                      <FormHelperText>
                        {
                          DocumentErrors?.[idx]
                            ?.organization_employee_profile_section_id
                        }
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* File Picker - Single Line */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      disabled={mode === "view"}
                      variant="contained"
                      component="label"
                      sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        py: 1,
                        borderRadius: 2,
                        flexGrow: 1,
                        backgroundColor: "#9e9e9e", // grey
                        color: "#fff", // white text
                        "&:hover": {
                          backgroundColor: "#7d7d7d", // darker grey on hover
                        },
                      }}
                    >
                      {section?.mainData?.document_url
                        ? "Change File"
                        : "Choose File"}
                      <input
                        type="file"
                        hidden
                        onChange={(e) => handleFileChange(e, idx)}
                      />
                    </Button>

                    {section?.mainData?.document_url && (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handlePreview(idx)}
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

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveFile(idx)}
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
                      </>
                    )}
                  </Box>

                  {section?.mainData?.document_size_kb && (
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          section?.mainData?.document_size_kb > 10240
                            ? "error.main"
                            : "#2e7d32",
                        fontWeight: 500,
                        mt: 0.5,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Selected:{" "}
                      {section?.mainData?.document_url?.name || "File"}{" "}
                      {section?.mainData?.document_size_kb
                        ? `- ${section?.mainData?.document_size_kb} KB`
                        : ""}
                      {section?.mainData?.document_size_kb > 10240 &&
                        " (File too large! Max 10 MB)"}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}

        <Button
          disabled={mode === "view"}
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => {
            const newIndex = Document?.length;
            setExpanded(`Document ${newIndex + 1}`);
            addDocument();
          }}
        >
          Add More
        </Button>
      </Box>
    </Box>
  );
}

export default DocumentForm1;
