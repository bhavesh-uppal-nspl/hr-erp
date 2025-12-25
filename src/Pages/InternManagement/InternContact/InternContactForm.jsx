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
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import useInternDataStore from "../../../Zustand/Store/useInternDataStore";

function InternContactForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const { setContactData, Contact, ContactErrors, addContact, removeContact } =
    useInternDataStore();

  const [expanded, setExpanded] = useState("Contact 1");

  const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };

  const relationship = ["Parent", "Spouse", "Sibling", "Friend", "Other"];

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
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "100%", // ensures proper centering
                  }}
                >

                    <TextField
                        fullWidth
                        label="Personal Phone No"
                        name="personal_phone_number"
                        type="text"
                          disabled={mode ==="view"}
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
                        fullWidth
                        type="text" // change from "number" to "text"
                        label="Alternate Phone No"
                          disabled={mode ==="view"}
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
                        fullWidth
                        label="Email"
                          disabled={mode ==="view"}
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
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "100%", // ensures proper centering
                  }}
                >


                      <TextField
                        fullWidth
                        label="Emergency Person Name"
                          disabled={mode ==="view"}
                        name="emergency_contact_name"
                        value={section?.mainData?.emergency_contact_name}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!ContactErrors?.[idx]?.emergency_contact_name}
                        helperText={
                          ContactErrors?.[idx]?.emergency_contact_name
                        }
                        required
                        inputProps={{ maxLength: 100 }}
                      />

                      <FormControl
                        disabled={mode ==="view"}
                        fullWidth
                        required
                        error={
                          !!ContactErrors?.[idx]?.emergency_contact_relation
                        }
                      
                      >
                        <InputLabel id="emergency_contact_relation-label">
                          Relationship
                        </InputLabel>
                        <Select
                          labelId="emergency_contact_relation-label"
                          id="emergency_contact_relation"
                          name="emergency_contact_relation"
                          value={
                            section?.mainData?.emergency_contact_relation || ""
                          }
                          onChange={(e) => handleChange(e, idx)}
                          label="emergency_contact_relation"
                        >
                          {relationship?.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {ContactErrors?.[idx]?.emergency_contact_relation && (
                          <FormHelperText>
                            {ContactErrors?.[idx]?.emergency_contact_relation}
                          </FormHelperText>
                        )}
                      </FormControl>

                      <TextField
                        fullWidth
                          disabled={mode ==="view"}
                        type="text"
                        label="Emergency Person Phone No"
                        name="emergency_contact_phone"
                        value={section?.mainData?.emergency_contact_phone}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!ContactErrors?.[idx]?.emergency_contact_phone}
                        helperText={
                          ContactErrors?.[idx]?.emergency_contact_phone
                        }
                        required
                        inputProps={{
                          maxLength: 20, // Limit to 20 digits
                          inputMode: "numeric", // Opens number pad on mobile
                          pattern: "[0-9]*", // Accept digits only
                        }}
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
          disabled={mode ==="view"}
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

export default InternContactForm;
