import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Checkbox,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  Paper,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import { fetchModules } from "../../../Apis/Modules";
import useAuthStore from "../../../Zustand/Store/useAuthStore";

function ViewUserPermissionForm() {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [modulesWithCategories, setModulesWithCategories] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});

  // Group module actions by category
  const groupActionsByCategory = (actions) => {
    const grouped = {};
    
    actions.forEach((action) => {
      const category = action.category || 'Uncategorized';
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

  // Check if permission is allowed
  const isPermissionAllowed = (actionId) => {
    return userPermissions.some(
      (p) => p.application_module_action_id === actionId && p.permission_allowed
    );
  };

  // Get count of selected permissions in category
  const getCategorySelectedCount = (categoryActions) => {
    return categoryActions.filter((action) =>
      isPermissionAllowed(action.application_module_action_id)
    ).length;
  };

  // Get count of selected permissions in module
  const getModuleSelectedCount = (categories) => {
    let count = 0;
    categories.forEach((category) => {
      count += getCategorySelectedCount(category.actions);
    });
    return count;
  };

  // Get total actions count in module
  const getModuleTotalCount = (categories) => {
    let count = 0;
    categories.forEach((category) => {
      count += category.actions.length;
    });
    return count;
  };

  // Fetch modules with actions
  useEffect(() => {
    fetchModules()
      .then((data) => {
        const modules = data?.modules || [];
        
        const transformedModules = modules.map((module) => ({
          module_id: module.application_module_id,
          module_name: module.module_name,
          categories: groupActionsByCategory(module.module_action || []),
        }));

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

  // Fetch user permissions
  useEffect(() => {
    const getPermissionsByUserId = async () => {
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/application/user-permissions/particular/${id}`,
          {
            params: {
              organization_id: org?.organization_id,
            },
          }
        );

        setUserName(response.data.user_name || "");
        const modules = response.data.modules || [];

        // Flatten all permissions from all modules and categories
        const allPermissions = [];
        modules.forEach((module) => {
          module.categories.forEach((category) => {
            category.permissions.forEach((perm) => {
              allPermissions.push({
                application_module_action_id: perm.application_module_action_id,
                permission_allowed: Boolean(perm.permission_allowed),
              });
            });
          });
        });

        setUserPermissions(allPermissions);
      } catch (err) {
        console.error("Failed to fetch user permissions", err);
        if (err.response?.status === 404) {
          toast.error("No permissions found for this user.");
        } else {
          toast.error("Failed to load user permissions.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      setLoading(true);
      getPermissionsByUserId();
    }
  }, [id, org?.organization_id]);

  const handleAccordionChange = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box px={4} py={4}>
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: "#f8f9fa" }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          User Permissions
        </Typography>
        <Box display="flex" alignItems="center" gap={2} mt={2}>
          <Typography variant="h6" color="text.secondary">
            User:
          </Typography>
          <Chip 
            label={userName || "Unknown User"} 
            color="primary" 
            size="large"
            sx={{ fontSize: 16, fontWeight: 600 }}
          />
        </Box>
      </Paper>

      {/* Modules Accordion */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={10}>
          <Box>
            {modulesWithCategories.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  No permissions found.
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
                        {module.module_name || 'Unnamed Module'}
                      </Typography>
                      <Chip
                        label={`${getModuleSelectedCount(module.categories)}/${getModuleTotalCount(module.categories)} permissions`}
                        size="small"
                        color={getModuleSelectedCount(module.categories) > 0 ? "success" : "default"}
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
                                color={getCategorySelectedCount(category.actions) === category.actions.length ? "success" : getCategorySelectedCount(category.actions) > 0 ? "warning" : "default"}
                                variant="filled"
                              />
                            </Box>
                          </Box>

                          <Grid container spacing={2}>
                            {category.actions?.map((action) => {
                              const isAllowed = isPermissionAllowed(action.application_module_action_id);
                              return (
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
                                      backgroundColor: isAllowed ? "#e8f5e9" : "#fafafa",
                                      opacity: isAllowed ? 1 : 0.6,
                                    }}
                                  >
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={isAllowed}
                                          disabled
                                          sx={{
                                            '&.Mui-checked': {
                                              color: '#4caf50',
                                            },
                                            '&.Mui-disabled': {
                                              color: isAllowed ? '#4caf50' : 'rgba(0, 0, 0, 0.26)',
                                            }
                                          }}
                                        />
                                      }
                                      label={
                                        <Box>
                                          <Typography 
                                            variant="body2" 
                                            fontWeight={500}
                                            color={isAllowed ? "text.primary" : "text.secondary"}
                                          >
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
                              );
                            })}
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default ViewUserPermissionForm;