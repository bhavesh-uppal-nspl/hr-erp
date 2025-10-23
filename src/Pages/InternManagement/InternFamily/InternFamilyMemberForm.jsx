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

function InternFamilyMemberForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const { setFamilyData, Family, FamilyErrors, addFamily, removeFamily } =
    useInternDataStore();

  const relationship = [
    "Father",
    "Mother",
    "Guardian",
    "Sibling",
    "Spouse",
    "Child",
    "Other",
  ];

  const gender=["Male","Female","Other"]

  const [expanded, setExpanded] = useState("Family 1");
  const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };
  let navigate = useNavigate();

  const handleChange = (e, idx) => {
    const { name, value } = e.target;
    setFamilyData(name, value, idx);
  };
  const handleCheckboxChange = (e, idx) => {
    const { name, checked } = e.target;
    setFamilyData(name, checked, idx);
  };

  return (
    <Box px={4}>
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
                        error={!!FamilyErrors?.[idx]?.relationship_type}
                        margin="normal"
                      >
                        <InputLabel id="relationship_type-label">
                          Relationship
                        </InputLabel>
                        <Select
                          labelId="relationship_type-label"
                          id="relationship_type"
                          name="relationship_type"
                          value={section?.mainData?.relationship_type || ""}
                          onChange={(e) => handleChange(e, idx)}
                          label="relationship_type"
                        >
                          {relationship?.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {FamilyErrors?.[idx]?.relationship_type && (
                          <FormHelperText>
                            {FamilyErrors?.[idx]?.relationship_type}
                          </FormHelperText>
                        )}
                      </FormControl>


                       <FormControl
                        fullWidth
                        required
                        error={!!FamilyErrors?.[idx]?.gender}
                        margin="normal"
                      >
                        <InputLabel id="gender-label">
                          Gender
                        </InputLabel>
                        <Select
                          labelId="gender-label"
                          id="gender"
                          name="gender"
                          value={section?.mainData?.gender || ""}
                          onChange={(e) => handleChange(e, idx)}
                          label="gender"
                        >
                          {gender?.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {FamilyErrors?.[idx]?.gender && (
                          <FormHelperText>
                            {FamilyErrors?.[idx]?.gender}
                          </FormHelperText>
                        )}
                      </FormControl>


                      <TextField
                        fullWidth
                        label="Family Member Name"
                        name="full_name"
                        value={section?.mainData?.full_name}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!FamilyErrors?.[idx]?.full_name}
                        helperText={FamilyErrors?.[idx]?.full_name}
                        inputProps={{ maxLength: 255 }}
                        required
                      />

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
                        label="Phone No."
                        name="phone_number"
                        type="tel"
                        value={section?.mainData?.phone_number}
                        onChange={(e) => {
                          const input = e.target.value;
                          if (/^\d{0,25}$/.test(input)) {
                            handleChange(e, idx);
                          }
                        }}
                        error={!!FamilyErrors?.[idx]?.phone_number}
                        helperText={FamilyErrors?.[idx]?.phone_number}
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

                      <FormControl
                        component="fieldset"
                        sx={{ marginTop: 2 }}
                        error={!!FamilyErrors?.is_dependent}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={section?.mainData?.is_dependent || false}
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

export default InternFamilyMemberForm;
