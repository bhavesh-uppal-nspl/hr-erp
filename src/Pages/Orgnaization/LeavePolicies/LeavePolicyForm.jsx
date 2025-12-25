import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  MenuItem,
  TextField,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import {
  fetchEmployeeLeaveEntitlements,
  fetchOrganizationEmployee,
} from "../../../Apis/Employee-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";

function LeavePolicyForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    organization_leave_entitlement_id: "",
    policy_name: "",
    policy_description: "",
    usage_period: "",
    custom_period_days: "",
    max_leaves_per_period: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [leaveEntitle, setLeaveEntitle] = useState([]);

  const maxLimits = {
    weekly: 7,
    monthly: 31,
    quarterly: 90,
    annual: 366,
    custom: 366,
  };

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchEmployeeLeaveEntitlements(org?.organization_id)
        .then((data) => {
          setLeaveEntitle(data?.orgleaveEntitle);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/leave-policy/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.policies;
      console.log("data of leave is", a);
      setFormData(a);
      setLoading(false);
    };
    if ((mode === "edit"  || mode === "view") && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If usage period changes
    if (name === "usage_period") {
      setFormData((prev) => ({
        ...prev,
        usage_period: value,
        max_leaves_per_period:
          value === "custom" ? "" : prev.max_leaves_per_period,
        custom_period_days: value === "custom" ? prev.custom_period_days : "",
      }));
      setFormErrors((prev) => ({
        ...prev,
        usage_period: "",
        max_leaves_per_period: "",
        custom_period_days: "",
      }));
      return;
    }

    if (name === "max_leaves_per_period") {
      const limit = maxLimits[formData.usage_period] || 366;
      if (value && Number(value) > limit) {
        setFormErrors((prev) => ({
          ...prev,
          max_leaves_per_period: `For ${formData.usage_period}, max allowed is ${limit}`,
        }));
        return;
      }
    }
    if (name === "custom_period_days" && value && Number(value) > 366) {
      setFormErrors((prev) => ({
        ...prev,
        custom_period_days: "Custom period cannot exceed 366 days",
      }));
      return;
    }

    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_leave_entitlement_id) {
      errors.organization_leave_entitlement_id =
        "Entitlement period  is required.";
    }

    if (!formData.policy_name) {
      errors.policy_name = "Policy name is required.";
    }

    if (!formData.usage_period) {
      errors.usage_period = "usage period is required.";
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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/leave-policy/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/leave-policy`,
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
          ? "Employee Leave Policy Updated!"
          : "Employee Leave Policy Created!"
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

  const resetFields = (fields) => {
    fields.forEach((field) =>
      handleChange({ target: { name: field, value: "" } })
    );
  };

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Leave Policy"}
        addMessage={"Leave Policy"}
        homeLink={"/organization/leave-policy"}
        homeText={"Leave Policy"}
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
            


             
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "100%", // ensures proper centering
                  }}
                >
                  
                  <Autocomplete
                fullWidth
                  options={leaveEntitle || []}
                  getOptionLabel={(option) =>
                    option.leavetype?.leave_type_name || ""
                  }
                  value={
                    leaveEntitle?.find(
                      (option) =>
                        option.organization_leave_entitlement_id ===
                        formData.organization_leave_entitlement_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "organization_leave_entitlement_id",
                        value:
                          newValue?.organization_leave_entitlement_id ||
                          "",
                      },
                    });
                  }}
                  disabled={mode === "view" || leaveEntitle?.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Leave Entitlement"
                      error={
                        !!formErrors.organization_leave_entitlement_id
                      }
                      helperText={
                        formErrors.organization_leave_entitlement_id
                      }
                      required
                      fullWidth
                    />
                  )}
                />


                <TextField
                  fullWidth
                  label="Policy Name"
                  name="policy_name"
                  value={formData?.policy_name}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  error={!!formErrors.policy_name}
                  helperText={formErrors.policy_name}
                  inputProps={{ maxLength: 100 }}
                  required
                />
                </Box>



                

                 
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "100%", // ensures proper centering
                  }}
                >

                  
                <TextField
                  select
                  fullWidth
                  label="Usage Period"
                  name="usage_period"
                  disabled={mode === "view"}
                  value={formData.usage_period}
                  onChange={handleChange}
                  error={!!formErrors.usage_period}
                  helperText={formErrors.usage_period}
                  required
                >
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="annual">Annual</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  type="number"
                 
                  label="Max Leave Per Period"
                  name="max_leaves_per_period"
                  value={formData.max_leaves_per_period}
                  onChange={handleChange}
                  error={!!formErrors.max_leaves_per_period}
                  helperText={
                    formErrors.max_leaves_per_period ||
                    (formData.usage_period && formData.usage_period !== "custom"
                      ? `Allowed max: ${maxLimits[formData.usage_period]}`
                      : "")
                  }
                  required={formData.usage_period !== "custom"}
                  disabled={formData.usage_period === "custom" || mode === "view"}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    step: "1",
                    min: "1",
                    max: maxLimits[formData.usage_period] || 366,
                  }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Custom Period Days"
                  name="custom_period_days"
                  value={formData.custom_period_days}
                  onChange={handleChange}
                  error={!!formErrors.custom_period_days}
                  helperText={formErrors.custom_period_days}
                  disabled={formData.usage_period !== "custom"  || mode === "view"}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    step: "1",
                    min: "1",
                    max: "366",
                  }}
                />


                  
                </Box>

                <TextField
                  fullWidth
                  label="Policy Description"
                  name="policy_description"
                  value={formData.policy_description}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  error={!!formErrors.policy_description}
                  helperText={formErrors.policy_description}
                  inputProps={{ maxLength: 100 }}
                  multiline
                  minRows={3}
                  maxRows={5}
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

export default LeavePolicyForm;
