"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
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
  Divider,
} from "@mui/material"
import {
  Filter,
  Download,
  Save,
  X,
  Search,
  Tally3 as Columns3,
  Mail,
  User,
  Building,
  Hash,
  Calendar,
  Globe,
  Phone,
  MapPin,
  RefreshCw,
  Printer,
} from "lucide-react"
import * as XLSX from "xlsx"
import InputAdornment from "@mui/material/InputAdornment"
import { useNavigate, useParams } from "react-router-dom"
import useAuthStore from "../../Zustand/Store/useAuthStore"
import { MAIN_URL } from "../../Configurations/Urls"



// Constants to avoid recreating objects
const DEFAULT_SORT_CONFIG = [{ key: "Employee Code", direction: "asc" }]
const DEFAULT_ROWS_PER_PAGE = 10
const DEFAULT_VISIBLE_COLUMNS = 4

const formatLabel = (label) => {
  return label.replace(/_/g, " ")
}

const CustomisetableReport = ({ Route, DeleteFunc }) => {
  const { userData } = useAuthStore()
  const org = userData?.organization
  const { id } = useParams()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const isSmallScreen = isMobile || isTablet

  const navigate = useNavigate()

  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
  const [sortConfig, setSortConfig] = useState(DEFAULT_SORT_CONFIG)
  const [filters, setFilters] = useState({})
  const [pendingFilters, setPendingFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [columnManagerOpen, setColumnManagerOpen] = useState(false)
  const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null)
  const [draggedColumnIndex, setDraggedColumnIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)
  const [currentPage, setCurrentPage] = useState(1)
  const [resizingColumnKey, setResizingColumnKey] = useState(null)
  const initialMouseX = useRef(0)
  const initialColumnWidth = useRef(0)
  const [pendingColumns, setPendingColumns] = useState([])
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState(null)

  const [apiUrl, setApiUrl] = useState(null)
  useEffect(() => {
    if (org?.organization_id) {
      setApiUrl(`${MAIN_URL}/api/organizations/${org?.organization_id}/filter-employee`)
    }
  }, [org?.organization_id])

  const [showUrlDialog, setShowUrlDialog] = useState(false)
  const [tempUrl, setTempUrl] = useState("")
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  // const [editDialogOpen, setEditDialogOpen] = useState(false)
  // const [editFormData, setEditFormData] = useState({})

  // Cache for nested values to avoid recalculating
  const valueCache = useRef(new Map())

  // Layout storage key - unique per API endpoint
  const getLayoutKey = useCallback((url) => {
    return `datagrid_layout_${btoa(url).replace(/[^a-zA-Z0-9]/g, "")}`
  }, [])

  const handleOpenEmployeeForm = () => {
    navigate("/EmployeeForm")
  }

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
        50: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[50],
        100: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
        200: theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
        300: theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[300],
        400: theme.palette.mode === "dark" ? theme.palette.grey[500] : theme.palette.grey[400],
        500: theme.palette.mode === "dark" ? theme.palette.grey[400] : theme.palette.grey[500],
        600: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[600],
        700: theme.palette.mode === "dark" ? theme.palette.grey[200] : theme.palette.grey[700],
        800: theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.grey[800],
        900: theme.palette.mode === "dark" ? theme.palette.grey[50] : theme.palette.grey[900],
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
    [theme],
  )

  // Save layout to localStorage
  const saveLayoutToStorage = useCallback(
    (layoutData) => {
      try {
        const layoutKey = getLayoutKey(apiUrl)
        const layout = {
          ...layoutData,
          timestamp: new Date().toISOString(),
          apiUrl: apiUrl,
        }
        localStorage.setItem(layoutKey, JSON.stringify(layout))
        setSnackbar({
          open: true,
          message: "Layout saved successfully",
          autoHideDuration: 5000,
          severity: "success",
        })
      } catch (error) {
        console.error("Failed to save layout:", error)
        setSnackbar({
          open: true,
          message: "Failed to save layout",
          severity: "error",
        })
      }
    },
    [apiUrl, getLayoutKey],
  )

  // Load layout from localStorage
  const loadLayoutFromStorage = useCallback(
    (url) => {
      try {
        const layoutKey = getLayoutKey(url)
        const savedLayout = localStorage.getItem(layoutKey)
        if (savedLayout) {
          return JSON.parse(savedLayout)
        }
      } catch (error) {
        console.error("Failed to load layout:", error)
      }
      return null
    },
    [getLayoutKey],
  )

  // Apply saved layout to columns
  const applyLayoutToColumns = useCallback((baseColumns, savedLayout) => {
    if (!savedLayout || !savedLayout.columns) return baseColumns

    const savedColumnsMap = new Map(savedLayout.columns.map((col) => [col.key, col]))

    // Create new columns array maintaining saved order and properties
    const orderedColumns = []
    const usedKeys = new Set()

    // First, add columns in saved order with saved properties
    savedLayout.columns.forEach((savedCol) => {
      const baseCol = baseColumns.find((col) => col.key === savedCol.key)
      if (baseCol) {
        orderedColumns.push({
          ...baseCol,
          visible: savedCol.visible,
          width: savedCol.width || baseCol.width,
        })
        usedKeys.add(savedCol.key)
      }
    })

    // Then, add any new columns that weren't in the saved layout
    baseColumns.forEach((baseCol) => {
      if (!usedKeys.has(baseCol.key)) {
        orderedColumns.push(baseCol)
      }
    })

    return orderedColumns
  }, [])

  // Auto-save layout when columns change
  // useEffect(() => {
  //   if (columns?.length > 0 && apiUrl) {
  //     const layoutData = {
  //       columns: columns.map(col => ({
  //         key: col.key,
  //         label: col.label,
  //         width: col.width,
  //         visible: col.visible
  //       })),
  //       sortConfig,
  //       rowsPerPage
  //     }

  //     // Debounce the save operation
  //     const timeoutId = setTimeout(() => {
  //       saveLayoutToStorage(layoutData)
  //     }, 1000)

  //     return () => clearTimeout(timeoutId)
  //   }
  // }, [columns, sortConfig, rowsPerPage, saveLayoutToStorage, apiUrl])

  // Memoized function for getting nested values with caching
  const getNestedValue = useCallback((obj, path) => {
    const cacheKey = `${obj?.id || JSON.stringify(obj)}_${path}`
    if (valueCache.current.has(cacheKey)) {
      return valueCache.current.get(cacheKey)
    }
    const value = path.split(".").reduce((acc, part) => acc && acc[part], obj)
    valueCache.current.set(cacheKey, value)
    return value
  }, [])

  // Function to get appropriate icon for field type
  const getFieldIcon = useCallback((key, value) => {
    const lowerKey = key.toLowerCase()

    if (lowerKey.includes("email")) return <Mail size={16} />
    if (lowerKey.includes("phone")) return <Phone size={16} />
    if (lowerKey.includes("website") || lowerKey.includes("url")) return <Globe size={16} />
    if (lowerKey.includes("address") || lowerKey.includes("city") || lowerKey.includes("street"))
      return <MapPin size={16} />
    if (lowerKey.includes("company") || lowerKey.includes("business")) return <Building size={16} />
    if (lowerKey.includes("name") || lowerKey.includes("username")) return <User size={16} />
    if (lowerKey.includes("id") || lowerKey.includes("number")) return <Hash size={16} />
    if (lowerKey.includes("date") || lowerKey.includes("time")) return <Calendar size={16} />

    // Default icon based on value type
    if (typeof value === "number") return <Hash size={16} />
    if (typeof value === "string" && value.includes("@")) return <Mail size={16} />

    return null
  }, [])

  // Function to determine if a field should be highlighted (primary fields)
  const isPrimaryField = useCallback((key) => {
    const lowerKey = key.toLowerCase()
    return lowerKey.includes("name") || lowerKey.includes("title") || lowerKey.includes("email")
  }, [])

  const loadDataFromUrl = useCallback(
    async (url) => {
      setLoading(true)
      setData([])
      setColumns([])
      setSortConfig(DEFAULT_SORT_CONFIG)
      setFilters({})
      setPendingFilters({})
      setCurrentPage(1)

      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        if (!Array.isArray(result) || result?.length === 0) {
          console.warn("API did not return an array of objects or returned empty data.")
          return
        }

        // Clear the value cache when loading new data
        valueCache.current.clear()

        // Create base columns from API data
        const baseColumns = Object.keys(result[0])
          .filter((key) => key.toLowerCase() !== "id")
          .map((key, index) => ({
            key,
            label:
              (key.toLowerCase().includes("employee") && key.toLowerCase().includes("code")) ||
              key.toLowerCase().includes("empcode") ||
              key.toLowerCase().includes("emp_code") ||
              key.toLowerCase() === "employeecode" ||
              key.toLowerCase() === "employee_code" ||
              key.toLowerCase() === "empcode"
                ? "Emp Code"
                : key.charAt(0).toUpperCase() + key?.slice(1).replace(/([A-Z])/g, " $1"),
            width: 150,
            visible: index < DEFAULT_VISIBLE_COLUMNS, // Only first 4 columns visible by default
          }))

        const filteredBaseColumns = baseColumns.filter((col) => {
          const sampleValue = getNestedValue(result[0], col.key)
          return !(typeof sampleValue === "object" && sampleValue !== null && !Array.isArray(sampleValue))
        })

        // Load saved layout and apply it
        const savedLayout = loadLayoutFromStorage(url)
        let finalColumns = filteredBaseColumns

        if (savedLayout) {
          finalColumns = applyLayoutToColumns(filteredBaseColumns, savedLayout)

          // Restore other settings
          if (savedLayout.sortConfig) {
            setSortConfig(savedLayout.sortConfig)
          }
          if (savedLayout.rowsPerPage) {
            setRowsPerPage(savedLayout.rowsPerPage)
          }

          setSnackbar({
            open: true,
            message: "Previous layout restored",
            autoHideDuration: 5000,
            severity: "info",
          })
        }

        setData(result)
        setColumns(finalColumns)
      } catch (error) {
        console.error("Failed to fetch or adapt data:", error)
        setSnackbar({
          open: true,
          message: `Failed to load data: ${error.message}`,
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    },
    [getNestedValue, loadLayoutFromStorage, applyLayoutToColumns],
  )

  useEffect(() => {
    if (apiUrl) {
      loadDataFromUrl(apiUrl)
    }
  }, [loadDataFromUrl, apiUrl])

  // Reset layout for current API
  const resetLayout = useCallback(() => {
    try {
      const layoutKey = getLayoutKey(apiUrl)
      localStorage.removeItem(layoutKey)
      loadDataFromUrl(apiUrl) // Reload with default layout
      setSnackbar({
        open: true,
        message: "Layout reset to default",
        severity: "success",
      })
    } catch (error) {
      console.error("Failed to reset layout:", error)
    }
  }, [apiUrl, getLayoutKey, loadDataFromUrl])

  // Change API URL
  const handleUrlChange = useCallback(() => {
    if (tempUrl && tempUrl !== apiUrl) {
      setApiUrl(tempUrl)
      setShowUrlDialog(false)
    }
  }, [tempUrl, apiUrl])

  // Optimized sorting with memoization
  const sortedData = useMemo(() => {
    const currentSort = sortConfig[0]
    if (!currentSort || !currentSort.key) return data
    return [...data].sort((a, b) => {
      const aVal = getNestedValue(a, currentSort.key)
      const bVal = getNestedValue(b, currentSort.key)
      if (typeof aVal === "string" && typeof bVal === "string") {
        return currentSort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      if (aVal < bVal) return currentSort.direction === "asc" ? -1 : 1
      if (aVal > bVal) return currentSort.direction === "asc" ? 1 : -1
      return 0
    })
  }, [data, sortConfig, getNestedValue])

  const filteredData = useMemo(() => {
    let result = sortedData

    // Apply search filter - searches across all columns
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((item) => {
        return (
          columns.some((col) => {
            const value = getNestedValue(item, col.key)
            if (value === null || value === undefined) return false

            // Convert to string and handle different data types
            const stringValue = String(value).toLowerCase()

            // Also search in formatted labels for better matching
            const formattedLabel = formatLabel(col.key).toLowerCase()

            return stringValue.includes(query) || formattedLabel.includes(query)
          }) ||
          Object.values(item).some((value) => {
            if (value === null || value === undefined) return false
            return String(value).toLowerCase().includes(query)
          })
        )
      })
    }

    // Apply column filters - IMPROVED to handle partial matches better
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        const filterValue = value.toLowerCase().trim()
        result = result.filter((item) => {
          const itemValue = getNestedValue(item, key)
          if (itemValue === null || itemValue === undefined) return false

          const itemString = String(itemValue).toLowerCase()

          // Split filter value by spaces to handle multi-word searches
          const filterWords = filterValue.split(/\s+/).filter((word) => word?.length > 0)

          // Check if all filter words are found in the item value
          return filterWords.every((word) => itemString.includes(word))
        })
      }
    })

    return result
  }, [sortedData, filters, searchQuery, columns])

  // Update page if needed when filtered data changes
  useEffect(() => {
    const totalPages = Math.ceil(filteredData?.length / rowsPerPage)
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [filteredData?.length, rowsPerPage, currentPage])

  const totalPages = useMemo(() => Math.ceil(filteredData?.length / rowsPerPage), [filteredData?.length, rowsPerPage])

  // Optimized pagination with memoization
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredData?.slice(startIndex, endIndex)
  }, [filteredData, currentPage, rowsPerPage])

  // Optimized handlers with useCallback
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => {
      const currentSort = prev[0]
      return [
        {
          key,
          direction: currentSort.key === key && currentSort.direction === "asc" ? "desc" : "asc",
        },
      ]
    })
    setCurrentPage(1)
  }, [])

  const handlePendingFilterChange = useCallback((key, value) => {
    setPendingFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const togglePendingColumnVisibility = useCallback((key) => {
    setPendingColumns((prev) => prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col)))
  }, [])

  const handleSelectAllPendingColumns = useCallback((event) => {
    const isChecked = event.target.checked
    setPendingColumns((prev) => prev.map((col) => ({ ...col, visible: isChecked })))
  }, [])

  const allPendingColumnsVisible = useMemo(() => pendingColumns.every((col) => col.visible), [pendingColumns])

  const handleColumnReorder = useCallback(
    (dragIndex, hoverIndex) => {
      const dragColumn = columns[dragIndex]
      const newColumns = [...columns]
      newColumns.splice(dragIndex, 1)
      newColumns.splice(hoverIndex, 0, dragColumn)
      setColumns(newColumns)
    },
    [columns],
  )

  const handleMouseDown = useCallback(
    (e, key) => {
      e.stopPropagation()
      setResizingColumnKey(key)
      initialMouseX.current = e.clientX
      const column = columns.find((col) => col.key === key)
      initialColumnWidth.current = column ? column.width : 0
    },
    [columns],
  )

  useEffect(() => {
    if (!resizingColumnKey) return
    const handleMouseMove = (e) => {
      if (resizingColumnKey) {
        const deltaX = e.clientX - initialMouseX.current
        setColumns((prevColumns) =>
          prevColumns.map((col) =>
            col.key === resizingColumnKey ? { ...col, width: Math.max(50, initialColumnWidth.current + deltaX) } : col,
          ),
        )
      }
    }

    const handleMouseUp = () => {
      setResizingColumnKey(null)
      document.body.style.cursor = "default"
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.body.style.cursor = "col-resize"

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "default"
    }
  }, [resizingColumnKey])

  // Export functions
  const exportToCSV = useCallback(() => {
    const visibleColumns = columns.filter((col) => col.visible)
    const headers = visibleColumns.map((col) => col.formatLabel).join(",")
    const rows = filteredData
      .map((row) =>
        visibleColumns.map((col) => `"${String(getNestedValue(row, col.key)).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n")
    const csvContent = headers + "\n" + rows
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data_export.csv"
    a.click()
    URL.revokeObjectURL(url)
    setExportMenuAnchorEl(null)
  }, [columns, filteredData, getNestedValue])

  const exportToHTML = useCallback(() => {
    const visibleColumns = columns.filter((col) => col.visible)
    const headers = visibleColumns
      .map(
        (col) =>
          `<th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; font-weight: bold;">${formatLabel(col.label)}</th>`,
      )
      .join("")
    const rows = filteredData
      .map(
        (row) =>
          "<tr>" +
          visibleColumns
            .map(
              (col) =>
                `<td style="border: 1px solid #ddd; padding: 12px;">${String(getNestedValue(row, col.key))}</td>`,
            )
            .join("") +
          "</tr>",
      )
      .join("")
    const organizationName = userData?.organization?.organization_name || "Organization Report"
    const htmlContent = `<!DOCTYPE html><html><head> <title>${organizationName}</title> <style> body { font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif; margin: 20px; } h2 { color: #333333; margin-bottom: 5px; } .subtitle { color: #666666; margin-bottom: 20px; font-size: 14px; } table { border-collapse: collapse; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); } </style></head><body> <h2>${organizationName}</h2> <div class="subtitle">Employees</div> <table> <thead><tr>${headers}</tr></thead> <tbody>${rows}</tbody> </table></body></html>`
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data_export.html"
    a.click()
    URL.revokeObjectURL(url)
    setExportMenuAnchorEl(null)
  }, [columns, filteredData, getNestedValue, formatLabel, userData])

  const exportToPDF = useCallback(async () => {
    try {
      const jsPDFModule = await import("jspdf")
      const jsPDF = jsPDFModule.default
      const doc = new jsPDF()
      const visibleColumns = columns.filter((col) => col.visible)
      if (visibleColumns?.length === 0) {
        alert("No visible columns to export. Please manage columns and ensure at least one is visible.")
        setExportMenuAnchorEl(null)
        return
      }
      if (filteredData?.length === 0) {
        alert("No data to export after applying filters.")
        setExportMenuAnchorEl(null)
        return
      }

      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 14
      const usableWidth = pageWidth - 2 * margin
      const cellPadding = 2
      const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor
      const minCellHeight = 8
      let currentY = 40

      const keyColumnWidth = (() => {
        let maxWidth = 0
        visibleColumns.forEach((col) => {
          maxWidth = Math.max(maxWidth, doc.getTextWidth(col.label))
        })
        return Math.min(maxWidth + cellPadding * 2, usableWidth * 0.3)
      })()

      const valueColumnWidth = usableWidth - keyColumnWidth

      doc.setFontSize(18)
      doc.setFont(undefined, "bold")
      const organizationName = userData?.organization?.organization_name || "Organization Report"
      doc.text(organizationName, margin, 20)

      doc.setFontSize(14)
      doc.setFont(undefined, "normal")
      doc.text("Employees", margin, 30)

      doc.setFontSize(10)
      doc.setFont(undefined, "normal")
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, currentY)
      doc.text(`Total Records: ${filteredData?.length}`, pageWidth - margin - 50, currentY)
      currentY += 15

      filteredData.forEach((dataRow, recordIndex) => {
        const recordTitleHeight = 14
        const spacingBeforeTitle = 15
        const spacingAfterTitle = 10
        const spacingAfterTable = 15

        let recordBlockContentHeight = 0
        visibleColumns.forEach((col) => {
          const value = String(getNestedValue(dataRow, col.key) || "")
          const valueLines = doc.splitTextToSize(value, valueColumnWidth - cellPadding * 2)
          const rowHeight = Math.max(minCellHeight, valueLines?.length * lineHeight + cellPadding * 2)
          recordBlockContentHeight += rowHeight
        })

        const totalRecordBlockHeight =
          spacingBeforeTitle + recordTitleHeight + spacingAfterTitle + recordBlockContentHeight + spacingAfterTable

        if (recordIndex > 0 && currentY + totalRecordBlockHeight > pageHeight - margin) {
          doc.addPage()
          currentY = margin
        } else if (recordIndex === 0 && currentY + totalRecordBlockHeight > pageHeight - margin && currentY > margin) {
          doc.addPage()
          currentY = margin
        }

        if (currentY > margin) {
          currentY += spacingBeforeTitle
        }

        doc.setFontSize(14)
        doc.setFont(undefined, "bold")
        const recordTitle = `Record ${recordIndex + 1}`
        doc.text(recordTitle, margin, currentY)
        currentY += recordTitleHeight + spacingAfterTitle

        doc.setDrawColor(0)
        doc.setFontSize(10)
        doc.setFont(undefined, "normal")

        visibleColumns.forEach((col) => {
          const value = String(getNestedValue(dataRow, col.key) || "")
          const valueLines = doc.splitTextToSize(value, valueColumnWidth - cellPadding * 2)
          const rowHeight = Math.max(minCellHeight, valueLines?.length * lineHeight + cellPadding * 2)

          doc.rect(margin, currentY, keyColumnWidth, rowHeight, "S")
          const labelLines = doc.splitTextToSize(formatLabel(col.label), keyColumnWidth - cellPadding * 2)
          const totalLabelTextHeight = labelLines?.length * lineHeight
          const labelYOffset = (rowHeight - totalLabelTextHeight) / 2
          labelLines.forEach((line, lineIndex) => {
            doc.text(line, margin + cellPadding, currentY + labelYOffset + lineHeight * lineIndex, {
              baseline: "top",
              align: "left",
            })
          })

          doc.rect(margin + keyColumnWidth, currentY, valueColumnWidth, rowHeight, "S")
          const totalValueTextHeight = valueLines?.length * lineHeight
          const valueYOffset = (rowHeight - totalValueTextHeight) / 2
          valueLines.forEach((line, lineIndex) => {
            doc.text(line, margin + keyColumnWidth + cellPadding, currentY + valueYOffset + lineHeight * lineIndex, {
              baseline: "top",
              align: "left",
            })
          })

          currentY += rowHeight
        })

        currentY += spacingAfterTable
      })

      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 30, pageHeight - 10)
        doc.text(`${filteredData?.length} records exported`, margin, pageHeight - 10)
      }

      const fileName = `data_export_${new Date().toISOString().split("T")[0]}.pdf`
      doc.save(fileName)
      setExportMenuAnchorEl(null)
    } catch (error) {
      console.error("PDF export failed:", error)
      alert("PDF export failed. Please try again.")
    }
  }, [columns, filteredData, getNestedValue, formatLabel, userData])

  const exportToExcel = useCallback(() => {
    const visibleColumns = columns.filter((col) => col.visible)
    const dataForExcel = filteredData.map((row) => {
      const newRow = {}
      visibleColumns.forEach((col) => {
        newRow[col.label] = getNestedValue(row, col.key)
      })
      return newRow
    })

    const ws = XLSX.utils.json_to_sheet(dataForExcel)
    const columnWidths = visibleColumns.map((col) => {
      const headerText = col.label || ""
      const maxDataLength = filteredData.reduce((max, row) => {
        const cellValue = String(getNestedValue(row, col.key) || "")
        return Math.max(max, cellValue?.length)
      }, 0)
      return { wch: Math.max(headerText?.length, maxDataLength) + 2 }
    })

    ws["!cols"] = columnWidths
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Data")
    const excelBuffer = XLSX.write(wb, { bookType: "xls", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/vnd.ms-excel" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data_export.xls"
    a.click()
    URL.revokeObjectURL(url)
    setExportMenuAnchorEl(null)
  }, [columns, filteredData, getNestedValue])

  const saveLayout = useCallback(() => {
    const layoutData = {
      columns: columns.map((col) => ({
        key: col.key,
        label: col.label,
        width: col.width,
        visible: col.visible,
      })),
      sortConfig,
      filters,
      rowsPerPage,
      timestamp: new Date().toISOString(),
      apiUrl: apiUrl,
    }

    // Save to localStorage
    saveLayoutToStorage(layoutData)
  }, [columns, filters, rowsPerPage, sortConfig, apiUrl, saveLayoutToStorage])

  const applyFilters = useCallback(() => {
    setFilters(pendingFilters)
    setCurrentPage(1)
    setShowFilters(false)
  }, [pendingFilters])

  const clearAllFilters = useCallback(() => {
    setFilters({})
    setPendingFilters({})
    setCurrentPage(1)
  }, [])

  const handleFilterDialogOpen = useCallback(() => {
    setPendingFilters(filters)
    setShowFilters(true)
  }, [filters])

  const handleFilterDialogClose = useCallback(() => {
    setPendingFilters(filters)
    setShowFilters(false)
  }, [filters])

  const handleRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage)
      }
    },
    [totalPages],
  )

  const handleColumnDialogOpen = useCallback(() => {
    setPendingColumns([...columns])
    setColumnManagerOpen(true)
  }, [columns])

  const handleColumnDialogClose = useCallback(() => {
    setPendingColumns([...columns])
    setColumnManagerOpen(false)
  }, [columns])

  const applyColumnChanges = useCallback(() => {
    setColumns([...pendingColumns])
    setColumnManagerOpen(false)
  }, [pendingColumns])

  const cancelColumnChanges = useCallback(() => {
    setPendingColumns([...columns])
    setColumnManagerOpen(false)
  }, [columns])

  const handleUrlDialogOpen = useCallback(() => {
    setTempUrl(apiUrl)
    setShowUrlDialog(true)
  }, [apiUrl])

  // Memoized derived values
  const visibleColumns = useMemo(() => columns.filter((col) => col.visible), [columns])
  const activeFilters = useMemo(() => Object.keys(filters).filter((key) => filters[key])?.length, [filters])

  // const handleEdit = useCallback(
  //   (item) => {
  //     console.log("item", item)
  //     navigate(`${Route}/edit/${item.id}`)
  //   },
  //   [navigate, Route],
  // )

  // const handleDelete = useCallback((item) => {
  //   setSelectedItem(item)
  //   setDeleteDialogOpen(true)
  // }, [])

  // const handleDeleteConfirm = useCallback(async () => {
  //   try {
  //     if (DeleteFunc) {
  //       await DeleteFunc(selectedItem.id)
  //       setData((prevData) => prevData.filter((item) => item.id !== selectedItem.id))
  //       toast.success("Employee deleted successfully!")
  //     } else {
  //       setData((prevData) => prevData.filter((item) => item.id !== selectedItem.id))
  //       toast.success("Employee deleted successfully!")
  //     }
  //   } catch (error) {
  //     console.error("Delete Error:", error)
  //     toast.error("Failed to delete Employee. Please try again.")
  //   } finally {
  //     setDeleteDialogOpen(false)
  //     setSelectedItem(null)
  //   }
  // }, [selectedItem, DeleteFunc])

  // const handleEdit = useCallback(
  //   (item) => {
  //     // Navigate to edit form using the same pattern as employee-list and layout-1
  //     console.log("item", item)
  //     navigate(`${Route}/edit/${item.id}`)
  //   },
  //   [navigate, Route],
  // )

  // const handleDelete = useCallback((item) => {
  //   setSelectedItem(item)
  //   setDeleteDialogOpen(true)
  // }, [])

  // const handleDeleteConfirm = useCallback(async () => {
  //   try {
  //     if (DeleteFunc) {
  //       // Call the provided delete function with proper error handling like submit button
  //       await DeleteFunc(selectedItem.id)

  //       // Remove item from local data array on successful deletion
  //       setData((prevData) => prevData.filter((item) => item.id !== selectedItem.id))

  //       // Show success toast like submit button
  //       toast.success("Employee deleted successfully!")
  //     } else {
  //       // Fallback for when no DeleteFunc is provided
  //       setData((prevData) => prevData.filter((item) => item.id !== selectedItem.id))
  //       toast.success("Employee deleted successfully!")
  //     }
  //   } catch (error) {
  //     console.error("Delete Error:", error)
  //     // Show error toast like submit button error handling
  //     toast.error("Failed to delete Employee. Please try again.")
  //   } finally {
  //     setDeleteDialogOpen(false)
  //     setSelectedItem(null)
  //   }
  // }, [selectedItem, DeleteFunc])

  // const handleEditSave = useCallback(() => {
  //   // Update the data array with edited values
  //   setData((prevData) => prevData.map((item) => (item === selectedItem ? { ...item, ...editFormData } : item)))
  //   setEditDialogOpen(false)
  //   setSelectedItem(null)
  //   setEditFormData({})
  //   setSnackbar({
  //     open: true,
  //     message: "Item updated successfully",
  //     severity: "success",
  //     autoHideDuration: 5000,
  //   })
  // }, [selectedItem, setData, setSnackbar, editFormData, setEditFormData, setEditDialogOpen])

  // const handleEditFormChange = useCallback((key, value) => {
  //   setEditFormData((prev) => ({ ...prev, [key]: value }))
  // }, [])

  // Dynamic card component for mobile/tablet view
  const DynamicUserCard = ({ item, index }) => {
    const visibleCols = visibleColumns
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
            {/* Primary fields (name, title, email) - highlighted */}
            {visibleCols
              .filter((col) => isPrimaryField(col.key))
              ?.slice(0, 2) // Show max 2 primary fields prominently
              .map((col, idx) => {
                const value = getNestedValue(item, col.key)
                const icon = getFieldIcon(col.key, value)

                return (
                  <Box key={col.key}>
                    <Typography
                      variant={idx === 0 ? "h6" : "subtitle1"}
                      sx={{
                        fontWeight: idx === 0 ? 600 : 500,
                        color: colors.text.primary,
                        fontSize: idx === 0 ? "1.1rem" : "1rem",
                        mb: 0.5,
                      }}
                    >
                      {String(value || "N/A")}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.secondary,
                        fontSize: "0.75rem",
                        textTransform: "capitalize",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {col.label}
                    </Typography>
                  </Box>
                )
              })}

            {/* Divider if we have primary fields */}
            {visibleCols.some((col) => isPrimaryField(col.key)) && <Divider sx={{ my: 1 }} />}

            {/* All other fields */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {visibleCols
                .filter((col) => !isPrimaryField(col.key))
                .map((col) => {
                  const value = getNestedValue(item, col.key)
                  const icon = getFieldIcon(col.key, value)
                  const displayValue = String(value || "N/A")

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
                      >
                        {icon}
                      </Box>

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
                          {displayValue?.length > 100 ? `${displayValue.substring(0, 100)}...` : displayValue}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
            </Box>

            {/* <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 1 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(item)}
                    sx={{
                      color: theme.palette.mode === "dark" ? "#fff" : "#333",
                      "&:hover": {
                        backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "#33333315",
                      },
                    }}
                  >
                    <Edit size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(item)}
                    sx={{
                      color: theme.palette.mode === "dark" ? "#fff" : "#333",
                      "&:hover": {
                        backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "#33333315",
                      },
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box> */}

            {/* Action buttons and record number */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 1 }}>
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
          </Box>
        </CardContent>
      </Card>
    )
  }

  const handlePrint = useCallback(() => {
    // Create print styles
    const printStyles = document.createElement("style")
    printStyles.id = "table-print-styles"
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
    `
    document.head.appendChild(printStyles)

    // Get current date
    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })

    // Get table data - assuming rows are available in component state/props
    const tableData = data || []
    const totalRecords = tableData?.length

    // Create custom print content
    const printContent = document.createElement("div")
    printContent.className = "custom-print-container"

    // Create header
    const header = document.createElement("div")
    header.className = "print-header"
    const organizationName = userData?.organization?.organization_name || "Organization"
    header.innerHTML = `
      <div class="print-title">${organizationName}</div>
      <div class="print-subtitle">Employees</div>
      <div class="print-meta">
        <span>Generated on: ${currentDate}</span>
        <span>Total Records: ${totalRecords}</span>
      </div>
    `
    printContent.appendChild(header)

    // Create records sections
    tableData.forEach((row, index) => {
      const recordSection = document.createElement("div")
      recordSection.className = "record-section"

      const recordTitle = document.createElement("div")
      recordTitle.className = "record-title"
      recordTitle.textContent = `Record ${index + 1}`
      recordSection.appendChild(recordTitle)

      const recordTable = document.createElement("table")
      recordTable.className = "record-table"

      // Create table rows for each field
      Object.entries(row).forEach(([key, value]) => {
        // Skip internal MUI DataGrid fields
        if (key.startsWith("_") || key === "id") return

        const tableRow = document.createElement("tr")
        const fieldNameCell = document.createElement("td")
        fieldNameCell.className = "field-name"
        fieldNameCell.textContent = key.charAt(0).toUpperCase() + key?.slice(1).replace(/([A-Z])/g, " $1")

        const fieldValueCell = document.createElement("td")
        fieldValueCell.className = "field-value"
        fieldValueCell.textContent = value || ""

        tableRow.appendChild(fieldNameCell)
        tableRow.appendChild(fieldValueCell)
        recordTable.appendChild(tableRow)
      })

      recordSection.appendChild(recordTable)
      printContent.appendChild(recordSection)
    })

    // Add footer
    const footer = document.createElement("div")
    footer.className = "print-footer"
    footer.innerHTML = `${totalRecords} records exported<span style="float: right;">Page 1 of 2</span>`
    printContent.appendChild(footer)

    // Add to document body
    document.body.appendChild(printContent)

    // Trigger print
    window.print()

    // Clean up after print
    setTimeout(() => {
      document.body.removeChild(printContent)
      const printStylesElement = document.getElementById("table-print-styles")
      if (printStylesElement) {
        printStylesElement.remove()
      }
    }, 1000)
  }, [data, userData])

  // Memoized toolbar buttons to prevent re-renders
  const ToolbarButtons = useMemo(
    () => (
      <>
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
    ),
    [
      colors,
      activeFilters,
      handleFilterDialogOpen,
      handleColumnDialogOpen,
      saveLayout,
      resetLayout,
      theme.palette.text.primary,
      theme.palette.action.hover,
      handlePrint,
      data,
      userData,
    ],
  )

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }))
      }, 5000) // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [snackbar.open])

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
      <Paper
        elevation={1}
        sx={{
          mb: 3,
          p: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.surface,
        }}
      >
        <TextField
          size="small"
          placeholder="Search across all columns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            minWidth: isSmallScreen ? "200px" : "300px",
            maxWidth: isSmallScreen ? "250px" : "400px",
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.background.paper,
              "& fieldset": {
                borderColor: theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.text.secondary,
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.primary,
              },
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
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>{ToolbarButtons}</Box>
      </Paper>

      {/* API URL Dialog */}
      {/* {showUrlDialog && (
        <Dialog open={showUrlDialog} onClose={() => setShowUrlDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ backgroundColor: colors.info, color: "white" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" component="span" sx={{ fontWeight: 500 }}>
                Change API URL
              </Typography>
              <IconButton title="Close" onClick={() => setShowUrlDialog(false)} sx={{ color: "white" }}>
                <X size={20} />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 4, backgroundColor: colors.surface }}>
            <TextField
              fullWidth
              label="API URL"
              variant="outlined"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="Enter API URL (e.g., https://jsonplaceholder.typicode.com/users)"
              sx={{ mb: 3 }}
            />
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
              Popular test APIs:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
              {[
                'https://jsonplaceholder.typicode.com/users',
                'https://jsonplaceholder.typicode.com/posts',
                'https://jsonplaceholder.typicode.com/photos',
                'https://jsonplaceholder.typicode.com/albums',
                'https://jsonplaceholder.typicode.com/todos'
              ].map((url) => (
                <Button
                  key={url}
                  variant="text"
                  size="small"
                  onClick={() => setTempUrl(url)}
                  sx={{ 
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    color: colors.info,
                    '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.04)' }
                  }}
                >
                  {url}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => setShowUrlDialog(false)}
                sx={{
                  color: colors.text.secondary,
                  borderColor: colors.text.secondary,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUrlChange}
                sx={{
                  backgroundColor: colors.info,
                  color: "white",
                  "&:hover": { backgroundColor: "#1976d2" },
                }}
              >
                Load Data
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )} */}

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
        <Dialog open={showFilters} onClose={handleFilterDialogClose} maxWidth="md" fullWidth>
          <DialogTitle
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : colors.grey[300],
              color: colors.text.primary,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" component="span" sx={{ fontWeight: 500 }}>
                Filters
              </Typography>
              <IconButton title="Close" onClick={handleFilterDialogClose} sx={{ color: colors.text.primary }}>
                <X size={20} />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent
            sx={{
              p: 4,
              backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : colors.surface,
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
              {visibleColumns.map((col) => (
                <TextField
                  key={col.key}
                  label={col.label}
                  variant="outlined"
                  size="small"
                  value={pendingFilters[col.key] || ""}
                  onChange={(e) => handlePendingFilterChange(col.key, e.target.value)}
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
                      theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark,
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
        <Dialog open={columnManagerOpen} onClose={handleColumnDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ backgroundColor: colors.grey[300], color: colors.text.primary }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" component="span" sx={{ fontWeight: 500 }}>
                Manage Columns
              </Typography>
              <IconButton title="Close" onClick={handleColumnDialogClose} sx={{ color: colors.text.primary }}>
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
                <Typography variant="body1" sx={{ fontWeight: 500, color: colors.text.primary }}>
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
                      sx={{ color: colors.success }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: colors.text.primary }}>
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
                      theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark,
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
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
              <CircularProgress size={24} sx={{ color: colors.primary }} />
              <Typography variant="body2" sx={{ mt: 1, ml: 2, color: colors.text.secondary }}>
                Loading data...
              </Typography>
            </Box>
          ) : paginatedData?.length === 0 ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: "center", backgroundColor: colors.surface }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                No records found.
              </Typography>
            </Paper>
          ) : (
            <Box>
              {paginatedData.map((item, index) => (
                <DynamicUserCard key={item.id || index} item={item} index={index} />
              ))}
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
                {filteredData?.length} records
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
                        theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark,
                    },
                  }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 500, px: 1 }}>
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
                        theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark,
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
        <Paper elevation={1} sx={{ overflow: "hidden", backgroundColor: colors.surface }}>
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
                        position: "relative",
                        userSelect: "none",
                        textTransform: "capitalize",
                        letterSpacing: "0.08333em",
                        cursor: resizingColumnKey === col.key ? "col-resize" : "default",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        const dropIndex = index
                        const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"), 10)
                        if (dragIndex !== dropIndex) {
                          handleColumnReorder(dragIndex, dropIndex)
                        }
                        setDraggedColumnIndex(null)
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
                            cursor: "grab",
                          },
                          "&:active": {
                            cursor: "grabbing",
                          },
                          "&:hover .sort-icon": {
                            opacity: 1,
                          },
                        }}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", index.toString())
                          setDraggedColumnIndex(index)
                        }}
                        onDragEnd={() => setDraggedColumnIndex(null)}
                        onClick={() => handleSort(col.key)}
                      >
                        {formatLabel(col.label)}
                        <Box
                          className="sort-icon"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "14px",
                            opacity: sortConfig[0].key === col.key ? 0 : 0,
                            transition: "opacity 0.2s ease-in-out",
                            color: colors.primary,
                            "&:hover": {
                              opacity: 1,
                            },
                          }}
                        >
                          {sortConfig[0].key === col.key ? (
                            sortConfig[0].direction === "asc" ? (
                              <span>🡡</span>
                            ) : (
                              <span>🡣</span>
                            )
                          ) : (
                            <span style={{ opacity: 0.5 }}>🡡</span>
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: "16px",
                          cursor: "col-resize",
                          backgroundColor: resizingColumnKey === col.key ? colors.primary : "transparent",
                          opacity: resizingColumnKey === col.key ? 0.5 : 0.2,
                          "&:hover": {
                            opacity: 1,
                            backgroundColor: colors.primary,
                          },
                          transition: "opacity 0.2s ease-in-out, background-color 0.2s ease-in-out",
                          zIndex: 2,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, col.key)}
                      />
                    </TableCell>
                  ))}
                  {/* <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: colors.grey[100],
                      position: "sticky",
                      right: 0,
                      zIndex: 2,
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  ></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns?.length + 1} sx={{ textAlign: "center", py: 3 }}>
                      <CircularProgress size={24} sx={{ color: colors.primary }} />
                      <Typography variant="body2" sx={{ mt: 1, ml: 2, color: colors.text.secondary }}>
                        Loading data...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedData?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns?.length + 1} sx={{ textAlign: "center", py: 3 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        No records found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, rowIndex) => (
                    <TableRow key={row.id || rowIndex}>
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
                          {String(getNestedValue(row, col.key))}
                        </TableCell>
                      ))}
                      {/* <TableCell
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
                        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(row)}
                              sx={{
                                color: theme.palette.mode === "dark" ? "#fff" : "#333",
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "#33333315",
                                },
                              }}
                            >
                              <Edit size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(row)}
                              sx={{
                                color: theme.palette.mode === "dark" ? "#fff" : "#333",
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "#33333315",
                                },
                              }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
            Showing {filteredData?.length} of {data?.length} records
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
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={1000}>1000</MenuItem>
              <MenuItem value={10000}>10000</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              title="Previous page"
              sx={{
                backgroundColor: colors.primary,
                color: "white",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark,
                },
              }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 500 }}>
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              variant="contained"
              title="Next page"
              sx={{
                backgroundColor: colors.primary,
                color: "white",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark,
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

      {/* Edit Dialog */}
      {/* <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.primary, color: "white" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" component="span" sx={{ fontWeight: 500 }}>
              Edit Item
            </Typography>
            <IconButton onClick={() => setEditDialogOpen(false)} sx={{ color: "white" }}>
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 2,
              pt: 2,
            }}
          >
            {visibleColumns.map((col) => (
              <TextField
                key={col.key}
                label={col.label}
                variant="outlined"
                fullWidth
                size="medium"
                value={editFormData[col.key] || ""}
                onChange={(e) => handleEditFormChange(col.key, e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: colors.surface,
                  },
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            backgroundColor: colors.surface,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setEditDialogOpen(false)}
            sx={{
              color: colors.text.secondary,
              borderColor: colors.text.secondary,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
            sx={{
              backgroundColor: colors.primary,
              color: "white",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark,
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.error, color: "white" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" component="span" sx={{ fontWeight: 500 }}>
              Confirm Delete
            </Typography>
            <IconButton onClick={() => setDeleteDialogOpen(false)} sx={{ color: "white" }}>
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
            Are you sure you want to permanently delete this item? This action cannot be undone.
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
                backgroundColor: theme.palette.mode === "dark" ? theme.palette.error.light : theme.palette.error.dark,
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
  )
}

export default CustomisetableReport
