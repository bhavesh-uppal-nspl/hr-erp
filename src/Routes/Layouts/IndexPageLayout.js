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

export default function RouteProtector({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(290);
  const [isResizing, setIsResizing] = useState(false);
  const { resetData } = useEmployeeDataStore();
  const {resetData:clearData } =useInternDataStore();
  const { Permission, setPermission } = usePermissionDataStore();

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
        const newWidth = Math.min(Math.max(e.clientX, 75), 400);
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

  const gfbfg = location.pathname;
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



  useEffect(() => {
    const checkPermission = async () => {
      try {
        const res = await axios.get(
          `${MAIN_URL}/api/user/${userData?.metadata[0]?.organization_user_id}/has-access`
        );
        console.log("repon", res);
        setPermission(res?.data?.allowed_actions);
      } catch (error) {
        console.error("Permission check error:", error);
      }
    };
    checkPermission();
  }, [userData?.metadata?.[0]?.organization_user_id]);

  // 🔐 Route-based Access Control
  const currentPath = location.pathname;
  console.log("current path is sikjs", currentPath);

  // Protect Employees Page from Admins
  if (access === "Admin" && currentPath === "/sidebar-option-page-1") {
    return <Navigate to="/" replace />;
  }

  // Protect Admin-only page from Users
  if (!isAllowed) {
    return <NotAllowed />;
  }

  const handleNavigation = (route) => {
    navigate(route);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const sidebarOptions = [
    { kind: "header", title: "" },
    {
      heading: "Dashboard",
      route: "/",
      title: "Dashboard",
      icon: <DashboardIcon />,
    },
    // {
    //   heading: "Users",
    //   route: "/users",
    //   title: "Users",
    //   icon: <PeopleAltOutlined />,
    // },
    { kind: "divider" },

    {
      heading: "Employee Management",
      title: "Employee Management",
      icon: <SettingsIcon />,
      children: [
        {
          route: "/organization/employee/employee-details",
          title: "Employees",
          icon: <LockIcon />,
        },

        {
          route: "/organization/employee/employee-exits",
          title: "Employee Exits",
          icon: <LockIcon />,
        },
        {
          route: "/organization/employee/records",
          title: "Employment Records",
          icon: <LockIcon />,
        },
         {
          route: "/organization/employee/functional-role",
          title: "Employee Functional Roles",
          icon: <PeopleAltOutlined />,
        },
         {
          route: "/employment/employee-stages",
          title: "Employment Stages",
          icon: <PeopleAltOutlined />,
        },
       
      ],
    },

    {
      heading: "Payroll Management",
      title: "Payroll Management",
      icon: <SettingsIcon />,
      children: [
        {
          route: "/payroll/cycles",
          title: "Payroll Cycles",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/component-types",
          title: "Payroll Component Types",
          icon: <LockIcon />,
        },

        {
          route: "/payroll/components",
          title: "Payroll Components",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/component-slabs",
          title: "Payroll Component Slabs",
          icon: <LockIcon />,
        },

        {
          route: "/payroll/employee-salary-structure",
          title: "Payroll Salary Structures",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/salary-structure/components",
          title: "Payroll Salary Structure Components",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/advance",
          title: "Payroll Advances",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/loan-types",
          title: "Payroll Loan Types",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/loans",
          title: "Payroll Loans",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/loan-transactions",
          title: "Payroll Loan Transactions",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/securities",
          title: "Payroll Securities",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/securities-transactions",
          title: "Payroll Securities Transactions",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/periods",
          title: "Payroll Periods",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/runs",
          title: "Payroll Runs",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/employee-runs",
          title: "Payroll Employee Runs",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/employee-run/components",
          title: "Payroll Employee Run Components",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/reimbursements",
          title: "Payroll Reimbursements",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/reimbursement-types",
          title: "Payroll Reimbursement Types",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/adjustment-types",
          title: "Payroll Adjustment Types",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/adjustments",
          title: "Payroll Adjustments",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/journal-entries",
          title: "Payroll Journal Entries",
          icon: <LockIcon />,
        },
        {
          route: "/payroll/account-mapping",
          title: "Payroll Account Mappings",
          icon: <LockIcon />,
        },

        {
          route: "/payroll/payslips",
          title: "Payslips",
          icon: <LockIcon />,
        },
        {
          route: "/payslips/payments",
          title: "Payslip Payments",
          icon: <LockIcon />,
        },
        {
          route: "/payslips/components",
          title: "Payslip Components",
          icon: <LockIcon />,
        },
      ],
    },

    {
      heading: "Document Records",
      title: "Document Records",
      icon: <SettingsIcon />,
      children: [
        {
          route: "/employee/document/types",
          title: "Document Types",
          icon: <EditIcon />,
        },
           {
          route: "/employee/documents",
          title: "Documents",
          icon: <EditIcon />,
        },
        // {
        //   route: "/employee/document/links",
        //   title: "Links",
        //   icon: <EditIcon />,
        // },
     
      ],
    },

    {
      heading: "Time & Attendance",
      title: "Time & Attendance",
      icon: <SettingsIcon />,
      children: [
        {
          route: "/organization/work-shift",
          title: "WorkShifts",
          icon: <CalendarMonthIcon />,
        },

        {
          route: "/organization/work-shift-assignment",
          title: "Employee Shift Assignments",
          icon: <CalendarMonthIcon />,
        },

        {
          route: "/organization/work-shift-rotation-pattern",
          title: "Employee Shift Rotation Patterns",
          icon: <CalendarMonthIcon />,
        },
        {
          route: "/organization/work-shift-rotation-days",
          title: "Employee Shift Rotation Days",
          icon: <CalendarMonthIcon />,
        },
        {
          route: "/organization/work-shift-rotation-assignment",
          title: "Employee Shift Rotation Assignments",
          icon: <CalendarMonthIcon />,
        },

        // {
        //   route: "/organization/attendance-kiosk",
        //   title: "Attendance Kiosk",
        //   icon: <CalendarMonthIcon />,
        // },

        {
          route: "/attendance/time-logs",
          title: "Attendance Time Logs",
          icon: <EditIcon />,
        },

        {
          route: "/attendance/employee-record",
          title: "Attendance Records",
          icon: <EditIcon />,
        },

        {
          route: "/attendance/employee-record-without-break",
          title: "Attendance Report Daily",
          icon: <EditIcon />,
        },
      ],
    },

    // {
    //   heading: "Attendance Records",
    //   title: "Attendance Records",
    //   icon: <SettingsIcon />,
    //   children: [

    //     // {
    //     //   route: "/attendance/deviation-reason-type",
    //     //   title: "Deviation Reason Types",
    //     //   icon: <EditIcon />,
    //     // },

    //     //   {
    //     //   route: "/attendance/deviation-records",
    //     //   title: "Attendance Deviation Records",
    //     //   icon: <EditIcon />,
    //     // },
    //   ],
    // },

    {
      heading: "Leave Management",
      title: "Leave Management",
      icon: <SettingsIcon />,
      children: [
        {
          route: "/leave/holiday-calendar",
          title: "Holiday Calendar",
          icon: <CalendarMonthIcon />,
        },
        {
          route: "/leave/employee-leaves",
          title: "Employee Leaves",
          icon: <EditIcon />,
        },
        {
          route: "/leave/employee-entitlements",
          title: "Employee Entitlements",
          icon: <EditIcon />,
        },

        {
          route: "/employee-leave-summary",
          title: "Leave Summaries",
          icon: <EditIcon />,
        },

        {
          route: "/employee-leave-balance-report",
          title: "Leave Balance Report",
          icon: <EditIcon />,
        },
      ],
    },
    {
      heading: "Salary Updates",
      title: "Salary Updates",
      icon: <BusinessIcon />,
      children: [
        {
          heading: "Increment Types",
          route: "/employee/increment-types",
          title: "Increment Types",
          icon: <PeopleAltOutlined />,
        },
        {
          route: "/employee/increment",
          title: "Increments",
          icon: <ApartmentIcon />,
        },
      ],
    },

    {
      heading: "Organization SetUp",
      title: "Organization SetUp",
      icon: <CorporateFareIcon />,
      children: [
        // {
        //   route: "/organization/data",
        //   title: "Organization",
        //   icon: <CorporateFareIcon />,
        // },
        {
          route: "/organization/details",
          title: "Organizations",
          icon: <CorporateFareIcon />,
        },
        {
          route: "/organization/profile",
          title: "Organization Profile",
          icon: <AccountCircleOutlined />,
        },
        {
          route: "/organization/departments",
          title: "Departments",
          icon: <StoreIcon />,
        },
        {
          route: "/organization/location",
          title: "Locations",
          icon: <AddLocationAltIcon />,
        },

        {
          route: "/organization/units",
          title: "Organization Units",
          icon: <AddLocationAltIcon />,
        },
        {
          route: "/organization/designation",
          title: "Designations",
          icon: <LocalPoliceIcon />,
        },
        {
          route: "/organization/registrations",
          title: "Registration",
          icon: <AppRegistrationIcon />,
        },
        {
          route: "/attendance/status-type",
          title: "Attendance Status Types",
          icon: <EditIcon />,
        },
        {
          route: "/attendance/deviation-reason",
          title: "Attendance Deviation Reasons",
          icon: <EditIcon />,
        },
        {
          route: "/attendance/break-type",
          title: "Attendance Break Types",
          icon: <EditIcon />,
        },
        {
          route: "/attendance/source",
          title: "Attendance Sources",
          icon: <EditIcon />,
        },

        {
          route: "/organization/attendance-break",
          title: "Attendance Breaks",
          icon: <AppRegistrationIcon />,
        },
        {
          route: "/organization/workshift-break",
          title: "Workshift Breaks",
          icon: <AppRegistrationIcon />,
        },
        {
          route: "/organization/leave-policy",
          title: "Leave Policies",
          icon: <AppRegistrationIcon />,
        },
        {
          route: "/organization/functional-roles",
          title: "Organization Functional Roles",
          icon: <PeopleAltOutlined />,
        },
        {
          route: "/organization/functional-role-specialization",
          title: "Functional Role Specializations",
          icon: <PeopleAltOutlined />,
        },
      ],
    },
  
    {
      heading: "Organization Configuration",
      title: "Organization Configuration",
      icon: <BusinessIcon />,
      children: [
        {
          route: "/organization-configration/business-ownership-type",
          title: "Business Ownership Types",
          icon: <SegmentIcon />,
        },
        {
          route: "/organization-configration/business-registration-type",
          title: "Business Registration Types",
          icon: <ApartmentIcon />,
        },
        {
          route: "/organization-configration/unit-types",
          title: "Business Unit Types",
          icon: <SegmentIcon />,
        },
        {
          route: "/organization-configration/residential-ownership-type",
          title: "Residential Ownership Types",
          icon: <SegmentIcon />,
        },
        {
          route: "/organization-configration/location-ownership-type",
          title: "Location Ownership Types",
          icon: <SegmentIcon />,
        },
        {
          route: "/organization-configration/employee-address-types",
          title: "Address Types",
          icon: <SegmentIcon />,
        },
        {
          route: "/organization-configration/employee-status",
          title: "Employment Statuses",
          icon: <SegmentIcon />,
        },
        {
          route: "/organization-configration/employement-type",
          title: "Employment Types",
          icon: <SegmentIcon />,
        },
        {
          route: "/organization-configration/employement-exit-reason-type",
          title: "Exit Reason Types",
          icon: <SegmentIcon />,
        },

        {
          route: "/organization-configration/employement-exit-reason",
          title: "Exit Reason",
          icon: <SegmentIcon />,
        },
        {
          route: "/organization-configration/holiday-types",
          title: "Holiday Types",
          icon: <SegmentIcon />,
        },
        {
          route: "/organization-configration/leave-category",
          title: "Leave Categories",
          icon: <CategoryIcon />,
        },

        {
          route: "/organization-configration/leave-types",
          title: "Leave Types",
          icon: <FormatAlignLeftIcon />,
        },
        {
          route: "/organization-configration/leave-reason-type",
          title: "Leave Reason Types",
          icon: <AddIcon />,
        },
        {
          route: "/organization-configration/leave-reason",
          title: "Leave Reasons",
          icon: <AddIcon />,
        },
        {
          route: "/organization-configration/workshift-types",
          title: "WorkShift Types",
          icon: <SettingsSuggestIcon />,
        },
        {
          route: "/organization-configration/work-model",
          title: "Work Models",
          icon: <SettingsSuggestIcon />,
        },
        {
          route: "/organization-configration/user-types",
          title: "User Types",
          icon: <SettingsSuggestIcon />,
        },
        {
          route: "/organization-configration/languages",
          title: "Languages",
          icon: <SettingsSuggestIcon />,
        },
        {
          route: "/organization-configration/datagrid-config",
          title: "Data Grid Configuration",
          icon: <SettingsSuggestIcon />,
        },
      ],
    },

     {
      heading: "Intern Management",
      title: "Intern Management",
      icon: <BusinessIcon />,
      children: [
        {
          route: "/intern/internship/types",
          title: "Internship Types",
          icon: <SegmentIcon />,
        },

         {
          route: "/intern/internship/status",
          title: "Internship Statuses",
          icon: <SegmentIcon />,
        },
         {
          route: "/organization/intern/intern-details",
          title: "Interns",
          icon: <SegmentIcon />,
        },
        {
          route: "/organization/intern/intern-exit",
          title: "Intern Exits",
          icon: <SegmentIcon />,
        },
         {
          route: "/organization/intern/intern-leaves",
          title: "Intern Leaves",
          icon: <SegmentIcon />,
        },
         {
          route: "/intern/document/types",
          title: "Document Types",
          icon: <SegmentIcon />,
        },
         {
          route: "/organization/intern/intern-stipend",
          title: "Intern Stipend",
          icon: <SegmentIcon />,
        },
       
         {
          route: "/intern/attendance/time-logs",
          title: "Intern Time logs",
          icon: <SegmentIcon />,
        },
         {
          route: "/intern/attendance/records",
          title: "Intern Attendance Records",
          icon: <SegmentIcon />,
        },
         {
          route: "/intern/certificates",
          title: "Intern Certificates",
          icon: <SegmentIcon />,
        },
         {
          route: "/intern/intern-stages",
          title: "Internship Stages",
          icon: <SegmentIcon />,
        },
      ],
    },

    {
      heading: "User management",
      title: "User management",
      icon: <BusinessIcon />,
      children: [
        {
          heading: "Users",
          route: "/users",
          title: "Users",
          icon: <PeopleAltOutlined />,
        },
        {
          route: "/application/user-roles",
          title: "User Roles",
          icon: <ApartmentIcon />,
        },

        {
          route: "/application/user-role-permission",
          title: "User Role Permissions",
          icon: <ApartmentIcon />,
        },
      ],
    },
    // {
    //   heading: "Functional Roles",
    //   title: "Functional Roles",
    //   icon: <BusinessIcon />,
    //   children: [
        
       
        

       
    //   ],
    // },

    {
      heading: "Settings",
      title: "Settings",
      icon: <BusinessIcon />,
      children: [
        {
          heading: "Settings",
          route: "/organization/settings",
          title: "Settings",
          icon: <PeopleAltOutlined />,
        },
      ],
    },
  ];

  console.log("axcess", access);
  console.log("userdata", userData);

  const renderSidebarContent = () => (
    <Box sx={{ pt: 2 }}>
      <List>
        {sidebarOptions?.map((item, index) => {
          if (item.kind === "divider")
            return <Divider key={index} sx={{ my: 1 }} />;
          if (item.kind === "header")
            return (
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
            );
          if (item.children) {
            return (
              <ExpandedSideOption
                collapsed={collapsed}
                item={item}
                key={index}
                onNavigate={handleNavigation}
              />
            );
          }
          return (
            <ListItem
              button
              key={item.heading}
              onClick={() =>
                item.title === "Logout"
                  ? handleLogout()
                  : handleNavigation(item.route)
              }
              sx={{
                py: 1,
                minWidth: "40px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                },
                ...(location.pathname === item.route && {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(144, 202, 249, 0.16)"
                      : "rgba(25, 118, 210, 0.12)",
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiListItemText-primary": {
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  },
                }),
              }}
            >
              {item.icon && (
                <ListItemIcon sx={{ minWidth: "35px", cursor: "pointer" }}>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText primary={item.title} sx={{ cursor: "pointer" }} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <CssBaseline />
        <AppBar
          position="static"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
                }}
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
                "&:hover": { textDecoration: "underline" },
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
                PaperProps={{ sx: { mt: 1, p: 1, width: 290 } }}
              >
                <List disablePadding>
                  {access.system_role_name === "Admin" && (
                    <MenuItem onClick={() => navigate("/my-profile")}>
                      Profile
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => navigate("/settings/change-password")}
                  >
                    Change Password
                  </MenuItem>
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
