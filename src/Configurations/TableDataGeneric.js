

// // import React from "react";
// // import Customisetable from "../Components/Table/Customisetable";

// // // Helper function to infer data type from value
// // const inferDataType = (value) => {
// //   if (value instanceof Date) return 'date';
// //   if (typeof value === 'number') {
// //     // Check if it looks like currency (has decimal places)
// //     if (value.toString().includes('.')) return 'currency';
// //     return 'number';
// //   }
// //   if (typeof value === 'string') {
// //     // Check for email pattern
// //     if (value.includes('@')) return 'email';
// //     // Check for phone pattern
// //     if (/^[0-9+\-() ]+$/.test(value)) return 'phone';
// //     return 'string';
// //   }
// //   return 'string';
// // };

// // // Default configuration for different field types
// // const fieldDefaults = {
// //   string: { width: 180, sortable: true, filterable: true },
// //   number: { width: 80, sortable: true, filterable: true },
// //   date: { width: 180, sortable: true, filterable: true },
// //   enum: { width: 100, sortable: false, filterable: true },
// //   email: { width: 180, sortable: false, filterable: true },
// //   phone: { width: 180, sortable: false, filterable: true },
// //   currency: { width: 180, sortable: true, filterable: true }
// // };
// // function TableDataGeneric({
// //   tableName,
// //   primaryKey,
// //   heading,
// //   data,
// //   sortname,
// //   Route,
// //   DeleteFunc,
// //   token,
// //   EditFunc,
// //   showActions,
// //   CardData,
// //   config = {}
// // }) {
// //   const generateColumns = (data) => {
// //     if (!data || data?.length === 0) return [];

// //     // Define mandatory and default visible columns
// //     const mandatoryColumns = config.mandatoryColumns || [];
// //     const defaultVisibleColumns = config.defaultVisibleColumns || [];
// //     const pinnedColumns = config.pinnedColumns || [];

// //     const columns = Object.entries(data[0] || {})
// //       .map(([key, value]) => {
// //         const lowerKey = key.toLowerCase();
        
// //         // Skip system fields
// //         if (lowerKey.endsWith("_id") || 
// //             key === "id" || 
// //             lowerKey.includes("updated_at") ||
// //             lowerKey.includes("created_at") ||
// //             lowerKey.includes("created_by") ||
// //             typeof value === "object") return null;

// //         // Determine data type
// //         const dataType = inferDataType(value);
// //         const defaults = fieldDefaults[dataType];

