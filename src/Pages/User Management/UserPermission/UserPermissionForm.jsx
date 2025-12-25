

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControlLabel,
  Typography,
  Checkbox,
  MenuItem,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import { fetchModules } from "../../../Apis/Modules";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import usePermissionDataStore from "../../../Zustand/Store/usePermissionDataStore";
import { getOrganizationUser } from "../../../Apis/Organization-User";

function UserPermissionForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const { refreshPermissions } = usePermissionDataStore();
  const org = userData?.organization;

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    application_user_id: "",
    permissions: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [modulesWithCategories, setModulesWithCategories] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [initialPermissions, setInitialPermissions] = useState([]);
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(null);
  const [changeReason, setChangeReason] = useState("");

  let navigate = useNavigate();

  // Debug: Log organization data on mount and when it changes
  useEffect(() => {
    console.log("Organization data:", org);
    console.log("Organization ID:", org?.organization_id);
    console.log("User data:", userData);
  }, [org, userData]);

  // Group module actions by category
  const groupActionsByCategory = (actions) => {
    const grouped = {};

    actions.forEach((action) => {
      const category = action.category || "Uncategorized";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(action);
    });

    return Object.entries(grouped).map(([category_name, actions]) => ({
      category_name,
      actions,
    }));
  };

  const togglePermission = (actionId) => {
    const wasInitiallyAllowed = initialPermissions.some(
      (p) => p.application_module_action_id === actionId && p.permission_allowed
    );
    const isCurrentlyAllowed = isPermissionAllowed(actionId);

    // If it was initially allowed and trying to change
    if (wasInitiallyAllowed && isCurrentlyAllowed) {
      setPendingToggle(actionId);
      setReasonDialogOpen(true);
      return;
    }

    // Otherwise, toggle normally
    setFormData((prev) => {
      const existingIndex = prev.permissions.findIndex(
        (p) => p.application_module_action_id === actionId
      );
      let updatedPermissions;
      if (existingIndex !== -1) {
        updatedPermissions = [...prev.permissions];
        updatedPermissions[existingIndex].permission_allowed =
          !updatedPermissions[existingIndex].permission_allowed;
      } else {
        updatedPermissions = [
          ...prev.permissions,
          { application_module_action_id: actionId, permission_allowed: true },
        ];
      }
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const isPermissionAllowed = (actionId) => {
    const perm = formData.permissions.find(
      (p) => p.application_module_action_id === actionId && p.permission_allowed
    );
    return perm !== undefined;
  };

  // Check if permission was initially loaded (from role)
  const wasInitiallyAllowed = (actionId) => {
    return initialPermissions.some(
      (p) => p.application_module_action_id === actionId && p.permission_allowed
    );
  };

  // Get color for permission box
  const getPermissionColor = (actionId) => {
    const isAllowed = isPermissionAllowed(actionId);
    const wasInitial = wasInitiallyAllowed(actionId);

    if (wasInitial && !isAllowed) return "#ffcdd2"; // Red for removed permissions
    if (!isAllowed) return "#fff";
    if (wasInitial) return "#e3f2fd"; // Blue for initial permissions
    return "#a5d6a7"; // Darker green for newly added permissions
  };

  const getPermissionHoverColor = (actionId) => {
    const isAllowed = isPermissionAllowed(actionId);
    const wasInitial = wasInitiallyAllowed(actionId);

    if (wasInitial && !isAllowed) return "#ef9a9a"; // Darker red hover
    if (!isAllowed) return "#f5f5f5";
    if (wasInitial) return "#bbdefb"; // Darker blue
    return "#81c784"; // Darker green hover
  };

  const handleReasonSubmit = () => {
    if (!changeReason.trim()) {
      toast.error("Please provide a reason for removing this permission.");
      return;
    }

    // Perform the toggle
    setFormData((prev) => {
      const existingIndex = prev.permissions.findIndex(
        (p) => p.application_module_action_id === pendingToggle
      );
      let updatedPermissions;
      if (existingIndex !== -1) {
        updatedPermissions = [...prev.permissions];
        updatedPermissions[existingIndex].permission_allowed =
          !updatedPermissions[existingIndex].permission_allowed;
      } else {
        updatedPermissions = [
          ...prev.permissions,
          {
            application_module_action_id: pendingToggle,
            permission_allowed: false,
          },
        ];
      }
      return { ...prev, permissions: updatedPermissions };
    });

    // Log or save reason
    console.log("Permission change reason:", changeReason);
    toast.success("Permission updated with reason.");

    // Reset dialog
    setReasonDialogOpen(false);
    setPendingToggle(null);
    setChangeReason("");
  };

  const handleReasonCancel = () => {
    setReasonDialogOpen(false);
    setPendingToggle(null);
    setChangeReason("");
  };

  // Toggle all permissions in a category
  const toggleCategoryPermissions = (categoryActions, allChecked) => {
    setFormData((prev) => {
      let updatedPermissions = [...prev.permissions];

      categoryActions.forEach((action) => {
        const actionId = action.application_module_action_id;
        const existingIndex = updatedPermissions.findIndex(
          (p) => p.application_module_action_id === actionId
        );

        if (existingIndex !== -1) {
          updatedPermissions[existingIndex].permission_allowed = !allChecked;
        } else {
          updatedPermissions.push({
            application_module_action_id: actionId,
            permission_allowed: !allChecked,
          });
        }
      });

      return { ...prev, permissions: updatedPermissions };
    });
  };

  // Check if all permissions in category are checked
  const isCategoryAllChecked = (categoryActions) => {
    return categoryActions.every((action) =>
      isPermissionAllowed(action.application_module_action_id)
    );
  };

  // Get count of selected permissions in category
  const getCategorySelectedCount = (categoryActions) => {
    return categoryActions.filter((action) =>
      isPermissionAllowed(action.application_module_action_id)
    ).length;
  };

  // Fetch role permissions when user is selected
  const fetchRolePermissions = async (selectedUser) => {
    const roleId = selectedUser?.role_assignment?.application_user_role_id;
    const roleName =
      selectedUser?.role_assignment?.application_user_role?.user_role_name;

    if (!roleId) {
      toast.info("This user has no role assigned.");
      setSelectedUserRole(null);
      setFormData((prev) => ({ ...prev, permissions: [] }));
      setInitialPermissions([]);
      return;
    }

    // VALIDATION CHECK ADDED
    if (!org?.organization_id) {
      toast.error("Organization ID is not available. Please refresh the page.");
      console.error("Organization ID missing in fetchRolePermissions");
      return;
    }

    setSelectedUserRole(roleName);
    setRoleLoading(true);

    try {
      console.log("Fetching role permissions with org_id:", org.organization_id);
      const response = await axios.get(
        `${MAIN_URL}/api/application/role-permissions/particular/${roleId}`,
        { params: { organization_id: org.organization_id } }
      );

      const permissions = response.data.permissions || [];

      const allPermissions = permissions.map((perm) => ({
        application_module_action_id: perm.application_module_action_id,
        permission_allowed: Boolean(perm.permission_allowed),
      }));

      setFormData((prev) => ({
        ...prev,
        permissions: allPermissions,
      }));

      setInitialPermissions(allPermissions);
    } catch (err) {
      console.error("Error fetching role permissions:", err);
      toast.error("Failed to load role permissions.");
    } finally {
      setRoleLoading(false);
    }
  };

  // Fetch organization users
  useEffect(() => {
    if (org?.organization_id) {
      console.log("Fetching users for organization:", org.organization_id);
      getOrganizationUser(org.organization_id)
        .then((data) => {
          console.log("Fetched users:", data?.users);
          setUsers(data?.users || []);
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          toast.error("Failed to load users.");
        });
    } else {
      console.warn("Organization ID not available for fetching users");
    }
  }, [org?.organization_id]);

  // Fetch modules with actions and group by category
  useEffect(() => {
    fetchModules()
      .then((data) => {
        const modules = data?.modules || [];

        // Transform modules to include categorized actions
        const transformedModules = modules.map((module) => ({
          module_id: module.application_module_id,
          module_name: module.module_name,
          categories: groupActionsByCategory(module.module_action || []),
        }));

        console.log("Transformed modules:", transformedModules);
        setModulesWithCategories(transformedModules);

        // Expand all modules by default
        const expanded = {};
        transformedModules.forEach((module) => {
          expanded[module.module_id] = true;
        });
        setExpandedModules(expanded);
      })
      .catch((err) => {
        console.error("Error fetching modules:", err);
        toast.error("Failed to load modules.");
      });
  }, []);

  // Fetch existing permissions in edit mode
  useEffect(() => {
    const getPermissionsByUserId = async () => {
      // VALIDATION CHECK ADDED
      if (!org?.organization_id) {
        console.error("Organization ID is not available");
        toast.error("Organization ID is not available. Please refresh the page.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching permissions for user:", id, "org:", org.organization_id);
        const response = await axios.get(
          `${MAIN_URL}/api/application/user-permissions/particularss/${id}`,
          {
            params: {
              organization_id: org.organization_id,
            },
          }
        );

        const userId = response.data.application_user_id;
        const permissions = response.data.permissions || [];

        const allPermissions = permissions.map((perm) => ({
          application_module_action_id: perm.application_module_action_id,
          permission_allowed: Boolean(perm.permission_allowed),
        }));

        console.log("Loaded user permissions:", allPermissions);

        setFormData({
          application_user_id: userId,
          permissions: allPermissions,
        });

        setInitialPermissions(allPermissions);

        // Get the user's role info for display
        const user = users.find((u) => u.application_user_id === userId);
        if (user?.role_assignment?.application_user_role?.user_role_name) {
          setSelectedUserRole(
            user.role_assignment.application_user_role.user_role_name
          );
        }
      } catch (err) {
        console.error("Failed to fetch user permissions", err);
        console.error("Error details:", err.response?.data);
        if (err.response?.status === 404) {
          toast.error("No permissions found for this user.");
        } else if (err.response?.status === 422) {
          toast.error(err.response.data.message || "Validation error occurred.");
        } else {
          toast.error("Failed to load user permissions.");
        }
      } finally {
        setLoading(false);
      }
    };

    // CONDITION CHECK UPDATED
    if (mode === "edit" && id && org?.organization_id) {
      setLoading(true);
      getPermissionsByUserId();
    } else if (mode === "edit" && id && !org?.organization_id) {
      console.warn("Waiting for organization ID in edit mode...");
      setLoading(false);
    }
  }, [mode, id, org?.organization_id, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "application_user_id") {
      const userId = Number(value);

      setFormData((prev) => ({
        ...prev,
        application_user_id: userId,
      }));

      const selectedUser = users.find(
        (user) => user.application_user_id === userId
      );

      if (selectedUser && mode !== "edit") {
        fetchRolePermissions(selectedUser);
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.application_user_id) {
      errors.application_user_id = "User is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // VALIDATION CHECK ADDED
    if (!org?.organization_id) {
      toast.error("Organization ID is not available. Please refresh the page.");
      console.error("Organization ID missing in handleSubmit");
      return;
    }

    setbtnLoading(true);
    try {
      const payload = {
        application_user_id: formData.application_user_id,
        permissions: formData.permissions || [],
      };

      console.log("Submitting payload:", payload);
      console.log("Organization ID:", org.organization_id);

      await axios.post(
        `${MAIN_URL}/api/application/user-permissions`,
        payload,
        {
          params: {
            organization_id: org.organization_id,
          },
        }
      );

      toast.success(
        mode === "edit"
          ? "User Permissions Updated!"
          : "User Permissions Saved!"
      );

      // Refresh permissions if updating current user's permissions
      // Check if the updated user is the current logged-in user
      const currentUserId = userData?.metadata?.[0]?.organization_user_id;
      const updatedUser = users.find(u => u.application_user_id === formData.application_user_id);
      
      // Refresh if updating current user's permissions
      if (currentUserId && updatedUser?.organization_user_id === currentUserId) {
        await refreshPermissions(currentUserId);
      }

      setFormErrors({});
      navigate(-1);
    } catch (err) {
      console.error("Submit error:", err);
      console.error("Error response:", err.response?.data);
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        setFormErrors(validationErrors);
        const errorMessages = Object.values(validationErrors)
          .map((arr) => arr[0])
          .join(" ");
        toast.error(errorMessages || "Validation failed.");
      } else {
        toast.error(err.response?.data?.error || "Something went wrong.");
      }
    } finally {
      setbtnLoading(false);
    }
  };

  const handleAccordionChange = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Show warning if organization ID is not available
  if (!org?.organization_id && !loading) {
    return (
      <Box px={4} py={4}>
        <Header
          mode={mode}
          updateMessage={"User Permission Override"}
          addMessage={"User Permission Override"}
          homeLink={"/application/user-permission"}
          homeText={"User Permission Override"}
        />
        <Alert severity="warning" sx={{ mt: 2 }}>
          Organization information is not available. Please refresh the page or log in again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"User Permission Override"}
        addMessage={"User Permission Override"}
        homeLink={"/application/user-permission"}
        homeText={"User Permission Override"}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={10}>
            {/* User Selection */}
            <TextField
              select
              fullWidth
              label="Select User"
              name="application_user_id"
              value={formData.application_user_id}
              onChange={handleChange}
              error={!!formErrors.application_user_id}
              helperText={formErrors.application_user_id}
              required
              disabled={mode === "edit" || roleLoading}
              sx={{ mb: 2 }}
            >
              {users.map((option) => (
                <MenuItem
                  key={option.application_user_id}
                  value={option.application_user_id}
                >
                  {option?.applicationuser?.[0]?.full_name || "Unknown User"}
                  {option?.role_assignment?.application_user_role
                    ?.user_role_name && (
                    <Typography
                      component="span"
                      color="text.secondary"
                      sx={{ ml: 1, fontSize: "0.875rem" }}
                    >
                      (
                      {
                        option.role_assignment.application_user_role
                          .user_role_name
                      }
                      )
                    </Typography>
                  )}
                </MenuItem>
              ))}
            </TextField>

            {/* Role Info Alert */}
            {selectedUserRole && (
              <Alert severity="info" sx={{ mb: 3 }}>
                User Role: <strong>{selectedUserRole}</strong>
                {mode !== "edit" &&
                  " - Permissions loaded from this role. You can modify them before saving."}
              </Alert>
            )}

            {/* Loading Role Permissions */}
            {roleLoading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                py={2}
                mb={2}
              >
                <CircularProgress size={24} />
                <Typography>Loading role permissions...</Typography>
              </Box>
            )}

            {/* Debug Info */}
            {formData.application_user_id && !roleLoading && (
              <Box mb={2} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                <Typography variant="caption" display="block">
                  <strong>Debug:</strong> Loaded {formData.permissions.length}{" "}
                  permissions
                </Typography>
                <Typography variant="caption" display="block">
                  Allowed:{" "}
                  {
                    formData.permissions.filter((p) => p.permission_allowed)
                      .length
                  }
                </Typography>
                
              </Box>
            )}

            {/* Module Permissions with Categories */}
            {!roleLoading && (
              <Box mt={2}>
                {modulesWithCategories.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Typography color="text.secondary">
                      No modules found. Please add modules first.
                    </Typography>
                  </Box>
                ) : (
                  modulesWithCategories.map((module) => (
                    <Accordion
                      key={module.module_id}
                      expanded={expandedModules[module.module_id]}
                      onChange={() => handleAccordionChange(module.module_id)}
                      sx={{
                        mb: 2,
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px !important",
                        "&:before": { display: "none" },
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          backgroundColor: "#f5f5f5",
                          borderRadius: "8px",
                          "&.Mui-expanded": {
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                          },
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={2}
                          width="100%"
                        >
                          <Typography variant="h6" fontWeight={600}>
                            {module.module_name || "Unnamed Module"}
                          </Typography>
                          <Chip
                            label={`${module.categories.reduce((acc, cat) => acc + getCategorySelectedCount(cat.actions), 0)} selected`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 3 }}>
                        {module.categories?.length === 0 ? (
                          <Typography color="text.secondary">
                            No actions available for this module.
                          </Typography>
                        ) : (
                          module.categories?.map((category, catIndex) => (
                            <Box key={catIndex} mb={3}>
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mb={2}
                                sx={{
                                  backgroundColor: "#f9f9f9",
                                  p: 2,
                                  borderRadius: 1,
                                  border: "1px solid #e0e0e0",
                                }}
                              >
                                <Box display="flex" alignItems="center" gap={2}>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={500}
                                    color="primary"
                                  >
                                    {category.category_name}
                                  </Typography>
                                  <Chip
                                    label={`${getCategorySelectedCount(category.actions)}/${category.actions.length}`}
                                    size="small"
                                    color={
                                      isCategoryAllChecked(category.actions)
                                        ? "success"
                                        : "default"
                                    }
                                    variant="filled"
                                  />
                                </Box>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    toggleCategoryPermissions(
                                      category.actions,
                                      isCategoryAllChecked(category.actions)
                                    )
                                  }
                                  disabled={mode === "view"}
                                  sx={{
                                    textTransform: "none",
                                    borderRadius: 1,
                                  }}
                                >
                                  {isCategoryAllChecked(category.actions)
                                    ? "Uncheck All"
                                    : "Check All"}
                                </Button>
                              </Box>

                              <Grid container spacing={2}>
                                {category.actions?.map((action) => (
                                  <Grid
                                    item
                                    xs={10}
                                    sm={6}
                                    md={4}
                                    key={action.application_module_action_id}
                                  >
                                    <Box
                                      sx={{
                                        p: 1.2,
                                        border: "1px solid #e0e0e0",
                                        borderRadius: 1,
                                        backgroundColor: getPermissionColor(
                                          action.application_module_action_id
                                        ),
                                        transition: "all 0.2s",
                                        "&:hover": {
                                          backgroundColor:
                                            getPermissionHoverColor(
                                              action.application_module_action_id
                                            ),
                                          borderColor: "#1976d2",
                                        },
                                      }}
                                    >
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={isPermissionAllowed(
                                              action.application_module_action_id
                                            )}
                                            onChange={() =>
                                              togglePermission(
                                                action.application_module_action_id
                                              )
                                            }
                                            disabled={mode === "view"}
                                          />
                                        }
                                        label={
                                          <Box>
                                            <Typography
                                              variant="body2"
                                              fontWeight={500}
                                            >
                                              {action.module_action_name}
                                            </Typography>
                                          </Box>
                                        }
                                      />
                                    </Box>
                                  </Grid>
                                ))}
                              </Grid>

                              {catIndex < module.categories.length - 1 && (
                                <Divider sx={{ mt: 3 }} />
                              )}
                            </Box>
                          ))
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))
                )}
              </Box>
            )}

            {/* Action Buttons */}
            <Box mt={4} display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={
                  loading || btnLoading || roleLoading || mode === "view"
                }
                sx={{
                  borderRadius: 2,
                  minWidth: 120,
                  textTransform: "capitalize",
                  fontWeight: 500,
                  px: 4,
                  py: 1.5,
                }}
              >
                {loading || btnLoading ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : (
                  "Submit"
                )}
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="medium"
                onClick={() => navigate(-1)}
                sx={{
                  borderRadius: 2,
                  minWidth: 120,
                  textTransform: "capitalize",
                  fontWeight: 500,
                  px: 4,
                  py: 1.5,
                }}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Reason Dialog */}
      <Dialog
        open={reasonDialogOpen}
        onClose={handleReasonCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reason for Removing Permission</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Please provide a reason"
            fullWidth
            multiline
            rows={4}
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            placeholder="Enter the reason for removing this permission..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReasonCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleReasonSubmit}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserPermissionForm;