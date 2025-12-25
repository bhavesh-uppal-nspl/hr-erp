import axios from 'axios';
import { MAIN_URL } from '../../Configurations/Urls';
import toast from 'react-hot-toast';
import useAuthStore from '../../Zustand/Store/useAuthStore';
import { operatorRequiresValue, OPERATORS } from './operators';

/**
 * Dynamic Filter Service for SystemMetadataController
 * Fully aligned with backend API structure
 */

// ============================================================================
// Authentication & Error Handling
// ============================================================================

/**
 * Get authentication headers with token
 */
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

/**
 * Handle authentication errors (401) - redirect to login
 */
const handleAuthError = () => {
  toast.error('Session Expired!');
  useAuthStore.getState().logout?.();
  window.location.href = '/login';
};

/**
 * Extract error message from axios error response
 * @param {Object} error - Axios error object
 * @param {string} defaultMessage - Fallback message
 */
const extractErrorMessage = (error, defaultMessage = 'An error occurred') => {
  if (!error.response) {
    return `Network error: Cannot connect to backend at ${MAIN_URL}`;
  }

  const { status, data } = error.response;
  return data?.error || data?.details || data?.message || `${defaultMessage} (Status: ${status})`;
};

// ============================================================================
// Organization Context Helper
// ============================================================================

/**
 * Get current organization ID from auth store
 */
const getOrganizationId = () => {
  try {
    const authStore = useAuthStore.getState();
    return authStore?.userData?.organization?.organization_id || null;
  } catch (e) {
    console.warn('Could not access auth store for organization ID:', e);
    return null;
  }
};

// ============================================================================
// Lookup URL Processing (for Foreign Key fields)
// ============================================================================

/**
 * Process lookup API URL with organization context and query params
 * @param {string} apiUrl - Raw API URL from metadata (ui_options_api)
 */
const processLookupUrl = (apiUrl) => {
  if (!apiUrl) return null;

  const orgId = getOrganizationId();
  let processedUrl = apiUrl;

  // Replace {org_id} placeholder if present
  if (orgId) {
    if (apiUrl.includes('{org_id}')) {
      processedUrl = apiUrl.replace(/{org_id}/g, orgId);
    } else if (apiUrl.includes('/organizations/') && !apiUrl.match(/\/organizations\/\d+/)) {
      processedUrl = apiUrl.replace('/organizations/', `/organizations/${orgId}/`);
    }
  }

  // Build full URL if not already absolute
  const fullUrl = processedUrl.startsWith('http')
    ? processedUrl
    : `${MAIN_URL}${processedUrl.startsWith('/') ? processedUrl : '/' + processedUrl}`;

  // Add per_page=all to get all options
  try {
    const urlObj = new URL(fullUrl);
    if (!urlObj.searchParams.has('per_page')) {
      urlObj.searchParams.set('per_page', 'all');
    }
    return urlObj.toString();
  } catch (e) {
    const separator = fullUrl.includes('?') ? '&' : '?';
    return `${fullUrl}${separator}per_page=all`;
  }
};

// ============================================================================
// Response Data Extraction (Dynamic)
// ============================================================================

/**
 * Dynamically extract array data from various API response formats
 * Handles: paginated, nested, direct arrays, and keyed responses
 */
const extractResponseArray = (responseData) => {
  if (!responseData) return [];
  if (Array.isArray(responseData)) return responseData;

  // Handle standard Laravel pagination format
  if (responseData.data) {
    // Nested pagination: { data: { data: [...] } }
    if (responseData.data?.data && Array.isArray(responseData.data.data)) {
      return responseData.data.data;
    }
    // Simple: { data: [...] }
    if (Array.isArray(responseData.data)) {
      return responseData.data;
    }
  }

  // Search for first array property dynamically
  for (const key of Object.keys(responseData)) {
    const value = responseData[key];
    if (Array.isArray(value)) {
      return value;
    }
    // Handle nested: { SomeKey: { data: [...] } }
    if (value && typeof value === 'object' && Array.isArray(value.data)) {
      return value.data;
    }
  }

  return [];
};

