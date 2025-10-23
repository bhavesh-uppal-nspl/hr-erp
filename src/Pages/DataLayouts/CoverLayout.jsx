// src/Pages/Orgnaization/Location/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";

function CoverLayout() {
  return (
     <Box>
      <Outlet />
    </Box>
  )
}

export default CoverLayout