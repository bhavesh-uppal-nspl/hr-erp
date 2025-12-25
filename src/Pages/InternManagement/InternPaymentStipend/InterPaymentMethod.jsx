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

function InterPaymentMethod({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const {
    setPaymentMethodData,
    PaymentMethod,
    PaymentMethodErrors,
    addPaymentMethod,
    removePaymentMethod,
  } = useInternDataStore();

  const [expanded, setExpanded] = useState("PaymentMethod 1");

  const handleChangeAccoridan = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : "");
  };

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
                          justifyContent: "center", // centers the row
                          gap: 2, // space between fields
                          width: "100%", // ensures proper centering
                        }}
                      >
                        <TextField
                          fullWidth
                          label="A/C Holder Name"
                            disabled={mode ==="view"}
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

                        <TextField
                          fullWidth
                          label="Bank Name"
                            disabled={mode ==="view"}
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

                        <TextField
                          fullWidth
                          label="Branch Name"
                            disabled={mode ==="view"}
                          name="branch_name"
                          value={section?.mainData?.branch_name}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(
                              /[^a-zA-Z0-9&.\- ]/g,
                              ""
                            );
                            handleChange(
                              {
                                target: {
                                  name: "branch_name",
                                  value: cleaned,
                                },
                              },
                              idx
                            );
                          }}
                          error={!!PaymentMethodErrors?.[idx]?.branch_name}
                          helperText={PaymentMethodErrors?.[idx]?.branch_name}
                          inputProps={{
                            style: { textTransform: "uppercase" },
                            maxLength: 100,
                          }}
                          required
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="A/C Number"
                          disabled={mode ==="view"}
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
                          label="IFSC Code"
                            disabled={mode ==="view"}
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

                        <TextField
                          fullWidth
                          label="SWIFT Code"
                            disabled={mode ==="view"}
                          name="swift_code"
                          value={section?.mainData?.swift_code}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!PaymentMethodErrors?.[idx]?.swift_code}
                          helperText={PaymentMethodErrors?.[idx]?.swift_code}
                          inputProps={{
                            style: { textTransform: "uppercase" }, // visually show uppercase
                            maxLength: 11, // IFSC codes are exactly 11 characters
                          }}
                        />

                        <TextField
                          fullWidth
                          label="IBAN Number"
                            disabled={mode ==="view"}
                          name="iban_number"
                          value={section?.mainData?.iban_number}
                          onChange={(e) => handleChange(e, idx)}
                          error={!!PaymentMethodErrors?.[idx]?.iban_number}
                          helperText={PaymentMethodErrors?.[idx]?.iban_number}
                          inputProps={{
                            style: { textTransform: "uppercase" }, // visually show uppercase
                            maxLength: 11, // IFSC codes are exactly 11 characters
                          }}
                        />
                      </Box>

                      {/* <FormControl
                        component="fieldset"
                        sx={{ marginTop: 2 }}
                        error={!!PaymentMethodErrors[idx]?.is_primary}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={section?.mainData?.is_primary}
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
                      </FormControl> */}

                      {(idx === 0 || idx === 1) && (
                        <FormControl
                          component="fieldset"
                          sx={{ marginTop: 2 }}
                          error={!!PaymentMethodErrors[idx]?.is_primary}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled={mode ==="view"}
                                checked={section?.mainData?.is_primary ?? false} // default to false
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
                      )}


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
                        label="UPI ID"
                          disabled={mode ==="view"}
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

                      <TextField
                        fullWidth
                        label="Wallet ID"
                          disabled={mode ==="view"}
                        name="wallet_id"
                        value={section?.mainData?.wallet_id}
                        onChange={(e) => handleChange(e, idx)}
                        error={!!PaymentMethodErrors?.[idx]?.wallet_id}
                        helperText={PaymentMethodErrors?.[idx]?.wallet_id}
                        type="text"
                        inputProps={{
                          maxLength: 30,
                          pattern: "^[A-Za-z0-9_-]{6,30}$",
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
          style={{ marginTop: 9 }}
          variant="contained"
            disabled={mode ==="view"}
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

export default InterPaymentMethod;
