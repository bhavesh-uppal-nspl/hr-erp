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
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {
  fetchEmployeeEducationDegree,
  fetchEmployeeEducationLevel,
  fetchEmployeeEducationStream,
} from "../../../Apis/EducationApi";
import useInternDataStore from "../../../Zustand/Store/useInternDataStore";

function InternEducationForm({ }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [level, setLevel] = useState("");

  const {
    setEducationData,
    Education,
    EducationErrors,
    addEducation,
    removeEducation,
  } = useInternDataStore();

  console.log("Education is ; ", Education);
  const [educationLevel, setEducationLevel] = useState([]);
  const [educationstream, setEducationStream] = useState([]);
  const [educationDegree, setEducationDegree] = useState([]);
  console.log("education level ", educationLevel);

  const [expanded, setExpanded] = useState("Education 1");

  const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchEmployeeEducationLevel(org?.organization_id)
        .then((data) => {
          setEducationLevel(data?.EducationLevel.data);
        })
        .catch((err) => {
          console.log("err is : ", err);
        });
    }
  }, []);

 
  useEffect(() => {
    {
      fetchEmployeeEducationStream(org?.organization_id)
        .then((data) => {
          setEducationStream(data?.EducationStream);
        })
        .catch((err) => {
          console.log("err is : ", err);
        });
    }
  }, []);

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


  console.log("education degree ", educationDegree);


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
                      name="board_name"
                      value={section?.mainData?.board_name}
                      onChange={(e) => handleChange(e, idx)}
                      error={!!EducationErrors?.[idx]?.board_name}
                      helperText={EducationErrors?.[idx]?.board_name}
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

export default InternEducationForm;
