import React, { useState, useEffect } from "react";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import { fetchOrganizationEmployeeAddressTypes } from "../../../Apis/EmployeeAddressType-api";
import { fetchcities } from "../../../Apis/OrganizationLocation";
import { fetchOrganizationResidentialOwnerType } from "../../../Apis/ResidentialOwnershipType-api";
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
import Autocomplete from "@mui/material/Autocomplete";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import useInternDataStore from "../../../Zustand/Store/useInternDataStore";

function InterAddressForm({mode }) {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const { id } = useParams();

  const {
    setAddressData,
    Address,
    AddressErrors,
    addAddress,
    removeAddress,
  } = useInternDataStore();

  const [expanded, setExpanded] = useState("Address 1");
  const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };


  const [cityOptions, setCity] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [employeeAddressType, setEmployeeAddressType] = useState([]);
  const [residentailtype, setResidentialType] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchOrganizationEmployeeAddressTypes(org?.organization_id)
        .then((data) => {
          setEmployeeAddressType(data?.addresstype?.data);
        })
        .catch((err) => {
          console.log("err is : ", err);
        });
    }
  }, []);

  useEffect(() => {
    if (inputValue?.length < 2) return;
    fetchcities(inputValue)
      .then((data) => {
        setCity(data?.cities);
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
      });
  }, [inputValue]);

  useEffect(() => {
    {
      fetchOrganizationResidentialOwnerType(org?.organization_id)
        .then((data) => {
          setResidentialType(data?.residentialtype?.data);
        })
        .catch((err) => {
          console.log("err is : ", err);
        });
    }
  }, []);

  const handleChange = (e , idx) => {
    const { name, value } = e.target;

    setAddressData(name, value, idx);
  };
  
  return (
    <Box px={4} >
    
        <Box>
          {Address?.map((item, id) => ({
            name: `Address ${id + 1}`,
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
                        removeAddress(idx);
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
                          label="Address Line 1"
                          disabled={mode === "view"}
                          name="address_line1"
                          value={section?.mainData?.address_line1}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!AddressErrors?.[idx]?.address_line1}
                          helperText={AddressErrors?.[idx]?.address_line1}
                          required
                           inputProps={{ maxLength: 100 }}
                        />

                        <TextField
                          fullWidth
                          label="Address Line 2"
                          name="address_line2"
                          disabled={mode ==="view"}
                          value={section?.mainData?.address_line2}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!AddressErrors?.[idx]?.address_line2}
                          helperText={AddressErrors?.[idx]?.address_line2}
                           inputProps={{ maxLength: 100 }}
                        />

                        <TextField
                          fullWidth
                          label="Address Line 3"
                          name="address_line3"
                            disabled={mode ==="view"}
                          value={section?.mainData?.address_line3}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!AddressErrors?.[idx]?.address_line3}
                          helperText={AddressErrors?.[idx]?.address_line3}
                           inputProps={{ maxLength: 100 }}
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
                          label="Postal code"
                            disabled={mode ==="view"}
                          name="postal_code"
                          value={section?.mainData?.postal_code}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!AddressErrors?.[idx]?.postal_code}
                          helperText={AddressErrors?.[idx]?.postal_code}
                          required
                           inputProps={{ maxLength: 20 }}
                        />

                        <Autocomplete
                          options={cityOptions}
                            disabled={mode ==="view"}
                          getOptionLabel={(option) =>
                            typeof option === "string"
                              ? option
                              : option.city_name
                          }
                          fullWidth
                          value={section?.mainData?.city || null}
                          onChange={(event, newValue) => {
                            setAddressData(
                              "general_city_id",
                              newValue?.general_city_id,
                              0
                            );
                            setAddressData("city", newValue || "", 0);
                          }}
                          onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option?.general_city_id === value?.general_city_id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="City"
                              error={!!AddressErrors?.[idx]?.general_city_id}
                              helperText={AddressErrors?.[idx]?.general_city_id}
                              required
                            />
                          )}
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
          
          style={{marginTop:9}} variant="contained" onClick={() =>{ setExpanded(`Address ${Address?.length+1}`); addAddress()}}>
            Add More
          </Button>
        </Box>
    
    </Box>
  );
}

export default InterAddressForm;
