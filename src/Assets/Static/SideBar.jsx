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
import { LogIn } from "lucide-react";
import React, { useEffect, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { MAIN_URL } from "../../Configurations/Urls";
import useEmployeeDataStore from "../../Zustand/Store/useEmployeeDataStore";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import ExpandedSideOption from "../../Routes/Layouts/ExpandedSideOption";
export default function SideBar({ Permission }) {
  console.log("permission coming is : ", Permission);

  const { logout, userData, setAccess, login } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(310);
  const [isResizing, setIsResizing] = useState(false);
  const { resetData } = useEmployeeDataStore();

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
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarOptions = [
    { kind: "header", title: "" },
    {
      heading: "Dashboard",
      route: "/",
      title: "Dashboard",
      icon: <DashboardIcon />,
      PermissionKey: "",
    },
    { kind: "divider" },
    {
      heading: "Employee Management",
      title: "Employee Management",
      icon: <SegmentIcon />,
      children: [
        {
          route: "/organization/employee/employee-details",
          title: "Employees",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EMPLOYEE_VIEW_LIST",
        },

        {
          route: "/organization/employee/employee-exits",
          title: "Employee Exits",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EMPLOYEE_EXIT_VIEW_LIST",
        },
        {
          route: "/organization/employee/records",
          title: "Employment Records",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EMPLOYEE_RECORD_LIST",
        },
        {
          route: "/organization/employee/functional-role",
          title: "Employee Functional Roles",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EMPLOYEE_FUNCTIONAL_ROLE_VIEW_LIST",
        },
        {
          route: "/employment/employee-stages",
          title: "Employment Stages",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EMPLOYEE_STAGE_VIEW_LIST",
        },
      ],
    },

    {
      heading: "Payroll Management",
      title: "Payroll Management",
      icon: <SegmentIcon />,
      children: [
        {
          route: "/payroll/cycles",
          title: "Payroll Cycles",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_CYCLE_VIEW_LIST",
        },
        {
          route: "/payroll/component-types",
          title: "Payroll Component Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_COMPONENT_TYPE_VIEW_LIST",
        },

        {
          route: "/payroll/components",
          title: "Payroll Components",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_COMPONENT_VIEW_LIST",
        },
        {
          route: "/payroll/component-slabs",
          title: "Payroll Component Slabs",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_COMPONENT_SLAB_VIEW_LIST",
        },

        {
          route: "/payroll/employee-salary-structure",
          title: "Payroll Salary Structures",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_SALARY_VIEW_LIST",
        },
        {
          route: "/payroll/salary-structure/components",
          title: "Payroll Salary Structure Components",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_SALARY_COMPONENT_VIEW_LIST",
        },
        {
          route: "/payroll/advance",
          title: "Payroll Advances",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_ADVANCE_VIEW_LIST",
        },
        {
          route: "/payroll/loan-types",
          title: "Payroll Loan Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_LOAN_TYPE_VIEW_LIST",
        },
        {
          route: "/payroll/loans",
          title: "Payroll Loans",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_LOAN_VIEW_LIST",
        },
        {
          route: "/payroll/loan-transactions",
          title: "Payroll Loan Transactions",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_LOAN_TRANSACTION_VIEW_LIST",
        },
        {
          route: "/payroll/securities",
          title: "Payroll Securities",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_SECURITY_VIEW_LIST",
        },
        {
          route: "/payroll/securities-transactions",
          title: "Payroll Securities Transactions",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_SECURITY_TRANSACTION_VIEW_LIST",
        },
        {
          route: "/payroll/periods",
          title: "Payroll Periods",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_PERIOD_VIEW_LIST",
        },
        {
          route: "/payroll/runs",
          title: "Payroll Runs",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_RUN_VIEW_LIST",
        },
        {
          route: "/payroll/employee-runs",
          title: "Payroll Employee Runs",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_EMPLOYEE_RUN_VIEW_LIST",
        },
        {
          route: "/payroll/employee-run/components",
          title: "Payroll Employee Run Components",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_EMPLOYEE_RUN_COMPONENT_VIEW_LIST",
        },
        {
          route: "/payroll/reimbursements",
          title: "Payroll Reimbursements",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_REIMBURSMENT_VIEW_LIST",
        },
        {
          route: "/payroll/reimbursement-types",
          title: "Payroll Reimbursement Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_REIMBURSMENT_TYPE_VIEW_LIST",
        },
        {
          route: "/payroll/adjustment-types",
          title: "Payroll Adjustment Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_ADJUSTMENT_TYPE_VIEW_LIST",
        },
        {
          route: "/payroll/adjustments",
          title: "Payroll Adjustments",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_ADJUSTMENT_VIEW_LIST",
        },
        {
          route: "/payroll/journal-entries",
          title: "Payroll Journal Entries",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_JOURNAL_ENTRIES_VIEW_LIST",
        },
        {
          route: "/payroll/account-mapping",
          title: "Payroll Account Mappings",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_ACCOUNT_MAPPING_VIEW_LIST",
        },

        {
          route: "/payroll/payslips",
          title: "Payslips",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYROLL_PAYSLIPS_VIEW_LIST",
        },
        {
          route: "/payslips/payments",
          title: "Payslip Payments",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYSLIP_PAYMENTS_VIEW_LIST",
        },
        {
          route: "/payslips/components",
          title: "Payslip Components",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "PAYSLIP_COMPONENT_VIEW_LIST",
        },
      ],
    },

    {
      heading: "Document Records",
      title: "Document Records",
      icon: <SegmentIcon />,
      children: [
        {
          route: "/employee/document/types",
          title: "Document Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EMPLOYEE_DOCUMENT_TYPE_VIEW_LIST",
        },
        {
          route: "/employee/documents",
          title: "Documents",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EMPLOYEE_DOCUMENT_VIEW_LIST",
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
      icon: <SegmentIcon />,
      children: [
        {
          route: "/organization/work-shift",
          title: "WorkShifts",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "SHIFT_VIEW_LIST",
        },

        {
          route: "/organization/work-shift-days",
          title: "WorkShift Days",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "SHIFT_DAYS_LIST",
        },
        {
          route: "/organization/work-model-days",
          title: "WorkModel Days",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "SHIFT_MODEL_DAYS_LIST",
        },

        {
          route: "/organization/work-shift-assignment",
          title: "Employee Shift Assignments",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "SHIFT_ASSIGNMENT_LIST",
        },

        {
          route: "/organization/work-shift-rotation-pattern",
          title: "Employee Shift Rotation Patterns",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "SHIFT_ROTATION_PATTERN_LIST",
        },
        {
          route: "/organization/work-shift-rotation-days",
          title: "Employee Shift Rotation Days",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "SHIFT_ROTATION_DAYS_LIST",
        },
        {
          route: "/organization/work-shift-rotation-assignment",
          title: "Employee Shift Rotation Assignments",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "SHIFT_ROTATION_ASSIGNMENT_LIST",
        },
        {
          route: "/attendance/time-logs",
          title: "Attendance Time Logs",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "ATTENDANCE_VIEW_LIST",
        },

        {
          route: "/attendance/employee-record",
          title: "Attendance Records",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "ATTENDANCE_RECORDS_LIST",
        },

        {
          route: "/attendance/employee-record-without-break",
          title: "Attendance Report Daily",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "ATTENDANCE_RECORD_WITHOUT_BREAK",
        },
      ],
    },
    {
      heading: "Leave Management",
      title: "Leave Management",
      icon: <SegmentIcon />,
      children: [
        {
          route: "/leave/holiday-calendar",
          title: "Holiday Calendar",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "HOLIDAY_CALENDAR_LIST",
        },
        {
          route: "/leave/employee-leaves",
          title: "Employee Leaves",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EMPLOYEE_LEAVE_LIST",
        },
        {
          route: "/leave/employee-entitlements",
          title: "Employee Entitlements",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EMPLOYEE_ENTITLEMENT_LIST",
        },

        {
          route: "/employee-leave-summary",
          title: "Leave Summaries",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LEAVE_SUMMARY_LIST",
        },

        {
          route: "/employee-leave-balance-report",
          title: "Leave Balance Report",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LEAVE_BALANCE_REPORT",
        },
      ],
    },
    {
      heading: "Salary Updates",
      title: "Salary Updates",
      icon: <SegmentIcon />,
      children: [
        {
          heading: "Increment Types",
          route: "/employee/increment-types",
          title: "Increment Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INCREMENT_TYPE_LIST",
        },
        {
          route: "/employee/increment",
          title: "Increments",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INCREMENT_LIST",
        },
      ],
    },

    {
      heading: "Skills Directory",
      title: "Skills Directory",
      icon: <SegmentIcon />,
      children: [
        {
          heading: "Skills Category",
          route: "/organization/skill-category",
          title: "Skills Category",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "SKILL_CATAGORY_LIST",
        },
        {
          heading: "Skills Element Groups",
          route: "/organization/skill-element-group",
          title: "Skills Element Group",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "SKILL_ELEMENT_GROUP_LIST",
        },
        {
          heading: "Functional Role Skills",
          route: "/organization/func-role-skill",
          title: "Functional Role Skill",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "FUNCTIONAL_ROLE_SKILL_LIST",
        },
        {
          heading: "Functional Role Skill Elements",
          route: "/organization/func-role-skill-element",
          title: "Functional Role Skill Elements",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "FUNCTIONAL_ROLE_SKILL_ELEMENT_LIST",
        },
      ],
    },
    {
      heading: "Learning Directory",
      title: "Learning Directory",
      icon: <SegmentIcon />,
      children: [
        {
          heading: "Learning Provider Types",
          route: "/organization/learning-provider-type",
          title: "Learning Provider Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LEARNING_PROVIDER_TYPE_LIST",
        },
        {
          heading: "Learning Provider",
          route: "/organization/learning-provider",
          title: "Learning Provider",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LEARNING_PROVIDER_LIST",
        },
        {
          heading: "Learning Resources",
          route: "/organization/learning-resources",
          title: "Learning Resources",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LEARNING_RESOURCE_LIST",
        },
        {
          heading: "Learning Functional Role",
          route: "/organization/learning-functional-role",
          title: "Learning Functional Role",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LEARNING_FUNCTIONAL_ROLE_LIST",
        },
        {
          heading: "Learning Skill Elements",
          route: "/organization/learning-skill-element",
          title: "Learning Skill Elements",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LEARNING_SKILL_ELEMENT_LIST",
        },
      ],
    },

    {
      heading: "Organization SetUp",
      title: "Organization SetUp",
      icon: <SegmentIcon />,
      children: [
        // {
        //   route: "/organization/data",
        //   title: "Organization",
        //   icon: <CorporateFareIcon />,
        // },
        {
          route: "/organization/details",
          title: "Organizations",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "ORGANIZATION_LIST",
        },
        {
          route: "/organization/entity",
          title: "Organization Entities",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "ENTITY_LIST",
        },
        {
          route: "/organization/profile",
          title: "Organization Profile",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "ORGANIZATION_PROFILE_LIST",
        },
        {
          route: "/organization/departments",
          title: "Departments",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "DEPARTMENT_LIST",
        },
        {
          route: "/organization/location",
          title: "Locations",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LOCATION_LIST",
        },

        {
          route: "/organization/units",
          title: "Organization Units",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "UNITS_LIST",
        },
        {
          route: "/organization/designation",
          title: "Designations",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "DESIGNATION_LIST",
        },
        {
          route: "/organization/registrations",
          title: "Registration",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "REGISTRATION_LIST",
        },
        {
          route: "/attendance/status-type",
          title: "Attendance Status Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "ATTENDANCE_STATUS_LIST",
        },
        {
          route: "/attendance/deviation-reason",
          title: "Attendance Deviation Reasons",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "ATENDANCE_DEVIATION_REASON_LIST",
        },
        {
          route: "/attendance/break-type",
          title: "Attendance Break Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "ATTENDANCE_BREAK_TYPE_LIST",
        },
        {
          route: "/attendance/source",
          title: "Attendance Sources",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "ATTENDANCE_SOURCE_LIST",
        },

        {
          route: "/organization/attendance-break",
          title: "Attendance Breaks",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "ATTENDANCE_BREAK_LIST",
        },
        {
          route: "/organization/workshift-break",
          title: "Workshift Breaks",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "WORKSHIFT_BREAK_LIST",
        },
        {
          route: "/organization/leave-policy",
          title: "Leave Policies",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LEAVE_POLICY_LIST",
        },
        {
          route: "/organization/functional-roles",
          title: "Organization Functional Roles",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "FUNCTIONAL_ROLE_LIST",
        },
        {
          route: "/organization/functional-role-specialization",
          title: "Functional Role Specializations",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "FUNCTIONAL_ROLE_SPECIALIZATION",
        },
      ],
    },

    {
      heading: "Organization Configuration",
      title: "Organization Configuration",
      icon: <SegmentIcon />,
      children: [
        {
          route: "/organization-configration/business-ownership-type",
          title: "Business Ownership Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "BUSINESS_OWNERSHIP_TYPE_LIST",
        },
        {
          route: "/organization-configration/business-registration-type",
          title: "Business Registration Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "BUSINESS_REGISTRATION_TYPE_LIST",
        },
        {
          route: "/organization-configration/unit-types",
          title: "Business Unit Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "BUSINESS_UNIT_TYPE_LIST",
        },
        {
          route: "/organization-configration/residential-ownership-type",
          title: "Residential Ownership Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "RESIDENTIAL_OWNERSHIP_TYPE_LIST",
        },
        {
          route: "/organization-configration/location-ownership-type",
          title: "Location Ownership Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LOCATION_OWNERSHIP_TYPE_LIST",
        },
        {
          route: "/organization-configration/employee-address-types",
          title: "Address Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "ADDRESS_TYPE_LIST",
        },
        {
          route: "/organization-configration/employee-status",
          title: "Employment Statuses",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EMPLOYEMENT_STATUS_LIST",
        },
        {
          route: "/organization-configration/employement-type",
          title: "Employment Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EMPLOYMENT_TYPE_LIST",
        },
        {
          route: "/organization-configration/employement-exit-reason-type",
          title: "Exit Reason Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EXIT_REASON_TYPE",
        },
        {
          route: "/organization-configration/employement-category",
          title: "Employment Categories",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EMPLOYMENT_CATEGORY_LIST",
        },

        {
          route: "/organization-configration/employement-exit-reason",
          title: "Exit Reason",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "EXIT_REASON_LIST",
        },
        {
          route: "/organization-configration/holiday-types",
          title: "Holiday Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "HOLIDAY_TYPE_LIST",
        },
        {
          route: "/organization-configration/leave-category",
          title: "Leave Categories",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LEAVE_CATEGORY_LIST",
        },

        {
          route: "/organization-configration/leave-types",
          title: "Leave Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LEAVE_TYPE_LIST",
        },
        {
          route: "/organization-configration/leave-reason-type",
          title: "Leave Reason Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LEAVE_REASON_TYPE_LIST",
        },
        {
          route: "/organization-configration/leave-reason",
          title: "Leave Reasons",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LEAVE_REASON_LIST",
        },
        {
          route: "/organization-configration/workshift-types",
          title: "WorkShift Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "WORKSHIFT_TYPE_LIST",
        },
        {
          route: "/organization-configration/work-model",
          title: "Work Models",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "WORK_MODEL_LIST",
        },
        {
          route: "/organization-configration/user-types",
          title: "User Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "USER_TYPE_LIST",
        },
        {
          route: "/organization-configration/languages",
          title: "Languages",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "LANGUAGE_LIST",
        },
        {
          route: "/organization-configration/datagrid-config",
          title: "Data Grid Configuration",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "GRID_CONFIGRATION",
        },
      ],
    },

    {
      heading: "Intern Management",
      title: "Intern Management",
      icon: <SegmentIcon />,
      children: [
        {
          route: "/intern/internship/types",
          title: "Internship Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INTERNSHIP_TYPE_LIST",
        },

        {
          route: "/intern/internship/status",
          title: "Internship Statuses",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INTERNSHIP_STATUS_LIST",
        },
        {
          route: "/organization/intern/intern-details",
          title: "Interns",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INTERN_LIST",
        },
        {
          route: "/organization/intern/intern-exit",
          title: "Intern Exits",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INTERN_LIST",
        },
        {
          route: "/organization/intern/intern-leaves",
          title: "Intern Leaves",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INTERN_LEAVE",
        },
        {
          route: "/intern/document/types",
          title: "Document Types",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INTERN_DOCUMENT",
        },
        {
          route: "/organization/intern/intern-stipend",
          title: "Intern Stipend",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INTERN_STIPEND",
        },

        {
          route: "/intern/attendance/time-logs",
          title: "Intern Time logs",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INTERN_TIME_LOG_LIST",
        },
        {
          route: "/intern/attendance/records",
          title: "Intern Attendance Records",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INTERN_ATTENDANCE_RECORD_LIST",
        },
        {
          route: "/intern/certificates",
          title: "Intern Certificates",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INTERN_CERTIFICATE_LIST",
        },
        {
          route: "/intern/intern-stages",
          title: "Internship Stages",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INTERN_STAGES_LIST",
        },
        {
          route: "/intern/functional-role",
          title: "Intern Functional Roles",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "INTERN_FUNCTIONAL_ROLE_LIST",
        },
      ],
    },

    {
      heading: "User management",
      title: "User management",
      icon: <SegmentIcon />,
      children: [
        {
          heading: "Users",
          route: "/users",
          title: "Users",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "USER_VIEW_LIST",
        },
        {
          route: "/application/user-roles",
          title: "User Roles",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "USER_ROLE_LIST",
        },

        {
          route: "/application/user-role-permission",
          title: "User Role Permissions",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "USER_ROLE_PERMISSION_LIST",
        },
         {
          route: "/application/user-permission",
          title: "User Permission Overrides",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "USER_PERMISSION_LIST",
        },
      ],
    },

    {
      heading: "Tools & Utilities",
      title: "Tools & Utilities",
      icon: <SegmentIcon />,
      children: [
        {
          heading: "Tools & Utilities",
          route: "/organization/employee-shift",
          title: "Copy Employee",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "COPY_EMPLOYEE_LIST",
        },
      ],
    },

    {
      heading: "Settings",
      title: "Settings",
      icon: <SegmentIcon />,
      children: [
        {
          heading: "Settings",
          route: "/organization/settings/new",
          title: "Settings",
          icon: <SegmentIcon fontSize="small" />,
          PermissionKey: "SETTING_LIST",
        },
      ],
    }

  ]

  console.log("sidebarOptions", sidebarOptions);

  const [sidebaroption, setSideBarOption] = useState(sidebarOptions);

console.log("sidebaroption",sidebaroption)
useEffect(() => {
  if (Permission?.length > 0) {
    const filtered = sidebarOptions
      .map((item) => {
        // If item has children -> filter children
        if (item.children) {
          const allowedChildren = item.children.filter((child) =>
            child.PermissionKey
              ? Permission.includes(child.PermissionKey)
              : true
          );

          // If no child is allowed → remove whole section
          if (allowedChildren.length === 0) return null;

          return { ...item, children: allowedChildren };
        }

        // If item has a PermissionKey → check
        if (item.PermissionKey) {
          return Permission.includes(item.PermissionKey) ? item : null;
        }

        // Items without permissionKey (like Dashboard or dividers) always remain
        return item;
      })
      .filter(Boolean); // remove null items

    setSideBarOption(filtered);
  }
}, [Permission]);


  const handleNavigation = (route) => {
    navigate(route);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <Box sx={{ pt: 2 }}>
      <List>
        {sidebaroption?.map((item, index) => {
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
}


