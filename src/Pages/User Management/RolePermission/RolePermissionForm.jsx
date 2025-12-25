

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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import { fetchModules } from "../../../Apis/Modules";
import { fetchApplicationUserRoles } from "../../../Apis/ApplicationManagementApis";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import usePermissionDataStore from "../../../Zustand/Store/usePermissionDataStore";

function RolePermissionForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const { refreshPermissions } = usePermissionDataStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    application_user_role_id: "",
    permissions: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [modulesWithCategories, setModulesWithCategories] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});

  let navigate = useNavigate();

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

  // Toggle individual permission
  const togglePermission = (actionId) => {
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

  // Check if permission is allowed
  const isPermissionAllowed = (actionId) => {
    const perm = formData.permissions.find(
      (p) => p.application_module_action_id === actionId && p.permission_allowed
    );
    return perm !== undefined;
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

  // Fetch roles
  useEffect(() => {
    fetchApplicationUserRoles()
      .then((data) => {
        setRoles(data?.userroles || []);
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
        toast.error("Failed to load roles.");
      });
  }, []);

  // Fetch modules with actions and group by category
  useEffect(() => {
    fetchModules()
      .then((data) => {
        const modules = data?.modules || [];

        const transformedModules = modules.map((module) => ({
          module_id: module.application_module_id,
          module_name: module.module_name,
          categories: groupActionsByCategory(module.module_action || []),
        }));

        console.log("Transformed modules with categories:", transformedModules);
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
    const getPermissionsByRoleId = async () => {
      if (!org?.organization_id) {
        console.error("Organization ID is not available");
        toast.error("Organization ID is not available. Please refresh the page.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching permissions for role:", id);
        const response = await axios.get(
          `${MAIN_URL}/api/application/role-permissions/particular/${id}`,
          {
            params: {
              organization_id: org.organization_id,
            },
          }
        );

        const roleId = response.data.application_user_role_id;
        const permissions = response.data.permissions || [];

        const transformedPermissions = permissions.map((perm) => ({
          application_module_action_id: perm.application_module_action_id,
          permission_allowed: Boolean(perm.permission_allowed),
        }));

        console.log("Loaded role permissions:", transformedPermissions);

        setFormData({
          application_user_role_id: roleId,
          permissions: transformedPermissions,
        });
      } catch (err) {
        console.error("Failed to fetch role permissions", err);
        if (err.response?.status === 404) {
          toast.error("No permissions found for this role.");
        } else {
          toast.error("Failed to load role permissions.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (mode === "edit" && id && org?.organization_id) {
      setLoading(true);
      getPermissionsByRoleId();
    }
  }, [mode, id, org?.organization_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.application_user_role_id) {
      errors.application_user_role_id = "User Role is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!org?.organization_id) {
      toast.error("Organization ID is not available. Please refresh the page.");
      return;
    }

    setbtnLoading(true);
    try {
      const payload = {
        application_user_role_id: formData.application_user_role_id,
        permissions: formData.permissions || [],
        organization_id: org.organization_id,
      };

      console.log("Submitting payload:", payload);

      await axios.post(`${MAIN_URL}/api/application/role-permissions`, payload);

      toast.success(
        mode === "edit" ? "Permissions Updated!" : "Permissions Saved!"
      );

      // Refresh permissions in the store if updating current user's role
      if (userData?.metadata?.[0]?.organization_user_id) {
        await refreshPermissions(userData.metadata[0].organization_user_id);
      }

      setFormErrors({});
      navigate(-1);
    } catch (err) {
      console.error("Submit error:", err);
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        setFormErrors(validationErrors);
        const errorMessages = Object.values(validationErrors)
          .map((arr) => arr[0])
          .join(" ");
        toast.error(errorMessages || "Validation failed.");
      } else {
        toast.error("Something went wrong.");
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

  if (!org?.organization_id && !loading) {
    return (
      <Box px={4} py={4}>
        <Header
          mode={mode}
          updateMessage={"User Role Permission"}
          addMessage={"User Role Permission"}
          homeLink={"/application/user-role-permission"}
          homeText={"User Role Permission"}
        />
        <Box mt={2} p={2} bgcolor="#fff3cd" borderRadius={1}>
          <Typography color="warning.main">
            Organization information is not available. Please refresh the page or log in again.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"User Role Permission"}
        addMessage={"User Role Permission"}
        homeLink={"/application/user-role-permission"}
        homeText={"User Role Permission"}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={10}>
            {/* Role Selection */}
            <TextField
              select
              fullWidth
              label="User Role"
              name="application_user_role_id"
              value={formData.application_user_role_id}
              onChange={handleChange}
              error={!!formErrors.application_user_role_id}
              helperText={formErrors.application_user_role_id}
              required
              disabled={mode === "edit"}
              sx={{ mb: 3 }}
            >
              {roles.map((option) => (
                <MenuItem
                  key={option.application_user_role_id}
                  value={option.application_user_role_id}
                >
                  {option?.user_role_name}
                </MenuItem>
              ))}
            </TextField>

            {/* Debug Info */}
            {formData.application_user_role_id && (
              <Box mb={2} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                {/* <Typography variant="caption" display="block">
                  <strong>Debug:</strong> Loaded {formData.permissions.length} permissions
                </Typography> */}
                <Typography variant="caption" display="block">
                  Allowed Permissions: {formData.permissions.filter((p) => p.permission_allowed).length}
                </Typography>
              </Box>
            )}

            {/* Module Permissions with Categories */}
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
                      <Box display="flex" alignItems="center" gap={2} width="100%">
                        <Typography variant="h6" fontWeight={600}>
                          {module.module_name || "Unnamed Module"}
                        </Typography>
                        <Chip
                          label={`${module.categories.reduce(
                            (acc, cat) => acc + getCategorySelectedCount(cat.actions),
                            0
                          )} selected`}
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
                                  label={`${getCategorySelectedCount(
                                    category.actions
                                  )}/${category.actions.length}`}
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
                                  xs={12}
                                  sm={6}
                                  md={4}
                                  key={action.application_module_action_id}
                                >
                                  <Box
                                    sx={{
                                      p: 1.5,
                                      border: "1px solid #e0e0e0",
                                      borderRadius: 1,
                                      backgroundColor: isPermissionAllowed(
                                        action.application_module_action_id
                                      )
                                        ? "#e3f2fd"
                                        : "#fff",
                                      transition: "all 0.2s",
                                      "&:hover": {
                                        backgroundColor: isPermissionAllowed(
                                          action.application_module_action_id
                                        )
                                          ? "#bbdefb"
                                          : "#f5f5f5",
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
                                          <Typography variant="body2" fontWeight={500}>
                                            {action.module_action_name}
                                          </Typography>
                                          {action.module_action_code && (
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                              sx={{ display: "block", mt: 0.5 }}
                                            >
                                              {/* {action.module_action_code} */}
                                            </Typography>
                                          )}
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

            {/* Action Buttons */}
            <Box mt={4} display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || btnLoading || mode === "view"}
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
    </Box>
  );
}

export default RolePermissionForm;