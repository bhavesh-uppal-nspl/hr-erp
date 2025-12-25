import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import {
  fetchApplicationUser,
  fetchApplicationUserRoles,
} from "../../../Apis/ApplicationManagementApis";
import { fetchOrganizations } from "../../../Apis/Organization-apis";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { getOrganizationUser } from "../../../Apis/Organization-User";

function RoleAssignmentForm({ mode }) {
  const { id } = useParams();

  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    application_user_id: "",
    application_user_role_id: "",
    is_organization: false,
    is_application: false,
    organization_id: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    {
      getOrganizationUser(org?.organization_id)
        .then((data) => {
          setUser(data?.users);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);
console.log("users is ", user)
  useEffect(() => {
    {
      fetchApplicationUserRoles()
        .then((data) => {
          setRoles(data.userroles);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      fetchOrganizations(org?.client_id)
        .then((data) => {
          setOrganizations(data?.organizations);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  console.log("organizations is   ", organizations);

  useEffect(() => {
    {
      fetchApplicationUserRoles()
        .then((data) => {
          setRoles(data.userroles);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/application/userrole-assignment/${id}`
      );
      let a = response.data.roleAssignment;
      setFormData(a);
      setLoading(false);
    };
    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.application_user_id)
      errors.application_user_id = "User name is required.";

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
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/application/userrole-assignment/${id}`,
          formData
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/application/userrole-assignment`,
          formData
        );
      }

      toast.success(
        mode === "edit"
          ? "User Role Assignment Updated!"
          : "User Role Assignment Created!"
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
      <Header
        mode={mode}
        updateMessage={"User Role assignment"}
        addMessage={" User Role assignment"}
        homeLink={"/application/userrole-assignments"}
        homeText={"User Role Assignment"}
      />
      {loading ? (
        <Grid container spacing={2}>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper elevation={4} sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <TextField
                  select
                  fullWidth
                  label="User"
                  name="application_user_id"
                  value={formData.application_user_id}
                  onChange={handleChange}
                  error={!!formErrors.application_user_id}
                  helperText={formErrors.application_user_id}
                  required
                >
                  {user.map((option) => (
                    <MenuItem
                      key={option.application_user_id}
                      value={option.application_user_id}
                    >
                      {option?.applicationuser[0]?.full_name}
                    </MenuItem>
                  ))}
                </TextField>

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
                >
                  {roles.map((option) => (
                    <MenuItem
                      key={option.application_user_role_id}
                      value={option.application_user_role_id}
                    >
                      {option.user_role_name}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_application || false}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          is_application: e.target.checked,
                          is_organization: e.target.checked
                            ? false
                            : prev.is_organization,
                        }));
                      }}
                      name="is_application"
                      color="primary"
                    />
                  }
                  label="Applicable to All Companies"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_organization || false}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          is_organization: e.target.checked,
                          is_application: e.target.checked
                            ? false
                            : prev.is_application,
                          organization_id: e.target.checked
                            ? prev.organization_id
                            : "", // Clear if unchecked
                        }));
                      }}
                      name="is_organization"
                      color="primary"
                    />
                  }
                  label="Selected Company"
                />

                {formData.is_organization && (
                  <TextField
                    select
                    fullWidth
                    label="Organization"
                    name="organization_id"
                    value={formData.organization_id}
                    onChange={handleChange}
                    error={!!formErrors.organization_id}
                    helperText={formErrors.organization_id}
                    required
                  >
                    {organizations.map((option) => (
                      <MenuItem
                        key={option.organization_id}
                        value={option.organization_id}
                      >
                        {option.organization_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={handleSubmit}
                  disabled={loading || btnLoading || mode === "view"}
                  sx={{
                    borderRadius: 2,
                    minWidth: 120,
                    textTransform: "capitalize",
                    fontWeight: 500,
                  }}
                >
                  {loading || btnLoading ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : mode === "edit" ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>

                {mode === "edit" && (
                              <Grid item>
                                <Button
                                  variant="contained"
                                  color="primary" // blue color
                                  size="medium"
                                  onClick={() => navigate(-1)} // cancel navigates back
                                  sx={{
                                    borderRadius: 2,
                                    minWidth: 120,
                                    textTransform: "capitalize",
                                    fontWeight: 500,
                                    mt:2,
                                    backgroundColor: "#1976d2", // standard blue
                                    "&:hover": { backgroundColor: "#115293" },
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Grid>
                            )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default RoleAssignmentForm;
