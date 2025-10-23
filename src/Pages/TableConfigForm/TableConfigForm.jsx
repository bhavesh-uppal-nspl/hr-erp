// // "use client"
// // import { useEffect, useMemo, useState, useCallback, useRef } from "react"
// // import {
// //   Box,
// //   Paper,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   TextField,
// //   Checkbox,
// //   FormControlLabel,
// //   Typography,
// //   Tooltip,
// //   IconButton,
// //   Stack,
// //   Chip,
// //   Button,
// //   Alert,
// // } from "@mui/material"
// // import PushPinIcon from "@mui/icons-material/PushPin"
// // import VisibilityIcon from "@mui/icons-material/Visibility"
// // import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
// // import useAuthStore from "../../Zustand/Store/useAuthStore"
// // import { MAIN_URL } from "../../Configurations/Urls"
// // import TableDataGeneric from "../../Configurations/TableDataGeneric"

// // /**
// //  * Generates dynamic fallback defaults based on actual column fields from API,
// //  * excluding "id" from mandatory columns.
// //  */
// // const generateDynamicDefaults = (columnFields) => {
// //   if (!columnFields || columnFields?.length === 0) {
// //     return {
// //       mandatoryColumns: [],
// //       defaultVisibleColumns: [],
// //       pinnedColumns: [],
// //     }
// //   }

// //   // Exclude "id" from mandatory columns
// //   const filteredFields = columnFields.filter((f) => f !== "id")

// //   return {
// //     mandatoryColumns: filteredFields?.slice(0, 2),
// //     defaultVisibleColumns: columnFields?.slice(0, Math.min(4, columnFields?.length)),
// //     pinnedColumns: filteredFields?.slice(0, 2),
// //   }
// // }

// // const TableConfigForm = ({
// //   apiFieldsConfig,
// //   datagridKeyProp,
// //   tablename,
// //   tableheading,
// //  }) => {
// //   const { userData } = useAuthStore()
// //   const org = userData?.organization

// //   // ============================================================================
// //   // STATE MANAGEMENT
// //   // ============================================================================

// //   const [tableConfig, setTableConfig] = useState({
// //     mandatoryColumns: [],
// //     defaultVisibleColumns: [],
// //     pinnedColumns: [],
// //   })

// //   const [columns, setColumns] = useState([])
// //   const [initialColumns, setInitialColumns] = useState([])
// //   const [rows, setRows] = useState([])
// //   const [loadingRows, setLoadingRows] = useState(false)
// //   const [availableFields, setAvailableFields] = useState([])
// //   const [serverError, setServerError] = useState(null)
// //   const [showPreview, setShowPreview] = useState(false)
// //   const [sortModel, setSortModel] = useState(null)
// //   const [filterModel, setFilterModel] = useState({})
// //   const [saveStatus, setSaveStatus] = useState(null)
// //   const [existingConfigId, setExistingConfigId] = useState(null)

// //   const [schemaDiff, setSchemaDiff] = useState({
// //     missingMandatory: [],
// //     missingVisible: [],
// //     missingPinned: [],
// //   })

// //   const inputRefs = useRef({})
// //   const checkboxRefs = useRef({})
// //   const focusTracker = useRef({})

// //   // Track if initial data has been loaded
// //   const initialDataLoaded = useRef(false)

// //   // ============================================================================
// //   // COMPUTED VALUES
// //   // ============================================================================

// //   const resolvedDefaults = useMemo(() => {
// //     const dynamicDefaults = generateDynamicDefaults(availableFields)

// //     return {
// //       mandatoryColumns:[],
// //       defaultVisibleColumns:[],
// //       pinnedColumns:[],
// //     }
// //   }, [tableConfig, availableFields])

// //   const mandatorySet = useMemo(() => new Set(resolvedDefaults.mandatoryColumns), [resolvedDefaults])

// //   const liveTableConfig = useMemo(() => {
// //     if (!columns || !Array.isArray(columns)) return null
// //     return {
// //       mandatoryColumns: columns.filter((col) => col.required && col.field !== "id").map((col) => col.field),
// //       defaultVisibleColumns: columns.filter((col) => col.visible).map((col) => col.field),
// //       pinnedColumns: columns.filter((col) => col.pinned === "left").map((col) => col.field),
// //       sort: sortModel,
// //       filters: filterModel,
// //       pagination: { rowsPerPage: 10 },
// //       search: { enabled: true, placeholder: "Search...", fields: [] },
// //     }
// //   }, [columns, sortModel, filterModel])

// //   const { allVisible, someVisible, allFilterable, someFilterable, allSortable, someSortable } = useMemo(
// //     () => ({
// //       allVisible: columns?.length > 0 && columns.every((c) => c.visible),
// //       someVisible: columns.some((c) => c.visible),
// //       allFilterable: columns?.length > 0 && columns.every((c) => c.filterable),
// //       someFilterable: columns.some((c) => c.filterable),
// //       allSortable: columns?.length > 0 && columns.every((c) => c.sortable),
// //       someSortable: columns.some((c) => c.sortable),
// //     }),
// //     [columns],
// //   )

// //   const pinnedSummary = useMemo(() => ({ left: columns.filter((c) => c.pinned === "left")?.length }), [columns])

// //   const tableKey = useMemo(
// //     () =>
// //       `table-${columns?.length}-${JSON.stringify(
// //         columns.map((c) => ({ f: c.field, v: c.visible, w: c.width, p: c.pinned, l: c.label })),
// //       )}`,
// //     [columns],
// //   )

// //   // ============================================================================
// //   // FOCUS PRESERVATION UTILITY
// //   // ============================================================================

// //   const preserveFocusAndPosition = useCallback((field, elementType, callback) => {
// //     const elementKey = `${field}-${elementType}`
// //     const inputRef = inputRefs.current[elementKey]
// //     const checkboxRef = checkboxRefs.current[elementKey]

// //     let cursorPosition = null
// //     let wasFocused = false
// //     let wasActiveElement = false
// //     let selectionStart = null
// //     let selectionEnd = null

// //     if (inputRef && document.activeElement === inputRef) {
// //       cursorPosition = inputRef.selectionStart ??null
// //       selectionStart = inputRef.selectionStart ??null
// //       selectionEnd = inputRef.selectionEnd ??null
// //       wasFocused = true
// //       wasActiveElement = true
// //       focusTracker.current[elementKey] = {
// //         cursorPosition,
// //         selectionStart,
// //         selectionEnd,
// //         wasFocused,
// //         type: "input",
// //       }
// //     }

// //     if (checkboxRef && document.activeElement === checkboxRef) {
// //       wasFocused = true
// //       wasActiveElement = true
// //       focusTracker.current[elementKey] = { wasFocused, type: "checkbox" }
// //     }

// //     callback()

// //     if (wasActiveElement) {
// //       setTimeout(() => {
// //         const trackedData = focusTracker.current[elementKey]
// //         if (trackedData?.type === "input" && inputRef && trackedData.wasFocused) {
// //           inputRef.focus()
// //           if (trackedData.cursorPosition !== null && trackedData.cursorPosition !== undefined) {
// //             inputRef.setSelectionRange(
// //               trackedData.selectionStart ??trackedData.cursorPosition,
// //               trackedData.selectionEnd ??trackedData.cursorPosition,
// //             )
// //           }
// //         }
// //         if (trackedData?.type === "checkbox" && checkboxRef && trackedData.wasFocused) {
// //           checkboxRef.focus()
// //         }
// //         delete focusTracker.current[elementKey]
// //       }, 0)
// //     }
// //   }, [])

// //   // ============================================================================
// //   // COLUMN UPDATE HANDLERS
// //   // ============================================================================

// //   const updateByField = useCallback(
// //     (field, property, value, elementType = "checkbox") => {
// //       preserveFocusAndPosition(field, elementType, () => {
// //         setColumns((prev) => {
// //           const idx = prev.findIndex((c) => c.field === field)
// //           if (idx === -1) return prev
// //           const col = prev[idx]

// //           if (property === "visible" && mandatorySet.has(col.field) && value === false) return prev
// //           if (property === "pinned" && mandatorySet.has(col.field) && value === "none") return prev
// //           if (property === "required" && mandatorySet.has(col.field) && value === false) return prev

// //           const updated = [...prev]
// //           updated[idx] = { ...col, [property]: value }
// //           return updated
// //         })
// //       })
// //     },
// //     [mandatorySet, preserveFocusAndPosition],
// //   )

// //   const handleWidthChange = useCallback(
// //     (field, value) => {
// //       const numericValue = Number.parseInt(value, 10) || 40
// //       preserveFocusAndPosition(field, "width", () => {
// //         updateByField(field, "width", numericValue, "width")
// //       })
// //     },
// //     [updateByField, preserveFocusAndPosition],
// //   )

// //   const handleLabelChange = useCallback(
// //     (field, value) => {
// //       preserveFocusAndPosition(field, "label", () => {
// //         updateByField(field, "label", value, "label")
// //       })
// //     },
// //     [updateByField, preserveFocusAndPosition],
// //   )

// //   const handleVisibilityChange = useCallback(
// //     (field, checked) => {
// //       updateByField(field, "visible", checked, "visible")
// //     },
// //     [updateByField],
// //   )

// //   const handleFilterableChange = useCallback(
// //     (field, checked) => {
// //       updateByField(field, "filterable", checked, "filterable")
// //     },
// //     [updateByField],
// //   )

// //   const handleSortableChange = useCallback(
// //     (field, checked) => {
// //       updateByField(field, "sortable", checked, "sortable")
// //     },
// //     [updateByField],
// //   )

// //   const handlePinnedChange = useCallback(
// //     (field, checked) => {
// //       updateByField(field, "pinned", checked ? "left" : "none", "pinned")
// //     },
// //     [updateByField],
// //   )

// //   const toggleRequired = useCallback(
// //     (field) => {
// //       preserveFocusAndPosition(field, "required-chip", () => {
// //         setColumns((prev) => {
// //           const idx = prev.findIndex((c) => c.field === field)
// //           if (idx === -1 || mandatorySet.has(prev[idx].field)) return prev
// //           const updated = [...prev]
// //           updated[idx] = { ...updated[idx], required: !updated[idx].required }
// //           return updated
// //         })
// //       })
// //     },
// //     [mandatorySet, preserveFocusAndPosition],
// //   )

// //   const setAll = useCallback(
// //     (property, value) => {
// //       const currentActiveElement = document.activeElement
// //       preserveFocusAndPosition("bulk", String(property), () => {
// //         setColumns((prev) =>
// //           prev.map((col) => {
// //             if (property === "visible") {
// //               if (mandatorySet.has(col.field)) return { ...col, visible: true }
// //               return { ...col, visible: !!value }
// //             }
// //             if (property === "pinned") {
// //               if (mandatorySet.has(col.field)) return { ...col, pinned: "left" }
// //               return { ...col, pinned: value }
// //             }
// //             if (property === "required") {
// //               if (mandatorySet.has(col.field)) return { ...col, required: true }
// //               return { ...col, required: !!value }
// //             }
// //             return { ...col, [property]: value }
// //           }),
// //         )
// //       })
// //       setTimeout(() => {
// //         const bulkElement = document.querySelector(`[data-testid="bulk-${property}"]`)
// //         if (bulkElement && currentActiveElement === bulkElement) bulkElement.focus()
// //       }, 0)
// //     },
// //     [mandatorySet, preserveFocusAndPosition],
// //   )

// //   // ============================================================================
// //   // BIDIRECTIONAL SYNC FROM PREVIEW GRID
// //   // ============================================================================

// //   const handleTableConfigChange = useCallback((updatedConfig) => {
// //     if (!updatedConfig || !Array.isArray(updatedConfig)) return
// //     setColumns((prevColumns) => {
// //       const newColumns = [...prevColumns]
// //       updatedConfig.forEach((update) => {
// //         const index = newColumns.findIndex((col) => col.field === update.field)
// //         if (index !== -1) {
// //           newColumns[index] = {
// //             ...newColumns[index],
// //             ...update,
// //             pinned:
// //               update.pinned === true || update.pinned === "left"
// //                 ? "left"
// //                 : update.pinned === "none"
// //                 ? "none"
// //                 : newColumns[index].pinned,
// //           }
// //         }
// //       })
// //       return newColumns
// //     })
// //   }, [])

// //   const handleColumnWidthChange = useCallback(
// //     (field, newWidth) => {
// //       const roundedWidth = Math.max(40, Math.round(newWidth))
// //       updateByField(field, "width", roundedWidth, "width")
// //     },
// //     [updateByField],
// //   )

// //   const handleColumnVisibilityChange = useCallback(
// //     (field, visible) => {
// //       updateByField(field, "visible", visible, "visible")
// //     },
// //     [updateByField],
// //   )

// //   // ============================================================================
// //   // FORM ACTIONS
// //   // ============================================================================

// //   const handleCancel = useCallback(() => {
// //     setColumns([...initialColumns])
// //   }, [initialColumns])

// //   const handleSubmit = async () => {
// //     if (!org?.organization_id) {
// //       setSaveStatus("Organization not found.")
// //       return
// //     }

// //     const currentMandatory = columns.filter((c) => c.required && c.field !== "id").map((c) => c.field)
// //     const currentVisible = columns.filter((c) => c.visible).map((c) => c.field)
// //     const currentPinned = columns.filter((c) => c.pinned === "left").map((c) => c.field)

// //     const dynamicDefaults = generateDynamicDefaults(availableFields)

// //     const configurationData = {
// //       organization_id: org.organization_id,
// //       columns: columns.map((c) => ({
// //         field: c.field,
// //         label: c.label || c.field.replace(/_/g, " "),
// //         width: Number(c.width) || 150,
// //         visible: !!c.visible,
// //         filterable: !!c.filterable,
// //         sortable: !!c.sortable,
// //         pinned: c.pinned === "left" ? "left" : "none",
// //         required: !!c.required,
// //       })),
// //       defaults: {
// //         mandatoryColumns: currentMandatory?.length > 0 ? currentMandatory : dynamicDefaults.mandatoryColumns,
// //         defaultVisibleColumns: currentVisible?.length > 0 ? currentVisible : dynamicDefaults.defaultVisibleColumns,
// //         pinnedColumns: currentPinned?.length > 0 ? currentPinned : dynamicDefaults.pinnedColumns,
// //       },
// //       grid: {
// //         sort: sortModel || null,
// //         filters: filterModel || {},
// //         pagination: { rowsPerPage: 10 },
// //         search: { enabled: true, placeholder: "Search...", fields: [] },
// //       },
// //       meta: schemaDiff,
// //     }

// //     const datagridKey = datagridKeyProp || `employee_grid_${org.organization_id}`
// //     const payload = {
// //       datagrid_key: datagridKey,
// //       datagrid_default_configuration: configurationData,
// //     }

// //     try {
// //       setSaveStatus(null)

// //       const isUpdate = existingConfigId !== null
// //       const url = isUpdate
// //         ?  `${MAIN_URL}/api/general-datagrids/${existingConfigId}`
// //         :    `${MAIN_URL}/api/general-datagrids`
// //       const method = isUpdate ? "PUT" : "POST"

// //       const res = await fetch(url, {
// //         method: method,
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       })

// //       if (!res.ok) {
// //         const errorText = await res.text()
// //         let errorDetail = `HTTP ${res.status}`
// //         try {
// //           const errorJson = JSON.parse(errorText)
// //           if (errorJson.errors) {
// //             errorDetail = Object.values(errorJson.errors).flat().join(", ")
// //           } else {
// //             errorDetail = errorJson.detail || errorJson.message || errorJson.error || errorDetail
// //           }
// //         } catch {
// //           errorDetail = errorText || errorDetail
// //         }
// //         throw new Error(errorDetail)
// //       }

// //       const result = await res.json()

