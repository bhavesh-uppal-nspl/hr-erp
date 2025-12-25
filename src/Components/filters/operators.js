/**
 * Filter operators supported by the backend SystemMetadataController
 * These operators map to the backend's applyFilterCondition method
 */
export const OPERATORS = {
  // Text operators
  CONTAINS: 'contains',
  DOES_NOT_CONTAIN: 'does_not_contain',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with',
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  
  // Comparison operators
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
  GREATER_THAN_OR_EQUAL: 'greater_or_equal',
  LESS_THAN_OR_EQUAL: 'less_or_equal',
  

  
  // Range operator
  BETWEEN: 'between',
  NOT_BETWEEN: 'not_between',
  
  // Date operators
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  TOMORROW: 'tomorrow',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  NEXT_WEEK: 'next_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  NEXT_MONTH: 'next_month',
  THIS_QUARTER: 'this_quarter',
  LAST_QUARTER: 'last_quarter',
  NEXT_QUARTER: 'next_quarter',
  THIS_YEAR: 'this_year',
  LAST_YEAR: 'last_year',
  CUSTOM_DATE: 'custom_date',
  DATE_EQUALS: 'date_equals',
  DATE_BEFORE: 'before',
  DATE_AFTER: 'after',
  DATE_BETWEEN: 'date_between',
  DATE_NOT_EQUALS: 'date_not_equals',
  DATE_NOT_BETWEEN: 'date_not_between',
  
  // Null check operators
  IS_EMPTY: 'is_empty',
  IS_NOT_EMPTY: 'is_not_empty',
};

/**
 * Operator labels for display
 */
export const OPERATOR_LABELS = {
  [OPERATORS.CONTAINS]: 'Contains',
  [OPERATORS.DOES_NOT_CONTAIN]: 'Does Not Contain',
  [OPERATORS.STARTS_WITH]: 'Starts With',
  [OPERATORS.ENDS_WITH]: 'Ends With',
  [OPERATORS.EQUALS]: 'Equals',
  [OPERATORS.NOT_EQUALS]: 'Not Equals',
  [OPERATORS.GREATER_THAN]: 'Greater Than',
  [OPERATORS.LESS_THAN]: 'Less Than',
  [OPERATORS.GREATER_THAN_OR_EQUAL]: 'Greater Than or Equal',
  [OPERATORS.LESS_THAN_OR_EQUAL]: 'Less Than or Equal',
  [OPERATORS.BETWEEN]: 'Between',
  [OPERATORS.NOT_BETWEEN]: 'Not Between',
  [OPERATORS.TODAY]: 'Today',
  [OPERATORS.YESTERDAY]: 'Yesterday',
  [OPERATORS.TOMORROW]: 'Tomorrow',
  [OPERATORS.THIS_WEEK]: 'This Week',
  [OPERATORS.LAST_WEEK]: 'Last Week',
  [OPERATORS.NEXT_WEEK]: 'Next Week',
  [OPERATORS.THIS_MONTH]: 'This Month',
  [OPERATORS.LAST_MONTH]: 'Last Month',
  [OPERATORS.NEXT_MONTH]: 'Next Month',
  [OPERATORS.THIS_QUARTER]: 'This Quarter',
  [OPERATORS.LAST_QUARTER]: 'Last Quarter',
  [OPERATORS.NEXT_QUARTER]: 'Next Quarter',
  [OPERATORS.THIS_YEAR]: 'This Year',
  [OPERATORS.LAST_YEAR]: 'Last Year',
  [OPERATORS.CUSTOM_DATE]: 'Custom Date',
  [OPERATORS.DATE_EQUALS]: 'Equals',
  [OPERATORS.DATE_BEFORE]: 'Before',
  [OPERATORS.DATE_AFTER]: 'After',
  [OPERATORS.DATE_BETWEEN]: 'Between',
  [OPERATORS.DATE_NOT_EQUALS]: 'Not Equals',
  [OPERATORS.DATE_NOT_BETWEEN]: 'Not Between',
  [OPERATORS.IS_EMPTY]: 'Is Empty',
  [OPERATORS.IS_NOT_EMPTY]: 'Is Not Empty',
};

/**
 * Operator tooltips with examples
 */
export const OPERATOR_TOOLTIPS = {
  [OPERATORS.CONTAINS]: 'Matches records where the field contains the specified text.\nExample: "John" matches "John Doe", "Johnny", "Johnson"',
  [OPERATORS.DOES_NOT_CONTAIN]: 'Matches records where the field does not contain the specified text.\nExample: "John" excludes "John Doe", "Johnny"',
  [OPERATORS.STARTS_WITH]: 'Matches records where the field starts with the specified text.\nExample: "John" matches "John Doe", "Johnny" but not "Bob Johnson"',
  [OPERATORS.ENDS_WITH]: 'Matches records where the field ends with the specified text.\nExample: "son" matches "Johnson", "Anderson" but not "Sonic"',
  [OPERATORS.EQUALS]: 'Matches records where the field exactly equals the specified value.\nExample: "John" matches only "John"',
  [OPERATORS.NOT_EQUALS]: 'Matches records where the field does not equal the specified value.\nExample: "Active" excludes "Active" but includes "Inactive", "Pending"',
  [OPERATORS.GREATER_THAN]: 'Matches records where the field value is greater than the specified number.\nExample: 1000 matches 1001, 2000 but not 1000 or 999',
  [OPERATORS.LESS_THAN]: 'Matches records where the field value is less than the specified number.\nExample: 1000 matches 999, 500 but not 1000 or 1001',
  [OPERATORS.GREATER_THAN_OR_EQUAL]: 'Matches records where the field value is greater than or equal to the specified number.\nExample: 1000 matches 1000, 1001, 2000',
  [OPERATORS.LESS_THAN_OR_EQUAL]: 'Matches records where the field value is less than or equal to the specified number.\nExample: 1000 matches 1000, 999, 500',
  [OPERATORS.BETWEEN]: 'Matches records where the field value is between two values (inclusive).\nExample: 100 to 500 matches 100, 250, 500',
  [OPERATORS.NOT_BETWEEN]: 'Matches records where the field value is not between two values.\nExample: 100 to 500 excludes 100, 250, 500',
  [OPERATORS.TODAY]: 'Matches records where the date is today',
  [OPERATORS.YESTERDAY]: 'Matches records where the date is yesterday',
  [OPERATORS.TOMORROW]: 'Matches records where the date is tomorrow',
  [OPERATORS.THIS_WEEK]: 'Matches records where the date falls within the current week',
  [OPERATORS.LAST_WEEK]: 'Matches records where the date falls within the last week',
  [OPERATORS.NEXT_WEEK]: 'Matches records where the date falls within the next week',
  [OPERATORS.THIS_MONTH]: 'Matches records where the date falls within the current month',
  [OPERATORS.LAST_MONTH]: 'Matches records where the date falls within the last month',
  [OPERATORS.NEXT_MONTH]: 'Matches records where the date falls within the next month',
  [OPERATORS.THIS_QUARTER]: 'Matches records where the date falls within the current quarter',
  [OPERATORS.LAST_QUARTER]: 'Matches records where the date falls within the last quarter',
  [OPERATORS.NEXT_QUARTER]: 'Matches records where the date falls within the next quarter',
  [OPERATORS.THIS_YEAR]: 'Matches records where the date falls within the current year',
  [OPERATORS.LAST_YEAR]: 'Matches records where the date falls within the last year',
  [OPERATORS.CUSTOM_DATE]: 'Select a custom date range with specific operators',
  [OPERATORS.DATE_EQUALS]: 'Matches records where the date exactly equals the specified date',
  [OPERATORS.DATE_BEFORE]: 'Matches records where the date is before the specified date',
  [OPERATORS.DATE_AFTER]: 'Matches records where the date is after the specified date',
  [OPERATORS.DATE_BETWEEN]: 'Matches records where the date is between two dates (inclusive)',
  [OPERATORS.DATE_NOT_EQUALS]: 'Matches records where the date does not equal the specified date',
  [OPERATORS.DATE_NOT_BETWEEN]: 'Matches records where the date is not between two dates',
  [OPERATORS.IS_EMPTY]: 'Matches records where the field is empty (null or empty string)',
  [OPERATORS.IS_NOT_EMPTY]: 'Matches records where the field is not empty (has a value)',
};

/**
 * Helper: Create operator object with value, label, and tooltip
 */
const createOperator = (value) => ({
  value,
  label: OPERATOR_LABELS[value] || value,
  tooltip: OPERATOR_TOOLTIPS[value] || '',
});

/**
 * Common operator groups for reuse
 */
