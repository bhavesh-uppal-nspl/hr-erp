

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
} from "lucide-react";
import { Eye } from "lucide-react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import toast from "react-hot-toast";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import {
  saveLayoutToConfig,
  resetLayoutToDefault,
  getUserConfig,
  getDefaultConfig,
  getTableConfig,
} from "../../Configurations/TableDataConfig";
import PushPinIcon from "@mui/icons-material/PushPin";
import { FilterBuilder } from "../filters";
import {
  OPERATORS,
  operatorRequiresMultipleValues,
  operatorRequiresValue,
} from "../filters/operators";
import ActiveFiltersBar from "./ActiveFiltersBar";
import Toolbar from "./Toolbar";
import TablePagination from "./TablePagination";
import { MAIN_URL } from "../../Configurations/Urls";

// Constants to avoid recreating objects
const DEFAULT_ROWS_PER_PAGE = 10;

const formatLabel = (label) => {
  return label.replace(/_/g, " ");
};

// Helper function to construct proper image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://avatar.iran.liara.run/public/47";
 
  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
 
  // If it starts with /storage/, construct full URL with backend
  if (imagePath.startsWith('/storage/')) {
    return `${MAIN_URL}${imagePath}`;
  }
 
  // If it's just a filename or relative path, construct full URL
  if (imagePath.startsWith('storage/')) {
    return `${MAIN_URL}/${imagePath}`;
  }
 
  // If it's just a filename, assume it's in storage/employees/
  return `${MAIN_URL}/storage/app/public/employees/${imagePath}`;
};

