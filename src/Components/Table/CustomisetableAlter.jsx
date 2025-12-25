"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  useTheme,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import {
  Filter,
  Download,
  Save,
  X,
  Search,
  Tally3 as Columns3,
  RefreshCw,
  Edit,
  Trash2,
  Printer,
} from "lucide-react";
import * as XLSX from "xlsx";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate, useParams } from "react-router-dom";
import { Eye } from "lucide-react";

import toast from "react-hot-toast";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import usePermissionDataStore from "../../Zustand/Store/usePermissionDataStore";
import {
  saveLayoutToConfig,
  resetLayoutToDefault,
  getUserConfig,
  getDefaultConfig,
  getTableConfig,
} from "../../Configurations/TableDataConfig";
import PushPinIcon from "@mui/icons-material/PushPin";

// Constants to avoid recreating objects
const DEFAULT_ROWS_PER_PAGE = 10;
// const DEFAULT_VISIBLE_COLUMNS = 4;

const formatLabel = (label) => {
  return label
    .replace(/_/g, " ") // Replace underscores with spaces
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase rest
    .join(" "); // Join back together
};

const CustomisetableAlter = ({
  Route,
  sortname,
  configss,
  onSortChange,
  onFilterChange,
  DeleteFunc,
  onclickRow,
  EditFunc,
  configuration,
  tableName,
  token,
  mainKey,
  title,
  linkType,
  handleShow,
  mainData,
  showActions,
  CardColoumn = [],
  hideToolbar, // Added hideToolbar prop with default false
  onEmployeeClick,
  onSaveLayout, // new optional prop
  onResetLayout, // Added prop for handling employee clicks
  loadedBackendConfig,
  showLayoutButtons,
  edit_delete_action,
}) => {
  const { userData } = useAuthStore();
  const { Permission } = usePermissionDataStore();
  const org = userData?.organization;
  const { id } = useParams();

  // Permission checks for edit and delete actions
  const hasEditPermission = useMemo(() => {
    // If EditFunc is provided, use it (TableDataGeneric handles permission check)
    if (EditFunc !== undefined) {
      return EditFunc !== null;
    }
    // Otherwise check permissions directly
    if (!edit_delete_action || !Array.isArray(edit_delete_action) || edit_delete_action.length === 0) {
      return true; // If no permission specified, allow by default
    }
    const editPermission = edit_delete_action[0]; // First element is edit permission
    return Permission && Permission.includes(editPermission);
  }, [EditFunc, edit_delete_action, Permission]);

  const hasDeletePermission = useMemo(() => {
    // If DeleteFunc is provided, use it (TableDataGeneric handles permission check)
    if (DeleteFunc !== undefined) {
      return DeleteFunc !== null;
    }
    // Otherwise check permissions directly
    if (!edit_delete_action || !Array.isArray(edit_delete_action) || edit_delete_action.length < 2) {
      return true; // If no permission specified, allow by default
    }
    const deletePermission = edit_delete_action[1]; // Second element is delete permission
    return Permission && Permission.includes(deletePermission);
  }, [DeleteFunc, edit_delete_action, Permission]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallScreen = isMobile || isTablet;

  const navigate = useNavigate();

  const [view, setView] = useState("table");
  const [page, setPage] = useState(0);

  const [columns, setColumns] = useState([]);
  const [originalColumnOrder, setOriginalColumnOrder] = useState([]);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState(
    configuration?.[0]?.default_config.sortConfig || []
  );
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [columnManagerOpen, setColumnManagerOpen] = useState(false);
  const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null);
  const [draggedColumnIndex, setDraggedColumnIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const [resizingColumnKey, setResizingColumnKey] = useState(null);
  const initialMouseX = useRef(0);
  const initialColumnWidth = useRef(0);
  const [pendingColumns, setPendingColumns] = useState([]);
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState(null);

  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Cache for nested values to avoid recalculating
  const valueCache = useRef(new Map());

  const handleOpenEmployeeForm = () => {
    navigate("/EmployeeForm");
  };
  //  Memoized colors based on theme
  const colors = useMemo(
    () => ({
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
      info: theme.palette.info.main,
      background: theme.palette.background.default,
      surface: theme.palette.background.paper,
      text: {
        primary: theme.palette.text.primary,
        secondary: theme.palette.text.secondary,
      },
      grey: {
        50:
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.grey[50],
        100:
          theme.palette.mode === "dark"
            ? theme.palette.grey[800]
            : theme.palette.grey[100],
        200:
          theme.palette.mode === "dark"
            ? theme.palette.grey[700]
            : theme.palette.grey[200],
        300:
          theme.palette.mode === "dark"
            ? theme.palette.grey[600]
            : theme.palette.grey[300],
        400:
          theme.palette.mode === "dark"
            ? theme.palette.grey[500]
            : theme.palette.grey[400],
        500:
          theme.palette.mode === "dark"
            ? theme.palette.grey[400]
            : theme.palette.grey[500],
        600:
          theme.palette.mode === "dark"
            ? theme.palette.grey[300]
            : theme.palette.grey[600],
        700:
          theme.palette.mode === "dark"
            ? theme.palette.grey[200]
            : theme.palette.grey[700],
        800:
          theme.palette.mode === "dark"
            ? theme.palette.grey[100]
            : theme.palette.grey[800],
        900:
          theme.palette.mode === "dark"
            ? theme.palette.grey[50]
            : theme.palette.grey[900],
      },
      departments: {
        Design: "#e91e63",
        HR: "#ff9800",
        Finance: "#4caf50",
        Marketing: "#9c27b0",
        Engineering: "#2196f3",
        Sales: "#ff5722",
        Support: "#795548",
        default: theme.palette.text.secondary,
      },
    }),
    [theme]
  );

  useEffect(() => {
    if (loadedBackendConfig && loadedBackendConfig.columns) {
      console.log(
        "Applying loaded backend configuration to table:",
        loadedBackendConfig
      );

      const mandatoryColumnsArray =
        loadedBackendConfig.defaults?.mandatoryColumns || [];
      console.log("Mandatory columns array:", mandatoryColumnsArray);

      // Apply columns
      const backendColumns = loadedBackendConfig.columns.map((col) => ({
        ...col,
        key: col.key || col.field,
        field: col.field || col.key,
        mandatory:
          mandatoryColumnsArray.includes(col.key) ||
          mandatoryColumnsArray.includes(col.field),
      }));
      setColumns(backendColumns);
      setOriginalColumnOrder(backendColumns);
      console.log("Processed columns:", backendColumns);

      // Apply sort config if available
      if (loadedBackendConfig.sortConfig) {
        setSortConfig(loadedBackendConfig.sortConfig);
      }

      // Apply rows per page if available
      if (loadedBackendConfig.rowsPerPage) {
        setRowsPerPage(loadedBackendConfig.rowsPerPage);
      }

      // Apply filters if available
      if (loadedBackendConfig.filters) {
        setFilters(loadedBackendConfig.filters);
      }
    }
  }, [loadedBackendConfig]);

  // function for saveing layout to configuration
  const saveLayoutToConfiguration = useCallback(
    (layoutData) => {
      try {
        const success = saveLayoutToConfig(
          configuration,
          tableName,
          layoutData
        );
        if (success) {
          setSnackbar({
            open: true,
            message: "Layout saved successfully to configuration",
            autoHideDuration: 2000,
            severity: "success",
          });
        } else {
          throw new Error("Failed to find table configuration");
        }
      } catch (error) {
        console.error("Failed to save layout to config:", error);
        setSnackbar({
          open: true,
          message: "Failed to save layout to configuration",
          severity: "error",
        });
      }
    },
    [tableName]
  );

  const loadLayoutFromConfiguration = useCallback((tableConfigName) => {
    try {
      const userConfig = getUserConfig(configuration, tableConfigName);
      if (userConfig) {
        return {
          columns: userConfig.columns,
          sortConfig: userConfig.sortConfig,
          rowsPerPage: userConfig.rowsPerPage,
          filters: userConfig.filters,
          timestamp: userConfig.lastModified,
        };
      }
    } catch (error) {
      console.error("Failed to load layout from config:", error);
    }
    return null;
  }, []);
  // function for reseting layout to default configuration
  // In Customisetable component

  const resetLayout = useCallback(() => {
    if (onResetLayout) {
      Promise.resolve(onResetLayout({ tableName }))
        .then(() => {
          //  Clear local state to force full reload
          setColumns([]);
          setData([]);

          // Reload using existing configuration loader
          loadDataFromConfiguration(tableName);

          setSnackbar({
            open: true,
            message: "Layout reset to default successfully",
            severity: "success",
          });
        })
        .catch((error) => {
          console.error("Failed to reset layout via backend:", error);
          setSnackbar({
            open: true,
            message: "Failed to reset layout",
            severity: "error",
          });
        });
      return;
    }

    const success = resetLayoutToDefault(configuration, tableName);
    if (success) {
      loadLayoutFromConfiguration(tableName);
      setSnackbar({
        open: true,
        message: "Layout reset to default configuration",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Failed to reset layout",
        severity: "error",
      });
    }
  }, [onResetLayout, tableName, configuration, loadLayoutFromConfiguration]);

  // Apply saved layout to columns
  const applyLayoutToColumns = useCallback((baseColumns, savedLayout) => {
    if (!savedLayout || !savedLayout.columns) return baseColumns;

    const savedColumnsMap = new Map(
      savedLayout.columns.map((col) => [col.key, col])
    );

    // Create new columns array maintaining saved order and properties
    const orderedColumns = [];
    const usedKeys = new Set();

    // First, add columns in saved order with saved properties
    savedLayout.columns.forEach((savedCol) => {
      const baseCol = baseColumns.find((col) => col.key === savedCol.key);
      if (baseCol) {
        orderedColumns.push({
          ...baseCol,
          visible:
            savedCol.visible !== undefined ? savedCol.visible : baseCol.visible,
          width: savedCol.width || baseCol.width,
          pinned: savedCol.pinned || false,
        });
        usedKeys.add(savedCol.key);
      }
    });

    // Then, add any new columns that weren't in the saved layout
    baseColumns.forEach((baseCol) => {
      if (!usedKeys.has(baseCol.key)) {
        orderedColumns.push(baseCol);
      }
    });

    return orderedColumns;
  }, []);

  // Memoized function for getting nested values with caching
  const getNestedValue = useCallback((obj, path) => {
    const cacheKey = `${obj?.[mainKey] || JSON.stringify(obj)}_${path}`;
    if (valueCache.current.has(cacheKey)) {
      return valueCache.current.get(cacheKey);
    }
    const value = path?.split(".").reduce((acc, part) => acc && acc[part], obj);
    valueCache.current.set(cacheKey, value);
    return value;
  }, []);

  // Replace loadDataFromUrl with loadDataFromConfiguration
  const loadDataFromConfiguration = useCallback(
    async (tableConfigName) => {
      setLoading(true);
      setData([]);
      setColumns([]);
      setFilters({});
      setPendingFilters({});
      setCurrentPage(1);

      try {
        const result = mainData;

        if (!Array.isArray(result) || result.length === 0) {
          console.warn(
            "API did not return an array of objects or returned empty data."
          );
          return;
        }

        valueCache.current.clear();

        //  PRIORITY: Use loadedBackendConfig if available
        if (loadedBackendConfig && loadedBackendConfig.columns) {
          console.log(
            "Using loaded backend configuration:",
            loadedBackendConfig
          );

          //  Get mandatory columns from backend defaults
          const mandatoryColumnsArray =
            loadedBackendConfig.defaults?.mandatoryColumns || [];

          const backendColumns = loadedBackendConfig.columns.map((col) => ({
            ...col,
            key: col.key || col.field,
            field: col.field || col.key,
            mandatory:
              mandatoryColumnsArray.includes(col.key) ||
              mandatoryColumnsArray.includes(col.field),
          }));

          setData(result);
          setColumns(backendColumns);
          setOriginalColumnOrder(backendColumns);

          if (loadedBackendConfig.sortConfig) {
            setSortConfig(loadedBackendConfig.sortConfig);
          }
          if (loadedBackendConfig.rowsPerPage) {
            setRowsPerPage(loadedBackendConfig.rowsPerPage);
          }
          if (loadedBackendConfig.filters) {
            setFilters(loadedBackendConfig.filters);
          }

          return; //  Exit early - we've applied backend config
        }

        // Fall back to configuration object if no backend config
        const tableConfig = getTableConfig(configuration, tableConfigName);

        if (!tableConfig) {
          console.warn(`No configuration found for table: ${tableConfigName}`);
          setData(result);
          return;
        }

        const userConfig = getUserConfig(configuration, tableConfigName);
        const configToUse =
          userConfig || getDefaultConfig(configuration, tableConfigName);

        const configuredColumns = configToUse.columns
          .sort((a, b) => a.order - b.order)
          .map((configCol) => {
            const defaultCol = tableConfig.default_config.columns.find(
              (col) => col.key === configCol.key
            );
            return {
              key: configCol.key,
              label: defaultCol?.label || configCol.key,
              width: configCol.width || 150,
              visible:
                configCol.visible !== undefined ? configCol.visible : true,
              sortable:
                defaultCol?.sortable !== undefined ? defaultCol.sortable : true,
              filterable:
                defaultCol?.filterable !== undefined
                  ? defaultCol.filterable
                  : true,
              pinned: configCol.pinned || false,
            };
          });

        setData(result);
        setColumns(configuredColumns);
        setOriginalColumnOrder(configuredColumns);

        if (configToUse.sortConfig) {
          setSortConfig(configToUse.sortConfig);
        }
        if (configToUse.rowsPerPage) {
          setRowsPerPage(configToUse.rowsPerPage);
        }
        if (configToUse.filters) {
          setFilters(configToUse.filters);
        }
      } catch (error) {
        console.error("Failed to load data with config:", error);
        setSnackbar({
          open: true,
          message: `Failed to load data: ${error.message}`,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [getNestedValue, tableName, mainData, loadedBackendConfig] //  Add loadedBackendConfig as dependency
  );

  // Update useEffect to use new function
  useEffect(() => {
    if (tableName) {
      loadDataFromConfiguration(tableName);
    }
  }, [loadDataFromConfiguration, tableName, loadedBackendConfig]);

  // Optimized sorting with memoization
  const sortedData = useMemo(() => {
    const currentSort = sortConfig[0];
    if (!currentSort || !currentSort.key) return data;

    return [...data].sort((a, b) => {
      const aVal = getNestedValue(a, currentSort.key);
      const bVal = getNestedValue(b, currentSort.key);

      // Check if values are dates (ISO string or date format)
      const isDateA =
        aVal && typeof aVal === "string" && !isNaN(Date.parse(aVal));
      const isDateB =
        bVal && typeof bVal === "string" && !isNaN(Date.parse(bVal));

      // If both are dates, parse and compare as dates
      if (isDateA && isDateB) {
        const dateA = new Date(aVal).getTime();
        const dateB = new Date(bVal).getTime();
        return currentSort.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      // If both are strings, use localeCompare
      if (typeof aVal === "string" && typeof bVal === "string") {
        return currentSort.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // If both are numbers, compare directly
      if (typeof aVal === "number" && typeof bVal === "number") {
        return currentSort.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Fallback for other types
      if (aVal < bVal) return currentSort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return currentSort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, getNestedValue]);
  // Optimized filtering with memoization
  const filteredData = useMemo(() => {
    let result = sortedData;

    // Apply search filter - searches across all columns
    if (searchQuery.trim()) {
      const query = searchQuery?.toLowerCase().trim();
      result = result.filter((item) => {
        return (
          columns.some((col) => {
            const value = getNestedValue(item, col.key);
            if (value === null || value === undefined) return false;

            // Convert to string and handle different data types
            const stringValue = String(value)?.toLowerCase();

            // Also search in formatted labels for better matching
            const formattedLabel = formatLabel(col.key)?.toLowerCase();

            return (
              stringValue.includes(query) || formattedLabel.includes(query)
            );
          }) ||
          Object.values(item).some((value) => {
            if (value === null || value === undefined) return false;
            return String(value)?.toLowerCase().includes(query);
          })
        );
      });
    }

    // Apply column filters - IMPROVED to handle partial matches better
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        const filterValue = value?.toLowerCase().trim();
        result = result.filter((item) => {
          const itemValue = getNestedValue(item, key);
          if (itemValue === null || itemValue === undefined) return false;

          const itemString = String(itemValue)?.toLowerCase();

          // Split filter value by spaces to handle multi-word searches
          const filterWords = filterValue
            ?.split(/\s+/)
            .filter((word) => word.length > 0);

          // Check if all filter words are found in the item value
          return filterWords.every((word) => itemString.includes(word));
        });
      }
    });

    return result;
  }, [sortedData, filters, searchQuery, columns]);

  // Update page if needed when filtered data changes
  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredData.length, rowsPerPage, currentPage]);

  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / rowsPerPage),
    [filteredData.length, rowsPerPage]
  );

  // Optimized pagination with memoization
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, rowsPerPage]);

  // Optimized handlers with useCallback
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => {
      const currentSort = prev?.[0];
      return [
        {
          key,
          direction:
            currentSort.key === key && currentSort.direction === "asc"
              ? "desc"
              : "asc",
        },
      ];
    });
    setCurrentPage(1);
  }, []);
  // Filter handlers
  const handlePendingFilterChange = useCallback((key, value) => {
    setPendingFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Apply pending filters
  const togglePendingColumnVisibility = useCallback((key) => {
    setPendingColumns((prev) =>
      prev.map((col) => {
        //  Prevent toggling mandatory columns
        if (col.key === key && !col.mandatory) {
          return { ...col, visible: !col.visible };
        }
        return col;
      })
    );
  }, []);

  // Select/Deselect all pending columns
  const handleSelectAllPendingColumns = useCallback((event) => {
    const isChecked = event.target.checked;
    setPendingColumns((prev) =>
      prev.map((col) => ({
        ...col,
        visible: col.mandatory ? true : isChecked,
      }))
    );
  }, []);

  console.log("Pending columns in dialog:", pendingColumns);

  // Check if all pending columns are selected
  const allPendingColumnsVisible = useMemo(() => {
    // Only check non-mandatory columns
    const nonMandatoryColumns = pendingColumns.filter((col) => !col.mandatory);
    return (
      nonMandatoryColumns.length > 0 &&
      nonMandatoryColumns.every((col) => col.visible)
    );
  }, [pendingColumns]);

  // Check if some (but not all) pending columns are selected
  const handleColumnReorder = useCallback(
    (dragIndex, hoverIndex) => {
      //  Only reorder visible columns for table display
      const visibleCols = columns.filter((col) => col.visible);

      const dragColumn = visibleCols[dragIndex];
      const hoverColumn = visibleCols[hoverIndex];

      const dragColumnIndex = columns.findIndex(
        (col) => col.key === dragColumn.key
      );
      const hoverColumnIndex = columns.findIndex(
        (col) => col.key === hoverColumn.key
      );

      const newColumns = [...columns];
      newColumns.splice(dragColumnIndex, 1);
      newColumns.splice(hoverColumnIndex, 0, dragColumn);

      setColumns(newColumns);

      //  DON'T update pendingColumns here - keep it unchanged
    },
    [columns]
  );

  // Column resizing handlers
  const handleMouseDown = useCallback(
    (e, key) => {
      e.stopPropagation();
      setResizingColumnKey(key);
      initialMouseX.current = e.clientX;
      const column = columns.find((col) => col.key === key);
      initialColumnWidth.current = column ? column.width : 0;
    },
    [columns]
  );
  // handle mouse move and up events for resizing
  useEffect(() => {
    if (!resizingColumnKey) return;
    const handleMouseMove = (e) => {
      if (resizingColumnKey) {
        const deltaX = e.clientX - initialMouseX.current;
        setColumns((prevColumns) =>
          prevColumns.map((col) =>
            col.key === resizingColumnKey
              ? {
                  ...col,
                  width: Math.max(50, initialColumnWidth.current + deltaX),
                }
              : col
          )
        );
      }
    };

    const handleMouseUp = () => {
      setResizingColumnKey(null);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };
  }, [resizingColumnKey]);

  // Export handlers
  const exportToCSV = useCallback(() => {
    const visibleColumns = columns.filter((col) => col.visible);
    const headers = visibleColumns.map((col) => col.label).join(",");
    const rows = filteredData
      .map((row) =>
        visibleColumns
          .map(
            (col) =>
              `"${String(getNestedValue(row, col.key)).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");
    const csvContent = headers + "\n" + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tableName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMenuAnchorEl(null);
  }, [columns, filteredData, getNestedValue]);
  // Export to HTML
  const exportToHTML = useCallback(() => {
    const visibleColumns = columns.filter((col) => col.visible);
    const headers = visibleColumns
      .map(
        (col) =>
          `<th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; font-weight: bold;">${formatLabel(col.label)}</th>`
      )
      .join("");
    const rows = filteredData
      .map(
        (row) =>
          "<tr>" +
          visibleColumns
            .map(
              (col) =>
                `<td style="border: 1px solid #ddd; padding: 12px;">${String(getNestedValue(row, col.key))}</td>`
            )
            .join("") +
          "</tr>"
      )
      .join("");
    const organizationName =
      userData?.organization?.organization_name || "Organization Report";
    const htmlContent = `<!DOCTYPE html><html><head> <title>${organizationName}</title> <style> body { font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif; margin: 20px; } h2 { color: #333333; margin-bottom: 5px; } .subtitle { color: #666666; margin-bottom: 20px; font-size: 14px; } table { border-collapse: collapse; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); } </style></head><body> <h2>${organizationName}</h2> <div class="subtitle">Employees</div> <table> <thead><tr>${headers}</tr></thead> <tbody>${rows}</tbody> </table></body></html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tableName}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMenuAnchorEl(null);
  }, [columns, filteredData, getNestedValue, formatLabel, userData]);
  // Export to PDF
  const exportToPDF = useCallback(async () => {
    try {
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF();
      const visibleColumns = columns.filter((col) => col.visible);
      if (visibleColumns.length === 0) {
        alert(
          "No visible columns to export. Please manage columns and ensure at least one is visible."
        );
        setExportMenuAnchorEl(null);
        return;
      }
      if (filteredData.length === 0) {
        alert("No data to export after applying filters.");
        setExportMenuAnchorEl(null);
        return;
      }

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 14;
      const usableWidth = pageWidth - 2 * margin;
      const cellPadding = 2;
      const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;
      const minCellHeight = 8;
      let currentY = 40;

      const keyColumnWidth = (() => {
        let maxWidth = 0;
        visibleColumns.forEach((col) => {
          maxWidth = Math.max(maxWidth, doc.getTextWidth(col.label));
        });
        return Math.min(maxWidth + cellPadding * 2, usableWidth * 0.3);
      })();

      const valueColumnWidth = usableWidth - keyColumnWidth;

      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      const organizationName =
        userData?.organization?.organization_name || "Organization Report";
      doc.text(organizationName, margin, 20);

      doc.setFontSize(14);
      doc.setFont(undefined, "normal");
      doc.text(tableName, margin, 30);

      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        margin,
        currentY
      );
      doc.text(
        `Total Records: ${filteredData.length}`,
        pageWidth - margin - 50,
        currentY
      );
      currentY += 15;

      filteredData.forEach((dataRow, recordIndex) => {
        const recordTitleHeight = 14;
        const spacingBeforeTitle = 15;
        const spacingAfterTitle = 10;
        const spacingAfterTable = 15;

        let recordBlockContentHeight = 0;
        visibleColumns.forEach((col) => {
          const value = String(getNestedValue(dataRow, col.key) || "");
          const valueLines = doc?.splitTextToSize(
            value,
            valueColumnWidth - cellPadding * 2
          );
          const rowHeight = Math.max(
            minCellHeight,
            valueLines.length * lineHeight + cellPadding * 2
          );
          recordBlockContentHeight += rowHeight;
        });

        const totalRecordBlockHeight =
          spacingBeforeTitle +
          recordTitleHeight +
          spacingAfterTitle +
          recordBlockContentHeight +
          spacingAfterTable;

        if (
          recordIndex > 0 &&
          currentY + totalRecordBlockHeight > pageHeight - margin
        ) {
          doc.addPage();
          currentY = margin;
        } else if (
          recordIndex === 0 &&
          currentY + totalRecordBlockHeight > pageHeight - margin &&
          currentY > margin
        ) {
          doc.addPage();
          currentY = margin;
        }

        if (currentY > margin) {
          currentY += spacingBeforeTitle;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        const recordTitle = `Record ${recordIndex + 1}`;
        doc.text(recordTitle, margin, currentY);
        currentY += recordTitleHeight + spacingAfterTitle;

        doc.setDrawColor(0);
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");

        visibleColumns.forEach((col) => {
          const value = String(getNestedValue(dataRow, col.key) || "");
          const valueLines = doc?.splitTextToSize(
            value,
            valueColumnWidth - cellPadding * 2
          );
          const rowHeight = Math.max(
            minCellHeight,
            valueLines.length * lineHeight + cellPadding * 2
          );

          doc.rect(margin, currentY, keyColumnWidth, rowHeight, "S");
          const labelLines = doc?.splitTextToSize(
            formatLabel(col.label),
            keyColumnWidth - cellPadding * 2
          );
          const totalLabelTextHeight = labelLines.length * lineHeight;
          const labelYOffset = (rowHeight - totalLabelTextHeight) / 2;
          labelLines.forEach((line, lineIndex) => {
            doc.text(
              line,
              margin + cellPadding,
              currentY + labelYOffset + lineHeight * lineIndex,
              {
                baseline: "top",
                align: "left",
              }
            );
          });

          doc.rect(
            margin + keyColumnWidth,
            currentY,
            valueColumnWidth,
            rowHeight,
            "S"
          );
          const totalValueTextHeight = valueLines.length * lineHeight;
          const valueYOffset = (rowHeight - totalValueTextHeight) / 2;
          valueLines.forEach((line, lineIndex) => {
            doc.text(
              line,
              margin + keyColumnWidth + cellPadding,
              currentY + valueYOffset + lineHeight * lineIndex,
              {
                baseline: "top",
                align: "left",
              }
            );
          });

          currentY += rowHeight;
        });

        currentY += spacingAfterTable;
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - margin - 30,
          pageHeight - 10
        );
        doc.text(
          `${filteredData.length} records exported`,
          margin,
          pageHeight - 10
        );
      }

      const fileName = `${tableName}.pdf`;
      doc.save(fileName);
      setExportMenuAnchorEl(null);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("PDF export failed. Please try again.");
    }
  }, [columns, filteredData, getNestedValue, formatLabel, userData]);
  // Export to Excel
  const exportToExcel = useCallback(() => {
    const visibleColumns = columns.filter((col) => col.visible);
    const dataForExcel = filteredData.map((row) => {
      const newRow = {};
      visibleColumns.forEach((col) => {
        newRow[col.label] = getNestedValue(row, col.key);
      });
      return newRow;
    });

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const columnWidths = visibleColumns.map((col) => {
      const headerText = col.label || "";
      const maxDataLength = filteredData.reduce((max, row) => {
        const cellValue = String(getNestedValue(row, col.key) || "");
        return Math.max(max, cellValue.length);
      }, 0);
      return { wch: Math.max(headerText.length, maxDataLength) + 2 };
    });

    ws["!cols"] = columnWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const excelBuffer = XLSX.write(wb, { bookType: "xls", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tableName}.xls`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMenuAnchorEl(null);
  }, [columns, filteredData, getNestedValue]);

  // Updated saveLayout function to use TableConfig
  const saveLayout = useCallback(() => {
    const layoutData = {
      columns: columns.map((col, index) => ({
        key: col.key,
        label: col.label,
        width: col.width,
        visible: col.visible,
        pinned: col.pinned || false,
        order: index,
      })),
      sortConfig,
      filters,
      rowsPerPage,
      timestamp: new Date().toISOString(),
    };

    if (onSaveLayout) {
      // delegate to parent; keep UX feedback consistent
      Promise.resolve(onSaveLayout({ tableName, layoutData }))
        .then(() => {
          setSnackbar({
            open: true,
            message: "Layout saved successfully",
            severity: "success",
          });
        })
        .catch((error) => {
          console.error("Failed to save layout to backend:", error);
          setSnackbar({
            open: true,
            message: "Failed to save layout",
            severity: "error",
          });
        });
      return;
    }

    // fallback: Save to TableConfig instead of localStorage
    saveLayoutToConfiguration(layoutData);
  }, [
    columns,
    filters,
    rowsPerPage,
    sortConfig,
    onSaveLayout,
    tableName,
    saveLayoutToConfiguration,
  ]);

  // Add export/import config functions
  const exportCurrentConfig = useCallback(() => {
    const tableConfig = getTableConfig(configuration, tableName);
    if (tableConfig) {
      const configBlob = new Blob([JSON.stringify(tableConfig, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(configBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tableName}-configuration-backup.json`;
      a.click();
      URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: "Configuration exported successfully",
        severity: "success",
      });
    }
  }, [tableName]);
  // Import config function with basic validation
  const handleImportConfig = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target.result);
          // Basic validation
          if (
            importedConfig.table === tableName &&
            importedConfig.default_config
          ) {
            // This would require extending your TableConfig functions to support imports
            // For now, show success message
            setSnackbar({
              open: true,
              message:
                "Configuration structure validated (import functionality pending)",
              severity: "info",
            });
          } else {
            throw new Error("Invalid configuration format");
          }
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Failed to import configuration: Invalid format",
            severity: "error",
          });
        }
      };
      reader.readAsText(file);

      // Reset the input
      event.target.value = "";
    },
    [tableName]
  );
  // Filter dialog handlers
  const applyFilters = useCallback(() => {
    setFilters(pendingFilters);
    setCurrentPage(1);
    setShowFilters(false);
  }, [pendingFilters]);
  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({});
    setPendingFilters({});
    setCurrentPage(1);
  }, []);
  // Open/Close filter dialog
  const handleFilterDialogOpen = useCallback(() => {
    setPendingFilters(filters);
    setShowFilters(true);
  }, [filters]);
  // Close without applying
  const handleFilterDialogClose = useCallback(() => {
    setPendingFilters(filters);
    setShowFilters(false);
  }, [filters]);
  // Rows per page change handler
  const handleRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);
  // Page change handler
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    },
    [totalPages]
  );

  // Column manager dialog handlers
  const handleColumnDialogOpen = useCallback(() => {
    // Use original order but with current visibility state
    const columnsWithCurrentVisibility = originalColumnOrder.map((origCol) => {
      // Find the same column in current columns state to get its visibility
      const currentCol = columns.find((col) => col.key === origCol.key);
      return {
        ...origCol,
        visible: currentCol?.visible ?? origCol.visible, // Use current visibility
        mandatory: origCol.mandatory ?? false, // Keep mandatory property
      };
    });
    console.log(
      "Columns with mandatory flags for dialog:",
      columnsWithCurrentVisibility
    );
    setPendingColumns(columnsWithCurrentVisibility);
    setColumnManagerOpen(true);
  }, [originalColumnOrder, columns]);

  // Close without applying
  const handleColumnDialogClose = useCallback(() => {
    setPendingColumns([...columns]);
    setColumnManagerOpen(false);
  }, [columns]);
  // Apply column changes
  const applyColumnChanges = useCallback(() => {
    setColumns([...pendingColumns]);
    setColumnManagerOpen(false);
  }, [pendingColumns]);
  // Cancel column changes
  const cancelColumnChanges = useCallback(() => {
    setPendingColumns([...columns]);
    setColumnManagerOpen(false);
  }, [columns]);
  // API URL dialog handlers

  // Memoized derived values
  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible),
    [columns]
  );
  const activeFilters = useMemo(
    () => Object.keys(filters).filter((key) => filters[key]).length,
    [filters]
  );

  // Navigation handlers
  // Use EditFunc if provided, otherwise fallback to default handleEdit
  const handleEdit = useCallback(
    (item) => {
      if (EditFunc) {
        EditFunc(item);
      } else {
        navigate(`${Route}/edit/${item?.[mainKey]}`);
      }
    },
    [EditFunc, navigate, Route, mainKey]
  );

  const handleShowData = useCallback(
    (item) => {
      if (handleShow) {
        handleShow(item);
      } else {
        navigate(`${Route}/view/${item?.[mainKey]}`);
      }
    },
    [handleShow, navigate, Route, mainKey]
  );

  // Delete handlers
  const handleDelete = useCallback((item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  }, []);

  // Confirm delete action
  const handleDeleteConfirm = useCallback(async () => {
    try {
      if (DeleteFunc) {
        // Call the provided delete function with proper error handling like submit button
        await DeleteFunc(selectedItem?.[mainKey]);

        // Remove item from local data array on successful deletion
        setData((prevData) =>
          prevData.filter((item) => item?.[mainKey] !== selectedItem?.[mainKey])
        );

        // // Show success toast like submit button
        // toast.success("Employee deleted successfully!");
      } else {
        // Fallback for when no DeleteFunc is provided
        setData((prevData) =>
          prevData.filter((item) => item?.[mainKey] !== selectedItem?.[mainKey])
        );
        // toast.success("Employee deleted successfully!");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      // Show error toast like submit button error handling
      toast.error("Failed to delete . Please try again.");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  }, [selectedItem, DeleteFunc]);
  console.log("lodlkfhalkh", visibleColumns);

  // Dynamic card component for mobile/tablet view
  const DynamicUserCard = ({ item, index }) => {
    const visibleCols = visibleColumns;
    return (
      <Card
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          },
          transition: "box-shadow 0.2s ease-in-out",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* All other fields */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {visibleCols
                .filter((col) => col.key)
                .map((col) => {
                  const value = getNestedValue(item, col.key);
                  const displayValue = String(value || "N/A");

                  return (
                    <Box
                      key={col.key}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        py: 0.5,
                      }}
                    >
                      {/* Icon */}
                      <Box
                        sx={{
                          color: colors.text.secondary,
                          mt: 0.25,
                          minWidth: 20,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      ></Box>

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.text.secondary,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            display: "block",
                            mb: 0.25,
                          }}
                        >
                          {col.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.text.primary,
                            fontSize: "0.875rem",
                            wordBreak: "break-word",
                            lineHeight: 1.4,
                          }}
                        >
                          {displayValue.length > 100
                            ? `${displayValue.substring(0, 100)}...`
                            : displayValue}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
            </Box>

            {/* Action buttons and record number */}
            {showActions && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <>
                    <Tooltip title="Show">
                      <IconButton
                        size="small"
                        onClick={() => handleShowData(item)}
                        sx={{
                          color:
                            theme.palette.mode === "dark" ? "#fff" : "#333",
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.1)"
                                : "#33333315",
                          },
                        }}
                      >
                        <Eye size={20} /> {/* ← Only this line changed */}
                      </IconButton>
                    </Tooltip>

                    {hasEditPermission && (
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(item)}
                          sx={{
                            color:
                              theme.palette.mode === "dark" ? "#fff" : "#333",
                            "&:hover": {
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(255,255,255,0.1)"
                                  : "#33333315",
                            },
                          }}
                        >
                          <Edit size={16} />
                        </IconButton>
                      </Tooltip>
                    )}

                    {hasDeletePermission && (
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(item)}
                          sx={{
                            color:
                              theme.palette.mode === "dark" ? "#fff" : "#333",
                            "&:hover": {
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(255,255,255,0.1)"
                                  : "#33333315",
                            },
                          }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                </Box>
                <Chip
                  label={`#${(currentPage - 1) * rowsPerPage + index + 1}`}
                  size="small"
                  sx={{
                    backgroundColor: colors.grey[200],
                    color: colors.text.secondary,
                    fontSize: "0.7rem",
                    height: 20,
                  }}
                />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };
  // Print handler
  const handlePrint = useCallback(() => {
    // Create print styles
    const printStyles = document.createElement("style");
    printStyles.id = "table-print-styles";
    printStyles.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .custom-print-container,
        .custom-print-container * {
          visibility: visible;
        }
        .custom-print-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
          background: white;
          padding: 20px;
          box-sizing: border-box;
        }
        @page {
          size: A4;
          margin: 15mm;
        }
        .print-header {
          text-align: left;
          margin-bottom: 30px;
        }
        .print-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .print-subtitle {
          font-size: 14px;
          margin-bottom: 15px;
        }
        .print-meta {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          margin-bottom: 20px;
        }
        .record-section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .record-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .record-table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #000;
          margin-bottom: 20px;
        }
        .record-table td {
          border: 1px solid #000;
          padding: 8px 12px;
          vertical-align: top;
        }
        .record-table .field-name {
          background-color: #f0f0f0;
          font-weight: bold;
          width: 30%;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .record-table .field-value {
          width: 70%;
        }
        .print-footer {
          position: fixed;
          bottom: 10mm;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 10px;
        }
      }
    `;
    document.head.appendChild(printStyles);

    // Get current date
    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });

    // Get table data - assuming rows are available in component state/props
    const tableData = data || [];
    const totalRecords = tableData.length;

    // Create custom print content
    const printContent = document.createElement("div");
    printContent.className = "custom-print-container";

    // Create header
    const header = document.createElement("div");
    header.className = "print-header";
    const organizationName =
      userData?.organization?.organization_name || "Organization";
    header.innerHTML = `
      <div class="print-title">${organizationName}</div>
      <div class="print-subtitle">${tableName}</div>
      <div class="print-meta">
        <span>Generated on: ${currentDate}</span>
        <span>Total Records: ${totalRecords}</span>
      </div>
    `;
    printContent.appendChild(header);

    // Create records sections
    tableData.forEach((row, index) => {
      const recordSection = document.createElement("div");
      recordSection.className = "record-section";

      const recordTitle = document.createElement("div");
      recordTitle.className = "record-title";
      recordTitle.textContent = `Record ${index + 1}`;
      recordSection.appendChild(recordTitle);

      const recordTable = document.createElement("table");
      recordTable.className = "record-table";

      // Create table rows for each field
      Object.entries(row).forEach(([key, value]) => {
        // Skip internal MUI DataGrid fields
        if (key.startsWith("_") || key === "id") return;

        const tableRow = document.createElement("tr");
        const fieldNameCell = document.createElement("td");
        fieldNameCell.className = "field-name";
        fieldNameCell.textContent =
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

        const fieldValueCell = document.createElement("td");
        fieldValueCell.className = "field-value";
        fieldValueCell.textContent = value || "";

        tableRow.appendChild(fieldNameCell);
        tableRow.appendChild(fieldValueCell);
        recordTable.appendChild(tableRow);
      });

      recordSection.appendChild(recordTable);
      printContent.appendChild(recordSection);
    });

    // Add footer
    const footer = document.createElement("div");
    footer.className = "print-footer";
    footer.innerHTML = `${totalRecords} records exported<span style="float: right;">Page 1 of 2</span>`;
    printContent.appendChild(footer);

    // Add to document body
    document.body.appendChild(printContent);

    // Trigger print
    window.print();

    // Clean up after print
    setTimeout(() => {
      document.body.removeChild(printContent);
      const printStylesElement = document.getElementById("table-print-styles");
      if (printStylesElement) {
        printStylesElement.remove();
      }
    }, 1000);
  }, [data, userData]);

  // Memoized toolbar buttons to prevent re-renders
  const ToolbarButtons = useMemo(
    () => (
      <>
        <Box display="flex" gap={1} alignItems="center">
          <ToggleButtonGroup value={view} exclusive size="small">
            <ToggleButton value="table" onClick={() => setView("table")}>
              <TableRowsIcon />
            </ToggleButton>
            <ToggleButton value="card" onClick={() => setView("card")}>
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Button
          variant="text"
          title="Filters"
          sx={{
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            borderRadius: "50%",
            minWidth: "48px",
            width: "48px",
            height: "48px",
            position: "relative",
          }}
          onClick={handleFilterDialogOpen}
        >
          <Filter size={20} />
          {activeFilters > 0 && (
            <Box
              component="span"
              sx={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                backgroundColor: colors.error,
                color: "white",
                borderRadius: "50%",
                minWidth: "20px",
                height: "20px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {activeFilters}
            </Box>
          )}
        </Button>
        <Button
          variant="text"
          title="Manage Columns"
          sx={{
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            borderRadius: "50%",
            minWidth: "48px",
            width: "48px",
            height: "48px",
          }}
          onClick={handleColumnDialogOpen}
        >
          <Columns3 strokeWidth={3} size={20} />
        </Button>
        <Box sx={{ position: "relative" }}>
          <Button
            variant="text"
            title="Export Data"
            sx={{
              backgroundColor: "transparent",
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              borderRadius: "50%",
              minWidth: "48px",
              width: "48px",
              height: "48px",
            }}
            onClick={(event) => setExportMenuAnchorEl(event.currentTarget)}
          >
            <Download size={20} />
          </Button>
        </Box>
        <Button
          variant="text"
          title="Print Table"
          sx={{
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            borderRadius: "50%",
            minWidth: "48px",
            width: "48px",
            height: "48px",
          }}
          onClick={handlePrint}
        >
          <Printer size={20} />
        </Button>
        {showLayoutButtons && (
          <>
            <Button
              variant="text"
              title="Save Layout"
              sx={{
                backgroundColor: "transparent",
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                borderRadius: "50%",
                minWidth: "48px",
                width: "48px",
                height: "48px",
              }}
              onClick={saveLayout}
            >
              <Save size={20} />
            </Button>
            <Button
              variant="text"
              title="Reset Layout"
              sx={{
                backgroundColor: "transparent",
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                borderRadius: "50%",
                minWidth: "48px",
                width: "48px",
                height: "48px",
              }}
              onClick={resetLayout}
            >
              <RefreshCw size={20} />
            </Button>
          </>
        )}
      </>
    ),
    [
      colors,
      activeFilters,
      handleFilterDialogOpen,
      handleColumnDialogOpen,
      saveLayout,
      resetLayout,
      exportCurrentConfig,
      handleImportConfig,
      theme.palette.text.primary,
      theme.palette.action.hover,
      handlePrint,
      data,
      userData,
      showLayoutButtons, // Added this
      setExportMenuAnchorEl,
      view,
      setView,
    ]
  );

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  return (
    <Box
      sx={{
        p: isSmallScreen ? 2 : 3,
        maxWidth: "100%",
        margin: "0 auto",
        fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
    >
      {/* Toolbar */}
      {!hideToolbar && ( // Conditionally render toolbar based on hideToolbar prop
        <Paper
          elevation={1}
          sx={{
            mb: 3,
            p: isSmallScreen ? 1 : 2,
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            flexWrap: isSmallScreen ? "nowrap" : "wrap",
            gap: isSmallScreen ? 1 : 0.5,
            alignItems: isSmallScreen ? "stretch" : "center",
            justifyContent: isSmallScreen ? "flex-start" : "space-between",
            backgroundColor: colors.surface,
            width: "100%",
            minWidth: 0,
          }}
        >
          <TextField
            size="small"
            placeholder="Search across all columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: "300px",
              maxWidth: isSmallScreen ? "100%" : "400px",
              width: isSmallScreen ? "100%" : "auto",
              mb: isSmallScreen ? 1 : 0,
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.palette.background.paper,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color={colors.grey[500]} />
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: isSmallScreen ? "row" : "row",
              flexWrap: isSmallScreen ? "wrap" : "nowrap",
              gap: isSmallScreen ? 1 : 0.5,
              width: isSmallScreen ? "100%" : "auto",
              justifyContent: isSmallScreen ? "flex-start" : "flex-end",
              alignItems: "center",
            }}
          >
            {ToolbarButtons}
          </Box>
        </Paper>
      )}

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchorEl}
        open={Boolean(exportMenuAnchorEl)}
        onClose={() => setExportMenuAnchorEl(null)}
      >
        <MenuItem onClick={exportToExcel}>Export to XLS</MenuItem>
        <MenuItem onClick={exportToPDF}>Export to PDF</MenuItem>
        <MenuItem onClick={exportToHTML}>Export to HTML</MenuItem>
        <MenuItem onClick={exportToCSV}>Export to CSV</MenuItem>
      </Menu>

      {/* Filters Dialog */}
      {showFilters && (
        <Dialog
          open={showFilters}
          onClose={handleFilterDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : colors.grey[300],
              color: colors.text.primary,
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
                variant="h6"
                component="span"
                sx={{ fontWeight: 500 }}
              >
                Filters
              </Typography>
              <IconButton
                title="Close"
                onClick={handleFilterDialogClose}
                sx={{ color: colors.text.primary }}
              >
                <X size={20} />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent
            sx={{
              p: 4,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.default
                  : colors.surface,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 2,
                mb: 2,
                pt: 2,
              }}
            >
              {/*  Only show filterable columns */}
              {visibleColumns
                .filter((col) => col.filterable !== false) // Filter only filterable columns
                .map((col) => (
                  <TextField
                    key={col.key}
                    label={formatLabel(col.label)}
                    variant="outlined"
                    size="small"
                    value={pendingFilters[col.key] || ""}
                    onChange={(e) =>
                      handlePendingFilterChange(col.key, e.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <Search
                          size={16}
                          style={{
                            marginRight: "8px",
                            color: colors.grey[800],
                          }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: colors.surface,
                      },
                    }}
                  />
                ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                title="Apply all filters"
                sx={{
                  backgroundColor: colors.primary,
                  color: "white",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.light
                        : theme.palette.primary.dark,
                  },
                }}
                startIcon={<Filter size={16} />}
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                title="Remove all filters"
                sx={{
                  color: colors.text.secondary,
                  borderColor: colors.text.secondary,
                  "&:hover": {
                    borderColor: colors.text.primary,
                    color: colors.text.primary,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                startIcon={<X size={16} />}
                onClick={clearAllFilters}
              >
                Clear All Filters
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Column Manager Dialog */}
      {columnManagerOpen && (
        <Dialog
          open={columnManagerOpen}
          onClose={handleColumnDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              backgroundColor: colors.grey[300],
              color: colors.text.primary,
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
                variant="h6"
                component="span"
                sx={{ fontWeight: 500 }}
              >
                Manage Columns
              </Typography>
              <IconButton
                title="Close"
                onClick={handleColumnDialogClose}
                sx={{ color: colors.text.primary }}
              >
                <X size={20} />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent
            sx={{
              p: 3,
              backgroundColor: colors.surface,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={allPendingColumnsVisible}
                  onChange={handleSelectAllPendingColumns}
                  sx={{ color: colors.success }}
                />
              }
              label={
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: colors.text.primary }}
                >
                  Select All
                </Typography>
              }
              sx={{ mb: 2 }}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 2,
                mb: 3,
              }}
            >
              {pendingColumns.map((col) => (
                <FormControlLabel
                  key={col.key}
                  control={
                    <Checkbox
                      checked={col.visible}
                      onChange={() => togglePendingColumnVisibility(col.key)}
                      disabled={col.mandatory}
                      sx={{ color: colors.success }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{ color: colors.text.primary }}
                    >
                      {formatLabel(col.label)}
                    </Typography>
                  }
                />
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                title="Apply changes"
                sx={{
                  backgroundColor: colors.primary,
                  color: "white",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.light
                        : theme.palette.primary.dark,
                  },
                }}
                startIcon={<Columns3 size={16} />}
                onClick={applyColumnChanges}
              >
                Apply
              </Button>
              <Button
                variant="outlined"
                title="Cancel changes"
                sx={{
                  color: colors.text.secondary,
                  borderColor: colors.text.secondary,
                  "&:hover": {
                    borderColor: colors.text.primary,
                    color: colors.text.primary,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                startIcon={<X size={16} />}
                onClick={cancelColumnChanges}
              >
                Cancel
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Data Display - Cards for mobile/tablet, Table for desktop */}
      {isSmallScreen ? (
        // Dynamic Card Layout for Mobile/Tablet
        <Box>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress size={24} sx={{ color: colors.primary }} />
              <Typography
                variant="body2"
                sx={{ mt: 1, ml: 2, color: colors.text.secondary }}
              >
                Loading data...
              </Typography>
            </Box>
          ) : paginatedData?.length === 0 ? (
            <Paper
              elevation={1}
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: colors.surface,
              }}
            >
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                No records found.
              </Typography>
            </Paper>
          ) : view === "table" ? (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="dynamic data grid">
                <TableHead>
                  <TableRow sx={{ backgroundColor: colors.grey[100] }}>
                    {visibleColumns.map((col, index) => (
                      <TableCell
                        key={col.key}
                        sx={{
                          p: 2,
                          textAlign: "left",
                          fontWeight: 700,
                          fontSize: "14px",
                          color: colors.text.primary,
                          borderRight: `1px solid ${colors.grey[300]}`,
                          minWidth: col.width,
                          maxWidth: col.width,
                          position:
                            col.pinned === "left" ? "sticky" : "relative",
                          left: col.pinned === "left" ? 0 : "auto",
                          backgroundColor:
                            col.pinned === "left" ? colors.surface : undefined,
                          zIndex: col.pinned === "left" ? 2 : undefined,
                          userSelect: "none",
                          textTransform: "capitalize",
                          letterSpacing: "0.08333em",
                          cursor:
                            resizingColumnKey === col.key
                              ? "col-resize"
                              : "default",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const dropIndex = index;
                          const dragIndex = Number.parseInt(
                            e.dataTransfer.getData("text/plain"),
                            10
                          );
                          if (dragIndex !== dropIndex) {
                            handleColumnReorder(dragIndex, dropIndex);
                          }
                          setDraggedColumnIndex(null);
                        }}
                      >
                        <Box
                          component="span"
                          title={`Click to sort by ${formatLabel(col.label)} or drag to reorder`}
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            "&:hover": { cursor: "grab" },
                            "&:active": { cursor: "grabbing" },
                            "&:hover .sort-icon": { opacity: 1 },
                          }}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "text/plain",
                              index.toString()
                            );
                            setDraggedColumnIndex(index);
                          }}
                          onDragEnd={() => setDraggedColumnIndex(null)}
                          onClick={() => handleSort(col.key)}
                        >
                          {formatLabel(col.label)}
                          {col.pinned === "left" && (
                            <PushPinIcon
                              fontSize="small"
                              sx={{
                                ml: 0.5,
                                color: colors.primary,
                                opacity: 0.8,
                                transform: "rotate(-20deg)",
                              }}
                              titleAccess="Pinned column"
                            />
                          )}
                          {col.sortable && (
                            <Box
                              className="sort-icon"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "14px",
                                opacity: sortConfig[0].key === col.key ? 1 : 0,
                                transition: "opacity 0.2s ease-in-out",
                                color: colors.primary,
                                "&:hover": { opacity: 1 },
                              }}
                            >
                              {sortConfig[0].key === col.key ? (
                                sortConfig[0].direction === "asc" ? (
                                  <span>↑</span>
                                ) : (
                                  <span>↓</span>
                                )
                              ) : (
                                <span style={{ opacity: 0.5 }}>↕</span>
                              )}
                            </Box>
                          )}
                        </Box>
                        {/* Resize handle */}
                        <Box
                          sx={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: "16px",
                            cursor: "col-resize",
                            backgroundColor:
                              resizingColumnKey === col.key
                                ? colors.primary
                                : "transparent",
                            opacity: resizingColumnKey === col.key ? 0.5 : 0.2,
                            "&:hover": {
                              opacity: 1,
                              backgroundColor: colors.primary,
                            },
                            transition:
                              "opacity 0.2s ease-in-out, background-color 0.2s ease-in-out",
                            zIndex: 2,
                          }}
                          onMouseDown={(e) => handleMouseDown(e, col.key)}
                        />
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: colors.grey[100],
                          position: "sticky",
                          right: 0,
                          zIndex: 2,
                          borderBottom: `1px solid ${colors.grey[300]}`,
                        }}
                      >
                        {/* Optionally add 'Actions' label here */}
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length + 1}
                        sx={{ textAlign: "center", py: 3 }}
                      >
                        <CircularProgress
                          size={24}
                          sx={{ color: colors.primary }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, ml: 2, color: colors.text.secondary }}
                        >
                          Loading data...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : paginatedData?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length + 1}
                        sx={{ textAlign: "center", py: 3 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: colors.text.secondary }}
                        >
                          No records found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData?.map((row, rowIndex) => (
                      <TableRow key={row?.[mainKey] || rowIndex}>
                        {visibleColumns.map((col) => (
                          <TableCell
                            key={col.key}
                            sx={{
                              p: 2,
                              fontSize: "14px",
                              color: colors.text.primary,
                              borderBottom: `1px solid ${colors.grey[200]}`,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: col.width || 150,
                            }}
                          >
                            {/* CHANGE START */}
                            {col.key?.toLowerCase() === linkType ||
                            col.key?.toLowerCase() === linkType ||
                            col.label?.toLowerCase() === linkType ? (
                              <Box
                                component="span"
                                onClick={() => {
                                  onclickRow(row);
                                }}
                                sx={{
                                  cursor: "pointer",
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "skyblue"
                                      : "blue",
                                  textDecoration: "underline",
                                }}
                                title={title}
                              >
                                {String(getNestedValue(row, col.key))}
                              </Box>
                            ) : (
                              String(getNestedValue(row, col.key))
                            )}
                            {/* CHANGE END */}
                          </TableCell>
                        ))}
                        {showActions && (
                          <TableCell
                            sx={{
                              p: 2,
                              textAlign: "center",
                              borderBottom: `1px solid ${colors.grey[200]}`,
                              minWidth: 120,
                              maxWidth: 120,
                              position: "sticky",
                              right: 0,
                              backgroundColor: colors.background,
                              zIndex: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                justifyContent: "flex-end",
                              }}
                            >
                              <>
                                <Tooltip title="Show">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleShowData(row)}
                                    sx={{
                                      color:
                                        theme.palette.mode === "dark"
                                          ? "#fff"
                                          : "#333",
                                      "&:hover": {
                                        backgroundColor:
                                          theme.palette.mode === "dark"
                                            ? "rgba(255,255,255,0.1)"
                                            : "#33333315",
                                      },
                                    }}
                                  >
                                    <Eye size={20} />{" "}
                                    {/* ← Replaced Edit with Eye */}
                                  </IconButton>
                                </Tooltip>

                                {hasEditPermission && (
                                  <Tooltip title="Edit">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEdit(row)}
                                      sx={{
                                        color:
                                          theme.palette.mode === "dark"
                                            ? "#fff"
                                            : "#333",
                                        "&:hover": {
                                          backgroundColor:
                                            theme.palette.mode === "dark"
                                              ? "rgba(255,255,255,0.1)"
                                              : "#33333315",
                                        },
                                      }}
                                    >
                                      <Edit size={16} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {hasDeletePermission && (
                                  <Tooltip title="Delete">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDelete(row)}
                                      sx={{
                                        color:
                                          theme.palette.mode === "dark"
                                            ? "#fff"
                                            : "#333",
                                        "&:hover": {
                                          backgroundColor:
                                            theme.palette.mode === "dark"
                                              ? "rgba(255,255,255,0.1)"
                                              : "#33333315",
                                        },
                                      }}
                                    >
                                      <Trash2 size={16} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </>
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit,minmax(225px,1fr))"
              gap={2}
            >
              {paginatedData?.map((employee, index) => {
                console.log("CardColoumn", CardColoumn);

                const cardData = CardColoumn?.map((item) => {
                  const label = item?.key
                    ?.split("_") // Split by underscore
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
                    .join(" "); // Join with spaces

                  return {
                    ...item,
                    value: employee[item?.key],
                    label, // ✔ Add dynamically generated label
                  };
                });

                return (
                  <Box
                    key={index}
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      p: 2,
                      height: "max-content",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      "&:hover": {
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    {/* Card Content */}
                    <Box>
                      {cardData.map((item, i) => (
                        <Box key={i} mb={1}>
                          {item.type === "photo" ? (
                            <Box
                              component="img"
                              src={
                                item.value ||
                                "https://avatar.iran.liara.run/public/47"
                              }
                              alt="Employee"
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "1px solid #ccc",
                                mb: 1,
                              }}
                            />
                          ) : (
                            <Typography
                              variant={i === 0 ? "h6" : "body2"}
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "100%",
                                display: "block",
                              }}
                            >
                              <strong>{item?.value}</strong>
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "flex-start",
                      }}
                    >
                      {showActions && (
                        <>
                          <Tooltip title="Show">
                            <IconButton
                              size="small"
                              onClick={() => handleShowData(employee)}
                              sx={{
                                color:
                                  theme.palette.mode === "dark"
                                    ? "#fff"
                                    : "#333",
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.mode === "dark"
                                      ? "rgba(255,255,255,0.1)"
                                      : "#33333315",
                                },
                              }}
                            >
                              <Eye size={20} /> {/* ← Replaced Edit with Eye */}
                            </IconButton>
                          </Tooltip>

                          {hasEditPermission && (
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(employee)}
                                sx={{
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "#fff"
                                      : "#333",
                                  "&:hover": {
                                    backgroundColor:
                                      theme.palette.mode === "dark"
                                        ? "rgba(255,255,255,0.1)"
                                        : "#33333315",
                                  },
                                }}
                              >
                                <Edit size={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {hasDeletePermission && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(employee)}
                                sx={{
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "#fff"
                                      : "#333",
                                  "&:hover": {
                                    backgroundColor:
                                      theme.palette.mode === "dark"
                                        ? "rgba(255,255,255,0.1)"
                                        : "#33333315",
                                  },
                                }}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Mobile Pagination */}
          {!loading && paginatedData?.length > 0 && (
            <Paper
              elevation={1}
              sx={{
                mt: 2,
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                backgroundColor: colors.surface,
              }}
            >
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                {filteredData.length} records
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: colors.primary,
                    color: "white",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.dark,
                    },
                  }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                <Typography
                  variant="body2"
                  sx={{ color: colors.text.primary, fontWeight: 500, px: 1 }}
                >
                  {currentPage}/{totalPages}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: colors.primary,
                    color: "white",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.dark,
                    },
                  }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </Button>
              </Box>
            </Paper>
          )}
        </Box>
      ) : (
        <Paper
          elevation={1}
          sx={{ overflow: "hidden", backgroundColor: colors.surface }}
        >
          {view === "table" ? (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="dynamic data grid">
                <TableHead>
                  <TableRow sx={{ backgroundColor: colors.grey[100] }}>
                    {visibleColumns.map((col, index) => (
                      <TableCell
                        key={col.key}
                        sx={{
                          p: 2,
                          textAlign: "left",
                          fontWeight: 700,
                          fontSize: "14px",
                          color: colors.text.primary,
                          borderRight: `1px solid ${colors.grey[300]}`,
                          minWidth: col.width,
                          maxWidth: col.width,
                          position:
                            col.pinned === "left" ? "sticky" : "relative",
                          left: col.pinned === "left" ? 0 : "auto",
                          backgroundColor:
                            col.pinned === "left" ? colors.surface : undefined,
                          zIndex: col.pinned === "left" ? 2 : undefined,
                          userSelect: "none",
                          textTransform: "capitalize",
                          letterSpacing: "0.08333em",
                          cursor:
                            resizingColumnKey === col.key
                              ? "col-resize"
                              : "default",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const dropIndex = index;
                          const dragIndex = Number.parseInt(
                            e.dataTransfer.getData("text/plain"),
                            10
                          );
                          if (dragIndex !== dropIndex) {
                            handleColumnReorder(dragIndex, dropIndex);
                          }
                          setDraggedColumnIndex(null);
                        }}
                      >
                        <Box
                          component="span"
                          title={`Click to sort by ${formatLabel(col.label)} or drag to reorder`}
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            "&:hover": { cursor: "grab" },
                            "&:active": { cursor: "grabbing" },
                            "&:hover .sort-icon": { opacity: 1 },
                          }}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "text/plain",
                              index.toString()
                            );
                            setDraggedColumnIndex(index);
                          }}
                          onDragEnd={() => setDraggedColumnIndex(null)}
                          onClick={() => handleSort(col.key)}
                        >
                          {formatLabel(col.label)}
                          {col.pinned === "left" && (
                            <PushPinIcon
                              fontSize="small"
                              sx={{
                                ml: 0.5,
                                color: colors.primary,
                                opacity: 0.8,
                                transform: "rotate(-20deg)",
                              }}
                              titleAccess="Pinned column"
                            />
                          )}
                          {col.sortable && (
                            <Box
                              className="sort-icon"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "14px",
                                opacity: sortConfig[0].key === col.key ? 1 : 0,
                                transition: "opacity 0.2s ease-in-out",
                                color: colors.primary,
                                "&:hover": { opacity: 1 },
                              }}
                            >
                              {sortConfig[0].key === col.key ? (
                                sortConfig[0].direction === "asc" ? (
                                  <span>↑</span>
                                ) : (
                                  <span>↓</span>
                                )
                              ) : (
                                <span style={{ opacity: 0.5 }}>↕</span>
                              )}
                            </Box>
                          )}
                        </Box>
                        {/* Resize handle */}
                        <Box
                          sx={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: "16px",
                            cursor: "col-resize",
                            backgroundColor:
                              resizingColumnKey === col.key
                                ? colors.primary
                                : "transparent",
                            opacity: resizingColumnKey === col.key ? 0.5 : 0.2,
                            "&:hover": {
                              opacity: 1,
                              backgroundColor: colors.primary,
                            },
                            transition:
                              "opacity 0.2s ease-in-out, background-color 0.2s ease-in-out",
                            zIndex: 2,
                          }}
                          onMouseDown={(e) => handleMouseDown(e, col.key)}
                        />
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: colors.grey[100],
                          position: "sticky",
                          right: 0,
                          zIndex: 2,
                          borderBottom: `1px solid ${colors.grey[300]}`,
                        }}
                      >
                        {/* Optionally add 'Actions' label here */}
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length + (showActions ? 1 : 0)}
                        sx={{ textAlign: "center", py: 3 }}
                      >
                        <CircularProgress
                          size={24}
                          sx={{ color: colors.primary }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, ml: 2, color: colors.text.secondary }}
                        >
                          Loading data...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : paginatedData?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length + (showActions ? 1 : 0)}
                        sx={{ textAlign: "center", py: 3 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: colors.text.secondary }}
                        >
                          No records found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData?.map((row, rowIndex) => (
                      <TableRow key={row?.[mainKey] || rowIndex}>
                        {visibleColumns.map((col) => (
                          <TableCell
                            key={col.key}
                            sx={{
                              p: 2,
                              fontSize: "14px",
                              color: colors.text.primary,
                              borderBottom: `1px solid ${colors.grey[200]}`,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: col.width || 150,
                              position:
                                col.pinned === "left" ? "sticky" : "relative",
                              left: col.pinned === "left" ? 0 : "auto",
                              backgroundColor:
                                col.pinned === "left"
                                  ? colors.surface
                                  : undefined,
                              zIndex: col.pinned === "left" ? 1 : undefined,
                            }}
                          >
                            {/* CHANGE START */}
                            {col.key?.toLowerCase() === linkType ||
                            col.key?.toLowerCase() === linkType ||
                            col.label?.toLowerCase() === linkType ? (
                              <Box
                                component="span"
                                onClick={() => {
                                  onclickRow(row);
                                }}
                                sx={{
                                  cursor: "pointer",
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "skyblue"
                                      : "blue",
                                  textDecoration: "underline",
                                }}
                                title={title}
                              >
                                {String(getNestedValue(row, col.key))}
                              </Box>
                            ) : (
                              String(getNestedValue(row, col.key))
                            )}
                            {/* CHANGE END */}
                          </TableCell>
                        ))}
                        {showActions && (
                          <TableCell
                            sx={{
                              p: 2,
                              textAlign: "center",
                              borderBottom: `1px solid ${colors.grey[200]}`,
                              minWidth: 120,
                              maxWidth: 120,
                              position: "sticky",
                              right: 0,
                              backgroundColor: colors.background,
                              zIndex: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                justifyContent: "flex-end",
                              }}
                            >
                              <>
                                <Tooltip title="Show">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleShowData(row)}
                                    sx={{
                                      color:
                                        theme.palette.mode === "dark"
                                          ? "#fff"
                                          : "#333",
                                      "&:hover": {
                                        backgroundColor:
                                          theme.palette.mode === "dark"
                                            ? "rgba(255,255,255,0.1)"
                                            : "#33333315",
                                      },
                                    }}
                                  >
                                    <Eye size={20} />{" "}
                                    {/* ← Replaced Edit with Eye */}
                                  </IconButton>
                                </Tooltip>

                                {hasEditPermission && (
                                  <Tooltip title="Edit">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEdit(row)}
                                      sx={{
                                        color:
                                          theme.palette.mode === "dark"
                                            ? "#fff"
                                            : "#333",
                                        "&:hover": {
                                          backgroundColor:
                                            theme.palette.mode === "dark"
                                              ? "rgba(255,255,255,0.1)"
                                              : "#33333315",
                                        },
                                      }}
                                    >
                                      <Edit size={16} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {hasDeletePermission && (
                                  <Tooltip title="Delete">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDelete(row)}
                                      sx={{
                                        color:
                                          theme.palette.mode === "dark"
                                            ? "#fff"
                                            : "#333",
                                        "&:hover": {
                                          backgroundColor:
                                            theme.palette.mode === "dark"
                                              ? "rgba(255,255,255,0.1)"
                                              : "#33333315",
                                        },
                                      }}
                                    >
                                      <Trash2 size={16} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </>
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit,minmax(225px,1fr))"
              gap={2}
            >
              {paginatedData?.map((employee, index) => {
                console.log("CardColoumn", CardColoumn);

                const cardData = CardColoumn?.map((item) => {
                  const label = item?.key
                    ?.split("_") // Split by underscore
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
                    .join(" "); // Join with spaces

                  return {
                    ...item,
                    value: employee[item?.key],
                    label, // ✔ Add dynamically generated label
                  };
                });

                return (
                  <Box
                    key={index}
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      p: 2,
                      height: "max-content",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      "&:hover": {
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    {/* Card Content */}
                    <Box>
                      {cardData.map((item, i) => (
                        <Box key={i} mb={1}>
                          {item.type === "photo" ? (
                            <Box
                              component="img"
                              src={
                                item.value ||
                                "https://avatar.iran.liara.run/public/47"
                              }
                              alt="Employee"
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "1px solid #ccc",
                                mb: 1,
                              }}
                            />
                          ) : (
                            <Typography
                              variant={i === 0 ? "h6" : "body2"}
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "100%",
                                display: "block",
                              }}
                            >
                              <strong>{item?.value}</strong>
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "flex-start",
                      }}
                    >
                      {showActions && (
                        <>
                          <Tooltip title="Show">
                            <IconButton
                              size="small"
                              onClick={() => handleShowData(employee)}
                              sx={{
                                color:
                                  theme.palette.mode === "dark"
                                    ? "#fff"
                                    : "#333",
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.mode === "dark"
                                      ? "rgba(255,255,255,0.1)"
                                      : "#33333315",
                                },
                              }}
                            >
                              <Eye size={20} /> {/* ← Replaced Edit with Eye */}
                            </IconButton>
                          </Tooltip>

                          {hasEditPermission && (
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(employee)}
                                sx={{
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "#fff"
                                      : "#333",
                                  "&:hover": {
                                    backgroundColor:
                                      theme.palette.mode === "dark"
                                        ? "rgba(255,255,255,0.1)"
                                        : "#33333315",
                                  },
                                }}
                              >
                                <Edit size={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {hasDeletePermission && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(employee)}
                                sx={{
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "#fff"
                                      : "#333",
                                  "&:hover": {
                                    backgroundColor:
                                      theme.palette.mode === "dark"
                                        ? "rgba(255,255,255,0.1)"
                                        : "#33333315",
                                  },
                                }}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      )}

      {/* Status Bar and Pagination - Desktop Only */}
      {!isSmallScreen && (
        <Paper
          elevation={1}
          sx={{
            mt: 2,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            backgroundColor: colors.surface,
          }}
        >
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Showing {filteredData.length} of {data.length} records
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            {activeFilters} filter(s) active
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={rowsPerPage}
              label="Rows per page"
              onChange={handleRowsPerPageChange}
              sx={{ backgroundColor: colors.surface }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              title="Previous page"
              sx={{
                backgroundColor: colors.primary,
                color: theme.palette.mode === "dark" ? "black" : "white",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.light
                      : theme.palette.primary.dark,
                },
              }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Typography
              variant="body2"
              sx={{ color: colors.text.primary, fontWeight: 500 }}
            >
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              variant="contained"
              title="Next page"
              sx={{
                backgroundColor: colors.primary,
                color: theme.palette.mode === "dark" ? "black" : "white",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.light
                      : theme.palette.primary.dark,
                },
              }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </Box>
        </Paper>
      )}

      {/* Delete Dialog */}
      {/* <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: colors.error, color: "white" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="span" sx={{ fontWeight: 500 }}>
              Confirm Delete
            </Typography>
            <IconButton
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: "white" }}
            >
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 3,
            backgroundColor: colors.surface,
          }}
        >
          <Typography variant="body1" sx={{ color: colors.text.primary }}>
            Are you sure you want to permanently delete this item? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            backgroundColor: colors.surface,
          }}
        >
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            sx={{
              backgroundColor: colors.error,
              color: "white",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.error.light
                    : theme.palette.error.dark,
              },
            }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: colors.text.secondary,
              borderColor: colors.text.secondary,
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: colors.surface,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${colors.error} 0%, ${theme.palette.mode === "dark" ? theme.palette.error.dark : theme.palette.error.light} 100%)`,
            color: "white",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  p: 1,
                  display: "flex",
                  backdropFilter: "blur(10px)",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                </svg>
              </Box>
              <Typography
                variant="h6"
                component="span"
                sx={{ fontWeight: 600, letterSpacing: "0.3px" }}
              >
                Confirm Delete
              </Typography>
            </Box>
            <IconButton
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                color: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  transform: "rotate(90deg)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 4,
            backgroundColor: colors.surface,
          }}
        >
          <Box
            sx={{
              alignItems: "flex-start",
              gap: 2,
              p: 2.5,
              borderRadius: 2,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(244, 67, 54, 0.1)"
                  : "rgba(244, 67, 54, 0.05)",
              border: `1px solid ${theme.palette.mode === "dark" ? "rgba(244, 67, 54, 0.2)" : "rgba(244, 67, 54, 0.15)"}`,
            }}
          >
            <Box
              sx={{
                color: colors.error,
                mt: 0.3,
                minWidth: "24px",
              }}
            >
              <svg
                style={{ position: "relative", top: "23", right: "13px" }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>

              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  color: colors.text.primary,
                  lineHeight: 1.6,
                  ml: 2,
                  fontSize: "0.95rem",
                }}
              >
                Are you sure you want to permanently delete this item? This
                action cannot be undone.
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: colors.text.secondary, mt: 1 }}
            >
              Deleting this item will also permanently remove all related
              records.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            pt: 0,
            pb: 3,
            backgroundColor: colors.surface,
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: colors.text.secondary,
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.2)",
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.95rem",
              "&:hover": {
                borderColor: colors.text.secondary,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            sx={{
              background: `linear-gradient(135deg, ${colors.error} 0%, ${theme.palette.mode === "dark" ? theme.palette.error.light : theme.palette.error.dark} 100%)`,
              color: "white",
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.95rem",
              boxShadow: `0 4px 12px ${theme.palette.mode === "dark" ? "rgba(244, 67, 54, 0.3)" : "rgba(244, 67, 54, 0.4)"}`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.mode === "dark" ? theme.palette.error.light : theme.palette.error.dark} 0%, ${colors.error} 100%)`,
                boxShadow: `0 6px 16px ${theme.palette.mode === "dark" ? "rgba(244, 67, 54, 0.4)" : "rgba(244, 67, 54, 0.5)"}`,
                transform: "translateY(-1px)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      {snackbar.open && (
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            maxWidth: 400,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 2,
              backgroundColor:
                snackbar.severity === "error"
                  ? colors.error
                  : snackbar.severity === "warning"
                    ? colors.warning
                    : snackbar.severity === "info"
                      ? colors.info
                      : colors.success,
              color: "white",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "white" }}>
              {snackbar.message}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setSnackbar({ ...snackbar, open: false })}
              sx={{ color: "white", p: 0.5 }}
            >
              <X size={16} />
            </IconButton>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default CustomisetableAlter;
