// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Grid,
//   Paper,
//   TextField,
//   FormControlLabel,
//   Typography,
//   FormGroup,
//   Checkbox,
//   Switch,
//   MenuItem,
//   CircularProgress,
//   Divider,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "../../DataLayouts/Header";
// import toast from "react-hot-toast";
// import { MAIN_URL } from "../../../Configurations/Urls";
// import axios from "axios";
// import { fetchModuleAction, fetchModules } from "../../../Apis/Modules";
// import {
//   fetchApplicationUser,
//   fetchApplicationUserRoles,
// } from "../../../Apis/ApplicationManagementApis";
// import useAuthStore from "../../../Zustand/Store/useAuthStore";

// function ViewRolePermissionForm({ mode }) {
//   const { id } = useParams();
//   const { userData } = useAuthStore();
//   const org = userData?.organization;

//   const [formData, setFormData] = useState({
//     application_user_role_id: "",
//     application_module_action_id: "",
//     permission_allowed: true,
//     permissions: [],
//   });

//   const [formErrors, setFormErrors] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [roles, setRoles] = useState([]);
//   const [Modules, setModules] = useState([]);
//   const [ModuleNames, setModuleNames] = useState([]);

//   let navigate = useNavigate();

//   useEffect(() => {
//     fetchModuleAction()
//       .then((data) => {
//         setModules(data?.moduleaction);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch module actions:", err);
//         toast.error("Failed to load module actions");
//       });
//   }, []);

//   useEffect(() => {
//     fetchApplicationUserRoles()
//       .then((data) => {
//         setRoles(data?.userroles);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch user roles:", err);
//         toast.error("Failed to load user roles");
//       });
//   }, []);

//   useEffect(() => {
//     fetchModules()
//       .then((data) => {
//         setModuleNames(data?.modules);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch modules:", err);
//         toast.error("Failed to load modules");
//       });
//   }, []);

//   console.log("modules names ", ModuleNames);

//   useEffect(() => {
//     const getPermissionsByRoleId = async () => {
//       if (!org?.organization_id) {
//         toast.error("Organization information not found");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `${MAIN_URL}/api/application/role-permissions/particular/${id}`,
//           {
//             params: {
//               organization_id: org?.organization_id,
//             },
//           }
//         );

//         console.log("response is : ", response);

//         const roleId = response.data.application_user_role_id;
//         const permissions = response.data.permissions || [];

//         // Transform permissions into the required format
//         const transformedPermissions = permissions.map((perm) => ({
//           application_module_action_id: perm.application_module_action_id,
//           permission_allowed: Boolean(perm.permission_allowed),
//         }));

//         // Set form data with role ID and permissions
//         setFormData({
//           application_user_role_id: roleId,
//           permissions: transformedPermissions,
//         });
//       } catch (err) {
//         console.error("Failed to fetch role permissions", err);
//         toast.error(
//           err.response?.data?.error || "Failed to load role permissions."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id && org?.organization_id) {
//       setLoading(true);
//       getPermissionsByRoleId();
//     }
//   }, [id, org?.organization_id]);

//   console.log("formdata", formData);

//   return (
//     <Box px={4} py={4}>
//       <Header
//         mode="view"
//         updateMessage={"User Role Permission"}
//         addMessage={"User Role Permission"}
//         homeLink={"/application/user-role-permission"}
//         homeText={"User Role Permission"}
//       />

//       {loading ? (
//         <Grid container spacing={2}>
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             width="100%"
//             py={4}
//           >
//             <CircularProgress />
//           </Box>
//         </Grid>
//       ) : (
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={10}>
//             <Paper elevation={2} sx={{ p: 3 }}>
//               {/* Role Name Display */}
//               <Box mb={4}>
//                 <Typography
//                   variant="h5"
//                   fontWeight={600}
//                   gutterBottom
//                   color="primary"
//                 >
//                   Role Permissions
//                 </Typography>

//                 <Box
//                   sx={{
//                     backgroundColor: "grey.100",
//                     p: 2,
//                     borderRadius: 1,
//                     mt: 2,
//                   }}
//                 >
//                   <Typography variant="body2" color="text.secondary">
//                     Role Name
//                   </Typography>
//                   <Typography variant="h6" fontWeight={600}>
//                     {roles.find(
//                       (r) =>
//                         r.application_user_role_id ===
//                         formData.application_user_role_id
//                     )?.user_role_name || "-"}
//                   </Typography>
//                 </Box>
//               </Box>

//               <Divider sx={{ mb: 3 }} />

//               {/* MODULE PERMISSIONS */}
//               <Grid container spacing={3}>
//                 {ModuleNames.map((module) => (
//                   <Grid item xs={12} key={module.application_module_id}>
//                     <Paper
//                       elevation={1}
//                       sx={{
//                         p: 2,
//                         backgroundColor: "grey.50",
//                         borderLeft: "4px solid",
//                         borderColor: "primary.main",
//                       }}
//                     >
//                       <Typography
//                         variant="subtitle1"
//                         fontWeight={700}
//                         color="primary.dark"
//                         gutterBottom
//                       >
//                         {module.module_name}
//                       </Typography>