const Customisetable = ({
  Route,
  configss,
  onFilterChange,
  DeleteFunc,
  onclickRow,
  EditFunc,
  configuration,
  tableName,
  recordKey,
  recordLabel,
  mainKey,
  title,
  linkType,
  mainData,
  showActions,
  CardColoumn = [],
  hideToolbar,
  onSaveLayout,
  handleShow,
  onResetLayout,
  loadedBackendConfig,
  paginationData,
  filterModule, // Optional: module name for filter builder (defaults to tableName)
}) => {
  const { userData } = useAuthStore();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallScreen = isMobile || isTablet;

  const [showRowCheckboxes, setShowRowCheckboxes] = useState(false);

  const navigate = useNavigate();

  const [view, setView] = useState("table");

  const [columns, setColumns] = useState([]);
  const [originalColumnOrder, setOriginalColumnOrder] = useState([]);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState(
    configuration?.[0]?.default_config.sortConfig || []
  );
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [pendingFilterBuilderFilters, setPendingFilterBuilderFilters] =
    useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [columnManagerOpen, setColumnManagerOpen] = useState(false);
  const [draggedColumnIndex, setDraggedColumnIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const [resizingColumnKey, setResizingColumnKey] = useState(null);
  const initialMouseX = useRef(0);
  const initialColumnWidth = useRef(0);
  const [pendingColumns, setPendingColumns] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const hasInitializedFromURL = useRef(false);

  const [backendPagination, setBackendPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [lockedFilters, setLockedFilters] = useState({});

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = paginatedData.map((row) => row[mainKey]);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (hasInitializedFromURL.current) return;

    const pageParam = Number.parseInt(searchParams.get("page")) || 1;
    const pageSizeParam =
      Number.parseInt(searchParams.get("pageSize")) || DEFAULT_ROWS_PER_PAGE;

    // Load search query from URL
    const searchParam = searchParams.get("search") || "";

    // Load filters from URL params
    const urlFilters = {};
    const urlOperators = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith("filter_") && !key.endsWith("_operator")) {
        const filterKey = key.replace("filter_", "");
        // Check if operator doesn't require value
        const operatorKey = `filter_${filterKey}_operator`;
        const operator = searchParams.get(operatorKey);
        const requiresValue = operator ? operatorRequiresValue(operator) : true;

        // Include filter if value exists OR if operator doesn't require value
        if (value || !requiresValue) {
          urlFilters[filterKey] = value || "";
          if (operator) {
            urlOperators[filterKey] = operator;
          }
        }
      }
    });

    setCurrentPage(pageParam);
    setRowsPerPage(pageSizeParam);
    setFilters(urlFilters);
    setSearchQuery(searchParam);
    setPendingFilters(urlFilters);

    hasInitializedFromURL.current = true;
  }, []);

  useEffect(() => {
    if (paginationData) {
      setBackendPagination(paginationData);

      const urlPage = Number.parseInt(searchParams.get("page")) || 1;
      const urlPageSize =
        Number.parseInt(searchParams.get("pageSize")) || DEFAULT_ROWS_PER_PAGE;

      // Backend may return limit instead of pageSize
      const backendPageSize =
        paginationData.pageSize || paginationData.limit || urlPageSize;
      const backendPage = paginationData.page || urlPage;

      // Always trust URL params for page (user-initiated changes)
      // Only sync pageSize from backend if it matches URL
      setCurrentPage(urlPage);

      // For pageSize, prefer backend if it matches URL, otherwise use URL
      if (backendPageSize === urlPageSize || !paginationData.pageSize) {
        setRowsPerPage(urlPageSize);
      } else {
        setRowsPerPage(backendPageSize);
      }
    }
  }, [paginationData, searchParams]);

  // Helper function to update URL
  const updateURL = useCallback(
    (updates) => {
      const newSearchParams = new URLSearchParams(searchParams);

      // Update filters
      if (updates.filters !== undefined) {
        // Remove all existing filter params (including operators and logics)
        Array.from(newSearchParams.keys()).forEach((key) => {
          if (key.startsWith("filter_")) {
            newSearchParams.delete(key);
          }
        });

        // Add new filter params
        Object.entries(updates.filters).forEach(([key, value]) => {
          // Check if operator requires a value
          const operator = updates.filterOperators?.[key];
          const requiresValue = operator
            ? operatorRequiresValue(operator)
            : true;

          // For operators that don't require values, allow empty string
          // For operators that require values, only add if value is valid
          if (
            !requiresValue ||
            (value !== null && value !== undefined && value !== "")
          ) {
            const stringValue = Array.isArray(value)
              ? value.map((v) => String(v)).join(",")
              : value === null || value === undefined
                ? ""
                : String(value);
            // For operators that don't require values, use empty string as placeholder
            if (!requiresValue || stringValue.trim() !== "") {
              newSearchParams.set(
                `filter_${key}`,
                requiresValue ? stringValue : ""
              );
            }
          }
        });

        // Add filter operators if provided
        if (updates.filterOperators !== undefined) {
          Object.entries(updates.filterOperators).forEach(([key, operator]) => {
            if (operator) {
              // Add operator if filter exists OR if operator doesn't require value
              const requiresValue = operatorRequiresValue(operator);
              const hasFilter =
                updates.filters && updates.filters[key] !== undefined;
              if (hasFilter || !requiresValue) {
                newSearchParams.set(`filter_${key}_operator`, operator);
                // If operator doesn't require value, also add empty filter value
                if (
                  !requiresValue &&
                  (!updates.filters || !updates.filters[key])
                ) {
                  newSearchParams.set(`filter_${key}`, "");
                }
              }
            }
          });
        }

      }

      // Update sort
      if (updates.sortConfig !== undefined && updates.sortConfig.length > 0) {
        newSearchParams.set("sortBy", updates.sortConfig[0].key);
        newSearchParams.set("sortOrder", updates.sortConfig[0].direction);
      }

      // Update search
      if (updates.searchQuery !== undefined) {
        if (updates.searchQuery.trim() !== "") {
          newSearchParams.set("search", updates.searchQuery);
        } else {
          newSearchParams.delete("search");
        }
      }

      // Update page
      if (updates.currentPage !== undefined) {
        if (updates.currentPage > 1) {
          newSearchParams.set("page", updates.currentPage.toString());
        } else {
          newSearchParams.delete("page");
        }
      }

      // Update rows per page
      if (updates.rowsPerPage !== undefined) {
        if (updates.rowsPerPage !== DEFAULT_ROWS_PER_PAGE) {
          newSearchParams.set("pageSize", updates.rowsPerPage.toString());
        } else {
          newSearchParams.delete("pageSize");
        }
      }

      setSearchParams(newSearchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Cache for nested values to avoid recalculating
  const valueCache = useRef(new Map());

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
      setColumns(backendColumns);
      setOriginalColumnOrder(backendColumns);

      if (loadedBackendConfig.sortConfig) {
        setSortConfig(loadedBackendConfig.sortConfig);
      }

      if (loadedBackendConfig.rowsPerPage) {
        setRowsPerPage(loadedBackendConfig.rowsPerPage);
      }

      // Filters are handled by a separate useEffect after loadFiltersFromConfig is defined
      // This avoids initialization order issues
    }
  }, [loadedBackendConfig]);

  const getNestedValue = useCallback((obj, path) => {
    const cacheKey = `${obj?.[mainKey] || JSON.stringify(obj)}_${path}`;
    if (valueCache.current.has(cacheKey)) {
      return valueCache.current.get(cacheKey);
    }
    const value = path?.split(".").reduce((acc, part) => acc && acc[part], obj);
    valueCache.current.set(cacheKey, value);
    return value;
  }, []);

  const loadDataFromConfiguration = useCallback(
    async (tableConfigName) => {
      setLoading(true);
      setData([]);
      setColumns([]);
      // setFilters({});
      // setPendingFilters({});
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

        if (loadedBackendConfig && loadedBackendConfig.columns) {
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
            // Handle filters - check if in FilterBuilder format (array) or simple format (object)
            // Note: We inline the logic here to avoid initialization order issues
            const configFilters = loadedBackendConfig.filters;
           
            if (Array.isArray(configFilters) && configFilters.length > 0) {
              // Filters are in FilterBuilder format, need to convert
              // This will be handled by the useEffect that watches loadedBackendConfig
              // For now, just store them - the useEffect at line 423 will convert them
              // We can't use convertFromFilterBuilderFormat here as it's defined later
              setPendingFilterBuilderFilters(configFilters);
            } else if (typeof configFilters === "object" && !Array.isArray(configFilters)) {
              // Already in simple format
              setFilters(configFilters);
              setPendingFilters(configFilters);
            }
          }
          return;
        }

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
    [getNestedValue, tableName, mainData, loadedBackendConfig]
  );

  useEffect(() => {
    if (tableName) {
      loadDataFromConfiguration(tableName);
    }
  }, [loadDataFromConfiguration, tableName, loadedBackendConfig]);

  const sortedData = useMemo(() => {
    const currentSort = sortConfig[0];
    if (!currentSort || !currentSort.key) return data;

    return [...data].sort((a, b) => {
      const aVal = getNestedValue(a, currentSort.key);
      const bVal = getNestedValue(b, currentSort.key);

      const isDateA =
        aVal && typeof aVal === "string" && !isNaN(Date.parse(aVal));
      const isDateB =
        bVal && typeof bVal === "string" && !isNaN(Date.parse(bVal));

      if (isDateA && isDateB) {
        const dateA = new Date(aVal).getTime();
        const dateB = new Date(bVal).getTime();
        return currentSort.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      const timeRegex =
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?(\s?(AM|PM))?$/i;
      if (
        typeof aVal === "string" &&
        typeof bVal === "string" &&
        timeRegex.test(aVal) &&
        timeRegex.test(bVal)
      ) {
        const parseTime = (timeStr) => {
          const [time, period] = timeStr.trim().split(" ");
          let [hours, minutes, seconds] = time.split(":").map(Number);
          if (isNaN(seconds)) seconds = 0;
          if (period?.toUpperCase() === "PM" && hours < 12) hours += 12;
          if (period?.toUpperCase() === "AM" && hours === 12) hours = 0;
          return hours * 3600 + minutes * 60 + seconds;
        };

        const timeA = parseTime(aVal);
        const timeB = parseTime(bVal);
        return currentSort.direction === "asc" ? timeA - timeB : timeB - timeA;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return currentSort.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return currentSort.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      if (aVal < bVal) return currentSort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return currentSort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, getNestedValue]);

  const filteredData = useMemo(() => {
    let result = sortedData;

    if (searchQuery.trim()) {
      const query = searchQuery?.toLowerCase().trim();
      result = result.filter((item) => {
        return (
          columns.some((col) => {
            const value = getNestedValue(item, col.key);
            if (value === null || value === undefined) return false;

            const stringValue = String(value)?.toLowerCase();
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

    Object.entries(filters).forEach(([key, value]) => {
      // Skip null/undefined values
      if (value === null || value === undefined) return;

      // Handle string values
      if (typeof value === "string") {
        if (value.trim() === "") return;

        const filterValue = value.toLowerCase().trim();
        result = result.filter((item) => {
          const itemValue = getNestedValue(item, key);
          if (itemValue === null || itemValue === undefined) return false;

          const itemString = String(itemValue)?.toLowerCase();
          const filterWords = filterValue
            ?.split(/\s+/)
            .filter((word) => word.length > 0);

          return filterWords.every((word) => itemString.includes(word));
        });
      }
      // Handle array values (for BETWEEN, IN, NOT_IN operators)
      else if (Array.isArray(value)) {
        // Skip empty arrays or arrays with all empty values
        const hasValidValues = value.some(
          (v) =>
            v !== null &&
            v !== undefined &&
            v !== "" &&
            !(typeof v === "string" && v.trim() === "")
        );
        if (!hasValidValues) return;

        // Note: Array-based filtering handled by backend/URL params
        // This section is for basic client-side filtering only
        // Advanced operators like BETWEEN are typically handled server-side
      }
    });

    return result;
  }, [sortedData, filters, searchQuery, columns]);

  useEffect(() => {
    // Only validate page for client-side pagination
    // For server-side pagination, trust the backend response
    if (paginationData?.totalPages) {
      // Server-side pagination - backend handles validation
      return;
    }

    // Client-side pagination validation
    const totalPages = Math.max(
      1,
      Math.ceil(filteredData.length / rowsPerPage)
    );
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
      updateURL({ currentPage: totalPages });
    } else if (filteredData.length === 0 && currentPage !== 1) {
      setCurrentPage(1);
      updateURL({ currentPage: 1 });
    }
  }, [
    filteredData.length,
    rowsPerPage,
    currentPage,
    updateURL,
    paginationData,
  ]);

  const totalPages = useMemo(() => {
    if (paginationData?.totalPages) {
      return paginationData.totalPages;
    }
    const pages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    return pages;
  }, [filteredData.length, rowsPerPage, paginationData]);

  const hasNext = paginationData?.hasNext ?? currentPage < totalPages;
  const hasPrev = paginationData?.hasPrev ?? currentPage > 1;

  const paginatedData = useMemo(() => {
    if (paginationData?.totalPages) {
      return data;
    }
    // Otherwise, paginate client-side
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [data, filteredData, currentPage, rowsPerPage, paginationData]);

  const handleSort = useCallback(
    (key) => {
      setSortConfig((prev) => {
        const currentSort = prev?.[0];
        const newSortConfig = [
          {
            key,
            direction:
              currentSort.key === key && currentSort.direction === "asc"
                ? "desc"
                : "asc",
          },
        ];

        updateURL({ sortConfig: newSortConfig, currentPage: 1 });
        return newSortConfig;
      });
      setCurrentPage(1);
    },
    [updateURL]
  );

  const handlePendingFilterChange = useCallback((key, value) => {
    setPendingFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const togglePendingColumnVisibility = useCallback((key) => {
    setPendingColumns((prev) =>
      prev.map((col) => {
        if (col.key === key && !col.mandatory) {
          return { ...col, visible: !col.visible };
        }
        return col;
      })
    );
  }, []);

  const handleSelectAllPendingColumns = useCallback((event) => {
    const isChecked = event.target.checked;
    setPendingColumns((prev) =>
      prev.map((col) => ({
        ...col,
        visible: col.mandatory ? true : isChecked,
      }))
    );
  }, []);

  const togglePendingColumnPinned = useCallback((key) => {
    setPendingColumns((prev) =>
      prev.map((col) => {
        if (col.key === key) {
          return { ...col, pinned: col.pinned === "left" ? undefined : "left" };
        }
        return col;
      })
    );
  }, []);

  const allPendingColumnsVisible = useMemo(() => {
    const nonMandatoryColumns = pendingColumns.filter((col) => !col.mandatory);
    return (
      nonMandatoryColumns.length > 0 &&
      nonMandatoryColumns.every((col) => col.visible)
    );
  }, [pendingColumns]);

  const handleColumnReorder = useCallback(
    (dragIndex, hoverIndex) => {
      const visibleCols = columns.filter((col) => col.visible);

      const dragColumn = visibleCols[dragIndex];
      const hoverColumn = visibleCols[hoverIndex];

      if (dragColumn?.pinned === "left" || hoverColumn?.pinned === "left") {
        return;
      }

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
    },
    [columns]
  );

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

  const applyFilters = useCallback(() => {
    // This is now handled by handleApplyFilterBuilderFilters
    // Keeping for backward compatibility if needed
    setFilters(pendingFilters);
    setCurrentPage(1);
    setShowFilters(false);
    updateURL({ filters: pendingFilters, currentPage: 1 });
  }, [pendingFilters, updateURL]);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setPendingFilters({});
    setPendingFilterBuilderFilters([]);
    setCurrentPage(1);
    updateURL({ filters: {}, currentPage: 1 });
  }, [updateURL]);

  // Helper to parse date string to Date object
  const parseDateValue = useCallback((dateString) => {
    if (!dateString || typeof dateString !== "string") return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date;
    } catch (e) {
      return null;
    }
  }, []);

  // Helper to check if a field is likely a date field based on field name
  const isDateField = useCallback((fieldName) => {
    const lowerFieldName = fieldName.toLowerCase();
    return (
      lowerFieldName.includes("date") ||
      lowerFieldName === "date_of_birth" ||
      lowerFieldName === "date_of_joining" ||
      lowerFieldName === "date_of_birth" ||
      lowerFieldName === "joining_date" ||
      lowerFieldName === "dob"
    );
  }, []);

  // Convert simple filters {key: value} to FilterBuilder format [{field, operator, value}]
  const convertToFilterBuilderFormat = useCallback(
    (simpleFilters, searchParamsForOperators = null) => {
      const paramsToUse = searchParamsForOperators || searchParams;

      return Object.entries(simpleFilters)
        .filter(([key, value]) => {
          // Read operator from URL params first to check if it requires a value
          const operatorKey = `filter_${key}_operator`;
          const operator = paramsToUse.get(operatorKey) || OPERATORS.CONTAINS;
          const requiresValue = operatorRequiresValue(operator);

          // Include filter if:
          // 1. Operator doesn't require value (today, this_week, this_month, is_null, is_not_null)
          // 2. Or value is valid (not null, undefined, or empty string)
          return (
            !requiresValue ||
            (value !== null && value !== undefined && value !== "")
          );
        })
        .map(([key, value], index) => {
          // Read operator from URL params
          const operatorKey = `filter_${key}_operator`;
          let operator = paramsToUse.get(operatorKey) || OPERATORS.CONTAINS; // Default to contains
          const requiresValue = operatorRequiresValue(operator);

          // For operators that don't require values, set value to null
          if (!requiresValue) {
            return {
              field: key,
              operator: operator,
              value: null,
            };
          }

          // Check if operator requires multiple values (array)
          const requiresMultipleValues =
            operatorRequiresMultipleValues(operator);

          // Parse date values to Date objects for DatePicker
          let parsedValue = value;

          // Handle array values (for BETWEEN, IN, NOT_IN operators)
          if (requiresMultipleValues && typeof value === "string") {
            // Split comma-separated string back to array
            const arrayValues = value
              .split(",")
              .map((v) => v.trim())
              .filter((v) => v !== "");

            if (isDateField(key) && operator === OPERATORS.BETWEEN) {
              // Parse date array for BETWEEN operator
              parsedValue = arrayValues.map((dateStr) => {
                const dateValue = parseDateValue(dateStr);
                return dateValue || dateStr; // Return Date object or original string if parsing fails
              });
            } else {
              // For IN, NOT_IN operators, keep as string array
              parsedValue = arrayValues;
            }
          } else if (isDateField(key) && !requiresMultipleValues) {
            // Single date value
            const dateValue = parseDateValue(String(value));
            if (dateValue) {
              parsedValue = dateValue;
              // If no operator specified for date, default to 'on'
              if (!paramsToUse.get(operatorKey)) {
                operator = OPERATORS.ON;
              }
            }
          } else if (typeof value === "string" && value.trim() !== "") {
            parsedValue = value.trim();
          }

          return {
            field: key,
            operator: operator,
            value: parsedValue,
          };
        });
    },
    [searchParams, isDateField, parseDateValue]
  );

  // Helper function to format date to YYYY-MM-DD without timezone issues
  const formatDateForFilter = (date) => {
    if (!(date instanceof Date)) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Convert FilterBuilder format [{field, operator, value}] to simple filters {key: value}
  // Returns object with filters and operators
  const convertFromFilterBuilderFormat = useCallback((filterBuilderFilters) => {
    const simpleFilters = {};
    const filterOperators = {};

    filterBuilderFilters.forEach((filter, index) => {
      if (!filter.field || !filter.operator) return;

      // Check if operator requires a value
      const requiresValue = operatorRequiresValue(filter.operator);

      // For operators that don't require values (today, this_week, this_month, is_null, is_not_null)
      // Allow null values and still include the filter
      if (!requiresValue) {
        // Store operator even if value is null
        filterOperators[filter.field] = filter.operator;
        // Store a special marker or empty string for URL compatibility
        simpleFilters[filter.field] = "";
        return;
      }

      // For operators that require values, check if value is valid
      const isValidValue =
        filter.value !== null &&
        filter.value !== undefined &&
        filter.value !== "" &&
        !(Array.isArray(filter.value) && filter.value.length === 0);

      if (isValidValue) {
        // Convert date objects to strings for URL storage
        let valueToStore = filter.value;
        if (filter.value instanceof Date) {
          // Use YYYY-MM-DD format to avoid timezone issues
          valueToStore = formatDateForFilter(filter.value);
        } else if (
          Array.isArray(filter.value) &&
          filter.value.length > 0 &&
          filter.value[0] instanceof Date
        ) {
          // Handle date arrays (for BETWEEN operator)
          valueToStore = filter.value
            .map((d) => (d instanceof Date ? formatDateForFilter(d) : d))
            .join(",");
        } else if (Array.isArray(filter.value)) {
          // Handle other array values (for IN, NOT_IN operators)
          valueToStore = filter.value.map((v) => String(v)).join(",");
        } else {
          valueToStore = String(filter.value);
        }

        simpleFilters[filter.field] = valueToStore;

        // Store operator if it's not the default (contains)
        // Also store operators for date fields and other special cases
        if (filter.operator && filter.operator !== OPERATORS.CONTAINS) {
          filterOperators[filter.field] = filter.operator;
        } else if (filter.operator) {
          // Store all operators, not just non-default ones
          filterOperators[filter.field] = filter.operator;
        }
      }
    });

    return {
      filters: simpleFilters,
      operators: filterOperators,
    };
  }, []);

  // Helper function to load filters from loadedBackendConfig
  // Handles both FilterBuilder format (array) and simple format (object)
  const loadFiltersFromConfig = useCallback(
    (configFilters) => {
      if (!configFilters) return;

      // Check if filters are in FilterBuilder format (array)
      if (Array.isArray(configFilters) && configFilters.length > 0) {
        // Convert FilterBuilder format to simple format
        const { filters: simpleFilters, operators: filterOperators } =
          convertFromFilterBuilderFormat(configFilters);

        setFilters(simpleFilters);
        setPendingFilters(simpleFilters);

        // Update URL params with the converted filters
        updateURL({
          filters: simpleFilters,
          filterOperators: filterOperators,
        });

        console.log("Loaded filters from FilterBuilder format:", {
          filterBuilder: configFilters,
          simple: simpleFilters,
          operators: filterOperators,
        });
      } else if (typeof configFilters === "object" && !Array.isArray(configFilters)) {
        // Already in simple format (object)
        setFilters(configFilters);
        setPendingFilters(configFilters);
        console.log("Loaded filters from simple format:", configFilters);
      }
    },
    [convertFromFilterBuilderFormat, updateURL]
  );

  // Load filters from loadedBackendConfig
  // This useEffect is placed after loadFiltersFromConfig is defined to avoid initialization order issues
  useEffect(() => {
    // Process filters if they exist (handles both FilterBuilder format and simple format)
    if (loadedBackendConfig?.filters) {
      // Now loadFiltersFromConfig is available since we're after its definition
      // It handles both FilterBuilder format (array) and simple format (object)
      loadFiltersFromConfig(loadedBackendConfig.filters);
    }
  }, [loadedBackendConfig?.filters, loadFiltersFromConfig]);

  const handleFilterDialogOpen = useCallback(() => {
    // Sync pending filters with current active filters from state
    setPendingFilters(filters);
   
    // Convert current filters to FilterBuilder format so they show in the dialog
    // Pass searchParams to read operators from URL
    const filterBuilderFilters = convertToFilterBuilderFormat(filters, searchParams);
    setPendingFilterBuilderFilters(filterBuilderFilters);
   
    // Open the dialog
    setShowFilters(true);
  }, [filters, convertToFilterBuilderFormat, searchParams]);

  const handleFilterDialogClose = useCallback(() => {
    setPendingFilters(filters);
    const filterBuilderFilters = convertToFilterBuilderFormat(filters);
    setPendingFilterBuilderFilters(filterBuilderFilters);
    setShowFilters(false);
  }, [filters, convertToFilterBuilderFormat]);

  const handleFilterBuilderChange = useCallback((newFilters) => {
    setPendingFilterBuilderFilters(newFilters);
  }, []);



  // Convert filters from URL to FilterBuilder format and notify parent when filters or searchParams change
  // This must be after convertToFilterBuilderFormat is defined
  useEffect(() => {
    // Wait for initialization to complete
    if (!hasInitializedFromURL.current) return;

    // Read current filters and operators from URL params (in case they changed externally)
    const currentFilters = {};
    const currentOperators = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith("filter_") && !key.endsWith("_operator")) {
        const filterKey = key.replace("filter_", "");
        const operatorKey = `filter_${filterKey}_operator`;
        const operator = searchParams.get(operatorKey);
        const requiresValue = operator ? operatorRequiresValue(operator) : true;

        if (value || !requiresValue) {
          currentFilters[filterKey] = value || "";
          if (operator) {
            currentOperators[filterKey] = operator;
          }
        }
      }
    });

    // Update local filters state if URL changed
    if (JSON.stringify(currentFilters) !== JSON.stringify(filters)) {
      setFilters(currentFilters);
    }

    // Only proceed if we have filters to convert
    if (
      Object.keys(currentFilters).length === 0 &&
      Object.keys(currentOperators).length === 0
    ) {
      // No filters, notify parent with empty array
      onFilterChange?.([]);
      return;
    }

    // Convert simple filters from URL to FilterBuilder format
    const filterBuilderFilters = convertToFilterBuilderFormat(currentFilters);

    // Normalize filters for API - ensure value: null for operators that don't require values
    const filtersForAPI = filterBuilderFilters.map((filter) => {
      const requiresValue = operatorRequiresValue(filter.operator);
      return {
        field: filter.field,
        operator: filter.operator,
        value: requiresValue
          ? filter.value !== undefined
            ? filter.value
            : null
          : null,
      };
    });

    // Notify parent component with FilterBuilder format filters
    onFilterChange?.(filtersForAPI);
  }, [searchParams, convertToFilterBuilderFormat, onFilterChange, filters]);

  const handleApplyFilterBuilderFilters = useCallback(() => {
    // Convert FilterBuilder filters back to simple format for URL storage
    const {
      filters: simpleFilters,
      operators: filterOperators,
    } = convertFromFilterBuilderFormat(pendingFilterBuilderFilters);
    setFilters(simpleFilters);
    setPendingFilters(simpleFilters);
    setCurrentPage(1);
    setShowFilters(false);
    updateURL({
      filters: simpleFilters,
      filterOperators: filterOperators,
      currentPage: 1,
    });

    // Also notify parent with FilterBuilder format (for API calls if needed)
    // Ensure filters have value: null for operators that don't require values
    const filtersForAPI = pendingFilterBuilderFilters.map((filter) => {
      const requiresValue = operatorRequiresValue(filter.operator);
      return {
        field: filter.field,
        operator: filter.operator,
        value: requiresValue
          ? filter.value !== undefined
            ? filter.value
            : null
          : null,
      };
    });
    onFilterChange?.(filtersForAPI);
  }, [
    pendingFilterBuilderFilters,
    convertFromFilterBuilderFormat,
    updateURL,
    onFilterChange,
  ]);

  const handleColumnDialogOpen = useCallback(() => {
    const columnsWithCurrentVisibility = originalColumnOrder.map((origCol) => {
      const currentCol = columns.find((col) => col.key === origCol.key);
      return {
        ...origCol,
        visible: currentCol?.visible ?? origCol.visible,
        mandatory: origCol.mandatory ?? false,
      };
    });
    setPendingColumns(columnsWithCurrentVisibility);
    setColumnManagerOpen(true);
  }, [originalColumnOrder, columns]);

  const handleColumnDialogClose = useCallback(() => {
    setPendingColumns([...columns]);
    setColumnManagerOpen(false);
  }, [columns]);

  const applyColumnChanges = useCallback(() => {
    setColumns([...pendingColumns]);
    setColumnManagerOpen(false);
  }, [pendingColumns]);

  const cancelColumnChanges = useCallback(() => {
    setPendingColumns([...columns]);
    setColumnManagerOpen(false);
  }, [columns]);

  const visibleColumns = useMemo(() => {
    const visible = columns.filter((col) => col.visible);
    return visible.sort((a, b) => {
      if (a.pinned === "left" && b.pinned !== "left") return -1;
      if (a.pinned !== "left" && b.pinned === "left") return 1;
      return 0;
    });
  }, [columns]);

  const activeFilters = useMemo(
    () => Object.keys(filters).filter((key) => filters[key]?.length),
    [filters]
  );

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


  const handleDelete = useCallback((item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      if (DeleteFunc) {
        await DeleteFunc(selectedItem?.[mainKey]);

        setData((prevData) =>
          prevData.filter((item) => item?.[mainKey] !== selectedItem?.[mainKey])
        );

        toast.success("MainKey deleted successfully!");
      } else {
        setData((prevData) =>
          prevData.filter((item) => item?.[mainKey] !== selectedItem?.[mainKey])
        );
        toast.success("MainKey deleted successfully!");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete MainKey. Please try again.");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  }, [selectedItem, DeleteFunc]);

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
                      <Box
                        sx={{
                          color: colors.text.secondary,
                          mt: 0.25,
                          minWidth: 20,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      ></Box>

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



   {/* edit icon is here  */}
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
                    {/* delete icon is here  */}
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

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }, 5000);

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
      {!hideToolbar && (
        <Toolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          view={view}
          setView={setView}
          colors={colors}
          isSmallScreen={isSmallScreen}
          // Export dependencies
          columns={columns}
          filteredData={filteredData}
          getNestedValue={getNestedValue}
          formatLabel={formatLabel}
          userData={userData}
          tableName={tableName}
          recordKey={recordKey}
          recordLabel={recordLabel}
          // Search dependencies
          updateURL={updateURL}
          setCurrentPage={setCurrentPage}
          // Filter dependencies
          loadedBackendConfig={loadedBackendConfig}
          convertToFilterBuilderFormat={convertToFilterBuilderFormat}
          setPendingFilters={setPendingFilters}
          setPendingFilterBuilderFilters={setPendingFilterBuilderFilters}
          setLockedFilters={setLockedFilters}
          setShowFilters={setShowFilters}
          handleFilterDialogOpen={handleFilterDialogOpen}
          // Print dependencies
          data={data}
        />
      )}

      {/* Active Filters Bar */}
      <ActiveFiltersBar configss={configss} />

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
            {filterModule || tableName ? (
              <Box
                sx={{
                  "& .MuiPaper-root": {
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    padding: 0,
                  },
                }}
              >
                <FilterBuilder
                  key={`filter-builder-${tableName || filterModule || "default"}`} // Unique key per table
                  module={filterModule || tableName}
                  onFiltersChange={handleFilterBuilderChange}
                  onApplyFilters={handleApplyFilterBuilderFilters}
                  onClearFilters={clearAllFilters}
                  showApplyButton={true}
                  showClearButton={true}
                  initialFilters={pendingFilterBuilderFilters}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 2,
                  mb: 2,
                  pt: 2,
                }}
              >
                {visibleColumns
                  .filter((col) => col.filterable !== false)
                  .map((col) => {
                    const isLocked = lockedFilters[col.key];

                    return (
                      <TextField
                        key={col.key}
                        label={formatLabel(col.label)}
                        variant="outlined"
                        size="small"
                        value={pendingFilters[col.key] || ""}
                        onChange={(e) => {
                          if (!isLocked) {
                            handlePendingFilterChange(col.key, e.target.value);
                          }
                        }}
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
                          readOnly: isLocked, // prevents typing
                        }}
                        disabled={isLocked} // visually disables input
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: isLocked
                              ? theme.palette.mode === "dark"
                                ? colors.grey[800]
                                : colors.grey[200]
                              : colors.surface,
                          },
                          "& .MuiInputLabel-root.Mui-disabled": {
                            color: colors.text.secondary,
                          },
                        }}
                      />
                    );
                  })}
              </Box>
            )}
            {!filterModule && !tableName && (
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
            )}
          </DialogContent>
        </Dialog>
      )}

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
              pb: 0,
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
                <Box
                  key={col.key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    borderRadius: 1,
                    backgroundColor: colors.grey[50],
                  }}
                >
                  <FormControlLabel
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
                    sx={{ flex: 1, m: 0 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => togglePendingColumnPinned(col.key)}
                    title={
                      col.pinned === "left" ? "Unpin column" : "Pin column"
                    }
                    sx={{
                      color:
                        col.pinned === "left"
                          ? colors.primary
                          : colors.text.secondary,
                      "&:hover": {
                        backgroundColor: colors.grey[200],
                      },
                    }}
                  >
                    <PushPinIcon
                      fontSize="small"
                      sx={{
                        transform:
                          col.pinned === "left"
                            ? "rotate(-20deg)"
                            : "rotate(45deg)",
                        transition: "transform 0.2s ease-in-out",
                      }}
                    />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-start",
                flexWrap: "wrap",
                position: "sticky",
                background: "white",
                bottom: 0,
                p: 2,
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

      {isSmallScreen ? (
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
                {/* ---------- TABLE HEADER ---------- */}
                <TableHead>
                  <TableRow sx={{ backgroundColor: colors.grey[100] }}>
                    {/* ✅ Header Checkbox (Select All) */}
                    <TableCell
                      sx={{
                        p: 1,
                        width: 50,
                        textAlign: "center",
                        backgroundColor: colors.grey[100],
                      }}
                    >
                    </TableCell>

                    {/* ---------- HEADER COLUMNS ---------- */}
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
                          backgroundColor: colors.grey[100],
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
                            "&:hover": {
                              cursor:
                                col.pinned === "left" ? "default" : "grab",
                            },
                            "&:active": {
                              cursor:
                                col.pinned === "left" ? "default" : "grabbing",
                            },
                            "&:hover .sort-icon": { opacity: 1 },
                          }}
                          draggable={col.pinned !== "left"}
                          onDragStart={(e) => {
                            if (col.pinned === "left") {
                              e.preventDefault();
                              return;
                            }
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
                                color: "black",
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
                                opacity:
                                  sortConfig[0].key === col.key ? 0.6 : 0,
                                transition: "opacity 0.2s ease-in-out",
                                color: colors.primary,
                                "&:hover": { opacity: 0.8 },
                              }}
                            >
                              {sortConfig[0].key === col.key
                                ? sortConfig[0].direction === "asc"
                                  ? "↑"
                                  : "↓"
                                : "⇅"}
                            </Box>
                          )}
                        </Box>
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
                      />
                    )}
                  </TableRow>
                </TableHead>

                {/* ---------- TABLE BODY ---------- */}
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length + 2}
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
                        colSpan={visibleColumns.length + 2}
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
                    paginatedData?.map((row, rowIndex) => {
                      const isSelected = selectedRows.includes(row[mainKey]);
                      return (
                        <TableRow
                          key={row?.[mainKey] || rowIndex}
                          hover
                          selected={isSelected}
                          // onClick={() => handleSelectRow(row[mainKey])} // ✅ click anywhere to select
                          sx={{
                            cursor: "pointer",
                            backgroundColor: isSelected
                              ? theme.palette.action.selected
                              : "inherit",
                            // Pinned column has subtle background, matches row only on hover/selection
                            "& .pinned-column": {
                              backgroundColor: `${colors.background} !important`,
                            },
                            "&:hover .pinned-column": {
                              backgroundColor: `${theme.palette.action.hover} !important`,
                            },
                            "&.Mui-selected .pinned-column": {
                              backgroundColor: `${theme.palette.action.selected} !important`,
                            },
                            "&.Mui-selected:hover .pinned-column": {
                              backgroundColor: `${theme.palette.action.hover} !important`,
                            },
                          }}
                        >
                          {/* ✅ Data cells */}
                          {visibleColumns.map((col) => (
                            <TableCell
                              key={col.key}
                              className={col.pinned === "left" ? "pinned-column" : ""}
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
                                    ? colors.background
                                    : "inherit",
                                transition: "background-color 0.2s ease",
                                zIndex: col.pinned === "left" ? 1 : undefined,
                              }}
                            >
                              {col.key?.toLowerCase() === linkType ||
                              col.label?.toLowerCase() === linkType ? (
                                <Box
                                  component="span"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onclickRow(row);
                                  }}
                                  sx={{
                                    cursor: "pointer",
                                    color:
                                      theme.palette.mode === "dark"
                                        ? "skyblue"
                                        : "#4d75f5ff",
                                    textDecoration: "none",
                                  }}
                                  title={title}
                                >
                                  {String(getNestedValue(row, col.key))}
                                </Box>
                              ) : (
                                String(getNestedValue(row, col.key))
                              )}
                            </TableCell>
                          ))}

                          {/* ✅ Actions */}
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



                                {/* edit icon is here  */}
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(row);
                                    }}
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
                                {/* delete icon is here  */}
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(row);
                                    }}
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
                              </Box>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
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
              {paginatedData?.map((mainkey, index) => {
                const cardData = CardColoumn?.map((item) => {
                  const label = item?.key
                    ?.split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                  return {
                    ...item,
                    value: mainkey?.[item?.key] ?? "-",
                    label,
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
                    <Box>
                      {cardData.map((item, i) => (
                        <Box key={i} mb={1}>
                          {item.type === "photo" ? (
                            <Box
                              component="img"
                              src={getImageUrl(item.value)}
                              alt="MainKey"
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
                              onClick={() => handleShowData(mainkey)}
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



                          {/* edit icon is here  */}
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(mainkey)}
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
                          {/* delete icon is here  */}
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(mainkey)}
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
                        </>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
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
                {/* ---------- TABLE HEADER ---------- */}
                <TableHead>
                  <TableRow sx={{ backgroundColor: colors.grey[100] }}>
                    {/* ✅ Header Checkbox (Select All) */}

                    <TableCell
                      sx={{
                        p: 1,
                        width: 50,
                        textAlign: "center",
                        backgroundColor: colors.grey[100],
                      }}
                      onMouseEnter={() => setShowRowCheckboxes(true)}
                      onMouseLeave={() => setShowRowCheckboxes(false)}
                    >
                      <Checkbox
                        checked={
                          paginatedData.length > 0 &&
                          selectedRows.length === paginatedData.length
                        }
                        indeterminate={
                          selectedRows.length > 0 &&
                          selectedRows.length < paginatedData.length
                        }
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectAll(e);
                        }}
                        sx={{
                          opacity:
                            showRowCheckboxes || selectedRows.length > 0
                              ? 1
                              : 0,
                          transition: "opacity 0.25s ease",
                        }}
                      />
                    </TableCell>

                    {/* ---------- HEADER COLUMNS ---------- */}
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
                          backgroundColor: colors.grey[100],
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
                            "&:hover": {
                              cursor:
                                col.pinned === "left" ? "default" : "grab",
                            },
                            "&:active": {
                              cursor:
                                col.pinned === "left" ? "default" : "grabbing",
                            },
                            "&:hover .sort-icon": { opacity: 1 },
                          }}
                          draggable={col.pinned !== "left"}
                          onDragStart={(e) => {
                            if (col.pinned === "left") {
                              e.preventDefault();
                              return;
                            }
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
                                color: "black",
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
                                opacity:
                                  sortConfig[0].key === col.key ? 0.6 : 0,
                                transition: "opacity 0.2s ease-in-out",
                                color: colors.primary,
                                "&:hover": { opacity: 0.8 },
                              }}
                            >
                              {sortConfig[0].key === col.key
                                ? sortConfig[0].direction === "asc"
                                  ? "↑"
                                  : "↓"
                                : "⇅"}
                            </Box>
                          )}
                        </Box>
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
                      />
                    )}
                  </TableRow>
                </TableHead>

                {/* ---------- TABLE BODY ---------- */}
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length + 2}
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
                        colSpan={visibleColumns.length + 2}
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
                    paginatedData?.map((row, rowIndex) => {
                      const isSelected = selectedRows.includes(row[mainKey]);
                      return (
                        <TableRow
                          key={row?.[mainKey] || rowIndex}
                          hover
                          selected={isSelected}
                          onClick={() => handleSelectRow(row[mainKey])} // ✅ click anywhere to select
                          sx={{
                            cursor: "pointer",
                            backgroundColor: isSelected
                              ? theme.palette.action.selected
                              : "inherit",
                            // Pinned column has subtle background, matches row only on hover/selection
                            "& .pinned-column": {
                              backgroundColor: `${colors.background} !important`,
                            },
                            "&:hover .pinned-column": {
                              backgroundColor: `${theme.palette.action.hover} !important`,
                            },
                            "&.Mui-selected .pinned-column": {
                              backgroundColor: `${theme.palette.action.selected} !important`,
                            },
                            "&.Mui-selected:hover .pinned-column": {
                              backgroundColor: `${theme.palette.action.hover} !important`,
                            },
                          }}
                        >
                          <TableCell sx={{ p: 1, textAlign: "center" }}>
                            <Checkbox
                              checked={isSelected}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => handleSelectRow(row[mainKey])}
                              sx={{
                                opacity:
                                  showRowCheckboxes || isSelected ? 1 : 0,
                                transition: "opacity 0.25s ease",
                              }}
                            />
                          </TableCell>

                          {/* ✅ Data cells */}
                          {visibleColumns.map((col) => (
                            <TableCell
                              key={col.key}
                              className={col.pinned === "left" ? "pinned-column" : ""}
                              sx={{
                                p: 2,
                                fontSize: "14px",
                                color: colors.text.primary,
                                position:
                                  col.pinned === "left" ? "sticky" : "relative",
                                left: col.pinned === "left" ? 0 : "auto",
                                backgroundColor:
                                  col.pinned === "left"
                                    ? colors.background
                                    : "inherit",
                                transition: "background-color 0.2s ease",
                                zIndex: col.pinned === "left" ? 1 : undefined,
                                borderBottom: `1px solid ${colors.grey[200]}`,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: col.width || 150,
                              }}
                            >
                              {col.key?.toLowerCase() === linkType ||
                              col.label?.toLowerCase() === linkType ? (
                                <Box
                                  component="span"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onclickRow(row);
                                  }}
                                  sx={{
                                    cursor: "pointer",
                                    color:
                                      theme.palette.mode === "dark"
                                        ? "skyblue"
                                        : "#4d75f5ff",
                                    textDecoration: "none",
                                  }}
                                  title={title}
                                >
                                  {String(getNestedValue(row, col.key))}
                                </Box>
                              ) : (
                                String(getNestedValue(row, col.key))
                              )}
                            </TableCell>
                          ))}

                          {/* ✅ Actions */}
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
                              <Eye size={20} /> {/* ← Replaced Edit with Eye */}
                            </IconButton>
                          </Tooltip>




                                {/* edit icon is here  */}
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(row);
                                    }}
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
                                {/* delete icon is here  */}
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(row);
                                    }}
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
                              </Box>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
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
              {paginatedData?.map((mainkey, index) => {
                const cardData = CardColoumn?.map((item) => {
                  const label = item?.key
                    ?.split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                  return {
                    ...item,
                    value: mainkey[item?.key],
                    label,
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
                    <Box>
                      {cardData.map((item, i) => (
                        <Box key={i} mb={1}>
                          {item.type === "photo" ? (
                            <Box
                              component="img"
                              src={getImageUrl(item.value)}
                              alt="MainKey"
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

                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "flex-start",
                      }}
                    >
                      {showActions && (
                        <>
                          {/* edit icon is here  */}
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(mainkey)}
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
                          {/* delete icon is here  */}
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(mainkey)}
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

      <TablePagination
        paginationData={paginationData}
        theme={theme}
        isSmallScreen={isSmallScreen}
        colors={colors}
        paginatedDataLength={paginatedData.length}
        totalRecords={paginationData?.total ?? data.length}
      />

      <Dialog
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
      </Dialog>

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

export default Customisetable;