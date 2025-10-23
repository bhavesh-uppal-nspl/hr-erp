import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import { fetchRotationPatterns } from "../../../Apis/Workshift-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";

function WorkShiftRotationAssignmentForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [employee, setEmployee] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    organization_work_shift_rotation_pattern_id : "",
    effective_start_date : "",
    effective_end_date: "",
    anchor_day_number: "",
    is_active : "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [Pattern, setPattern] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchRotationPatterns(org?.organization_id)
        .then((data) => {
          setPattern(data?.shiftPattern?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    fetchOrganizationEmployee(org?.organization_id)
      .then((data) => setEmployee(data?.employees))
      .catch((err) => setFormErrors(err.message));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.employee_id) errors.employee_id = "Employee is required.";

    if (!formData.effective_start_date ) errors.effective_start_date  = "Start Date is required.";

       if (!formData.effective_end_date ) errors.effective_end_date  = "End Date is required.";

       if (formData.effective_start_date && formData.effective_end_date && new Date(formData.effective_end_date) < new Date(formData.effective_start_date)) {
  errors.effective_end_date = "End Date cannot be before Start Date.";
}

    if (!formData.organization_work_shift_rotation_pattern_id)
      errors.organization_work_shift_rotation_pattern_id = "WorkShift pattern is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/workshift-rotation-assignment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("aa", response)
      let a = response?.data;
      setFormData(a);
      setLoading(false);
    };
    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setbtnLoading(true);
    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-assignment/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/workshift-rotation-assignment`,
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
          ? "WorkShift Rotation assignment updated!"
          : "WorkShift Rotation assignment created!"
      );
      setFormErrors({});
      navigate(-1);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
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
        updateMessage={"WorkShift Rotation Assignment"}
        addMessage={"WorkShift Rotation Assignment"}
        homeLink={"/organization/work-shift-rotation-assignment"}
        homeText={"WorkShift Rotation Assignment"}
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
                  label="Workshift Pattern"
                  name="organization_work_shift_rotation_pattern_id"
                  value={formData?.organization_work_shift_rotation_pattern_id}
                  onChange={handleChange}
                  error={
                    !!formErrors.organization_work_shift_rotation_pattern_id
                  }
                  helperText={
                    formErrors.organization_work_shift_rotation_pattern_id
                  }
                  required
                >
                  {Pattern?.map((option) => (
                    <MenuItem
                      key={option.organization_work_shift_rotation_pattern_id}
                      value={
                        option?.organization_work_shift_rotation_pattern_id
                      }
                    >
                      {option?.pattern_name}
                    </MenuItem>
                  ))}
                </TextField>


                <TextField
                  fullWidth
                  label="Effective Start Date"
                  name="effective_start_date"
                  type="date"
                  value={formData?.effective_start_date}
                  onChange={handleChange}
                  error={!!formErrors.effective_start_date}
                  helperText={formErrors.effective_start_date}
                  InputLabelProps={{ shrink: true }}
                  required
                />

                <TextField
                  fullWidth
                  label="Effective End Date"
                  name="effective_end_date"
                  type="date"
                  value={formData?.effective_end_date}
                  onChange={handleChange}
                  error={!!formErrors.effective_end_date}
                  helperText={formErrors.effective_end_date}
                  InputLabelProps={{ shrink: true }}
                  required
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Anchor day No."
                  name="anchor_day_number"
                  value={formData?.anchor_day_number}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) <= 366) {
                      handleChange(e);
                    }
                  }}
                  error={!!formErrors.anchor_day_number}
                  helperText={formErrors.anchor_day_number}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: "1", max: "366" }}
                />

                <TextField
                  fullWidth
                  label="Remarks"
                  name="remarks"
                  value={formData?.remarks}
                  onChange={handleChange}
                  error={!!formErrors.remarks}
                  helperText={formErrors.remarks}
                  inputProps={{ maxLength: 255 }}
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

export default WorkShiftRotationAssignmentForm;