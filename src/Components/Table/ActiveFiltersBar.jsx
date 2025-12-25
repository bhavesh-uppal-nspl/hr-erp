import React, { useMemo } from 'react';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { operatorRequiresValue } from '../filters/operators';

/**
 * ActiveFiltersBar Component
 * Displays active filters as chips with close icons below the toolbar
 */
function ActiveFiltersBar({ configss = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get operator labels mapping
  const operatorLabels = {
    'equals': '=',
    'not_equals': '≠',
    'contains': 'contains',
    'not_contains': 'not contains',
    'starts_with': 'starts with',
    'ends_with': 'ends with',
    'greater_than': '>',
    'greater_than_or_equal': '≥',
    'less_than': '<',
    'less_than_or_equal': '≤',
    'in': 'in',
    'not_in': 'not in',
    'between': 'between',
    'not_between': 'not between',
    'is_null': 'is null',
    'is_not_null': 'is not null',
    'today': 'is today',
    'this_week': '-This week',
    'this_month': '-This month',
    'on': 'on',
    'date_equals': '=',
    'before': 'before',
    'date_before': 'before',
    'after': 'after',
    'date_after': 'after',
  };

  // Extract active filters from URL params
  const activeFilters = useMemo(() => {
    const filters = [];
    const processedFields = new Set();

    searchParams.forEach((value, key) => {
      // Skip operator params - they'll be processed with their field
      if (key.endsWith("_operator")) return;

      if (key.startsWith("filter_")) {
        const field = key.replace("filter_", "");

        // Skip if already processed
        if (processedFields.has(field)) return;
        processedFields.add(field);

        // Get operator from URL
        const operatorKey = `filter_${field}_operator`;
        const operator = searchParams.get(operatorKey) || 'contains';
        const requiresValue = operatorRequiresValue(operator);

        // For operators that don't require values, show filter even if value is empty
        // For operators that require values, only show if value exists
        if (!requiresValue || value) {
          // Get field label from configss
          const fieldConfig = configss.find(col => col.field === field);
          const fieldLabel = fieldConfig?.label || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

          // Format value for display
          let displayValue = value || '';
          if (operator === 'in' || operator === 'not_in') {
            displayValue = value ? value.split(',').map(v => v.trim()).join(', ') : '';
          } else if (operator === 'between' || operator === 'not_between') {
            displayValue = value ? value.split(',').map(v => v.trim()).join(' - ') : '';
          }

          filters.push({
            field,
            fieldLabel,
            operator,
            value: displayValue,
            operatorKey,
          });
        }
      }
    });

    return filters;
  }, [searchParams, configss]);

  // Handle removing a single filter
  const handleRemoveFilter = (field, operatorKey) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(`filter_${field}`);
    if (newSearchParams.has(operatorKey)) {
      newSearchParams.delete(operatorKey);
    }
    setSearchParams(newSearchParams, { replace: true });
  };

  // Handle removing all filters
  const handleClearAllFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    searchParams.forEach((value, key) => {
      if (key.startsWith("filter_")) {
        newSearchParams.delete(key);
      }
    });
    setSearchParams(newSearchParams, { replace: true });
  };

  // Don't render if no active filters
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 2,
        p: 1.5,
        backgroundColor: '#fafafa',
        
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            fontWeight: 500,
            mr: 1,
            fontSize: '0.875rem',
          }}
        >
          Active Filters:
        </Typography>
        {activeFilters.map((filter, index) => {
          // For operators that don't require values, don't show the value
          const requiresValue = operatorRequiresValue(filter.operator);
          const labelText = requiresValue 
            ? `${filter.fieldLabel} ${operatorLabels[filter.operator] || filter.operator} ${filter.value}`
            : `${filter.fieldLabel} ${operatorLabels[filter.operator] || filter.operator}`;
          
          return (
          <Chip
            key={`${filter.field}-${index}`}
            label={labelText}
            onDelete={() => handleRemoveFilter(filter.field, filter.operatorKey)}
            deleteIcon={<X size={16} />}
            sx={{
              backgroundColor: '#f5f5f5',
              color: 'text.primary',
              border:'1px solid #bcbcbc',
              '& .MuiChip-deleteIcon': {
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                },
              },
              '& .MuiChip-label': {
                px: 1.5,
                py: 0.5,
              },
            }}
          />
          );
        })}
        {activeFilters.length > 1 && (
          <Chip
            label="Clear All"
            onClick={handleClearAllFilters}
            sx={{
              backgroundColor: 'transparent',
              color: 'primary.main',
              border: '1px solid',
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
              },
            }}
          />
        )}
      </Box>
    </Paper>
  );
}

export default ActiveFiltersBar;

