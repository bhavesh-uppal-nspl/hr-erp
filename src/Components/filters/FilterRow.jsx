import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  IconButton,
  Grid,
  Autocomplete,
  Chip,
  Button,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  getOperatorsForFieldType,
  operatorRequiresValue,
  operatorRequiresMultipleValues,
  operatorSupportsMultiSelect,
  OPERATORS,
} from './operators';
import FilterService from './FilterService';

/**
 * Helper: Extract option label/value
 */
const getOptionValue = (option) => (typeof option === 'object' ? option.value : option);
const getOptionLabel = (option) => (typeof option === 'object' ? option.label : String(option));

/**
 * Helper: Get normalized array value
 */
const getArrayValue = (value, defaultValue = [null, null]) => 
  Array.isArray(value) ? value : defaultValue;

/**
 * FilterRow Component
 * Renders a single filter row with field, operator, and value inputs
 */
function FilterRow({ 
  filter, 
  metadataFields, 
  onChange, 
  onDelete, 
  index, 
  isLastRow = false, 
  onAddFilter, 
  canAddMore = true 
}) {
  const [lookupOptions, setLookupOptions] = useState([]);
  const [loadingLookup, setLoadingLookup] = useState(false);

  // Memoize selected field and operators
  const selectedField = useMemo(
    () => metadataFields.find(f => f.field_key === filter.field) || null,
    [metadataFields, filter.field]
  );

  const availableOperators = useMemo(
    () => selectedField
      ? getOperatorsForFieldType(selectedField.field_type, selectedField.allowed_operators)
      : [],
    [selectedField]
  );

  const requiresValue = useMemo(() => operatorRequiresValue(filter.operator), [filter.operator]);
  const requiresMultipleValues = useMemo(
    () => operatorRequiresMultipleValues(filter.operator), 
    [filter.operator]
  );
  const supportsMultiSelect = useMemo(
    () => selectedField && operatorSupportsMultiSelect(filter.operator, selectedField.field_type),
    [filter.operator, selectedField]
  );

  // Load lookup options for foreign_key and enum fields
  useEffect(() => {
    if (!selectedField || !requiresValue) {
      setLookupOptions([]);
      return;
    }

    const loadOptions = async () => {
      // Handle enum fields with predefined options
      if (selectedField.field_type === 'enum' && selectedField.enum_options) {
        // Ensure enum_options is an array (handle JSON string from backend)
        let options = selectedField.enum_options;
        if (typeof options === 'string') {
          try {
            options = JSON.parse(options);
          } catch (e) {
            console.error('Failed to parse enum_options:', e);
            options = [];
          }
        }
        setLookupOptions(Array.isArray(options) ? options : []);
        return;
      }

      // Handle foreign_key fields with API lookup
      if (selectedField.field_type === 'foreign_key' && selectedField.ui_options_api) {
        setLoadingLookup(true);
        try {
          const options = await FilterService.fetchLookupOptions(selectedField.ui_options_api);
          setLookupOptions(options);
        } catch (error) {
          console.error('Error loading lookup options:', error);
          setLookupOptions([]);
        } finally {
          setLoadingLookup(false);
        }
      } else {
        setLookupOptions([]);
      }
    };

    loadOptions();
  }, [selectedField, requiresValue]);

  // Handlers
  const handleFieldChange = (event) => {
    const newField = event.target.value;
    const newFieldMeta = metadataFields.find(f => f.field_key === newField);
    
    if (!newFieldMeta) {
      // If field metadata not found, reset operator
      onChange({
        ...filter,
        field: newField,
        operator: '',
        value: null,
      });
      return;
    }
    
    // Compute operators for the newly selected field
    const newOperators = getOperatorsForFieldType(newFieldMeta.field_type, newFieldMeta.allowed_operators);
    
    // Get default operator: try metadata default, then first available operator
    let defaultOperator = newFieldMeta.default_operator;
    
    // Validate that default operator exists in available operators
    if (defaultOperator) {
      const operatorExists = newOperators.some(op => op.value === defaultOperator);
      if (!operatorExists) {
        // Default operator is not in allowed operators, reset it
        defaultOperator = null;
      }
    }
    
    // If no default from metadata or it's invalid, use first available operator
    if (!defaultOperator && newOperators.length > 0) {
      // Find first operator with a valid (non-empty) value
      const firstValidOperator = newOperators.find(op => op && op.value && String(op.value).trim() !== '');
      defaultOperator = firstValidOperator?.value || newOperators[0]?.value || '';
    }
    
    // Compute value requirements based on the new operator
    const newRequiresValue = defaultOperator ? operatorRequiresValue(defaultOperator) : false;
    const newRequiresMultiple = defaultOperator ? operatorRequiresMultipleValues(defaultOperator) : false;
    const newSupportsMultiSelect = defaultOperator && newFieldMeta ? operatorSupportsMultiSelect(defaultOperator, newFieldMeta.field_type) : false;
    
    // For multi-select operators (Equals on foreign_key/enum), initialize as array
    const initialValue = newRequiresValue 
      ? (newRequiresMultiple || newSupportsMultiSelect ? [] : '') 
      : null;
    
    onChange({
      ...filter,
      field: newField,
      operator: defaultOperator || '',
      value: initialValue,
    });
  };

  const handleOperatorChange = (event) => {
    const newOperator = event.target.value;
    const newRequiresValue = operatorRequiresValue(newOperator);
    const newRequiresMultiple = operatorRequiresMultipleValues(newOperator);
    const newSupportsMultiSelect = selectedField && operatorSupportsMultiSelect(newOperator, selectedField.field_type);
    
    // For multi-select operators (Equals on foreign_key/enum), initialize as array
    const initialValue = newRequiresValue 
      ? (newRequiresMultiple || newSupportsMultiSelect ? [] : '') 
      : null;
    
    onChange({
      ...filter,
      operator: newOperator,
      value: initialValue,
    });
  };

  const handleValueChange = (newValue) => {
    onChange({ ...filter, value: newValue });
  };

  // Render multiple values input (IN, NOT_IN, BETWEEN)
  const renderMultipleValuesInput = () => {
    const { field_type } = selectedField;
    const currentValue = getArrayValue(filter.value);

    // Autocomplete for foreign_key/enum
    if (field_type === 'foreign_key' || field_type === 'enum') {
      // For foreign_key, store and match by label (name); for enum, use value
      const useLabelForValue = field_type === 'foreign_key';
      
      // Find options that match the stored values (by label for foreign_key, by value for enum)
      const getMatchingOptions = (storedValues) => {
        if (!Array.isArray(storedValues) || storedValues.length === 0) return [];
        return storedValues.map(stored => {
          if (useLabelForValue) {
            // Try to match by label first (new format)
            let found = lookupOptions.find(opt => getOptionLabel(opt) === stored);
            // If not found and stored value is numeric, try matching by ID (backward compatibility)
            if (!found && (typeof stored === 'number' || (typeof stored === 'string' && /^\d+$/.test(stored)))) {
              found = lookupOptions.find(opt => getOptionValue(opt) == stored);
            }
            return found || stored;
          } else {
            return lookupOptions.find(opt => getOptionValue(opt) === stored) || stored;
          }
        });
      };

      return (
        <Autocomplete
          multiple
          size="small"
          options={Array.isArray(lookupOptions) ? lookupOptions : []}
          getOptionLabel={getOptionLabel}
          value={getMatchingOptions(filter.value || [])}
          onChange={(event, newValue) => {
            // Store label for foreign_key, value for enum
            const valuesToStore = newValue.map(opt => 
              useLabelForValue ? getOptionLabel(opt) : getOptionValue(opt)
            );
            handleValueChange(valuesToStore);
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select values" disabled={loadingLookup} />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, idx) => {
              const label = typeof option === 'object' ? getOptionLabel(option) : String(option);
              return (
                <Chip
                  {...getTagProps({ index: idx })}
                  key={idx}
                  label={label}
                />
              );
            })
          }
        />
      );
    }

    // Date range picker
    if (field_type === 'date') {
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <DatePicker
              label="From"
              value={currentValue[0] || null}
              onChange={(date) => handleValueChange([date, currentValue[1]])}
              format="dd/MM/yyyy"
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
            <DatePicker
              label="To"
              value={currentValue[1] || null}
              onChange={(date) => handleValueChange([currentValue[0], date])}
              format="dd/MM/yyyy"
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </Box>
        </LocalizationProvider>
      );
    }

    // Number range input
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          type="number"
          size="small"
          label="From"
          value={currentValue[0] ?? ''}
          onChange={(e) => handleValueChange([e.target.value, currentValue[1]])}
          fullWidth
        />
        <TextField
          type="number"
          size="small"
          label="To"
          value={currentValue[1] ?? ''}
          onChange={(e) => handleValueChange([currentValue[0], e.target.value])}
          fullWidth
        />
      </Box>
    );
  };

  // Render single value input
  const renderSingleValueInput = () => {
    const { ui_type, field_type } = selectedField;
    
    // Check if multi-select is enabled for Equals operator
    const isMultiSelect = filter.operator === OPERATORS.EQUALS && supportsMultiSelect;
    
    // Convert value to array if it's not already (for multi-select)
    const currentValues = isMultiSelect 
      ? (Array.isArray(filter.value) ? filter.value : (filter.value !== null && filter.value !== undefined && filter.value !== '' ? [filter.value] : []))
      : null;

    // Date picker - single select only (no multi-select for dates)
    if (ui_type === 'date') {
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
          <DatePicker
            value={filter.value || null}
            onChange={handleValueChange}
            format="dd/MM/yyyy"
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </LocalizationProvider>
      );
    }

    // Number input - multi-select support
    if (ui_type === 'number') {
      if (isMultiSelect) {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {currentValues.map((num, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  type="number"
                  size="small"
                  label={`Value ${index + 1}`}
                  value={num || ''}
                  onChange={(e) => {
                    const newValues = [...currentValues];
                    newValues[index] = e.target.value;
                    handleValueChange(newValues);
                  }}
                  fullWidth
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    const newValues = currentValues.filter((_, i) => i !== index);
                    handleValueChange(newValues.length > 0 ? newValues : []);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleValueChange([...currentValues, ''])}
              startIcon={<AddIcon />}
            >
              Add Value
            </Button>
          </Box>
        );
      }
      return (
        <TextField
          type="number"
          size="small"
          value={filter.value || ''}
          onChange={(e) => handleValueChange(e.target.value)}
          fullWidth
        />
      );
    }

    // Boolean/Checkbox - multi-select support
    if (ui_type === 'checkbox') {
      if (isMultiSelect) {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {currentValues.map((bool, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <FormControl fullWidth size="small">
                  <Select
                    value={bool ?? ''}
                    onChange={(e) => {
                      const newValues = [...currentValues];
                      newValues[index] = e.target.value === 'true' || e.target.value === true;
                      handleValueChange(newValues);
                    }}
                  >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                  </Select>
                </FormControl>
                <IconButton
                  size="small"
                  onClick={() => {
                    const newValues = currentValues.filter((_, i) => i !== index);
                    handleValueChange(newValues.length > 0 ? newValues : []);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleValueChange([...currentValues, null])}
              startIcon={<AddIcon />}
            >
              Add Value
            </Button>
          </Box>
        );
      }
      return (
        <FormControl fullWidth size="small">
          <Select
            value={filter.value ?? ''}
            onChange={(e) => handleValueChange(e.target.value === 'true' || e.target.value === true)}
          >
            <MenuItem value={true}>True</MenuItem>
            <MenuItem value={false}>False</MenuItem>
          </Select>
        </FormControl>
      );
    }

    // Autocomplete for foreign_key/enum select
    if (ui_type === 'select' && (field_type === 'foreign_key' || field_type === 'enum')) {
      // For foreign_key, store and match by label (name); for enum, use value
      const useLabelForValue = field_type === 'foreign_key';
      
      // Check if this operator supports multi-select (Equals for foreign_key/enum)
      const isMultiSelect = filter.operator === OPERATORS.EQUALS && supportsMultiSelect;
      
      if (isMultiSelect) {
        // Multi-select mode for Equals operator
        const getMatchingOptions = (storedValues) => {
          if (!Array.isArray(storedValues) || storedValues.length === 0) return [];
          return storedValues.map(stored => {
            if (useLabelForValue) {
              // Try to match by label first (new format)
              let found = lookupOptions.find(opt => getOptionLabel(opt) === stored);
              // If not found and stored value is numeric, try matching by ID (backward compatibility)
              if (!found && (typeof stored === 'number' || (typeof stored === 'string' && /^\d+$/.test(stored)))) {
                found = lookupOptions.find(opt => getOptionValue(opt) == stored);
              }
              return found || stored;
            } else {
              return lookupOptions.find(opt => getOptionValue(opt) === stored) || stored;
            }
          });
        };

        return (
          <Autocomplete
            multiple
            size="small"
            options={Array.isArray(lookupOptions) ? lookupOptions : []}
            getOptionLabel={getOptionLabel}
            value={getMatchingOptions(Array.isArray(filter.value) ? filter.value : (filter.value ? [filter.value] : []))}
            onChange={(event, newValue) => {
              // Store label for foreign_key, value for enum
              const valuesToStore = newValue.map(opt => 
                useLabelForValue ? getOptionLabel(opt) : getOptionValue(opt)
              );
              handleValueChange(valuesToStore);
            }}
            loading={loadingLookup}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select values" disabled={loadingLookup} />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, idx) => {
                const label = typeof option === 'object' ? getOptionLabel(option) : String(option);
                return (
                  <Chip
                    {...getTagProps({ index: idx })}
                    key={idx}
                    label={label}
                  />
                );
              })
            }
          />
        );
      } else {
        // Single-select mode
        const findMatchingOption = (storedValue) => {
          if (!storedValue) return null;
          if (useLabelForValue) {
            // Try to match by label first (new format)
            let found = lookupOptions.find(opt => getOptionLabel(opt) === storedValue);
            // If not found and stored value is numeric, try matching by ID (backward compatibility)
            if (!found && (typeof storedValue === 'number' || (typeof storedValue === 'string' && /^\d+$/.test(storedValue)))) {
              found = lookupOptions.find(opt => getOptionValue(opt) == storedValue);
            }
            return found || null;
          } else {
            return lookupOptions.find(opt => getOptionValue(opt) === storedValue) || null;
          }
        };

        return (
          <Autocomplete
            size="small"
            options={Array.isArray(lookupOptions) ? lookupOptions : []}
            getOptionLabel={getOptionLabel}
            value={findMatchingOption(filter.value)}
            onChange={(event, newValue) => {
              // Store label for foreign_key, value for enum
              const valueToStore = newValue 
                ? (useLabelForValue ? getOptionLabel(newValue) : getOptionValue(newValue))
                : null;
              handleValueChange(valueToStore);
            }}
            loading={loadingLookup}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select value" disabled={loadingLookup} />
            )}
          />
        );
      }
    }

    // Default text input - multi-select support
    if (isMultiSelect) {
      return (
        <Autocomplete
          multiple
          freeSolo
          size="small"
          options={[]}
          value={currentValues}
          onChange={(event, newValue) => {
            handleValueChange(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Enter values (add multiple)" />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, idx) => (
              <Chip
                {...getTagProps({ index: idx })}
                key={idx}
                label={String(option)}
              />
            ))
          }
        />
      );
    }
    
    return (
      <TextField
        size="small"
        value={filter.value || ''}
        onChange={(e) => handleValueChange(e.target.value)}
        fullWidth
        placeholder="Enter value"
      />
    );
  };

  const renderValueInput = () => {
    if (!requiresValue) return null;
    if (!selectedField) {
      return <TextField fullWidth size="small" placeholder="Select field first" disabled />;
    }
    return requiresMultipleValues ? renderMultipleValuesInput() : renderSingleValueInput();
  };

  const formControlProps = { size: 'small', sx: { width: 200 } };
  const selectProps = { sx: { minWidth: 150 } };

  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
      {/* Field Select */}
      <Grid item xs={12} sm="auto">
        <FormControl {...formControlProps}>
          <InputLabel>Field</InputLabel>
          <Select
            value={filter.field || ''}
            onChange={handleFieldChange}
            label="Field"
            {...selectProps}
          >
            {metadataFields.map((field) => (
              <MenuItem key={field.field_key} value={field.field_key}>
                {field.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Operator Select */}
      <Grid item xs={12} sm="auto">
        <FormControl {...formControlProps}>
          <InputLabel>Operator</InputLabel>
          <Select
            value={filter.operator || ''}
            onChange={handleOperatorChange}
            label="Operator"
            disabled={!selectedField || availableOperators.length === 0}
            {...selectProps}
            displayEmpty
          >
            {availableOperators.length === 0 ? (
              <MenuItem value="" disabled>No operators available</MenuItem>
            ) : (
              availableOperators.map((op) => (
                <MenuItem 
                  key={op.value} 
                  value={op.value}
                  title={op.tooltip || ''}
                >
                  {op.label}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Grid>

      {/* Value Input */}
      <Grid item xs={12} sm="auto" sx={{ width: 220}}>
        {renderValueInput()}
      </Grid>

      {/* Actions */}
      <Grid item xs={12} sm="auto">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="error" onClick={() => onDelete(index)} size="small">
            <DeleteIcon />
          </IconButton>
          {isLastRow && onAddFilter && (
            <Button
              startIcon={<AddIcon />}
              onClick={onAddFilter}
              variant="outlined"
              size="small"
              disabled={!canAddMore}
            >
              Add Filter
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default FilterRow;

