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

function HolidayCalendarForm({ mode }) {
  const { id } = useParams(); // only used in edit mode
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    holiday_calendar_name: "",
    holiday_calendar_year_end_date: null,
    holiday_calendar_year_start_date: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/holiday-calendar/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response.data.holidaycalendar;
      setFormData(a);
      setLoading(false);
    };
    if ((mode === "edit" || mode === "view")&& id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.holiday_calendar_name)
      errors.holiday_calendar_name = "Calendar Name is required.";

    if (!formData.holiday_calendar_year_start_date)
      errors.holiday_calendar_year_start_date = "Start Date is required.";

    if (!formData.holiday_calendar_year_end_date)
      errors.holiday_calendar_year_end_date = "End Date is required.";

    // Only run advanced checks if both dates are provided
    if (
      formData.holiday_calendar_year_start_date &&
      formData.holiday_calendar_year_end_date
    ) {
      const startDate = new Date(formData.holiday_calendar_year_start_date);
      const endDate = new Date(formData.holiday_calendar_year_end_date);
      const today = new Date();

      // Condition 1: Start date should not be in the future

      // Condition 2: End date should not be less than start date
      if (endDate < startDate) {
        errors.holiday_calendar_year_end_date =
          "End Date cannot be before Start Date.";
      }

      // Condition 3: Start date and end date should not be equal
      if (startDate.getTime() === endDate.getTime()) {
        errors.holiday_calendar_year_end_date =
          "Start Date and End Date cannot be the same.";
      }
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
          `${MAIN_URL}/api/organizations/${org.organization_id}/holiday-calendar/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/holiday-calendar`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(mode === "edit" ? "Status updated!" : "Status created!");
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
        updateMessage={"Holiday Calendar"}
        addMessage={"Holiday Calendar"}
        homeLink={"/leave/holiday-calendar"}
        homeText={"Holiday Calendar"}
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
                  label="Holiday Calendar Name"
                  name="holiday_calendar_name"
                  value={formData.holiday_calendar_name}
                  onChange={handleChange}
                  disabled= {mode ==="view"}
                  error={!!formErrors.holiday_calendar_name}
                  helperText={formErrors.holiday_calendar_name}
                  required
                  inputProps={{ maxLength: 100 }}
                />

                <TextField
                  fullWidth
                  label="Holiday Start Date"
                  name="holiday_calendar_year_start_date"
                  type="date"
                   disabled= {mode ==="view"}
                  value={formData.holiday_calendar_year_start_date}
                  onChange={handleChange}
                  error={!!formErrors.holiday_calendar_year_start_date}
                  helperText={formErrors.holiday_calendar_year_start_date}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Holiday End Date"
                  name="holiday_calendar_year_end_date"
                  type="date"
                   disabled= {mode ==="view"}
                  value={formData.holiday_calendar_year_end_date}
                  onChange={handleChange}
                  error={!!formErrors.holiday_calendar_year_end_date}
                  helperText={formErrors.holiday_calendar_year_end_date}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <Grid container spacing={2}>
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
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default HolidayCalendarForm;
