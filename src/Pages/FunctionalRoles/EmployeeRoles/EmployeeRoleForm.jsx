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
import {
  fetchOrganizationFunctionalRoles,
  fetchOrganizationFunctionalRolesSpecial,
} from "../../../Apis/FunctionalManagment";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function EmployeeRoleForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [Role, setRole] = useState([]);
  const [roleSpec, setRoleSpec] = useState([]);
  const [employee , setEmployee]=useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    organization_functional_role_id: "",
    organization_functional_role_specialization_id: "",
    is_primary: "",
    assigned_on: "",
    unassigned_on: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();


    useEffect(() => {
      {
        fetchOrganizationEmployee(org.organization_id)
          .then((data) => {
            setEmployee(data?.employees);
          })
          .catch((err) => {
            setFormErrors(err.message);
          });
      }
    }, []);


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
    {
      fetchOrganizationFunctionalRolesSpecial(org?.organization_id)
        .then((data) => {
          setRoleSpec(data?.functional?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/emp-func-role/${id}`,
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

    const handleDateTimeChange = (name, newValue) => {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue ? dayjs(newValue).format("YYYY-MM-DD HH:mm:ss") : "",
      }));
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_functional_role_id)
      errors.organization_functional_role_id = "Role is required.";

    if (!formData.organization_functional_role_specialization_id)
      errors.organization_functional_role_specialization_id =
        "Specilization is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/emp-func-role/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/emp-func-role`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit"
          ? "Employee Functional Role updated!"
          : "Employee Functional Role created!"
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
        updateMessage={"Employee Functional Roles"}
        addMessage={"Employee Functional Role"}
        homeLink={"/organization/employee/functional-role"}
        homeText={"Employee Functional Roles"}
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
                  label="Employee Name/ID"
                  name="employee_id"
                  value={formData?.employee_id}
                  onChange={handleChange}
                  error={!!formErrors.employee_id}
                  helperText={formErrors.employee_id}
                  required
                >
                  {employee?.map((option) => {
                    const fullName =
                      `${option?.first_name || ""} ${option?.middle_name || ""} ${option?.last_name || ""} -- ${option?.employee_code || ""}`.trim();
                    return (
                      <MenuItem
                        key={option?.employee_id}
                        value={option?.employee_id}
                      >
                        {fullName ? fullName : option?.employee_id}
                      </MenuItem>
                    );
                  })}
                </TextField>

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
                  select
                  fullWidth
                  label="Role Specialization"
                  name="organization_functional_role_specialization_id"
                  value={
                    formData.organization_functional_role_specialization_id
                  }
                  onChange={handleChange}
                  error={
                    !!formErrors.organization_functional_role_specialization_id
                  }
                  helperText={
                    formErrors.organization_functional_role_specialization_id
                  }
                  required
                >
                  {roleSpec?.map((type) => (
                    <MenuItem
                      key={type.organization_functional_role_specialization_id}
                      value={
                        type.organization_functional_role_specialization_id
                      }
                    >
                      {type?.functional_role_specialization_name}
                    </MenuItem>
                  ))}
                </TextField>

                <DateTimePicker
                  label="Assigned On"
                  value={
                    formData?.assigned_on
                      ? dayjs(formData.assigned_on)
                      : null
                  }
                  onChange={(newValue) =>
                    handleDateTimeChange("assigned_on", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      fullWidth
                      error={!!formErrors.assigned_on}
                      helperText={formErrors.assigned_on}
                    />
                  )}
                />
  <DateTimePicker
                  label="Unassigned On"
                  value={
                    formData?.unassigned_on
                      ? dayjs(formData.unassigned_on)
                      : null
                  }
                  onChange={(newValue) =>
                    handleDateTimeChange("unassigned_on", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      fullWidth
                      error={!!formErrors.unassigned_on}
                      helperText={formErrors.unassigned_on}
                    />
                  )}
                />

              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={handleSubmit}
                    disabled={loading || btnLoading}
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

export default EmployeeRoleForm;