const COMMON_OPERATORS = {
  EQUALITY: [OPERATORS.EQUALS, OPERATORS.NOT_EQUALS],
  EMPTY_CHECKS: [OPERATORS.IS_EMPTY, OPERATORS.IS_NOT_EMPTY],
  COMPARISON: [
    OPERATORS.GREATER_THAN,
    OPERATORS.GREATER_THAN_OR_EQUAL,
    OPERATORS.LESS_THAN,
    OPERATORS.LESS_THAN_OR_EQUAL,
  ],
  TEXT: [OPERATORS.CONTAINS, OPERATORS.EQUALS, OPERATORS.STARTS_WITH, OPERATORS.ENDS_WITH],
  TEXT_NEGATIVE: [OPERATORS.DOES_NOT_CONTAIN, OPERATORS.NOT_EQUALS],
  DATE_QUICK: [
    OPERATORS.TODAY,
    OPERATORS.YESTERDAY,
    OPERATORS.TOMORROW,
    OPERATORS.THIS_WEEK,
    OPERATORS.LAST_WEEK,
    OPERATORS.NEXT_WEEK,
    OPERATORS.THIS_MONTH,
    OPERATORS.LAST_MONTH,
    OPERATORS.NEXT_MONTH,
    OPERATORS.THIS_QUARTER,
    OPERATORS.LAST_QUARTER,
    OPERATORS.NEXT_QUARTER,
    OPERATORS.THIS_YEAR,
    OPERATORS.LAST_YEAR,
  ],
  DATE_CUSTOM_OPERATORS: [
    OPERATORS.DATE_EQUALS,
    OPERATORS.DATE_BEFORE,
    OPERATORS.DATE_AFTER,
    OPERATORS.DATE_BETWEEN,
    OPERATORS.DATE_NOT_EQUALS,
    OPERATORS.DATE_NOT_BETWEEN,
  ],
};

/**
 * Default operators by field type
 * Organized according to specification with proper groupings
 */
const DEFAULT_OPERATORS = {
  // Text Field: Contains, Equals, Starts With, Ends With, Does Not Contain, Not Equals, Is Empty, Is Not Empty
  text: [
    OPERATORS.CONTAINS,
    OPERATORS.EQUALS,
    OPERATORS.STARTS_WITH,
    OPERATORS.ENDS_WITH,
    OPERATORS.DOES_NOT_CONTAIN,
    OPERATORS.NOT_EQUALS,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY,
  ],
  // Number: Equals, Not Equals, Greater Than, Greater Than or Equal, Less Than, Less Than or Equal, Between, Not Between, Is Empty, Is Not Empty
  number: [
    OPERATORS.EQUALS,
    OPERATORS.NOT_EQUALS,
    OPERATORS.GREATER_THAN,
    OPERATORS.GREATER_THAN_OR_EQUAL,
    OPERATORS.LESS_THAN,
    OPERATORS.LESS_THAN_OR_EQUAL,
    OPERATORS.BETWEEN,
    OPERATORS.NOT_BETWEEN,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY,
  ],
  // Date: Today, Yesterday, Tomorrow, This Week, Last Week, Next Week, This Month, Last Month, Next Month, This Quarter, Last Quarter, Next Quarter, This Year, Last Year, Equals, Before, After, Between, Not Equals, Not Between, Is Empty, Is Not Empty
  date: [
    OPERATORS.TODAY,
    OPERATORS.YESTERDAY,
    OPERATORS.TOMORROW,
    OPERATORS.THIS_WEEK,
    OPERATORS.LAST_WEEK,
    OPERATORS.NEXT_WEEK,
    OPERATORS.THIS_MONTH,
    OPERATORS.LAST_MONTH,
    OPERATORS.NEXT_MONTH,
    OPERATORS.THIS_QUARTER,
    OPERATORS.LAST_QUARTER,
    OPERATORS.NEXT_QUARTER,
    OPERATORS.THIS_YEAR,
    OPERATORS.LAST_YEAR,
    OPERATORS.DATE_EQUALS,
    OPERATORS.DATE_BEFORE,
    OPERATORS.DATE_AFTER,
    OPERATORS.DATE_BETWEEN,
    OPERATORS.DATE_NOT_EQUALS,
    OPERATORS.DATE_NOT_BETWEEN,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY,
  ],
  // Boolean: Equals, Not Equals, Is Empty, Is Not Empty
  boolean: [
    OPERATORS.EQUALS,
    OPERATORS.NOT_EQUALS,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY,
  ],
  // Foreign Key: Equals (multi-select), Not Equals, Is Empty, Is Not Empty
  foreign_key: [
    OPERATORS.EQUALS, // This will support multi-select in UI
    OPERATORS.NOT_EQUALS,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY,
  ],
  // Enum: Equals (multi-select), Not Equals, Is Empty, Is Not Empty
  enum: [
    OPERATORS.EQUALS, // This will support multi-select in UI
    OPERATORS.NOT_EQUALS,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY,
  ],
  // Dropdown fields - same as foreign_key
  dropdown: [
    OPERATORS.EQUALS, // This will support multi-select in UI
    OPERATORS.NOT_EQUALS,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY,
  ],
  // Custom date sub-operators (shown when CUSTOM_DATE is selected) - kept for backward compatibility
  date_custom: [
    ...COMMON_OPERATORS.DATE_CUSTOM_OPERATORS,
    ...COMMON_OPERATORS.EMPTY_CHECKS,
  ],
};