// //         return {
// //           field: key,
// //           key,
// //           label: key
// //             .split("_")
// //             .map((word) => word.charAt(0).toUpperCase() + word?.slice(1))
// //             .join(" "),
// //           dataType: inferDataType(value),
// //           width: defaults.width,
// //           sortable: defaults.sortable,
// //           filterable: defaults.filterable,
// //           mandatory: mandatoryColumns.includes(key),
// //           defaultVisible: defaultVisibleColumns.includes(key),
// //           pinned: pinnedColumns.includes(key)
// //         };
// //       })
// //       .filter(Boolean);
// //     const employeeNameField = columns.filter(
// //       (col) => col.key.toLowerCase() === "employee_name"
// //     );
// //     const codeFields = columns.filter(
// //       (col) =>
// //         col.key.toLowerCase().includes("code") &&
// //         col.key.toLowerCase() !== "employee_name"
// //     );
// //     const otherNameFields = columns.filter(
// //       (col) =>
// //         col.key.toLowerCase().includes("name") &&
// //         col.key.toLowerCase() !== "employee_name"
// //     );
// //     const otherFields = columns.filter(
// //       (col) =>
// //         !col.key.toLowerCase().includes("name") &&
// //         !col.key.toLowerCase().includes("code")
// //     );
// //     // Sort each group alphabetically except employee_name (it stays first)
// //     codeFields.sort((a, b) => a.label.localeCompare(b.label));
// //     otherNameFields.sort((a, b) => a.label.localeCompare(b.label));
// //     otherFields.sort((a, b) => a.label.localeCompare(b.label));
// //     return [
// //       ...employeeNameField,
// //       ...codeFields,
// //       ...otherNameFields,
// //       ...otherFields,
// //     ];
// //   };
// //   return (
// //     <Customisetable
// //       configuration={[
// //         {
// //           table: tableName,
// //           primaryKey: primaryKey,
// //           heading: heading,
// //           lastModified: new Date().toISOString(),
// //           default_config: {
// //             columns: generateColumns(data).map((col, index) => ({
// //               ...col,
// //               visible: (config.defaultVisibleColumns || []).includes(col.field) || index < 4,
// //               order: col.field === 'Employee_Code' ? 0 : 
// //                      col.field === 'Name' ? 1 :
// //                      config.defaultVisibleColumns?.indexOf(col.field) ??index
// //             })),
// //             sortConfig: config.sort ? [{ key: config.sort.field, direction: config.sort.direction }] : [{ key: sortname, direction: "asc" }],
// //             rowsPerPage: config.pagination?.rowsPerPage || 10,
// //             filters: config.filters || {},
// //             search: config.search || { enabled: true, placeholder: "Search...", fields: [] }
// //           },
// //           user_config: {
// //             columns: generateColumns(data).map((col, index) => ({
// //               ...col,
// //               key: col.key,
// //               field: col.field,
// //               visible: (config.defaultVisibleColumns || []).includes(col.field) || index < 4,
// //               order: col.field === 'Employee_Code' ? 0 : 
// //                      col.field === 'Name' ? 1 :
// //                      config.defaultVisibleColumns?.indexOf(col.field) ??index,
// //               width: col.width,
// //               sortDirection: null,
// //               filterValue: null,
// //               pinned: col.pinned || col.field === 'Employee_Code' || col.field === 'Name',
// //               dataType: col.dataType
// //             })),
// //             sortConfig: config.sort ? [{ key: config.sort.field, direction: config.sort.direction }] : [{ key: sortname, direction: "asc" }],
// //             rowsPerPage: config.pagination?.rowsPerPage || 10,
// //             filters: config.filters || {},
// //             search: config.search || { enabled: true, placeholder: "Search...", fields: [] },
// //             lastModified: new Date().toISOString(),
// //           },
// //         },
// //       ]}
// //       tableName={tableName}
// //       Route={Route}
// //       DeleteFunc={DeleteFunc}
// //       EditFunc={EditFunc}
// //       token={token}
// //       mainKey={primaryKey}
// //       mainData={data}
// //       showActions={showActions}
// //       CardColoumn={CardData}
// //     />
// //   );
// // }
// // export default TableDataGeneric;




// "use client"

// import { useMemo } from "react"
// import Customisetable from "../Components/Table/Customisetable"

// // Helper function to infer data type from value
// const inferDataType = (value) => {
//   if (value instanceof Date) return "date"
//   if (typeof value === "number") {
//     if (value.toString().includes(".")) return "currency"
//     return "number"
//   }
//   if (typeof value === "string") {
//     if (value.includes("@")) return "email"
//     if (/^[0-9+\-() ]+$/.test(value)) return "phone"
//     return "string"
//   }
//   return "string"
// }

// // Default configuration for different field types
// const fieldDefaults = {
//   string: { width: 180, sortable: true, filterable: true },
//   number: { width: 80, sortable: true, filterable: true },
//   date: { width: 180, sortable: true, filterable: true },
//   enum: { width: 100, sortable: false, filterable: true },
//   email: { width: 180, sortable: false, filterable: true },
//   phone: { width: 180, sortable: false, filterable: true },
//   currency: { width: 180, sortable: true, filterable: true },
// }

// // Move this function outside the component to avoid hook violations
// const generateColumnsFromData = (data, config) => {
//   if (!data || data?.length === 0) return []

