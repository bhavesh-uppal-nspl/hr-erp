import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import {
  fetchholidaycalendar,
  fetchholidaytypes,
} from "../../../Apis/Holidays-api";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import {MAIN_URL } from "../../../Configurations/Urls";

function HolidayForm({ mode }) {
  const { id } = useParams(); // only used in edit mode
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [holidayType, setHolidatType] = useState([]);
  const [holidayCalendar, setHolidayCalendar] = useState([]);

  const [formData, setFormData] = useState({
    holiday_name: "",
    holiday_date: "",
    is_recurring: false,
    organization_holiday_calendar_id: "",
    organization_holiday_type_id: "",
    description: "",
  });

  useEffect(() => {
    {
      fetchholidaycalendar(org.organization_id)
        .then((data) => {
          setHolidayCalendar(data.Holidaycalenders);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      fetchholidaytypes(org.organization_id)
        .then((data) => {
          setHolidatType(data.holidaytypes);
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
        `${MAIN_URL}/api/organizations/${org.organization_id}/holiday/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
      let a = response.data.holiday;
      setFormData(a);
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

  const validateForm = () => {
    const errors = {};

    if (!formData.holiday_name)
      errors.holiday_name = "Holiday name is required.";

    if (!formData.holiday_date) errors.holiday_date = "Holiday Date required.";

    if (!formData.organization_holiday_calendar_id)
      errors.organization_holiday_calendar_id =
        "holiday calendar name is required.";

    if (!formData.organization_holiday_type_id)
      errors.organization_holiday_type_id = "holiday type name is required.";

    if (!formData.description)
      errors.description = "holiday description is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/holiday/${id}`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/holiday`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      }
      toast.success(mode === "edit" ? "Holiday updated!" : "Holiday created!");
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

  console.log("formdata", formData);

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Holiday"}
        addMessage={"Holiday"}
        homeLink={"/holiday/holiday"}
        homeText={"Holidays"}
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
                  label="Holiday Name"
                  name="holiday_name"
                  value={formData.holiday_name}
                  onChange={handleChange}
                  error={!!formErrors.holiday_name}
                  helperText={formErrors.holiday_name}
                  required
                />
                <TextField
                  fullWidth
                  label="Holiday Date"
                  name="holiday_date"
                  type="date"
                  value={formData.holiday_date}
                  onChange={handleChange}
                  error={!!formErrors.holiday_date}
                  helperText={formErrors.holiday_date}
                  required
                  InputLabelProps={{
                    shrink: true, // Ensures the label doesn't overlap with the date
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="is_recurring"
                      checked={formData.is_recurring}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_recurring: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Is Recurring?"
                />

                {formErrors.is_recurring && (
                  <FormHelperText error>
                    {formErrors.is_recurring}
                  </FormHelperText>
                )}
                <TextField
                  select
                  fullWidth
                  label="Holiday Calendar Name"
                  name="organization_holiday_calendar_id"
                  value={formData.organization_holiday_calendar_id ??""}
                  onChange={handleChange}
                  error={!!formErrors.organization_holiday_calendar_id}
                  helperText={formErrors.organization_holiday_calendar_id}
                  required
                  renderValue={(selected) => {
                    console.log("Selected ID:", selected);
                    const selectedOption = holidayCalendar.find(
                      (option) =>
                        String(option.organization_holiday_calendar_id) ===
                        String(selected)
                    );
                    console.log("Matched Option:", selectedOption);
                    return selectedOption
                      ? selectedOption.holiday_calendar_name
                      : "";
                  }}
                >
                  {holidayCalendar.map((option) => (
                    <MenuItem
                      key={option.organization_holiday_calendar_id}
                      value={option.organization_holiday_calendar_id}
                    >
                      {`${option.holiday_calendar_name} (${new Date(
                        option.holiday_calendar_year_start_date
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })} ➖ ${new Date(
                        option.holiday_calendar_year_end_date
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })})`}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Holiday Type"
                  name="organization_holiday_type_id"
                  value={formData.organization_holiday_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_holiday_type_id}
                  helperText={formErrors.organization_holiday_type_id}
                  required
                >
                  {holidayType.map((option) => (
                    <MenuItem
                      key={option.organization_holiday_type_id}
                      value={option.organization_holiday_type_id}
                    >
                      {option.holiday_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Holiday Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  required
                />

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

export default HolidayForm;
