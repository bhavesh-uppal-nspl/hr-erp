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

function InterAddressForm({ }) {
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
                        {/* <FormControl
                          fullWidth
                          error={
                            !!AddressErrors?.[idx]?.organization_employee_address_type_id
                          }
                          sx={{ marginTop: 2 }}
                        >
                          <InputLabel id="employee-address-type-label">
                            Employee Address Type
                          </InputLabel>

                          <Select
                            labelId="employee-address-type-label"
                            id="organization_employee_address_type_id"
                            name="organization_employee_address_type_id"
                            value={
                              section?.mainData
                                ?.organization_employee_address_type_id || ""
                            }
                            label="Employee Address Type"
                            onChange={(e) => handleChange(e, idx)}
                             required
                            >
                            {employeeAddressType?.map((option) => (
                              <MenuItem
                              key={
                                option?.organization_employee_address_type_id
                              }
                              value={
                                option?.organization_employee_address_type_id
                              }
                              >
                                {option?.employee_address_type_name}
                              </MenuItem>
                            ))}
                            
                          </Select>

                          {AddressErrors?.[idx]?.organization_employee_address_type_id && (
                            <FormHelperText>
                              {
                                AddressErrors?.[idx]?.organization_employee_address_type_id
                              }
                            </FormHelperText>
                          )}
                          
                          
                        </FormControl> */}

                        {/* <FormControl
                          fullWidth
                          required
                          error={
                            !!AddressErrors?.[idx]?.organization_residential_ownership_type_id
                          }
                          sx={{ marginTop: 2 }}
                          >
                          <InputLabel id="employee-ownership-type-label">
                            {" "}
                            Residential Ownership Type
                          </InputLabel>

                          <Select
                            labelId="employee-ownership-type-label"
                            id="organization_residential_ownership_type_id"
                            name="organization_residential_ownership_type_id"
                            value={
                              section?.mainData
                              ?.organization_residential_ownership_type_id ||
                              ""
                            }
                            label="Employee Ownership Type"
                            onChange={(e) => handleChange(e, idx)}
                            
                          >
                            {residentailtype?.map((option) => (
                              <MenuItem
                                key={
                                  option?.organization_residential_ownership_type_id
                                }
                                value={
                                  option?.organization_residential_ownership_type_id
                                }
                              >
                                {option?.residential_ownership_type_name}
                              </MenuItem>
                            ))}
                          </Select>
                          

                          {AddressErrors?.[idx]?.organization_residential_ownership_type_id && (
                            <FormHelperText>
                              {
                                AddressErrors?.[idx]?.organization_residential_ownership_type_id
                              }
                            </FormHelperText>
                          )}
                          
                        </FormControl> */}

                       
                       
                       

                        <TextField
                          fullWidth
                          label="Address Line 1"
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
                          value={section?.mainData?.address_line3}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!AddressErrors?.[idx]?.address_line3}
                          helperText={AddressErrors?.[idx]?.address_line3}
                           inputProps={{ maxLength: 100 }}
                        />

                        
                        <TextField
                          fullWidth
                          label="Postal code"
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
                      </Grid>
                    </Paper>
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          ))}

          <Button style={{marginTop:9}} variant="contained" onClick={() =>{ setExpanded(`Address ${Address?.length+1}`); addAddress()}}>
            Add More
          </Button>
        </Box>
    
    </Box>
  );
}

export default InterAddressForm;