//   // Define mandatory and default visible columns
//   const mandatoryColumns = config.mandatoryColumns || []
//   const defaultVisibleColumns = config.defaultVisibleColumns || []
//   const pinnedColumns = config.pinnedColumns || []

//   const columns = Object.entries(data[0] || {})
//     .map(([key, value]) => {
//       const lowerKey = key.toLowerCase()

//       // Skip system fields
//       if (
//         lowerKey.endsWith("_id") ||
//         key === "id" ||
//         lowerKey.includes("updated_at") ||
//         lowerKey.includes("created_at") ||
//         lowerKey.includes("created_by") ||
//         typeof value === "object"
//       )
//         return null

//       // Determine data type
//       const dataType = inferDataType(value)
//       const defaults = fieldDefaults[dataType]

//       return {
//         field: key,
//         key,
//         label: key
//           .split("_")
//           .map((word) => word.charAt(0).toUpperCase() + word?.slice(1))
//           .join(" "),
//         dataType: dataType,
//         width: defaults.width,
//         sortable: defaults.sortable,
//         filterable: defaults.filterable,
//         mandatory: mandatoryColumns.includes(key),
//         defaultVisible: defaultVisibleColumns.includes(key),
//         pinned: pinnedColumns.includes(key),
//       }
//     })
//     .filter(Boolean)

//   // Sort columns: employee_name first, then codes, then other names, then others
//   const employeeNameField = columns.filter((col) => col.key.toLowerCase() === "employee_name")
//   const codeFields = columns.filter(
//     (col) => col.key.toLowerCase().includes("code") && col.key.toLowerCase() !== "employee_name",
//   )
//   const otherNameFields = columns.filter(
//     (col) => col.key.toLowerCase().includes("name") && col.key.toLowerCase() !== "employee_name",
//   )
//   const otherFields = columns.filter(
//     (col) => !col.key.toLowerCase().includes("name") && !col.key.toLowerCase().includes("code"),
//   )

//   // Sort each group alphabetically except employee_name (it stays first)
//   codeFields.sort((a, b) => a.label.localeCompare(b.label))
//   otherNameFields.sort((a, b) => a.label.localeCompare(b.label))
//   otherFields.sort((a, b) => a.label.localeCompare(b.label))

//   return [...employeeNameField, ...codeFields, ...otherNameFields, ...otherFields]
// }

// function TableDataGeneric({
//   tableName,
//   primaryKey,
//   heading,
//   data,
//   sortname,
//   Route,
//   DeleteFunc,
//   token,
//   EditFunc,
//   showActions,
//   linkType,
//   hideToolbar,
//   onclickRow,
//   CardData,
//   configss, // Real-time column configuration from form
//   onFilterChange,
//   onSortChange,
//   renderCell,
//   config = {},
//   onColumnWidthChange,
//   onColumnVisibilityChange,
// }) {
//   // Memoized column generation with real-time updates
//   const processedColumns = useMemo(() => {
//     // Priority 1: Use configss if provided (real-time configuration)
//     if (configss && Array.isArray(configss) && configss?.length > 0) {
//       return configss.map((col, index) => ({
//         field: col.field,
//         key: col.field,
//         label: col.label,
//         dataType: col.dataType || inferDataType(""),
//         width: col.width,
//         sortable: col.sortable,
//         filterable: col.filterable,
//         mandatory: col.required,
//         defaultVisible: col.visible,
//         pinned: col.pinned === "left",
//         visible: col.visible,
//         order: col.field === "Employee_Code" ? 0 : col.field === "Name" ? 1 : index + 2,
//       }))
//     }

//     // Priority 2: Generate from data if configss not available
//     return generateColumnsFromData(data, config)
//   }, [configss, data, config])

