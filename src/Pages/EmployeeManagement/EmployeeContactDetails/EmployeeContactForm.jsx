import React, { useState, useEffect } from "react";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
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
import useEmployeeDataStore from "../../../Zustand/Store/useEmployeeDataStore";

function EmployeeContactForm({ mode, employeeId }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const {
    setContactData,
    Contact,
    getDropdowndata,
    ContactErrors,
    DropDownData,
    addContact,
    removeContact,
  } = useEmployeeDataStore();

  const [expanded, setExpanded] = useState("Contact 1");

  const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };

  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [employee, setEmployee] = useState([]);

  let navigate = useNavigate();

  const handleChange = (e, idx) => {
    const { name, value } = e.target;

    // Check if the field is a phone number field
    const phoneFields = [
      "personal_phone_number",
      "alternate_personal_phone_number",
      "emergency_person_phone_number_1",
      "emergency_person_phone_number_2",
    ];

    let cleanedValue = value;

    if (phoneFields.includes(name)) {
      cleanedValue = value.replace(/\D/g, "")?.slice(0, 20);
    }
    setContactData(name, cleanedValue, idx);
  };

  return (
    <Box px={4}>
      {/* <Header
        mode={mode}
        updateMessage={"Employee Contact Deatil"}
        addMessage={"Employee Contact"}
        homeLink={"/employee/employee-contacts"}
        // homeText={"Employee Contact Details"}
      /> */}

      <Box>
        {Contact?.map((item, id) => ({
          name: `Contact ${id + 1}`,
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
                      removeContact(idx);
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
    width: "100%",             // ensures proper centering
  }}
>

 <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        label="Personal Phone No"
                        name="personal_phone_number"
                        type="text"
                        value={section?.mainData?.personal_phone_number}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!ContactErrors?.[idx]?.personal_phone_number}
                        helperText={ContactErrors?.[idx]?.personal_phone_number}
                        required
                       

                        inputProps={{
                          maxLength: 20,
                          inputMode: "numeric", // shows numeric keyboard on mobile
                          pattern: "[0-9]*", // restricts to digits only
                        }}
                      />

                      <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        type="text" // change from "number" to "text"
                        label="Alternate Phone No"
                        name="alternate_personal_phone_number"
                        value={
                          section?.mainData?.alternate_personal_phone_number
                        }
                        onChange={(e) => handleChange(e, idx)}
                       

                        error={
                          !!ContactErrors?.[idx]
                            ?.alternate_personal_phone_number
                        }
                        helperText={
                          ContactErrors?.[idx]?.alternate_personal_phone_number
                        }
                        inputProps={{
                          maxLength: 20,
                          inputMode: "numeric", // mobile numeric keyboard
                          pattern: "[0-9]*", // digits only
                        }}
                      />

                      <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        label="Email"
                        type="email"
                        name="personal_email"
                        value={section?.mainData?.personal_email}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!ContactErrors?.[idx]?.personal_email}
                        helperText={ContactErrors?.[idx]?.personal_email}
                        inputProps={{ maxLength: 100 }}
                        required
                      />

</Box>
                     




<Box
  sx={{
    display: "flex",
    justifyContent: "center",  // centers the row
    gap: 2,                    // space between fields
    width: "100%",             // ensures proper centering
  }}
>


 <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        label="Alternate Email"
                        type="email"
                        name="alternate_personal_email"
                        value={section?.mainData?.alternate_personal_email}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!ContactErrors?.[idx]?.alternate_personal_email}
                        helperText={
                          ContactErrors?.[idx]?.alternate_personal_email
                        }
                        inputProps={{
                          maxLength: 100,
                        }}
                        placeholder="abc@gmail.com"
                      />


                      <FormControl
                       disabled ={mode==="view"}
                        fullWidth
                        required
                        error={!!ContactErrors?.[idx]?.preferred_contact_method}
                     
                      >


                        <InputLabel id="preferred-contact-method-label">
                          Contact Method
                        </InputLabel>

                        <Select
                          labelId="preferred-contact-method-label"
                          id="preferred_contact_method"
                          name="preferred_contact_method"
                         
                          value={
                            section?.mainData?.preferred_contact_method || ""
                          }
                          label="Contact Method"
                          onChange={(e) => handleChange(e, idx)}
                        >
                          <MenuItem value="Email">Email</MenuItem>
                          <MenuItem value="Phone">Phone</MenuItem>
                          <MenuItem value="Message">Message</MenuItem>
                        </Select>

                        {ContactErrors?.[idx]?.preferred_contact_method && (
                          <FormHelperText>
                            {ContactErrors?.[idx]?.preferred_contact_method}
                          </FormHelperText>
                        )}
                      </FormControl>

                      <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        label="Emergency Person Name 1"
                        name="emergency_person_name_1"
                        value={section?.mainData?.emergency_person_name_1}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!ContactErrors?.[idx]?.emergency_person_name_1}
                        helperText={
                          ContactErrors?.[idx]?.emergency_person_name_1
                        }
                        required
                        inputProps={{ maxLength: 100 }}
                       
                      />


