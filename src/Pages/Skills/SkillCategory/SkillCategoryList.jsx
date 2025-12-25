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
  Description,
  Add,
  Edit,
  Delete,
  GridView,
  ViewList,
  Search,
  Close,
  Layers,
  LocalOffer,
  AutoAwesome,
} from "@mui/icons-material";

import { MAIN_URL } from "../../../Configurations/Urls";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";

function TreeView({
  categories,
  expandedCategories,
  expandedSubcategories,
  toggleCategory,
  toggleSubcategory,
  onEdit,
  onDelete,
  onAdd,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(
          category.organization_skill_category_id
        );
        const subcategoryCount = category.subcategories?.length || 0;
        const skillCount =
          category.subcategories?.reduce(
            (acc, s) => acc + (s.skills?.length || 0),
            0
          ) || 0;

        return (
          <Paper
            key={category.organization_skill_category_id}
            variant="outlined"
            sx={{ overflow: "hidden", borderRadius: 2 }}
          >
            {/* Category Header */}
            <Box
              onClick={() =>
                toggleCategory(category.organization_skill_category_id)
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
                  <Typography variant="subtitle1"  fontWeight="bold"   noWrap>
                    {category.skill_category_name}
                  </Typography>
                  {category.skill_category_short_name && (
                    <Chip
                      label={category.skill_category_short_name}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
                {category.description && (
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {category.description}
                  </Typography>
                )}
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {subcategoryCount} subcategories • {skillCount} skills
              </Typography>
              <Box
                onClick={(e) => e.stopPropagation()}
                sx={{ display: "flex", gap: 0.5 }}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    onEdit("category", category.organization_skill_category_id)
                  }
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() =>
                    onDelete(
                      "category",
                      category.organization_skill_category_id,
                      category.skill_category_name
                    )
                  }
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Subcategories */}
            <Collapse in={isExpanded}>
              {category.subcategories && category.subcategories.length > 0 && (
                <Box sx={{ bgcolor: "action.hover" }}>
                  {category.subcategories.map((subcategory) => {
                    const isSubExpanded = expandedSubcategories.has(
                      subcategory.organization_skill_subcategory_id
                    );
                    const subSkillCount = subcategory.skills?.length || 0;

                    return (
                      <Box key={subcategory.organization_skill_subcategory_id}>
                        <Box
                          onClick={() =>
                            toggleSubcategory(
                              subcategory.organization_skill_subcategory_id
                            )
                          }
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            px: 2,
                            py: 1,
                            pl: 6,
                            cursor: "pointer",
                            "&:hover": { bgcolor: "action.selected" },
                            borderTop: 1,
                            borderColor: "divider",
                            bgcolor:
                              isSubExpanded && subSkillCount > 0
                                ? "action.selected"
                                : "transparent",
                          }}
                        >
                          <IconButton size="small">
                            {isSubExpanded ? (
                              <ExpandMore fontSize="small" />
                            ) : (
                              <ChevronRight fontSize="small" />
                            )}
                          </IconButton>
                          <LocalOffer fontSize="small" color="action" />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                noWrap
                              >
                                {subcategory.skill_subcategory_name}
                              </Typography>
                              {subcategory.skill_subcategory_short_name && (
                                <Chip
                                  label={
                                    subcategory.skill_subcategory_short_name
                                  }
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>

                          <Typography variant="caption" color="text.secondary">
                            {subSkillCount} skills
                          </Typography>
                          <Box
                            onClick={(e) => e.stopPropagation()}
                            sx={{ display: "flex", gap: 0.5 }}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                onEdit(
                                  "subcategory",
                                  subcategory.organization_skill_subcategory_id
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
                                  "subcategory",
                                  subcategory.organization_skill_subcategory_id,
                                  subcategory.skill_subcategory_name
                                )
                              }
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                      

                        <Collapse in={isSubExpanded}>
                          <Box sx={{ bgcolor: "background.paper" }}>
                            {/* If no skills */}
                            {(!subcategory.skills ||
                              subcategory.skills.length === 0) && (
                              <Box
                                sx={{
                                  px: 2,
                                  py: 2,
                                  pl: 15,
                                  textAlign: "center",
                                  borderTop: 1,
                                  borderColor: "divider",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}
                                >
                                  No skills yet
                                </Typography>

                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<Add />}
                                  onClick={() => onAdd("skill", subcategory)}
                                >
                                  Add Skill
                                </Button>
                              </Box>
                            )}

                            {/* If skills exist → list them */}
                            {subcategory.skills?.map((skill) => (
                              <Box
                                key={skill.organization_skill_id}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                  px: 2,
                                  py: 1,
                                  pl: 15,
                                  borderTop: 1,
                                  borderColor: "divider",
                                  "&:hover": { bgcolor: "action.hover" },
                                }}
                              >
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography variant="body2" noWrap>
                                    {skill.skill_name}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      onEdit(
                                        "skill",
                                        skill.organization_skill_id
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
                                        "skill",
                                        skill.organization_skill_id,
                                        skill.skill_name
                                      )
                                    }
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            ))}

                            {/* Always show Add Skill button */}
                            <Box
                              onClick={() => onAdd("skill", subcategory)}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                px: 2,
                                py: 1,
                                pl: 15,
                                cursor: "pointer",
                                "&:hover": { bgcolor: "action.selected" },
                                borderTop: 1,
                                borderColor: "divider",
                              }}
                            >
                              <Add fontSize="small" color="action" />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Add Skill
                              </Typography>
                            </Box>
                          </Box>
                        </Collapse>
                      </Box>
                    );
                  })}
                  {/* Add Subcategory Button */}
                  <Box
                    onClick={() => onAdd("subcategory", category)}
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
                      Add Subcategory
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Empty state for category */}
              {(!category.subcategories ||
                category.subcategories.length === 0) && (
                <Box sx={{ px: 2, py: 4, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    No subcategories yet
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => onAdd("subcategory", category)}
                  >
                    Add Subcategory
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

export default function SkillsHierarchy() {
  // const [categories] = useState(mockCategories)
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("tree");

  const [categories, setCategories] = useState([]);

  const { userData } = useAuthStore();
  const org = userData?.organization;

  const navigate = useNavigate();

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: "category",
    id: "",
    name: "",
  });

  // Toggle category expansion
  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const fetchSkillHierarchy = async () => {
    try {
      const res = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/skill-hierarchy`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // FIX: Rename skill_category → subcategories
      const formatted = res?.data?.categories?.map((cat) => ({
        ...cat,
        subcategories: cat.skill_category || [],
      }));

      setCategories(formatted);
    } catch (err) {
      console.error("Error fetching skill hierarchy", err);
    }
  };




  // hamndle delete for  subcategory


  let deletedsubcategory = async (id) => {
  try {
    const org_id = org.organization_id;
    const response = await axios.delete(
      `${MAIN_URL}/api/organizations/${org_id}/skill-subcategory/${id}`,
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
        "Failed to delete SubCategory";

      toast.error(errorMessage);
      console.warn("Deletion error:", response.status, response.data);
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





  let deletedcategory = async (id) => {
  try {
    const org_id = org.organization_id;
    const response = await axios.delete(
      `${MAIN_URL}/api/organizations/${org_id}/skill-category/${id}`,
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
        "Failed to delete Category";

      toast.error(errorMessage);
      console.warn("Deletion error:", response.status, response.data);
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



  let deletedskills = async (id) => {
  try {
    const org_id = org.organization_id;
    const response = await axios.delete(
      `${MAIN_URL}/api/organizations/${org_id}/skills/${id}`,
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
        "Failed to delete Skills";

      toast.error(errorMessage);
      console.warn("Deletion error:", response.status, response.data);
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


  useEffect(() => {
    fetchSkillHierarchy();
  }, [org?.organization_id]);

  // Toggle subcategory expansion
  const toggleSubcategory = useCallback((subcategoryId) => {
    setExpandedSubcategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId);
      } else {
        newSet.add(subcategoryId);
      }
      return newSet;
    });
  }, []);

  // Expand all
  const expandAll = () => {
    const allCategoryIds = categories.map(
      (c) => c.organization_skill_category_id
    );
    const allSubcategoryIds = categories.flatMap(
      (c) =>
        c.subcategories?.map((s) => s.organization_skill_subcategory_id) || []
    );
    setExpandedCategories(new Set(allCategoryIds));
    setExpandedSubcategories(new Set(allSubcategoryIds));
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedCategories(new Set());
    setExpandedSubcategories(new Set());
  };

  // Filter data based on search
  const filteredCategories = categories
    .map((category) => {
      const matchedSubcategories = category.subcategories
        ?.map((subcategory) => {
          const matchedSkills = subcategory.skills?.filter(
            (skill) =>
              skill.skill_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              skill.skill_short_name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          );

          const subcategoryMatches =
            subcategory.skill_subcategory_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            subcategory.skill_subcategory_short_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase());

          if (
            subcategoryMatches ||
            (matchedSkills && matchedSkills.length > 0)
          ) {
            return {
              ...subcategory,
              skills: subcategoryMatches ? subcategory.skills : matchedSkills,
            };
          }
          return null;
        })
        .filter(Boolean);

      const categoryMatches =
        category.skill_category_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        category.skill_category_short_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      if (
        categoryMatches ||
        (matchedSubcategories && matchedSubcategories.length > 0)
      ) {
        return {
          ...category,
          subcategories: categoryMatches
            ? category.subcategories
            : matchedSubcategories,
        };
      }
      return null;
    })
    .filter(Boolean);

  // Count totals
  const totalCategories = categories.length;
  const totalSubcategories = categories.reduce(
    (acc, c) => acc + (c.subcategories?.length || 0),
    0
  );
  const totalSkills = categories.reduce(
    (acc, c) =>
      acc +
      (c.subcategories?.reduce((a, s) => a + (s.skills?.length || 0), 0) || 0),
    0
  );

  // Navigation handlers
  const handleNavigate = (route, state = null) => {
    navigate(route, state ? { state } : undefined);
  };

  const handleEdit = (type, id) => {
    const routes = {
      category: `/organization/skill-category/edit/${id}`,
      subcategory: `/organization/skill-subcategory/edit/${id}`,
      skill: `/organization/skills/edit/${id}`,
    };
    handleNavigate(routes[type]);
  };

  const handleAdd = (type, data = null) => {
    const routes = {
      category: "/organization/skill-category/add",
      subcategory: "/organization/skill-subcategory/add",
      skill: "/organization/skills/add",
    };
    handleNavigate(routes[type], { stateData: data });
  };

  const handleDelete = (type, id, name) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  // const confirmDelete = async () => {
  //   console.log(`Delete ${deleteDialog.type}:`, deleteDialog.id);
  //   setDeleteDialog({ open: false, type: "category", id: "", name: "" });
  // };


  const confirmDelete = async () => {
  const { type, id } = deleteDialog;

  try {
    if (type === "subcategory") {
      await deletedsubcategory(id);
    } 
    else if (type === "category") {
      await deletedcategory(id);
    } 
    else if (type === "skill") {
      await deletedskills(id);
    }

    // Close dialog
    setDeleteDialog({ open: false, type: "", id: "", name: "" });

    // Refresh hierarchy list
    fetchSkillHierarchy();
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
                Skills Management
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Organize and manage your organization's skill hierarchy
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
                label={`${totalCategories} Categories`}
                variant="outlined"
              />
              <Chip
                icon={<LocalOffer fontSize="small" />}
                label={`${totalSubcategories} Subcategories`}
                variant="outlined"
              />
              <Chip
                icon={<AutoAwesome fontSize="small" />}
                label={`${totalSkills} Skills`}
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
              placeholder="Search categories, subcategories, or skills..."
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
                onClick={() => handleAdd("category")}
              >
                Add Category
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
            categories={filteredCategories}
            expandedCategories={expandedCategories}
            expandedSubcategories={expandedSubcategories}
            toggleCategory={toggleCategory}
            toggleSubcategory={toggleSubcategory}
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
            {filteredCategories.map((category) => (
              <Card
                key={category.organization_skill_category_id}
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
                            "category",
                            category.organization_skill_category_id
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
                            "category",
                            category.organization_skill_category_id,
                            category.skill_category_name
                          )
                        }
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                  title={category.skill_category_name}
                  subheader={
                    category.skill_category_short_name && (
                      <Chip
                        label={category.skill_category_short_name}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    )
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  {category.description && (
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
                      {category.description}
                    </Typography>
                  )}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {category.subcategories?.slice(0, 3).map((subcategory) => (
                      <Box
                        key={subcategory.organization_skill_subcategory_id}
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
                            <LocalOffer fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight={500} noWrap>
                              {subcategory.skill_subcategory_name}
                            </Typography>
                          </Box>

                          <Chip
                            label={`${subcategory.skills?.length || 0} skills`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>

                        {subcategory.skills &&
                          subcategory.skills.length > 0 && (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                                mt: 1,
                                pl: 3.5,
                              }}
                            >
                              {subcategory.skills.slice(0, 3).map((skill) => (
                                <Chip
                                  key={skill.organization_skill_id}
                                  label={skill.skill_name}
                                  size="small"
                                />
                              ))}
                              {subcategory.skills.length > 3 && (
                                <Chip
                                  label={`+${subcategory.skills.length - 3}`}
                                  size="small"
                                />
                              )}
                            </Box>
                          )}
                      </Box>
                    ))}
                    {category.subcategories &&
                      category.subcategories.length > 3 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          align="center"
                        >
                          +{category.subcategories.length - 3} more
                          subcategories
                        </Typography>
                      )}
                    {(!category.subcategories ||
                      category.subcategories.length === 0) && (
                      <Box sx={{ textAlign: "center", py: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          No subcategories
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
            {filteredCategories.length === 0 && (
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
                    ? `No skills match "${searchQuery}"`
                    : "Start by adding your first skill category"}
                </Typography>
                {!searchQuery && (
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    startIcon={<Add />}
                    onClick={() => handleAdd("category")}
                  >
                    Add Category
                  </Button>
                )}
              </Box>
            )}
          </Box>
        )}

        {filteredCategories.length === 0 && (
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
                ? `No skills match "${searchQuery}"`
                : "Start by adding your first skill category"}
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                startIcon={<Add />}
                onClick={() => handleAdd("category")}
              >
                Add Category
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
            {deleteDialog.type === "category" &&
              " All subcategories and skills under this category will also be deleted."}
            {deleteDialog.type === "subcategory" &&
              " All skills under this subcategory will also be deleted."}
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