//   // Memoized table configuration
//   const tableConfiguration = useMemo(() => {
//     return [
//       {
//         table: tableName,
//         primaryKey: primaryKey,
//         heading: heading,
//         lastModified: new Date().toISOString(),
//         default_config: {
//           columns: processedColumns.map((col, index) => ({
//             ...col,
//             visible:
//               col.visible !== undefined
//                 ? col.visible
//                 : (config.defaultVisibleColumns || []).includes(col.field) || index < 4,
//             order:
//               col.order !== undefined
//                 ? col.order
//                 : col.field === "Employee_Code"
//                   ? 0
//                   : col.field === "Name"
//                     ? 1
//                     : (config.defaultVisibleColumns?.indexOf(col.field) ??index),
//           })),
//           sortConfig: config.sort
//             ? [{ key: config.sort.field, direction: config.sort.direction }]
//             : [{ key: sortname, direction: "asc" }],
//           rowsPerPage: config.pagination?.rowsPerPage || 10,
//           filters: config.filters || {},
//           search: config.search || { enabled: true, placeholder: "Search...", fields: [] },
//         },
//         user_config: {
//           columns: processedColumns.map((col, index) => ({
//             ...col,
//             key: col.key,
//             field: col.field,
//             visible:
//               col.visible !== undefined
//                 ? col.visible
//                 : (config.defaultVisibleColumns || []).includes(col.field) || index < 4,
//             order:
//               col.order !== undefined
//                 ? col.order
//                 : col.field === "Employee_Code"
//                   ? 0
//                   : col.field === "Name"
//                     ? 1
//                     : (config.defaultVisibleColumns?.indexOf(col.field) ??index),
//             width: col.width,
//             sortDirection: null,
//             filterValue: null,
//             pinned: col.pinned !== undefined ? col.pinned : col.field === "Employee_Code" || col.field === "Name",
//             dataType: col.dataType,
//           })),
//           sortConfig: config.sort
//             ? [{ key: config.sort.field, direction: config.sort.direction }]
//             : [{ key: sortname, direction: "asc" }],
//           rowsPerPage: config.pagination?.rowsPerPage || 10,
//           filters: config.filters || {},
//           search: config.search || { enabled: true, placeholder: "Search...", fields: [] },
//           lastModified: new Date().toISOString(),
//         },
//       },
//     ]
//   }, [processedColumns, tableName, primaryKey, heading, config, sortname])

//   return (
//     <Customisetable
//       configuration={tableConfiguration}
//       tableName={tableName}
//       Route={Route}
//       DeleteFunc={DeleteFunc}
//       EditFunc={EditFunc}
//       token={token}
//       mainKey={primaryKey}
//       mainData={data}
//       showActions={showActions}
//       hideToolbar={hideToolbar}
//       CardColoumn={CardData}
//       sortname={sortname}
//       onSortChange={onSortChange}
//       onFilterChange={onFilterChange}
//       configss={configss}
//       renderCell={renderCell}
//       onColumnWidthChange={onColumnWidthChange}
//       onclickRow={onclickRow}
//       onColumnVisibilityChange={onColumnVisibilityChange}
//       linkType={linkType}
//     />
//   )
// }

// export default TableDataGeneric






"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Customisetable from "../Components/Table/Customisetable";
import useAuthStore from "../Zustand/Store/useAuthStore";
import { MAIN_URL } from "./Urls";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Infer data type from a given value
 */
const inferDataType = (value) => {
  if (value instanceof Date) return "date";
  if (typeof value === "number") {
    return value.toString().includes(".") ? "currency" : "number";
  }
  if (typeof value === "string") {
    if (value.includes("@")) return "email";
    if (/^[0-9+\-() ]+$/.test(value)) return "phone";
    return "string";
  }
  return "string";
};

// Default configuration for different field types
const FIELD_DEFAULTS = {
  string: { width: 180, sortable: true, filterable: true },
  number: { width: 80, sortable: true, filterable: true },
  date: { width: 180, sortable: true, filterable: true },
  enum: { width: 100, sortable: false, filterable: true },
  email: { width: 180, sortable: false, filterable: true },
  phone: { width: 180, sortable: false, filterable: true },
  currency: { width: 180, sortable: true, filterable: true },
};

/**
 * Generate column configuration from data
 */
