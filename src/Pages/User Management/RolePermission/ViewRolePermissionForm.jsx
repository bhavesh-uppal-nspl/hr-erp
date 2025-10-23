import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  FormControlLabel,
  Typography,
  moduleList,
  FormGroup,
  Checkbox,
  Switch,
  MenuItem,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import { fetchModuleAction, fetchModules } from "../../../Apis/Modules";
import {
  fetchApplicationUser,
  fetchApplicationUserRoles,
} from "../../../Apis/ApplicationManagementApis";

function ViewRolePermissionForm({ mode }) {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    application_user_role_id: "",
    application_module_action_id: "",
    permission_allowed: true,
    permissions: [],
  });

  // toggle state
  const togglePermission = (actionId) => {
    setFormData((prev) => {
      const existingIndex = prev.permissions.findIndex(
        (p) => p.application_module_action_id === actionId
      );

      let updatedPermissions;

      if (existingIndex !== -1) {
        // Toggle existing
        updatedPermissions = [...prev.permissions];
        updatedPermissions[existingIndex].permission_allowed =
          !updatedPermissions[existingIndex].permission_allowed;
      } else {
        // Add new
        updatedPermissions = [
          ...prev.permissions,
          { application_module_action_id: actionId, permission_allowed: true },
        ];
      }

      return { ...prev, permissions: updatedPermissions };
    });
  };

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [Modules, setModules] = useState([]);
  const [ModuleNames, setModuleNames] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchModuleAction()
        .then((data) => {
          setModules(data?.moduleaction);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      fetchApplicationUserRoles()
        .then((data) => {
          setRoles(data?.userroles);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      fetchModules()
        .then((data) => {
          setModuleNames(data?.modules);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  console.log("modulwes names ", ModuleNames);

  useEffect(() => {
    const getPermissionsByRoleId = async () => {
      try {
        const response = await axios.get(
          //   how to get the role-id   on selecvting partular  role_id      here
          `${MAIN_URL}/api/application/role-permissions/particular/${id}`
        );

        console.log("response is : ", response)

        const roleId = response.data.application_user_role_id;
        const permissions = response.data.permissions || [];

        // Transform permissions into the required format
        const transformedPermissions = permissions.map((perm) => ({
          application_module_action_id: perm.application_module_action_id,
          permission_allowed: Boolean(perm.permission_allowed),
        }));

        // Set form data with role ID and permissions
        setFormData({
          application_user_role_id: roleId,
          permissions: transformedPermissions,
        });
      } catch (err) {
        console.error("Failed to fetch role permissions", err);
        toast.error("Failed to load role permissions.");
      } finally {
        setLoading(false);
      }
    };

    if (mode === "edit" && id) {
      setLoading(true);
      getPermissionsByRoleId();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.application_user_role_id)
      errors.application_user_role_id = "User Role is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  console.log("formdata", formData);
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);
    try {
      const payload = {
        application_user_role_id: formData.application_user_role_id,
        permissions: formData.permissions || [],
      };
      console.log("payload is ", payload);
      await axios.post(`${MAIN_URL}/api/application/role-permissions`, payload);

      toast.success(
        mode === "edit" ? "Permissions Updated!" : "Permissions Saved!"
      );
      setFormErrors({});
      navigate(-1);
    } catch (err) {
      console.error(err);
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

  console.log("formdataaaaaa", formData);
  return (
    <Box px={4} py={4}>
      {loading ? (
        <Grid container spacing={2}>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        // <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {/* <Paper elevation={4} sx={{ p: 3 }}> */}
          {/* <Grid container spacing={2} mb={2}> */}

          <Box mb={2}>
            <Typography style={{fontSize:32}} variant="subtitle2" gutterBottom>
                User Role Permission 
            </Typography>

            <Typography style={{fontSize:20}} variant="body1" fontWeight={600}>
              {roles.find(
                (r) =>
                  r.application_user_role_id ===
                  formData.application_user_role_id
              )?.user_role_name || "-"}
            </Typography>
          </Box>

          {/* </Grid> */}

          {/* MODULE PERMISSIONS */}
          <Grid container spacing={2}>
            {ModuleNames.map((module) => (
              <Box
                mt={5}
                flexDirection={"column"}
                key={module.application_module_id}
              >
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {module.module_name}
                  </Typography>
                </Grid>
                <br />
                <Grid item xs={12} md={8}>
                  <FormGroup row>
                    {module.module_action.map((action) => (
                      <FormControlLabel
                        key={action.application_module_action_id}
                        control={
                          <Checkbox
                            disabled
                            checked={
                              formData.permissions?.find(
                                (perm) =>
                                  perm.application_module_action_id ===
                                    action.application_module_action_id &&
                                  perm.permission_allowed
                              ) || false
                            }
                          />
                        }
                        label={action.module_action_name}
                      />
                    ))}
                  </FormGroup>
                </Grid>
                {/* <Divider fullWidth/> */}
              </Box>
            ))}
          </Grid>

          {/* </Paper> */}
        </Grid>
        // </Grid>
      )}
    </Box>
  );
}

export default ViewRolePermissionForm;
