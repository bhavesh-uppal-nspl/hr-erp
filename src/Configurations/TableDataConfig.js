

// Helper functions to manage the table-config
export const saveLayoutToConfig = (TableConfig , tableName, layoutData) => {
  const tableIndex = TableConfig?.findIndex(config => config.table === tableName);
  if (tableIndex !== -1) {
    // Update user_config with new layout
    TableConfig[tableIndex].user_config = {
      ...TableConfig[tableIndex].user_config,
      columns: layoutData.columns.map((col, index) => ({
        key: col.key,
        visible: col.visible,
        order: index + 1,
        width: col.width,
        sortDirection: null,
        filterValue: layoutData.filters[col.key] || null,
        pinned: col.pinned || false
      })),
      sortConfig: layoutData.sortConfig,
      rowsPerPage: layoutData.rowsPerPage,
      filters: layoutData.filters,
      lastModified: new Date().toISOString()
    };
    return true;
  }
  return false;
};

export const resetLayoutToDefault = (TableConfig , tableName) => {
  const tableIndex = TableConfig?.findIndex(config => config.table === tableName);
  if (tableIndex !== -1) {
    const defaultConfig = TableConfig[tableIndex].default_config;
    
    // Reset user_config to match default_config structure
    TableConfig[tableIndex].user_config = {
      columns: defaultConfig.columns.map((col, index) => ({
        key: col.key, 
        visible: index < 4, // Only first 4 columns visible by default
        order: index + 1,
        width: col.width,
        sortDirection: null,
        filterValue: null,
        pinned: index === 0 // Only first column pinned
      })),
      sortConfig: defaultConfig.sortConfig,
      rowsPerPage: defaultConfig.rowsPerPage,
      filters: defaultConfig.filters,
      lastModified: new Date().toISOString()
    };
    return true;
  }
  return false;
};

export const getTableConfig = (TableConfig , tableName) => {
  
  const config = TableConfig?.find(config => config.table === tableName);
  return config || null;
};

export const getUserConfig = (TableConfig , tableName) => {
  const config = getTableConfig(TableConfig , tableName);
  return config ? config.user_config : null;
};

export const getDefaultConfig = (TableConfig , tableName) => {
  const config = getTableConfig(TableConfig ,tableName);
  return config ? config.default_config : null;
};