const generateColumnsFromData = (data, config) => {
  if (!data || data.length === 0) return [];

  const mandatoryColumns = config.mandatoryColumns || [];
  const defaultVisibleColumns = config.defaultVisibleColumns || [];
  const pinnedColumns = config.pinnedColumns || [];

  // Generate columns from first data row
  const columns = Object.entries(data[0] || {})
    .map(([key, value]) => {
      const lowerKey = key.toLowerCase();

      // Skip system fields (IDs, timestamps, objects)
      if (
        lowerKey.endsWith("_id") ||
        key === "id" ||
        lowerKey.includes("updated_at") ||
        lowerKey.includes("created_at") ||
        lowerKey.includes("created_by") ||
        typeof value === "object"
      ) {
        return null;
      }

      const dataType = inferDataType(value);
      const defaults = FIELD_DEFAULTS[dataType];

      return {
        field: key,
        key,
        label: key
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        dataType,
        width: defaults.width,
        sortable: defaults.sortable,
        filterable: defaults.filterable,
        mandatory: mandatoryColumns.includes(key),
        defaultVisible: defaultVisibleColumns.includes(key),
        pinned: pinnedColumns.includes(key),
      };
    })
    .filter(Boolean);

  // Sort columns: employee_name first, then codes, then other names, then others
  const employeeNameField = columns.filter(
    (col) => col.key.toLowerCase() === "employee_name"
  );
  const codeFields = columns.filter(
    (col) =>
      col.key.toLowerCase().includes("code") &&
      col.key.toLowerCase() !== "employee_name"
  );
  const otherNameFields = columns.filter(
    (col) =>
      col.key.toLowerCase().includes("name") &&
      col.key.toLowerCase() !== "employee_name"
  );
  const otherFields = columns.filter(
    (col) =>
      !col.key.toLowerCase().includes("name") &&
      !col.key.toLowerCase().includes("code")
  );

  // Sort each group alphabetically
  codeFields.sort((a, b) => a.label.localeCompare(b.label));
  otherNameFields.sort((a, b) => a.label.localeCompare(b.label));
  otherFields.sort((a, b) => a.label.localeCompare(b.label));

  return [
    ...employeeNameField,
    ...codeFields,
    ...otherNameFields,
    ...otherFields,
  ];
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function TableDataGeneric({
  tableName,
  primaryKey,
  heading,
  data,
  sortname,
  Route,
  DeleteFunc,
  token,
  EditFunc,
  showActions,
  linkType,
  title,
  hideToolbar,
  onclickRow,
  CardData,
  configss,
  onFilterChange,
  onSortChange,
  renderCell,
  config = {},
  onColumnWidthChange,
  onColumnVisibilityChange,
  organizationUserId, // Accept organization user ID
  showLayoutButtons,
}) {
  // ============================================================================
  // STATE & HOOKS
  // ============================================================================

  const { userData } = useAuthStore();
  const [loadedBackendConfig, setLoadedBackendConfig] = useState(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [configSource, setConfigSource] = useState(null); // Track config source
  

  // ============================================================================
  // EXTRACT ORGANIZATION ID
  // ============================================================================

  const orgId = useMemo(() => {
    if (!userData?.organization?.organization_id) {
      console.warn("Organization ID not found in userData");
      return null;
    }

    const id = parseInt(userData.organization.organization_id, 10);
    
    if (isNaN(id)) {
      console.error("Invalid organization ID format:", userData.organization.organization_id);
      return null;
    }

    return id;
  }, [userData]);

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  /**
   * Load saved table layout from backend using POST method with context
   * Priority: Organization User > Organization > General
   */
  const loadLayoutFromBackend = useCallback(async () => {
    if (!orgId || !tableName) {
      console.warn("Missing orgId or tableName, skipping layout fetch");
      setIsLoadingConfig(false);
      return;
    }

    const datagridKey = `${tableName}_grid_${orgId}`;

    try {
      console.log(`Fetching saved layout for: ${datagridKey}`);

      // Build request payload with priority context
      const requestPayload = {
        datagrid_key: datagridKey,
      };
      
      // Add organization_user_id if available (highest priority)
      if (organizationUserId) {
        requestPayload.organization_user_id = organizationUserId;
        console.log('Including organization_user_id:', organizationUserId);
      }
      
      // Add organization_id (second priority)
      if (orgId) {
        requestPayload.organization_id = orgId;
        console.log('Including organization_id:', orgId);
      }

      // console.log('Request payload:', requestPayload);

      // Use POST method with context in body
      const response = await fetch(
        `${MAIN_URL}/api/datagrid/get-by-context`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(requestPayload),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        
        console.log("API Response:", responseData);
        
        // Response format: { message: "...", type: "organization_user" | "organization" | "general", datagrid: {...} }
        if (responseData.datagrid) {
          const savedConfig = responseData.datagrid.datagrid_default_configuration;
          
          if (savedConfig) {
            setLoadedBackendConfig(savedConfig);
            setConfigSource(responseData.type); // Track source
            // console.log(`✓ Layout loaded from ${responseData.type} level:`, savedConfig);
          } else {
            console.log("No configuration found in datagrid");
            setLoadedBackendConfig(null);
            setConfigSource(null);
          }
        } else {
          console.log("No datagrid in response");
          setLoadedBackendConfig(null);
          setConfigSource(null);
        }
      } else if (response.status === 404) {
        console.log("No saved layout found (404), using default configuration");
        setLoadedBackendConfig(null);
        setConfigSource(null);
      } else if (response.status === 422) {
        const errorData = await response.json();
        console.error("Validation errors:", errorData.errors);
        setLoadedBackendConfig(null);
        setConfigSource(null);
      } else {
        console.error(`Failed to fetch layout: ${response.status}`);
        setLoadedBackendConfig(null);
        setConfigSource(null);
      }
    } catch (error) {
      console.error("Error loading saved layout:", error);
      setLoadedBackendConfig(null);
      setConfigSource(null);
    } finally {
      setIsLoadingConfig(false);
    }
  }, [orgId, tableName, token, organizationUserId]);

 /**
 * Save current table layout to backend
 * Saves to organization_user level if organizationUserId is available,
 * otherwise saves to organization level
 */
const saveLayoutToBackend = useCallback(
  async ({ tableName: tbl, layoutData }) => {
    // Validate organization ID
    if (!orgId) {
      const error = "Cannot save layout: Organization ID not found";
      console.error(error);
      throw new Error(error);
    }

    // Build payload based on whether organization_user_id is available
    const payload = {
      organization_id: orgId,
      organization_entity_id: userData?.organization_entity_id || null,
      datagrid_key: `${tableName}_grid_${orgId}`,
      datagrid_default_configuration: layoutData,
    };

    // Add organization_user_id if available (saves to user level)
    if (organizationUserId) {
      payload.organization_user_id = organizationUserId;
      console.log("Saving layout to organization user level with ID:", organizationUserId);
    } else {
      console.log("Saving layout to organization level");
    }

    console.log("Saving layout...", payload);

    try {
      const response = await fetch(
        `${MAIN_URL}/api/organization-datagrids`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        let errorMessage = `Save failed: ${response.status}`;

        try {
          const errorJson = JSON.parse(errorText);
          errorMessage += errorJson.errors
            ? ` - ${JSON.stringify(errorJson.errors)}`
            : errorJson.message
              ? ` - ${errorJson.message}`
              : "";
        } catch (e) {
          errorMessage += errorText ? ` - ${errorText}` : "";
        }

        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("✓ Layout saved successfully", responseData);

      // Update local state with saved configuration
      setLoadedBackendConfig(layoutData);
      // Set config source based on whether it was saved to user or org level
      setConfigSource(organizationUserId ? 'organization_user' : 'organization');

      return true;
    } catch (error) {
      console.error("Error saving layout:", error);
      throw error;
    }
  },
  [orgId, userData, tableName, token, organizationUserId]
);

/**
 * Reset table layout to default configuration
 * If currently using organization_user config, resets to organization level
 * If currently using organization config, resets to general default
 */
const resetLayoutToDefault = useCallback(
  async ({ tableName: tbl }) => {
    // Validate organization ID
    if (!orgId) {
      const error = "Cannot reset layout: Organization ID not found";
      console.error(error);
      throw new Error(error);
    }

    try {
      const datagridKey = `${tableName}_grid_${orgId}`;
      
      // Build DELETE request parameters
      const params = new URLSearchParams({
        datagrid_key: datagridKey,
        organization_id: orgId.toString()
      });
      
      // Add organization_user_id if available and config source is organization_user
      // This ensures we delete the user-level config to fall back to org level
      if (organizationUserId && configSource === 'organization_user') {
        params.append('organization_user_id', organizationUserId.toString());
        console.log("Resetting organization user level config to organization level...");
      } else {
        console.log("Resetting organization level config to general default...");
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
        const errorText = await response.text().catch(() => "");
        let errorMessage = `Reset failed: ${response.status}`;

        try {
          const errorJson = JSON.parse(errorText);
          errorMessage += errorJson.errors
            ? ` - ${JSON.stringify(errorJson.errors)}`
            : errorJson.message
              ? ` - ${errorJson.message}`
              : "";
        } catch (e) {
          errorMessage += errorText ? ` - ${errorText}` : "";
        }

        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      console.log("✓ Layout reset successfully");

      // Reload configuration from backend to get the next level (org or general)
      await loadLayoutFromBackend();

      return true;
    } catch (error) {
      console.error("Error resetting layout:", error);
      throw error;
    }
  },
  [orgId, token, tableName, organizationUserId, configSource, loadLayoutFromBackend]
);


  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Load saved layout on component mount
  useEffect(() => {
    loadLayoutFromBackend();
  }, [loadLayoutFromBackend]);

  // ============================================================================
  // COLUMN PROCESSING
  // ============================================================================

  /**
   * Process columns based on priority:
   * 1. Real-time configuration from form (configss prop)
   * 2. Loaded backend configuration (Organization User > Organization > General)
   * 3. Generated from data
   */
  const processedColumns = useMemo(() => {
  // Don't process until config is loaded
  if (isLoadingConfig) {
    return null;
  }

  // Priority 1: Use real-time configuration from form
  if (configss?.length > 0) {
    return configss.map((col, index) => ({
      field: col.field,
      key: col.field,
      label: col.label,
      dataType: col.dataType || inferDataType(""),
      width: col.width,
      sortable: col.sortable,
      filterable: col.filterable,
      mandatory: col.required,
      defaultVisible: col.visible,
      pinned: col.pinned === "left",
      visible: col.visible,
      order:
        col.field === "Employee_Code" ? 0 : col.field === "Name" ? 1 : index + 2,
    }));
  }

  // Priority 2: Use loaded backend configuration (with fallback hierarchy)
  if (loadedBackendConfig?.columns) {
    console.log(`Using loaded backend configuration from ${configSource} level for columns`);
    return loadedBackendConfig.columns.map((col) => ({
      ...col,
      key: col.key || col.field,
      field: col.field || col.key,
    }));
  }

  // Priority 3: Generate from data
  console.log("Generating columns from data (no saved config found)");
  const generatedColumns = generateColumnsFromData(data, config);
  
  // ✅ Ensure generated columns have all required properties
  return generatedColumns.map((col, index) => ({
    ...col,
    visible: col.defaultVisible !== undefined ? col.defaultVisible : (index < 4),
    order: index
  }));
}, [configss, loadedBackendConfig, data, config, isLoadingConfig, configSource]);


  // ============================================================================
  // TABLE CONFIGURATION
  // ============================================================================

  const tableConfiguration = useMemo(() => {
    // Don't build configuration until columns are processed
    if (!processedColumns || (processedColumns.length === 0 && isLoadingConfig)) {
      return [];
    }

    // Use backend config if available, otherwise use defaults
    const sortConfig = loadedBackendConfig?.sortConfig || 
      (config.sort
        ? [{ key: config.sort.field, direction: config.sort.direction }]
        : [{ key: sortname, direction: "asc" }]);

    const rowsPerPage = loadedBackendConfig?.rowsPerPage || 
      config.pagination?.rowsPerPage || 
      10;

    const filters = loadedBackendConfig?.filters || 
      config.filters || 
      {};

    const search = loadedBackendConfig?.search || 
      config.search || 
      {
        enabled: true,
        placeholder: "Search...",
        fields: [],
      };

    return [
      {
        table: tableName,
        primaryKey: primaryKey,
        heading: heading,
        lastModified: new Date().toISOString(),
        configSource: configSource, // Include config source
        default_config: {
          columns: processedColumns.map((col, index) => ({
            ...col,
            visible:
              col.visible !== undefined
                ? col.visible
                : (config.defaultVisibleColumns || []).includes(col.field) ||
                  index < 4,
            order:
              col.order !== undefined
                ? col.order
                : col.field === "Employee_Code"
                  ? 0
                  : col.field === "Name"
                    ? 1
                    : config.defaultVisibleColumns?.indexOf(col.field) ?? index,
          })),
          sortConfig,
          rowsPerPage,
          filters,
          search,
        },
        user_config: {
          columns: processedColumns.map((col, index) => ({
            ...col,
            key: col.key,
            field: col.field,
            visible:
              col.visible !== undefined
                ? col.visible
                : (config.defaultVisibleColumns || []).includes(col.field) ||
                  index < 4,
            order:
              col.order !== undefined
                ? col.order
                : col.field === "Employee_Code"
                  ? 0
                  : col.field === "Name"
                    ? 1
                    : config.defaultVisibleColumns?.indexOf(col.field) ?? index,
            width: col.width,
            sortDirection: null,
            filterValue: null,
            pinned:
              col.pinned !== undefined
                ? col.pinned
                : col.field === "Employee_Code" || col.field === "Name",
            dataType: col.dataType,
          })),
          sortConfig,
          rowsPerPage,
          filters,
          search,
          lastModified: new Date().toISOString(),
        },
      },
    ];
  }, [
    processedColumns,
    tableName,
    primaryKey,
    heading,
    config,
    sortname,
    loadedBackendConfig,
    isLoadingConfig,
    configSource,
  ]);

  // ============================================================================
  // RENDER
  // ============================================================================

  // Don't render table until configuration is loaded
  if (isLoadingConfig) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <p>Loading table configuration...</p>
      </div>
    );
  }

  return (
    <>
      {/* NEW: Show config source indicator */}
         {/* {configSource && (
        <div style={{
          padding: '8px 16px',
          marginBottom: '8px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#1976d2'
        }}>
          Configuration loaded from: <strong>{configSource.replace('_', ' ')}</strong> level
        </div>
      )}  */}
      
      <Customisetable
        configuration={tableConfiguration}
        tableName={tableName}
        Route={Route}
        DeleteFunc={DeleteFunc}
        EditFunc={EditFunc}
        token={token}
        mainKey={primaryKey}
        mainData={data}
        showActions={showActions}
        hideToolbar={hideToolbar}
        CardColoumn={CardData}
        sortname={sortname}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
        configss={configss}
        renderCell={renderCell}
        onColumnWidthChange={onColumnWidthChange}
        onColumnVisibilityChange={onColumnVisibilityChange}
        linkType={linkType}
        title={title}
        onclickRow={onclickRow}
        onSaveLayout={saveLayoutToBackend}
        onResetLayout={resetLayoutToDefault}
        loadedBackendConfig={loadedBackendConfig}
        configSource={configSource}
        showLayoutButtons={true}
      />
    </>
  );
}

export default TableDataGeneric;