/**
 * Get operators allowed for a specific field type
 * @param {string} fieldType - The field type (text, number, date, boolean, foreign_key, enum, dropdown)
 * @param {Array} allowedOperators - Custom allowed operators from metadata
 * @returns {Array} Array of operator objects with value and label
 */
export const getOperatorsForFieldType = (fieldType, allowedOperators = []) => {
  // Operators that should be hidden from UI but still work in backend
  const hiddenOperators = ['this_month_joining', 'this_month_anniversary'];
  
  // Blank operators that should always be available in UI
  const alwaysIncludeOperators = [OPERATORS.IS_EMPTY, OPERATORS.IS_NOT_EMPTY];
  
  // If metadata specifies allowed operators, use those (filter out any undefined/null values)
  if (allowedOperators?.length > 0) {
    // Merge allowed operators with always-include operators, removing duplicates
    const combinedOperators = [...new Set([
      ...allowedOperators,
      ...alwaysIncludeOperators
    ])];
    
    return combinedOperators
      .filter(op => op != null && op !== undefined && !hiddenOperators.includes(op))
      .map(createOperator)
      .filter(op => op.value != null); // Filter out any operators that couldn't be created
  }

  // Use default operators for field type
  const operators = DEFAULT_OPERATORS[fieldType] || DEFAULT_OPERATORS.text;
  return operators
    .filter(op => op != null && op !== undefined)
    .map(createOperator)
    .filter(op => op.value != null); // Filter out any operators that couldn't be created
};

/**
 * Get custom date operators (shown when CUSTOM_DATE is selected)
 * @returns {Array} Array of custom date operator objects
 */
export const getCustomDateOperators = () => {
  return COMMON_OPERATORS.DATE_CUSTOM_OPERATORS
    .filter(op => op != null && op !== undefined)
    .map(createOperator)
    .filter(op => op.value != null);
};

/**
 * Operators that don't require a value input
 */
const NO_VALUE_OPERATORS = new Set([
  OPERATORS.IS_EMPTY,
  OPERATORS.IS_NOT_EMPTY,
  OPERATORS.TODAY,
  OPERATORS.YESTERDAY,
  OPERATORS.TOMORROW,
  OPERATORS.THIS_WEEK,
  OPERATORS.LAST_WEEK,
  OPERATORS.NEXT_WEEK,
  OPERATORS.THIS_MONTH,
  OPERATORS.LAST_MONTH,
  OPERATORS.NEXT_MONTH,
  OPERATORS.THIS_QUARTER,
  OPERATORS.LAST_QUARTER,
  OPERATORS.NEXT_QUARTER,
  OPERATORS.THIS_YEAR,
  OPERATORS.LAST_YEAR,
]);

/**
 * Operators that require multiple values (array or range)
 */
const MULTIPLE_VALUE_OPERATORS = new Set([
  OPERATORS.BETWEEN,
  OPERATORS.NOT_BETWEEN,
  OPERATORS.DATE_BETWEEN,
  OPERATORS.DATE_NOT_BETWEEN,
  // Equals for foreign_key/enum supports multi-select (array of values)
  // This is handled in FilterRow component, not here
]);

/**
 * Check if an operator requires a value input
 * @param {string} operator - The operator to check
 * @returns {boolean} True if operator requires a value
 */
export const operatorRequiresValue = (operator) => {
  return !NO_VALUE_OPERATORS.has(operator);
};

/**
 * Check if an operator requires multiple values (array or range)
 * @param {string} operator - The operator to check
 * @returns {boolean} True if operator requires multiple values
 */
export const operatorRequiresMultipleValues = (operator) => {
  return MULTIPLE_VALUE_OPERATORS.has(operator);
};

/**
 * Check if an operator supports multi-select (for all field types except date with equals operator)
 * @param {string} operator - The operator to check
 * @param {string} fieldType - The field type
 * @returns {boolean} True if operator supports multi-select
 */
export const operatorSupportsMultiSelect = (operator, fieldType) => {
  // Equals operator supports multi-select for all field types EXCEPT date/datetime
  const excludedTypes = ['date', 'datetime'];
  return operator === OPERATORS.EQUALS && !excludedTypes.includes(fieldType);
};