// //       if (!isUpdate && result.datagrid?.general_datagrid_default_configuration_id) {
// //         setExistingConfigId(result.datagrid.general_datagrid_default_configuration_id)
// //       }

// //       setInitialColumns([...columns])
// //       setSaveStatus(`Configuration ${isUpdate ? "updated" : "created"} successfully.`)
// //     } catch (e) {
// //       setSaveStatus(`Error saving configuration: ${e.message}`)
// //     }
// //   }

// //   // ============================================================================
// //   // CONSOLIDATED DATA FETCHING - SINGLE API CALL
// //   // ============================================================================

// //   useEffect(() => {
// //     const loadInitialData = async () => {
// //       if (!org?.organization_id || initialDataLoaded.current) return

// //       try {
// //         // Load saved configuration
// //         const configRes = await fetch(apiFieldsConfig , {
// //           method: "GET",
// //           headers: { "Content-Type": "application/json" },
// //         })

// //         let savedConfig = null
// //         if (configRes.ok) {
// //           const configResponse = await configRes.json()
// //           const datagrids = configResponse.datagrids || []
// //           const orgKey = `employee_grid_${org.organization_id}`
// //           savedConfig = datagrids.find((dg) => dg.datagrid_key === orgKey)

// //           if (savedConfig) {
// //             setExistingConfigId(savedConfig.general_datagrid_default_configuration_id)
// //             const serverCfg = savedConfig.datagrid_default_configuration
// //             const nextDefaults = {
// //               mandatoryColumns: serverCfg?.defaults?.mandatoryColumns ??[],
// //               defaultVisibleColumns: serverCfg?.defaults?.defaultVisibleColumns ??[],
// //               pinnedColumns: serverCfg?.defaults?.pinnedColumns ??[],
// //             }
// //             setTableConfig(nextDefaults)
// //           }
// //         }

// //         // Use apiFieldsConfig prop if provided, otherwise fetch from API
// //         let fieldNames = []
// //         let fieldsData = null

// //         if (apiFieldsConfig && Array.isArray(apiFieldsConfig)) {
// //           // Use prop data
// //           fieldNames = apiFieldsConfig.map((f) => f.field || f).filter(Boolean)
// //           fieldsData = apiFieldsConfig
// //         } else {
// //           // Fetch from API - SINGLE CALL
// //           const url = apiFieldsConfig
// //           const res = await fetch(url)

// //           if (!res.ok) throw new Error(`HTTP ${res.status}`)

// //           const data = await res.json()

// //           // Extract field names from columns metadata if available
// //           if (Array.isArray(data?.columns) && data.columns?.length > 0) {
// //             fieldNames = data.columns.map((c) => c?.field ??c?.accessorKey ??c?.key).filter(Boolean)
// //             fieldsData = data.columns
// //           }
// //           // Fallback to deriving from first row
// //           if (fieldNames?.length === 0) {
// //             const rowsArr = Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : []
// //             const firstObjectRow = rowsArr.find((r) => r && typeof r === "object" && !Array.isArray(r))
// //             if (firstObjectRow) {
// //               fieldNames = Object.keys(firstObjectRow)
// //             }
// //           }
// //         }

// //         const uniqueFields = Array.from(new Set(fieldNames))
// //         setAvailableFields(uniqueFields)

// //         // Calculate defaults
// //         const dynamicDefaults = generateDynamicDefaults(uniqueFields)
// //         const existing = new Set(uniqueFields)

// //         const resolvedMandatory = (tableConfig.mandatoryColumns?.length > 0
// //           ? tableConfig.mandatoryColumns
// //           : dynamicDefaults.mandatoryColumns
// //         ).filter((f) => f !== "id" && existing.has(f))

// //         const resolvedDefaultVisible = (tableConfig.defaultVisibleColumns?.length > 0
// //           ? tableConfig.defaultVisibleColumns
// //           : dynamicDefaults.defaultVisibleColumns
// //         ).filter((f) => existing.has(f))

// //         const resolvedPinned = (tableConfig.pinnedColumns?.length > 0
// //           ? tableConfig.pinnedColumns
// //           : dynamicDefaults.pinnedColumns
// //         ).filter((f) => existing.has(f))

// //         // Calculate schema diff
// //         const missingMandatory = (tableConfig.mandatoryColumns || []).filter((f) => !existing.has(f))
// //         const missingVisible = (tableConfig.defaultVisibleColumns || []).filter((f) => !existing.has(f))
// //         const missingPinned = (tableConfig.pinnedColumns || []).filter((f) => !existing.has(f))
// //         setSchemaDiff({ missingMandatory, missingVisible, missingPinned })

// //         const mandatoryLookup = new Set(resolvedMandatory)

// //         // Check if we have saved column config
// //         const hasSavedColumns = savedConfig?.datagrid_default_configuration?.columns?.length > 0

// //         if (hasSavedColumns) {
// //           // Use saved configuration
// //           const normalized = savedConfig.datagrid_default_configuration.columns
// //             .filter((c) => !!c?.field)
// //             .map((c) => ({
// //               field: c.field,
// //               label: c.label ??c.field.replace(/_/g, " "),
// //               width: c.width ??150,
// //               visible: c.visible ??true,
// //               filterable: c.filterable ??true,
// //               sortable: c.sortable ??true,
// //               pinned: c.pinned === true || c.pinned === "left" ? "left" : "none",
// //               required: c.required ??false,
// //             }))
// //           setColumns(normalized)
// //           setInitialColumns([...normalized])
// //         } else {
// //           // Build columns from field data
// //           const mapped = uniqueFields.map((field) => {
// //             // Try to get label from fieldsData if available
// //             let label = field.replace(/_/g, " ")
// //             if (fieldsData && Array.isArray(fieldsData)) {
// //               const fieldData = fieldsData.find((f) => (f.field || f) === field)
// //               if (fieldData?.label) {
// //                 label = fieldData.label
// //               }
// //             }

// //             return {
// //               field,
// //               label,
// //               width: 150,
// //               visible: resolvedDefaultVisible.includes(field),
// //               filterable: true,
// //               sortable: true,
// //               pinned: resolvedPinned.includes(field) ? "left" : "none",
// //               required: mandatoryLookup.has(field),
// //             }
// //           })

// //           setColumns(mapped)
// //           setInitialColumns([...mapped])
// //         }

// //         initialDataLoaded.current = true
// //       } catch (error) {
// //         console.error("Error loading initial data:", error)
// //         setColumns([])
// //         setInitialColumns([])
// //         setAvailableFields([])
// //       }
// //     }

// //     loadInitialData()
// //   }, [org?.organization_id])

// //   // Separate effect for loading rows only when preview is shown
// //   useEffect(() => {
// //     const fetchRows = async () => {
// //       if (!org?.organization_id || !showPreview) return

// //       try {
// //         setLoadingRows(true)
// //         setServerError(null)
// //         const params = new URLSearchParams()

// //         if (sortModel?.field && sortModel?.direction) {
// //           params.set("sortField", sortModel.field)
// //           params.set("sortOrder", sortModel.direction)
// //         }

// //         if (filterModel && typeof filterModel === "object") {
// //           Object.entries(filterModel).forEach(([f, v]) => {
// //             if (v !== undefined && v !== null && v !== "") params.append(`filter[${f}]`, String(v))
// //           })
// //         }

// //         const url = apiFieldsConfig
// //         const res = await fetch(url)
// //         if (!res.ok) throw new Error(`HTTP ${res.status}`)
// //         const data = await res.json()
// //         const nextRows = Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : []
// //         setRows(nextRows)
// //       } catch (e) {
// //         setServerError(e?.message || "Failed to load rows")
// //         setRows([])
// //       } finally {
// //         setLoadingRows(false)
// //       }
// //     }

// //     fetchRows()
// //   }, [org?.organization_id, showPreview, sortModel, filterModel])

// //   // ============================================================================
// //   // RENDER
// //   // ============================================================================

// //   return (
// //     <Box sx={{ p: 2 }}>
// //       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
// //         <Typography variant="h5">Data-Grid Configuration Form</Typography>
// //         <Stack direction="row" spacing={1} alignItems="center">
// //           <Chip size="small" icon={<PushPinIcon />} label={`Left: ${pinnedSummary.left}`} />
// //         </Stack>
// //       </Stack>

// //       {(schemaDiff.missingMandatory?.length > 0 ||
// //         schemaDiff.missingVisible?.length > 0 ||
// //         schemaDiff.missingPinned?.length > 0) && (
// //         <Alert severity="warning" sx={{ mb: 1 }}>
// //           Some default settings reference fields not present in the current API response:
// //           {schemaDiff.missingMandatory?.length > 0 && (
// //             <span> Missing mandatory: {schemaDiff.missingMandatory.join(", ")}.</span>
// //           )}
// //           {schemaDiff.missingVisible?.length > 0 && (
// //             <span> Missing visible: {schemaDiff.missingVisible.join(", ")}.</span>
// //           )}
// //           {schemaDiff.missingPinned?.length > 0 && (
// //             <span> Missing pinned: {schemaDiff.missingPinned.join(", ")}.</span>
// //           )}
// //         </Alert>
// //       )}

// //       <TableContainer component={Paper}>
// //         <Table sx={{ minWidth: 500, "& .MuiTableCell-root": { padding: "8px 6px" } }}>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>
// //                 <Typography variant="subtitle1" fontWeight="semibold">
// //                   Field Name
// //                 </Typography>
// //               </TableCell>
// //               <TableCell>
// //                 <Typography variant="subtitle1" fontWeight="semibold">
// //                   Label
// //                 </Typography>
// //               </TableCell>
// //               <TableCell>
// //                 <Typography variant="subtitle1" fontWeight="semibold">
// //                   Width
// //                 </Typography>
// //               </TableCell>
// //               <TableCell align="center">
// //                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
// //                   <Typography variant="subtitle1" fontWeight="semibold">
// //                     Visible
// //                   </Typography>
// //                   <FormControlLabel
// //                     control={
// //                       <Checkbox
// //                         checked={allVisible}
// //                         indeterminate={someVisible && !allVisible}
// //                         onChange={(e) => setAll("visible", e.target.checked)}
// //                         data-testid="bulk-visible"
// //                         inputRef={(el) => {
// //                           if (el) checkboxRefs.current["bulk-visible"] = el
// //                         }}
// //                       />
// //                     }
// //                     label=""
// //                   />
// //                 </Box>
// //               </TableCell>
// //               <TableCell align="center">
// //                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
// //                   <Typography variant="subtitle1" fontWeight="semibold">
// //                     Filterable
// //                   </Typography>
// //                   <FormControlLabel
// //                     control={
// //                       <Checkbox
// //                         checked={allFilterable}
// //                         indeterminate={someFilterable && !allFilterable}
// //                         onChange={(e) => setAll("filterable", e.target.checked)}
// //                         data-testid="bulk-filterable"
// //                         inputRef={(el) => {
// //                           if (el) checkboxRefs.current["bulk-filterable"] = el
// //                         }}
// //                       />
// //                     }
// //                     label=""
// //                   />
// //                 </Box>
// //               </TableCell>
// //               <TableCell align="center">
// //                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
// //                   <Typography variant="subtitle1" fontWeight="semibold">
// //                     Sortable
// //                   </Typography>
// //                   <FormControlLabel
// //                     control={
// //                       <Checkbox
// //                         checked={allSortable}
// //                         indeterminate={someSortable && !allSortable}
// //                         onChange={(e) => setAll("sortable", e.target.checked)}
// //                         data-testid="bulk-sortable"
// //                         inputRef={(el) => {
// //                           if (el) checkboxRefs.current["bulk-sortable"] = el
// //                         }}
// //                       />
// //                     }
// //                     label=""
// //                   />
// //                 </Box>
// //               </TableCell>
// //               <TableCell align="center">
// //                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
// //                   <Typography variant="subtitle1" fontWeight="semibold">
// //                     Pinned
// //                   </Typography>
// //                   <Tooltip title="Pin all left">
// //                     <IconButton size="small" onClick={() => setAll("pinned", "left")} data-testid="bulk-pinned">
// //                       <PushPinIcon fontSize="small" />
// //                     </IconButton>
// //                   </Tooltip>
// //                 </Box>
// //               </TableCell>
// //             </TableRow>
// //           </TableHead>

// //           <TableBody>
// //             {columns?.length === 0 ? (
// //               <TableRow>
// //                 <TableCell colSpan={7}>
// //                   <Typography variant="body2" align="center" sx={{ py: 2 }}>
// //                     No columns configured
// //                   </Typography>
// //                 </TableCell>
// //               </TableRow>
// //             ) : (
// //               columns.map((column) => {
// //                 const isMandatory = mandatorySet.has(column.field)
// //                 const rowKey = `col-${column.field}`

// //                 return (
// //                   <TableRow key={rowKey} hover>
// //                     <TableCell>
// //                       <Stack direction="row" spacing={1} alignItems="center">
// //                         <Typography variant="body2">{column.field}</Typography>
// //                         <Chip
// //                           size="small"
// //                           label={column.required ? "Required" : "Optional"}
// //                           color={column.required ? "primary" : "default"}
// //                           variant={column.required ? "filled" : "outlined"}
// //                           clickable={!isMandatory}
// //                           onClick={!isMandatory ? () => toggleRequired(column.field) : undefined}
// //                           sx={{
// //                             height: 22,
// //                             borderRadius: 999,
// //                             fontSize: 12,
// //                             px: 0.5,
// //                             ...(isMandatory && { opacity: 0.9, cursor: "not-allowed" }),
// //                           }}
// //                         />
// //                       </Stack>
// //                     </TableCell>

// //                     <TableCell>
// //                       <TextField
// //                         size="small"
// //                         value={column.label}
// //                         onChange={(e) => handleLabelChange(column.field, e.target.value)}
// //                         inputRef={(el) => {
// //                           if (el) inputRefs.current[`${column.field}-label`] = el
// //                         }}
// //                         sx={{ width: 200 }}
// //                         data-testid={`label-${column.field}`}
// //                         placeholder="Enter column label..."
// //                       />
// //                     </TableCell>

// //                     <TableCell>
// //                       <TextField
// //                         type="number"
// //                         size="small"
// //                         value={column.width}
// //                         onChange={(e) => handleWidthChange(column.field, e.target.value)}
// //                         inputRef={(el) => {
// //                           if (el) inputRefs.current[`${column.field}-width`] = el
// //                         }}
// //                         sx={{ width: 100 }}
// //                         inputProps={{ min: 40 }}
// //                         data-testid={`width-${column.field}`}
// //                       />
// //                     </TableCell>

// //                     <TableCell align="center">
// //                       <FormControlLabel
// //                         control={
// //                           <Checkbox
// //                             checked={!!column.visible}
// //                             onChange={(e) => handleVisibilityChange(column.field, e.target.checked)}
// //                             disabled={isMandatory}
// //                             inputRef={(el) => {
// //                               if (el) checkboxRefs.current[`${column.field}-visible`] = el
// //                             }}
// //                             data-testid={`visible-${column.field}`}
// //                           />
// //                         }
// //                         label=""
// //                       />
// //                     </TableCell>

// //                     <TableCell align="center">
// //                       <FormControlLabel
// //                         control={
// //                           <Checkbox
// //                             checked={!!column.filterable}
// //                             onChange={(e) => handleFilterableChange(column.field, e.target.checked)}
// //                             inputRef={(el) => {
// //                               if (el) checkboxRefs.current[`${column.field}-filterable`] = el
// //                             }}
// //                             data-testid={`filterable-${column.field}`}
// //                           />
// //                         }
// //                         label=""
// //                       />
// //                     </TableCell>

// //                     <TableCell align="center">
// //                       <FormControlLabel
// //                         control={
// //                           <Checkbox
// //                             checked={!!column.sortable}
// //                             onChange={(e) => handleSortableChange(column.field, e.target.checked)}
// //                             inputRef={(el) => {
// //                               if (el) checkboxRefs.current[`${column.field}-sortable`] = el
// //                             }}
// //                             data-testid={`sortable-${column.field}`}
// //                           />
// //                         }
// //                         label=""
// //                       />
// //                     </TableCell>

// //                     <TableCell align="center">
// //                       <FormControlLabel
// //                         control={
// //                           <Checkbox
// //                             checked={column.pinned === "left"}
// //                             onChange={(e) => handlePinnedChange(column.field, e.target.checked)}
// //                             disabled={isMandatory && column.pinned !== "left"}
// //                             inputRef={(el) => {
// //                               if (el) checkboxRefs.current[`${column.field}-pinned`] = el
// //                             }}
// //                             data-testid={`pinned-${column.field}`}
// //                           />
// //                         }
// //                         label=""
// //                       />
// //                     </TableCell>
// //                   </TableRow>
// //                 )
// //               })
// //             )}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>

// //       <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //         <Stack direction="row" spacing={1} alignItems="center">
// //           <Button variant="contained" onClick={handleSubmit}>
// //             SUBMIT
// //           </Button>
// //           <Button variant="outlined" onClick={handleCancel}>
// //             CANCEL
// //           </Button>
// //         </Stack>

// //         <Button
// //           variant={showPreview ? "contained" : "outlined"}
// //           onClick={() => setShowPreview(!showPreview)}
// //           startIcon={showPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
// //           color={showPreview ? "primary" : "primary"}
// //           sx={{ minWidth: 120 }}
// //         >
// //           {showPreview ? "Hide Preview" : "Show Preview"}
// //         </Button>
// //       </Box>

// //       {saveStatus && (
// //         <Alert severity={saveStatus.startsWith("Error") ? "error" : "success"} sx={{ mt: 2 }}>
// //           {saveStatus}
// //         </Alert>
// //       )}

// //       {showPreview && (
// //         <Box sx={{ mt: 3 }}>
// //           <Typography variant="h6" sx={{ mb: 2 }}>
// //             Data-Grid Preview - Live Configuration
// //           </Typography>
// //           {serverError && (
// //             <Typography color="error" sx={{ mb: 1 }}>
// //               {serverError}
// //             </Typography>
// //           )}
// //           {loadingRows && (
// //             <Typography variant="body2" sx={{ mb: 1 }}>
// //               Loading…
// //             </Typography>
// //           )}
// //           <TableDataGeneric
// //             key={tableKey}
// //             tableName={tablename}
// //             heading={tableheading}
// //             data={rows}
// //             sortname={"name"}
// //             showActions={false}
// //             CardData={[]}
// //             hideToolbar={true}
// //             configss={columns}
// //             config={liveTableConfig}
// //             Route="/organization/employee/employee-details"
// //             token={typeof window !== "undefined" ? localStorage.getItem("token") : undefined}
// //             onSortChange={(field, direction) => setSortModel({ field, direction })}
// //             onFilterChange={(nextFilters) => setFilterModel(nextFilters)}
// //             onConfigChange={handleTableConfigChange}
// //             onColumnWidthChange={handleColumnWidthChange}
// //             onColumnVisibilityChange={handleColumnVisibilityChange}
// //           />
// //         </Box>
// //       )}
// //     </Box>
// //   )
// // }

// // export default TableConfigForm



// // "use client"
// // import { useEffect, useMemo, useState, useCallback, useRef } from "react"
// // import {
// //   Box,
// //   Paper,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   TextField,
// //   Checkbox,
// //   FormControlLabel,
// //   Typography,
// //   Tooltip,
// //   IconButton,
// //   Stack,
// //   Chip,
// //   Button,
// //   Alert,
// // } from "@mui/material"
// // import PushPinIcon from "@mui/icons-material/PushPin"
// // import VisibilityIcon from "@mui/icons-material/Visibility"
// // import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
// // import useAuthStore from "../../Zustand/Store/useAuthStore"
// // import TableDataGeneric from "../../Configurations/TableDataGeneric"
// // import { MAIN_URL } from "../../Configurations/Urls"

// // /**
// //  * Generates dynamic fallback defaults based on actual column fields from API,
// //  * excluding "id" from mandatory columns.
// //  */
// // const generateDynamicDefaults = (columnFields) => {
// //   return {
// //     mandatoryColumns: [],
// //     defaultVisibleColumns: [],
// //     pinnedColumns: [],
// //   }
// // }

// // const TableConfigForm = ({ apiFieldsConfig, datagridKeyProp, tablename, tableheading,  }) => {
// //   const { userData } = useAuthStore()
// //   const org = userData?.organization

// //   // ============================================================================
// //   // STATE MANAGEMENT
// //   // ============================================================================

// //   const [tableConfig, setTableConfig] = useState({
// //     mandatoryColumns: [],
// //     defaultVisibleColumns: [],
// //     pinnedColumns: [],
// //   })

// //   const [columns, setColumns] = useState([])
// //   const [initialColumns, setInitialColumns] = useState([])
// //   const [rows, setRows] = useState([])
// //   const [loadingRows, setLoadingRows] = useState(false)
// //   const [availableFields, setAvailableFields] = useState([])
// //   const [serverError, setServerError] = useState(null)
// //   const [showPreview, setShowPreview] = useState(false)
// //   const [sortModel, setSortModel] = useState(null)
// //   const [filterModel, setFilterModel] = useState({})
// //   const [saveStatus, setSaveStatus] = useState(null)
// //   const [existingConfigId, setExistingConfigId] = useState(null)

// //   const [schemaDiff, setSchemaDiff] = useState({
// //     missingMandatory: [],
// //     missingVisible: [],
// //     missingPinned: [],
// //   })

// //   const inputRefs = useRef({})
// //   const checkboxRefs = useRef({})
// //   const focusTracker = useRef({})

// //   // Track if initial data has been loaded
// //   const initialDataLoaded = useRef(false)

// //   // ============================================================================
// //   // COMPUTED VALUES
// //   // ============================================================================

// //   const resolvedDefaults = useMemo(() => {
// //     const dynamicDefaults = generateDynamicDefaults(availableFields)

// //     return {
// //       mandatoryColumns: [],
// //       defaultVisibleColumns: [],
// //       pinnedColumns: [],
// //     }
// //   }, [tableConfig, availableFields])

// //   const mandatorySet = useMemo(() => new Set(resolvedDefaults.mandatoryColumns), [resolvedDefaults])

// //   const liveTableConfig = useMemo(() => {
// //     if (!columns || !Array.isArray(columns)) return null
// //     return {
// //       mandatoryColumns: columns.filter((col) => col.required && col.field !== "id").map((col) => col.field),
// //       defaultVisibleColumns: columns.filter((col) => col.visible).map((col) => col.field),
// //       pinnedColumns: columns.filter((col) => col.pinned === "left").map((col) => col.field),
// //       sort: sortModel,
// //       filters: filterModel,
// //       pagination: { rowsPerPage: 10 },
// //       search: { enabled: true, placeholder: "Search...", fields: [] },
// //     }
// //   }, [columns, sortModel, filterModel])

// //   const { allVisible, someVisible, allFilterable, someFilterable, allSortable, someSortable } = useMemo(
// //     () => ({
// //       allVisible: columns?.length > 0 && columns.every((c) => c.visible),
// //       someVisible: columns.some((c) => c.visible),
// //       allFilterable: columns?.length > 0 && columns.every((c) => c.filterable),
// //       someFilterable: columns.some((c) => c.filterable),
// //       allSortable: columns?.length > 0 && columns.every((c) => c.sortable),
// //       someSortable: columns.some((c) => c.sortable),
// //     }),
// //     [columns],
// //   )

// //   const pinnedSummary = useMemo(() => ({ left: columns.filter((c) => c.pinned === "left")?.length }), [columns])

// //   const tableKey = useMemo(
// //     () =>
// //       `table-${columns?.length}-${JSON.stringify(
// //         columns.map((c) => ({ f: c.field, v: c.visible, w: c.width, p: c.pinned, l: c.label })),
// //       )}`,
// //     [columns],
// //   )

// //   // ============================================================================
// //   // FOCUS PRESERVATION UTILITY
// //   // ============================================================================

// //   const preserveFocusAndPosition = useCallback((field, elementType, callback) => {
// //     const elementKey = `${field}-${elementType}`
// //     const inputRef = inputRefs.current[elementKey]
// //     const checkboxRef = checkboxRefs.current[elementKey]

// //     let cursorPosition = null
// //     let wasFocused = false
// //     let wasActiveElement = false
// //     let selectionStart = null
// //     let selectionEnd = null

// //     if (inputRef && document.activeElement === inputRef) {
// //       cursorPosition = inputRef.selectionStart ??null
// //       selectionStart = inputRef.selectionStart ??null
// //       selectionEnd = inputRef.selectionEnd ??null
// //       wasFocused = true
// //       wasActiveElement = true
// //       focusTracker.current[elementKey] = {
// //         cursorPosition,
// //         selectionStart,
// //         selectionEnd,
// //         wasFocused,
// //         type: "input",
// //       }
// //     }

// //     if (checkboxRef && document.activeElement === checkboxRef) {
// //       wasFocused = true
// //       wasActiveElement = true
// //       focusTracker.current[elementKey] = { wasFocused, type: "checkbox" }
// //     }

// //     callback()

// //     if (wasActiveElement) {
// //       setTimeout(() => {
// //         const trackedData = focusTracker.current[elementKey]
// //         if (trackedData?.type === "input" && inputRef && trackedData.wasFocused) {
// //           inputRef.focus()
// //           if (trackedData.cursorPosition !== null && trackedData.cursorPosition !== undefined) {
// //             inputRef.setSelectionRange(
// //               trackedData.selectionStart ??trackedData.cursorPosition,
// //               trackedData.selectionEnd ??trackedData.cursorPosition,
// //             )
// //           }
// //         }
// //         if (trackedData?.type === "checkbox" && checkboxRef && trackedData.wasFocused) {
// //           checkboxRef.focus()
// //         }
// //         delete focusTracker.current[elementKey]
// //       }, 0)
// //     }
// //   }, [])

// //   // ============================================================================
// //   // COLUMN UPDATE HANDLERS
// //   // ============================================================================

// //   const updateByField = useCallback(
// //     (field, property, value, elementType = "checkbox") => {
// //       preserveFocusAndPosition(field, elementType, () => {
// //         setColumns((prev) => {
// //           const idx = prev.findIndex((c) => c.field === field)
// //           if (idx === -1) return prev
// //           const col = prev[idx]

// //           if (property === "visible" && mandatorySet.has(col.field) && value === false) return prev
// //           if (property === "pinned" && mandatorySet.has(col.field) && value === "none") return prev
// //           if (property === "required" && mandatorySet.has(col.field) && value === false) return prev

// //           // If visible is being set to false, automatically unselect other related properties
// //           if (property === "visible" && value === false) {
// //             const updated = [...prev]
// //             updated[idx] = {
// //               ...col,
// //               visible: false,
// //               filterable: false,
// //               sortable: false,
// //               pinned: "none",
// //               required: mandatorySet.has(col.field) ? true : false, // keep required true if mandatory
// //             }
// //             return updated
// //           }

// //           const updated = [...prev]
// //           updated[idx] = { ...col, [property]: value }
// //           return updated
// //         })
// //       })
// //     },
// //     [mandatorySet, preserveFocusAndPosition],
// //   )

// //   const handleWidthChange = useCallback(
// //     (field, value) => {
// //       const numericValue = Number.parseInt(value, 10) || 40
// //       preserveFocusAndPosition(field, "width", () => {
// //         updateByField(field, "width", numericValue, "width")
// //       })
// //     },
// //     [updateByField, preserveFocusAndPosition],
// //   )

// //   const handleLabelChange = useCallback(
// //     (field, value) => {
// //       preserveFocusAndPosition(field, "label", () => {
// //         updateByField(field, "label", value, "label")
// //       })
// //     },
// //     [updateByField, preserveFocusAndPosition],
// //   )

// //   const handleVisibilityChange = useCallback(
// //     (field, checked) => {
// //       updateByField(field, "visible", checked, "visible")
// //     },
// //     [updateByField],
// //   )

// //   const handleFilterableChange = useCallback(
// //     (field, checked) => {
// //       updateByField(field, "filterable", checked, "filterable")
// //     },
// //     [updateByField],
// //   )

// //   const handleSortableChange = useCallback(
// //     (field, checked) => {
// //       updateByField(field, "sortable", checked, "sortable")
// //     },
// //     [updateByField],
// //   )

// //   const handlePinnedChange = useCallback(
// //     (field, checked) => {
// //       updateByField(field, "pinned", checked ? "left" : "none", "pinned")
// //     },
// //     [updateByField],
// //   )

// //   const toggleRequired = useCallback(
// //     (field) => {
// //       preserveFocusAndPosition(field, "required-chip", () => {
// //         setColumns((prev) => {
// //           const idx = prev.findIndex((c) => c.field === field)
// //           if (idx === -1 || mandatorySet.has(prev[idx].field)) return prev
// //           const updated = [...prev]
// //           updated[idx] = { ...updated[idx], required: !updated[idx].required }
// //           return updated
// //         })
// //       })
// //     },
// //     [mandatorySet, preserveFocusAndPosition],
// //   )

// //   const setAll = useCallback(
// //     (property, value) => {
// //       const currentActiveElement = document.activeElement
// //       preserveFocusAndPosition("bulk", String(property), () => {
// //         setColumns((prev) =>
// //           prev.map((col) => {
// //             if (property === "visible") {
// //               if (mandatorySet.has(col.field)) return { ...col, visible: true }
// //               return { ...col, visible: !!value }
// //             }
// //             if (property === "pinned") {
// //               if (mandatorySet.has(col.field)) return { ...col, pinned: "left" }
// //               return { ...col, pinned: value }
// //             }
// //             if (property === "required") {
// //               if (mandatorySet.has(col.field)) return { ...col, required: true }
// //               return { ...col, required: !!value }
// //             }
// //             return { ...col, [property]: value }
// //           }),
// //         )
// //       })
// //       setTimeout(() => {
// //         const bulkElement = document.querySelector(`[data-testid="bulk-${property}"]`)
// //         if (bulkElement && currentActiveElement === bulkElement) bulkElement.focus()
// //       }, 0)
// //     },
// //     [mandatorySet, preserveFocusAndPosition],
// //   )

// //   // ============================================================================
// //   // BIDIRECTIONAL SYNC FROM PREVIEW GRID
// //   // ============================================================================

// //   const handleTableConfigChange = useCallback((updatedConfig) => {
// //     if (!updatedConfig || !Array.isArray(updatedConfig)) return
// //     setColumns((prevColumns) => {
// //       const newColumns = [...prevColumns]
// //       updatedConfig.forEach((update) => {
// //         const index = newColumns.findIndex((col) => col.field === update.field)
// //         if (index !== -1) {
// //           newColumns[index] = {
// //             ...newColumns[index],
// //             ...update,
// //             pinned:
// //               update.pinned === true || update.pinned === "left"
// //                 ? "left"
// //                 : update.pinned === "none"
// //                   ? "none"
// //                   : newColumns[index].pinned,
// //           }
// //         }
// //       })
// //       return newColumns
// //     })
// //   }, [])

// //   const handleColumnWidthChange = useCallback(
// //     (field, newWidth) => {
// //       const roundedWidth = Math.max(40, Math.round(newWidth))
// //       updateByField(field, "width", roundedWidth, "width")
// //     },
// //     [updateByField],
// //   )

// //   const handleColumnVisibilityChange = useCallback(
// //     (field, visible) => {
// //       updateByField(field, "visible", visible, "visible")
// //     },
// //     [updateByField],
// //   )

// //   // ============================================================================
// //   // FORM ACTIONS
// //   // ============================================================================

// //   const handleCancel = useCallback(() => {
// //     setColumns([...initialColumns])
// //   }, [initialColumns])

// //   const handleSubmit = async () => {
// //     if (!org?.organization_id) {
// //       setSaveStatus("Organization not found.")
// //       return
// //     }

// //     const currentMandatory = columns.filter((c) => c.required && c.field !== "id").map((c) => c.field)
// //     const currentVisible = columns.filter((c) => c.visible).map((c) => c.field)
// //     const currentPinned = columns.filter((c) => c.pinned === "left").map((c) => c.field)

// //     const dynamicDefaults = generateDynamicDefaults(availableFields)

// //     const configurationData = {
// //       organization_id: org.organization_id,
// //       columns: columns.map((c) => ({
// //         field: c.field,
// //         label: c.label || c.field.replace(/_/g, " "),
// //         width: Number(c.width) || 150,
// //         visible: !!c.visible,
// //         filterable: !!c.filterable,
// //         sortable: !!c.sortable,
// //         pinned: c.pinned === "left" ? "left" : "none",
// //         required: !!c.required,
// //       })),
// //       defaults: {
// //         mandatoryColumns: currentMandatory?.length > 0 ? currentMandatory : dynamicDefaults.mandatoryColumns,
// //         defaultVisibleColumns: currentVisible?.length > 0 ? currentVisible : dynamicDefaults.defaultVisibleColumns,
// //         pinnedColumns: currentPinned?.length > 0 ? currentPinned : dynamicDefaults.pinnedColumns,
// //       },
// //       grid: {
// //         sort: sortModel || null,
// //         filters: filterModel || {},
// //         pagination: { rowsPerPage: 10 },
// //         search: { enabled: true, placeholder: "Search...", fields: [] },
// //       },
// //       meta: schemaDiff,
// //     }

// //     const datagridKey = datagridKeyProp || `employee_grid_${org.organization_id}`
// //     const payload = {
// //       datagrid_key: datagridKey,
// //       datagrid_default_configuration: configurationData,
// //     }

// //     try {
// //       setSaveStatus(null)

// //       const isUpdate = existingConfigId !== null
// //       const url = isUpdate
// //          ?  `${MAIN_URL}/api/general-datagrids/${existingConfigId}`
// //         :    `${MAIN_URL}/api/general-datagrids`
// //       const method = isUpdate ? "PUT" : "POST"

// //       const res = await fetch(url, {
// //         method: method,
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       })

// //       if (!res.ok) {
// //         const errorText = await res.text()
// //         let errorDetail = `HTTP ${res.status}`
// //         try {
// //           const errorJson = JSON.parse(errorText)
// //           if (errorJson.errors) {
// //             errorDetail = Object.values(errorJson.errors).flat().join(", ")
// //           } else {
// //             errorDetail = errorJson.detail || errorJson.message || errorJson.error || errorDetail
// //           }
// //         } catch {
// //           errorDetail = errorText || errorDetail
// //         }
// //         throw new Error(errorDetail)
// //       }

// //       const result = await res.json()

// //       if (!isUpdate && result.datagrid?.general_datagrid_default_configuration_id) {
// //         setExistingConfigId(result.datagrid.general_datagrid_default_configuration_id)
// //       }

// //       setInitialColumns([...columns])
// //       setSaveStatus(`Configuration ${isUpdate ? "updated" : "created"} successfully.`)
// //     } catch (e) {
// //       setSaveStatus(`Error saving configuration: ${e.message}`)
// //     }
// //   }

// //   // ============================================================================
// //   // CONSOLIDATED DATA FETCHING - SINGLE API CALL
// //   // ============================================================================

// //   useEffect(() => {
// //     const loadInitialData = async () => {
// //       if (!org?.organization_id || initialDataLoaded.current) return

// //       try {
// //         // Load saved configuration
// //         const configRes = await fetch(apiFieldsConfig, {
// //           method: "GET",
// //           headers: { "Content-Type": "application/json" },
// //         })

// //         let savedConfig = null
// //         if (configRes.ok) {
// //           const configResponse = await configRes.json()
// //           const datagrids = configResponse.datagrids || []
// //           const orgKey = `employee_grid_${org.organization_id}`
// //           savedConfig = datagrids.find((dg) => dg.datagrid_key === orgKey)

// //           if (savedConfig) {
// //             setExistingConfigId(savedConfig.general_datagrid_default_configuration_id)
// //             const serverCfg = savedConfig.datagrid_default_configuration
// //             const nextDefaults = {
// //               mandatoryColumns: serverCfg?.defaults?.mandatoryColumns ??[],
// //               defaultVisibleColumns: serverCfg?.defaults?.defaultVisibleColumns ??[],
// //               pinnedColumns: serverCfg?.defaults?.pinnedColumns ??[],
// //             }
// //             setTableConfig(nextDefaults)
// //           }
// //         }

// //         // Use apiFieldsConfig prop if provided, otherwise fetch from API
// //         let fieldNames = []
// //         let fieldsData = null

// //         if (apiFieldsConfig && Array.isArray(apiFieldsConfig)) {
// //           // Use prop data
// //           fieldNames = apiFieldsConfig.map((f) => f.field || f).filter(Boolean)
// //           fieldsData = apiFieldsConfig
// //         } else {
// //           // Fetch from API - SINGLE CALL
// //           const url = apiFieldsConfig
// //           const res = await fetch(url)

// //           if (!res.ok) throw new Error(`HTTP ${res.status}`)

// //           const data = await res.json()

// //           // Extract field names from columns metadata if available
// //           if (Array.isArray(data?.columns) && data.columns?.length > 0) {
// //             fieldNames = data.columns.map((c) => c?.field ??c?.accessorKey ??c?.key).filter(Boolean)
// //             fieldsData = data.columns
// //           }
// //           // Fallback to deriving from first row
// //           if (fieldNames?.length === 0) {
// //             const rowsArr = Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : []
// //             const firstObjectRow = rowsArr.find((r) => r && typeof r === "object" && !Array.isArray(r))
// //             if (firstObjectRow) {
// //               fieldNames = Object.keys(firstObjectRow)
// //             }
// //           }
// //         }

// //         const uniqueFields = Array.from(new Set(fieldNames))
// //         setAvailableFields(uniqueFields)

// //         // Calculate defaults
// //         const dynamicDefaults = generateDynamicDefaults(uniqueFields)
// //         const existing = new Set(uniqueFields)

// //         const resolvedMandatory = (
// //           tableConfig.mandatoryColumns?.length > 0 ? tableConfig.mandatoryColumns : dynamicDefaults.mandatoryColumns
// //         ).filter((f) => f !== "id" && existing.has(f))

// //         const resolvedDefaultVisible = (
// //           tableConfig.defaultVisibleColumns?.length > 0
// //             ? tableConfig.defaultVisibleColumns
// //             : dynamicDefaults.defaultVisibleColumns
// //         ).filter((f) => existing.has(f))

// //         const resolvedPinned = (
// //           tableConfig.pinnedColumns?.length > 0 ? tableConfig.pinnedColumns : dynamicDefaults.pinnedColumns
// //         ).filter((f) => existing.has(f))

// //         // Calculate schema diff
// //         const missingMandatory = (tableConfig.mandatoryColumns || []).filter((f) => !existing.has(f))
// //         const missingVisible = (tableConfig.defaultVisibleColumns || []).filter((f) => !existing.has(f))
// //         const missingPinned = (tableConfig.pinnedColumns || []).filter((f) => !existing.has(f))
// //         setSchemaDiff({ missingMandatory, missingVisible, missingPinned })

// //         const mandatoryLookup = new Set(resolvedMandatory)

// //         // Check if we have saved column config
// //         const hasSavedColumns = savedConfig?.datagrid_default_configuration?.columns?.length > 0

// //         if (hasSavedColumns) {
// //           // Use saved configuration
// //           const normalized = savedConfig.datagrid_default_configuration.columns
// //             .filter((c) => !!c?.field)
// //             .map((c) => ({
// //               field: c.field,
// //               label: c.label ??c.field.replace(/_/g, " "),
// //               width: c.width ??150,
// //               visible: c.visible ??true,
// //               filterable: c.filterable ??true,
// //               sortable: c.sortable ??true,
// //               pinned: c.pinned === true || c.pinned === "left" ? "left" : "none",
// //               required: c.required ??false,
// //             }))
// //           setColumns(normalized)
// //           setInitialColumns([...normalized])
// //         } else {
// //           // Build columns from field data
// //           const mapped = uniqueFields.map((field) => {
// //             // Try to get label from fieldsData if available
// //             let label = field.replace(/_/g, " ")
// //             if (fieldsData && Array.isArray(fieldsData)) {
// //               const fieldData = fieldsData.find((f) => (f.field || f) === field)
// //               if (fieldData?.label) {
// //                 label = fieldData.label
// //               }
// //             }

// //             return {
// //               field,
// //               label,
// //               width: 150,
// //               visible: false,
// //               filterable: false,
// //               sortable: false,
// //               pinned: "none",
// //               required: false,
// //             }
// //           })

// //           setColumns(mapped)
// //           setInitialColumns([...mapped])
// //         }

// //         initialDataLoaded.current = true
// //       } catch (error) {
// //         console.error("Error loading initial data:", error)
// //         setColumns([])
// //         setInitialColumns([])
// //         setAvailableFields([])
// //       }
// //     }

// //     loadInitialData()
// //   }, [org?.organization_id])

// //   // Separate effect for loading rows only when preview is shown
// //   useEffect(() => {
// //     const fetchRows = async () => {
// //       if (!org?.organization_id || !showPreview) return

// //       try {
// //         setLoadingRows(true)
// //         setServerError(null)
// //         const params = new URLSearchParams()

// //         if (sortModel?.field && sortModel?.direction) {
// //           params.set("sortField", sortModel.field)
// //           params.set("sortOrder", sortModel.direction)
// //         }

// //         if (filterModel && typeof filterModel === "object") {
// //           Object.entries(filterModel).forEach(([f, v]) => {
// //             if (v !== undefined && v !== null && v !== "") params.append(`filter[${f}]`, String(v))
// //           })
// //         }

// //         const url = apiFieldsConfig
// //         const res = await fetch(url)
// //         if (!res.ok) throw new Error(`HTTP ${res.status}`)
// //         const data = await res.json()
// //         const nextRows = Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : []
// //         setRows(nextRows)
// //       } catch (e) {
// //         setServerError(e?.message || "Failed to load rows")
// //         setRows([])
// //       } finally {
// //         setLoadingRows(false)
// //       }
// //     }

// //     fetchRows()
// //   }, [org?.organization_id, showPreview, sortModel, filterModel])

// //   // ============================================================================
// //   // RENDER
// //   // ============================================================================

// //   return (
// //     <Box sx={{ p: 2 }}>
// //       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
// //         <Typography variant="h5">Data-Grid Configuration Form</Typography>
// //         <Stack direction="row" spacing={1} alignItems="center">
// //           <Chip size="small" icon={<PushPinIcon />} label={`Left: ${pinnedSummary.left}`} />
// //         </Stack>
// //       </Stack>

// //       {(schemaDiff.missingMandatory?.length > 0 ||
// //         schemaDiff.missingVisible?.length > 0 ||
// //         schemaDiff.missingPinned?.length > 0) && (
// //         <Alert severity="warning" sx={{ mb: 1 }}>
// //           Some default settings reference fields not present in the current API response:
// //           {schemaDiff.missingMandatory?.length > 0 && (
// //             <span> Missing mandatory: {schemaDiff.missingMandatory.join(", ")}.</span>
// //           )}
// //           {schemaDiff.missingVisible?.length > 0 && (
// //             <span> Missing visible: {schemaDiff.missingVisible.join(", ")}.</span>
// //           )}
// //           {schemaDiff.missingPinned?.length > 0 && <span> Missing pinned: {schemaDiff.missingPinned.join(", ")}.</span>}
// //         </Alert>
// //       )}

// //       <TableContainer component={Paper}>
// //         <Table sx={{ minWidth: 500, "& .MuiTableCell-root": { padding: "8px 6px" } }}>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>
// //                 <Typography variant="subtitle1" fontWeight="semibold">
// //                   Field Name
// //                 </Typography>
// //               </TableCell>
// //               <TableCell>
// //                 <Typography variant="subtitle1" fontWeight="semibold">
// //                   Label
// //                 </Typography>
// //               </TableCell>
// //               <TableCell>
// //                 <Typography variant="subtitle1" fontWeight="semibold">
// //                   Width
// //                 </Typography>
// //               </TableCell>
// //               <TableCell align="center">
// //                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
// //                   <Typography variant="subtitle1" fontWeight="semibold">
// //                     Visible
// //                   </Typography>
// //                   <FormControlLabel
// //                     control={
// //                       <Checkbox
// //                         checked={allVisible}
// //                         indeterminate={someVisible && !allVisible}
// //                         onChange={(e) => setAll("visible", e.target.checked)}
// //                         data-testid="bulk-visible"
// //                         inputRef={(el) => {
// //                           if (el) checkboxRefs.current["bulk-visible"] = el
// //                         }}
// //                       />
// //                     }
// //                     label=""
// //                   />
// //                 </Box>
// //               </TableCell>
// //               <TableCell align="center">
// //                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
// //                   <Typography variant="subtitle1" fontWeight="semibold">
// //                     Filterable
// //                   </Typography>
// //                   <FormControlLabel
// //                     control={
// //                       <Checkbox
// //                         checked={allFilterable}
// //                         indeterminate={someFilterable && !allFilterable}
// //                         onChange={(e) => setAll("filterable", e.target.checked)}
// //                         data-testid="bulk-filterable"
// //                         inputRef={(el) => {
// //                           if (el) checkboxRefs.current["bulk-filterable"] = el
// //                         }}
// //                       />
// //                     }
// //                     label=""
// //                   />
// //                 </Box>
// //               </TableCell>
// //               <TableCell align="center">
// //                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
// //                   <Typography variant="subtitle1" fontWeight="semibold">
// //                     Sortable
// //                   </Typography>
// //                   <FormControlLabel
// //                     control={
// //                       <Checkbox
// //                         checked={allSortable}
// //                         indeterminate={someSortable && !allSortable}
// //                         onChange={(e) => setAll("sortable", e.target.checked)}
// //                         data-testid="bulk-sortable"
// //                         inputRef={(el) => {
// //                           if (el) checkboxRefs.current["bulk-sortable"] = el
// //                         }}
// //                       />
// //                     }
// //                     label=""
// //                   />
// //                 </Box>
// //               </TableCell>
// //               <TableCell align="center">
// //                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
// //                   <Typography variant="subtitle1" fontWeight="semibold">
// //                     Pinned
// //                   </Typography>
// //                   <Tooltip title="Pin all left">
// //                     <IconButton size="small" onClick={() => setAll("pinned", "left")} data-testid="bulk-pinned">
// //                       <PushPinIcon fontSize="small" />
// //                     </IconButton>
// //                   </Tooltip>
// //                 </Box>
// //               </TableCell>
// //             </TableRow>
// //           </TableHead>

// //           <TableBody>
// //             {columns?.length === 0 ? (
// //               <TableRow>
// //                 <TableCell colSpan={7}>
// //                   <Typography variant="body2" align="center" sx={{ py: 2 }}>
// //                     No columns configured
// //                   </Typography>
// //                 </TableCell>
// //               </TableRow>
// //             ) : (
// //               columns.map((column) => {
// //                 const isMandatory = mandatorySet.has(column.field)
// //                 const rowKey = `col-${column.field}`

// //                 return (
// //                   <TableRow key={rowKey} hover>
// //                     <TableCell>
// //                       <Stack direction="row" spacing={1} alignItems="center">
// //                         <Typography variant="body2">{column.field}</Typography>
// //                         <Chip
// //                           size="small"
// //                           label={column.required ? "Required" : "Optional"}
// //                           color={column.required ? "primary" : "default"}
// //                           variant={column.required ? "filled" : "outlined"}
// //                           clickable={!isMandatory}
// //                           onClick={!isMandatory ? () => toggleRequired(column.field) : undefined}
// //                           sx={{
// //                             height: 22,
// //                             borderRadius: 999,
// //                             fontSize: 12,
// //                             px: 0.5,
// //                             ...(isMandatory && { opacity: 0.9, cursor: "not-allowed" }),
// //                           }}
// //                         />
// //                       </Stack>
// //                     </TableCell>

// //                     <TableCell>
// //                       <TextField
// //                         size="small"
// //                         value={column.label}
// //                         onChange={(e) => handleLabelChange(column.field, e.target.value)}
// //                         inputRef={(el) => {
// //                           if (el) inputRefs.current[`${column.field}-label`] = el
// //                         }}
// //                         sx={{ width: 200 }}
// //                         data-testid={`label-${column.field}`}
// //                         placeholder="Enter column label..."
// //                       />
// //                     </TableCell>

// //                     <TableCell>
// //                       <TextField
// //                         type="number"
// //                         size="small"
// //                         value={column.width}
// //                         onChange={(e) => handleWidthChange(column.field, e.target.value)}
// //                         inputRef={(el) => {
// //                           if (el) inputRefs.current[`${column.field}-width`] = el
// //                         }}
// //                         sx={{ width: 100 }}
// //                         inputProps={{ min: 40 }}
// //                         data-testid={`width-${column.field}`}
// //                       />
// //                     </TableCell>

// //                     <TableCell align="center">
// //                       <FormControlLabel
// //                         control={
// //                           <Checkbox
// //                             checked={!!column.visible}
// //                             onChange={(e) => handleVisibilityChange(column.field, e.target.checked)}
// //                             disabled={isMandatory}
// //                             inputRef={(el) => {
// //                               if (el) checkboxRefs.current[`${column.field}-visible`] = el
// //                             }}
// //                             data-testid={`visible-${column.field}`}
// //                           />
// //                         }
// //                         label=""
// //                       />
// //                     </TableCell>

// //                     <TableCell align="center">
// //                       <FormControlLabel
// //                         control={
// //                           <Checkbox
// //                             checked={!!column.filterable}
// //                             onChange={(e) => handleFilterableChange(column.field, e.target.checked)}
// //                             inputRef={(el) => {
// //                               if (el) checkboxRefs.current[`${column.field}-filterable`] = el
// //                             }}
// //                             data-testid={`filterable-${column.field}`}
// //                           />
// //                         }
// //                         label=""
// //                       />
// //                     </TableCell>

// //                     <TableCell align="center">
// //                       <FormControlLabel
// //                         control={
// //                           <Checkbox
// //                             checked={!!column.sortable}
// //                             onChange={(e) => handleSortableChange(column.field, e.target.checked)}
// //                             inputRef={(el) => {
// //                               if (el) checkboxRefs.current[`${column.field}-sortable`] = el
// //                             }}
// //                             data-testid={`sortable-${column.field}`}
// //                           />
// //                         }
// //                         label=""
// //                       />
// //                     </TableCell>

// //                     <TableCell align="center">
// //                       <FormControlLabel
// //                         control={
// //                           <Checkbox
// //                             checked={column.pinned === "left"}
// //                             onChange={(e) => handlePinnedChange(column.field, e.target.checked)}
// //                             disabled={isMandatory && column.pinned !== "left"}
// //                             inputRef={(el) => {
// //                               if (el) checkboxRefs.current[`${column.field}-pinned`] = el
// //                             }}
// //                             data-testid={`pinned-${column.field}`}
// //                           />
// //                         }
// //                         label=""
// //                       />
// //                     </TableCell>
// //                   </TableRow>
// //                 )
// //               })
// //             )}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>

// //       <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //         <Stack direction="row" spacing={1} alignItems="center">
// //           <Button variant="contained" onClick={handleSubmit}>
// //             SUBMIT
// //           </Button>
// //           <Button variant="outlined" onClick={handleCancel}>
// //             CANCEL
// //           </Button>
// //         </Stack>

// //         <Button
// //           variant={showPreview ? "contained" : "outlined"}
// //           onClick={() => setShowPreview(!showPreview)}
// //           startIcon={showPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
// //           color={showPreview ? "primary" : "primary"}
// //           sx={{ minWidth: 120 }}
// //         >
// //           {showPreview ? "Hide Preview" : "Show Preview"}
// //         </Button>
// //       </Box>

// //       {saveStatus && (
// //         <Alert severity={saveStatus.startsWith("Error") ? "error" : "success"} sx={{ mt: 2 }}>
// //           {saveStatus}
// //         </Alert>
// //       )}

// //       {showPreview && (
// //         <Box sx={{ mt: 3 }}>
// //           <Typography variant="h6" sx={{ mb: 2 }}>
// //             Data-Grid Preview - Live Configuration
// //           </Typography>
// //           {serverError && (
// //             <Typography color="error" sx={{ mb: 1 }}>
// //               {serverError}
// //             </Typography>
// //           )}
// //           {loadingRows && (
// //             <Typography variant="body2" sx={{ mb: 1 }}>
// //               Loading…
// //             </Typography>
// //           )}
// //           <TableDataGeneric
// //             key={tableKey}
// //             tableName={tablename}
// //             heading={tableheading}
// //             data={rows}
// //             sortname={"name"}
// //             showActions={false}
// //             CardData={[]}
// //             hideToolbar={true}
// //             configss={columns}
// //             config={liveTableConfig}
// //             Route="/organization/employee/employee-details"
// //             token={typeof window !== "undefined" ? localStorage.getItem("token") : undefined}
// //             onSortChange={(field, direction) => setSortModel({ field, direction })}
// //             onFilterChange={(nextFilters) => setFilterModel(nextFilters)}
// //             onConfigChange={handleTableConfigChange}
// //             onColumnWidthChange={handleColumnWidthChange}
// //             onColumnVisibilityChange={handleColumnVisibilityChange}
// //           />
// //         </Box>
// //       )}
// //     </Box>
// //   )
// // }

// // export default TableConfigForm


// "use client"
// import { useEffect, useMemo, useState, useCallback, useRef } from "react"
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   Typography,
//   Tooltip,
//   IconButton,
//   Stack,
//   Chip,
//   Button,
//   Alert,
// } from "@mui/material"
// import PushPinIcon from "@mui/icons-material/PushPin"
// import VisibilityIcon from "@mui/icons-material/Visibility"
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
// import useAuthStore from "../../Zustand/Store/useAuthStore"
// import TableDataGeneric from "../../Configurations/TableDataGeneric"
// import { MAIN_URL } from "../../Configurations/Urls"

// /**
//  * Generates dynamic fallback defaults based on actual column fields from API,
//  * excluding "id" from mandatory columns.
//  */
// const generateDynamicDefaults = (columnFields) => {
//   return {
//     mandatoryColumns: [],
//     defaultVisibleColumns: [],
//     pinnedColumns: [],
//   }
// }

// const TableConfigForm = ({ apiFieldsConfig, datagridKeyProp, tablename, tableheading }) => {
//   const { userData } = useAuthStore()
//   const org = userData?.organization

//   // ============================================================================
//   // STATE MANAGEMENT
//   // ============================================================================

//   const [tableConfig, setTableConfig] = useState({
//     mandatoryColumns: [],
//     defaultVisibleColumns: [],
//     pinnedColumns: [],
//   })

//   const [columns, setColumns] = useState([])
//   const [initialColumns, setInitialColumns] = useState([])
//   const [rows, setRows] = useState([])
//   const [loadingRows, setLoadingRows] = useState(false)
//   const [availableFields, setAvailableFields] = useState([])
//   const [serverError, setServerError] = useState(null)
//   const [showPreview, setShowPreview] = useState(false)
//   const [sortModel, setSortModel] = useState(null)
//   const [filterModel, setFilterModel] = useState({})
//   const [saveStatus, setSaveStatus] = useState(null)
//   const [existingConfigId, setExistingConfigId] = useState(null)

//   const [schemaDiff, setSchemaDiff] = useState({
//     missingMandatory: [],
//     missingVisible: [],
//     missingPinned: [],
//   })

//   const inputRefs = useRef({})
//   const checkboxRefs = useRef({})
//   const focusTracker = useRef({})

//   // Track if initial data has been loaded
//   const initialDataLoaded = useRef(false)

//   // ============================================================================
//   // COMPUTED VALUES
//   // ============================================================================

//   const resolvedDefaults = useMemo(() => {
//     const dynamicDefaults = generateDynamicDefaults(availableFields)

//     return {
//       mandatoryColumns: [],
//       defaultVisibleColumns: [],
//       pinnedColumns: [],
//     }
//   }, [tableConfig, availableFields])

//   const mandatorySet = useMemo(() => new Set(resolvedDefaults.mandatoryColumns), [resolvedDefaults])

//   const liveTableConfig = useMemo(() => {
//     if (!columns || !Array.isArray(columns)) return null
//     return {
//       mandatoryColumns: columns.filter((col) => col.required && col.field !== "id").map((col) => col.field),
//       defaultVisibleColumns: columns.filter((col) => col.visible).map((col) => col.field),
//       pinnedColumns: columns.filter((col) => col.pinned === "left").map((col) => col.field),
//       sort: sortModel,
//       filters: filterModel,
//       pagination: { rowsPerPage: 10 },
//       search: { enabled: true, placeholder: "Search...", fields: [] },
//     }
//   }, [columns, sortModel, filterModel])

//   const { allVisible, someVisible, allFilterable, someFilterable, allSortable, someSortable } = useMemo(
//     () => ({
//       allVisible: columns?.length > 0 && columns.every((c) => c.visible),
//       someVisible: columns.some((c) => c.visible),
//       allFilterable: columns?.length > 0 && columns.every((c) => c.filterable),
//       someFilterable: columns.some((c) => c.filterable),
//       allSortable: columns?.length > 0 && columns.every((c) => c.sortable),
//       someSortable: columns.some((c) => c.sortable),
//     }),
//     [columns],
//   )

//   const pinnedSummary = useMemo(() => ({ left: columns.filter((c) => c.pinned === "left")?.length }), [columns])

//   const tableKey = useMemo(
//     () =>
//       `table-${columns?.length}-${JSON.stringify(
//         columns.map((c) => ({ f: c.field, v: c.visible, w: c.width, p: c.pinned, l: c.label })),
//       )}`,
//     [columns],
//   )

//   // ============================================================================
//   // FOCUS PRESERVATION UTILITY
//   // ============================================================================

//   const preserveFocusAndPosition = useCallback((field, elementType, callback) => {
//     const elementKey = `${field}-${elementType}`
//     const inputRef = inputRefs.current[elementKey]
//     const checkboxRef = checkboxRefs.current[elementKey]

//     let cursorPosition = null
//     let wasFocused = false
//     let wasActiveElement = false
//     let selectionStart = null
//     let selectionEnd = null

//     if (inputRef && document.activeElement === inputRef) {
//       cursorPosition = inputRef.selectionStart ??null
//       selectionStart = inputRef.selectionStart ??null
//       selectionEnd = inputRef.selectionEnd ??null
//       wasFocused = true
//       wasActiveElement = true
//       focusTracker.current[elementKey] = {
//         cursorPosition,
//         selectionStart,
//         selectionEnd,
//         wasFocused,
//         type: "input",
//       }
//     }

//     if (checkboxRef && document.activeElement === checkboxRef) {
//       wasFocused = true
//       wasActiveElement = true
//       focusTracker.current[elementKey] = { wasFocused, type: "checkbox" }
//     }

//     callback()

//     if (wasActiveElement) {
//       setTimeout(() => {
//         const trackedData = focusTracker.current[elementKey]
//         if (trackedData?.type === "input" && inputRef && trackedData.wasFocused) {
//           inputRef.focus()
//           if (trackedData.cursorPosition !== null && trackedData.cursorPosition !== undefined) {
//             inputRef.setSelectionRange(
//               trackedData.selectionStart ??trackedData.cursorPosition,
//               trackedData.selectionEnd ??trackedData.cursorPosition,
//             )
//           }
//         }
//         if (trackedData?.type === "checkbox" && checkboxRef && trackedData.wasFocused) {
//           checkboxRef.focus()
//         }
//         delete focusTracker.current[elementKey]
//       }, 0)
//     }
//   }, [])

//   // ============================================================================
//   // COLUMN UPDATE HANDLERS
//   // ============================================================================

//   const updateByField = useCallback(
//     (field, property, value, elementType = "checkbox") => {
//       preserveFocusAndPosition(field, elementType, () => {
//         setColumns((prev) => {
//           const idx = prev.findIndex((c) => c.field === field)
//           if (idx === -1) return prev
//           const col = prev[idx]

//           if (property === "visible" && mandatorySet.has(col.field) && value === false) return prev
//           if (property === "pinned" && mandatorySet.has(col.field) && value === "none") return prev
//           if (property === "required" && mandatorySet.has(col.field) && value === false) return prev

//           // If visible is being set to false, automatically unselect other related properties
//           if (property === "visible" && value === false) {
//             const updated = [...prev]
//             updated[idx] = {
//               ...col,
//               visible: false,
//               filterable: false,
//               sortable: false,
//               pinned: "none",
//               required: false, // Always false if not visible
//             }
//             return updated
//           }

//           const updated = [...prev]
//           updated[idx] = { ...col, [property]: value }
//           return updated
//         })
//       })
//     },
//     [mandatorySet, preserveFocusAndPosition],
//   )

//   const handleWidthChange = useCallback(
//     (field, value) => {
//       const numericValue = Number.parseInt(value, 10) || 40
//       preserveFocusAndPosition(field, "width", () => {
//         updateByField(field, "width", numericValue, "width")
//       })
//     },
//     [updateByField, preserveFocusAndPosition],
//   )

//   const handleLabelChange = useCallback(
//     (field, value) => {
//       preserveFocusAndPosition(field, "label", () => {
//         updateByField(field, "label", value, "label")
//       })
//     },
//     [updateByField, preserveFocusAndPosition],
//   )

//   const handleVisibilityChange = useCallback(
//     (field, checked) => {
//       updateByField(field, "visible", checked, "visible")
//     },
//     [updateByField],
//   )

//   const handleFilterableChange = useCallback(
//     (field, checked) => {
//       updateByField(field, "filterable", checked, "filterable")
//     },
//     [updateByField],
//   )

//   const handleSortableChange = useCallback(
//     (field, checked) => {
//       updateByField(field, "sortable", checked, "sortable")
//     },
//     [updateByField],
//   )

//   const handlePinnedChange = useCallback(
//     (field, checked) => {
//       updateByField(field, "pinned", checked ? "left" : "none", "pinned")
//     },
//     [updateByField],
//   )

//   const toggleRequired = useCallback(
//     (field) => {
//       preserveFocusAndPosition(field, "required-chip", () => {
//         setColumns((prev) => {
//           const idx = prev.findIndex((c) => c.field === field)
//           if (idx === -1 || mandatorySet.has(prev[idx].field)) return prev
//           const updated = [...prev]
//           updated[idx] = { ...updated[idx], required: !updated[idx].required }
//           return updated
//         })
//       })
//     },
//     [mandatorySet, preserveFocusAndPosition],
//   )

//   const setAll = useCallback(
//     (property, value) => {
//       const currentActiveElement = document.activeElement
//       preserveFocusAndPosition("bulk", String(property), () => {
//         setColumns((prev) =>
//           prev.map((col) => {
//             if (property === "visible") {
//               if (mandatorySet.has(col.field)) return { ...col, visible: true }
//               return { ...col, visible: !!value }
//             }
//             if (property === "pinned") {
//               if (mandatorySet.has(col.field)) return { ...col, pinned: "left" }
//               return { ...col, pinned: value }
//             }
//             if (property === "required") {
//               if (mandatorySet.has(col.field)) return { ...col, required: true }
//               return { ...col, required: !!value }
//             }
//             return { ...col, [property]: value }
//           }),
//         )
//       })
//       setTimeout(() => {
//         const bulkElement = document.querySelector(`[data-testid="bulk-${property}"]`)
//         if (bulkElement && currentActiveElement === bulkElement) bulkElement.focus()
//       }, 0)
//     },
//     [mandatorySet, preserveFocusAndPosition],
//   )

//   // ============================================================================
//   // BIDIRECTIONAL SYNC FROM PREVIEW GRID
//   // ============================================================================

//   const handleTableConfigChange = useCallback((updatedConfig) => {
//     if (!updatedConfig || !Array.isArray(updatedConfig)) return
//     setColumns((prevColumns) => {
//       const newColumns = [...prevColumns]
//       updatedConfig.forEach((update) => {
//         const index = newColumns.findIndex((col) => col.field === update.field)
//         if (index !== -1) {
//           newColumns[index] = {
//             ...newColumns[index],
//             ...update,
//             pinned:
//               update.pinned === true || update.pinned === "left"
//                 ? "left"
//                 : update.pinned === "none"
//                 ? "none"
//                 : newColumns[index].pinned,
//           }
//         }
//       })
//       return newColumns
//     })
//   }, [])

//   const handleColumnWidthChange = useCallback(
//     (field, newWidth) => {
//       const roundedWidth = Math.max(40, Math.round(newWidth))
//       updateByField(field, "width", roundedWidth, "width")
//     },
//     [updateByField],
//   )

//   const handleColumnVisibilityChange = useCallback(
//     (field, visible) => {
//       updateByField(field, "visible", visible, "visible")
//     },
//     [updateByField],
//   )

//   // ============================================================================
//   // FORM ACTIONS
//   // ============================================================================

//   const handleCancel = useCallback(() => {
//     setColumns([...initialColumns])
//   }, [initialColumns])

//   const handleSubmit = async () => {
//     if (!org?.organization_id) {
//       setSaveStatus("Organization not found.")
//       return
//     }

//     const currentMandatory = columns.filter((c) => c.required && c.field !== "id").map((c) => c.field)
//     const currentVisible = columns.filter((c) => c.visible).map((c) => c.field)
//     const currentPinned = columns.filter((c) => c.pinned === "left").map((c) => c.field)

//     const dynamicDefaults = generateDynamicDefaults(availableFields)

//     const configurationData = {
//       organization_id: org.organization_id,
//       columns: columns.map((c) => ({
//         field: c.field,
//         label: c.label || c.field.replace(/_/g, " "),
//         width: Number(c.width) || 150,
//         visible: !!c.visible,
//         filterable: !!c.filterable,
//         sortable: !!c.sortable,
//         pinned: c.pinned === "left" ? "left" : "none",
//         required: !!c.required,
//       })),
//       defaults: {
//         mandatoryColumns: currentMandatory?.length > 0 ? currentMandatory : dynamicDefaults.mandatoryColumns,
//         defaultVisibleColumns: currentVisible?.length > 0 ? currentVisible : dynamicDefaults.defaultVisibleColumns,
//         pinnedColumns: currentPinned?.length > 0 ? currentPinned : dynamicDefaults.pinnedColumns,
//       },
//       grid: {
//         sort: sortModel || null,
//         filters: filterModel || {},
//         pagination: { rowsPerPage: 10 },
//         search: { enabled: true, placeholder: "Search...", fields: [] },
//       },
//       meta: schemaDiff,
//     }

//     const datagridKey = datagridKeyProp || `employee_grid_${org.organization_id}`
//     const payload = {
//       datagrid_key: datagridKey,
//       datagrid_default_configuration: configurationData,
//     }

//     try {
//       setSaveStatus(null)

//       const isUpdate = existingConfigId !== null
//       const url = isUpdate
//         ? `${MAIN_URL}/api/general-datagrids/${existingConfigId}`
//         : `${MAIN_URL}/api/general-datagrids`
//       const method = isUpdate ? "PUT" : "POST"

//       const res = await fetch(url, {
//         method: method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       })

//       if (!res.ok) {
//         const errorText = await res.text()
//         let errorDetail = `HTTP ${res.status}`
//         try {
//           const errorJson = JSON.parse(errorText)
//           if (errorJson.errors) {
//             errorDetail = Object.values(errorJson.errors).flat().join(", ")
//           } else {
//             errorDetail = errorJson.detail || errorJson.message || errorJson.error || errorDetail
//           }
//         } catch {
//           errorDetail = errorText || errorDetail
//         }
//         throw new Error(errorDetail)
//       }

//       const result = await res.json()

//       if (!isUpdate && result.datagrid?.general_datagrid_default_configuration_id) {
//         setExistingConfigId(result.datagrid.general_datagrid_default_configuration_id)
//       }

//       setInitialColumns([...columns])
//       setSaveStatus(`Configuration ${isUpdate ? "updated" : "created"} successfully.`)
//     } catch (e) {
//       setSaveStatus(`Error saving configuration: ${e.message}`)
//     }
//   }

//   // ============================================================================
//   // CONSOLIDATED DATA FETCHING - SINGLE API CALL
//   // ============================================================================

// useEffect(() => {
//   const loadInitialData = async () => {
//     if (!org?.organization_id || initialDataLoaded.current) return;

//     const token = localStorage.getItem("token");

//     try {
//       // Load saved configuration
//       const configRes = await fetch(apiFieldsConfig, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // ✅ Added token here
//         },
//       });

//       let savedConfig = null;
//       if (configRes.ok) {
//         const configResponse = await configRes.json();
//         const datagrids = configResponse.datagrids || [];
//         const orgKey = `employee_grid_${org.organization_id}`;
//         savedConfig = datagrids.find((dg) => dg.datagrid_key === orgKey);

//         if (savedConfig) {
//           setExistingConfigId(savedConfig.general_datagrid_default_configuration_id);
//           const serverCfg = savedConfig.datagrid_default_configuration;
//           const nextDefaults = {
//             mandatoryColumns: serverCfg?.defaults?.mandatoryColumns ??[],
//             defaultVisibleColumns: serverCfg?.defaults?.defaultVisibleColumns ??[],
//             pinnedColumns: serverCfg?.defaults?.pinnedColumns ??[],
//           };
//           setTableConfig(nextDefaults);
//         }
//       }

//       // Use apiFieldsConfig prop if provided, otherwise fetch from API
//       let fieldNames = [];
//       let fieldsData = null;

//       if (apiFieldsConfig && Array.isArray(apiFieldsConfig)) {
//         // Use prop data
//         fieldNames = apiFieldsConfig.map((f) => f.field || f).filter(Boolean);
//         fieldsData = apiFieldsConfig;
//       } else {
//         // Fetch from API - SINGLE CALL
//         const url = apiFieldsConfig;
//         const res = await fetch(url, {
//           headers: {
//             Authorization: `Bearer ${token}`, // ✅ Added token here
//           },
//         });

//         if (!res.ok) throw new Error(`HTTP ${res.status}`);

//         const data = await res.json();

//         // Extract field names from columns metadata if available
//         if (Array.isArray(data?.columns) && data.columns?.length > 0) {
//           fieldNames = data.columns
//             .map((c) => c?.field ??c?.accessorKey ??c?.key)
//             .filter(Boolean);
//           fieldsData = data.columns;
//         }
//         // Fallback to deriving from first row
//         if (fieldNames?.length === 0) {
//           const rowsArr = Array.isArray(data?.rows)
//             ? data.rows
//             : Array.isArray(data)
//             ? data
//             : [];
//           const firstObjectRow = rowsArr.find(
//             (r) => r && typeof r === "object" && !Array.isArray(r)
//           );
//           if (firstObjectRow) {
//             fieldNames = Object.keys(firstObjectRow);
//           }
//         }
//       }

//       const uniqueFields = Array.from(new Set(fieldNames));
//       setAvailableFields(uniqueFields);

//       // Calculate defaults
//       const dynamicDefaults = generateDynamicDefaults(uniqueFields);
//       const existing = new Set(uniqueFields);

//       const resolvedMandatory = (
//         tableConfig.mandatoryColumns?.length > 0
//           ? tableConfig.mandatoryColumns
//           : dynamicDefaults.mandatoryColumns
//       ).filter((f) => f !== "id" && existing.has(f));

//       const resolvedDefaultVisible = (
//         tableConfig.defaultVisibleColumns?.length > 0
//           ? tableConfig.defaultVisibleColumns
//           : dynamicDefaults.defaultVisibleColumns
//       ).filter((f) => existing.has(f));

//       const resolvedPinned = (
//         tableConfig.pinnedColumns?.length > 0
//           ? tableConfig.pinnedColumns
//           : dynamicDefaults.pinnedColumns
//       ).filter((f) => existing.has(f));

//       // Calculate schema diff
//       const missingMandatory = (tableConfig.mandatoryColumns || []).filter((f) => !existing.has(f));
//       const missingVisible = (tableConfig.defaultVisibleColumns || []).filter((f) => !existing.has(f));
//       const missingPinned = (tableConfig.pinnedColumns || []).filter((f) => !existing.has(f));
//       setSchemaDiff({ missingMandatory, missingVisible, missingPinned });

//       const mandatoryLookup = new Set(resolvedMandatory);

//       // Check if we have saved column config
//       const hasSavedColumns = savedConfig?.datagrid_default_configuration?.columns?.length > 0;

//       if (hasSavedColumns) {
//         // Use saved configuration
//         const normalized = savedConfig.datagrid_default_configuration.columns
//           .filter((c) => !!c?.field)
//           .map((c) => ({
//             field: c.field,
//             label: c.label ??c.field.replace(/_/g, " "),
//             width: c.width ??150,
//             visible: c.visible ??true,
//             filterable: c.filterable ??true,
//             sortable: c.sortable ??true,
//             pinned: c.pinned === true || c.pinned === "left" ? "left" : "none",
//             required: c.required ??false,
//           }));
//         setColumns(normalized);
//         setInitialColumns([...normalized]);
//       } else {
//         // Build columns from field data
//         const mapped = uniqueFields.map((field) => {
//           let label = field.replace(/_/g, " ");
//           if (fieldsData && Array.isArray(fieldsData)) {
//             const fieldData = fieldsData.find((f) => (f.field || f) === field);
//             if (fieldData?.label) {
//               label = fieldData.label;
//             }
//           }

//           return {
//             field,
//             label,
//             width: 150,
//             visible: false,
//             filterable: false,
//             sortable: false,
//             pinned: "none",
//             required: false,
//           };
//         });

//         setColumns(mapped);
//         setInitialColumns([...mapped]);
//       }

//       initialDataLoaded.current = true;
//     } catch (error) {
//       console.error("Error loading initial data:", error);
//       setColumns([]);
//       setInitialColumns([]);
//       setAvailableFields([]);
//     }
//   };

//   loadInitialData();
// }, [org?.organization_id]);


//   // Separate effect for loading rows only when preview is shown
//   // useEffect(() => {
//   //   const fetchRows = async () => {
//   //     if (!org?.organization_id || !showPreview) return

//   //     try {
//   //       setLoadingRows(true)
//   //       setServerError(null)
//   //       const params = new URLSearchParams()

//   //       if (sortModel?.field && sortModel?.direction) {
//   //         params.set("sortField", sortModel.field)
//   //         params.set("sortOrder", sortModel.direction)
//   //       }

//   //       if (filterModel && typeof filterModel === "object") {
//   //         Object.entries(filterModel).forEach(([f, v]) => {
//   //           if (v !== undefined && v !== null && v !== "") params.append(`filter[${f}]`, String(v))
//   //         })
//   //       }

//   //       const url = apiFieldsConfig
//   //       const res = await fetch(url)
//   //       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//   //       const data = await res.json()
//   //       const nextRows = Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : []
//   //       setRows(nextRows)
//   //     } catch (e) {
//   //       setServerError(e?.message || "Failed to load rows")
//   //       setRows([])
//   //     } finally {
//   //       setLoadingRows(false)
//   //     }
//   //   }

//   //   fetchRows()
//   // }, [org?.organization_id, showPreview, sortModel, filterModel])

//   useEffect(() => {
//   const fetchRows = async () => {
//     if (!org?.organization_id || !showPreview) return;

//     try {
//       setLoadingRows(true);
//       setServerError(null);

//       const params = new URLSearchParams();

//       if (sortModel?.field && sortModel?.direction) {
//         params.set("sortField", sortModel.field);
//         params.set("sortOrder", sortModel.direction);
//       }

//       if (filterModel && typeof filterModel === "object") {
//         Object.entries(filterModel).forEach(([f, v]) => {
//           if (v !== undefined && v !== null && v !== "") {
//             params.append(`filter[${f}]`, String(v));
//           }
//         });
//       }

//       const token = localStorage.getItem("token"); // ✅ get token
//       const url = apiFieldsConfig;

//       const res = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`, // ✅ add token safely
//         },
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const data = await res.json();
//       const nextRows = Array.isArray(data?.rows)
//         ? data.rows
//         : Array.isArray(data)
//         ? data
//         : [];

//       setRows(nextRows);
//     } catch (e) {
//       setServerError(e?.message || "Failed to load rows");
//       setRows([]);
//     } finally {
//       setLoadingRows(false);
//     }
//   };

//   fetchRows();
// }, [org?.organization_id, showPreview, sortModel, filterModel]);


//   // ============================================================================
//   // RENDER
//   // ============================================================================

//   return (
//     <Box sx={{ p: 2 }}>
//       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
//         <Typography variant="h5">Data-Grid Configuration Form</Typography>
//         <Stack direction="row" spacing={1} alignItems="center">
//           <Chip size="small" icon={<PushPinIcon />} label={`Left: ${pinnedSummary.left}`} />
//         </Stack>
//       </Stack>

//       {(schemaDiff.missingMandatory?.length > 0 ||
//         schemaDiff.missingVisible?.length > 0 ||
//         schemaDiff.missingPinned?.length > 0) && (
//         <Alert severity="warning" sx={{ mb: 1 }}>
//           Some default settings reference fields not present in the current API response:
//           {schemaDiff.missingMandatory?.length > 0 && (
//             <span> Missing mandatory: {schemaDiff.missingMandatory.join(", ")}.</span>
//           )}
//           {schemaDiff.missingVisible?.length > 0 && (
//             <span> Missing visible: {schemaDiff.missingVisible.join(", ")}.</span>
//           )}
//           {schemaDiff.missingPinned?.length > 0 && <span> Missing pinned: {schemaDiff.missingPinned.join(", ")}.</span>}
//         </Alert>
//       )}

