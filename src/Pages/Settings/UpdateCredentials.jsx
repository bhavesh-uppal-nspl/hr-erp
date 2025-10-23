import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import {  MAIN_URL } from "../../Configurations/Urls";

const steps = ["Enter Value", "Verify OTP", "Finish Update"];

function UpdateCredentials() {
  const [activeStep, setActiveStep] = useState(0);
  const [updateType, setUpdateType] = useState(null); // 'email' or 'contact'
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formError, setFormError] = useState("");

  const handleClick = (type) => {
    setUpdateType(type);
    setActiveStep(0);
    setValue("");
    setOtp("");
    setError("");
    setOtpSent(false);

  };

  const handleSendOtp = async () => {
  setFormError("");
  if (updateType === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setFormError("Enter a valid email address.");
      return;
    }
  } else if (updateType === "contact") {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(value)) {
      setFormError("Enter a valid 10-digit phone number.");
      return;
    }
  }

  setBtnLoading(true);

  try {
    const response = await axios.post(`${MAIN_URL}/api/auth/send-otp`, { email: value });
    toast.success(response.data.message || "OTP sent successfully!");
    setOtpSent(true);
    setActiveStep(1);
  } catch (error) {
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      setFormError(errors?.email?.[0] || "Invalid input.");
    } else if (error.response?.status === 404) {
      setFormError(error.response.data.error || "Email not found.");
    } else {
      setFormError("Something went wrong. Please try again.");
    }
  } finally {
    setBtnLoading(false);
  }
};


  const handleVerifyOtp = async() => {
    
    setError("");
    setBtnLoading(true)
  
    try {
    const response = await axios.post(`${MAIN_URL}api/auth/verified-otp`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}, {
      email: value,  
      otp: +otp 
    });



    console.log(response)
    // If backend returns success
    toast.success(`${updateType === "email" ? "Email" : "Contact"} verified!`);
    setActiveStep(2);

  } catch (error) {
    console.log(error);
    if (error.response?.data?.message) {
      setError(error.response.data.message);
    } else if (error.response?.data?.errors?.otp) {
      setError(error.response.data.errors.otp[0]);
    } else {
      setError("Something went wrong");
    }
  } finally {
    setBtnLoading(false);
  }
  };

  const handleUpdate = () => {
    setBtnLoading(true);
    setTimeout(() => {
      toast.success(`${updateType === "email" ? "Email" : "Contact"} updated successfully!`);
      // Reset
      setUpdateType(null);
      setActiveStep(0);
      setValue("");
      setOtp("");
      setOtpSent(false);
      setBtnLoading(false);
    }, 1000);
  };

  return (
    <Box px={2} py={4} height={"100vh"}>
      <Typography variant="h5" mb={3} fontWeight="bold">
        Update Credentials
      </Typography>

      {!updateType ? (
        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={() => handleClick("email")}>
            Update Email
          </Button>
          <Button variant="contained" onClick={() => handleClick("contact")}>
            Update Contact
          </Button>
        </Box>
      ) : (
        <>
          <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 2, maxWidth: 500 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Paper elevation={3} sx={{ p: 3, maxWidth: 600 }}>
            {activeStep === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label={updateType === "email" ? "New Email" : "New Contact"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  error={!!formError}
                  helperText={formError}
                />
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleSendOtp}
                  disabled={btnLoading || !value}
                >
                  {btnLoading ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <TextField
                  fullWidth
                  label="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleVerifyOtp}
                  disabled={!otp || btnLoading}
                >
                  {btnLoading ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="body1" mb={2}>
                  Click below to confirm update of your {updateType}.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  disabled={btnLoading}
                >
                  {btnLoading ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : (
                    `Update ${updateType === "email" ? "Email" : "Contact"}`
                  )}
                </Button>
              </Box>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}

export default UpdateCredentials;
