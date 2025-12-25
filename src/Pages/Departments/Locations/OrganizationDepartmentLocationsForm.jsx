import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import {fetchDepartmentLocation, fetchOrganizationDepartment, fetchOrganizationLocation,
} from  "../../../Apis/DepartmentLocation-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import {MAIN_URL } from "../../../Configurations/Urls";

function OrganizationDepartmentLocationsForm({ mode }) {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [department, setdepartments] = useState([]);

  const [formData, setFormData] = useState({
    organization_location_id: null,
    organization_department_id: null,
  });

  useEffect(() => {
    if (org?.organization_id) {
      fetchOrganizationLocation(org.organization_id)
        .then((data) => {
          setLocations(data.locations);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);
  console.log("current location", locations);

  useEffect(() => {
    {
      fetchOrganizationDepartment(org.organization_id)
        .then((data) => {
          setdepartments(data.Departments);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);
  console.log("organizationdepartment", department);

  let navigate = useNavigate();

//   useEffect(() => {
//     if (mode === "edit" && id) {
//       setLoading(true);

//       setTimeout(() => {
//         const success = true;
//         if (success) {
//           setFormData({
//             organization_location_id: 1,
//             organization_department_id: 101,
//           });
//           setLoading(false);
//         } else {
//           setLoading(false);
//         }
//       }, 1000);
//     }
//   }, [mode, id]);


  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/department-location/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
      let a = response.data.departmentlocation;
      setFormData(a);
      setLoading(false);
    };
    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

    console.log("formdata", formData);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_location_id)
      errors.organization_location_id = "Department's Location is required.";

    if (!formData.organization_department_id)
      errors.organization_department_id = "Department is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        // Call edit API
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/department-location/${id}`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/department-location`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      }

      toast.success(
        mode === "edit"
          ? "Department Location Updated!"
          : "Department Location Created!"
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
        updateMessage={"Department's Location"}
        addMessage={"Department's Location"}
        homeLink={"/departments/locations"}
        homeText={"Departments Location"}
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
                  label="Location"
                  name="organization_location_id"
                  value={formData.organization_location_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_location_id}
                  helperText={formErrors.organization_location_id}
                  required
                >
                  {locations?.map((option) => (
                    <MenuItem key={option.organization_location_id} value={option.organization_location_id}>
                      {option.location_name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Department"
                  name="organization_department_id"
                  value={formData.organization_department_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_department_id}
                  helperText={formErrors.organization_department_id}
                  required
                >
                  {department?.map((option) => (
                    <MenuItem key={option.organization_department_id} value={option.organization_department_id}>
                      {option.department_name}
                    </MenuItem>
                  ))}
                </TextField>

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
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default OrganizationDepartmentLocationsForm;
