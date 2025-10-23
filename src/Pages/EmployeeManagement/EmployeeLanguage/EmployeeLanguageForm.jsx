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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { fetchEmployeeLanguages } from "../../../Apis/EducationApi";
import useEmployeeDataStore from "../../../Zustand/Store/useEmployeeDataStore";

function EmployeeLanguageForm({ mode, employeeId }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const {
    setLanguageData,
    Language,
    getDropdowndata,
    LanguageError,
    DropDownData,
    addLanguage,
    removeLanguage
  } = useEmployeeDataStore();

  const org = userData?.organization;

  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [Languages, setLanguages] = useState([]);


    const [expanded, setExpanded] = useState("Language 1");
  
    const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
      setExpanded(isExpanded ? panelId : "");
    };
  let navigate = useNavigate();

  // console.log("section?.mainData? is ", section?.mainData?);

  useEffect(() => {
    fetchEmployeeLanguages(org.organization_id)
      .then((data) => {
        console.log("dd", data);

        setLanguages(data.Languages.data);
      })
      .catch((err) => {
        console.log("ee", err);
      });
  }, []);
  // console.log("langiage id is ", LanguageId)
  // useEffect(() => {
  //   let getdataById = async () => {
  //     const response = await axios.get(
  //       `${MAIN_URL}/api/organizations/${org.organization_id}/employee-language/${LanguageId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     console.log("espffffonse", response)
  //     let a = response.data.education;
  //     setsection?.mainData?(a);
  //     setLoading(false);
  //   };
  //   if (LanguageId) {
  //     setLoading(true);
  //     getdataById();
  //   }
  // }, [mode, id]);

  console.log(" Languages is ", Languages);

  const handleChange = (e , idx) => {
    const { name, value } = e.target;

    setLanguageData(name, value, idx);
  };
  const handleCheckboxChange = (e , idx) => {
    const { name, checked } = e.target;
    setLanguageData(name, checked, idx);
  };

  // const handleSubmit = async (e) => {
  //    e.preventDefault();
  //   if (!validateForm()) return;
  //   setbtnLoading(true);

  //   try {
  //     if (mode === "edit") {
  //       await axios.put(
  //         `${MAIN_URL}/api/organizations/${org.organization_id}/employee-language/${id}`,
  //         section?.mainData?,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //     } else {
  //    const response=  await axios.post(
  //         `${MAIN_URL}/api/organizations/${org.organization_id}/employee-language`,
  //         section?.mainData?,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );

  //       console.log("responsessssssssssss", response)
  //       const createLanguage = response?.data?.employeeLanguage;
  //       if (createLanguage?.employee_language_id) {
  //         setLanguageId(createLanguage?.employee_language_id);
  //       }
  //     }

  //     toast.success(
  //       mode === "edit"
  //         ? "Employee Language Detail Updated!"
  //         : "Employee Language Detail Created!"
  //     );
  //     setLanguageError({});
  //   } catch (err) {
  //     console.error(err);
  //     if (err.response?.status === 422) {
  //       const validationErrors = err.response.data.errors || {};
  //       setLanguageError(validationErrors);
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
    // setLanguageData(section?.mainData?);
  };

  return (
    <Box px={4}>
   
        <Box>
          {Language?.map((item, id) => ({
            name: `Language ${id + 1}`,
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
                        removeLanguage(idx);
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
                        <TextField
                          select
                          fullWidth
                          required
                          label="Language Known"
                          name="language_id"
                          value={section?.mainData?.language_id}
                          onChange={e => handleChange(e,idx)}
                          error={!!LanguageError?.[idx]?.language_id}
                          helperText={LanguageError?.[idx]?.language_id}
                        >
                       
                          {Languages?.map((option) => (
                            <MenuItem
                              key={option?.organization_language_id}
                              value={option?.organization_language_id}
                            >
                              {option?.language_name}
                            </MenuItem>
                          ))}
                        </TextField>

                        <Box>
                          <FormGroup row>
                            {[
                              { label: "Can Read", name: "can_read" },
                              { label: "Can Write", name: "can_write" },
                              { label: "Can Speak", name: "can_speak" },
                              {
                                label: "Is Native Language",
                                name: "is_native",
                              },
                            ].map((item) => (
                              <FormControlLabel
                                key={item?.name}
                                control={
                                  <Checkbox
                                    icon={<RadioButtonUncheckedIcon />}
                                    checkedIcon={<CheckCircleOutlineIcon />}
                                    checked={!!section?.mainData?.[item?.name]}
                                    onChange={(e) =>
                                      handleChange({
                                        target: {
                                          name: item?.name,
                                          value: e.target.checked ? 1 : 0,
                                        },
                                      } , idx)
                                    }
                                    name={item?.name}
                                  />
                                }
                                label={item?.label}
                              />
                            ))}
                          </FormGroup>
                        </Box>

                        <TextField
                          fullWidth
                          label="Description"
                          name="description"
                          value={section?.mainData?.description}
                          onChange={e => handleChange(e,idx)}
                          error={!!LanguageError?.[idx]?.description}
                          helperText={LanguageError?.[idx]?.description}
                           inputProps={{ maxLength: 255 }}
                        />
                      </Grid>
                    </Paper>
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          ))}

          <Button style={{marginTop:9}} variant="contained" onClick={() =>{ setExpanded(`Language ${Language?.length+1}`); addLanguage()}}>
            Add More
          </Button>
        </Box>
 
    </Box>
  );
}

export default EmployeeLanguageForm;
