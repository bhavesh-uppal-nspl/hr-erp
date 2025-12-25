"use client";
import * as React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Button,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  People,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  AddCircleOutline,
  CalendarMonth,
  BusinessCenter,
  Language,
  Close,
  GridView,
  ShowChart,
  DragIndicator,
} from "@mui/icons-material";
import { TableIcon } from "lucide-react";
import { PieChart, BarChart } from "@mui/x-charts";
import { useNavigate } from "react-router-dom";
import employeesData from "./employees.json";

// DND-Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Helper component for TabPanel content
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// Helper to calculate age
const calculateAge = (dob) => {
  const currentDate = new Date();
  const birthDate = new Date(dob);
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

// SortableItem component for drag and drop
function SortableItem({ id, children, secondaryAction, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      sx={{
        pr: { xs: 2, sm: 23 },
        pl: { xs: 1, sm: 2 },
        py: { xs: 1.5, sm: 1 },
        minHeight: { xs: 56, sm: 48 },
      }}
      button
      secondaryAction={secondaryAction}
    >
      <IconButton
        {...listeners}
        sx={{
          cursor: "grab",
          mr: { xs: 0.5, sm: 1 },
          p: { xs: 1, sm: 1 },
          minWidth: { xs: 40, sm: "auto" },
          minHeight: { xs: 40, sm: "auto" },
        }}
      >
        <DragIndicator sx={{ fontSize: { xs: 20, sm: 18 } }} />
      </IconButton>
      {children}
    </ListItem>
  );
}

export default function PersonalizationPage({ onClose }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const columnWidthSm = 90;
  const columnWidthXs = 60;
  const dividerMarginPx = 16;
  const secondaryActionWidthSm = columnWidthSm * 2 + dividerMarginPx;
  const secondaryActionWidthXs = columnWidthXs * 2 + dividerMarginPx;
  const employees = employeesData;

  // Chart configurations (keep existing)
  const genderCounts = employees.reduce((acc, emp) => {
    acc[emp.gender] = (acc[emp.gender] || 0) + 1;
    return acc;
  }, {});
  const genderData = [
    {
      id: "male",
      value: genderCounts["Male"] || 0,
      label: "Male",
      color: "#3B82F6",
    },
    {
      id: "female",
      value: genderCounts["Female"] || 0,
      label: "Female",
      color: "#EC4899",
    },
  ];

  const departmentCounts = employees.reduce((acc, emp) => {
    const departmentName =
      emp.department_location[0]?.department?.department_name || "Unknown";
    acc[departmentName] = (acc[departmentName] || 0) + 1;
    return acc;
  }, {});

  const departmentData = Object.entries(departmentCounts).map(
    ([name, value]) => ({ name, value })
  );

  const employmentTypeCounts = employees.reduce((acc, emp) => {
    const employmentTypeName =
      emp.employemnettype?.employment_type_name || "Unknown";
    acc[employmentTypeName] = (acc[employmentTypeName] || 0) + 1;
    return acc;
  }, {});

  const employmentTypeData = Object.entries(employmentTypeCounts).map(
    ([name, value]) => ({ name, value })
  );

  const designationCounts = employees.reduce((acc, emp) => {
    const designationName = emp.designation?.designation_name || "Unknown";
    acc[designationName] = (acc[designationName] || 0) + 1;
    return acc;
  }, {});

  const designationData = Object.entries(designationCounts).map(
    ([name, value]) => ({ name, value })
  );

  const ageGroupCounts = employees.reduce((acc, emp) => {
    const age = calculateAge(emp.date_of_birth);
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
  ];

  const experienceCounts = employees.reduce((acc, emp) => {
    const currentDate = new Date();
    const joiningDate = new Date(emp.date_of_joining);
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
      emp.department_location[0]?.department?.department_name || "Unknown";
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
      icon: PieChartIcon,
      type: "pie",
      data: genderData,
      color: "#3B82F6",
      group: "Demographics",
    },
    {
      id: "ageGroup",
      title: "Distribution by Age Group",
      icon: PieChartIcon,
      type: "pie",
      data: ageGroupData,
      color: "#EF4444",
      group: "Demographics",
    },
    {
      id: "department",
      title: "Distribution by Department",
      icon: BarChartIcon,
      type: "bar",
      data: departmentData,
      xAxisData: departmentData.map((d) => d.name),
      seriesData: [
        {
          data: departmentData.map((d) => d.value),
          label: "Employees",
          color: "#10B981",
        },
      ],
      color: "#10B981",
      group: "Employment Details",
    },
    {
      id: "employmentType",
      title: "Distribution by Employment Type",
      icon: BarChartIcon,
      type: "bar",
      data: employmentTypeData,
      xAxisData: employmentTypeData.map((d) => d.name),
      seriesData: [
        {
          data: employmentTypeData.map((d) => d.value),
          label: "Employees",
          color: "#F97316",
        },
      ],
      color: "#F97316",
      group: "Employment Details",
    },
    {
      id: "experience",
      title: "Distribution by Experience Level",
      icon: BarChartIcon,
      layout: "horizontal",
      data: experienceData,
      yAxisData: experienceData.map((d) => d.name),
      seriesData: [
        {
          data: experienceData.map((d) => d.value),
          label: "Employees",
          color: "#10B981",
        },
      ],
      color: "#10B981",
      group: "Employment Details",
    },
    {
      id: "organization",
      title: "Distribution by Organization Units",
      icon: BarChartIcon,
      type: "bar",
      data: organizationData,
      xAxisData: organizationData.map((d) => d.name),
      seriesData: [
        {
          data: organizationData.map((d) => d.value),
          label: "Employees",
          color: "#3B82F6",
        },
      ],
      color: "#3B82F6",
      group: "Employment Details",
    },
    {
      id: "designation",
      title: "Distribution by Designation",
      icon: BarChartIcon,
      layout: "horizontal",
      data: designationData,
      yAxisData: designationData.map((d) => d.name),
      seriesData: [
        {
          data: designationData.map((d) => d.value),
          label: "Employees",
          color: "#8B5CF6",
        },
      ],
      color: "#8B5CF6",
      group: "Employment Details",
    },
  ];

  const totalEmployees = employees.length;
  const newJoiningThisMonth = employees.filter((emp) => {
    const date = new Date(emp.date_of_joining);
    return (
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    );
  }).length;
  const birthdayThisMonth = employees.filter(
    (emp) => new Date(emp.date_of_birth).getMonth() === new Date().getMonth()
  ).length;
  const workAnniversariesThisMonth = employees.filter((emp) => {
    const date = new Date(emp.date_of_joining);
    return (
      date.getMonth() === new Date().getMonth() &&
      date.getDate() === new Date().getDate()
    );
  }).length;

  // UPDATED: Added intern widgets
  const allWidgetConfigs = [
    {
      id: "totalworkforce",
      title: "Total Workforce",
      icon: null,
      color: "3B82F6", // blue color consistent with workforce
      group: "Total Workforce",
      value: totalEmployees, // or employees.length as in your code
      description:
        "Total number of employees including all types in the organization",
    },
    {
      id: "totalEmployees",
      title: "Employees",
      icon: null,
      color: "#3B82F6",
      group: "Employees",
      value: totalEmployees,
      description: "Total number of employees in the organization",
    },
    {
      id: "newJoiningThisMonth",
      title: "New Joining This Month",
      icon: null,
      color: "#10B981",
      group: "Employees",
      value: newJoiningThisMonth,
      description: "Number of new employees who joined this month",
    },
    {
      id: "totalInterns",
      title: "Interns",
      icon: null,
      color: "#10B981",
      group: "Interns",
      value: 0,
      description: "Total number of interns in the organization",
    },
    {
      id: "newJoiningThisMonthInterns",
      title: "New Joining This Month",
      icon: null,
      color: "#10B981",
      group: "Interns",
      value: 0,
      description: "Number of new interns who joined this month",
    },
    {
      id: "totalFreelancers",
      title: "Freelancers",
      icon: null,
      color: "#10B981",
      group: "Freelancers",
      value: 0,
      description: "Total number of freelancers in the organization",
    },
    {
      id: "newJoiningThisMonthFreelancers",
      title: "New Joining This Month",
      icon: null,
      color: "#10B981",
      group: "Freelancers",
      value: 0,
      description: "Number of new freelancers who joined this month",
    },

    {
      id: "birthdayThisMonth",
      title: "Birthday This Month",
      icon: null,
      color: "#EC4899",
      group: "Occasions",
      value: birthdayThisMonth,
      description: "Number of employees having their birthday this month",
    },
    {
      id: "workAnniversariesThisMonth",
      icon: null,
      title: "Work Anniversaries This Month",
      color: "#F59E0B",
      group: "Occasions",
      value: workAnniversariesThisMonth,
      description:
        "Number of employees celebrating their work anniversary this month",
    },
    {
      id: "presentToday",
      title: "Present Today",
      icon: null,
      color: "#10B981",
      group: "Time & Attendance",
      value: 0,
      description: "Number of employees present today",
    },
    {
      id: "absentToday",
      title: "Absent Today",
      icon: null,
      color: "#EF4444",
      group: "Time & Attendance",
      value: 0,
      description: "Number of employees absent today",
    },
    {
      id: "lateCheckInsToday",
      title: "Late Check-ins Today",
      icon: null,
      color: "#F59E0B",
      group: "Time & Attendance",
      value: 0,
      description: "Employees with late check-ins today",
    },
    {
      id: "onLeaveToday",
      title: "On Leave Today",
      icon: null,
      color: "#3B82F6",
      group: "Leaves",
      value: 0,
      description: "Employees on leave today",
    },
    {
      id: "upcomingLeaves",
      title: "Upcoming Leaves (7d)",
      icon: null,
      color: "#8B5CF6",
      group: "Leaves",
      value: 0,
      description: "Leaves starting within the next 7 days",
    },
    {
      id: "pendingLeaveRequests",
      title: "Pending Leave Requests",
      icon: null,
      color: "#F97316",
      group: "Leaves",
      value: 0,
      description: "Pending leave requests awaiting approval",
    },
  ];

  const [selectedTab, setSelectedTab] = React.useState(0);
  const [tempChartDisplaySettings, setTempChartDisplaySettings] =
    React.useState([]);
  const [tempWidgetDisplaySettings, setTempWidgetDisplaySettings] =
    React.useState([]);
  const [previewKey, setPreviewKey] = React.useState(null);

  React.useEffect(() => {
    const savedChartSettings = localStorage.getItem("chartDisplaySettings");
    const savedWidgetSettings = localStorage.getItem("widgetDisplaySettings");

    const mergeChartSettings = (saved) => {
      const savedMap = new Map((saved || []).map((s) => [s.id, s]));
      const kept = (saved || []).filter((s) =>
        allChartConfigs.some((c) => c.id === s.id)
      );
      const appended = allChartConfigs
        .filter((c) => !savedMap.has(c.id))
        .map((c) => ({ id: c.id, isVisible: true, viewMode: "chart" }));
      return [...kept, ...appended];
    };

    const mergeWidgetSettings = (saved) => {
      const savedMap = new Map((saved || []).map((s) => [s.id, s]));
      const kept = (saved || []).filter((s) =>
        allWidgetConfigs.some((w) => w.id === s.id)
      );
      const appended = allWidgetConfigs
        .filter((w) => !savedMap.has(w.id))
        .map((w) => ({ id: w.id, isVisible: true }));
      return [...kept, ...appended];
    };

    const initialChartSettings = savedChartSettings
      ? mergeChartSettings(JSON.parse(savedChartSettings))
      : allChartConfigs.map((chart) => ({
          id: chart.id,
          isVisible: true,
          viewMode: "chart",
        }));

    const initialWidgetSettings = savedWidgetSettings
      ? mergeWidgetSettings(JSON.parse(savedWidgetSettings))
      : allWidgetConfigs.map((widget) => ({
          id: widget.id,
          isVisible: true,
        }));

    setTempChartDisplaySettings(initialChartSettings);
    setTempWidgetDisplaySettings(initialWidgetSettings);
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleToggleVisibility = (id, type) => {
    if (type === "chart") {
      setTempChartDisplaySettings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isVisible: !item.isVisible } : item
        )
      );
    } else {
      setTempWidgetDisplaySettings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isVisible: !item.isVisible } : item
        )
      );
    }
  };

  const handleToggleViewMode = (id) => {
    setTempChartDisplaySettings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, viewMode: item.viewMode === "chart" ? "table" : "chart" }
          : item
      )
    );
  };

  const handleApply = () => {
    localStorage.setItem(
      "chartDisplaySettings",
      JSON.stringify(tempChartDisplaySettings)
    );
    localStorage.setItem(
      "widgetDisplaySettings",
      JSON.stringify(tempWidgetDisplaySettings)
    );
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  const togglePreview = (type, id) => {
    const key = `${type}:${id}`;
    setPreviewKey((prev) => (prev === key ? null : key));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      if (selectedTab === 0) {
        setTempWidgetDisplaySettings((prevItems) => {
          const oldIndex = prevItems.findIndex((item) => item.id === active.id);
          const newIndex = prevItems.findIndex((item) => item.id === over.id);
          return arrayMove(prevItems, oldIndex, newIndex);
        });
      } else {
        setTempChartDisplaySettings((prevItems) => {
          const oldIndex = prevItems.findIndex((item) => item.id === active.id);
          const newIndex = prevItems.findIndex((item) => item.id === over.id);
          return arrayMove(prevItems, oldIndex, newIndex);
        });
      }
    }
  };

  const renderGroupedListItems = (items, tempSettings, type) => {
    const orderedDisplayItems = tempSettings
      .map((setting) => {
        const originalItem = items.find((item) => item.id === setting.id);
        return originalItem ? { ...originalItem, ...setting } : null;
      })
      .filter(Boolean);

    const groupIcons = {
      "Total Workforce": People,
      Employees: People,
      Interns: People, // ADDED: Icon for Interns group
      Freelancers: People,
      Occasions: CalendarMonth,
      Demographics: People,
      "Employment Details": BusinessCenter,
      Skills: Language,
      "Time & Attendance": BusinessCenter,
      Leaves: Language,
    };

    const groupOrder = [
      "Employees",
      "Interns", // ADDED: Interns group in order
      "Freelancers",
      "Occasions",
      "Demographics",
      "Employment Details",
      "Skills",
      "Time & Attendance",
      "Leaves",
      "Ungrouped",
    ];

    let lastGroupRendered = null;

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedDisplayItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <List disablePadding>
            {orderedDisplayItems.map((item, index) => {
              const currentGroup = item.group || "Ungrouped";
              const renderGroupHeader = currentGroup !== lastGroupRendered;
              lastGroupRendered = currentGroup;

              const isVisible = item.isVisible;
              const isPreviewOpen = previewKey === `${type}:${item.id}`;

              return (
                <React.Fragment key={item.id}>
                  {renderGroupHeader && (
                    <>
                      {index > 0 && <Divider sx={{ my: 2 }} />}
                      <ListItem
                        sx={{
                          py: 1,
                          mt: index === 0 ? 0 : 2,
                          pr: { xs: 2, sm: 23 },
                          pl: { xs: 1, sm: 2 },
                        }}
                        secondaryAction={
                          type === "chart" ? (
                            <Box
                              sx={{
                                width: {
                                  xs: secondaryActionWidthXs,
                                  sm: secondaryActionWidthSm,
                                },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Box
                                sx={{
                                  width: {
                                    xs: columnWidthXs,
                                    sm: columnWidthSm,
                                  },
                                  textAlign: "center",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  noWrap
                                  sx={{
                                    fontWeight: "semibold",
                                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                  }}
                                >
                                  Hide / Show
                                </Typography>
                              </Box>
                              <Divider
                                orientation="vertical"
                                flexItem
                                sx={{ mx: 1 }}
                              />
                              <Box
                                sx={{
                                  width: {
                                    xs: columnWidthXs,
                                    sm: columnWidthSm,
                                  },
                                  textAlign: "center",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  noWrap
                                  sx={{
                                    fontWeight: "semibold",
                                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                  }}
                                >
                                  Change View
                                </Typography>
                              </Box>
                            </Box>
                          ) : type === "widget" ? (
                            <Box
                              sx={{
                                width: { xs: columnWidthXs, sm: columnWidthSm },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                                sx={{
                                  fontWeight: "semibold",
                                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                }}
                              >
                                Hide / Show
                              </Typography>
                            </Box>
                          ) : null
                        }
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexGrow: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mr: 1,
                            }}
                          >
                            {groupIcons[currentGroup] &&
                              React.createElement(groupIcons[currentGroup], {
                                sx: {
                                  fontSize: { xs: 18, sm: 20 },
                                  color: "text.primary",
                                },
                              })}
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "semibold",
                                color: "text.primary",
                                textTransform: "uppercase",
                                mr: 0.5,
                                fontSize: { xs: "0.8rem", sm: "1rem" },
                              }}
                            >
                              {currentGroup}
                            </Typography>
                          </Box>
                          <IconButton size="small" sx={{ p: 0.5 }}>
                            <AddCircleOutline
                              sx={{
                                fontSize: { xs: 16, sm: 18 },
                                color: "text.secondary",
                              }}
                            />
                          </IconButton>
                        </Box>
                      </ListItem>
                    </>
                  )}
                  <SortableItem
                    id={item.id}
                    onClick={() => togglePreview(type, item.id)}
                    secondaryAction={
                      <Box
                        sx={{
                          width:
                            type === "chart"
                              ? {
                                  xs: secondaryActionWidthXs,
                                  sm: secondaryActionWidthSm,
                                }
                              : { xs: columnWidthXs, sm: columnWidthSm },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: columnWidthXs, sm: columnWidthSm },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: { xs: 0.5, sm: 1 },
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleVisibility(item.id, type);
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              whiteSpace: "nowrap",
                              fontSize: { xs: "0.65rem", sm: "0.75rem" },
                            }}
                          >
                            {isVisible ? "Hide" : "Show"}
                          </Typography>
                          <IconButton
                            edge="end"
                            aria-label={`toggle visibility for ${item.title}`}
                            size="small"
                            sx={{
                              p: { xs: 0.5, sm: 1 },
                              minWidth: { xs: 32, sm: "auto" },
                              minHeight: { xs: 32, sm: "auto" },
                            }}
                          >
                            {isVisible ? (
                              <Visibility
                                sx={{ fontSize: { xs: 16, sm: 20 } }}
                              />
                            ) : (
                              <VisibilityOff
                                sx={{ fontSize: { xs: 16, sm: 20 } }}
                              />
                            )}
                          </IconButton>
                        </Box>
                        {type === "chart" ? (
                          <Box
                            sx={{
                              height: 28,
                              borderLeft: "1px solid",
                              borderColor: "divider",
                              mx: 1,
                            }}
                          />
                        ) : (
                          <Box />
                        )}
                        {type === "chart" ? (
                          <Box
                            sx={{
                              width: { xs: columnWidthXs, sm: columnWidthSm },
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: { xs: 0.5, sm: 1.5 },
                              cursor: isVisible ? "pointer" : "not-allowed",
                              opacity: isVisible ? 1 : 0.5,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isVisible) {
                                handleToggleViewMode(item.id);
                              }
                            }}
                          >
                            <Typography
                              variant="caption"
                              color={
                                isVisible ? "text.secondary" : "text.disabled"
                              }
                              sx={{
                                whiteSpace: "nowrap",
                                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                              }}
                            >
                              {item.viewMode === "chart"
                                ? "Table View"
                                : "Chart View"}
                            </Typography>
                            <IconButton
                              edge="end"
                              aria-label={`toggle view mode for ${item.title}`}
                              size="small"
                              disabled={!isVisible}
                              sx={{
                                color: isVisible ? "inherit" : "text.disabled",
                                p: { xs: 0.5, sm: 1 },
                                minWidth: { xs: 32, sm: "auto" },
                                minHeight: { xs: 32, sm: "auto" },
                              }}
                            >
                              {item.viewMode === "chart" ? (
                                <TableIcon size={16} />
                              ) : (
                                <BarChartIcon
                                  sx={{ fontSize: { xs: 16, sm: 20 } }}
                                />
                              )}
                            </IconButton>
                          </Box>
                        ) : (
                          <Box />
                        )}
                      </Box>
                    }
                  >
                    <ListItemText
                      id={`list-item-label-${item.id}`}
                      primary={item.title}
                      primaryTypographyProps={{
                        noWrap: true,
                        sx: { fontSize: { xs: "0.875rem", sm: "1rem" } },
                      }}
                    />
                  </SortableItem>
                  {isPreviewOpen && (
                    <Box
                      sx={{ pl: { xs: 1, sm: 2 }, pr: { xs: 1, sm: 2 }, pb: 2 }}
                    >
                      {type === "chart" ? (
                        item.viewMode === "table" ? (
                          <Box
                            sx={{
                              border: 1,
                              borderColor: "divider",
                              borderRadius: 1,
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                bgcolor: "grey.50",
                                p: { xs: 0.5, sm: 1 },
                                borderBottom: 1,
                                borderColor: "divider",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                fontWeight="semibold"
                                sx={{
                                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                }}
                              >
                                {item.title} - Table View
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                maxHeight: { xs: 150, sm: 200 },
                                overflow: "auto",
                              }}
                            >
                              {item.type === "pie" ? (
                                <table
                                  style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                  }}
                                >
                                  <thead>
                                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                                      <th
                                        style={{
                                          padding: "8px",
                                          textAlign: "center",
                                          borderBottom: "1px solid #ddd",
                                        }}
                                      >
                                        Category
                                      </th>
                                      <th
                                        style={{
                                          padding: "8px",
                                          textAlign: "center",
                                          borderBottom: "1px solid #ddd",
                                        }}
                                      >
                                        Value
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.data.map((row, idx) => (
                                      <tr key={idx}>
                                        <td
                                          style={{
                                            padding: "8px",
                                            textAlign: "center",
                                            borderBottom: "1px solid #eee",
                                          }}
                                        >
                                          {row.label}
                                        </td>
                                        <td
                                          style={{
                                            padding: "8px",
                                            textAlign: "center",
                                            borderBottom: "1px solid #eee",
                                          }}
                                        >
                                          {row.value}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <table
                                  style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                  }}
                                >
                                  <thead>
                                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                                      <th
                                        style={{
                                          padding: "8px",
                                          textAlign: "center",
                                          borderBottom: "1px solid #ddd",
                                        }}
                                      >
                                        {item.layout === "horizontal"
                                          ? "Category"
                                          : "Period"}
                                      </th>
                                      {item.seriesData.map((series, idx) => (
                                        <th
                                          key={idx}
                                          style={{
                                            padding: "8px",
                                            textAlign: "center",
                                            borderBottom: "1px solid #ddd",
                                          }}
                                        >
                                          {series.label || `Series ${idx + 1}`}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.data.map((row, idx) => (
                                      <tr key={idx}>
                                        <td
                                          style={{
                                            padding: "8px",
                                            textAlign: "center",
                                            borderBottom: "1px solid #eee",
                                          }}
                                        >
                                          {item.layout === "horizontal"
                                            ? item.yAxisData[idx]
                                            : item.xAxisData[idx]}
                                        </td>
                                        {item.seriesData.map(
                                          (series, seriesIdx) => (
                                            <td
                                              key={seriesIdx}
                                              style={{
                                                padding: "8px",
                                                textAlign: "center",
                                                borderBottom: "1px solid #eee",
                                              }}
                                            >
                                              {row[series.dataKey] || 0}
                                            </td>
                                          )
                                        )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              border: 1,
                              borderColor: "divider",
                              borderRadius: 1,
                              p: { xs: 0.5, sm: 1 },
                              bgcolor: "background.paper",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                mb: 1,
                                color: "text.secondary",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              {item.title} - Chart View
                            </Typography>
                            {item.type === "pie" ? (
                              <PieChart
                                series={[
                                  {
                                    data: item.data,
                                    outerRadius: { xs: 70, sm: 90 },
                                    arcLabel: (d) => `${d.value}`,
                                    arcLabelPosition: "inside",
                                  },
                                ]}
                                height={{ xs: 180, sm: 220 }}
                              />
                            ) : (
                              <BarChart
                                dataset={item.data}
                                layout={item.layout || "vertical"}
                                xAxis={
                                  item.layout === "horizontal"
                                    ? [{ width: { xs: 30, sm: 40 } }]
                                    : [
                                        {
                                          scaleType: "band",
                                          data: item.xAxisData,
                                        },
                                      ]
                                }
                                yAxis={
                                  item.layout === "horizontal"
                                    ? [
                                        {
                                          scaleType: "band",
                                          data: item.yAxisData,
                                        },
                                      ]
                                    : [{ width: { xs: 25, sm: 30 } }]
                                }
                                series={item.seriesData}
                                height={{ xs: 180, sm: 220 }}
                                margin={{ left: 0 }}
                              />
                            )}
                          </Box>
                        )
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            bgcolor: "background.paper",
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                            p: { xs: 1.5, sm: 2 },
                            boxShadow: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.disabled"
                              sx={{
                                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                              }}
                            >
                              Widget Preview
                            </Typography>
                          </Box>
                          <Typography
                            variant="h4"
                            color="primary.main"
                            fontWeight="semibold"
                            sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
                          >
                            {item.value}
                          </Typography>
                          {item.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                              }}
                            >
                              {item.description}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: theme.palette.mode === "dark" ? "#121212" : "background.paper",
        overflowX: "hidden",
        p: 0,
        m: 0,
      }}
    >
      <Box
        sx={{
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          display: "flex",
          alignItems: "center",
          position: "relative",
          borderBottom: `${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: "semibold",
            color: "text.primary",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          Personalize Dashboard
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{
            position: "absolute",
            right: { xs: 16, sm: 24 },
            top: { xs: 12, sm: 16 },
            color: (theme) => theme.palette.grey[500],
            minWidth: { xs: 44, sm: "auto" },
            minHeight: { xs: 44, sm: "auto" },
          }}
        >
          <Close sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ px: { xs: 2, sm: 3 }, width: "100%" }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="personalization tabs"
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: (theme) => theme.palette.primary.main,
            },
            "& .MuiTab-root": {
              textTransform: "uppercase",
              fontWeight: "semibold",
              color: "text.secondary",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              minHeight: { xs: 48, sm: 56 },
              "&.Mui-selected": {
                color: "text.primary",
              },
            },
          }}
        >
          <Tab
            label="Widgets"
            icon={<GridView sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            iconPosition="start"
            value={0}
          />
          <Tab
            label="Charts"
            icon={<ShowChart sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            iconPosition="start"
            value={1}
          />
        </Tabs>
        <Divider sx={{}} />
        <Box sx={{ py: 1 }}>
          <TabPanel value={selectedTab} index={0}>
            {renderGroupedListItems(
              allWidgetConfigs,
              tempWidgetDisplaySettings,
              "widget"
            )}
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            {renderGroupedListItems(
              allChartConfigs,
              tempChartDisplaySettings,
              "chart"
            )}
          </TabPanel>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: { xs: 1, sm: 2 },
          p: { xs: 2, sm: 3 },
          borderTop: 1,
          borderColor: "divider",
          bgcolor:
            theme.palette.mode === "dark" ? "#1e1e1e" : "background.paper",
        }}
      >
        <Button
          onClick={handleApply}
          variant="contained"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            minHeight: { xs: 40, sm: 36 },
          }}
        >
          Apply Changes
        </Button>
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            minHeight: { xs: 40, sm: 36 },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}