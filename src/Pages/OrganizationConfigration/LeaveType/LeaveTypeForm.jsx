import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { FormControlLabel, Checkbox } from "@mui/material";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";

function LeaveTypeForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    leave_type_name: "",
    description: "",
    max_days_allowed: "",
    carry_forward: false,
    requires_approval: false,
    is_active: true,
    leave_type_code: "",
    leave_compensation_type: "",
    compensation_code:""
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/leave-type/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response.data.leavetypes;
      setFormData(a);
      setLoading(false);
    };
    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  console.log("gyfd", formData);
  const validateForm = () => {
    const errors = {};

    if (!formData.leave_type_name)
      errors.leave_type_name = "Leave Name is required.";

    if (!formData.leave_type_code)
      errors.leave_type_code = "Leave Short Name is required.";

    if (!formData.max_days_allowed)
      errors.max_days_allowed = "Max Days are required.";

    if (!formData.leave_compensation_type)
      errors.leave_compensation_type = "Compensation type is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/leave-type/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/leave-type`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit" ? "Leave Type updated!" : "Leave Type created!"
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
        updateMessage={"Leave Type"}
        addMessage={"Leave Type"}
        homeLink={"/organization-configration/leave-types"}
        homeText={"Leave Types"}
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
                  label="Leave Type Name"
                  name="leave_type_name"
                  value={formData.leave_type_name}
                  onChange={handleChange}
                  error={!!formErrors.leave_type_name}
                  helperText={formErrors.leave_type_name}
                  inputProps={{ maxLength: 50 }}
                  required
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="requires_approval"
                      checked={formData.requires_approval}
                      onChange={handleChange}
                    />
                  }
                  label="Requires Approval"
                />

                <TextField
                  select
                  fullWidth
                  label="Compenation Type"
                  name="leave_compensation_type"
                  value={formData.leave_compensation_type}
                  onChange={handleChange}
                  error={!!formErrors.leave_compensation_type}
                  helperText={formErrors.leave_compensation_type}
                  required
                >
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                  <MenuItem value="any">Any</MenuItem>
                </TextField>

                  <TextField
                  fullWidth
                  label="Compensation code"
                  name="compensation_code"
                  value={formData.compensation_code}
                  onChange={handleChange}
                  error={!!formErrors.compensation_code}
                  helperText={formErrors.compensation_code}
                  inputProps={{ maxLength: 4 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Leave Code"
                  name="leave_type_code"
                  value={formData.leave_type_code}
                  onChange={handleChange}
                  error={!!formErrors.leave_type_code}
                  helperText={formErrors.leave_type_code}
                  inputProps={{ maxLength: 20 }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                    />
                  }
                  label="Is Active"
                />

                <TextField
                  fullWidth
                  label="Max Days Allow"
                  type="number"
                  name="max_days_allowed"
                  value={formData.max_days_allowed}
                  onChange={handleChange}
                  error={!!formErrors.max_days_allowed}
                  helperText={formErrors.max_days_allowed}
                  required
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="carry_forward"
                      checked={formData.carry_forward}
                      onChange={handleChange}
                    />
                  }
                  label="Carry Forward"
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  inputProps={{ maxLength: 255 }}
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

export default LeaveTypeForm;
