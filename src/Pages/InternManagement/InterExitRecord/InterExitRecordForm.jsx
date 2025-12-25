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
  Autocomplete,
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
    intern_id: "",
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
  if (!org?.organization_id) return;

  fetchInterns(org.organization_id)
    .then((data) => {
      const interns = data?.intership?.data || [];

      // Remove exited interns
      let activeInterns = interns.filter(
        (item) => item?.status?.internship_status_name !== "Exited"
      );

      const selectedInternId = formData?.intern_id;

      // Add selected intern back in BOTH edit and view modes
      if ((mode === "edit" || mode === "view") && selectedInternId) {
        const selectedIntern = interns.find(
          (i) => i.intern_id === selectedInternId
        );

        if (selectedIntern) {
          const exists = activeInterns.some(
            (i) => i.intern_id === selectedInternId
          );

          if (!exists) {
            activeInterns.push(selectedIntern);
          }
        }
      }

      setIntern(activeInterns);
    })
    .catch((err) => {
      setFormErrors({ general: err.message });
    });
}, [org?.organization_id, mode, formData?.intern_id]);

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

    if ((mode === "edit" || mode === "view") && id) {
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
                <Autocomplete
                  fullWidth
                  options={Intern || []}
                  getOptionLabel={(option) =>
                    `${option?.first_name || ""} ${option?.middle_name || ""} ${option?.last_name || ""}  ( ${option?.intern_code || ""} )`.trim()
                  }
                  value={
                    Intern?.find(
                      (intern) => intern?.intern_id === formData?.intern_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "intern_id",
                        value: newValue?.intern_id || "",
                      },
                    });
                  }}
                  disabled={Intern?.length === 0 || mode === "view"}
                  isOptionEqualToValue={(option, value) =>
                    option?.intern_id === value?.intern_id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Intern Name/ID"
                      name="intern_id"
                      required
                      error={!!formErrors?.intern_id}
                      helperText={formErrors?.intern_id}
                      fullWidth
                    />
                  )}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                    disabled={mode === "view"}
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
                    disabled={mode === "view"}
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

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "100%", // ensures proper centering
                  }}
                >
                  <TextField
                    fullWidth
                    type="date"
                    label="Exit Date"
                    name="exit_date"
                    disabled={mode === "view"}
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
                    disabled={mode === "view"}
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
                    disabled={mode === "view"}
                    name="certificate_issue_date"
                    value={formData.certificate_issue_date}
                    onChange={handleChange}
                    error={!!formErrors.certificate_issue_date}
                    helperText={formErrors.certificate_issue_date}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Handover Notes"
                  name="handover_notes"
                  disabled={mode === "view"}
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
                  disabled={mode === "view"}
                  name="manager_feedback"
                  value={formData.manager_feedback}
                  onChange={handleChange}
                  error={!!formErrors.manager_feedback}
                  helperText={formErrors.manager_feedback}
                  multiline
                  rows={2}
                />

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
                    label="Clearance Status"
                    disabled={mode === "view"}
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
                    disabled={Type?.length === 0  || mode === "view"}
                  >
                    {Type?.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <TextField
                  fullWidth
                  label="Intern FeedBack"
                  name="intern_feedback"
                  value={formData.intern_feedback}
                  onChange={handleChange}
                  disabled={mode === "view"}
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
                    disabled={loading || btnLoading || mode === "view"}
                    sx={{
                      mt: 3,
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
                        mt: 3,
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