//                       <FormGroup row sx={{ mt: 2 }}>
//                         {module.module_action.map((action) => {
//                           const isChecked =
//                             formData.permissions?.find(
//                               (perm) =>
//                                 perm.application_module_action_id ===
//                                   action.application_module_action_id &&
//                                 perm.permission_allowed
//                             ) || false;

//                           return (
//                             <Grid
//                               item
//                               xs={12}
//                               sm={6}
//                               md={4}
//                               key={action.application_module_action_id}
//                             >
//                               <FormControlLabel
//                                 control={
//                                   <Checkbox
//                                     disabled
//                                     checked={isChecked}
//                                     sx={{
//                                       "&.Mui-checked": {
//                                         color: "success.main",
//                                       },
//                                     }}
//                                   />
//                                 }
//                                 label={
//                                   <Typography
//                                     variant="body2"
//                                     sx={{
//                                       fontWeight: isChecked ? 600 : 400,
//                                       color: isChecked
//                                         ? "text.primary"
//                                         : "text.secondary",
//                                     }}
//                                   >
//                                     {action.module_action_name}
//                                   </Typography>
//                                 }
//                               />
//                             </Grid>
//                           );
//                         })}
//                       </FormGroup>
//                     </Paper>
//                   </Grid>
//                 ))}
//               </Grid>

//               {/* Back Button */}
//               <Box mt={4} display="flex" justifyContent="flex-start">
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="medium"
//                   onClick={() => navigate(-1)}
//                   sx={{
//                     borderRadius: 2,
//                     minWidth: 120,
//                     textTransform: "capitalize",
//                     fontWeight: 500,
//                   }}
//                 >
//                   Back to List
//                 </Button>
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>
//       )}
//     </Box>
//   );
// }

// export default ViewRolePermissionForm;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import { fetchModules } from "../../../Apis/Modules";
import { fetchApplicationUserRoles } from "../../../Apis/ApplicationManagementApis";
import useAuthStore from "../../../Zustand/Store/useAuthStore";

function ViewRolePermissionForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    application_user_role_id: "",
    permissions: [],
  });

  const [loading, setLoading] = useState(true);
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

  // Check if permission is allowed
  const isPermissionAllowed = (actionId) => {
    const perm = formData.permissions.find(
      (p) => p.application_module_action_id === actionId && p.permission_allowed
    );
    return perm !== undefined;
  };

  // Get count of allowed permissions in category
  const getCategoryAllowedCount = (categoryActions) => {
    return categoryActions.filter((action) =>
      isPermissionAllowed(action.application_module_action_id)
    ).length;
  };

  // Get count of allowed permissions in module
  const getModuleAllowedCount = (categories) => {
    return categories.reduce(
      (acc, cat) => acc + getCategoryAllowedCount(cat.actions),
      0
    );
  };

  // Get total permissions in module
  const getModuleTotalCount = (categories) => {
    return categories.reduce((acc, cat) => acc + cat.actions.length, 0);
  };

  // Fetch roles
  useEffect(() => {
    fetchApplicationUserRoles()
      .then((data) => {
        setRoles(data?.userroles || []);
      })
      .catch((err) => {
        console.error("Failed to fetch user roles:", err);
        toast.error("Failed to load user roles");
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
        console.error("Failed to fetch modules:", err);
        toast.error("Failed to load modules");
      });
  }, []);

  // Fetch permissions
  useEffect(() => {
    const getPermissionsByRoleId = async () => {
      if (!org?.organization_id) {
        toast.error("Organization information not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${MAIN_URL}/api/application/role-permissions/particular/${id}`,
          {
            params: {
              organization_id: org.organization_id,
            },
          }
        );

        console.log("Fetched permissions:", response.data);

        const roleId = response.data.application_user_role_id;
        const permissions = response.data.permissions || [];

        const transformedPermissions = permissions.map((perm) => ({
          application_module_action_id: perm.application_module_action_id,
          permission_allowed: Boolean(perm.permission_allowed),
        }));

        setFormData({
          application_user_role_id: roleId,
          permissions: transformedPermissions,
        });
      } catch (err) {
        console.error("Failed to fetch role permissions", err);
        toast.error(
          err.response?.data?.error || "Failed to load role permissions."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id && org?.organization_id) {
      setLoading(true);
      getPermissionsByRoleId();
    }
  }, [id, org?.organization_id]);

  const handleAccordionChange = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const selectedRole = roles.find(
    (r) => r.application_user_role_id === formData.application_user_role_id
  );

  return (
    <Box px={4} py={4}>
      <Header
        mode="view"
        updateMessage={"User Role Permission"}
        addMessage={"User Role Permission"}
        homeLink={"/application/user-role-permission"}
        homeText={"User Role Permission"}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={10}>
            {/* Role Information Card */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight={600} color="primary" gutterBottom>
                Role Permissions
              </Typography>

              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  p: 2.5,
                  borderRadius: 2,
                  mt: 2,
                  border: "2px solid #e0e0e0",
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Role Name
                </Typography>
                <Typography variant="h6" fontWeight={600} color="primary.dark">
                  {selectedRole?.user_role_name || "-"}
                </Typography>
                {selectedRole?.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {selectedRole.description}
                  </Typography>
                )}
              </Box>

              {/* Summary Stats */}
              <Box display="flex" gap={2} mt={3}>
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`${formData.permissions.filter((p) => p.permission_allowed).length} Permissions Granted`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  label={`${modulesWithCategories.length} Modules`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Paper>

            <Divider sx={{ mb: 3 }} />

            {/* Module Permissions with Categories */}
            <Box>
              {modulesWithCategories.length === 0 ? (
                <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No modules found.
                  </Typography>
                </Paper>
              ) : (
                modulesWithCategories.map((module) => {
                  const allowedCount = getModuleAllowedCount(module.categories);
                  const totalCount = getModuleTotalCount(module.categories);

                  return (
                    <Accordion
                      key={module.module_id}
                      expanded={expandedModules[module.module_id]}
                      onChange={() => handleAccordionChange(module.module_id)}
                      sx={{
                        mb: 2,
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px !important",
                        "&:before": { display: "none" },
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          backgroundColor: "#fafafa",
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
                          justifyContent="space-between"
                          width="100%"
                          pr={2}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h6" fontWeight={600}>
                              {module.module_name || "Unnamed Module"}
                            </Typography>
                            <Chip
                              label={`${allowedCount}/${totalCount}`}
                              size="small"
                              color={allowedCount === totalCount ? "success" : "default"}
                              variant="filled"
                            />
                          </Box>
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails sx={{ p: 3, backgroundColor: "#fff" }}>
                        {module.categories?.length === 0 ? (
                          <Typography color="text.secondary">
                            No actions available for this module.
                          </Typography>
                        ) : (
                          module.categories?.map((category, catIndex) => {
                            const categoryAllowedCount = getCategoryAllowedCount(
                              category.actions
                            );

                            return (
                              <Box key={catIndex} mb={3}>
                                {/* Category Header */}
                                <Box
                                  sx={{
                                    backgroundColor: "#f9f9f9",
                                    p: 2,
                                    borderRadius: 1,
                                    border: "1px solid #e0e0e0",
                                    mb: 2,
                                  }}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={600}
                                      color="primary"
                                    >
                                      {category.category_name}
                                    </Typography>
                                    <Chip
                                      label={`${categoryAllowedCount}/${category.actions.length}`}
                                      size="small"
                                      color={
                                        categoryAllowedCount === category.actions.length
                                          ? "success"
                                          : categoryAllowedCount > 0
                                          ? "warning"
                                          : "default"
                                      }
                                      variant="filled"
                                    />
                                  </Box>
                                </Box>

                                {/* Category Actions */}
                                <Grid container spacing={2}>
                                  {category.actions?.map((action) => {
                                    const isAllowed = isPermissionAllowed(
                                      action.application_module_action_id
                                    );

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
                                            border: "2px solid",
                                            borderColor: isAllowed
                                              ? "success.main"
                                              : "grey.300",
                                            borderRadius: 1,
                                            backgroundColor: isAllowed
                                              ? "success.50"
                                              : "#fff",
                                            transition: "all 0.2s",
                                          }}
                                        >
                                          <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                          >
                                            {isAllowed ? (
                                              <CheckCircleIcon
                                                sx={{
                                                  color: "success.main",
                                                  fontSize: 20,
                                                }}
                                              />
                                            ) : (
                                              <CancelIcon
                                                sx={{
                                                  color: "grey.400",
                                                  fontSize: 20,
                                                }}
                                              />
                                            )}
                                            <Box flex={1}>
                                              <Typography
                                                variant="body2"
                                                fontWeight={isAllowed ? 600 : 400}
                                                color={
                                                  isAllowed
                                                    ? "text.primary"
                                                    : "text.secondary"
                                                }
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
                                          </Box>
                                        </Box>
                                      </Grid>
                                    );
                                  })}
                                </Grid>

                                {catIndex < module.categories.length - 1 && (
                                  <Divider sx={{ mt: 3 }} />
                                )}
                              </Box>
                            );
                          })
                        )}
                      </AccordionDetails>
                    </Accordion>
                  );
                })
              )}
            </Box>

            {/* Back Button */}
            <Box mt={4} display="flex" justifyContent="flex-start">
              <Button
                variant="contained"
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
                Back to List
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default ViewRolePermissionForm;