</Box>


                     

<Box
  sx={{
    display: "flex",
    justifyContent: "center",  // centers the row
    gap: 2,                    // space between fields
    width: "100%",             // ensures proper centering
  }}
>

                      <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        type="text"
                        label="Emergency Person Phone No 1"
                        name="emergency_person_phone_number_1"
                        value={
                          section?.mainData?.emergency_person_phone_number_1
                        }
                        onChange={(e) => handleChange(e, idx)}
                        error={
                          !!ContactErrors?.[idx]
                            ?.emergency_person_phone_number_1
                        }
                        helperText={
                          ContactErrors?.[idx]?.emergency_person_phone_number_1
                        }
                        required
                       
                        inputProps={{
                          maxLength: 20, // Limit to 20 digits
                          inputMode: "numeric", // Opens number pad on mobile
                          pattern: "[0-9]*", // Accept digits only
                        }}
                      />

                          <TextField
                         disabled ={mode==="view"}
                        fullWidth
                        required
                        label="Emergency Person Relation 1"
                        name="emergency_person_relation_1"
                        value={section?.mainData?.emergency_person_relation_1}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!ContactErrors?.[idx]?.emergency_person_relation_1}
                        helperText={
                          ContactErrors?.[idx]?.emergency_person_relation_1
                        }
                        inputProps={{ maxLength: 100 }}
                       
                      />


                      <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        label="Emergency Person Name 2"
                        name="emergency_person_name_2"
                        value={section?.mainData?.emergency_person_name_2}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!ContactErrors?.[idx]?.emergency_person_name_2}
                        helperText={
                          ContactErrors?.[idx]?.emergency_person_name_2
                        }
                        inputProps={{ maxLength: 100 }}
                       
                      />

</Box>




<Box
  sx={{
    display: "flex",
    justifyContent: "center",  // centers the row
    gap: 2,                    // space between fields
    width: "100%",             // ensures proper centering
  }}
>



                      <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        type="text"
                        label="Emergency Person Phone No 2"
                        name="emergency_person_phone_number_2"
                        value={
                          section?.mainData?.emergency_person_phone_number_2
                        }
                        onChange={(e) => handleChange(e, idx)}
                        error={
                          !!ContactErrors?.[idx]
                            ?.emergency_person_phone_number_2
                        }
                        helperText={
                          ContactErrors?.[idx]?.emergency_person_phone_number_2
                        }
                        inputProps={{
                          maxLength: 20, // Limit to 20 digits
                          inputMode: "numeric", // Opens number pad on mobile
                          pattern: "[0-9]*", // Accept digits only
                        }}
                      />






                          <TextField
                         disabled ={mode==="view"}
                        fullWidth
                        
                        label="Emergency Person Relation 2"
                        name="emergency_person_relation_2"
                        value={section?.mainData?.emergency_person_relation_2}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!ContactErrors?.[idx]?.emergency_person_relation_2}
                        helperText={
                          ContactErrors?.[idx]?.emergency_person_relation_2
                        }
                        inputProps={{ maxLength: 100 }}
                       
                      />


                      <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        type="text"
                        label="Work Phone No"
                        name="work_phone_number"
                        value={section?.mainData?.work_phone_number}
                        onChange={(e) => {
                          const input = e.target.value;
                          // ✔ Allow only digits, max 15 characters
                          if (/^\d{0,15}$/.test(input)) {
                            handleChange(e, idx);
                          }
                        }}
                        error={!!ContactErrors?.[idx]?.work_phone_number}
                        helperText={ContactErrors?.[idx]?.work_phone_number}
                       
                      />


</Box>

                      {/* <FormControl
                        fullWidth
                        required
                        error={
                          !!ContactErrors?.[idx]?.emergency_person_relation_1
                        }
                        sx={{ marginTop: 2 }}
                      >
                        <InputLabel id="emergency-person-relation-1-label">
                          Emergency Person Relation 1
                        </InputLabel>

                        <Select
                          labelId="emergency-person-relation-1-label"
                          id="emergency_person_relation_1"
                          name="emergency_person_relation_1"
                          value={
                            section?.mainData?.emergency_person_relation_1 || ""
                          }
                          label="Emergency Person Relation 1"
                          helperText={
                            ContactErrors?.[idx]
                              ?.emergency_person_phone_number_1
                          }
                          onChange={(e) => handleChange(e, idx)}
                        >
                          <MenuItem value="Parent">Parent</MenuItem>
                          <MenuItem value="Spouse">Spouse</MenuItem>
                          <MenuItem value="Sibling">Sibling</MenuItem>
                          <MenuItem value="Child">Child</MenuItem>
                          <MenuItem value="Friend">Friend</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>

                        {ContactErrors?.[idx]?.emergency_person_relation_1 && (
                          <FormHelperText>
                            {ContactErrors?.[idx]?.emergency_person_relation_1}
                          </FormHelperText>
                        )}
                      </FormControl> */}

                    
                      {/* 
                        <TextField
                          fullWidth
                          label="Emergency Person Phone No 2"
                          name="emergency_person_phone_number_2"
                          type="text"
                          value={
                            section?.mainData?.emergency_person_phone_number_2
                          }
                          onChange={(e) => {
                            const input = e.target.value;
                            // ✔ Allow only digits, max 15 characters
                            if (/^\d{0,15}$/.test(input)) {
                              handleChange(e, idx);
                            }
                          }}
                          error={
                            !!ContactErrors?.[idx]
                              ?.emergency_person_phone_number_2
                          }
                          helperText={
                            ContactErrors?.[idx]
                              ?.emergency_person_phone_number_2
                          }
                          inputProps={{
                            maxLength: 20, // Limit to 20 digits
                            inputMode: "numeric", // Opens number pad on mobile
                            pattern: "[0-9]*", // Accept digits only
                          }}
                        /> */}

{/* 
                      <FormControl
                        fullWidth
                        error={
                          !!ContactErrors?.[idx]?.emergency_person_relation_2
                        }
                        sx={{ marginTop: 2 }}
                      >
                        <InputLabel id="emergency-person-relation-2-label">
                          Emergency Person Relation 2
                        </InputLabel>

                        <Select
                          labelId="emergency-person-relation-2-label"
                          id="emergency_person_relation_2"
                          name="emergency_person_relation_2"
                          value={
                            section?.mainData?.emergency_person_relation_2 || ""
                          }
                          label="Emergency Person Relation 2"
                          onChange={(e) => handleChange(e, idx)}
                        >
                          <MenuItem value="Parent">Parent</MenuItem>
                          <MenuItem value="Spouse">Spouse</MenuItem>
                          <MenuItem value="Sibling">Sibling</MenuItem>
                          <MenuItem value="Child">Child</MenuItem>
                          <MenuItem value="Friend">Friend</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>

                        {ContactErrors?.[idx]?.emergency_person_relation_2 && (
                          <FormHelperText>
                            {ContactErrors?.[idx]?.emergency_person_relation_2}
                          </FormHelperText>
                        )}
                      </FormControl> */}


                      
             
             <Box
  sx={{
    display: "flex",
    justifyContent: "center",  // centers the row
    gap: 2,                    // space between fields
    width: "33%",             // ensures proper centering
  }}
>
  
    <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        type="email"
                        label="Work Email"
                        name="work_email"
                        value={section?.mainData?.work_email}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!ContactErrors?.[idx]?.work_email}
                        helperText={ContactErrors?.[idx]?.work_email}
                        inputProps={{ maxLength: 100 }}
                        required
                       
                      />
  
  </Box>       

                    
                    </Grid>
                  </Paper>
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        ))}

        <Button
        disabled ={mode==="view"}
          style={{ marginTop: 9 }}
          variant="contained"
          onClick={() => {
            setExpanded(`Contact ${Contact?.length + 1}`);
            addContact();
          }}
        >
          Add More
        </Button>
      </Box>
    </Box>
  );
}

export default EmployeeContactForm;
