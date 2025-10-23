import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Fade,
  TextField,
  Alert,
  Collapse
} from "@mui/material";

const generateCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let captcha = "";
  for (let i = 0; i < 5; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars?.length));
  }
  return captcha;
};

const CustomCaptcha = ({ onVerify }) => {
  const [captcha, setCaptcha] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(true);
  const canvasRef = useRef(null);

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "30px Verdana";
    ctx.fillStyle = "#333";
    ctx.setTransform(1, 0.1, -0.1, 1, 0, 0);
    ctx.fillText(text, 10, 30);
  };

  useEffect(() => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
    drawCaptcha(newCaptcha);
  }, []);

  const handleVerify = (e) => {
    e.preventDefault();

    if (userInput.trim().toLowerCase() === captcha.toLowerCase()) {
      setError("");
      setVerified(true);
      onVerify(true);
      setTimeout(() => {
        setShowCaptcha(false);
      }, 1500);
    } else {
      setError("Incorrect CAPTCHA. Please try again.");
      const newCaptcha = generateCaptcha();
      setCaptcha(newCaptcha);
      drawCaptcha(newCaptcha);
      setUserInput("");
      setVerified(false);
      onVerify(false);
    }
  };

  return (
    <Box mt={2}>
      <Collapse in={showCaptcha}>
        <Fade in={showCaptcha}>
          <Box>
            <canvas
              ref={canvasRef}
              width={150}
              height={50}
              style={{ border: "1px solid #ccc", borderRadius: "5px" }}
            />
            <Box display="flex" alignItems="center" mt={2} gap={1}>
              <TextField
                label="Enter CAPTCHA"
                variant="outlined"
                size="small"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleVerify}
              >
                Verify
              </Button>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Fade>
      </Collapse>

      {verified && !showCaptcha && (
        <Fade in={true}>
          <Alert severity="success" sx={{ mt: 2 }}>
            CAPTCHA verified successfully!
          </Alert>
        </Fade>
      )}
    </Box>
  );
};

export default CustomCaptcha;
