"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import useAuthStore from "../../Zustand/Store/useAuthStore"
import Companylogo from "../../Assets/Images/logo.png"
import { MAIN_URL } from "../../Configurations/Urls"
import axios from "axios"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material"

function TopNavbar({ toggleSidebar }) {
  const { logout, userName } = useAuthStore()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token")

          await axios.get(`${MAIN_URL}/api/auth/logout`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          logout()
          localStorage.removeItem("token")

          Swal.fire("Logged out!", "You have been logged out.", "success")
          navigate("/login")
        } catch (error) {
          console.error("Logout failed:", error)
          Swal.fire("Error", "Logout failed. Please try again.", "error")
        }
      }
    })
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleThemeToggle = () => {
    // Add your theme toggle logic here
    console.log("Theme toggle clicked")
  }

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: theme.palette.mode === "dark" ? "background.paper" : "primary.main",
        boxShadow: 1,
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 1, sm: 2 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}>
          <IconButton color="inherit" onClick={toggleSidebar} sx={{ mr: { xs: 0.5, sm: 1 } }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={Companylogo || "/placeholder.svg"}
              alt="Company Logo"
              style={{
                height: isMobile ? "24px" : "32px",
                marginRight: isMobile ? "4px" : "8px",
              }}
            />
            <Typography
              variant="h6"
              color="inherit"
              sx={{
                fontWeight: 100, // Reduced font weight from 600 to 400 for lighter appearance
                fontSize: { xs: "1rem", sm: "1.25rem" },
                whiteSpace: "nowrap",
              }}
            >
              HR ERP
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1, md: 2 },
            flex: "0 0 auto",
            minWidth: 0,
          }}
        >
          <Typography
            variant="body1"
            color="inherit"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: { sm: "150px", md: "none" },
              display: { xs: "none", md: "block" }, // Hide on mobile and tablet, show only on desktop
            }}
          >
            Welcome - {userName || "Guest"}
          </Typography>

          <IconButton
            color="inherit"
            sx={{
              p: { xs: 0.5, sm: 1 },
              display: { xs: "none", md: "flex" }, // Hide on mobile and tablet, show on desktop
            }}
          >
            <NotificationsIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>

          <IconButton
            color="inherit"
            onClick={handleThemeToggle}
            sx={{
              p: { xs: 0.5, sm: 1 },
            }}
          >
            {theme.palette.mode === "dark" ? (
              <LightModeIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            )}
          </IconButton>

          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            sx={{
              p: { xs: 0.5, sm: 1 },
            }}
          >
            <Avatar
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
              }}
            >
              <PersonIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              "& .MuiPaper-root": {
                maxWidth: "90vw",
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose()
                handleLogout()
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopNavbar
