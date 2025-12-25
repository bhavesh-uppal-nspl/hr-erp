import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import {
  X,
  RefreshCw,
  Search,
  GripVertical,
  Pin,
  PinOff,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MAIN_URL } from "../../Configurations/Urls";
import { FilterBuilder } from "../filters";

const PersonalizeDataGrid = ({
  dataApi,
  data: propData,
  contextId,
  tableName,
  orgId,
  organizationUserId,
  userData,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Consolidated state
  const [columns, setColumns] = useState([]);
  const [defaultColumns, setDefaultColumns] = useState([]); // Single source of truth for defaults
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [autoSaveState, setAutoSaveState] = useState("idle");
  const [configSource, setConfigSource] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // Refs
  const saveTimeout = useRef(null);
  const isInitialLoad = useRef(true);
  const isMountedRef = useRef(true);
  const orgEntityId = userData?.organization_entity_id || null;

  // Map columns with metadata
  const mapColumnsWithMeta = useCallback(
    (cols = []) =>
      cols.map((col, index) => ({
        ...col,
        key: col.key || col.field,
        required: col.mandatory || col.required || false,
        order: col.order ?? index,
        pinned: col.pinned === "left" ? "left" : undefined, // Normalize pinned value
      })),
    []
  );

  // Generate columns from data
  const generateColumnsFromData = useCallback((dataArray) => {
    if (!dataArray?.length) return [];

    const sampleRow = dataArray[0];
    const keys = Object.keys(sampleRow);

    return keys.map((key, index) => ({
      key,
      label: key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      visible: index <= 4 && index !== 0,
      pinned: undefined,
      width: 150,
      required: index === 1,
    }));
  }, []);

  // Load layout from backend
  const loadLayoutFromBackend = useCallback(async () => {
    if (!orgId || !tableName) {
      console.warn("Missing orgId or tableName");
      setIsLoadingConfig(false);
      return null;
    }

    const datagridKey = `${tableName}_grid_${orgId}`;

    try {
      const requestPayload = {
        datagrid_key: datagridKey,
        organization_id: orgId,
      };

      if (organizationUserId) {
        requestPayload.organization_user_id = organizationUserId;
      }

      const response = await fetch(`${MAIN_URL}/api/datagrid/get-by-context`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(requestPayload),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        if (responseData.datagrid?.datagrid_default_configuration) {
          const config = responseData.datagrid.datagrid_default_configuration;
          setConfigSource(responseData.type);
          console.log("✓ Loaded backend config:", config.columns?.length, "columns");
          return config;
        }
      } else if (response.status === 404) {
        console.log("No saved layout found, using defaults");
      }

      setConfigSource(null);
      return null;
    } catch (error) {
      console.error("Error loading layout:", error);
      setConfigSource(null);
      return null;
    } finally {
      setIsLoadingConfig(false);
    }
  }, [orgId, tableName, token, organizationUserId]);

  // Build layout data for saving
  const buildLayoutData = useCallback(
    (columnSnapshot, filtersSnapshot = []) => ({
      columns: columnSnapshot.map((col, index) => ({
        key: col.key,
        label: col.label,
        width: col.width,
        visible: col.visible,
        pinned: col.pinned || undefined, // Use undefined instead of false
        order: index,
        required: col.required,
      })),
      filters: filtersSnapshot || [],
      timestamp: new Date().toISOString(),
    }),
    []
  );

  // Save layout to backend
  const saveLayoutToBackend = useCallback(
    async (layoutData) => {
      if (!orgId || !isMountedRef.current) {
        console.error("Cannot save: missing orgId or unmounted");
        return false;
      }

      const payload = {
        organization_id: orgId,
        organization_entity_id: orgEntityId,
        datagrid_key: `${tableName}_grid_${orgId}`,
        datagrid_default_configuration: layoutData,
      };

      if (organizationUserId) {
        payload.organization_user_id = organizationUserId;
      }

      try {
        const response = await fetch(`${MAIN_URL}/api/organization-datagrids`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Save failed: ${response.status}`);
        }

        console.log("✓ Layout saved");
        if (isMountedRef.current) {
          setAutoSaveState("saved");
          setConfigSource(organizationUserId ? "organization_user" : "organization");
        }

        return true;
      } catch (error) {
        console.error("Save error:", error);
        setAutoSaveState("error");
        throw error;
      }
    },
    [orgId, orgEntityId, tableName, token, organizationUserId]
  );

  // Reset layout
  const resetLayoutToDefault = useCallback(async () => {
    if (!orgId) {
      console.error("Cannot reset: missing orgId");
      return;
    }

    try {
      const datagridKey = `${tableName}_grid_${orgId}`;
      const params = new URLSearchParams({
        datagrid_key: datagridKey,
        organization_id: orgId.toString(),
      });

      if (organizationUserId && configSource === "organization_user") {
        params.append("organization_user_id", organizationUserId.toString());
      }

      const response = await fetch(
        `${MAIN_URL}/api/datagrid/get-by-context?${params.toString()}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Reset failed: ${response.status}`);
      }

      console.log("✓ Layout reset");
      
      // Reset to default columns
      const resetColumns = mapColumnsWithMeta(defaultColumns);
      setColumns(resetColumns);
      // Reset filters as well
      setFilters([]);
      setAutoSaveState("saved");
      
      // Reload from backend
      isInitialLoad.current = true;
      await loadLayoutFromBackend();

      return true;
    } catch (error) {
      console.error("Reset error:", error);
      setAutoSaveState("error");
      throw error;
    }
  }, [
    orgId,
    token,
    tableName,
    organizationUserId,
    configSource,
    defaultColumns,
    loadLayoutFromBackend,
    mapColumnsWithMeta,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  // Fetch data from API or use propData
  useEffect(() => {
    const fetchData = async () => {
      // Use propData if available
      if (propData?.length > 0) {
        console.log("Using propData:", propData.length, "records");
        setData(propData);
        const generatedColumns = generateColumnsFromData(propData);
        setDefaultColumns(generatedColumns);
        return;
      }

      // Otherwise fetch from API
      if (dataApi) {
        setLoading(true);
        setError(null);

        try {
          console.log("Fetching from API:", dataApi);
          const response = await axios.get(dataApi, {
            params: contextId ? { context: contextId } : {},
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          });

          const fetchedData = response.data.data || response.data || [];
          console.log("✓ Fetched:", fetchedData.length, "records");
          setData(fetchedData);

          const generatedColumns = generateColumnsFromData(fetchedData);
          setDefaultColumns(generatedColumns);
        } catch (err) {
          setError(err.message || "Failed to fetch data");
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dataApi, propData, contextId, token, generateColumnsFromData]);

  // Initialize layout: load backend config and apply
  useEffect(() => {
    const initializeLayout = async () => {
      if (defaultColumns.length === 0) return;

      console.log("Initializing layout...");
      const config = await loadLayoutFromBackend();

      if (config?.columns?.length > 0) {
        console.log("Applying backend config");
        setColumns(mapColumnsWithMeta(config.columns));
        
        // Load filters if they exist in the config
        if (config.filters && Array.isArray(config.filters) && config.filters.length > 0) {
          console.log("Loading saved filters:", config.filters.length);
          setFilters(config.filters);
        }
      } else {
        console.log("Using default columns");
        setColumns(mapColumnsWithMeta(defaultColumns));
      }
      
      // Mark filters as loaded (even if empty) so FilterBuilder knows it can initialize
      setFiltersLoaded(true);
    };

    initializeLayout();
  }, [defaultColumns, loadLayoutFromBackend, mapColumnsWithMeta]);

  // Auto-save when columns change (debounced)
  useEffect(() => {
    if (columns.length === 0 || isLoadingConfig) {
      return;
    }

    // Skip initial load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Clear existing timeout
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    // Debounced save
    saveTimeout.current = setTimeout(() => {
      if (!isMountedRef.current) return;

      const layoutData = buildLayoutData(columns, filters);
      console.log("Auto-saving...");
      setAutoSaveState("saving");

      saveLayoutToBackend(layoutData).catch((error) => {
        console.error("Auto-save failed:", error);
        setAutoSaveState("error");
      });
    }, 700);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [columns, filters, isLoadingConfig, saveLayoutToBackend, buildLayoutData]);

  // Computed values
  const filteredColumns = useMemo(() => {
    if (!searchQuery.trim()) return columns;
    const query = searchQuery.toLowerCase();
    return columns.filter(
      (col) =>
        col.label.toLowerCase().includes(query) ||
        col.key.toLowerCase().includes(query)
    );
  }, [columns, searchQuery]);

  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible),
    [columns]
  );

  const hiddenColumns = useMemo(
    () => columns.filter((col) => !col.visible),
    [columns]
  );

  const allNonMandatoryVisible = useMemo(() => {
    const nonMandatory = columns.filter((col) => !col.required);
    return nonMandatory.length > 0 && nonMandatory.every((col) => col.visible);
  }, [columns]);

  // Event handlers
  const toggleColumnVisibility = useCallback((key) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key && !col.required
          ? { ...col, visible: !col.visible }
          : col
      )
    );
  }, []);

  // FIXED: Simplified pin toggle logic
  const toggleColumnPin = useCallback((key) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key
          ? { ...col, pinned: col.pinned === "left" ? undefined : "left" }
          : col
      )
    );
  }, []);

  const handleDragStart = useCallback((e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setColumns((prev) => {
      const newColumns = [...prev];
      const draggedColumn = newColumns[draggedIndex];
      newColumns.splice(draggedIndex, 1);
      newColumns.splice(index, 0, draggedColumn);
      return newColumns;
    });
    setDraggedIndex(index);
  }, [draggedIndex]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const handleSelectAll = useCallback((event) => {
    const isChecked = event.target.checked;
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        visible: col.required ? true : isChecked,
      }))
    );
  }, []);

  // Filter handlers
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    // Filters will be auto-saved via the useEffect that watches filters state
  }, []);

  const handleApplyFilters = useCallback((appliedFilters) => {
    // Update filters state (auto-save will handle saving)
    setFilters(appliedFilters);
    console.log("Filters applied:", appliedFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters([]);
    setFilteredData(data);
    // Clearing filters will trigger auto-save via the existing useEffect
  }, [data]);

  // Loading states
  if (loading || isLoadingConfig) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No data available</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3}}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {tableName
                ? `${tableName} - Personalization Mode`
                : "Personalization Mode"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Personalize your grid layout. All changes are saved automatically.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<X size={18} />}
            sx={{ textTransform: "none" }}
            onClick={() => navigate(-1)}
          >
            Exit Personalization
          </Button>
        </Box>
      </Paper>

      {/* Filter Builder Section */}
      {tableName && (
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Filters
          </Typography>
          {filtersLoaded && (
            <FilterBuilder
              key={`filter-builder-${tableName}-loaded`}
              module={tableName}
              onFiltersChange={handleFiltersChange}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              showApplyButton={false}
              showClearButton={true}
              initialFilters={filters}
            />
          )}
        </Paper>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "column" },
        }}
      >
        {/* Column Configuration Panel */}
        <Paper elevation={1} sx={{ p: 3, width: "100%" }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Fields / Columns
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Search columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={allNonMandatoryVisible}
                onChange={handleSelectAll}
              />
            }
            label={
              <Typography variant="body2" fontWeight={600}>
                Select All
              </Typography>
            }
            sx={{ mb: 2 }}
          />

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {/* Visible Columns */}
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography
                variant="subtitle2"
                color="success.main"
                fontWeight={600}
                gutterBottom
              >
                Visible Columns ({visibleColumns.length})
              </Typography>
              <Box>
                {filteredColumns
                  .filter((col) => col.visible)
                  .map((col) => {
                    const index = columns.findIndex((c) => c.key === col.key);
                    return (
                      <Box
                        key={col.key}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1.5,
                          mb: 1,
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                          cursor: "grab",
                          "&:active": { cursor: "grabbing" },
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <GripVertical size={16} color="#999" />
                        <Checkbox
                          checked={col.visible}
                          onChange={() => toggleColumnVisibility(col.key)}
                          disabled={col.required}
                          size="small"
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {col.label}
                          {col.required && (
                            <Chip
                              label="Required"
                              size="small"
                              color="error"
                              sx={{ ml: 1, height: 18, fontSize: "0.7rem" }}
                            />
                          )}
                        </Typography>
                        <Tooltip
                          title={
                            col.pinned === "left"
                              ? "Unpin column"
                              : "Pin column"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => toggleColumnPin(col.key)}
                            color={
                              col.pinned === "left" ? "primary" : "default"
                            }
                          >
                            {col.pinned === "left" ? (
                              <Pin size={16} />
                            ) : (
                              <PinOff size={16} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    );
                  })}
              </Box>
            </Box>

            {/* Hidden Columns */}
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontWeight={600}
                gutterBottom
              >
                Hidden Columns ({hiddenColumns.length})
              </Typography>
              <Box>
                {filteredColumns
                  .filter((col) => !col.visible)
                  .map((col) => (
                    <Box
                      key={col.key}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1.5,
                        mb: 1,
                        bgcolor: "action.hover",
                        borderRadius: 1,
                        opacity: 0.7,
                      }}
                    >
                      <Checkbox
                        checked={col.visible}
                        onChange={() => toggleColumnVisibility(col.key)}
                        size="small"
                      />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {col.label}
                      </Typography>
                      <EyeOff size={16} color="#999" />
                    </Box>
                  ))}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Toolbar */}
        <Paper elevation={1} sx={{ p: 2, mb: 1 }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<RefreshCw size={18} />}
              onClick={resetLayoutToDefault}
              sx={{ textTransform: "none" }}
            >
              Reset to Default
            </Button>

            <Box sx={{ flex: 1 }} />
            <Typography
              variant="caption"
              color={
                autoSaveState === "error"
                  ? "error.main"
                  : autoSaveState === "saving"
                    ? "text.secondary"
                    : autoSaveState === "saved"
                      ? "success.main"
                      : "text.secondary"
              }
            >
              {autoSaveState === "saving"
                ? "Saving changes..."
                : autoSaveState === "error"
                  ? "Save failed"
                  : autoSaveState === "saved"
                    ? "✓ All changes saved"
                    : ""}
            </Typography>
          </Box>
        </Paper>

        {/* Preview Table */}
        <Paper elevation={1} sx={{ overflow: "auto" }}>
          <Typography variant="h6" fontWeight="bold" sx={{ ml: 3, mt: 2 }}>
            Preview
          </Typography>
          <Box sx={{ minWidth: 800, p: 2 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 600,
              }}
            >
              <thead>
                <tr>
                  {filteredColumns.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        borderBottom: "2px solid #e0e0e0",
                        position: col.pinned === "left" ? "sticky" : "static",
                        left: col.pinned === "left" ? 0 : undefined,
                        background: col.visible ? "#fafafa" : "#f5f5f5",
                        fontWeight: 600,
                        fontSize: 13,
                        opacity: col.visible ? 1 : 0.4,
                        whiteSpace: "nowrap",
                        zIndex: col.pinned === "left" ? 10 : 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {col.label}
                        {!col.visible && <EyeOff size={12} />}
                        {col.pinned === "left" && <Pin size={12} />}
                      </Box>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {filteredColumns.map((col) => (
                      <td
                        key={col.key}
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #f0f0f0",
                          fontSize: 13,
                          opacity: col.visible ? 1 : 0.35,
                          position: col.pinned === "left" ? "sticky" : "static",
                          left: col.pinned === "left" ? 0 : undefined,
                          background: col.pinned === "left" ? "#fafafa" : "transparent",
                          zIndex: col.pinned === "left" ? 10 : 1,
                        }}
                      >
                        {String(row?.[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default PersonalizeDataGrid;
                         
