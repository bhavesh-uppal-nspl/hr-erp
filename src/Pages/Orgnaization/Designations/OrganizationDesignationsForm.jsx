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
import { fetchOrganizationDepartment } from "../../../Apis/Department-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";

function OrganizationDesignationsForm({ mode }) {
  const { id } = useParams(); // only used in edit mode
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_department_id: null,
    designation_name: "",
    designation_short_name: "",
  });

  // call departments type
  useEffect(() => {
    {
      fetchOrganizationDepartment(org.organization_id)
        .then((data) => {
          setDepartments(data?.Departments);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/designation/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response.data.organizationdesignation;
      console.log("KSBB", response.data);
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

    if (!formData.organization_department_id)
      errors.organization_department_id = "Department is required.";

    if (!formData.designation_name)
      errors.designation_name = "Designation Name is required.";

    if (!formData.designation_short_name)
      errors.designation_short_name = "Designation short name is required.";

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
          `${MAIN_URL}/api/organizations/${org.organization_id}/designation/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/designation`,
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
          ? "Businees Designation Updated!"
          : "Business Designation Created!"
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
        updateMessage={"Designation"}
        addMessage={"Designation"}
        homeLink={"/organization/designation"}
        homeText={" Designation"}
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
                  label="Department"
                  name="organization_department_id"
                  value={formData.organization_department_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_department_id}
                  helperText={formErrors.organization_department_id}
                  required
                >
                  {departments?.map((option) => (
                    <MenuItem
                      key={option.organization_department_id}
                      value={option.organization_department_id}
                    >
                      {option.department_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Designation Name"
                  name="designation_name"
                  value={formData.designation_name}
                  onChange={handleChange}
                  error={!!formErrors.designation_name}
                  helperText={formErrors.designation_name}
                  required
                  inputProps={{ maxLength: 100 }}
                />

                <TextField
                  fullWidth
                  label="Designation Short Name"
                  name="designation_short_name"
                  value={formData.designation_short_name}
                  onChange={handleChange}
                  error={!!formErrors.designation_short_name}
                  helperText={formErrors.designation_short_name}
                  required
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

export default OrganizationDesignationsForm;