//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 500, "& .MuiTableCell-root": { padding: "8px 6px" } }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <Typography variant="subtitle1" fontWeight="semibold">
//                   Field Name
//                 </Typography>
//               </TableCell>
//               <TableCell>
//                 <Typography variant="subtitle1" fontWeight="semibold">
//                   Label
//                 </Typography>
//               </TableCell>
//               <TableCell>
//                 <Typography variant="subtitle1" fontWeight="semibold">
//                   Width
//                 </Typography>
//               </TableCell>
//               <TableCell align="center">
//                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
//                   <Typography variant="subtitle1" fontWeight="semibold">
//                     Visible
//                   </Typography>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={allVisible}
//                         indeterminate={someVisible && !allVisible}
//                         onChange={(e) => setAll("visible", e.target.checked)}
//                         data-testid="bulk-visible"
//                         inputRef={(el) => {
//                           if (el) checkboxRefs.current["bulk-visible"] = el
//                         }}
//                       />
//                     }
//                     label=""
//                   />
//                 </Box>
//               </TableCell>
//               <TableCell align="center">
//                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
//                   <Typography variant="subtitle1" fontWeight="semibold">
//                     Filterable
//                   </Typography>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={allFilterable}
//                         indeterminate={someFilterable && !allFilterable}
//                         onChange={(e) => setAll("filterable", e.target.checked)}
//                         data-testid="bulk-filterable"
//                         inputRef={(el) => {
//                           if (el) checkboxRefs.current["bulk-filterable"] = el
//                         }}
//                       />
//                     }
//                     label=""
//                   />
//                 </Box>
//               </TableCell>
//               <TableCell align="center">
//                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
//                   <Typography variant="subtitle1" fontWeight="semibold">
//                     Sortable
//                   </Typography>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={allSortable}
//                         indeterminate={someSortable && !allSortable}
//                         onChange={(e) => setAll("sortable", e.target.checked)}
//                         data-testid="bulk-sortable"
//                         inputRef={(el) => {
//                           if (el) checkboxRefs.current["bulk-sortable"] = el
//                         }}
//                       />
//                     }
//                     label=""
//                   />
//                 </Box>
//               </TableCell>
//               <TableCell align="center">
//                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
//                   <Typography variant="subtitle1" fontWeight="semibold">
//                     Pinned
//                   </Typography>
//                   <Tooltip title="Pin all left">
//                     <IconButton size="small" onClick={() => setAll("pinned", "left")} data-testid="bulk-pinned">
//                       <PushPinIcon fontSize="small" />
//                     </IconButton>
//                   </Tooltip>
//                 </Box>
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {columns?.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7}>
//                   <Typography variant="body2" align="center" sx={{ py: 2 }}>
//                     No columns configured
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               columns.map((column) => {
//                 const isMandatory = mandatorySet.has(column.field)
//                 const rowKey = `col-${column.field}`

//                 return (
//                   <TableRow key={rowKey} hover>
//                     <TableCell>
//                       <Stack direction="row" spacing={1} alignItems="center">
//                         <Typography variant="body2">{column.field}</Typography>
//                         <Chip
//                           size="small"
//                           label={column.required ? "Required" : "Optional"}
//                           color={column.required ? "primary" : "default"}
//                           variant={column.required ? "filled" : "outlined"}
//                           clickable={!isMandatory && column.visible}
//                           onClick={!isMandatory && column.visible ? () => toggleRequired(column.field) : undefined}
//                           sx={{
//                             height: 22,
//                             borderRadius: 999,
//                             fontSize: 12,
//                             px: 0.5,
//                             ...(isMandatory && { opacity: 0.9, cursor: "not-allowed" }),
//                             ...(!column.visible && { opacity: 0.5, cursor: "default" }),
//                           }}
//                         />
//                       </Stack>
//                     </TableCell>

//                     <TableCell>
//                       <TextField
//                         size="small"
//                         value={column.label}
//                         onChange={(e) => handleLabelChange(column.field, e.target.value)}
//                         inputRef={(el) => {
//                           if (el) inputRefs.current[`${column.field}-label`] = el
//                         }}
//                         sx={{ width: 200 }}
//                         data-testid={`label-${column.field}`}
//                         placeholder="Enter column label..."
//                       />
//                     </TableCell>

//                     <TableCell>
//                       <TextField
//                         type="number"
//                         size="small"
//                         value={column.width}
//                         onChange={(e) => handleWidthChange(column.field, e.target.value)}
//                         inputRef={(el) => {
//                           if (el) inputRefs.current[`${column.field}-width`] = el
//                         }}
//                         sx={{ width: 100 }}
//                         inputProps={{ min: 40 }}
//                         data-testid={`width-${column.field}`}
//                       />
//                     </TableCell>

//                     <TableCell align="center">
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={!!column.visible}
//                             onChange={(e) => handleVisibilityChange(column.field, e.target.checked)}
//                             disabled={isMandatory}
//                             inputRef={(el) => {
//                               if (el) checkboxRefs.current[`${column.field}-visible`] = el
//                             }}
//                             data-testid={`visible-${column.field}`}
//                           />
//                         }
//                         label=""
//                       />
//                     </TableCell>

//                     <TableCell align="center">
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={!!column.filterable}
//                             onChange={(e) => handleFilterableChange(column.field, e.target.checked)}
//                             disabled={!column.visible}
//                             inputRef={(el) => {
//                               if (el) checkboxRefs.current[`${column.field}-filterable`] = el
//                             }}
//                             data-testid={`filterable-${column.field}`}
//                           />
//                         }
//                         label=""
//                       />
//                     </TableCell>

//                     <TableCell align="center">
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={!!column.sortable}
//                             onChange={(e) => handleSortableChange(column.field, e.target.checked)}
//                             disabled={!column.visible}
//                             inputRef={(el) => {
//                               if (el) checkboxRefs.current[`${column.field}-sortable`] = el
//                             }}
//                             data-testid={`sortable-${column.field}`}
//                           />
//                         }
//                         label=""
//                       />
//                     </TableCell>

//                     <TableCell align="center">
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={column.pinned === "left"}
//                             onChange={(e) => handlePinnedChange(column.field, e.target.checked)}
//                             disabled={!column.visible || (isMandatory && column.pinned !== "left")}
//                             inputRef={(el) => {
//                               if (el) checkboxRefs.current[`${column.field}-pinned`] = el
//                             }}
//                             data-testid={`pinned-${column.field}`}
//                           />
//                         }
//                         label=""
//                       />
//                     </TableCell>
//                   </TableRow>
//                 )
//               })
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <Stack direction="row" spacing={1} alignItems="center">
//           <Button variant="contained" onClick={handleSubmit}>
//             SUBMIT
//           </Button>
//           <Button variant="outlined" onClick={handleCancel}>
//             CANCEL
//           </Button>
//         </Stack>

//         <Button
//           variant={showPreview ? "contained" : "outlined"}
//           onClick={() => setShowPreview(!showPreview)}
//           startIcon={showPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
//           color={showPreview ? "primary" : "primary"}
//           sx={{ minWidth: 120 }}
//         >
//           {showPreview ? "Hide Preview" : "Show Preview"}
//         </Button>
//       </Box>

//       {saveStatus && (
//         <Alert severity={saveStatus.startsWith("Error") ? "error" : "success"} sx={{ mt: 2 }}>
//           {saveStatus}
//         </Alert>
//       )}

//       {showPreview && (
//         <Box sx={{ mt: 3 }}>
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Data-Grid Preview - Live Configuration
//           </Typography>
//           {serverError && (
//             <Typography color="error" sx={{ mb: 1 }}>
//               {serverError}
//             </Typography>
//           )}
//           {loadingRows && (
//             <Typography variant="body2" sx={{ mb: 1 }}>
//               Loading…
//             </Typography>
//           )}
//           <TableDataGeneric
//             key={tableKey}
//             tableName={tablename}
//             heading={tableheading}
//             data={rows}
//             sortname={"name"}
//             showActions={false}
//             CardData={[]}
//             hideToolbar={true}
//             configss={columns}
//             config={liveTableConfig}
//             Route="/organization/employee/employee-details"
//             token={typeof window !== "undefined" ? localStorage.getItem("token") : undefined}
//             onSortChange={(field, direction) => setSortModel({ field, direction })}
//             onFilterChange={(nextFilters) => setFilterModel(nextFilters)}
//             onConfigChange={handleTableConfigChange}
//             onColumnWidthChange={handleColumnWidthChange}
//             onColumnVisibilityChange={handleColumnVisibilityChange}
//           />
//         </Box>
//       )}
//     </Box>
//   )
// }

// export default TableConfigForm




"use client";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Tooltip,
  IconButton,
  Stack,
  Chip,
  Button,
  Alert,
} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import TableDataGeneric from "../../Configurations/TableDataGeneric";
import { MAIN_URL } from "../../Configurations/Urls";


const TableConfigForm = ({
  apiFieldsConfig,
  datagridKeyProp,
  tablename,
  tableheading,
}) => {
  const { userData } = useAuthStore();
  const org = userData?.organization;


  // STATE
  const [columns, setColumns] = useState([]);
  const [initialColumns, setInitialColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const [availableFields, setAvailableFields] = useState([]);
  const [serverError, setServerError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sortModel, setSortModel] = useState(null);
  const [filterModel, setFilterModel] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const [existingConfigId, setExistingConfigId] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [schemaDiff, setSchemaDiff] = useState({
    missingMandatory: [],
    missingVisible: [],
    missingPinned: [],
  });


  const inputRefs = useRef({});
  const checkboxRefs = useRef({});
  const focusTracker = useRef({});
  const initialDataLoaded = useRef(false);


  // COMPUTED VALUES
  const liveTableConfig = useMemo(() => {
    if (!columns || !Array.isArray(columns)) return null;
    return {
      mandatoryColumns: columns
        .filter((col) => col.required && col.field !== "id")
        .map((col) => col.field),
      defaultVisibleColumns: columns
        .filter((col) => col.visible)
        .map((col) => col.field),
      pinnedColumns: columns
        .filter((col) => col.pinned === "left")
        .map((col) => col.field),
      sort: sortModel,
      filters: filterModel,
      pagination: { rowsPerPage: 10 },
      search: { enabled: true, placeholder: "Search...", fields: [] },
    };
  }, [columns, sortModel, filterModel]);


  const {
    allVisible,
    someVisible,
    allFilterable,
    someFilterable,
    allSortable,
    someSortable,
    visibleColumns,
  } = useMemo(() => {
    const visibleCols = columns.filter((c) => c.visible);
    const visibleCount = visibleCols.length;


    return {
      allVisible: columns.length > 0 && columns.every((c) => c.visible),
      someVisible: columns.some((c) => c.visible),
      visibleColumns: visibleCols,
      allFilterable: visibleCount > 0 && visibleCols.every((c) => c.filterable),
      someFilterable: visibleCols.some((c) => c.filterable),
      allSortable: visibleCount > 0 && visibleCols.every((c) => c.sortable),
      someSortable: visibleCols.some((c) => c.sortable),
    };
  }, [columns]);


  const pinnedSummary = useMemo(
    () => ({ left: columns.filter((c) => c.pinned === "left").length }),
    [columns]
  );


  const tableKey = useMemo(
    () =>
      `table-${columns.length}-${JSON.stringify(
        columns.map((c) => ({
          f: c.field,
          v: c.visible,
          w: c.width,
          p: c.pinned,
          l: c.label,
        }))
      )}`,
    [columns]
  );


  // FOCUS PRESERVATION
  const preserveFocusAndPosition = useCallback(
    (field, elementType, callback) => {
      const elementKey = `${field}-${elementType}`;
      const inputRef = inputRefs.current[elementKey];
      const checkboxRef = checkboxRefs.current[elementKey];


      let cursorPosition = null;
      let wasFocused = false;
      let wasActiveElement = false;
      let selectionStart = null;
      let selectionEnd = null;


      if (inputRef && document.activeElement === inputRef) {
        cursorPosition = inputRef.selectionStart ?? null;
        selectionStart = inputRef.selectionStart ?? null;
        selectionEnd = inputRef.selectionEnd ?? null;
        wasFocused = true;
        wasActiveElement = true;
        focusTracker.current[elementKey] = {
          cursorPosition,
          selectionStart,
          selectionEnd,
          wasFocused,
          type: "input",
        };
      }


      if (checkboxRef && document.activeElement === checkboxRef) {
        wasFocused = true;
        wasActiveElement = true;
        focusTracker.current[elementKey] = { wasFocused, type: "checkbox" };
      }


      callback();


      if (wasActiveElement) {
        setTimeout(() => {
          const trackedData = focusTracker.current[elementKey];
          if (trackedData?.type === "input" && inputRef && trackedData.wasFocused) {
            inputRef.focus();
            if (trackedData.cursorPosition !== null && trackedData.cursorPosition !== undefined) {
              inputRef.setSelectionRange(
                trackedData.selectionStart ?? trackedData.cursorPosition,
                trackedData.selectionEnd ?? trackedData.cursorPosition
              );
            }
          }
          if (trackedData?.type === "checkbox" && checkboxRef && trackedData.wasFocused) {
            checkboxRef.focus();
          }
          delete focusTracker.current[elementKey];
        }, 0);
      }
    },
    []
  );


  // COLUMN UPDATE HANDLERS
  const updateByField = useCallback(
    (field, property, value, elementType = "checkbox") => {
      preserveFocusAndPosition(field, elementType, () => {
        setColumns((prev) => {
          const idx = prev.findIndex((c) => c.field === field);
          if (idx === -1) return prev;
          const col = prev[idx];


          if (property === "visible" && value === false) {
            const updated = [...prev];
            updated[idx] = {
              ...col,
              visible: false,
              filterable: false,
              sortable: false,
              pinned: "none",
              required: false,
            };
            return updated;
          }


          const updated = [...prev];
          updated[idx] = { ...col, [property]: value };
          return updated;
        });
      });
    },
    [preserveFocusAndPosition]
  );


  const handleWidthChange = useCallback(
    (field, value) => {
      const numericValue = Number.parseInt(value, 10) || 40;
      preserveFocusAndPosition(field, "width", () => {
        updateByField(field, "width", numericValue, "width");
      });
    },
    [updateByField, preserveFocusAndPosition]
  );


  const handleLabelChange = useCallback(
    (field, value) => {
      preserveFocusAndPosition(field, "label", () => {
        updateByField(field, "label", value, "label");
      });
    },
    [updateByField, preserveFocusAndPosition]
  );


  const handleVisibilityChange = useCallback(
    (field, checked) => {
      updateByField(field, "visible", checked, "visible");
    },
    [updateByField]
  );


  const handleFilterableChange = useCallback(
    (field, checked) => {
      updateByField(field, "filterable", checked, "filterable");
    },
    [updateByField]
  );


  const handleSortableChange = useCallback(
    (field, checked) => {
      updateByField(field, "sortable", checked, "sortable");
    },
    [updateByField]
  );


  const handlePinnedChange = useCallback(
    (field, checked) => {
      updateByField(field, "pinned", checked ? "left" : "none", "pinned");
    },
    [updateByField]
  );


  const toggleRequired = useCallback((field) => {
    preserveFocusAndPosition(field, "required-chip", () => {
      setColumns((prev) => {
        const idx = prev.findIndex((c) => c.field === field);
        if (idx === -1) return prev;
        const updated = [...prev];
        updated[idx] = { ...updated[idx], required: !updated[idx].required };
        return updated;
      });
    });
  }, [preserveFocusAndPosition]);


  const setAll = useCallback(
    (property, value) => {
      const currentActiveElement = document.activeElement;
      preserveFocusAndPosition("bulk", String(property), () => {
        setColumns((prev) =>
          prev.map((col) => {
            if (property === "visible") {
              return { ...col, visible: !!value };
            }
            if (property === "filterable" || property === "sortable") {
              if (!col.visible) return col;
              return { ...col, [property]: value };
            }
            if (property === "pinned") {
              if (!col.visible) return col;
              return { ...col, pinned: value };
            }
            return { ...col, [property]: value };
          })
        );
      });
      setTimeout(() => {
        const bulkElement = document.querySelector(`[data-testid="bulk-${property}"]`);
        if (bulkElement && currentActiveElement === bulkElement) bulkElement.focus();
      }, 0);
    },
    [preserveFocusAndPosition]
  );


  // PREVIEW TABLE SYNC
  const handleTableConfigChange = useCallback((updatedConfig) => {
    if (!updatedConfig || !Array.isArray(updatedConfig)) return;
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      updatedConfig.forEach((update) => {
        const index = newColumns.findIndex((col) => col.field === update.field);
        if (index !== -1) {
          newColumns[index] = {
            ...newColumns[index],
            ...update,
            pinned:
              update.pinned === true || update.pinned === "left"
                ? "left"
                : update.pinned === "none"
                ? "none"
                : newColumns[index].pinned,
          };
        }
      });
      return newColumns;
    });
  }, []);


  const handleColumnWidthChange = useCallback((field, newWidth) => {
    const roundedWidth = Math.max(40, Math.round(newWidth));
    setColumns((prev) => {
      const idx = prev.findIndex((c) => c.field === field);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], width: roundedWidth };
      return updated;
    });
  }, []);


  const handleColumnVisibilityChange = useCallback(
    (field, visible) => {
      updateByField(field, "visible", visible, "visible");
    },
    [updateByField]
  );


  // FORM ACTIONS
  const handleCancel = useCallback(() => {
    setColumns([...initialColumns]);
  }, [initialColumns]);


  const handleSubmit = async () => {
    if (!org?.organization_id) {
      setSaveStatus("Organization not found.");
      return;
    }


    const currentMandatory = columns
      .filter((c) => c.required && c.field !== "id")
      .map((c) => c.field);
    const currentVisible = columns.filter((c) => c.visible).map((c) => c.field);
    const currentPinned = columns
      .filter((c) => c.pinned === "left")
      .map((c) => c.field);


    const configurationData = {
      organization_id: org.organization_id,
      columns: columns.map((c) => ({
        field: c.field,
        label: c.label || c.field.replace(/_/g, " "),
        width: Number(c.width) || 150,
        visible: !!c.visible,
        filterable: !!c.filterable,
        sortable: !!c.sortable,
        pinned: c.pinned === "left" ? "left" : "none",
        required: !!c.required,
      })),
      defaults: {
        mandatoryColumns: currentMandatory,
        defaultVisibleColumns: currentVisible,
        pinnedColumns: currentPinned,
      },
      grid: {
        sort: sortModel || null,
        filters: filterModel || {},
        pagination: { rowsPerPage: 10 },
        search: { enabled: true, placeholder: "Search...", fields: [] },
      },
      meta: schemaDiff,
    };


    const datagridKey = datagridKeyProp || `${tablename}_grid_${org.organization_id}`;
    const payload = {
      datagrid_key: datagridKey,
      datagrid_default_configuration: configurationData,
    };


    try {
      setSaveStatus(null);


      const isUpdate = existingConfigId !== null;
      const url = isUpdate
        ? `${MAIN_URL}/api/general-datagrids/${existingConfigId}`
        : `${MAIN_URL}/api/general-datagrids`;
      const method = isUpdate ? "PUT" : "POST";
      const token = localStorage.getItem("token");


      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });


      if (!res.ok) {
        const errorText = await res.text();
        let errorDetail = `HTTP ${res.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.errors) {
            errorDetail = Object.values(errorJson.errors).flat().join(", ");
          } else {
            errorDetail = errorJson.detail || errorJson.message || errorJson.error || errorDetail;
          }
        } catch {
          errorDetail = errorText || errorDetail;
        }
        throw new Error(errorDetail);
      }


      const result = await res.json();


      if (!isUpdate && result.datagrid?.general_datagrid_default_configuration_id) {
        setExistingConfigId(result.datagrid.general_datagrid_default_configuration_id);
        setIsUpdateMode(true);
      }


      setInitialColumns([...columns]);
      setSaveStatus(`Configuration ${isUpdate ? "updated" : "created"} successfully.`);
    } catch (e) {
      setSaveStatus(`Error saving configuration: ${e.message}`);
    }
  };


  // LOAD INITIAL DATA
  useEffect(() => {
    const loadInitialData = async () => {
      if (!org?.organization_id || initialDataLoaded.current) return;


      try {
        const token = localStorage.getItem("token");
        const datagridKey = datagridKeyProp || `${tablename}_grid_${org.organization_id}`;


        // Load saved configuration
        const configRes = await fetch(`${MAIN_URL}/api/general-datagrids`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });


        let savedConfig = null;
        if (configRes.ok) {
          const configResponse = await configRes.json();
          const datagrids = configResponse.datagrids || [];
          savedConfig = datagrids.find((dg) => dg.datagrid_key === datagridKey);


          if (savedConfig) {
            setExistingConfigId(savedConfig.general_datagrid_default_configuration_id);
            setIsUpdateMode(true);
          }
        }


        // Load field configuration
        let fieldNames = [];
        let fieldsData = null;


        if (apiFieldsConfig && Array.isArray(apiFieldsConfig)) {
          fieldNames = apiFieldsConfig.map((f) => f.field || f).filter(Boolean);
          fieldsData = apiFieldsConfig;
        } else {
          const res = await fetch(apiFieldsConfig, {
            headers: { Authorization: `Bearer ${token}` },
          });


          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();


          if (Array.isArray(data?.columns) && data.columns.length > 0) {
            fieldNames = data.columns
              .map((c) => c?.field ?? c?.accessorKey ?? c?.key)
              .filter(Boolean);
            fieldsData = data.columns;
          }


          if (fieldNames.length === 0) {
            const rowsArr = Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : [];
            const firstObjectRow = rowsArr.find((r) => r && typeof r === "object" && !Array.isArray(r));
            if (firstObjectRow) {
              fieldNames = Object.keys(firstObjectRow);
            }
          }
        }


        const uniqueFields = Array.from(new Set(fieldNames));
        setAvailableFields(uniqueFields);


        const hasSavedColumns = savedConfig?.datagrid_default_configuration?.columns?.length > 0;


        if (hasSavedColumns) {
          const savedColumnMap = new Map();
          savedConfig.datagrid_default_configuration.columns.forEach((c) => {
            if (c?.field) {
              savedColumnMap.set(c.field, {
                label: c.label ?? c.field.replace(/_/g, " "),
                width: c.width ?? 150,
                visible: c.visible ?? false,
                filterable: c.filterable ?? false,
                sortable: c.sortable ?? false,
                pinned: c.pinned === true || c.pinned === "left" ? "left" : "none",
                required: c.required ?? false,
              });
            }
          });


          const mergedColumns = uniqueFields.map((field) => {
            const savedProps = savedColumnMap.get(field);


            if (savedProps) {
              return { field, ...savedProps };
            } else {
              let label = field.replace(/_/g, " ");
              if (fieldsData && Array.isArray(fieldsData)) {
                const fieldData = fieldsData.find((f) => (f.field || f) === field);
                if (fieldData?.label) label = fieldData.label;
              }


              return {
                field,
                label,
                width: 150,
                visible: false,
                filterable: false,
                sortable: false,
                pinned: "none",
                required: false,
              };
            }
          });


          setColumns(mergedColumns);
          setInitialColumns([...mergedColumns]);
        } else {
          const mapped = uniqueFields.map((field) => {
            let label = field.replace(/_/g, " ");
            if (fieldsData && Array.isArray(fieldsData)) {
              const fieldData = fieldsData.find((f) => (f.field || f) === field);
              if (fieldData?.label) label = fieldData.label;
            }


            return {
              field,
              label,
              width: 150,
              visible: false,
              filterable: false,
              sortable: false,
              pinned: "none",
              required: false,
            };
          });


          setColumns(mapped);
          setInitialColumns([...mapped]);
        }


        initialDataLoaded.current = true;
      } catch (error) {
        console.error("Error loading initial data:", error);
        setColumns([]);
        setInitialColumns([]);
        setAvailableFields([]);
      }
    };


    loadInitialData();
  }, [org?.organization_id, datagridKeyProp, apiFieldsConfig]);


  // LOAD PREVIEW ROWS
  useEffect(() => {
    const fetchRows = async () => {
      if (!org?.organization_id || !showPreview) return;


      try {
        setLoadingRows(true);
        setServerError(null);


        const token = localStorage.getItem("token");
        const res = await fetch(apiFieldsConfig, {
          headers: { Authorization: `Bearer ${token}` },
        });


        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const nextRows = Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : [];
        setRows(nextRows);
      } catch (e) {
        setServerError(e?.message || "Failed to load rows");
        setRows([]);
      } finally {
        setLoadingRows(false);
      }
    };


    fetchRows();
  }, [org?.organization_id, showPreview, apiFieldsConfig]);


  // RENDER
  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h5">Data-Grid Configuration Form</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip size="small" icon={<PushPinIcon />} label={`Left: ${pinnedSummary.left}`} />
          {isUpdateMode && (
            <Chip size="small" label="Update Mode" color="info" variant="outlined" />
          )}
        </Stack>
      </Stack>


      {(schemaDiff.missingMandatory.length > 0 ||
        schemaDiff.missingVisible.length > 0 ||
        schemaDiff.missingPinned.length > 0) && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          Some default settings reference fields not present in the current API response:
          {schemaDiff.missingMandatory.length > 0 && (
            <span> Missing mandatory: {schemaDiff.missingMandatory.join(", ")}.</span>
          )}
          {schemaDiff.missingVisible.length > 0 && (
            <span> Missing visible: {schemaDiff.missingVisible.join(", ")}.</span>
          )}
          {schemaDiff.missingPinned.length > 0 && (
            <span> Missing pinned: {schemaDiff.missingPinned.join(", ")}.</span>
          )}
        </Alert>
      )}


      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500, "& .MuiTableCell-root": { padding: "8px 6px" } }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: "sticky",
                  left: 0,
                  backgroundColor: "background.paper",
                  zIndex: 10,
                  minWidth: 150,
                }}
              >
                <Typography variant="subtitle1" fontWeight="semibold">
                  Field Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="semibold">
                  Label
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="semibold">
                  Width
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight="semibold">
                    Visible
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allVisible}
                        indeterminate={someVisible && !allVisible}
                        onChange={(e) => setAll("visible", e.target.checked)}
                        data-testid="bulk-visible"
                        inputRef={(el) => {
                          if (el) checkboxRefs.current["bulk-visible"] = el;
                        }}
                      />
                    }
                    label=""
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight="semibold">
                    Filterable
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allFilterable}
                        indeterminate={someFilterable && !allFilterable}
                        onChange={(e) => setAll("filterable", e.target.checked)}
                        disabled={visibleColumns.length === 0}
                        data-testid="bulk-filterable"
                        inputRef={(el) => {
                          if (el) checkboxRefs.current["bulk-filterable"] = el;
                        }}
                      />
                    }
                    label=""
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight="semibold">
                    Sortable
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allSortable}
                        indeterminate={someSortable && !allSortable}
                        onChange={(e) => setAll("sortable", e.target.checked)}
                        disabled={visibleColumns.length === 0}
                        data-testid="bulk-sortable"
                        inputRef={(el) => {
                          if (el) checkboxRefs.current["bulk-sortable"] = el;
                        }}
                      />
                    }
                    label=""
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight="semibold">
                    Pinned
                  </Typography>
                  <Tooltip
                    title={
                      visibleColumns.length === 0
                        ? "No visible columns"
                        : "Pin all visible columns left"
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => setAll("pinned", "left")}
                        disabled={visibleColumns.length === 0}
                        data-testid="bulk-pinned"
                      >
                        <PushPinIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>


          <TableBody>
            {columns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="body2" align="center" sx={{ py: 2 }}>
                    No columns configured
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              columns.map((column) => {
                const rowKey = `col-${column.field}`;


                return (
                  <TableRow key={rowKey} hover>
                    <TableCell
                      sx={{
                        position: "sticky",
                        left: 0,
                        backgroundColor: "background.paper",
                        zIndex: 9,
                        minWidth: 150,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">{column.field}</Typography>
                        <Chip
                          size="small"
                          label={column.required ? "Required" : "Optional"}
                          color={column.required ? "primary" : "default"}
                          variant={column.required ? "filled" : "outlined"}
                          clickable={column.visible}
                          onClick={column.visible ? () => toggleRequired(column.field) : undefined}
                          sx={{
                            height: 22,
                            borderRadius: 999,
                            fontSize: 12,
                            px: 0.5,
                            ...(!column.visible && { opacity: 0.5, cursor: "default" }),
                          }}
                        />
                      </Stack>
                    </TableCell>


                    <TableCell>
                      <TextField
                        size="small"
                        value={column.label}
                        onChange={(e) => handleLabelChange(column.field, e.target.value)}
                        inputRef={(el) => {
                          if (el) inputRefs.current[`${column.field}-label`] = el;
                        }}
                        sx={{ width: 200 }}
                        data-testid={`label-${column.field}`}
                        placeholder="Enter column label..."
                      />
                    </TableCell>


                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={column.width}
                        onChange={(e) => handleWidthChange(column.field, e.target.value)}
                        inputRef={(el) => {
                          if (el) inputRefs.current[`${column.field}-width`] = el;
                        }}
                        sx={{ width: 100 }}
                        inputProps={{ min: 40 }}
                        data-testid={`width-${column.field}`}
                      />
                    </TableCell>


                    <TableCell align="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!column.visible}
                            onChange={(e) => handleVisibilityChange(column.field, e.target.checked)}
                            inputRef={(el) => {
                              if (el) checkboxRefs.current[`${column.field}-visible`] = el;
                            }}
                            data-testid={`visible-${column.field}`}
                          />
                        }
                        label=""
                      />
                    </TableCell>


                    <TableCell align="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!column.filterable}
                            onChange={(e) => handleFilterableChange(column.field, e.target.checked)}
                            disabled={!column.visible}
                            inputRef={(el) => {
                              if (el) checkboxRefs.current[`${column.field}-filterable`] = el;
                            }}
                            data-testid={`filterable-${column.field}`}
                          />
                        }
                        label=""
                      />
                    </TableCell>


                    <TableCell align="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!column.sortable}
                            onChange={(e) => handleSortableChange(column.field, e.target.checked)}
                            disabled={!column.visible}
                            inputRef={(el) => {
                              if (el) checkboxRefs.current[`${column.field}-sortable`] = el;
                            }}
                            data-testid={`sortable-${column.field}`}
                          />
                        }
                        label=""
                      />
                    </TableCell>


                    <TableCell align="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={column.pinned === "left"}
                            onChange={(e) => handlePinnedChange(column.field, e.target.checked)}
                            disabled={!column.visible}
                            inputRef={(el) => {
                              if (el) checkboxRefs.current[`${column.field}-pinned`] = el;
                            }}
                            data-testid={`pinned-${column.field}`}
                          />
                        }
                        label=""
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>


      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="contained" onClick={handleSubmit}>
            {isUpdateMode ? "UPDATE" : "SUBMIT"}
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            CANCEL
          </Button>
        </Stack>


        <Button
          variant={showPreview ? "contained" : "outlined"}
          onClick={() => setShowPreview(!showPreview)}
          startIcon={showPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
          sx={{ minWidth: 120 }}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </Box>


      {saveStatus && (
        <Alert severity={saveStatus.startsWith("Error") ? "error" : "success"} sx={{ mt: 2 }}>
          {saveStatus}
        </Alert>
      )}


      {showPreview && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Data-Grid Preview - Live Configuration
          </Typography>
          {serverError && (
            <Typography color="error" sx={{ mb: 1 }}>
              {serverError}
            </Typography>
          )}
          {loadingRows && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Loading…
            </Typography>
          )}
          <TableDataGeneric
            key={tableKey}
            tableName={tablename}
            heading={tableheading}
            data={rows}
            sortname={"name"}
            showActions={false}
            CardData={[]}
            hideToolbar={true}
            configss={columns}
            config={liveTableConfig}
            Route="/organization/employee/employee-details"
            token={typeof window !== "undefined" ? localStorage.getItem("token") : undefined}
            onSortChange={(field, direction) => setSortModel({ field, direction })}
            onFilterChange={(nextFilters) => setFilterModel(nextFilters)}
            onConfigChange={handleTableConfigChange}
            onColumnWidthChange={handleColumnWidthChange}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </Box>
      )}
    </Box>
  );
};


export default TableConfigForm;



