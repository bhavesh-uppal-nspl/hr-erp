import React, { useState, useEffect } from "react";
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
import { fetchInterns } from "../../../Apis/InternManagement";

function InterExitRecordForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    intern_id : "",
    exit_type: "",
    exit_date: "",
    last_working_day: "",
    reason_for_exit: "",
    handover_completed: "",
    handover_notes: "",
    clearance_status: "",
    manager_feedback: "",
    intern_feedback: "",
    certificate_issued: "",
    certificate_issue_date: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [Intern, setIntern] = useState([]);
  let navigate = useNavigate();

  const Status = ["Pending", "In Progress", "Completed"];
  const Type = ["Completed", "Terminated", "Resigned", "ConvertedToEmployee"];
  useEffect(() => {
    {
      fetchInterns(org?.organization_id)
        .then((data) => {
          setIntern(data?.intership?.data);
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
          `${MAIN_URL}/api/organizations/${org.organization_id}/intern-exit/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const a = response.data.intership;
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

  const validateForm = () => {
    const errors = {};

    if (!formData.intern_id) errors.intern_id = "Intern is required.";

    if (!formData.exit_type) {
      errors.exit_type = "Exit Type is required.";
    }
    if (!formData.exit_date) {
      errors.exit_date = "Exit date is required.";
    }
    // if (!formData.last_working_day) {
    //   errors.last_working_day = "Last working date is required.";
    // }

    // if (!formData.reason_for_exit) {
    //   errors.reason_for_exit = "Reason for exit is required.";
    // }
    // if (!formData.clearance_status) {
    //   errors.clearance_status = "Clearance status is required.";
    // }

    // if (
    //   formData.exit_date &&
    //   formData.last_working_day &&
    //   new Date(formData.exit_date) > new Date(formData.last_working_day)
    // )

    // if (!formData.clearance_status)
    //   errors.clearance_status = "Clearance stataus is required.";

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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-exit/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-exit`,
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
          ? "Intern  Exit Record  Updated!"
          : "Intern Exit Record Created!"
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
        updateMessage={"Intern Exit"}
        addMessage={"Intern  Exit"}
        homeLink={"/organization/intern/intern-exit"}
        homeText={"Intern Exit"}
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
                  label="Intern Name/ID"
                  name="intern_id"
                  value={formData?.intern_id}
                  onChange={handleChange}
                  error={!!formErrors.intern_id}
                  helperText={formErrors.intern_id}
                  required
                >
                  {Intern?.map((option) => {
                    const fullName =
                      `${option?.first_name || ""} ${option?.middle_name || ""} ${option?.last_name || ""} -- ${option?.employee_code || ""}`.trim();
                    return (
                      <MenuItem
                        key={option?.intern_id}
                        value={option?.intern_id}
                      >
                        {fullName}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  fullWidth
                  type="date"
                  label="Exit Date"
                  name="exit_date"
                  value={formData.exit_date}
                  onChange={handleChange}
                  error={!!formErrors.exit_date}
                  helperText={formErrors.exit_date}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="date"
                  label="Last Working Date"
                  name="last_working_day"
                  value={formData.last_working_day}
                  onChange={handleChange}
                  error={!!formErrors.last_working_day}
                  helperText={formErrors.last_working_day}
                  
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="date"
                  label="Certification Issue Date"
                  name="certificate_issue_date"
                  value={formData.certificate_issue_date}
                  onChange={handleChange}
                  error={!!formErrors.certificate_issue_date}
                  helperText={formErrors.certificate_issue_date}
                  
                  InputLabelProps={{ shrink: true }}
                />



                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.certificate_issued}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          certificate_issued: e.target.checked,
                        })
                      }
                      name="certificate_issued"
                    />
                  }
                  label="Certificate Issued"
                />
                {formErrors.certificate_issued && (
                  <FormHelperText error>
                    {formErrors.certificate_issued}
                  </FormHelperText>
                )}

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.handover_completed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          handover_completed: e.target.checked,
                        })
                      }
                      name="handover_completed"
                    />
                  }
                  label="Handover Completed"
                />
                {formErrors.handover_completed && (
                  <FormHelperText error>
                    {formErrors.handover_completed}
                  </FormHelperText>
                )}

                <TextField
                  fullWidth
                  label="Handover Notes"
                  name="handover_notes"
                  value={formData.handover_notes}
                  onChange={handleChange}
                  error={!!formErrors.handover_notes}
                  helperText={formErrors.handover_notes}
                  multiline
                  rows={2}
                />

                <TextField
                  fullWidth
                  label="Manager FeedBack"
                  name="manager_feedback"
                  value={formData.manager_feedback}
                  onChange={handleChange}
                  error={!!formErrors.manager_feedback}
                  helperText={formErrors.manager_feedback}
                  multiline
                  rows={2} 
                />

                <TextField
                  select
                  fullWidth
                  label="Clearance Status"
                  name="clearance_status"
                  value={formData.clearance_status}
                  onChange={handleChange}
                  error={!!formErrors.clearance_status}
                  helperText={formErrors.clearance_status}
                  required
                >
                  {Status?.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>


                <TextField
                  select
                  fullWidth
                  label="Exit Type"
                  name="exit_type"
                  value={formData.exit_type}
                  onChange={handleChange}
                  error={!!formErrors.exit_type}
                  helperText={formErrors.exit_type}
                  required
                >
                  {Type?.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>


                <TextField

                  fullWidth
                  label="Intern FeedBack"
                  name="intern_feedback"
                  value={formData.intern_feedback}
                  onChange={handleChange}
                  error={!!formErrors.intern_feedback}
                  helperText={formErrors.intern_feedback}
                  multiline
                  rows={2} // Makes it two lines high
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
                        mt:3,
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
                        mt:3,
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

export default InterExitRecordForm;
