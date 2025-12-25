import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FilterService from "./FilterService";

/**
 * FilterPicker Component
 * Inline filter picker with hierarchical groups, search, and popular filters
 * Used inside FilterBuilder dialog
 */
function FilterPicker({
  module,
  onFieldSelect,
  selectedFields = [],
  searchQuery = "",
}) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedChildGroups, setExpandedChildGroups] = useState({});

  // Load metadata on mount or when module changes
  useEffect(() => {
    if (!module) return;

    const loadMetadata = async () => {
      setLoading(true);
      try {
        const result = await FilterService.getFilterMetadata(module);
        if (result.success) {
          setMetadata(result);
          // Expand groups that are expanded by default
          const defaultExpanded = {};
          if (result.groups) {
            result.groups.forEach((group) => {
              if (group.is_expanded_by_default) {
                defaultExpanded[group.filter_group_id] = true;
              }
            });
          }
          setExpandedGroups(defaultExpanded);
        }
      } catch (error) {
        console.error("Error loading filter metadata:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, [module]);

  // Toggle group expansion
  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Toggle child group expansion
  const toggleChildGroup = (parentId, childId) => {
    const key = `${parentId}-${childId}`;
    setExpandedChildGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter fields based on search query
  const filterFields = (fields, query) => {
    if (!query) return fields;
    const lowerQuery = query.toLowerCase();
    return fields.filter(
      (field) =>
        field.label?.toLowerCase().includes(lowerQuery) ||
        field.field_key?.toLowerCase().includes(lowerQuery)
    );
  };

  // Filter groups based on search query
  const filterGroups = (groups, query) => {
    if (!query) return groups;
    const lowerQuery = query.toLowerCase();
    return groups
      .map((group) => {
        const filteredFields = filterFields(group.fields || [], query);
        const filteredChildGroups = (group.child_groups || []).map(
          (childGroup) => ({
            ...childGroup,
            fields: filterFields(childGroup.fields || [], query),
          })
        );

        // Include group if name matches or has matching fields
        const groupMatches =
          group.group_label?.toLowerCase().includes(lowerQuery) ||
          group.group_name?.toLowerCase().includes(lowerQuery) ||
          filteredFields.length > 0 ||
          filteredChildGroups.some((cg) => cg.fields.length > 0);

        if (groupMatches) {
          return {
            ...group,
            fields: filteredFields,
            child_groups: filteredChildGroups,
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!metadata) return { popularFilters: [], groups: [] };

    return {
      popularFilters: filterFields(metadata.popular_filters || [], searchQuery),
      groups: filterGroups(metadata.groups || [], searchQuery),
    };
  }, [metadata, searchQuery]);

  // Handle field selection
  const handleFieldClick = (field) => {
    if (onFieldSelect) {
      onFieldSelect(field);
    }
  };

  // Check if field is selected
  const isFieldSelected = (fieldKey) => {
    return selectedFields.includes(fieldKey);
  };

  // Render a single field item
  const renderFieldItem = (field, level = 0) => {
    const isSelected = isFieldSelected(field.field_key);
    return (
      <ListItem key={field.field_key} disablePadding sx={{ pl: level * 2 + 2 }}>
        <ListItemButton
          onClick={() => handleFieldClick(field)}
          selected={isSelected}
          sx={{
            "&.Mui-selected": {
              backgroundColor: "action.selected",
            },
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Checkbox
              edge="start"
              checked={isSelected}
              tabIndex={-1}
              disableRipple
              onClick={(e) => {
                e.stopPropagation();
                handleFieldClick(field);
              }}
              size="small"
            />
          </ListItemIcon>
          <ListItemText
            primary={field.label || field.field_key}
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontWeight: isSelected ? 600 : 400,
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  // Render a child group
  const renderChildGroup = (childGroup, parentId) => {
    const key = `${parentId}-${childGroup.filter_group_id}`;
    const isExpanded =
      expandedChildGroups[key] ?? childGroup.is_expanded_by_default ?? false;
    const hasFields = (childGroup.fields || []).length > 0;

    if (!hasFields) return null;

    return (
      <Box key={childGroup.filter_group_id} sx={{ pl: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() =>
              toggleChildGroup(parentId, childGroup.filter_group_id)
            }
            sx={{ py: 0.5 }}
          >
            {isExpanded ? (
              <ExpandLessIcon fontSize="small" sx={{ mr: 1 }} />
            ) : (
              <ExpandMoreIcon fontSize="small" sx={{ mr: 1 }} />
            )}
            <ListItemText
              primary={childGroup.group_label || childGroup.group_name}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {(childGroup.fields || []).map((field) =>
              renderFieldItem(field, 2)
            )}
          </List>
        </Collapse>
      </Box>
    );
  };

  // Render a parent group
  const renderGroup = (group) => {
    const isExpanded =
      expandedGroups[group.filter_group_id] ??
      group.is_expanded_by_default ??
      false;
    const hasFields = (group.fields || []).length > 0;
    const hasChildGroups = (group.child_groups || []).length > 0;

    if (!hasFields && !hasChildGroups) return null;

    return (
      <Box key={group.filter_group_id} sx={{ mb: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => toggleGroup(group.filter_group_id)}
            sx={{ py: 1 }}
          >
            {isExpanded ? (
              <ExpandLessIcon sx={{ mr: 1 }} />
            ) : (
              <ExpandMoreIcon sx={{ mr: 1 }} />
            )}
            <ListItemText
              primary={
                (group.group_label || group.group_name) === "All Filters"
                  ? "Other Filters"
                  : group.group_label || group.group_name
              }
              primaryTypographyProps={{
                fontSize: "0.9375rem",
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        </ListItem>
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Direct fields in this group */}
            {(group.fields || []).map((field) => renderFieldItem(field, 1))}
            {/* Child groups */}
            {(group.child_groups || []).map((childGroup) =>
              renderChildGroup(childGroup, group.filter_group_id)
            )}
          </List>
        </Collapse>
        <Divider sx={{ my: 1 }} />
      </Box>
    );
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Content - scrollable */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {loading ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            Loading filters...
          </Typography>
        ) : (
          <>
            {/* Popular Filters Section */}
            {filteredData.popularFilters.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    px: 2,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: 0.5,
                  }}
                >
                  Popular Filters
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <List disablePadding>
                  {filteredData.popularFilters.map((field) =>
                    renderFieldItem(field, 0)
                  )}
                </List>
              </Box>
            )}

            {/* All Filters Section */}
            {filteredData.groups.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    px: 2,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: 0.5,
                  }}
                >
                  All Filters
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List disablePadding>
                  {filteredData.groups.map((group) => renderGroup(group))}
                </List>
              </Box>
            )}

            {/* Empty state */}
            {!loading &&
              filteredData.popularFilters.length === 0 &&
              filteredData.groups.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  {searchQuery
                    ? "No filters found matching your search"
                    : "No filters available"}
                </Typography>
              )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default FilterPicker;