/**
 * Dynamically find the ID field from an item
 * Priority: fields ending with _id > id/value/key > first numeric field
 */
const findIdField = (item) => {
  if (!item || typeof item !== 'object') return null;
  const keys = Object.keys(item);

  // Priority 1: Fields ending with '_id' (prefer more specific, longer names)
  const idFields = keys
    .filter((key) => key.endsWith('_id'))
    .sort((a, b) => b.length - a.length);
  if (idFields.length > 0) return idFields[0];

  // Priority 2: Common ID field names
  const commonFields = ['id', 'value', 'key', 'identifier'];
  const found = commonFields.find((f) => item[f] !== undefined);
  if (found) return found;

  // Priority 3: First numeric-like field
  const numericField = keys.find((key) => {
    const val = item[key];
    return typeof val === 'number' || (typeof val === 'string' && /^\d+$/.test(val));
  });
  return numericField || null;
};

/**
 * Dynamically find the label/display field from an item
 * Priority: name/label/title > fields ending with _name/_label/_title > first string field
 */
const findLabelField = (item) => {
  if (!item || typeof item !== 'object') return null;
  const keys = Object.keys(item);

  // Patterns to exclude (not display labels)
  const excludePatterns = ['_id', 'short', 'mail', 'email', 'phone', 'code', 'abbr', 'password', 'token'];

  // Priority 1: Exact common label field names
  const exactMatches = ['name', 'label', 'title', 'display_name'];
  const exactMatch = exactMatches.find((f) => item[f] !== undefined && typeof item[f] === 'string');
  if (exactMatch) return exactMatch;

  // Priority 2: Fields ending with _name, _label, _title
  const suffixFields = keys
    .filter((key) => {
      const lower = key.toLowerCase();
      return (
        (lower.endsWith('_name') || lower.endsWith('_label') || lower.endsWith('_title')) &&
        !excludePatterns.some((p) => lower.includes(p))
      );
    })
    .sort((a, b) => a.split('_').length - b.split('_').length); // prefer shorter/simpler names
  if (suffixFields.length > 0) return suffixFields[0];

  // Priority 3: Fields containing name/label/title (non-ID)
  const containsFields = keys.filter((key) => {
    const lower = key.toLowerCase();
    return (
      (lower.includes('name') || lower.includes('label') || lower.includes('title')) &&
      !lower.endsWith('_id') &&
      !excludePatterns.some((p) => lower.includes(p)) &&
      typeof item[key] === 'string'
    );
  });
  if (containsFields.length > 0) return containsFields[0];

  // Priority 4: First string field that's not an ID
  const stringField = keys.find((key) => {
    const val = item[key];
    return (
      typeof val === 'string' &&
      val.length > 0 &&
      !key.endsWith('_id') &&
      !excludePatterns.some((p) => key.toLowerCase().includes(p))
    );
  });
  return stringField || null;
};

/**
 * Transform any item to { value, label } format for dropdowns
 */
const transformToOption = (item) => {
  if (!item || typeof item !== 'object') {
    return { value: item, label: String(item) };
  }

  // Already in correct format
  if (item.value !== undefined && item.label !== undefined) {
    return { value: item.value, label: String(item.label) };
  }

  const idFieldName = findIdField(item);
  const labelFieldName = findLabelField(item);

  const value = idFieldName !== null ? item[idFieldName] : Object.values(item)[0];
  let label = labelFieldName ? item[labelFieldName] : null;

  // Fallback: use first string value different from value
  if (!label) {
    const firstString = Object.values(item).find(
      (v) => typeof v === 'string' && v !== String(value)
    );
    label = firstString || String(value);
  }

  return { value, label: String(label || value) };
};

// ============================================================================
// Core API Methods
// ============================================================================

/**
 * GET /api/metadata/{module}
 * Fetch filter metadata (filterable fields) for a module
 *
 * Response format from backend:
 * {
 *   message: string,
 *   module: string,
 *   fields: [{
 *     field_key, label, field_type, table_name, column_name,
 *     allowed_operators, default_operator, ui_type, is_filterable,
 *     filter_order, fk_table, fk_key_column, fk_label_column,
 *     join_alias, ui_options_api, enum_options
 *   }]
 * }
 */
const getFilterMetadata = async (module) => {
  try {
    const response = await axios.get(`${MAIN_URL}/api/metadata/${module}`, {
      headers: getAuthHeaders(),
    });

    if (response.data?.fields) {
      return {
        success: true,
        fields: response.data.fields,
        popular_filters: response.data.popular_filters || [],
        groups: response.data.groups || [],
        module: response.data.module || module,
        message: response.data.message,
      };
    }

    return {
      success: false,
      fields: [],
      popular_filters: [],
      groups: [],
      error: 'Invalid response format - fields array not found',
    };
  } catch (error) {
    console.error('Error fetching filter metadata:', error);

    if (error.response?.status === 401) {
      handleAuthError();
      return { success: false, fields: [], popular_filters: [], groups: [], error: 'Unauthorized - Please login again' };
    }

    if (error.response?.status === 404) {
      return {
        success: false,
        fields: [],
        popular_filters: [],
        groups: [],
        error: `Module "${module}" not found. Ensure metadata is configured for this module.`,
      };
    }

    return {
      success: false,
      fields: [],
      popular_filters: [],
      groups: [],
      error: extractErrorMessage(error, 'Failed to fetch filter metadata'),
    };
  }
};

/**
 * POST /api/metadata/{module}
 * Get filtered data based on metadata-driven filters
 *
 * @param {string} module - Module name or module_id
 * @param {Object} filterParams - Filter parameters
 * @param {Array} filterParams.filters - [{field, operator, value}]
 * @param {Object} filterParams.sort - {field, direction}
 * @param {number} filterParams.page - Page number (default: 1)
 * @param {number} filterParams.limit - Items per page (default: 25)
 * @param {number} filterParams.organization_id - Organization ID (optional, auto-detected)
 */
const getFilteredData = async (module, filterParams = {}) => {
  try {
    const {
      filters = [],
      sort = null,
      page = 1,
      limit = 25,
      organization_id = null,
    } = filterParams;

    // Auto-detect organization ID if not provided
    const orgId = organization_id || getOrganizationId();

    // Ensure filters have proper format - set value to null for operators that don't require values
    const normalizedFilters = filters.map(filter => {
      const requiresValue = operatorRequiresValue(filter.operator);
      
      return {
        field: filter.field,
        operator: filter.operator,
        value: requiresValue ? (filter.value !== undefined ? filter.value : null) : null,
      };
    });

    const requestBody = {
      module_id: module,
      module,
      filters: normalizedFilters,
      page,
      limit,
      ...(orgId && { organization_id: orgId }),
      ...(sort && { sort }),
    };

    const response = await axios.post(
      `${MAIN_URL}/api/metadata/${module}`,
      requestBody,
      { headers: getAuthHeaders() }
    );

    if (response.data?.success !== false) {
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination || {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasPrev: false,
          hasNext: false,
        },
        message: response.data.message,
      };
    }

    return {
      success: false,
      data: [],
      pagination: null,
      error: response.data.error || 'Failed to fetch data',
    };
  } catch (error) {
    console.error('Error fetching filtered data:', error);

    if (error.response?.status === 401) {
      handleAuthError();
      return { success: false, data: [], pagination: null, error: 'Unauthorized' };
    }

    if (error.response?.status === 400) {
      // Validation or filter errors from backend
      const errorData = error.response.data;
      const message = errorData.message || errorData.error || 'Invalid filter parameters';
      toast.error(message);
      return {
        success: false,
        data: [],
        pagination: null,
        error: message,
        invalidFields: errorData.invalid_fields || [],
        invalidOperators: errorData.invalid_operators || [],
      };
    }

    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors || {};
      const errorMessages = Object.values(validationErrors).flat().join(', ');
      toast.error(errorMessages || 'Validation failed');
      return {
        success: false,
        data: [],
        pagination: null,
        error: errorMessages || 'Validation failed',
      };
    }

    const errorMessage = extractErrorMessage(error, 'Failed to fetch filtered data');
    toast.error(errorMessage);
    return {
      success: false,
      data: [],
      pagination: null,
      error: errorMessage,
    };
  }
};

