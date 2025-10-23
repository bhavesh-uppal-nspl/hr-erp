import React, { useEffect, useState } from "react";
import "./IndexPageLayout.css";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import BusinessIcon from "@mui/icons-material/Business";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  useTheme,
  createTheme,
  ThemeProvider,
  MenuItem,
  Menu,
  Tooltip,
  Avatar,
  Badge,
  Popover,
  Collapse,
} from "@mui/material";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import EngineeringIcon from "@mui/icons-material/Engineering";
import StoreIcon from "@mui/icons-material/Store";
import SegmentIcon from "@mui/icons-material/Segment";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ApartmentIcon from "@mui/icons-material/Apartment";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import DashboardIcon from "@mui/icons-material/Dashboard";
import { AccountCircleOutlined, PeopleAltOutlined } from "@mui/icons-material";
import Swal from "sweetalert2";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import axios from "axios";
import { MAIN_URL } from "../../Configurations/Urls";
import ExpandedSideOption from "./ExpandedSideOption";
import ExpandTopBarDropOption from "./ExpandTopBarDropOption";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";

const drawerWidth = 250;

export default function RouteProtector({ children }) {
  const [darkMode, setDarkMode] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  let navigate = useNavigate();
  let location = useLocation();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElSubmenu, setAnchorElSubmenu] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setAnchorElSubmenu(null);
  };

  const { logout, userData, setAccess, login } = useAuthStore();

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
          const token = localStorage.getItem("token");

          // ✔ Call the backend logout API
          await axios.get(`${MAIN_URL}/api/auth/logout`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // ✔ Clear token and Zustand store
          logout();
          localStorage.removeItem("token");

          Swal.fire("Logged out!", "You have been logged out.", "success");
          navigate("/login");
        } catch (error) {
          console.error("Logout failed:", error);
          Swal.fire("Error", "Logout failed. Please try again.", "error");
        }
      }
    });
  };

  let [OpenTCode, setOpenTCode] = useState(false);

  const { isLoggedIn, access } = useAuthStore(); // ✔ Just one flag

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "/" && access == "Admin") {
        setOpenTCode(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
   
      navigate("/login");
      return;
    }

    axios
      .get("${MAIN_URL}/api/auth/token-login", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const { user } = response.data;

        setAccess(user?.role?.system_role_name);
        login(user);

        navigate("/");
      })
      .catch((error) => {
      
        navigate("/login");
      });
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Route-based Access Control
  const currentPath = location.pathname;

  // Protect Employees Page from Admins
  if (access === "Admin" && currentPath === "/sidebar-option-page-1") {
    return <Navigate to="/" replace />;
  }

  // Protect Admin-only page from Users
  if (access === "User" && currentPath === "/Admin-only-route") {
    return <Navigate to="/" replace />;
  }

  // ✔ Sidebar Setup
  let sidebarOptions =  [
      { kind: "header", title: "Features" },
      {
        heading: "Dashboard",
        route: "/",
        title: "Dashboard",
        icon: <DashboardIcon />,
      },
      {
        heading: "Users",
        route: "/users",
        title: "Users",
        icon: <PeopleAltOutlined />,
      },

      { kind: "divider" },
      {
        heading: "Organization",
        title: "Organization",
        icon: <CorporateFareIcon />,
        children: [
          {
            route: "/organization/data",
            title: "Orgnaization",
            icon: <CorporateFareIcon />,
          },
          {
            route: "/organization/profile",
            title: "Profile",
            icon: <AccountCircleOutlined />,
          },
          {
            route: "/organization/location",
            title: "Locations",
            icon: <AddLocationAltIcon />,
          },
        ],
      },
      {
        heading: "Business",
        title: "Business",
        icon: <BusinessIcon />,
        children: [
          {
            route: "/business/division",
            title: "Division",
            icon: <SegmentIcon />,
          },
          {
            route: "/business/registrations",
            title: "Registration",
            icon: <AppRegistrationIcon />,
          },
          {
            route: "/business/unit",
            title: "Unit",
            icon: <ApartmentIcon />,
          },
        ],
      },
      {
        heading: "Departments",
        title: "Departments",
        icon: <StoreIcon />,
        children: [
          {
            route: "/departments",
            title: "Departments",
            icon: <StoreIcon />,
          },
          {
            route: "/departments/locations",
            title: "Locations",
            icon: <AddLocationAltIcon />,
          },
          {
            route: "/departments/designation",
            title: "Designations",
            icon: <LocalPoliceIcon />,
          },
        ],
      },
      {
        heading: "Employement",
        title: "Employement",
        icon: <EngineeringIcon />,
        children: [
          {
            route: "/employement/types",
            title: "Types",
            icon: <FormatAlignJustifyIcon />,
          },
          {
            route: "/employement/status",
            title: "Statuses",
            icon: <AutorenewIcon />,
          },
          {
            route: "/employement/exit-reasons",
            title: "Exit Reasons",
            icon: <ExitToAppIcon />,
          },
        ],
      },

      {
        heading: "Employee Residence",
        title: "Employee Residence",
        icon: <EngineeringIcon />,
        children: [
          {
            route: "/employee/address",
            title: "Address Types",
            icon: <FormatAlignJustifyIcon />,
          },
          {
            route: "/employee/residential-ownership-types",
            title: "Residential Ownership Type",
            icon: <AutorenewIcon />,
          },
        ],
      },
      {
        heading: "Settings",
        title: "Settings",
        icon: <SettingsIcon />,
        children: [
          {
            route: "/settings/change-password",
            title: "Change Password",
            icon: <LockIcon />,
          },
          {
            route: "/settings/update-credentials",
            title: "Update Credentials",
            icon: <EditIcon />,
          },
        ],
      },
      {
        heading: "Logout",
        route: "/logout",
        title: "Logout",
        icon: <LogoutIcon />,
      },
    ];
  

  console.log("access is : ", access);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <CssBaseline />
          <AppBar position="fixed" sx={{ zIndex: 1201 }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  color="inherit"
                  onClick={() => setCollapsed(!collapsed)}
                  edge="start"
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap sx={{ ml: 1 }}>
                  HR ERP
                </Typography>
              </Box>

              <Box
                sx={{
                  flexGrow: 0,
                  gap: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ textTransform: "capitalize", ml: 1 }}
                  noWrap
                >
                  Welcome - {userData?.user_name}
                </Typography>

                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <Badge badgeContent={4} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  color="inherit"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                {/* Main Popover */}
                <Popover
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    sx: { mt: 1, p: 1, width: 250 },
                  }}
                >
                  <List disablePadding>
                    {access == "Admin" && (
                      <ExpandTopBarDropOption
                        handleCloseUserMenu={handleCloseUserMenu}
                        name={"Organization"}
                        list={[
                          {
                            name: "Organization",
                            url: "/organization/data",
                          },
                          {
                            name: "Profile",
                            url: "/organization/profile",
                          },
                        ]}
                      />
                    )}

                    <ExpandTopBarDropOption
                      handleCloseUserMenu={handleCloseUserMenu}
                      name={"Settings"}
                      list={[
                        {
                          name: "Change Password",
                          url: "/settings/change-password",
                        },
                        access == "Admin" && {
                          name: "Update Credentials",
                          url: "/settings/update-credentials",
                        },
                      ]}
                    />

                    {/* Logout */}
                    <MenuItem
                      onClick={() => {
                        console.log("Logging out...");
                        handleLogout();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </List>
                </Popover>
              </Box>
            </Toolbar>
          </AppBar>

          <Drawer
            variant="permanent"
            sx={{
              width: collapsed ? 75 : drawerWidth,
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "width 0.3s",
              [`& .MuiDrawer-paper`]: {
                width: collapsed ? 75 : drawerWidth,
                transition: "width 0.3s",
                overflowX: "hidden",
                boxSizing: "border-box",
              },
            }}
          >
            <Toolbar />
            <Box sx={{ pt: 2 }}>
              <List>
                {sidebarOptions?.map((item, index) => {
                  if (item.kind === "divider")
                    return <Divider key={index} sx={{ my: 1 }} />;
                  if (item.kind === "header")
                    return (
                      !collapsed && (
                        <Typography
                          key={index}
                          variant="subtitle2"
                          sx={{
                            pl: 2,
                            pt: 1.5,
                            pb: 0.5,
                            color: "text.secondary",
                          }}
                        >
                          {item.title}
                        </Typography>
                      )
                    );

                  // Handle the "Settings" item and its children
                  if (item.children) {
                    return (
                      <ExpandedSideOption collapsed={collapsed} item={item} />
                    );
                  }

                  // Regular List Item rendering for other items
                  return (
                    <ListItem
                      onClick={() => {
                        item.title === "Logout"
                          ? handleLogout()
                          : navigate(item.route);
                      }}
                      button
                      key={item.heading}
                      sx={{ py: 1, minWidth: "40px" }}
                    >
                      {item.icon && (
                        <ListItemIcon sx={{ minWidth: "35px" }}>
                          {item.icon}
                        </ListItemIcon>
                      )}
                      {!collapsed && <ListItemText primary={item.title} />}
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Drawer>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "background.default",
              transition: "margin-left 0.3s",
            }}
          >
            <Toolbar />
            {children}
            {/* <Footer /> */}
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
