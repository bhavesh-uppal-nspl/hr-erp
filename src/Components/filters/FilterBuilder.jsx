import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterRow from './FilterRow';
import FilterPicker from './FilterPicker';
import FilterService from './FilterService';
import { getOperatorsForFieldType } from './operators';
import { Filter, X, Save } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * FilterBuilder Component
 * Main component for building and managing filters based on SystemMetadataController
 */
function FilterBuilder({
  module,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  showApplyButton = true,
  showClearButton = true,
  initialFilters = [],
}) {
  const [metadataFields, setMetadataFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const hasInitializedRef = React.useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync filters with initialFilters on mount
  // This handles both immediate and async loading scenarios
  useEffect(() => {
    if (!hasInitializedRef.current && initialFilters && Array.isArray(initialFilters)) {
      // Remove logic field from filters
      const filtersWithoutLogic = initialFilters.map((filter) => {
        const { logic, ...filterWithoutLogic } = filter;
        return filterWithoutLogic;
      });
      setFilters(filtersWithoutLogic);
      hasInitializedRef.current = true;
    }
  }, [initialFilters]);

  // Computed values
  const canAddMore = useMemo(
    () => filters.length < metadataFields.length,
    [filters.length, metadataFields.length]
  );
  
  const allFieldsUsed = useMemo(
    () => filters.length >= metadataFields.length && metadataFields.length > 0,
    [filters.length, metadataFields.length]
  );

  // Load metadata on mount or when module changes
  useEffect(() => {
    if (!module) {
      setError('Module is required');
      setLoading(false);
      return;
    }

    const loadMetadata = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await FilterService.getFilterMetadata(module);
        
        if (result.success) {
          const sortedFields = [...result.fields].sort(
            (a, b) => (a.filter_order || 0) - (b.filter_order || 0)
          );
          setMetadataFields(sortedFields);
        } else {
          setError(result.error || 'Failed to load filter metadata');
        }
      } catch (err) {
        setError(err.message || 'Failed to load filter metadata');
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, [module]);

  // Notify parent when filters change
  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  // Handlers with useCallback for performance
  const handleAddFilter = useCallback(() => {
    // Show filter picker
    setShowFilterPicker(true);
  }, []);

  // Handle field selection from filter picker
  const handleFieldSelect = useCallback((field) => {
    // Check if field is already in filters
    const isAlreadyAdded = filters.some(f => f.field === field.field_key);
    
    if (isAlreadyAdded) {
      // Remove the field if it's already selected (toggle off)
      setFilters(prev => prev.filter(f => f.field !== field.field_key));
      return;
    }

    // Add the field if it's not selected (toggle on)
    const operators = getOperatorsForFieldType(
      field.field_type,
      field.allowed_operators
    );
    const defaultOperator = field.default_operator || operators[0]?.value || 'equals';

    setFilters(prev => [...prev, {
      field: field.field_key,
      operator: defaultOperator,
      value: '',
    }]);

    // Keep filter picker open to allow multiple selections
  }, [filters]);

  const handleFilterChange = useCallback((index, updatedFilter) => {
    setFilters(prev => {
      const newFilters = [...prev];
      // Remove logic field from updated filter
      const { logic, ...filterWithoutLogic } = updatedFilter;
      newFilters[index] = filterWithoutLogic;
      return newFilters;
    });
  }, []);

  const handleDeleteFilter = useCallback((index) => {
    setFilters(prev => {
      const newFilters = prev.filter((_, i) => i !== index);
      return newFilters;
    });
  }, []);

  const handleApplyFilters = useCallback(() => {
    onApplyFilters?.(filters);
  }, [onApplyFilters, filters]);

  const handleClearFilters = useCallback(() => {
    setFilters([]);
    onClearFilters?.();
  }, [onClearFilters]);

  const handleSaveView = useCallback(() => {
    // Navigate to personalize-view by appending to current path
    const personalizePath = `${location.pathname}/personalize-view`;
    navigate(personalizePath);
  }, [navigate, location.pathname]);

  // Check if we're already on personalize-view route
  const isOnPersonalizeView = location.pathname.includes('/personalize-view');

  // Get selected field keys for filter picker (must be before early returns)
  const selectedFieldKeys = useMemo(() => {
    return filters.map(f => f.field);
  }, [filters]);

  // Early returns for loading/error states
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (metadataFields.length === 0) {
    return (
      <Alert severity="info">No filterable fields available for this module.</Alert>
    );
  }

  // Button styles
  const applyButtonStyles = {
    backgroundColor: 'primary',
    color: 'white',
    '&:hover': { backgroundColor: 'royal-blue' },
  };

  const clearButtonStyles = {
    color: 'secondary',
    borderColor: 'secondary',
    '&:hover': { borderColor: 'primary', color: 'primary' },
  };

  return (
    <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: 400 }}>
      {/* Show filter picker when adding filter */}
      {showFilterPicker ? (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 300 }}>
          {/* Sticky Header */}
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              backgroundColor: 'background.paper',
              pb: 2,
              pt: 2,
              px: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 300 }}>
                Select Filters
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => {
                    setShowFilterPicker(false);
                    setSearchQuery('');
                  }}
                  variant="outlined"
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setShowFilterPicker(false);
                    setSearchQuery('');
                  }}
                  variant="contained"
                  sx={{ minWidth: 'auto', px: 2 }}
                  disabled={filters.length === 0}
                >
                  Done
                </Button>
              </Box>
            </Box>
            {/* Search Bar */}
            <TextField
              fullWidth
              size="small"
              placeholder="Search fields..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      edge="end"
                    >
                      ×
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {/* Scrollable Content */}
          <Box sx={{ flex: 1, overflow: 'auto', px: 2, pb: 2 }}>
            <FilterPicker
              module={module}
              onFieldSelect={handleFieldSelect}
              selectedFields={selectedFieldKeys}
              searchQuery={searchQuery}
            />
          </Box>
        </Box>
      ) : (
        <>
          {filters.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No filters added. Click "Add Filter" to start filtering.
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddFilter}
                variant="outlined"
                size="small"
                disabled={!canAddMore}
                sx={{ maxWidth: 150 }}
              >
                Add Filter
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, pt: 2 }}>
              {filters.map((filter, index) => (
                <Box key={`${filter.field}-${index}`} sx={{ mb: 1 }}>
                  <FilterRow
                    filter={filter}
                    metadataFields={metadataFields}
                    onChange={(updatedFilter) => handleFilterChange(index, updatedFilter)}
                    onDelete={handleDeleteFilter}
                    index={index}
                    isLastRow={index === filters.length - 1}
                    onAddFilter={handleAddFilter}
                    canAddMore={canAddMore}
                  />
                </Box>
              ))}
              {allFieldsUsed && (
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    All available fields are being used. Delete a filter to add a new one.
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          <Divider sx={{ mb: 2, mt: 1 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
            {showApplyButton && onApplyFilters && (
              <Button
                onClick={handleApplyFilters}
                variant="contained"
                title="Apply all filters"
                sx={applyButtonStyles}
                startIcon={<Filter size={16} />}
              >
                Apply Filters
              </Button>
            )}
            {showClearButton && (
              <Button
                onClick={handleClearFilters}
                variant="outlined"
                title="Remove all filters"
                sx={clearButtonStyles}
                startIcon={<X size={16} />}
              >
                Clear All Filters
              </Button>
            )}
            {!isOnPersonalizeView && (
              <Button
                onClick={handleSaveView}
                variant="outlined"
                title="Save view and personalize data grid"
                sx={{
                  color: 'primary',
                  borderColor: 'primary',
                  '&:hover': { borderColor: 'primary', backgroundColor: 'primary.main', color: 'white' },
                }}
                startIcon={<Save size={16} />}
              >
                Save View
              </Button>
            )}
          </Box>
        </>
      )}
    </Paper>
  );
}

export default FilterBuilder;

