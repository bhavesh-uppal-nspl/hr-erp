import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchOrganizationFunctionalRoles } from "../../../Apis/FunctionalManagment";

function FunctionRoleSpecializationForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [Role, setRole] = useState([]);

  const [formData, setFormData] = useState({
    organization_functional_role_id : "",
    functional_role_specialization_name: "",
    functional_role_specialization_code: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchOrganizationFunctionalRoles(org?.organization_id)
        .then((data) => {
          setRole(data?.functional?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/func-role-spec/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response.data.functional;
      setFormData(a);
      setLoading(false);
    };
    if ((mode === "edit" || mode === "view" )&& id) {
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

    if (!formData.organization_functional_role_id)
      errors.organization_functional_role_id = "Role is required.";

    if (!formData.functional_role_specialization_name)
      errors.functional_role_specialization_name = "Functional role name is required.";

    // if (!formData.functional_role_code)
    //   errors.functional_role_code = "Role code is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/func-role-spec/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/func-role-spec`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit" ? "Functional Role updated!" : "Functional Role created!"
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

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Functional Roles Specialization"}
        addMessage={"Functional Role Specialization"}
        homeLink={"/organization/functional-role-specialization"}
        homeText={"Functional Roles Specialization"}
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
                label="Functional Role"
                name="organization_functional_role_id"
                value={formData.organization_functional_role_id}
                onChange={handleChange}
                error={!!formErrors.organization_functional_role_id}
                helperText={formErrors.organization_functional_role_id}
                required
                 disabled={Role?.length === 0 || mode === "view"}
              >
                {Role?.map((type) => (
                  <MenuItem
                    key={type.organization_functional_role_id}
                    value={type.organization_functional_role_id}
                  >
                    {type?.functional_role_name}
                  </MenuItem>
                ))}
              </TextField>



                <TextField
                  fullWidth
                  label="Functional Role Specialization Name"
                  name="functional_role_specialization_name"
                  value={formData.functional_role_specialization_name}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  error={!!formErrors.functional_role_specialization_name}
                  helperText={formErrors.functional_role_specialization_name}
                  required
                  inputProps={{ maxLength: 50 }}
                />

                <TextField
                  fullWidth
                  label="Functional Role Specialization Code"
                  name="functional_role_specialization_code"
                  value={formData.functional_role_specialization_code}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  error={!!formErrors.functional_role_specialization_code}
                  helperText={formErrors.functional_role_specialization_code}
                  inputProps={{ maxLength: 20 }}
                />
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid item>
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
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Grid>

                {mode === "edit" && (
                  <Grid item>
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
                        backgroundColor: "#1976d2",
                        "&:hover": { backgroundColor: "#115293" },
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default FunctionRoleSpecializationForm;
