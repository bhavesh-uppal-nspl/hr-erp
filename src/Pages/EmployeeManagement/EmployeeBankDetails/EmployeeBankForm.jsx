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
import { fetchEmployeeEducationLevel } from "../../../Apis/EducationApi";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import useEmployeeDataStore from "../../../Zustand/Store/useEmployeeDataStore";

function EmployeeBankForm({ mode, employeeId }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const {
    setPaymentMethodData,
    PaymentMethod,
    PaymentMethodErrors,
    getDropdowndata,
    DropDownData,
    addPaymentMethod,
    removePaymentMethod,
  } = useEmployeeDataStore();

  const [expanded, setExpanded] = useState("PaymentMethod 1");

  const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };

  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  const [employee, setEmployee] = useState([]);

  let navigate = useNavigate();

  const handleChange = (e, idx) => {
    const { name, value } = e.target;
    console.log("name, value is : ", name, value);

    setPaymentMethodData(name, value?.value || value, idx);
  };
  const handleCheckboxChange = (e, idx) => {
    const { name, checked } = e.target;

    setPaymentMethodData(name, checked, idx);
  };


  return (
    <Box px={4}>
      <Box>
        {PaymentMethod?.map((item, id) => ({
          name: `PaymentMethod ${id + 1}`,
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
                      removePaymentMethod(idx);
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
                        label="A/C Holder Name"
                        name="account_holder_name"
                        value={section?.mainData?.account_holder_name}
                        onChange={(e) => {
                          const onlyLetters = e.target.value.replace(
                            /[^a-zA-Z\s]/g,
                            ""
                          );
                          handleChange(
                            {
                              target: {
                                name: "account_holder_name",
                                value: onlyLetters.toUpperCase(),
                              },
                            },
                            idx
                          );
                        }}
                        error={
                          !!PaymentMethodErrors?.[idx]?.account_holder_name
                        }
                        helperText={
                          PaymentMethodErrors?.[idx]?.account_holder_name
                        }
                        required
                      
                        inputProps={{
                          style: { textTransform: "uppercase" },
                          maxLength: 100,
                        }}
                      />
                      <FormControl
                       disabled ={mode==="view"}
                        fullWidth
                        required
                        
                        error={!!PaymentMethodErrors?.[idx]?.account_type}
                        // sx={{ mt: 2}} // Shorter syntax for margin top
                      >


                        <InputLabel id="account-type-label">
                          A/C Type
                        </InputLabel>

                        <Select
                          labelId="account-type-label"
                          id="account_type"
                          name="account_type"
                          value={section?.mainData?.account_type || ""}
                          label="A/C Type"
                          onChange={(e) => handleChange(e, idx)}
                        

                        >
                          <MenuItem value="Savings">Savings</MenuItem>
                          <MenuItem value="Current">Current</MenuItem>
                          <MenuItem value="Salary">Salary</MenuItem>
                        </Select>

                        {PaymentMethodErrors?.[idx]?.account_type && (
                          <FormHelperText>
                            {PaymentMethodErrors?.[idx]?.account_type}
                          </FormHelperText>
                        )}
                      </FormControl>



                      <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        label="Bank Name"
                        name="bank_name"
                        value={section?.mainData?.bank_name}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(
                            /[^a-zA-Z0-9&.\- ]/g,
                            ""
                          );
                          handleChange(
                            {
                              target: {
                                name: "bank_name",
                                value: cleaned,
                              },
                            },
                            idx
                          );
                        }}
                        error={!!PaymentMethodErrors?.[idx]?.bank_name}
                        helperText={PaymentMethodErrors?.[idx]?.bank_name}
                        inputProps={{
                          style: { textTransform: "uppercase" },
                          maxLength: 100,
                        }}
                      

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
                        label="A/C Number"
                        name="account_number"
                        value={section?.mainData?.account_number}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!PaymentMethodErrors?.[idx]?.account_number}
                        helperText={PaymentMethodErrors?.[idx]?.account_number}
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          maxLength: 20,
                        }}
                      

                        required
                      />


                      <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        label="IFSC Code"
                        name="ifsc_code"
                        value={section?.mainData?.ifsc_code}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!PaymentMethodErrors?.[idx]?.ifsc_code}
                        helperText={PaymentMethodErrors?.[idx]?.ifsc_code}
                        inputProps={{
                          style: { textTransform: "uppercase" }, // visually show uppercase
                          maxLength: 11, // IFSC codes are exactly 11 characters
                        }}
                      

                        required
                      />


  </Box>         





                      <FormControl
                       disabled ={mode==="view"}
                        component="fieldset"
                        sx={{ marginTop: 2 ,"& .Mui-disabled": {
    WebkitTextFillColor: "rgba(0,0,0,0.7)",
    color: "rgba(0,0,0,0.7)",
  },}}
                        error={!!PaymentMethodErrors[idx]?.is_primary}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={section?.mainData?.is_primary || false}
                              onChange={(e) => handleCheckboxChange(e, idx)}
                              name="is_primary"
                            />
                          }
                          label="Is Primary"
                        />

                        {PaymentMethodErrors[idx]?.is_primary && (
                          <FormHelperText>
                            {PaymentMethodErrors[idx]?.is_primary}
                          </FormHelperText>
                        )}
                      </FormControl>




<Box
  sx={{
    display: "flex",
    justifyContent: "center", 
    gap: 2,                 
    width: "100%",             
  }}
>



                      <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        label="Payment QR Code URL"
                        name="qr_code_url"
                        value={section?.mainData?.qr_code_url}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!PaymentMethodErrors?.[idx]?.qr_code_url}
                        helperText={PaymentMethodErrors?.[idx]?.qr_code_url}
                        placeholder="upi://pay?pa=abc@upi or https://paypal.me/user"
                        type="url"
                        inputProps={{ maxLength: 512 }}
                      />


                      <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        label="UPI ID"
                        name="upi_id"
                        value={section?.mainData?.upi_id}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!PaymentMethodErrors?.[idx]?.upi_id}
                        helperText={PaymentMethodErrors?.[idx]?.upi_id}
                        type="text" // should be text, not url
                        inputProps={{
                          maxLength: 50,
                          pattern: "^[\\w.-]{2,50}@[a-zA-Z]{2,50}$",
                        }} 
                      />


</Box>

                      
                      <TextField
                       disabled ={mode==="view"}
                        fullWidth
                        label="Remarks"
                        name="remarks"
                        multiline
                        rows={4}
                        value={section?.mainData?.remarks}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!PaymentMethodErrors?.[idx]?.remarks}
                        helperText={PaymentMethodErrors?.[idx]?.remarks}
                        inputProps={{ maxLength: 200 }}
                      

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
          style={{ marginTop: 9 }}
          variant="contained"
          onClick={() => {
            setExpanded(`PaymentMethod ${PaymentMethod?.length + 1}`);
            addPaymentMethod();
          }}
        >
          Add More
        </Button>
      </Box>
    </Box>
  );
}

export default EmployeeBankForm;
