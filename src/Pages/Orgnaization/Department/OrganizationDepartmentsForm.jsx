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
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchOrganizationLocation } from "../../../Apis/DepartmentLocation-api";

function OrganizationDepartmentForm({ mode }) {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [deptlocations, setDepartmentLocations] = useState([]);
 

  const [formData, setFormData] = useState({
    department_name: "",
    department_short_name: "",
    description: "",
    department_mail_id: "",
    department_employees_count: "",
    organization_location_id: "",
  });
  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchOrganizationLocation(org.organization_id)
        .then((data) => {
          setDepartmentLocations(data?.locations);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);
  console.log("organizatyion locations ", deptlocations);

  console.log("formdata", formData);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/department/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("department by id response", response);
      let a = response.data.department;

      setFormData({
        department_name: a.department_name,
        department_short_name: a.department_short_name,
        department_mail_id: a.department_mail_id,
        description: a.description,
        organization_location_id:
          a.departmentlocation?.[0]?.organization_location_id,
        department_employees_count: a?.department_employees_count,
      });

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

  const isValidEmail = (email) => {
   const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email.trim());
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.department_name)
      errors.department_name = "Department's Name is required.";

    if (!formData.organization_location_id)
      errors.organization_location_id = "Department Location is required.";

    if (
      formData?.department_mail_id &&
      !isValidEmail(formData?.department_mail_id)
    ) {
      errors.department_mail_id = "Enter a valid department email address.";
    }

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);
    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/department/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/department`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit" ? "Department updated!" : "Department created!"
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
        updateMessage={"Department"}
        addMessage={"Department"}
        homeLink={"/organization/departments"}
        homeText={"Departments"}
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
                  fullWidth
                  label="Department Name"
                  name="department_name"
                  value={formData.department_name}
                  onChange={handleChange}
                  error={!!formErrors.department_name}
                  helperText={formErrors.department_name}
                  inputProps={{ maxLength: 50 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Short Name"
                  name="department_short_name"
                  value={formData.department_short_name}
                  onChange={handleChange}
                  error={!!formErrors.department_short_name}
                  helperText={formErrors.department_short_name}
                  inputProps={{ maxLength: 20 }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  multiline
                  rows={3}
                  inputProps={{ maxLength: 255 }}
                />

                <TextField
                  fullWidth
                  label="Department Email"
                  name="department_mail_id"
                  type="text"
                  value={formData.department_mail_id}
                  onChange={handleChange}
                  error={!!formErrors.department_mail_id}
                  helperText={formErrors.department_mail_id}
                  inputProps={{ maxLength: 100 }}
                />

                <TextField
                  select
                  fullWidth
                  label="Department Location"
                  name="organization_location_id"
                  value={formData.organization_location_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_location_id}
                  helperText={formErrors.organization_location_id}
                  required
                >
                  {deptlocations?.map((option) => (
                    <MenuItem
                      key={option.organization_location_id}
                      value={option.organization_location_id}
                    >
                      {option?.city?.city_name}
                    </MenuItem>
                  ))}
                </TextField>

             
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

export default OrganizationDepartmentForm;
