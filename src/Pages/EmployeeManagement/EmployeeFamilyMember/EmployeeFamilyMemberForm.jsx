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
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import useEmployeeDataStore from "../../../Zustand/Store/useEmployeeDataStore";
function EmployeeFamilyMemberForm({ mode, employeeId }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const {
    setFamilyData,
    Family,
    getDropdowndata,
    FamilyErrors,
    DropDownData,
    addFamily,
    removeFamily,
  } = useEmployeeDataStore();
  const [level, setLevel] = useState("");

  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [employee, setEmployee] = useState([]);

  const current_status = ["Studying", "Working", "Unemployed", "Retired","Homemaker","Other"];
  const marital_status = [
    "Married",
    "Unmarried",
    "Widowed",
    "Divorced",
    "Other",
  ];


  const relationship = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Husband",
    "Wife",
    "Grandfather",
    "Grandmother",
    "Father in law",
    "Mother in law",
    "Brother in law",
    "Sister in law",
    "Grandfather in law",
    "Grandmother in law",
    "Son",
    "Daughter"
  ];

  const [expanded, setExpanded] = useState("Family 1");

  const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };
  let navigate = useNavigate();

  // useEffect(() => {
  //   {
  //     fetchOrganizationEmployee(org.organization_id)
  //       .then((data) => {
  //         setEmployee(data.employees.data);
  //       })
  //       .catch((err) => {
  //         setFamilyErrors(err.message);
  //       });
  //   }
  // }, []);
  // useEffect(() => {
  //   let getdataById = async () => {
  //     const response = await axios.get(
  //       `${MAIN_URL}/api/organizations/${org.organization_id}/employee-family-details/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     let a = response.data.education;
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

    setFamilyData(name, value, idx);
  };
  const handleCheckboxChange = (e, idx) => {
    const { name, checked } = e.target;

    setFamilyData(name, checked, idx);
  };

  const handleSubmit = async (e) => {
    // setFamilyData(section?.mainData?);
  };

  return (
    <Box px={4}>
      {/* <Header mode={mode}
        updateMessage={"Employement's Type"}
        addMessage={"Employement's Type"}
        homeLink={"/employement/types"}
        homeText={"Employement's Type"}
      /> */}

        <Box>
          {Family?.map((item, id) => ({
            name: `Family ${id + 1}`,
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
                        removeFamily(idx);
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
                          error={!!FamilyErrors?.[idx]?.relationship}
                          margin="normal"
                        >
                          <InputLabel id="relationship-label">
                            Relationship
                          </InputLabel>
                          <Select
                            labelId="relationship-label"
                            id="relationship"
                            name="relationship"
                            value={section?.mainData?.relationship || ""}
                            onChange={(e) => handleChange(e, idx)}
                            label="RelationShip"
                          >
                            {relationship.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {FamilyErrors?.[idx]?.relationship && (
                            <FormHelperText>
                              {FamilyErrors?.[idx]?.relationship}
                            </FormHelperText>
                          )}
                        </FormControl>



                        <TextField
                          fullWidth
                          label="Family Member Name"
                          name="name"
                          value={section?.mainData?.name}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!FamilyErrors?.[idx]?.name}
                          helperText={FamilyErrors?.[idx]?.name}
                          inputProps={{ maxLength: 255 }}
                          required
                        />

                     

                        <FormControl
                          fullWidth
                          required
                          error={!!FamilyErrors?.[idx]?.marital_status}
                          margin="normal"
                        >
                          <InputLabel id="marital_status-label">
                            Marital Status
                          </InputLabel>
                          <Select
                            labelId="marital_status-label"
                            id="marital_status"
                            name="marital_status"
                            value={section?.mainData?.marital_status || ""}
                            onChange={(e) => handleChange(e, idx)}
                            label="Marital Status"
                          >
                            {marital_status.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {FamilyErrors?.[idx]?.marital_status && (
                            <FormHelperText>
                              {FamilyErrors?.[idx]?.marital_status}
                            </FormHelperText>
                          )}
                        </FormControl>

                        <FormControl
                          fullWidth
                          required
                          error={!!FamilyErrors?.[idx]?.current_status}
                          margin="normal"
                        >
                          <InputLabel id="current_status-label">
                            Current Status
                          </InputLabel>
                          <Select
                            labelId="current_status-label"
                            id="current_status"
                            name="current_status"
                            value={section?.mainData?.current_status || ""}
                            onChange={(e) => handleChange(e, idx)}
                            label="Current Status"
                          >
                            {current_status.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {FamilyErrors?.[idx]?.current_status && (
                            <FormHelperText>
                              {FamilyErrors?.[idx]?.current_status}
                            </FormHelperText>
                          )}
                        </FormControl>

                        <TextField
                          fullWidth
                          label="Education Details"
                          name="education_details"
                          value={section?.mainData?.education_details}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!FamilyErrors?.[idx]?.education_details}
                          helperText={FamilyErrors?.[idx]?.education_details}
                          inputProps={{ maxLength: 100 }}
                          
                        />

                        <TextField
                          fullWidth
                          label="Occupation Details"
                          name="occupation_details"
                          value={section?.mainData?.occupation_details}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!FamilyErrors?.[idx]?.occupation_details}
                          helperText={FamilyErrors?.[idx]?.occupation_details}
                          inputProps={{ maxLength: 100 }}
                          
                        />

                     

                      

                        {/* <TextField
                          fullWidth
                          label="Relationship"
                          name="relationship"
                          value={section?.mainData?.relationship}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!FamilyErrors?.[idx]?.relationship}
                          helperText={FamilyErrors?.[idx]?.relationship}
                          inputProps={{ maxLength: 100 }}
                          required
                        /> */}

                        <TextField
                          fullWidth
                          label="Birth Date"
                          type="date"
                          name="date_of_birth"
                          value={section?.mainData?.date_of_birth}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!FamilyErrors?.[idx]?.date_of_birth}
                          helperText={FamilyErrors?.[idx]?.date_of_birth}
                          InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                          fullWidth
                          label="Contact No."
                          name="phone"
                          type="tel"
                          value={section?.mainData?.phone}
                          onChange={(e) => {
                            const input = e.target.value;
                            if (/^\d{0,25}$/.test(input)) {
                              handleChange(e, idx);
                            }
                          }}
                          error={!!FamilyErrors?.[idx]?.phone}
                          helperText={FamilyErrors?.[idx]?.phone}
                          
                          inputProps={{
                            minLength: 12,
                            maxLength: 20,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                        />

                           <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          name="email"
                          value={section?.mainData?.email}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!FamilyErrors?.[idx]?.email}
                          helperText={FamilyErrors?.[idx]?.email}
                          inputProps={{ maxLength: 100 }}
                          
                        />

                          <TextField
                          fullWidth
                          label="Description"
                          name="description"
                          value={section?.mainData?.description}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!FamilyErrors?.[idx]?.description}
                          helperText={FamilyErrors?.[idx]?.description}
                          inputProps={{ maxLength: 255 }}
                          
                        />

                        <FormControl
                          component="fieldset"
                          sx={{ marginTop: 2 }}
                          error={!!FamilyErrors?.is_dependent}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  section?.mainData?.is_dependent || false
                                }
                                onChange={(e) => handleCheckboxChange(e, idx)}
                                name="is_dependent"
                              />
                            }
                            label="Is Dependent"
                          />

                          {FamilyErrors?.is_dependent && (
                            <FormHelperText>
                              {FamilyErrors?.[idx]?.is_dependent}
                            </FormHelperText>
                          )}
                        </FormControl>
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
              setExpanded(`Family ${Family?.length + 1}`);
              addFamily();
            }}
          >
            Add More
          </Button>
        </Box>

    </Box>
  );
}

export default EmployeeFamilyMemberForm;
