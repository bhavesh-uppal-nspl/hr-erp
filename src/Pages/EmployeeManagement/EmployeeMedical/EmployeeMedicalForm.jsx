import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  MenuItem,
  TextField,
  Checkbox,
  CircularProgress,
  InputLabel,
  Select,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  FormGroup,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import { fetchEmployeeEducationLevel } from "../../../Apis/EducationApi";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import useEmployeeDataStore from "../../../Zustand/Store/useEmployeeDataStore";

function EmployeeMedicalForm({ mode, employeeId }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const {
    setMedicalData,
    Medical,
    getDropdowndata,
    MedicalErrors,
    DropDownData,
    addMedical,
    removeMedical,
  } = useEmployeeDataStore();

  const [expanded, setExpanded] = useState("Medical 1");

  const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };

  const [level, setLevel] = useState("");

  const BloodOptions = [
    "O+",
    "O-",
    "A+",
    "A-",
    "B-",
    "B+",
    "AB+",
    "AB-",
    "Unknown",
  ];
  const Disability_status = ["None", "Physical", "Mental", "Both", "Other"];

  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [employee, setEmployee] = useState([]);

  let navigate = useNavigate();

  // useEffect(() => {
  //   let getdataById = async () => {
  //     const response = await axios.get(
  //       `${MAIN_URL}/api/organizations/${org.organization_id}/employee-medical/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     let a = response.data.education;
  //     setMedical?.[0]?(a);
  //     setLoading(false);
  //   };
  //   if (mode === "edit" && id) {
  //     setLoading(true);
  //     getdataById();
  //   }
  // }, [mode, id]);

  const handleChange = (e, idx) => {
    const { name, value } = e.target;
    setMedicalData(name, value, idx);
  };
  const handleCheckboxChange = (e, idx) => {
    const { name, checked } = e.target;
    setMedicalData(name, checked, idx);
  };

  //   if (!validateForm()) return;
  //   setbtnLoading(true);

  //   try {
  //     if (mode === "edit") {
  //       await axios.put(
  //         `${MAIN_URL}/api/organizations/${org.organization_id}/employee-medical/${id}`,
  //         Medical?.[0]?,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //     } else {
  //       await axios.post(
  //         `${MAIN_URL}/api/organizations/${org.organization_id}/employee-medical`,
  //         Medical?.[0]?,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //     }

  //     toast.success(
  //       mode === "edit"
  //         ? "Employee Medical Information Updated!"
  //         : "Employee Medical Information Created!"
  //     );
  //     setMedicalErrors[idx]({});
  //   } catch (err) {
  //     console.error(err);
  //     if (err.response?.status === 422) {
  //       const validationErrors = err.response.data.errors || {};
  //       setMedicalErrors[idx](validationErrors);
  //       const errorMessages = Object.values(validationErrors)
  //         .map((arr) => arr[0])
  //         .join(" ");
  //       toast.error(errorMessages || "Validation failed.");
  //     } else {
  //       toast.error("Something went wrong.");
  //     }
  //   } finally {
  //     setbtnLoading(false);
  //   }
  // };

  return (
    <Box px={4}>
      {/* <Header mode={mode}
        updateMessage={"Employement's Type"}
        addMessage={"Employement's Type"}
        homeLink={"/employement/types"}
        homeText={"Employement's Type"}
      /> */}

      <Box>
        {Medical?.map((item, id) => ({
          name: `Medical ${id + 1}`,
          mainData: item,
        }))?.map((section, idx) => (
          <Accordion
            sx={{ mb: 2 }}
            key={section.name}
            expanded={expanded === section.name}
            onChange={handleChangeAccoridan(section.name)}
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
                {idx != 0 && (
                  <DeleteOutlineIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMedical(idx);
                    }}
                    sx={{ color: "error.main", ml: 2 }}
                  />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {expanded === section.name && (
                <Grid item xs={12} md={8}>
                  <Paper elevation={4} sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <FormControl
                        fullWidth
                        required
                        error={!!MedicalErrors?.[idx]?.blood_group}
                        margin="normal"
                      >
                        <InputLabel id="blood-group-label">
                          Blood Group
                        </InputLabel>
                        <Select
                          labelId="blood-group-label"
                          id="blood-group"
                          name="blood_group"
                          value={section?.mainData?.blood_group || ""}
                          onChange={(e) => handleChange(e, idx)}
                          label="Blood Group"
                        >
                          {BloodOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {MedicalErrors?.[idx]?.blood_group && (
                          <FormHelperText>
                            {MedicalErrors?.[idx]?.blood_group}
                          </FormHelperText>
                        )}
                      </FormControl>

                      <FormControl
                        fullWidth
                        required
                        error={!!MedicalErrors?.[idx]?.disability_status}
                        margin="normal"
                      >
                        <InputLabel id="disability-status-label">
                          Disability Status
                        </InputLabel>
                        <Select
                          labelId="disability-status-label"
                          id="disability-status"
                          name="disability_status"
                          value={section?.mainData?.disability_status || ""}
                          onChange={(e) => handleChange(e, idx)}
                          label="Disability Status"
                        >
                          {Disability_status.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {MedicalErrors?.[idx]?.disability_status && (
                          <FormHelperText>
                            {MedicalErrors?.[idx]?.disability_status}
                          </FormHelperText>
                        )}
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Disability Description"
                        name="disability_description"
                        value={section?.mainData?.disability_description}
                        onChange={(e) => handleChange(e, idx)}
                        multiline
                        rows={4}
                        error={!!MedicalErrors?.[idx]?.disability_description}
                        helperText={
                          MedicalErrors?.[idx]?.disability_description
                        }
                        inputProps={{ maxLength: 100 }}
                      />

                      <TextField
                        fullWidth
                        label="Allergies"
                        name="allergies"
                        value={section?.mainData?.allergies}
                        onChange={(e) => handleChange(e, idx)}
                        multiline
                        rows={4}
                        error={!!MedicalErrors?.[idx]?.allergies}
                        helperText={MedicalErrors?.[idx]?.allergies}
                        inputProps={{ maxLength: 100 }}
                      />

                      <TextField
                        fullWidth
                        label="Diseases"
                        name="diseases"
                        value={section?.mainData?.diseases}
                        onChange={(e) => handleChange(e, idx)}
                        multiline
                        rows={4}
                        error={!!MedicalErrors?.[idx]?.diseases}
                        helperText={MedicalErrors?.[idx]?.diseases}
                        inputProps={{ maxLength: 100 }}
                      />

                      <FormControl
                        component="fieldset"
                        error={!!MedicalErrors?.[idx]?.is_fit_for_duty}
                        sx={{ mt: 2 }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                section?.mainData?.is_fit_for_duty || false
                              }
                              onChange={(e) => handleCheckboxChange(e, idx)}
                              name="is_fit_for_duty"
                              color="primary"
                            />
                          }
                          label="Is Fit"
                        />

                        {MedicalErrors?.[idx]?.is_fit_for_duty && (
                          <FormHelperText>
                            {MedicalErrors?.[idx]?.is_fit_for_duty}
                          </FormHelperText>
                        )}
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Last HealthCheck on"
                        type="date"
                        name="last_health_check_date"
                        value={section?.mainData?.last_health_check_date}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!MedicalErrors?.[idx]?.last_health_check_date}
                        helperText={
                          MedicalErrors?.[idx]?.last_health_check_date
                        }
                        InputLabelProps={{ shrink: true }}
                      />

                      <TextField
                        fullWidth
                        label="Medical Notes"
                        name="medical_notes"
                        value={section?.mainData?.medical_notes}
                        multiline
                        rows={4}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!MedicalErrors?.[idx]?.medical_notes}
                        helperText={MedicalErrors?.[idx]?.medical_notes}
                        inputProps={{ maxLength: 200 }}
                      />
                    </Grid>
                  </Paper>
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        ))}

      </Box>
    </Box>
  );
}

export default EmployeeMedicalForm;
