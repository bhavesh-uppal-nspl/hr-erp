import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Checkbox,
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
import { useParams } from "react-router-dom";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {
  fetchEmployeeEducationDegree,
  fetchEmployeeEducationLevel,
  fetchEmployeeEducationStreamByLevelDegree,
} from "../../../Apis/EducationApi";
import useEmployeeDataStore from "../../../Zustand/Store/useEmployeeDataStore";

function EmployeeEducationForm({ mode, employeeId }) {
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const {
    setEducationData,
    Education,
    EducationErrors,
    addEducation,
    removeEducation,
  } = useEmployeeDataStore();

  const [educationLevel, setEducationLevel] = useState([]);
  const [educationDegree, setEducationDegree] = useState([]);
  const [educationstream, setEducationStream] = useState([]);

  const [expanded, setExpanded] = useState("Education 1");

  const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };

  useEffect(() => {
    fetchEmployeeEducationLevel(org.organization_id)
      .then((data) => setEducationLevel(data?.EducationLevel?.data || []))
      .catch((err) => console.log("Level fetch error:", err));
  }, []);

  const handleChange = async (e, idx) => {
    const { name, value } = e.target;
    setEducationData(name, value, idx);

    // Level → fetch degree, reset stream
    if (name === "organization_education_level_id") {
      const degreeRes = await fetchEmployeeEducationDegree(
        org.organization_id,
        value
      );
      setEducationDegree(degreeRes?.EducationDegree?.data || []);
      setEducationStream([]);
    }

    // Degree → fetch stream based on Level + Degree
    if (name === "organization_education_degree_id") {
      const levelId = Education[idx]?.organization_education_level_id;
      const degreeId = value;

      if (levelId && degreeId) {
        const streamRes = await fetchEmployeeEducationStreamByLevelDegree(
          org.organization_id,
          levelId,
          degreeId
        );
        setEducationStream(streamRes || []);
      }
    }
  };

  const handleCheckboxChange = (e, idx) => {
    setEducationData(e.target.name, e.target.checked, idx);
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
                  width: "100%",
                }}
              >
                <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                  {section.name}
                </Typography>

                {idx !== 0 && (
                  <DeleteOutlineIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      removeEducation(idx);
                    }}
                    sx={{ color: "error.main" }}
                  />
                )}
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              {expanded === section.name && (
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    {/* ROW 1 – Level, Degree, Stream */}
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                      }}
                    >
                      {/* Education Level */}
                      <FormControl
                        fullWidth
                        error={
                          !!EducationErrors?.[idx]
                            ?.organization_education_level_id
                        }
                      >
                        <InputLabel>Education Level</InputLabel>

                        <Select
                          disabled={mode === "view"  ||   educationLevel.length === 0}
                          name="organization_education_level_id"
                          value={
                            section?.mainData
                              ?.organization_education_level_id || ""
                          }
                          label="Education Level"
                          onChange={(e) => handleChange(e, idx)}
                        >
                          {educationLevel?.map((option) => (
                            <MenuItem
                              key={option.organization_education_level_id}
                              value={option.organization_education_level_id}
                            >
                              {option.education_level_name}
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

                      {/* Education Degree */}
                      <FormControl
                        fullWidth
                        error={
                          !!EducationErrors?.[idx]
                            ?.organization_education_degree_id
                        }
                      >
                        <InputLabel>Education Degree</InputLabel>

                        <Select
                          disabled={mode === "view"  || educationDegree.length===0 }
                          name="organization_education_degree_id"
                          value={
                            section?.mainData
                              ?.organization_education_degree_id || ""
                          }
                          label="Education Degree"
                          onChange={(e) => handleChange(e, idx)}
                        >
                          {(educationDegree?.length
                            ? educationDegree
                            : section?.mainData?.degree || []
                          )?.map((option) => (
                            <MenuItem
                              key={option.organization_education_degree_id}
                              value={option.organization_education_degree_id}
                            >
                              {option.education_degree_name}
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

                      {/* Education Stream */}
                      <FormControl
                        fullWidth
                        error={
                          !!EducationErrors?.[idx]
                            ?.organization_education_stream_id
                        }
                      >
                        <InputLabel>Education Stream</InputLabel>

                        <Select
                          disabled={mode === "view"  ||  educationstream.length===0  }
                          name="organization_education_stream_id"
                          value={
                            section?.mainData
                              ?.organization_education_stream_id || ""
                          }
                          label="Education Stream"
                          onChange={(e) => handleChange(e, idx)}
                        >
                          {educationstream?.map((option) => (
                            <MenuItem
                              key={option.organization_education_stream_id}
                              value={option.organization_education_stream_id}
                            >
                              {option.education_stream_name}
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
                    </Box>

                    {/* ROW 2 – Institute, Board, Marks */}
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        fullWidth
                        disabled={mode === "view"}
                        label="Institute Name"
                        name="institute_name"
                        value={section.mainData.institute_name || ""}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!EducationErrors?.[idx]?.institute_name}
                        helperText={EducationErrors?.[idx]?.institute_name}
                      />

                      <TextField
                        fullWidth
                        disabled={mode === "view"}
                        label="Board Name"
                        name="board_university_name"
                        value={section.mainData.board_university_name || ""}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!EducationErrors?.[idx]?.board_university_name}
                        helperText={
                          EducationErrors?.[idx]?.board_university_name
                        }
                      />

                      <TextField
                        fullWidth
                        disabled={mode === "view"}
                        label="Marks (%)"
                        name="marks_percentage"
                        value={section.mainData.marks_percentage || ""}
                        onChange={(e) => {
                          const textOnly = e.target.value.replace(
                            /[^0-9.]/g,
                            ""
                          );
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
                    </Box>

                    {/* Checkbox */}
                    <FormControl error={!!EducationErrors?.[idx]?.is_pursuing}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={mode === "view"}
                            checked={section.mainData.is_pursuing || false}
                            onChange={(e) => handleCheckboxChange(e, idx)}
                            name="is_pursuing"
                          />
                        }
                        label="Is Pursuing"
                      />
                    </FormControl>

                    {/* Year of Passing */}
                    <TextField
                      fullWidth
                      disabled={
                        mode === "view" || section.mainData.is_pursuing
                      }
                      label="Year of Passing"
                      name="year_of_passing"
                      value={section.mainData.year_of_passing || ""}
                      onChange={(e) => {
                        const year = e.target.value.replace(/\D/g, "").slice(0, 4);
                        handleChange(
                          {
                            target: { name: "year_of_passing", value: year },
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

        {/* Add More */}
        <Button
          disabled={mode === "view"}
          variant="contained"
          sx={{ mt: 1 }}
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
