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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import {
  fetchEmployeeEducationDegree,
  fetchEmployeeEducationLevel,
  fetchEmployeeEducationStream,
} from "../../../Apis/EducationApi";
import useEmployeeDataStore from "../../../Zustand/Store/useEmployeeDataStore";

function EmployeeEducationForm({ mode, employeeId }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [level, setLevel] = useState("");

  const {
    setEducationData,
    Education,
    EducationErrors,
    getDropdowndata,
    DropDownData,
    addEducation,
    removeEducation,
  } = useEmployeeDataStore();

  console.log("Education is ; ", Education);

  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [educationLevel, setEducationLevel] = useState([]);
  const [educationstream, setEducationStream] = useState([]);
  const [educationDegree, setEducationDegree] = useState([]);
  const [employee, setEmployee] = useState([]);
  console.log("education level ", educationLevel);

  const [expanded, setExpanded] = useState("Education 1");

  const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchEmployeeEducationLevel(org.organization_id)
        .then((data) => {
          setEducationLevel(data?.EducationLevel.data);
        })
        .catch((err) => {
          console.log("err is : ", err);
        });
    }
  }, []);

  //   hwo i will get the education level id  here     because now education is an  array
  // useEffect(() => {
  //   if (!Education?.organization_education_level_id) {
  //     setEducationDegree([]);
  //     return;
  //   }

  //   fetchEmployeeEducationDegree(
  //     org.organization_id,
  //     Education[0]?.organization_education_level_id
  //   )
  //     .then((data) => {
  //       setEducationDegree(data?.EducationDegree?.data || []);
  //     })
  //     .catch((err) => {
  //       console.log("eror si : ", err);
  //     });
  // }, [Education[0]?.organization_education_level_id]);

  useEffect(() => {
    {
      fetchEmployeeEducationStream(org.organization_id)
        .then((data) => {
          setEducationStream(data?.EducationStream);
        })
        .catch((err) => {
          console.log("err is : ", err);
        });
    }
  }, []);

  // useEffect(() => {
  //   let getdataById = async () => {
  //     const response = await axios.get(
  //       `${MAIN_URL}/api/organizations/${org.organization_id}/employee-education/${EducationId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     console.log("hgyhhhghg", response)
  //     let a = response.data.employeeEducation;
  //     console.log("aa is ", a)
  //     setsection?.mainData?(a);
  //     setLoading(false);
  //   };
  //   if (EducationId) {
  //     setLoading(true);
  //     getdataById();
  //   }
  // }, [EducationId]);

  const handleChange = async (e, idx) => {
    const { name, value } = e.target;
    setEducationData(name, value, idx);

    if (name === "organization_education_level_id") {
      const degreeRes = await fetchEmployeeEducationDegree(
        org.organization_id,
        value
      );
      setEducationDegree(degreeRes?.EducationDegree?.data || []);
    }
  };
  const handleCheckboxChange = (e, idx) => {
    const { name, checked } = e.target;

    setEducationData(name, checked, idx);
  };

  // const handleSubmit = async () => {
  //   if (!validateForm()) return;
  //   setbtnLoading(true);

  //   try {
  //     if (mode === "edit") {
  //       await axios.put(
  //         `${MAIN_URL}/api/organizations/${org.organization_id}/employee-education/${id}`,
  //         section?.mainData?,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //     } else {
  //     const response=  await axios.post(
  //         `${MAIN_URL}/api/organizations/${org.organization_id}/employee-education`,
  //         section?.mainData?,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );

  //       console.log("response ", response)

  //         const EducationData = response?.data?.employeeEduaction;
  //         console.log("education id", EducationData)
  //       if (EducationData?.employee_education_id) {
  //         setEducationId(EducationData?.employee_education_id);
  //       }
  //     }

  //     toast.success(
  //       mode === "edit"
  //         ? "Employee Education Detail Updated!"
  //         : "Employee Education Detail Created!"
  //     );
  //     setEducationErrors({});
  //   } catch (err) {
  //     console.error(err);
  //     if (err.response?.status === 422) {
  //       const validationErrors = err.response.data.errors || {};
  //       setEducationErrors(validationErrors);
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

  console.log("education degree ", educationDegree);
  const handleSubmit = async (e) => {
    // setEducationData(section?.mainData?);
  };

  return (
    <Box px={4}>
      <Box>
        {Education?.map((item, id) => ({
          name: `Education ${id + 1}`,
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
                      removeEducation(idx);
                    }}
                    sx={{ color: "error.main", ml: 2 }}
                  />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {expanded === section.name && (
                <Grid sx={{ pt: 0 }} item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <FormControl
                      fullWidth
                      error={
                        !!EducationErrors?.[idx]
                          ?.organization_education_level_id
                      }
                      sx={{ marginTop: 2 }}
                    >
                      <InputLabel id="education-level-label">
                        Education Level
                      </InputLabel>

                      <Select
                        labelId="education-level-label"
                        id="organization_education_level_id"
                        name="organization_education_level_id"
                        value={
                          section?.mainData?.organization_education_level_id ||
                          ""
                        }
                        required
                        label="Education Level"
                        onChange={(e) => handleChange(e, idx)}
                      >
                        {educationLevel?.map((option) => (
                          <MenuItem
                            key={option?.organization_education_level_id}
                            value={option?.organization_education_level_id}
                          >
                            {option?.education_level_name}
                          </MenuItem>
                        ))}
                      </Select>

                      {EducationErrors?.[idx]
                        ?.organization_education_level_id && (
                        <FormHelperText>
                          {
                            EducationErrors?.[idx]
                              ?.organization_education_level_id
                          }
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl
                      fullWidth
                      error={
                        !!EducationErrors?.[idx]
                          ?.organization_education_degree_id
                      }
                      sx={{ marginTop: 2 }}
                    >
                      <InputLabel id="education-degree-label">
                        Education Degree
                      </InputLabel>

                      <Select
                        labelId="education-degree-label"
                        id="organization_education_degree_id"
                        name="organization_education_degree_id"
                        value={
                          section?.mainData?.organization_education_degree_id ||
                          ""
                        }
                        label="Education degree"
                        onChange={(e) => handleChange(e, idx)}
                      >
                        {(educationDegree?.length > 0
                          ? educationDegree
                          : section?.mainData?.degree?.length > 0
                            ? section?.mainData?.degree
                            : []
                        )?.map((option) => (
                          <MenuItem
                            key={option?.organization_education_degree_id}
                            value={option?.organization_education_degree_id}
                          >
                            {option?.education_degree_name}
                          </MenuItem>
                        ))}
                      </Select>

                      {EducationErrors?.[idx]
                        ?.organization_education_degree_id && (
                        <FormHelperText>
                          {
                            EducationErrors?.[idx]
                              ?.organization_education_degree_id
                          }
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl
                      fullWidth
                      error={
                        !!EducationErrors?.[idx]
                          ?.organization_education_stream_id
                      }
                      sx={{ marginTop: 2 }}
                    >
                      <InputLabel id="education-stream-label">
                        Education stream
                      </InputLabel>

                      <Select
                        labelId="education-stream-label"
                        id="organization_education_stream_id"
                        name="organization_education_stream_id"
                        value={
                          section?.mainData?.organization_education_stream_id ||
                          ""
                        }
                        label="Education Stream"
                        onChange={(e) => handleChange(e, idx)}
                      >
                        {educationstream?.map((option) => (
                          <MenuItem
                            key={option?.organization_education_stream_id}
                            value={option?.organization_education_stream_id}
                          >
                            {option?.education_stream_name}
                          </MenuItem>
                        ))}
                      </Select>

                      {EducationErrors?.[idx]
                        ?.organization_education_stream_id && (
                        <FormHelperText>
                          {
                            EducationErrors?.[idx]
                              ?.organization_education_stream_id
                          }
                        </FormHelperText>
                      )}
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Institute Name"
                      name="institute_name"
                      value={section?.mainData?.institute_name}
                      onChange={(e) => handleChange(e, idx)}
                      error={!!EducationErrors?.[idx]?.institute_name}
                      helperText={EducationErrors?.[idx]?.institute_name}
                      required
                      inputProps={{ maxLength: 256 }}
                    />

                    <TextField
                      fullWidth
                      label="Board Name"
                      name="board_university_name"
                      value={section?.mainData?.board_university_name}
                      onChange={(e) => handleChange(e, idx)}
                      error={!!EducationErrors?.[idx]?.board_university_name}
                      helperText={EducationErrors?.[idx]?.board_university_name}
                      inputProps={{ maxLength: 50 }}
                      required
                    />

                    <TextField
                      fullWidth
                      label="Marks (%)"
                      name="marks_percentage"
                      value={section?.mainData?.marks_percentage}
                      onChange={(e) => {
                        const textOnly = e.target.value.replace(/[^0-9.]/g, ""); // Allow letters and spaces
                        handleChange(
                          {
                            target: {
                              name: "marks_percentage",
                              value: textOnly,
                            },
                          },
                          idx
                        );
                      }}
                      error={!!EducationErrors?.[idx]?.marks_percentage}
                      helperText={EducationErrors?.[idx]?.marks_percentage}
                    />
                    <FormControl
                      component="fieldset"
                      sx={{ marginTop: 2 }}
                      error={!!EducationErrors?.is_pursuing}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={section?.mainData?.is_pursuing || false}
                            onChange={(e) => handleCheckboxChange(e, idx)}
                            name="is_pursuing"
                          />
                        }
                        label="Is Pursuing"
                      />

                      {EducationErrors?.is_pursuing && (
                        <FormHelperText>
                          {EducationErrors?.[idx]?.is_pursuing}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Year of Passing"
                      name="year_of_passing"
                      value={section?.mainData?.year_of_passing}
                      onChange={(e) => {
                        const year = e.target.value
                          .replace(/\D/g, "")
                          ?.slice(0, 4); // Only digits, max 4
                        handleChange(
                          {
                            target: {
                              name: "year_of_passing",
                              value: year,
                            },
                          },
                          idx
                        );
                      }}
                      error={!!EducationErrors?.[idx]?.year_of_passing}
                      helperText={EducationErrors?.[idx]?.year_of_passing}
                    />
                  </Grid>
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
        <Button
          style={{ marginTop: 9 }}
          variant="contained"
          onClick={() => {
            setExpanded(`Education ${Education?.length + 1}`);
            addEducation();
          }}
        >
          Add More
        </Button>
      </Box>
    </Box>
  );
}

export default EmployeeEducationForm;
