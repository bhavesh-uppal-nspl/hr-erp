"use client";

import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  DashboardCustomize,
  ShowChart,
  MoveToInbox,
  Person as PersonIcon,
  BarChart as BarChartIcon,
  CalendarToday,
} from "@mui/icons-material";
import { PieChart, BarChart, pieArcLabelClasses } from "@mui/x-charts";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../Configurations/Urls";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [employees, setEmployees] = React.useState([]);
  const [interns, setInterns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [onLeaveTodayApiCount, setOnLeaveTodayApiCount] = React.useState(null);

  const [apiUrl, setApiUrl] = React.useState(null);
  const [internsApiUrl, setInternsApiUrl] = React.useState(null);

  const [freelancers, setFreelancers] = React.useState([]);
  const [freelancersApiUrl, setFreelancersApiUrl] = React.useState(null);

  React.useEffect(() => {
    if (org?.organization_id) {
      setApiUrl(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/filter-employee`
      );
      setInternsApiUrl(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/filter/intern`
      );
      setFreelancersApiUrl(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/filter-freelancer`
      );
    }
  }, [org?.organization_id]);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const theme = useTheme();
  const currentDate = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formattedDate = currentDate.toLocaleString("en-US", options);

  const calculateWidgetValues = React.useMemo(() => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let newJoiningCount = 0;
    let birthdayCount = 0;
    let anniversaryCount = 0;

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    employees.forEach((employee) => {
      // Process Date of Joining
      if (employee.Date_of_Joining) {
        const [dayStr, monthStr, yearStr] = employee.Date_of_Joining.split("-");
        const joinMonth = monthNames.indexOf(monthStr);
        const joinYear = Number.parseInt(yearStr);

        if (joinMonth === currentMonth) {
          if (joinYear === currentYear) {
            newJoiningCount++;
          } else if (joinYear < currentYear) {
            anniversaryCount++;
          }
        }
      }

      // Process Date of Birth (handles ISO format and "dd-MMM-yyyy" format)
      if (employee.Date_of_Birth) {
        let birthDateObj;
        if (employee.Date_of_Birth.includes("T")) {
          // ISO format
          birthDateObj = new Date(employee.Date_of_Birth);
        } else {
          // "dd-MMM-yyyy" format
          const birthParts = employee.Date_of_Birth.split("-");
          if (birthParts.length === 3) {
            const monthIndex = monthNames.indexOf(birthParts[1]);
            if (monthIndex !== -1) {
              birthDateObj = new Date(
                Number(birthParts[2]),
                monthIndex,
                Number(birthParts[0])
              );
            }
          }
        }
        if (birthDateObj && birthDateObj.getMonth() === currentMonth) {
          birthdayCount++;
        }
      }
    });

    return {
      newJoining: newJoiningCount,
      birthday: birthdayCount,
      anniversary: anniversaryCount,
    };
  }, [employees, currentDate]);

  // NEW: Calculate intern widget values
  const calculateInternWidgetValues = React.useMemo(() => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let newJoiningCount = 0;
    let birthdayCount = 0;
    let anniversaryCount = 0;

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    interns.forEach((intern) => {
      // Process Date of Joining
      if (intern.Date_of_Joining) {
        const [dayStr, monthStr, yearStr] = intern.Date_of_Joining.split("-");
        const joinMonth = monthNames.indexOf(monthStr);
        const joinYear = Number.parseInt(yearStr);

        if (joinMonth === currentMonth) {
          if (joinYear === currentYear) {
            newJoiningCount++;
          } else if (joinYear < currentYear) {
            anniversaryCount++;
          }
        }
      }

      // Process Date of Birth (handles ISO format and "dd-MMM-yyyy" format)
      if (intern.Date_of_Birth) {
        let birthDateObj;
        if (intern.Date_of_Birth.includes("T")) {
          // ISO format
          birthDateObj = new Date(intern.Date_of_Birth);
        } else {
          // "dd-MMM-yyyy" format
          const birthParts = intern.Date_of_Birth.split("-");
          if (birthParts.length === 3) {
            const monthIndex = monthNames.indexOf(birthParts[1]);
            if (monthIndex !== -1) {
              birthDateObj = new Date(
                Number(birthParts[2]),
                monthIndex,
                Number(birthParts[0])
              );
            }
          }
        }
        if (birthDateObj && birthDateObj.getMonth() === currentMonth) {
          birthdayCount++;
        }
      }
    });

    return {
      newJoining: newJoiningCount,
      birthday: birthdayCount,
      anniversary: anniversaryCount,
    };
  }, [interns, currentDate]);

  // Calculate freelancer widget values
  const calculateFreelancerWidgetValues = React.useMemo(() => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    let newJoiningCount = 0;
    let birthdayCount = 0;
    let anniversaryCount = 0;

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    freelancers.forEach((freelancer) => {
      if (freelancer.Date_of_Joining) {
        const [dayStr, monthStr, yearStr] =
          freelancer.Date_of_Joining.split("-");
        const joinMonth = monthNames.indexOf(monthStr);
        const joinYear = Number.parseInt(yearStr);

        if (joinMonth === currentMonth) {
          if (joinYear === currentYear) {
            newJoiningCount++;
          } else if (joinYear < currentYear) {
            anniversaryCount++;
          }
        }
      }

      if (freelancer.Date_of_Birth) {
        let birthDateObj;
        if (freelancer.Date_of_Birth.includes("T")) {
          birthDateObj = new Date(freelancer.Date_of_Birth);
        } else {
          const birthParts = freelancer.Date_of_Birth.split("-");
          if (birthParts.length === 3) {
            const monthIndex = monthNames.indexOf(birthParts[1]);
            if (monthIndex !== -1) {
              birthDateObj = new Date(
                Number(birthParts[2]),
                monthIndex,
                Number(birthParts[0])
              );
            }
          }
        }
        if (birthDateObj && birthDateObj.getMonth() === currentMonth) {
          birthdayCount++;
        }
      }
    });

    return {
      newJoining: newJoiningCount,
      birthday: birthdayCount,
      anniversary: anniversaryCount,
    };
  }, [freelancers, currentDate]);

  const attendanceStats = React.useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;

    const normalizeBool = (val) => {
      if (typeof val === "boolean") return val;
      if (typeof val === "number") return val > 0;
      if (typeof val === "string") {
        const s = val.trim().toLowerCase();
        if (
          [
            "true",
            "1",
            "yes",
            "y",
            "present",
            "checked-in",
            "clocked-in",
            "in",
          ].includes(s)
        )
          return true;
        if (
          ["false", "0", "no", "n", "absent", "not-present", "out"].includes(s)
        )
          return false;
      }
      return null;
    };

    const isNonEmptyTime = (val) => {
      if (val == null) return false;
      if (typeof val === "number") return val > 0;
      if (typeof val === "string") {
        const s = val.trim().toLowerCase();
        if (!s) return false;
        if (["null", "undefined", "na", "n/a"].includes(s)) return false;
        if (
          ["00:00", "00:00:00", "0", "1970-01-01", "invalid date"].includes(s)
        )
          return false;
        return true;
      }
      if (val instanceof Date && !isNaN(val.getTime())) return true;
      return false;
    };

    employees.forEach((emp) => {
      const today =
        emp?.attendance_today ||
        emp?.Attendance?.[0] ||
        emp?.attendance?.[0] ||
        null;

      const clockInCandidates = [
        today?.clock_in,
        today?.ClockIn,
        today?.clockIn,
        today?.clockin,
        emp?.clock_in,
        emp?.ClockIn,
        emp?.clockIn,
        emp?.clockin,
      ];
      const clockOutCandidates = [
        today?.clock_out,
        today?.ClockOut,
        today?.clockOut,
        today?.clockout,
        emp?.clock_out,
        emp?.ClockOut,
        emp?.clockOut,
        emp?.clockout,
      ];

      let clockInFlag = null;
      for (const c of clockInCandidates) {
        const n = normalizeBool(c);
        if (n !== null) {
          clockInFlag = n;
          break;
        }
      }

      let clockOutFlag = null;
      for (const c of clockOutCandidates) {
        const n = normalizeBool(c);
        if (n !== null) {
          clockOutFlag = n;
          break;
        }
      }

      const hasCheckInTimestamp = [
        today?.clock_in,
        today?.ClockIn,
        today?.clockIn,
        today?.clockin,
        today?.check_in,
        today?.CheckIn,
        today?.checkIn,
        today?.time_in,
        today?.TimeIn,
        today?.in_time,
        today?.first_check_in,
        today?.firstCheckIn,
      ].some(isNonEmptyTime);

      let counted = false;

      if (clockInFlag === false || clockOutFlag === true) {
        present += 1;
        counted = true;
      } else if (clockInFlag === true && !hasCheckInTimestamp) {
        absent += 1;
        counted = true;
      } else if (hasCheckInTimestamp) {
        present += 1;
        counted = true;
      }

      if (!counted) {
        const rawStatus =
          today?.status ||
          today?.Status ||
          emp?.AttendanceStatus ||
          emp?.today_status ||
          emp?.status_today ||
          "";
        const status =
          typeof rawStatus === "string" ? rawStatus.toLowerCase() : "";
        if (
          status.includes("present") ||
          status === "in" ||
          status === "checked-in"
        )
          present += 1;
        else if (
          status.includes("absent") ||
          status === "out" ||
          status === "checked-out"
        )
          absent += 1;
      }

      if (
        normalizeBool(today?.late) === true ||
        normalizeBool(emp?.late_today) === true
      ) {
        late += 1;
      } else {
        const statusLate = String(
          today?.status || today?.Status || ""
        ).toLowerCase();
        if (statusLate.includes("late")) late += 1;
      }
    });

    return { present, absent, late };
  }, [employees, currentDate]);

  React.useEffect(() => {
    const orgId = org?.organization_id || 5;
    if (!orgId) return;

    const leavesUrl = `${MAIN_URL}/api/organizations/${orgId}/employee-leaves-all`;
    const controller = new AbortController();

    const fetchLeaves = async () => {
      try {
        const response = await fetch(leavesUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const json = await response.json();
        let leaves = Array.isArray(json)
          ? json
          : json.data || json.leaves || json.results || [];

        if (
          Array.isArray(leaves) &&
          leaves.length > 0 &&
          Array.isArray(leaves[0])
        ) {
          leaves = leaves[0];
        }

        const y = currentDate.getFullYear();
        const m = currentDate.getMonth();
        const d = currentDate.getDate();
        const isSameDay = (dateObj) =>
          dateObj &&
          dateObj.getFullYear() === y &&
          dateObj.getMonth() === m &&
          dateObj.getDate() === d;

        const count = (leaves || []).reduce((acc, item) => {
          const startStr =
            item?.leave_start_date ||
            item?.start_date ||
            item?.from_date ||
            item?.fromDate;
          if (!startStr) return acc;
          const start = new Date(startStr);
          return isSameDay(start) ? acc + 1 : acc;
        }, 0);

        setOnLeaveTodayApiCount(count);
      } catch (e) {
        setOnLeaveTodayApiCount(0);
      }
    };

    fetchLeaves();
    return () => controller.abort();
  }, [org?.organization_id, currentDate]);

  const leavesStats = React.useMemo(() => {
    let onLeaveToday = 0;
    let upcomingLeaves = 0;
    let pending = 0;

    const now = currentDate;
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    employees.forEach((emp) => {
      const todayLeave =
        emp.today_leave ||
        emp.LeaveToday ||
        emp.leave_today ||
        emp.is_on_leave_today ||
        false;
      if (todayLeave) onLeaveToday += 1;

      const pendingReq = Number(
        emp.pending_leave_requests || emp.pendingLeaves || 0
      );
      if (!Number.isNaN(pendingReq)) pending += pendingReq;

      const upcomingArr =
        emp.upcoming_leaves || emp.UpcomingLeaves || emp.upcomingLeaves || [];

      if (Array.isArray(upcomingArr)) {
        upcomingLeaves += upcomingArr.filter((l) => {
          const startStr = l?.start_date || l?.startDate;
          if (!startStr) return false;
          const start = new Date(startStr);
          return start >= now && start <= in7Days;
        }).length;
      }
    });

    const finalOnLeaveToday =
      typeof onLeaveTodayApiCount === "number"
        ? onLeaveTodayApiCount
        : onLeaveToday;

    return { onLeaveToday: finalOnLeaveToday, upcomingLeaves, pending };
  }, [employees, currentDate, onLeaveTodayApiCount]);

  const fetchEmployees = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!apiUrl) {
        setEmployees([]);
        return;
      }

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      let employeesData = Array.isArray(data)
        ? data
        : data.employees || data.data || [];

      if (
        Array.isArray(employeesData) &&
        employeesData.length > 0 &&
        Array.isArray(employeesData[0])
      ) {
        employeesData = employeesData[0];
      }

      setEmployees(employeesData);
    } catch (err) {
      let errorMessage = "Failed to fetch employee data";
      if (
        err?.name === "TypeError" &&
        String(err?.message || "").includes("Failed to fetch")
      ) {
        errorMessage =
          "Network error: Unable to connect to the API. This might be due to CORS restrictions or network connectivity issues.";
      } else if (String(err?.message || "").includes("HTTP error")) {
        errorMessage = `API Error: ${err.message}`;
      } else if (err?.message) {
        errorMessage = `Error: ${err.message}`;
      }
      setError(errorMessage);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Fetch freelancers function
  const fetchFreelancers = React.useCallback(async () => {
    try {
      if (!freelancersApiUrl) {
        setFreelancers([]);
        return;
      }

      const response = await fetch(freelancersApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      let freelancersData = Array.isArray(data)
        ? data
        : data.freelancers || data.data || [];

      if (
        Array.isArray(freelancersData) &&
        freelancersData.length > 0 &&
        Array.isArray(freelancersData[0])
      ) {
        freelancersData = freelancersData[0];
      }

      setFreelancers(freelancersData);
    } catch (err) {
      console.error("Failed to fetch freelancer data:", err);
      setFreelancers([]);
    }
  }, [freelancersApiUrl]);

  React.useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  // NEW: Fetch interns function
  const fetchInterns = React.useCallback(async () => {
    try {
      if (!internsApiUrl) {
        setInterns([]);
        return;
      }

      const response = await fetch(internsApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      let internsData = Array.isArray(data)
        ? data
        : data.interns || data.data || [];

      if (
        Array.isArray(internsData) &&
        internsData.length > 0 &&
        Array.isArray(internsData[0])
      ) {
        internsData = internsData[0];
      }

      setInterns(internsData);
    } catch (err) {
      console.error("Failed to fetch intern data:", err);
      setInterns([]);
    }
  }, [internsApiUrl]);

  React.useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  React.useEffect(() => {
    fetchInterns();
  }, [fetchInterns]);

  const handleMenuItemClick = () => {};

  const genderCounts = employees.reduce((acc, emp) => {
    const gender = emp.gender || emp.Gender || emp.sex || emp.Sex || "Unknown";
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  const genderData = [
    {
      id: 0,
      value:
        genderCounts["Male"] || genderCounts["male"] || genderCounts["M"] || 0,
      label: "Male",
      color: "#3B82F6",
    },
    {
      id: 1,
      value:
        genderCounts["Female"] ||
        genderCounts["female"] ||
        genderCounts["F"] ||
        0,
      label: "Female",
      color: "#EC4899",
    },
    {
      id: 2,
      value: Object.keys(genderCounts).reduce((otherCount, key) => {
        const normalizedKey = key.toLowerCase();
        if (
          normalizedKey !== "male" &&
          normalizedKey !== "female" &&
          normalizedKey !== "m" &&
          normalizedKey !== "f"
        ) {
          return otherCount + genderCounts[key];
        }
        return otherCount;
      }, 0),
      label: "Other",
      color: "#10B981",
    },
  ];

  const departmentCounts = employees.reduce((acc, emp) => {
    let departmentName = "Unknown";

    if (
      emp.Department &&
      Array.isArray(emp.Department) &&
      emp.Department.length > 0
    ) {
      const deptObj = emp.Department[0];
      departmentName =
        deptObj?.department?.department_short_name ||
        deptObj?.department?.name ||
        deptObj?.department?.Department ||
        deptObj?.department?.department_name ||
        deptObj?.name ||
        deptObj?.Department;
    } else if (emp.department) {
      departmentName =
        emp.department.department_short_name ||
        emp.department.name ||
        emp.department.Department ||
        emp.department.department_name;
    } else if (emp.department_name) {
      departmentName = emp.department_name;
    } else if (typeof emp.Department === "string") {
      departmentName = emp.Department;
    }

    if (!departmentName || departmentName === "") {
      departmentName = "Unknown";
    }

    const getDepartmentAbbreviation = (name) => {
      let cleanName = name.toLowerCase().trim();
      cleanName = cleanName
        .replace(/\s*(department|dept|division|div)\s*$/i, "")
        .trim();

      const abbreviationMap = {
        "human resources": "HR",
        hr: "HR",
        finance: "FIN",
        fin: "FIN",
        "information technology": "IT",
        it: "IT",
        tech: "IT",
        technology: "IT",
        marketing: "MKT",
        mkt: "MKT",
        sales: "SALES",
        operations: "OPS",
        ops: "OPS",
        "research and development": "R&D",
        "r&d": "R&D",
        research: "R&D",
        development: "R&D",
        "customer service": "CS",
        cs: "CS",
        support: "CS",
        legal: "LEGAL",
        administration: "ADMIN",
        admin: "ADMIN",
      };

      return abbreviationMap[cleanName] || name;
    };

    departmentName = getDepartmentAbbreviation(departmentName);

    acc[departmentName] = (acc[departmentName] || 0) + 1;
    return acc;
  }, {});

  const departmentData = Object.entries(departmentCounts).map(
    ([name, value]) => ({ name, value })
  );

  const employmentTypeCounts = employees.reduce((acc, emp) => {
    let employmentTypeName = "Unknown";

    if (emp.Employment_Type) {
      employmentTypeName = emp.Employment_Type;
    } else if (
      emp.EmploymentType &&
      Array.isArray(emp.EmploymentType) &&
      emp.EmploymentType.length > 0
    ) {
      const empTypeObj = emp.EmploymentType[0];
      employmentTypeName =
        empTypeObj?.employment_type?.name ||
        empTypeObj?.employment_type?.EmploymentType ||
        empTypeObj?.employment_type?.employment_type_name ||
        empTypeObj?.name ||
        empTypeObj?.EmploymentType;
    } else if (emp.employment_type) {
      employmentTypeName =
        emp.employment_type.name ||
        emp.employment_type.EmploymentType ||
        emp.employment_type.employment_type_name;
    } else if (emp.employment_type_name) {
      employmentTypeName = emp.employment_type_name;
    } else if (typeof emp.EmploymentType === "string") {
      employmentTypeName = emp.EmploymentType;
    }

    if (!employmentTypeName || employmentTypeName === "") {
      employmentTypeName = "Unknown";
    }

    if (employmentTypeName && employmentTypeName !== "Unknown") {
      employmentTypeName = employmentTypeName
        .replace(/\btype\b/gi, "")
        .trim()
        .toUpperCase();
    }

    acc[employmentTypeName] = (acc[employmentTypeName] || 0) + 1;
    return acc;
  }, {});

  const employmentTypeData = Object.entries(employmentTypeCounts).map(
    ([name, value]) => ({ name, value })
  );

  const getShortDesignationName = (designation) => {
    const abbreviationMap = {
      "chief executive officer": "CEO",
      "chief technology officer": "CTO",
      "chief financial officer": "CFO",
      "chief operating officer": "COO",
      "chief marketing officer": "CMO",
      "chief human resources officer": "CHRO",
      "general manager": "GM",
      "project manager": "PM",
      "product manager": "PM",
      "program manager": "PGM",
      "operations manager": "OM",
      "marketing manager": "MM",
      "sales manager": "SM",
      "finance manager": "FinM",
      "hr manager": "HRM",
      "human resources manager": "HRM",
      "security manager": "SM",
      "quality manager": "QM",
      "business development manager": "BDM",
      "software engineer": "SWE",
      "senior software engineer": "SrSE",
      "junior software engineer": "JrSE",
      "software developer": "Dev",
      "senior software developer": "SrDev",
      "junior software developer": "JrDev",
      "full stack developer": "FullStack",
      "frontend developer": "Frontend",
      "backend developer": "Backend",
      "mobile developer": "MobileDev",
      "web developer": "WebDev",
      "devops engineer": "DevOps",
      "system administrator": "SysAdmin",
      "database administrator": "DBA",
      "network administrator": "NetAdmin",
      "quality assurance": "QA",
      "quality assurance engineer": "QA Eng",
      "test engineer": "Test Eng",
      "automation engineer": "Auto Eng",
      "business analyst": "BA",
      "senior business analyst": "Sr BA",
      "data analyst": "DA",
      "senior data analyst": "Sr DA",
      "data scientist": "DS",
      "business intelligence analyst": "BI Analyst",
      "financial analyst": "Fin Analyst",
      "market research analyst": "MR Analyst",
      "sales executive": "Sales Exec",
      "senior sales executive": "Sr Sales",
      "sales representative": "Sales Rep",
      "account manager": "Acct Mgr",
      "account executive": "Acct Exec",
      "marketing executive": "Mkt Exec",
      "digital marketing specialist": "Digital Mkt",
      "content marketing specialist": "Content Mkt",
      "social media manager": "SM Mgr",
      "human resource executive": "HRE",
      "hr executive": "HRE",
      "human resource specialist": "HR Spec",
      "hr specialist": "HR Spec",
      recruiter: "Recruiter",
      "talent acquisition specialist": "TA Spec",
      "administrative assistant": "AdminAsst",
      "executive assistant": "ExecAsst",
      "office manager": "Office Mgr",
      accountant: "Accountant",
      "senior accountant": "Sr Accountant",
      "junior accountant": "Jr Accountant",
      "accounts payable": "AP",
      "accounts receivable": "AR",
      "financial controller": "Controller",
      "finance executive": "FIE",
      "finance head": "FIH",
      "customer service representative": "CSR",
      "customer support": "Support",
      "customer success manager": "CS Mgr",
      "technical support": "Tech Support",
      "help desk": "Help Desk",
      "ui designer": "UI Designer",
      "ux designer": "UX Designer",
      "ui/ux designer": "UI/UX",
      "graphic designer": "GFX Designer",
      "web designer": "Web Designer",
      "product designer": "Product Des",
      "operations executive": "Ops Exec",
      "logistics coordinator": "Logistics",
      "supply chain manager": "SC Mgr",
      "warehouse manager": "WH Mgr",
      "production manager": "Prod Mgr",
      consultant: "Consultant",
      "senior consultant": "Sr Consultant",
      "strategy consultant": "Strategy Con",
      "business consultant": "Biz Consultant",
      "legal counsel": "Legal",
      "compliance officer": "Compliance",
      "legal advisor": "Legal Advisor",
    };

    let cleanDesignation = designation.toLowerCase().trim();

    const suffixesToRemove = [
      " specialist",
      " executive",
      " representative",
      " coordinator",
      " associate",
    ];
    suffixesToRemove.forEach((suffix) => {
      if (
        cleanDesignation.endsWith(suffix) &&
        !abbreviationMap[cleanDesignation]
      ) {
        const withoutSuffix = cleanDesignation.replace(suffix, "").trim();
        if (abbreviationMap[withoutSuffix]) {
          cleanDesignation = withoutSuffix;
        }
      }
    });

    if (abbreviationMap[cleanDesignation]) {
      return abbreviationMap[cleanDesignation];
    }

    for (const [fullName, abbrev] of Object.entries(abbreviationMap)) {
      if (
        fullName.includes(cleanDesignation) ||
        cleanDesignation.includes(fullName.split(" ")[0])
      ) {
        return abbrev;
      }
    }

    const formatted = designation
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formatted.length > 12
      ? formatted.substring(0, 12) + "..."
      : formatted;
  };

  const designationCounts = employees.reduce((acc, emp) => {
    const designationName = emp.Designation || "Unknown";
    const shortName = getShortDesignationName(designationName);
    acc[shortName] = (acc[shortName] || 0) + 1;
    return acc;
  }, {});

  const designationData = Object.entries(designationCounts).map(
    ([name, value]) => ({ name, value })
  );

  const ageGroupCounts = employees.reduce((acc, emp) => {
    const age = emp.Age;
    if (age >= 20 && age <= 25) acc["20-25"] = (acc["20-25"] || 0) + 1;
    else if (age >= 26 && age <= 30) acc["26-30"] = (acc["26-30"] || 0) + 1;
    else if (age >= 31 && age <= 35) acc["31-35"] = (acc["31-35"] || 0) + 1;
    else if (age >= 36 && age <= 40) acc["36-40"] = (acc["36-40"] || 0) + 1;
    else if (age > 40) acc["40+"] = (acc["40+"] || 0) + 1;
    return acc;
  }, {});

  const ageGroupData = [
    {
      id: "age20-25",
      value: ageGroupCounts["20-25"] || 0,
      label: "20-25",
      color: "#EF4444",
    },
    {
      id: "age26-30",
      value: ageGroupCounts["26-30"] || 0,
      label: "26-30",
      color: "#F59E0B",
    },
    {
      id: "age31-35",
      value: ageGroupCounts["31-35"] || 0,
      label: "31-35",
      color: "#10B981",
    },
    {
      id: "age36-40",
      value: ageGroupCounts["36-40"] || 0,
      label: "36-40",
      color: "#3B82F6",
    },
    {
      id: "age40+",
      value: ageGroupCounts["40+"] || 0,
      label: "40+",
      color: "#8B5CF6",
    },
  ].filter((item) => item.value > 0);

  const experienceCounts = employees.reduce((acc, emp) => {
    if (emp.Date_of_Joining) {
      try {
        const joiningDate = new Date(emp.Date_of_Joining);
        if (!isNaN(joiningDate.getTime())) {
          const yearsOfExperience =
            currentDate.getFullYear() - joiningDate.getFullYear();

          if (yearsOfExperience >= 0 && yearsOfExperience <= 2)
            acc["0-2 years"] = (acc["0-2 years"] || 0) + 1;
          else if (yearsOfExperience >= 3 && yearsOfExperience <= 5)
            acc["3-5 years"] = (acc["3-5 years"] || 0) + 1;
          else if (yearsOfExperience >= 6 && yearsOfExperience <= 10)
            acc["6-10 years"] = (acc["6-10 years"] || 0) + 1;
          else if (yearsOfExperience > 10)
            acc["10+ years"] = (acc["10+ years"] || 0) + 1;
        }
      } catch (e) {
        console.error(
          `Error processing Date_of_Joining for employee: ${emp.id || emp.name || "Unknown ID"}.`,
          e
        );
      }
    }
    return acc;
  }, {});

  const experienceData = [
    { name: "0-2 years", value: experienceCounts["0-2 years"] || 0 },
    { name: "3-5 years", value: experienceCounts["3-5 years"] || 0 },
    { name: "6-10 years", value: experienceCounts["6-10 years"] || 0 },
    { name: "10+ years", value: experienceCounts["10+ years"] || 0 },
  ];

  const organizationUnitCounts = employees.reduce((acc, emp) => {
    const orgUnitName =
      emp.department_location?.[0]?.department?.department_short_name ||
      emp.department_location?.[0]?.department?.department_name ||
      emp.department?.department_short_name ||
      emp.department?.department_name ||
      emp.department_name ||
      emp.department ||
      "No Department";

    acc[orgUnitName] = (acc[orgUnitName] || 0) + 1;
    return acc;
  }, {});

  const organizationData = Object.entries(organizationUnitCounts).map(
    ([name, value]) => ({ name, value })
  );

  const allChartConfigs = [
    {
      id: "gender",
      title: "Distribution by Gender",
      icon: null,
      type: "pie",
      data: genderData,
      color: "#3B82F6",
      group: "Demographics",
    },
    {
      id: "ageGroup",
      title: "Distribution by Age Group",
      icon: null,
      type: "pie",
      data: ageGroupData,
      color: "#EF4444",
      group: "Demographics",
    },
    (() => {
      const sortedDepartmentData = departmentData.sort(
        (a, b) => b.value - a.value
      );
      return {
        id: "department",
        title: "Distribution by Department",
        icon: null,
        type: "bar",
        data: sortedDepartmentData,
        xAxisData: sortedDepartmentData.map((d) => d.name),
        seriesData: [
          {
            data: sortedDepartmentData.map((d) => d.value),
            label: "Employees",
            color: "#10B981",
          },
        ],
        color: "#10B981",
        group: "Employment Details",
      };
    })(),
    (() => {
      const sortedEmploymentTypeData = employmentTypeData.sort(
        (a, b) => b.value - a.value
      );
      return {
        id: "employmentType",
        title: "Distribution by Employment Type",
        icon: null,
        type: "bar",
        data: sortedEmploymentTypeData,
        xAxisData: sortedEmploymentTypeData.map((d) => d.name),
        seriesData: [
          {
            data: sortedEmploymentTypeData.map((d) => d.value),
            label: "Employees",
            color: "#F97316",
          },
        ],
        color: "#F97316",
        group: "Employment Details",
      };
    })(),
    (() => {
      const experienceOrder = [
        "0-2 years",
        "3-5 years",
        "6-10 years",
        "10+ years",
      ];
      const sortedExperienceData = experienceData.sort((a, b) => {
        return (
          experienceOrder.indexOf(a.name) - experienceOrder.indexOf(b.name)
        );
      });
      return {
        id: "experience",
        title: "Distribution by Experience Level",
        icon: null,
        type: "bar",
        layout: "vertical",
        data: sortedExperienceData,
        xAxisData: sortedExperienceData.map((d) => d.name),
        yAxisData: sortedExperienceData.map((d) => d.name),
        seriesData: [
          {
            data: sortedExperienceData.map((d) => d.value),
            label: "Employees",
            color: "#10B981",
            valueFormatter: (value) => value.toString(),
          },
        ],
        color: "#10B981",
        group: "Employment Details",
      };
    })(),
    (() => {
      const sortedOrganizationData = organizationData.sort(
        (a, b) => b.value - a.value
      );
      return {
        id: "organization",
        title: "Distribution by Organization Units",
        icon: null,
        type: "bar",
        data: sortedOrganizationData,
        xAxisData: sortedOrganizationData.map((d) => d.name),
        seriesData: [
          {
            data: sortedOrganizationData.map((d) => d.value),
            label: "Employees",
            color: "#3B82F6",
          },
        ],
        color: "#3B82F6",
        group: "Employment Details",
      };
    })(),
    (() => {
      const sortedDesignationData = designationData.sort(
        (a, b) => b.value - a.value
      );
      return {
        id: "designation",
        title: "Distribution by Designation",
        icon: null,
        type: "bar",
        layout: "horizontal",
        data: sortedDesignationData,
        yAxisData: sortedDesignationData.map((d) => d.name),
        seriesData: [
          {
            data: sortedDesignationData.map((d) => d.value),
            label: "Employees",
            color: "#8B5CF6",
            valueFormatter: (value) => value.toString(),
          },
        ],
        color: "#8B5CF6",
        group: "Employment Details",
      };
    })(),
  ];

  const allWidgetConfigs = [
    {
      id: "totalworkforce",
      title: "Total Workforce",
      icon: null,
      color: "#3B82F6",
      group: "Total Workforce",
      value: employees.length,
    },
    {
      id: "totalEmployees",
      title: "Employees",
      icon: null,
      color: "#3B82F6",
      group: "Total Workforce",
      value: employees.length,
    },
   {
      id: "totalFreelancers",
      title: "Freelancers",
      icon: null,
      color: "#10B981",
      group: "Total Workforce",
      value: freelancers.length,
    },
    {
      id: "totalEmployees",
      title: "Employees",
      icon: null,
      color: "#3B82F6",
      group: "Employees",
      value: employees.length,
    },
    {
      id: "newJoiningThisMonth",
      title: "New Joining This Month",
      icon: null,
      color: "#10B981",
      group: "Employees",
      value: calculateWidgetValues.newJoining,
    },

    {
      id: "totalInterns",
      title: "Interns",
      icon: null,
      color: "#10B981",
      group: "Interns",
      value: interns.length,
    },

    {
      id: "newJoiningThisMonthInterns",
      title: "New Joining This Month",
      icon: null,
      color: "#10B981",
      group: "Interns",
      value: calculateInternWidgetValues.newJoining,
    },

    {
      id: "totalFreelancers",
      title: "Freelancers",
      icon: null,
      color: "#10B981",
      group: "Freelancers",
      value: freelancers.length,
    },

    {
      id: "newJoiningThisMonthFreelancers",
      title: "New Joining This Month",
      icon: null,
      color: "#10B981",
      group: "Freelancers",
      value: calculateInternWidgetValues.newJoining,
    },

    {
      id: "birthdayThisMonth",
      title: "Birthday This Month",
      icon: null,
      color: "#EC4899",
      group: "Occasions",
      value: calculateWidgetValues.birthday,
    },
    {
      id: "workAnniversariesThisMonth",
      title: "Work Anniversaries This Month",
      icon: null,
      color: "#F59E0B",
      group: "Occasions",
      value: calculateWidgetValues.anniversary,
    },

    {
      id: "presentToday",
      title: "Present Today",
      icon: null,
      color: "#10B981",
      group: "Time & Attendance",
      value: attendanceStats.present,
    },
    {
      id: "absentToday",
      title: "Absent Today",
      icon: null,
      color: "#EF4444",
      group: "Time & Attendance",
      value: attendanceStats.absent,
    },
    {
      id: "lateCheckInsToday",
      title: "Late Check-ins Today",
      icon: null,
      color: "#F59E0B",
      group: "Time & Attendance",
      value: attendanceStats.late,
    },

    {
      id: "onLeaveToday",
      title: "On Leave Today",
      icon: null,
      color: "#3B82F6",
      group: "Leaves",
      value: leavesStats.onLeaveToday,
    },
    {
      id: "upcomingLeaves",
      title: "Upcoming Leaves (7d)",
      icon: null,
      color: "#8B5CF6",
      group: "Leaves",
      value: leavesStats.upcomingLeaves,
    },
    {
      id: "pendingLeaveRequests",
      title: "Pending Leave Requests",
      icon: null,
      color: "#F97316",
      group: "Leaves",
      value: leavesStats.pending,
    },
  ];

  const [visibleChartIds, setVisibleChartIds] = React.useState([]);
  const [visibleWidgetIds, setVisibleWidgetIds] = React.useState([]);
  const [chartViewModes, setChartViewModes] = React.useState({});

  React.useEffect(() => {
    const savedChartSettings = localStorage.getItem("chartDisplaySettings");
    const savedWidgetSettings = localStorage.getItem("widgetDisplaySettings");

    if (savedChartSettings) {
      const parsedSettings = JSON.parse(savedChartSettings) || [];
      const savedMap = new Map(
        parsedSettings.map((s) => [
          s.id,
          { isVisible: !!s.isVisible, viewMode: s.viewMode || "chart" },
        ])
      );

      const mergedVisibleChartIds = allChartConfigs
        .filter((config) => {
          const saved = savedMap.get(config.id);
          return saved ? saved.isVisible : true;
        })
        .map((c) => c.id);

      setVisibleChartIds(mergedVisibleChartIds);

      const modes = {};
      allChartConfigs.forEach((chart) => {
        const saved = savedMap.get(chart.id);
        modes[chart.id] = saved?.viewMode || "chart";
      });
      setChartViewModes(modes);
    } else {
      setVisibleChartIds(allChartConfigs.map((config) => config.id));
      const modes = {};
      allChartConfigs.forEach((chart) => (modes[chart.id] = "chart"));
      setChartViewModes(modes);
    }

    if (savedWidgetSettings) {
      const parsedSettings = JSON.parse(savedWidgetSettings) || [];
      const savedMap = new Map(
        parsedSettings.map((s) => [s.id, !!s.isVisible])
      );

      const mergedVisibleWidgetIds = allWidgetConfigs
        .filter((config) => {
          const savedVisible = savedMap.get(config.id);
          return savedVisible !== undefined ? savedVisible : true;
        })
        .map((w) => w.id);

      setVisibleWidgetIds(mergedVisibleWidgetIds);
    } else {
      setVisibleWidgetIds(allWidgetConfigs.map((config) => config.id));
    }
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleWidgetClick = (widgetId, widgetTitle) => {
    if (widgetId === "totalworkforce") {
      navigate("/organization/employee/employee-details", { state: { fromDashboard: true, widgetId } });
      return;
    }
    if (widgetId === "totalEmployees" || widgetId === "newJoiningThisMonth") {
      navigate("/organization/employee/employee-details", { state: { fromDashboard: true, widgetId } });
      return;
    }
    if (widgetId === "totalFreelancers" || widgetId === "newJoiningThisMonthFreelancers") {
      navigate("/organization/freelancer/freelancer-details", { state: { fromDashboard: true, widgetId } });
      return;
    }
    if (widgetId === "totalInterns" || widgetId === "newJoiningThisMonthInterns") {
      navigate("/organization/intern/intern-details", { state: { fromDashboard: true, widgetId } });
      return;
    }
    if (widgetId === "birthdayThisMonth" || widgetId === "workAnniversariesThisMonth") {
      navigate("/organization/employee/employee-details", { state: { fromDashboard: true, widgetId } });
      return;
    }
    if (widgetId === "presentToday" || widgetId === "absentToday" || widgetId === "lateCheckInsToday") {
      navigate("/attendance/time-logs", { state: { fromDashboard: true, widgetId } });
      return;
    }
    if (widgetId === "onLeaveToday" || widgetId === "upcomingLeaves" || widgetId === "pendingLeaveRequests") {
      navigate("/leave/employee-leaves", { state: { fromDashboard: true, widgetId } });
      return;
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenPersonalizationPage = () => {
    navigate("dashboard/personalize-dashboard");
    handleCloseMenu();
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "#ffffff",
        display: "flex",
      }}
    >
      <Box
        sx={{
          width: drawerOpen ? "280px" : "0px",
          height: "100vh",
          backgroundColor: theme.palette.background.paper,
          boxShadow:
            theme.palette.mode === "dark"
              ? "2px 0 10px rgba(255,255,255,0.1)"
              : "2px 0 10px rgba(0,0,0,0.1)",
          transition: "width 0.3s ease-in-out",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
        }}
      >
        <Box sx={{ flex: 1, p: 2, minWidth: "280px" }}>
          {[
            {
              text: "Dashboard",
              icon: <BarChartIcon />,
            },
            {
              text: "Employees",
              icon: <PersonIcon />,
            },
            {
              text: "Reports",
              icon: <ShowChart />,
            },
            {
              text: "Calendar",
              icon: <CalendarToday />,
            },
          ].map((item) => (
            <Box
              key={item.text}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                mb: 1,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
              onClick={() => handleMenuItemClick(item.text)}
            >
              <Box sx={{ mr: 2, color: "text.secondary" }}>{item.icon}</Box>
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                {item.text}
              </Typography>
            </Box>
          ))}
          <Box
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              mt: 2,
              pt: 2,
            }}
          >
            {["Settings", "Help", "Logout"].map((item) => (
              <Box
                key={item}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.04)",
                  },
                }}
                onClick={() => handleMenuItemClick(item)}
              >
                <Box sx={{ mr: 2, color: "text.secondary" }}>
                  {item === "Settings" ? <SettingsIcon /> : <MoveToInbox />}
                </Box>
                <Typography variant="body1" sx={{ color: "text.primary" }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          p: 3,
          overflow: "auto",
          maxWidth: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: "semibold", color: "text.primary", mb: 1 }}
              >
                Dashboard
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                {formattedDate}
              </Typography>
            </Box>
          </Box>

          <Button
            aria-controls={open ? "settings-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ minWidth: "auto", p: 1, borderRadius: "50%" }}
          >
            <SettingsIcon sx={{ fontSize: 28, color: "text.secondary" }} />
          </Button>

          <Menu
            id="settings-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            MenuListProps={{
              "aria-labelledby": "settings-button",
            }}
          >
            <MenuItem onClick={handleOpenPersonalizationPage}>
              <DashboardCustomize sx={{ mr: 1 }} />
              Personalize Dashboard
            </MenuItem>
          </Menu>
        </Box>

        <Grid container spacing={3}>
          {(allWidgetConfigs.some(
            (w) => w.group === "Employees" && visibleWidgetIds.includes(w.id)
          ) ||
            allWidgetConfigs.some(
              (w) => w.group === "Occasions" && visibleWidgetIds.includes(w.id)
            ) ||
            allWidgetConfigs.some(
              (w) => w.group === "Total Workforce" && visibleWidgetIds.includes(w.id)
            ) ||
            allWidgetConfigs.some(
              (w) => w.group === "Interns" && visibleWidgetIds.includes(w.id)
            ) ||
            allWidgetConfigs.some(
              (w) =>
                w.group === "Freelancers" && visibleWidgetIds.includes(w.id)
            ) ||
            allWidgetConfigs.some(
              (w) =>
                w.group === "Time & Attendance" &&
                visibleWidgetIds.includes(w.id)
            ) ||
            allWidgetConfigs.some(
              (w) => w.group === "Leaves" && visibleWidgetIds.includes(w.id)
            )) && (
            <Grid container spacing={2}>
              {/* Employees */}
              {allWidgetConfigs
                .filter((w) => w.group === "Total Workforce")
                .some((w) => visibleWidgetIds.includes(w.id)) && (
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: "semibold",
                      color: "text.primary",
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Total Workforce
                  </Typography>
                  <Grid container spacing={2}>
                    {allWidgetConfigs
                      .filter(
                        (w) =>
                          w.group === "Total Workforce" &&
                          visibleWidgetIds.includes(w.id)
                      )
                      .map((widget) => (
                        <Grid item xs={12} sm={12} md={6} key={widget.id}>
                          <Card
                            sx={{
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "rgba(255, 255, 255, 0.05)"
                                  : "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(4px)",
                              border: "none",
                              boxShadow: 3,
                              transition: "all 0.3s ease-in-out",
                              "&:hover": {
                                boxShadow: 6,
                                transform: "scale(1.02)",
                              },
                              height: "160px",
                              width: { xs: "80vw", sm: "50vw", lg: "17vw" },
                              margin: "0 auto",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleWidgetClick(widget.id, widget.title)
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleWidgetClick(widget.id, widget.title);
                              }
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              {widget.id === "totalworkforce" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Tooltip title={widget.title} placement="top">
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                        mb: 0.5,
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      {widget.title}
                                    </Typography>
                                  </Tooltip>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: "medium",
                                      mb: 2,
                                    }}
                                  >
                                    Total
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      fontWeight: "semibold",
                                      color: "text.primary",
                                    }}
                                  >
                                    {widget.value}
                                  </Typography>
                                </Box>
                              ) : widget.id === "totalEmployees" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Tooltip title="Total Employess" placement="top">
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                        mb: 0.5,
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      Employees
                                    </Typography>
                                  </Tooltip>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: "medium",
                                      mb: 2,
                                    }}
                                  >
                                    Total
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      fontWeight: "semibold",
                                      color: "text.primary",
                                    }}
                                  >
                                    {widget.value}
                                  </Typography>
                                </Box>
                              ) : widget.id === "totalFreelancers" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Tooltip title="Total Employess" placement="top">
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                        mb: 0.5,
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      Freelancers
                                    </Typography>
                                  </Tooltip>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: "medium",
                                      mb: 2,
                                    }}
                                  >
                                    Total
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      fontWeight: "semibold",
                                      color: "text.primary",
                                    }}
                                  >
                                    {widget.value}
                                  </Typography>
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        color: "text.secondary",
                                        fontWeight: "medium",
                                        mb: 2,
                                      }}
                                    >
                                      {widget.title}
                                    </Typography>
                                    <Typography
                                      variant="h4"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                      }}
                                    >
                                      {widget.value}
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              )}
              {/* Employees */}
              {allWidgetConfigs
                .filter((w) => w.group === "Employees")
                .some((w) => visibleWidgetIds.includes(w.id)) && (
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: "semibold",
                      color: "text.primary",
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Employees
                  </Typography>
                  <Grid container spacing={2}>
                    {allWidgetConfigs
                      .filter(
                        (w) =>
                          w.group === "Employees" &&
                          visibleWidgetIds.includes(w.id)
                      )
                      .map((widget) => (
                        <Grid item xs={12} sm={12} md={6} key={widget.id}>
                          <Card
                            sx={{
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "rgba(255, 255, 255, 0.05)"
                                  : "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(4px)",
                              border: "none",
                              boxShadow: 3,
                              transition: "all 0.3s ease-in-out",
                              "&:hover": {
                                boxShadow: 6,
                                transform: "scale(1.02)",
                              },
                              height: "160px",
                              width: { xs: "80vw", sm: "50vw", lg: "17vw" },
                              margin: "0 auto",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleWidgetClick(widget.id, widget.title)
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleWidgetClick(widget.id, widget.title);
                              }
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              {widget.id === "totalEmployees" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Tooltip title={widget.title} placement="top">
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                        mb: 0.5,
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      {widget.title}
                                    </Typography>
                                  </Tooltip>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: "medium",
                                      mb: 2,
                                    }}
                                  >
                                    Total
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      fontWeight: "semibold",
                                      color: "text.primary",
                                    }}
                                  >
                                    {widget.value}
                                  </Typography>
                                </Box>
                              ) : widget.id === "newJoiningThisMonth" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Tooltip title="New Joining" placement="top">
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                        mb: 0.5,
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      New Joining
                                    </Typography>
                                  </Tooltip>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: "medium",
                                      mb: 2,
                                    }}
                                  >
                                    This Month
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      fontWeight: "semibold",
                                      color: "text.primary",
                                    }}
                                  >
                                    {widget.value}
                                  </Typography>
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        color: "text.secondary",
                                        fontWeight: "medium",
                                        mb: 2,
                                      }}
                                    >
                                      {widget.title}
                                    </Typography>
                                    <Typography
                                      variant="h4"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                      }}
                                    >
                                      {widget.value}
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              )}

              {/* Occasions */}
              {allWidgetConfigs
                .filter((w) => w.group === "Occasions")
                .some((w) => visibleWidgetIds.includes(w.id)) && (
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: "semibold",
                      color: "text.primary",
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Occasions
                  </Typography>
                  <Grid container spacing={2}>
                    {allWidgetConfigs
                      .filter(
                        (w) =>
                          w.group === "Occasions" &&
                          visibleWidgetIds.includes(w.id)
                      )
                      .map((widget) => (
                        <Grid item xs={12} sm={12} key={widget.id}>
                          <Card
                            sx={{
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "rgba(255, 255, 255, 0.05)"
                                  : "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(4px)",
                              border: "none",
                              boxShadow: 3,
                              transition: "all 0.3s ease-in-out",
                              "&:hover": {
                                boxShadow: 6,
                                transform: "scale(1.02)",
                              },
                              height: "160px",
                              width: { xs: "80vw", sm: "50vw", lg: "17vw" },
                              margin: "0 auto",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleWidgetClick(widget.id, widget.title)
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleWidgetClick(widget.id, widget.title);
                              }
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              {widget.id === "birthdayThisMonth" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Tooltip title="Birthday" placement="top">
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                        mb: 0.5,
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      Birthday
                                    </Typography>
                                  </Tooltip>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: "medium",
                                      mb: 2,
                                    }}
                                  >
                                    This Month
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      fontWeight: "semibold",
                                      color: "text.primary",
                                    }}
                                  >
                                    {widget.value}
                                  </Typography>
                                </Box>
                              ) : widget.id === "workAnniversariesThisMonth" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Tooltip
                                    title="Work Anniversaries"
                                    placement="top"
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                        mb: 0.5,
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      Work Anniversaries
                                    </Typography>
                                  </Tooltip>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: "medium",
                                      mb: 2,
                                    }}
                                  >
                                    This Month
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      fontWeight: "semibold",
                                      color: "text.primary",
                                    }}
                                  >
                                    {widget.value}
                                  </Typography>
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        color: "text.secondary",
                                        fontWeight: "medium",
                                        mb: 2,
                                      }}
                                    >
                                      {widget.title}
                                    </Typography>
                                    <Typography
                                      variant="h4"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                      }}
                                    >
                                      {widget.value}
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              )}

              {/* Interns - UPDATED with proper functionality */}
              {allWidgetConfigs
                .filter((w) => w.group === "Interns")
                .some((w) => visibleWidgetIds.includes(w.id)) && (
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: "semibold",
                      color: "text.primary",
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Interns
                  </Typography>
                  <Grid container spacing={2}>
                    {allWidgetConfigs
                      .filter(
                        (w) =>
                          w.group === "Interns" &&
                          visibleWidgetIds.includes(w.id)
                      )
                      .map((widget) => (
                        <Grid item xs={12} sm={12} md={6} key={widget.id}>
                          <Card
                            sx={{
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "rgba(255, 255, 255, 0.05)"
                                  : "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(4px)",
                              border: "none",
                              boxShadow: 3,
                              transition: "all 0.3s ease-in-out",
                              "&:hover": {
                                boxShadow: 6,
                                transform: "scale(1.02)",
                              },
                              height: "160px",
                              width: { xs: "80vw", sm: "50vw", lg: "17vw" },
                              margin: "0 auto",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleWidgetClick(widget.id, widget.title)
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleWidgetClick(widget.id, widget.title);
                              }
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              {widget.id === "totalInterns" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Tooltip title={widget.title} placement="top">
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                        mb: 0.5,
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      {widget.title}
                                    </Typography>
                                  </Tooltip>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: "medium",
                                      mb: 2,
                                    }}
                                  >
                                    Total
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      fontWeight: "semibold",
                                      color: "text.primary",
                                    }}
                                  >
                                    {widget.value}
                                  </Typography>
                                </Box>
                              ) : widget.id === "newJoiningThisMonthInterns" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Tooltip title="New Joining" placement="top">
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                        mb: 0.5,
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      New Joining
                                    </Typography>
                                  </Tooltip>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: "medium",
                                      mb: 2,
                                    }}
                                  >
                                    This Month
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      fontWeight: "semibold",
                                      color: "text.primary",
                                    }}
                                  >
                                    {widget.value}
                                  </Typography>
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        color: "text.secondary",
                                        fontWeight: "medium",
                                        mb: 2,
                                      }}
                                    >
                                      {widget.title}
                                    </Typography>
                                    <Typography
                                      variant="h4"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                      }}
                                    >
                                      {widget.value}
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              )}


              {/* Freelancers */}
              {allWidgetConfigs
                .filter((w) => w.group === "Freelancers")
                .some((w) => visibleWidgetIds.includes(w.id)) && (
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: "semibold",
                      color: "text.primary",
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Freelancers
                  </Typography>
                  <Grid container spacing={2}>
                    {allWidgetConfigs
                      .filter(
                        (w) =>
                          w.group === "Freelancers" &&
                          visibleWidgetIds.includes(w.id)
                      )
                      .map((widget) => (
                        <Grid item xs={12} sm={12} md={6} key={widget.id}>
                          <Card
                            sx={{
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "rgba(255, 255, 255, 0.05)"
                                  : "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(4px)",
                              border: "none",
                              boxShadow: 3,
                              transition: "all 0.3s ease-in-out",
                              "&:hover": {
                                boxShadow: 6,
                                transform: "scale(1.02)",
                              },
                              height: "160px",
                              width: { xs: "80vw", sm: "50vw", lg: "17vw" },
                              margin: "0 auto",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleWidgetClick(widget.id, widget.title)
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ")
                                handleWidgetClick(widget.id, widget.title);
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              {widget.id === "totalFreelancers" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Tooltip title={widget.title} placement="top">
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                        mb: 0.5,
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      {widget.title}
                                    </Typography>
                                  </Tooltip>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: "medium",
                                      mb: 2,
                                    }}
                                  >
                                    Total
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      fontWeight: "semibold",
                                      color: "text.primary",
                                    }}
                                  >
                                    {widget.value}
                                  </Typography>
                                </Box>
                              ) : widget.id ===
                                "newJoiningThisMonthFreelancers" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Tooltip title="New Joining" placement="top">
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                        mb: 0.5,
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      New Joining
                                    </Typography>
                                  </Tooltip>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: "medium",
                                      mb: 2,
                                    }}
                                  >
                                    This Month
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      fontWeight: "semibold",
                                      color: "text.primary",
                                    }}
                                  >
                                    {widget.value}
                                  </Typography>
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        color: "text.secondary",
                                        fontWeight: "medium",
                                        mb: 2,
                                      }}
                                    >
                                      {widget.title}
                                    </Typography>
                                    <Typography
                                      variant="h4"
                                      sx={{
                                        fontWeight: "semibold",
                                        color: "text.primary",
                                      }}
                                    >
                                      {widget.value}
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              )}

              {/* Time & Attendance and Leaves */}
              {(allWidgetConfigs
                .filter((w) => w.group === "Time & Attendance")
                .some((w) => visibleWidgetIds.includes(w.id)) ||
                allWidgetConfigs
                  .filter((w) => w.group === "Leaves")
                  .some((w) => visibleWidgetIds.includes(w.id))) && (
                <Grid container spacing={2} sx={{ mt: 0 }}>
                  {allWidgetConfigs
                    .filter((w) => w.group === "Time & Attendance")
                    .some((w) => visibleWidgetIds.includes(w.id)) && (
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: "semibold",
                          color: "text.primary",
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        Time & Attendance
                      </Typography>
                      <Grid container spacing={2}>
                        {allWidgetConfigs
                          .filter(
                            (w) =>
                              w.group === "Time & Attendance" &&
                              visibleWidgetIds.includes(w.id)
                          )
                          .map((widget) => (
                            <Grid item xs={12} sm={12} md={6} key={widget.id}>
                              <Card
                                sx={{
                                  bgcolor:
                                    theme.palette.mode === "dark"
                                      ? "rgba(255, 255, 255, 0.05)"
                                      : "rgba(255, 255, 255, 0.8)",
                                  backdropFilter: "blur(4px)",
                                  border: "none",
                                  boxShadow: 3,
                                  transition: "all 0.3s ease-in-out",
                                  "&:hover": {
                                    boxShadow: 6,
                                    transform: "scale(1.02)",
                                  },
                                  height: "160px",
                                  width: { xs: "80vw", sm: "50vw", lg: "17vw" },
                                  margin: "0 auto",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleWidgetClick(widget.id, widget.title)
                                }
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    handleWidgetClick(widget.id, widget.title);
                                  }
                                }}
                              >
                                <CardContent sx={{ p: 3 }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        variant="subtitle1"
                                        sx={{
                                          color: "text.secondary",
                                          fontWeight: "medium",
                                          mb: 2,
                                        }}
                                      >
                                        {widget.title}
                                      </Typography>
                                      <Typography
                                        variant="h4"
                                        sx={{
                                          fontWeight: "semibold",
                                          color: "text.primary",
                                        }}
                                      >
                                        {widget.value}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                      </Grid>
                    </Grid>
                  )}

                  {allWidgetConfigs
                    .filter((w) => w.group === "Leaves")
                    .some((w) => visibleWidgetIds.includes(w.id)) && (
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: "semibold",
                          color: "text.primary",
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        Leaves
                      </Typography>
                      <Grid container spacing={2}>
                        {allWidgetConfigs
                          .filter(
                            (w) =>
                              w.group === "Leaves" &&
                              visibleWidgetIds.includes(w.id)
                          )
                          .map((widget) => (
                            <Grid item xs={12} sm={12} md={6} key={widget.id}>
                              <Card
                                sx={{
                                  bgcolor:
                                    theme.palette.mode === "dark"
                                      ? "rgba(255, 255, 255, 0.05)"
                                      : "rgba(255, 255, 255, 0.8)",
                                  backdropFilter: "blur(4px)",
                                  border: "none",
                                  boxShadow: 3,
                                  transition: "all 0.3s ease-in-out",
                                  "&:hover": {
                                    boxShadow: 6,
                                    transform: "scale(1.02)",
                                  },
                                  height: "160px",
                                  width: { xs: "80vw", sm: "50vw", lg: "17vw" },
                                  margin: "0 auto",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleWidgetClick(widget.id, widget.title)
                                }
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    handleWidgetClick(widget.id, widget.title);
                                  }
                                }}
                              >
                                <CardContent sx={{ p: 3 }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        variant="subtitle1"
                                        sx={{
                                          color: "text.secondary",
                                          fontWeight: "medium",
                                          mb: 2,
                                        }}
                                      >
                                        {widget.title}
                                      </Typography>
                                      <Typography
                                        variant="h4"
                                        sx={{
                                          fontWeight: "semibold",
                                          color: "text.primary",
                                        }}
                                      >
                                        {widget.value}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          )}

          {allChartConfigs.some((chart) =>
            visibleChartIds.includes(chart.id)
          ) && (
            <Box sx={{ mt: 6 }}>
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: "semibold",
                  color: "text.primary",
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ShowChart sx={{ fontSize: 28, color: "#4F46E5" }} />
                Employee Distribution Analytics
              </Typography>
              <Grid container spacing={2}>
                {allChartConfigs
                  .filter((chart) => visibleChartIds.includes(chart.id))
                  .map((chart) => (
                    <Grid item lg={6} sm={12} key={chart.id}>
                      <Card
                        sx={{
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(255, 255, 255, 0.8)",
                          backdropFilter:
                            chartViewModes[chart.id] === "chart"
                              ? "blur(4px)"
                              : "none",
                          border: "none",
                          boxShadow: 3,
                          width: {
                            xs: "80vw",
                            sm: "80vw",
                            md: "80vw",
                            lg: "43vw",
                          },
                          height: "450px",
                          display: "flex",
                          flexDirection: "column",
                          "&:hover": {
                            boxShadow: 6,
                            transform:
                              chartViewModes[chart.id] === "chart"
                                ? "scale(1.02)"
                                : "none",
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 3,
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: "semibold",
                              color: "text.primary",
                              mb: 2,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {chart.icon &&
                              React.createElement(chart.icon, {
                                sx: { fontSize: 20, color: chart.color },
                              })}
                            {chart.title}
                          </Typography>

                          {chartViewModes[chart.id] === "chart" ? (
                            chart.type === "pie" ? (
                              <PieChart
                                series={[
                                  {
                                    data:
                                      chart.data.length > 0
                                        ? chart.data
                                        : [
                                            {
                                              id: 0,
                                              value: 1,
                                              label: "No Data",
                                              color: "#E5E7EB",
                                            },
                                          ],
                                    arcLabel: (item) => {
                                      const total = chart.data.reduce(
                                        (sum, dataItem) => sum + dataItem.value,
                                        0
                                      );
                                      const percentage =
                                        total > 0
                                          ? Math.round(
                                              (item.value / total) * 100
                                            )
                                          : 0;
                                      return `${percentage}%`;
                                    },
                                    arcLabelMinAngle: 35,
                                    arcLabelRadius: "60%",
                                  },
                                ]}
                                width={400}
                                height={300}
                                margin={{
                                  top: 40,
                                  bottom: 40,
                                  left: 40,
                                  right: 40,
                                }}
                                sx={{
                                  [`& .${pieArcLabelClasses.root}`]: {
                                    fontWeight: "normal",
                                  },
                                }}
                              />
                            ) : (
                              <BarChart
                                dataset={chart.data}
                                layout={chart.layout || "vertical"}
                                xAxis={
                                  chart.layout === "horizontal"
                                    ? [
                                        {
                                          width: 50,
                                          valueFormatter: (value) =>
                                            Math.round(value).toString(),
                                          tickNumber: 5,
                                          tickMinStep: 1,
                                        },
                                      ]
                                    : [
                                        {
                                          scaleType: "band",
                                          data: chart.xAxisData,
                                        },
                                      ]
                                }
                                yAxis={
                                  chart.layout === "horizontal"
                                    ? [
                                        {
                                          scaleType: "band",
                                          data: chart.yAxisData,
                                          width: Math.min(
                                            160,
                                            Math.max(
                                              80,
                                              Math.max(
                                                ...(chart.yAxisData || []).map(
                                                  (n) => String(n).length
                                                )
                                              ) * 8
                                            )
                                          ),
                                        },
                                      ]
                                    : [
                                        {
                                          width: 30,
                                          valueFormatter: (value) =>
                                            Math.round(value).toString(),
                                          tickNumber: 5,
                                          tickMinStep: 1,
                                        },
                                      ]
                                }
                                series={chart.seriesData}
                                height={300}
                                barLabel="value"
                                margin={{
                                  left: chart.layout === "horizontal" ? 10 : 0,
                                  right: 20,
                                  top: 20,
                                  bottom: 20,
                                }}
                                slotProps={{
                                  legend: {
                                    direction: "row",
                                    position: {
                                      vertical: "top",
                                      horizontal: "middle",
                                    },
                                    padding: 0,
                                    itemMarkWidth: 10,
                                    itemMarkHeight: 10,
                                    labelStyle: { fontSize: 12 },
                                  },
                                  tooltip: {
                                    classes: {
                                      root: "MuiChartsTooltip-root",
                                    },
                                  },
                                }}
                              />
                            )
                          ) : (
                            <Box
                              sx={{
                                flex: 1,
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <DataGrid
                                rowBuffer={2}
                                rowThreshold={0}
                                sx={{
                                  flex: 1,
                                  "& .MuiDataGrid-main": {
                                    height: "100%",
                                  },
                                }}
                                rows={chart.data.map((row, index) => ({
                                  id: `${chart.id}-${index}`,
                                  label: row.label || row.name,
                                  value: row.value,
                                }))}
                                columns={[
                                  {
                                    field: "label",
                                    headerName:
                                      chart.type === "pie" ? "Label" : "Name",
                                    flex: 1,
                                    headerAlign: "center",
                                    align: "center",
                                  },
                                  {
                                    field: "value",
                                    headerName: "Value",
                                    type: "number",
                                    flex: 1,
                                    headerAlign: "center",
                                    align: "center",
                                  },
                                ]}
                                pageSizeOptions={[5, 10, 25]}
                                initialState={{
                                  pagination: {
                                    paginationModel: { pageSize: 5 },
                                  },
                                }}
                                disableRowSelectionOnClick
                              />
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
