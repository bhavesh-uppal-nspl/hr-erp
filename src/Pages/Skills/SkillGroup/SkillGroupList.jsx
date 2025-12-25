
"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Collapse,
  Paper,
} from "@mui/material";
import {
  ChevronRight,
  ExpandMore,
  Folder,
  FolderOpen,
  Add,
  Edit,
  Delete,
  GridView,
  ViewList,
  Search,
  Close,
  Layers,
  AutoAwesome,
} from "@mui/icons-material";

import { MAIN_URL } from "../../../Configurations/Urls";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";


function TreeView({
  groups,
  expandedGroups,
  toggleGroup,
  onEdit,
  onDelete,
  onAdd,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {groups.map((group) => {
        const isExpanded = expandedGroups.has(
          group.organization_skill_element_group_id
        );
        const elementCount = group.elements?.length || 0;

        return (
          <Paper
            key={group.organization_skill_element_group_id}
            variant="outlined"
            sx={{ overflow: "hidden", borderRadius: 2 }}
          >
            {/* Group Header */}
            <Box
              onClick={() =>
                toggleGroup(group.organization_skill_element_group_id)
              }
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.5,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
                borderBottom: isExpanded ? 1 : 0,
                borderColor: "divider",
              }}
            >
              <IconButton size="small">
                {isExpanded ? <ExpandMore /> : <ChevronRight />}
              </IconButton>
              {isExpanded ? (
                <FolderOpen color="primary" />
              ) : (
                <Folder color="action" />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight={500} noWrap>
                    {group.skill_element_group_name}
                  </Typography>
                  {group.skill_element_group_short_name && (
                    <Chip
                      label={group.skill_element_group_short_name}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
                {group.description && (
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {group.description}
                  </Typography>
                )}
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {elementCount} elements
              </Typography>
              <Box
                onClick={(e) => e.stopPropagation()}
                sx={{ display: "flex", gap: 0.5 }}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    onEdit("group", group.organization_skill_element_group_id)
                  }
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() =>
                    onDelete(
                      "group",
                      group.organization_skill_element_group_id,
                      group.skill_element_group_name
                    )
                  }
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Elements */}
            <Collapse in={isExpanded}>
              {group.elements && group.elements.length > 0 && (
                <Box sx={{ bgcolor: "background.paper" }}>
                  {group.elements.map((element) => (
                    <Box
                      key={element.organization_skill_element_id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 2,
                        py: 1,
                        pl: 6,
                        borderTop: 1,
                        borderColor: "divider",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <AutoAwesome fontSize="small" color="action" />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2" fontWeight={500} noWrap>
                            {element.skill_element_name}
                          </Typography>
                          {element.skill_element_short_name && (
                            <Chip
                              label={element.skill_element_short_name}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        {element.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {element.description}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            onEdit(
                              "element",
                              element.organization_skill_element_id
                            )
                          }
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            onDelete(
                              "element",
                              element.organization_skill_element_id,
                              element.skill_element_name
                            )
                          }
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                  {/* Add Element Button */}
                  <Box
                    onClick={() => onAdd("element", group)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1,
                      pl: 6,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.selected" },
                      borderTop: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Add fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Add Element
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Empty state for group */}
              {(!group.elements || group.elements.length === 0) && (
                <Box sx={{ px: 2, py: 4, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    No elements yet
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => onAdd("element", group)}
                  >
                    Add Element
                  </Button>
                </Box>
              )}
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
}

export default function ElementHierarchy() {
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("tree");
  const [groups, setGroups] = useState([]);

  const { userData } = useAuthStore();
  const org = userData?.organization;
  const navigate = useNavigate();

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: "group",
    id: "",
    name: "",
  });

  // Toggle group expansion
  const toggleGroup = useCallback((groupId) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  }, []);

  const fetchElementHierarchy = async () => {
    try {
      const res = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/group-hierarchy`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setGroups(res?.data?.groups || []);
    } catch (err) {
      console.error("Error fetching element hierarchy", err);
      toast.error("Failed to fetch element hierarchy");
    }
  };

  useEffect(() => {
    fetchElementHierarchy();
  }, [org?.organization_id]);

  // Delete handlers
  const deleteGroup = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/skill-element-group/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Group";
        toast.error(errorMessage);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const deleteElement = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/skill-element/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        const errorMessage =
          response.data.message ||
          response.data.errors?.[Object.keys(response.data.errors)[0]]?.[0] ||
          "Failed to delete Element";
        toast.error(errorMessage);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
      console.error("Delete failed:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  // Expand/Collapse all
  const expandAll = () => {
    const allGroupIds = groups.map(
      (g) => g.organization_skill_element_group_id
    );
    setExpandedGroups(new Set(allGroupIds));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  // Filter data based on search
  const filteredGroups = groups
    .map((group) => {
      const matchedElements = group.elements?.filter(
        (element) =>
          element.skill_element_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          element.skill_element_short_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );

      const groupMatches =
        group.skill_element_group_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        group.skill_element_group_short_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      if (groupMatches || (matchedElements && matchedElements.length > 0)) {
        return {
          ...group,
          elements: groupMatches ? group.elements : matchedElements,
        };
      }
      return null;
    })
    .filter(Boolean);

  // Count totals
  const totalGroups = groups.length;
  const totalElements = groups.reduce(
    (acc, g) => acc + (g.elements?.length || 0),
    0
  );

  // Navigation handlers
  const handleNavigate = (route, state = null) => {
    navigate(route, state ? { state } : undefined);
  };

  const handleEdit = (type, id) => {
    const routes = {
      group: `/organization/skill-element-group/edit/${id}`,
      element: `/organization/skill-element/edit/${id}`,
    };
    handleNavigate(routes[type]);
  };

  const handleAdd = (type, data = null) => {
    const routes = {
      group: "/organization/skill-element-group/add",
      element: "/organization/skill-element/add",
    };
    handleNavigate(routes[type], { stateData: data });
  };

  const handleDelete = (type, id, name) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteDialog;

    try {
      if (type === "group") {
        await deleteGroup(id);
      } else if (type === "element") {
        await deleteElement(id);
      }

      setDeleteDialog({ open: false, type: "", id: "", name: "" });
      fetchElementHierarchy();
    } catch (error) {
      console.log("Delete failed:", error);
    }
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Header */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, sm: 3, lg: 4 },
            py: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { md: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
               Skill Element Groups
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Organize and manage your organization's element hierarchy
              </Typography>
            </Box>
            {/* Stats */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={<Layers fontSize="small" />}
                label={`${totalGroups} Groups`}
                variant="outlined"
              />
              <Chip
                icon={<AutoAwesome fontSize="small" />}
                label={`${totalElements} Elements`}
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, sm: 3, lg: 4 },
            py: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { sm: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Search */}
            <TextField
              placeholder="Search groups or elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{ maxWidth: 400, flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery("")}>
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Button variant="outlined" size="small" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="outlined" size="small" onClick={collapseAll}>
                Collapse All
              </Button>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
              >
                <ToggleButton value="tree">
                  <ViewList fontSize="small" />
                </ToggleButton>
                <ToggleButton value="grid">
                  <GridView fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <Button
                variant="contained"
                size="small"
                startIcon={<Add />}
                onClick={() => handleAdd("group")}
              >
                Add Group
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, py: 3 }}
      >
        {viewMode === "tree" ? (
          <TreeView
            groups={filteredGroups}
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {filteredGroups.map((group) => (
              <Card
                key={group.organization_skill_element_group_id}
                sx={{ height: "100%" }}
              >
                <CardHeader
                  avatar={
                    <Box
                      sx={{ p: 1, bgcolor: "action.hover", borderRadius: 2 }}
                    >
                      <Layers color="primary" />
                    </Box>
                  }
                  action={
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleEdit(
                            "group",
                            group.organization_skill_element_group_id
                          )
                        }
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleDelete(
                            "group",
                            group.organization_skill_element_group_id,
                            group.skill_element_group_name
                          )
                        }
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                  title={group.skill_element_group_name}
                  subheader={
                    group.skill_element_group_short_name && (
                      <Chip
                        label={group.skill_element_group_short_name}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    )
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  {group.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {group.description}
                    </Typography>
                  )}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {group.elements?.slice(0, 3).map((element) => (
                      <Box
                        key={element.organization_skill_element_id}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: "action.hover",
                          "&:hover": { bgcolor: "action.selected" },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              minWidth: 0,
                            }}
                          >
                            <AutoAwesome fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight={500} noWrap>
                              {element.skill_element_name}
                            </Typography>
                          </Box>
                          {element.skill_element_short_name && (
                            <Chip
                              label={element.skill_element_short_name}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    ))}
                    {group.elements && group.elements.length > 3 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        align="center"
                      >
                        +{group.elements.length - 3} more elements
                      </Typography>
                    )}
                    {(!group.elements || group.elements.length === 0) && (
                      <Box sx={{ textAlign: "center", py: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          No elements
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {filteredGroups.length === 0 && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "action.hover",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Search sx={{ fontSize: 32 }} color="action" />
            </Box>
            <Typography variant="h6" gutterBottom>
              No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery
                ? `No elements match "${searchQuery}"`
                : "Start by adding your first element group"}
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                startIcon={<Add />}
                onClick={() => handleAdd("group")}
              >
                Add Group
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, open: false }))}
      >
        <DialogTitle>Delete {deleteDialog.type}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteDialog.name}"? This action
            cannot be undone.
            {deleteDialog.type === "group" &&
              " All elements under this group will also be deleted."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog((prev) => ({ ...prev, open: false }))
            }
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
