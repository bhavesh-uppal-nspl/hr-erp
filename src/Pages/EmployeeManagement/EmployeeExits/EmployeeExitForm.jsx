import React, { useState, useEffect } from "react";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import {
  fetchOrganizationEmploymenentExiReason,
  fetchOrganizationEmploymenentExiReasonTpes,
} from "../../../Apis/Employment-exit-reason";
import {
  Box,
  Button,
  Grid,
  Paper,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextField,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";

function EmployeeExitForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    employee_id: "",
    resignation_date: "",
    notice_period_start: "",
    notice_period_end: "",
    last_working_date: "",
    relieving_date: "",
    organization_employment_exit_reason_id: 0,
    exit_interview_done: "",
    comments: "",
    organization_employment_exit_reason_type_id: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [ExitReason, setExitReason] = useState([]);
  const [ExitReasonType, setExitReasonType] = useState([]);

  let navigate = useNavigate();

  // call for exit reason type

  useEffect(() => {
    {
      fetchOrganizationEmploymenentExiReasonTpes(org.organization_id)
        .then((data) => {
          setExitReasonType(data.exitreason.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

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

  console.log();

  useEffect(() => {
    const getdataById = async () => {
      try {
        const response = await axios.get(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employee-exit/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const a = response.data.employeexit;
        setFormData(a);
      } catch (error) {
        console.error("Error fetching employee exit data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));


  };
  useEffect(() => {
    const fetchExitReasons = async () => {
      if (
        formData.organization_employment_exit_reason_type_id !== "" &&
        formData.organization_employment_exit_reason_type_id !== null
      ) {
        try {
          let data = await fetchOrganizationEmploymenentExiReason(
            org?.organization_id,
            formData.organization_employment_exit_reason_type_id
          );
          console.log("datasis in", data);
          setExitReason(data?.exitreason);
        } catch (err) {
          console.error("Failed to fetch exit reasons:", err);
        }
      }
    };

    fetchExitReasons();
  }, [formData?.organization_employment_exit_reason_type_id]);

  console.log("exit reason fdgfdgd ", ExitReason);
  const validateForm = () => {
    const errors = {};

    if (!formData.employee_id) errors.employee_id = "Employee ID is required.";

    if (!formData.resignation_date) {
      errors.resignation_date = "Resignation date is required.";
    }
    if (!formData.notice_period_start) {
      errors.notice_period_start = "Notice period start date is required.";
    }
    if (!formData.notice_period_end) {
      errors.notice_period_end = "Notice period end date is required.";
    }
    if (!formData.last_working_date) {
      errors.last_working_date = "Last working date is required.";
    }
    if (!formData.relieving_date) {
      errors.relieving_date = "Relieving date is required.";
    }
    if (!formData.organization_employment_exit_reason_id) {
      errors.organization_employment_exit_reason_id =
        "Exit reason is required.";
    }

    if (
      formData.notice_period_start &&
      formData.notice_period_end &&
      new Date(formData.notice_period_start) >
        new Date(formData.notice_period_end)
    ) {
      errors.notice_period_end =
        "Notice period end date cannot be before start date.";
    }

    if (
      formData.resignation_date &&
      formData.notice_period_start &&
      new Date(formData.resignation_date) >
        new Date(formData.notice_period_start)
    ) {
      errors.notice_period_start =
        "Notice period should start on or after resignation date.";
    }

    if (
      formData.notice_period_end &&
      formData.last_working_date &&
      new Date(formData.last_working_date) <
        new Date(formData.notice_period_end)
    ) {
      errors.last_working_date =
        "Last working date should be on or after notice period end date.";
    }

    if (
      formData.last_working_date &&
      formData.relieving_date &&
      new Date(formData.relieving_date) < new Date(formData.last_working_date)
    ) {
      errors.relieving_date =
        "Relieving date should be on or after last working date.";
    }

    if (formData.comments && formData.comments?.length > 500) {
      errors.comments = "Comments cannot exceed 500 characters.";
    }

    if (typeof formData.exit_interview_done !== "boolean") {
      errors.exit_interview_done =
        "Exit interview done field must be true or false.";
    }

    if (!formData.organization_employment_exit_reason_id)
      errors.organization_employment_exit_reason_id =
        "Exit reason is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  console.log("formdata is iosksn ", formData);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        // Call edit API
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employee-exit/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employee-exit`,
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
          ? "Employee Exit Details Updated!"
          : "Employee Exit Details Created!"
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
        updateMessage={"Employee Exit "}
        addMessage={"Employee Exit"}
        homeLink={"/organization/employee/employee-exits"}
        homeText={"Employee Exit"}
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

                    //  `${option.first_name || ""} ${option.middle_name || ""} ${option.last_name || ""} ➖ ${option.designation.designation_name}`.trim();
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
                  fullWidth
                  type="date"
                  label="Resignation Date"
                  name="resignation_date"
                  value={formData.resignation_date}
                  onChange={handleChange}
                  error={!!formErrors.resignation_date}
                  helperText={formErrors.resignation_date}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="date"
                  label="Notice Period Start Date"
                  name="notice_period_start"
                  value={formData.notice_period_start}
                  onChange={handleChange}
                  error={!!formErrors.notice_period_start}
                  helperText={formErrors.notice_period_start}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="date"
                  label="Notice Period End Date"
                  name="notice_period_end"
                  value={formData.notice_period_end}
                  onChange={handleChange}
                  error={!!formErrors.notice_period_end}
                  helperText={formErrors.notice_period_end}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="date"
                  label="Last Working Date"
                  name="last_working_date"
                  value={formData.last_working_date}
                  onChange={handleChange}
                  error={!!formErrors.last_working_date}
                  helperText={formErrors.last_working_date}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="date"
                  label="Relieving Date"
                  name="relieving_date"
                  value={formData.relieving_date}
                  onChange={handleChange}
                  error={!!formErrors.relieving_date}
                  helperText={formErrors.relieving_date}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  select
                  fullWidth
                  label="Exit Reason Category"
                  name="organization_employment_exit_reason_type_id"
                  value={formData.organization_employment_exit_reason_type_id}
                  onChange={handleChange}
                  error={
                    !!formErrors?.organization_employment_exit_reason_type_id
                  }
                  helperText={
                    formErrors?.organization_employment_exit_reason_type_id
                  }
                  required
                >
                  {ExitReasonType?.map((option) => (
                    <MenuItem
                      key={option?.organization_employment_exit_reason_type_id}
                      value={
                        option?.organization_employment_exit_reason_type_id
                      }
                    >
                      {option?.employment_exit_reason_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Exit Reason"
                  name="organization_employment_exit_reason_id"
                  value={formData.organization_employment_exit_reason_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_employment_exit_reason_id}
                  helperText={formErrors.organization_employment_exit_reason_id}
                  required
                >
                  {ExitReason?.map((option) => (
                    <MenuItem
                      key={option.organization_employment_exit_reason_id}
                      value={option.organization_employment_exit_reason_id}
                    >
                      {option.employment_exit_reason_name}
                    </MenuItem>
                  ))}
                </TextField>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.exit_interview_done}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          exit_interview_done: e.target.checked,
                        })
                      }
                      name="exit_interview_done"
                    />
                  }
                  label="Exit Interview Done"
                />
                {formErrors.exit_interview_done && (
                  <FormHelperText error>
                    {formErrors.exit_interview_done}
                  </FormHelperText>
                )}

                <TextField
                  fullWidth
                  label="Comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  error={!!formErrors.comments}
                  helperText={formErrors.comments}
                  required
                />
              </Grid>

              <Grid container spacing={2}>
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
                      mt:3,
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

export default EmployeeExitForm;
