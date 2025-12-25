"use client";
import React, { useEffect, useState } from "react";
import "./IndexPageLayout.css";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CategoryIcon from "@mui/icons-material/Category";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import AddIcon from "@mui/icons-material/Add";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import PersonIcon from "@mui/icons-material/Person";
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
  createTheme,
  ThemeProvider,
  MenuItem,
  Tooltip,
  Avatar,
  Popover,
  useMediaQuery,
  CircularProgress,
  Paper,
} from "@mui/material";

import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Menu as MenuIcon,
  Lock as LockIcon,
  Edit as EditIcon,
  Dashboard as DashboardIcon,
  CorporateFare as CorporateFareIcon,
  Business as BusinessIcon,
  AddLocationAlt as AddLocationAltIcon,
  Settings as SettingsIcon,
  Store as StoreIcon,
  Segment as SegmentIcon,
  AppRegistration as AppRegistrationIcon,
  Apartment as ApartmentIcon,
  LocalPolice as LocalPoliceIcon,
  AccountCircleOutlined,
  PeopleAltOutlined,
} from "@mui/icons-material";

import Swal from "sweetalert2";
import axios from "axios";
import { MAIN_URL } from "../../Configurations/Urls";
import ExpandedSideOption from "./ExpandedSideOption";
import useEmployeeDataStore from "../../Zustand/Store/useEmployeeDataStore";
import { routes } from "../../Configurations/PermissionConfigrations";
import NotAllowed from "../../Exceptions/NotAllowed";
import usePermissionDataStore from "../../Zustand/Store/usePermissionDataStore";
import useInternDataStore from "../../Zustand/Store/useInternDataStore";
import SideBar from "../../Assets/Static/SideBar";

