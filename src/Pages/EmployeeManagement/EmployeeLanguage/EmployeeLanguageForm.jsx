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

  console.log(" Languages is ", Languages);

  const handleChange = (e , idx) => {
    const { name, value } = e.target;

    setLanguageData(name, value, idx);
  };
  const handleCheckboxChange = (e , idx) => {
    const { name, checked } = e.target;
    setLanguageData(name, checked, idx);
  };



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



                        <Box
  sx={{
    display: "flex",
    justifyContent: "center",  // centers the row
    gap: 2,                    // space between fields
    width: "60%",             // ensures proper centering
  }}
>


                        <TextField
                        disabled ={mode==="view"}
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


</Box>

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
                                  disabled ={mode==="view"}
                                  
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
                        disabled ={mode==="view"}
                     

                          fullWidth
                          label="Description"
                          name="description"
                          multiline
                          rows={4}
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

          <Button
          disabled ={mode==="view"}
          
          style={{marginTop:9}} variant="contained" onClick={() =>{ setExpanded(`Language ${Language?.length+1}`); addLanguage()}}>
            Add More
          </Button>
        </Box>
 
    </Box>
  );
}

export default EmployeeLanguageForm;