/**
 * Fetch lookup options for foreign key fields
 * Uses ui_options_api from metadata
 *
 * @param {string} apiUrl - API URL from metadata (ui_options_api field)
 * @param {Object} options - Additional options
 * @param {string} options.valueField - Override value field name
 * @param {string} options.labelField - Override label field name
 */
const fetchLookupOptions = async (apiUrl, options = {}) => {
  if (!apiUrl) {
    console.warn('fetchLookupOptions called without API URL');
    return [];
  }

  try {
    const finalUrl = processLookupUrl(apiUrl);
    const response = await axios.get(finalUrl, {
      headers: getAuthHeaders(),
    });

    const data = extractResponseArray(response.data);

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No data found in lookup response:', response.data);
      return [];
    }

    // Transform to {value, label} format
    return data.map((item) => {
      // If custom fields specified, use them
      if (options.valueField && options.labelField) {
        return {
          value: item[options.valueField],
          label: String(item[options.labelField] || item[options.valueField]),
        };
      }
      return transformToOption(item);
    });
  } catch (error) {
    console.error('Error fetching lookup options:', error, 'URL:', apiUrl);

    if (error.response?.status === 401) {
      handleAuthError();
    }

    return [];
  }
};

/**
 * Get enum options from metadata field
 * Returns pre-formatted array from backend
 *
 * @param {Array} enumOptions - enum_options from metadata field
 */
const getEnumOptions = (enumOptions) => {
  if (!enumOptions || !Array.isArray(enumOptions)) {
    return [];
  }

  return enumOptions.map((option) => {
    // Already in {value, label} format from backend
    if (option.value !== undefined && option.label !== undefined) {
      return option;
    }
    // Simple string array
    if (typeof option === 'string') {
      return { value: option, label: option };
    }
    return transformToOption(option);
  });
};

/**
 * Build filter options for a field based on its type
 * Automatically fetches lookup options for foreign_key and enum fields
 *
 * @param {Object} field - Field metadata from getFilterMetadata
 */
const getFieldOptions = async (field) => {
  if (!field) return [];

  const fieldType = field.field_type || field.ui_type;

  // Enum field - use enum_options from metadata
  if (fieldType === 'enum' && field.enum_options) {
    return getEnumOptions(field.enum_options);
  }

  // Foreign key field - fetch from API
  if (fieldType === 'foreign_key' && field.ui_options_api) {
    return fetchLookupOptions(field.ui_options_api, {
      valueField: field.fk_key_column,
      labelField: field.fk_label_column,
    });
  }

  // Boolean field
  if (fieldType === 'boolean') {
    return [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ];
  }

  return [];
};

/**
 * Build a complete filter configuration from metadata
 * Returns fields with their options pre-loaded
 *
 * @param {string} module - Module name
 */
const buildFilterConfig = async (module) => {
  const metadata = await getFilterMetadata(module);

  if (!metadata.success) {
    return metadata;
  }

  // Enrich fields with options
  const enrichedFields = await Promise.all(
    metadata.fields.map(async (field) => {
      const options = await getFieldOptions(field);
      return {
        ...field,
        options: options.length > 0 ? options : undefined,
      };
    })
  );

  return {
    success: true,
    module: metadata.module,
    fields: enrichedFields,
  };
};

// ============================================================================
// Export
// ============================================================================

const FilterService = {
  // Core API methods
  getFilterMetadata,
  getFilteredData,
  fetchLookupOptions,

  // Helper methods
  getEnumOptions,
  getFieldOptions,
  buildFilterConfig,

  // Utility methods (for advanced usage)
  processLookupUrl,
  extractResponseArray,
  transformToOption,
  getOrganizationId,
};

export default FilterService;
