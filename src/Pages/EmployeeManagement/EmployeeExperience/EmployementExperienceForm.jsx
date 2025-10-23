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
import { getIndustry } from "../../../Apis/Organization-apis";
import { fetchGeneralCountries } from "../../../Apis/OrganizationLocation";
import useEmployeeDataStore from "../../../Zustand/Store/useEmployeeDataStore";

function EmployementExperienceForm({ mode, employeeId }) {
  const { id } = useParams();
  const { userData } = useAuthStore();

  const {
    setExperienceData,
    Experience,
    getDropdowndata,
    ExperienceErrors,
    DropDownData,
    addExperience,
    removeExperience,
  } = useEmployeeDataStore();
  const org = userData?.organization;

  const [expanded, setExpanded] = useState("Experience 1");

  const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };

  const [level, setLevel] = useState("");
  const [countrycode, setCountryCode] = useState("");

  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [Industry, setIndustry] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchGeneralCountries()
        .then((data) => {
          setCountryCode(data.countries);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      getIndustry()
        .then((data) => {
          setIndustry(data?.industries);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, []);

  // useEffect(() => {
  //   let getdataById = async () => {
  //     const response = await axios.get(
  //       `${MAIN_URL}/api/organizations/${org.organization_id}/employee-work-experience/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     let a = response.data.experience;
  //     setsection?.mainData?(a);
  //     setLoading(false);
  //   };
  //   if (mode === "edit" && id) {
  //     setLoading(true);
  //     getdataById();
  //   }
  // }, [mode, id]);

  const handleChange = (e, idx) => {
    const { name, value } = e.target;
    setExperienceData(name, value, idx);
     if (name === "compensation_status" && value === "Unpaid") {
    ["compensation_payout_model", "currency_code", "compensation_amount"].forEach(
      (field) =>
        setExperienceData(field, "", idx)
    );
  }
  };
  const handleCheckboxChange = (e, idx) => {
    const { name, checked } = e.target;
    setExperienceData(name, checked, idx);
   
  };

  // const handleSubmit = async () => {
  //   if (!validateForm()) return;
  //   setbtnLoading(true);

  //    let b={
  //           ...section?.mainData?, currency_code:section?.mainData?.currency_code.toString()

  //         }

  //          console.log("datas is ", b)

  //   try {

  //     if (mode === "edit") {
  //       await axios.put(
  //         `${MAIN_URL}/api/organizations/${org.organization_id}/employee-work-experience/${id}`,b,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //     } else {
  //       await axios.post(
  //         `${MAIN_URL}/api/organizations/${org.organization_id}/employee-work-experience`,
  //         section?.mainData?,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //     }

  //     toast.success(
  //       mode === "edit"
  //         ? "Employee Experience  Updated!"
  //         : "Employee Experience  Created!"
  //     );
  //     setExperienceErrors({});
  //   } catch (err) {
  //     console.error(err);
  //     if (err.response?.status === 422) {
  //       const validationErrors = err.response.data.errors || {};
  //       setExperienceErrors(validationErrors);
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

  const handleSubmit = async (e) => {
    // setExperienceData(section?.mainData?);
  };

  return (
    <Box px={4}>
  
        <Box>
          {Experience?.map((item, id) => ({
            name: `Experience ${id + 1}`,
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
                        removeExperience(idx);
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
                          error={!!ExperienceErrors?.[idx]?.experience_type}
                          sx={{ marginTop: 2 }}
                        >
                          <InputLabel id="experience_type-label">
                            Experience Type
                          </InputLabel>

                          <Select
                            labelId="experience_type-label"
                            id="experience_type"
                            name="experience_type"
                            value={section?.mainData?.experience_type || ""}
                            label="Experience Type"
                            onChange={(e) => handleChange(e, idx)}
                            required
                          >
                            {[
                              "Job",
                              "Internship",
                              "Freelance",
                              "Apprenticeship",
                              "Research",
                              "Entrepreneurship",
                            ].map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>

                          {ExperienceErrors?.[idx]?.experience_type && (
                            <FormHelperText>
                              {ExperienceErrors?.[idx]?.experience_type}
                            </FormHelperText>
                          )}
                        </FormControl>

                        <TextField
                          fullWidth
                          label="Company Name"
                          name="organization_name"
                          value={section?.mainData?.organization_name}
                          onChange={(e) => handleChange(e, idx)}
                          required
                          error={!!ExperienceErrors?.[idx]?.organization_name}
                          helperText={
                            ExperienceErrors?.[idx]?.organization_name
                          }
                          inputProps={{ maxLength: 100 }}
                        />

                        <FormControl
                          fullWidth
                          required
                          margin="normal"
                          error={!!ExperienceErrors?.[idx]?.general_industry_id}
                        >
                          <InputLabel id="industry-label">Industry</InputLabel>
                          <Select
                            labelId="industry-label"
                            id="general_industry_id"
                            name="general_industry_id"
                            value={section?.mainData?.general_industry_id || ""}
                            onChange={(e) => handleChange(e, idx)}
                            label="Industry"
                          >
                         
                            {(Industry || []).map((option) => (
                              <MenuItem
                                key={option.general_industry_id}
                                value={option.general_industry_id}
                              >
                                {option.industry_name}
                              </MenuItem>
                            ))}
                          </Select>
                          {ExperienceErrors?.[idx]?.general_industry_id && (
                            <FormHelperText>
                              {ExperienceErrors?.[idx]?.general_industry_id}
                            </FormHelperText>
                          )}
                        </FormControl>

                        <TextField
                          fullWidth
                          required
                          label="Location"
                          name="location"
                          value={section?.mainData?.location}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!ExperienceErrors?.[idx]?.location}
                          helperText={ExperienceErrors?.[idx]?.location}
                          inputProps={{ maxLength: 50 }}
                        />

                        <TextField
                          fullWidth
                          required
                          label="Work Title"
                          name="work_title"
                          value={section?.mainData?.work_title}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!ExperienceErrors?.[idx]?.work_title}
                          helperText={ExperienceErrors?.[idx]?.work_title}
                          inputProps={{ maxLength: 60 }}
                        />

                        {/*                         
                        <FormControl
                          fullWidth
                          required
                          error={!!ExperienceErrors?.[idx]?.experience_type}
                          sx={{ marginTop: 2 }}
                        >
                          <InputLabel id="experience-type-label">
                            Experience Type
                          </InputLabel>

                          <Select
                            labelId="experience-type-label"
                            id="experience_type"
                            name="experience_type"
                            value={section?.mainData?.experience_type || ""}
                            label="Employment Type"
                            onChange={(e) => handleChange(e, idx)}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {["Full-Time", "Part-Time", "Contract"].map(
                              (type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              )
                            )}
                          </Select>

                          {ExperienceErrors?.[idx]?.experience_type && (
                            <FormHelperText>
                              {ExperienceErrors?.[idx]?.experience_type}
                            </FormHelperText>
                          )}
                        </FormControl> */}

                        <FormControl
                          fullWidth
                          required
                          error={!!ExperienceErrors?.[idx]?.work_mode}
                          sx={{ marginTop: 2 }}
                        >
                          <InputLabel id="work_mode-label">
                            Work Mode
                          </InputLabel>

                          <Select
                            labelId="work_mode-label"
                            id="work_mode"
                            name="work_mode"
                            value={section?.mainData?.work_mode || ""}
                            label="Work Mode"
                            onChange={(e) => handleChange(e, idx)}
                          >
                          
                            {[
                              "Full-Time",
                              "Part-Time",
                              "Hourly",
                              "Project-Based",
                              "Ad-hoc",
                              "Flexible",
                            ].map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>

                          {ExperienceErrors?.[idx]?.work_mode && (
                            <FormHelperText>
                              {ExperienceErrors?.[idx]?.work_mode}
                            </FormHelperText>
                          )}
                        </FormControl>

                        <FormControl
                          fullWidth
                          error={!!ExperienceErrors?.[idx]?.compensation_status}
                          sx={{ marginTop: 2 }}
                        >
                          <InputLabel id="compensation_status-label">
                            Compensation Status
                          </InputLabel>

                          <Select
                            labelId="compensation_status-label"
                            id="compensation_status"
                            name="compensation_status"
                            value={section?.mainData?.compensation_status || ""}
                            label="Compensation Status"
                            onChange={(e) => handleChange(e, idx)}
                          >
                          
                            {["Paid", "Unpaid"].map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>

                          {ExperienceErrors?.[idx]?.compensation_status && (
                            <FormHelperText>
                              {ExperienceErrors?.[idx]?.compensation_status}
                            </FormHelperText>
                          )}
                        </FormControl>

                        <FormControl
                          fullWidth
                          
                          error={
                            !!ExperienceErrors?.[idx]?.compensation_payout_model
                          }
                          sx={{ marginTop: 2 }}
                        >
                          <InputLabel id="compensation_payout_model-label">
                            Compensation Payout Model
                          </InputLabel>

                          <Select
                            labelId="compensation_payout_model-label"
                            id="compensation_payout_model"
                            name="compensation_payout_model"
                              disabled={section?.mainData?.compensation_status !== "Paid"}
                            value={
                              section?.mainData?.compensation_payout_model || ""
                            }
                            label="Compensation Payout Model"
                            onChange={(e) => handleChange(e, idx)}
                          >
                            {[
                              "Annual",
                              "Monthly",
                              "Weekly",
                              "Daily",
                              "Hour",
                            ].map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>

                          {ExperienceErrors?.[idx]
                            ?.compensation_payout_model && (
                            <FormHelperText>
                              {
                                ExperienceErrors?.[idx]
                                  ?.compensation_payout_model
                              }
                            </FormHelperText>
                          )}
                          
                        </FormControl>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            gap: "20px",
                          }}
                        >
                          <TextField
                            select
                            fullWidth
                            label="Currency Code"
                            name="currency_code"
                            value={section?.mainData?.currency_code}
                            onChange={(e) => handleChange(e, idx)}
                            disabled={section?.mainData?.compensation_status !== "Paid"}
                            error={!!ExperienceErrors?.[idx]?.currency_code}
                            helperText={ExperienceErrors?.[idx]?.currency_code}
                            
                          >
                        
                            {(countrycode || [])?.map((option) => (
                              <MenuItem
                                key={option.currency_code}
                                value={option?.currency_code}
                              >
                                {option.currency_code}
                              </MenuItem>
                            ))}
                          </TextField>

                          <TextField
                            fullWidth
                            label="Compensation Amount"
                            name="compensation_amount"
                            type="number"
                            value={section?.mainData?.compensation_amount}
                            onChange={(e) => handleChange(e, idx)}
                            disabled={section?.mainData?.compensation_status !== "Paid"}
                            error={
                              !!ExperienceErrors?.[idx]?.compensation_amount
                            }
                            helperText={
                              ExperienceErrors?.[idx]?.compensation_amount
                            }
                            inputProps={{ min: 0 }}
                          />
                        </div>

                        <TextField
                          fullWidth
                          required
                          label="Start Date"
                          type="date"
                          name="start_date"
                          value={section?.mainData?.start_date}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!ExperienceErrors?.[idx]?.start_date}
                          helperText={ExperienceErrors?.[idx]?.start_date}
                          InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                          fullWidth
                          required
                          label="End Date"
                          type="date"
                          name="end_date"
                          value={section?.mainData?.end_date}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!ExperienceErrors?.[idx]?.end_date}
                          helperText={ExperienceErrors?.[idx]?.end_date}
                          InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                          fullWidth
                          label="Reporting Manager Name"
                          name="reporting_manager_name"
                          value={section?.mainData?.reporting_manager_name}
                          onChange={(e) => handleChange(e, idx)}
                          error={
                            !!ExperienceErrors?.[idx]?.reporting_manager_name
                          }
                          helperText={
                            ExperienceErrors?.[idx]?.reporting_manager_name
                          }
                          inputProps={{ maxLength: 100 }}
                        />

                        <TextField
                          fullWidth
                          label="Reporting Manager No."
                          name="reporting_manager_contact"
                          type="text"
                          value={
                            section?.mainData?.reporting_manager_contact
                          }
                          onChange={(e) => {
                            const input = e.target.value;
                            // ✔ Allow only digits, up to 15 characters
                            if (/^\d{0,20}$/.test(input)) {
                              handleChange(e, idx);
                            }
                          }}
                          error={
                            !!ExperienceErrors?.[idx]
                              ?.reporting_manager_contact
                          }
                          helperText={
                            ExperienceErrors?.[idx]
                              ?.reporting_manager_contact
                          }
                          inputProps={{
                            maxLength: 20,
                            inputMode: "numeric", 
                            pattern: "[0-9]*", 
                          }}
                        />

                   

                        <FormControl
                        component="fieldset"
                        error={!!ExperienceErrors?.[idx]?.is_verified}
                        sx={{ mt: 2 }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={section?.mainData?.is_verified || false}
                              // onChange={(e) => handleCheckboxChange(e, idx)}
                              onChange={(e) => {
                                const { checked } = e.target;

                                // Call your existing checkbox handler
                                handleCheckboxChange(e, idx);

                                // If unchecked, clear all related fields
                                if (!checked) {
                                  [
                                    "verified_by",
                                    "verification_notes",
                                    "verification_date",
                                  ].forEach((field) =>
                                    handleChange(
                                      {
                                        target: { name: field, value: "" },
                                      },
                                      idx
                                    )
                                  );
                                }
                              }}
                              name="is_verified"
                              color="primary"
                            />
                          }
                          label="Is Verified"
                        />

                        {ExperienceErrors?.[idx]?.is_verified && (
                          <FormHelperText>
                            {ExperienceErrors?.[idx]?.is_verified}
                          </FormHelperText>
                        )}
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Verified By(Person Name)"
                        name="verified_by"
                        value={section?.mainData?.verified_by}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!ExperienceErrors?.[idx]?.verified_by}
                        helperText={ExperienceErrors?.[idx]?.verified_by}
                        inputProps={{ maxLength: 100 }}
                        disabled={!section?.mainData?.is_verified}
                      />

                      <TextField
                        fullWidth
                        label="Verification Notes"
                        name="verification_notes"
                        value={section?.mainData?.verification_notes}
                        onChange={(e) => handleChange(e, idx)}
                        multiline
                        rows={4}
                        error={!!ExperienceErrors?.[idx]?.verification_notes}
                        helperText={ExperienceErrors?.[idx]?.verification_notes}
                        inputProps={{ maxLength: 256 }}
                        disabled={!section?.mainData?.is_verified}
                      />

                      <TextField
                        fullWidth
                        label="Verfication Date"
                        type="date"
                        name="verification_date"
                        value={section?.mainData?.verification_date}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!ExperienceErrors?.[idx]?.verification_date}
                        helperText={ExperienceErrors?.[idx]?.verification_date}
                        InputLabelProps={{ shrink: true }}
                        disabled={!section?.mainData?.is_verified}
                      />

                     

                        <TextField
                          fullWidth
                          label="Description"
                          name="description"
                          value={section?.mainData?.description}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!ExperienceErrors?.[idx]?.description}
                          helperText={ExperienceErrors?.[idx]?.description}
                          inputProps={{ maxLength: 100 }}
                        />
                      </Grid>
                    </Paper>
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
          <Button
            variant="contained"
            style={{ marginTop: 9 }}
            onClick={() => {
              setExpanded(`Experience ${Experience?.length + 1}`);
              addExperience();
            }}
          >
            Add More
          </Button>
        </Box>
  
    </Box>
  );
}

export default EmployementExperienceForm;