export default function RouteProtector({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(310);
  const [isResizing, setIsResizing] = useState(false);
  const { resetData } = useEmployeeDataStore();
  const { resetData: clearData } = useInternDataStore();
  const { Permission, isPermissionLoaded, setPermission } =
    usePermissionDataStore();

  const isMobile = useMediaQuery("(max-width:768px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const navigate = useNavigate();
  const location = useLocation();

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing && !isMobile) {
        const newWidth = Math.min(Math.max(e.clientX, 100), 500);
        setDrawerWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, isMobile]);

  const { logout, userData, setAccess, login } = useAuthStore();
  const access = userData?.role || "Admin";
  const [loadPermission, setLoadPermission] = useState(true);
  console.log("permission is ", Permission);

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

          await axios.get(`${MAIN_URL}/api/auth/logout`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

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

  const { isLoggedIn } = useAuthStore();
  const [OpenTCode, setOpenTCode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "/") {
        setOpenTCode(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [isAllowed, setisAllowed] = useState(true);

  useEffect(() => {
    const currentPath = location.pathname;
    localStorage.setItem("lastVisitedRoute", currentPath);

    if (currentPath && Permission?.length > 0) {
      // alert("gugug")

      const basePath = currentPath.includes("/edit")
        ? `${currentPath.split("/edit")[0]}/edit`
        : currentPath;

      const matchedRoute = routes.find((item) => item.name === basePath);
      console.log("match", matchedRoute);
      if (!matchedRoute) {
        //   alert("hjhhd")
        setisAllowed(true);
      } else if (
        matchedRoute.action &&
        Permission.includes(matchedRoute?.action)
      ) {
        // alert("jghughugd")

        console.log("basePath ", basePath);
        console.log("matchedRoute ", matchedRoute);

        setisAllowed(true);
      } else {
        //   alert("abcdre")
        setisAllowed(false);
      }
      console.log("Matched route is", matchedRoute);
    }
  }, [location, Permission]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const lastVisitedRoute = localStorage.getItem("lastVisitedRoute");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${MAIN_URL}/api/auth/token-login`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { user } = response.data;

        setAccess(user?.role?.system_role_name);
        login(user);

        const dd = user.organization.find(
          (item) =>
            item.organization_id ==
            user.user_active_organization.organization_id
        );

        const mm = {
          ...user,
          organization: dd,
        };
        login(mm);
      })
      .catch((error) => {
        navigate("/login");
      });
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    if (
      currentPath === "/organization/employee/employee-details/add" ||
      currentPath === "/organization/employee/employee-details"
    ) {
      resetData();
    }
  }, [location.pathname]);

  useEffect(() => {
    const currentPath = location.pathname;
    if (
      currentPath === "/organization/intern/intern-details/add" ||
      currentPath === "/organization/intern/intern-details"
    ) {
      clearData();
    }
  }, [location.pathname]);

  // useEffect(() => {
  //   const checkPermission = async () => {
  //     setLoadPermission(true);

  //     try {
  //       const res = await axios.get(
  //         `${MAIN_URL}/api/user/${userData?.metadata?.[0]?.organization_user_id}/has-access`
  //       );

  //       const allowed = res?.data?.allowed_actions || [];
  //       setPermission(allowed);

  //       // Redirect immediately if no permission
  //       if (allowed.length === 0) {
  //         return navigate("/not-authorised");
  //       }
  //     } catch (error) {
  //       console.error("Permission check error:", error);
  //     } finally {
  //       setLoadPermission(false);
  //     }
  //   };

  //   if (userData?.metadata?.[0]?.organization_user_id) {
  //     checkPermission();
  //   }
  // }, [userData?.metadata?.[0]?.organization_user_id]);


  useEffect(() => {
  const checkPermission = async () => {
    setLoadPermission(true);

    try {
      const res = await axios.get(
        `${MAIN_URL}/api/user/${userData?.metadata?.[0]?.organization_user_id}/check-permission-access`
      );

      const allowed = res?.data?.allowed_actions || [];
      setPermission(allowed);

      // Optional: Log for debugging
      console.log('User Permissions:', allowed);
      console.log('Organization ID:', res?.data?.organization_id);
      console.log('Application User ID:', res?.data?.application_user_id);

      // Redirect immediately if no permission
      if (allowed.length === 0) {
        return navigate("/not-authorised");
      }
    } catch (error) {
      console.error("Permission check error:", error);
      
      // Optional: Handle 404 or other errors
      if (error.response?.status === 404) {
        navigate("/not-authorised");
      }
    } finally {
      setLoadPermission(false);
    }
  };

  if (userData?.metadata?.[0]?.organization_user_id) {
    checkPermission();
  }
}, [userData?.metadata?.[0]?.organization_user_id]);

  

  // 🚫 Block component rendering until permission check finishes
  if (loadPermission) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            minWidth: 260,
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Checking Permissions…
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Please wait while we verify your access.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // 🔐 Route-based Access Control

  const currentPath = location.pathname;
  //console.log("current path is sikjs", currentPath);

  // Protect Employees Page from Admins
  if (access === "Admin" && currentPath === "/sidebar-option-page-1") {
    return <Navigate to="/" replace />;
  }

  // Protect Admin-only page from Users
  if (!isAllowed) {
    return <NotAllowed />;
  }


  console.log("axcess", access);
  console.log("userdata", userData);

  const renderSidebarContent = () => <SideBar Permission={Permission} />;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <CssBaseline />
        <AppBar
          position="static"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 4 }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minHeight: { xs: 56, sm: 64 },
              px: { xs: 1, sm: 2 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
              <IconButton
                color="inherit"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{ mr: { xs: 1, sm: 2 } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                HR ERP
              </Typography>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", lg: "flex" },
                justifyContent: "flex-start",
                marginLeft: "200px",
                minWidth: 0,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  textTransform: "capitalize",
                  fontSize: { lg: "1.1rem" },
                  cursor: "pointer",
                  // "&:hover": { textDecoration: "underline" },
                }}
                noWrap
                onClick={() => navigate("/organization/details")}
              >
                {userData?.organization?.organization_name}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
                minWidth: 0,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  textTransform: "capitalize",
                  display: { xs: "none", lg: "block" },
                  fontSize: { lg: "1rem" },
                }}
                noWrap
              >
                {userData?.full_name}
              </Typography>

              <IconButton
                color="inherit"
                onClick={() => setDarkMode(!darkMode)}
                size="small"
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>

              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Popover
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: { mt: 1, p: 1, width: 310 } }}
              >
                <List disablePadding>
                  {access.system_role_name === "Admin" && (
                    <MenuItem onClick={() => navigate("/my-profile")}>
                      Profile
                    </MenuItem>
                  )}

                  <>
                  {Permission && Permission.includes("USER_RESET_PASSWORD") && (
                    <MenuItem
                      onClick={() => navigate("/settings/change-password")}
                    >
                      Change Password
                    </MenuItem>
                  )}
                  </>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </List>
              </Popover>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {isMobile ? (
            <>
              <Drawer
                variant="persistent"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{
                  display: { xs: "block", md: "none" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: "280px",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : "#fff",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: 1,
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.12)"
                        : "rgba(0, 0, 0, 0.12)",
                    minHeight: 64,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    HR ERP
                  </Typography>
                  <IconButton
                    onClick={() => setMobileOpen(false)}
                    sx={{ color: "text.primary" }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
                {renderSidebarContent()}
              </Drawer>
              {mobileOpen && (
                <Box
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    zIndex: theme.zIndex.drawer - 1,
                    cursor: "pointer",
                  }}
                />
              )}
            </>
          ) : (
            <Drawer
              variant="permanent"
              sx={{
                width: collapsed ? 0 : drawerWidth,
                flexShrink: 0,
                whiteSpace: "nowrap",
                transition: "width 0.3s",
                [`& .MuiDrawer-paper`]: {
                  width: collapsed ? 0 : drawerWidth,
                  transition: "width 0.3s",
                  overflowX: "hidden",
                  overflowY: "auto",
                  boxSizing: "border-box",
                  position: "relative",
                },
              }}
            >
              {!collapsed && (
                <>
                  {renderSidebarContent()}
                  <Box
                    onMouseDown={() => setIsResizing(true)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "5px",
                      height: "100%",
                      cursor: "col-resize",
                      zIndex: 999,
                    }}
                  />
                </>
              )}
            </Drawer>
          )}

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              transition: "margin-left 0.3s, width 0.3s",
              overflowY: "auto",
              p: { xs: 1, sm: 2 },
              ...(isMobile &&
                mobileOpen && {
                  marginLeft: "280px",
                  width: "calc(100% - 280px)",
                }),
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
