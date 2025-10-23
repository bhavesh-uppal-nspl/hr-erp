import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Avatar,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  CircularProgress,
  Switch,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";

import useInternDataStore from "../../../Zustand/Store/useInternDataStore";

function InternForm({ mode, setEmployeeId, InternId }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const { setInternData, Intern, InternErrors, DropDownData } =
    useInternDataStore();

  const genderOptions = ["Male", "Female", "Other"];
  const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];

  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  // console.log("Employees DropDownData:", DropDownData?.Employees);

  const [departmentlocation, setDepartmentLocation] = useState([]);
  const [departmentdesignation, setDepartmentDesignation] = useState([]);

  let navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("handle change e is ", name, value);

    if (name == "organization_internship_stage_id") {
      let fl = DropDownData?.InternStages?.find(
        (item) => item.organization_internship_stage_id == value
      );
      console.log("fll is ", fl);

      

      setInternData({ ["organization_internship_stage_id"]: fl.organization_internship_stage_id });
      setInternData({ ["organization_internship_status_id"]: fl?.organization_internship_status_id });
      return;
    } else {
      setInternData({ [name]: value });

    }
  };

  console.log("gyfgyguyg", DropDownData?.InternStages);

  useEffect(() => {
    const fetchDepartmentLocations = async () => {
      if (!Intern?.organization_department_id || !org?.organization_id) return;

      try {
        const res = await axios.get(
          `${MAIN_URL}/api/department-locations/all`,
          {
            params: {
              department_id: Intern?.organization_department_id,
              organization_id: org?.organization_id,
            },
          }
        );
        console.log("data uis xcomming ", res?.data?.data);
        setDepartmentLocation(res?.data?.data);
      } catch (error) {
        console.error("Failed to fetch department locations", error);
      }
    };

    fetchDepartmentLocations();
  }, [Intern?.organization_department_id, org?.organization_id]);

  // fetch all department designation

  useEffect(() => {
    const fetchDepartmentDesignation = async () => {
      if (!Intern?.organization_department_id || !org?.organization_id) return;

      try {
        const res = await axios.get(
          `${MAIN_URL}/api/department-designation/all`,
          {
            params: {
              department_id: Intern?.organization_department_id,
              organization_id: org?.organization_id,
            },
          }
        );
        setDepartmentDesignation(res?.data?.data);
      } catch (error) {
        console.error("Failed to fetch department designation", error);
      }
    };

    fetchDepartmentDesignation();
  }, [Intern?.organization_department_id, org?.organization_id]);

  const handleChangeImage = (name, value) => {
    setInternData({ [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmployeeId("ijij");
  };

  return (
    <Box px={4}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Profile Image Upload Section */}
          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              py={1}
            >
              <Avatar
                src={
                  Intern?.profile_image_url instanceof File
                    ? URL.createObjectURL(Intern?.profile_image_url)
                    : Intern?.profile_image_url
                      ? `${Intern?.profile_image_url}`
                      : ""
                }
                alt="Profile"
                sx={{ width: 96, height: 96 }}
              />

              <Button
                variant="outlined"
                component="label"
                size="small"
                sx={{ mt: 1, textTransform: "none" }}
              >
                {mode === "edit" ? "Edit Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      handleChangeImage("profile_image_url", file);
                    }
                  }}
                />
              </Button>
              {InternErrors?.profile_image_url && (
                <FormHelperText error>
                  {InternErrors?.profile_image_url}
                </FormHelperText>
              )}
            </Box>
          </Grid>

          {/* Main Form Fields */}
          <Grid item xs={12} md={8}>
            <Paper elevation={4} sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={Intern?.first_name}
                  onChange={(e) => {
                    const onlyLetters = e.target.value.replace(
                      /[^a-zA-Z\s]/g,
                      ""
                    ); // Allow letters and spaces
                    handleChange({
                      target: { name: "first_name", value: onlyLetters },
                    });
                  }}
                  error={!!InternErrors?.first_name}
                  helperText={InternErrors?.first_name}
                  required
                  inputProps={{ maxLength: 30 }}
                />
                <TextField
                  fullWidth
                  label="Middle Name"
                  name="middle_name"
                  value={Intern?.middle_name}
                  onChange={(e) => {
                    const onlyLetters = e.target.value.replace(
                      /[^a-zA-Z\s]/g,
                      ""
                    ); // Allow letters and spaces
                    handleChange({
                      target: { name: "middle_name", value: onlyLetters },
                    });
                  }}
                  error={!!InternErrors?.middle_name}
                  helperText={InternErrors?.middle_name}
                  inputProps={{ maxLength: 30 }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={Intern?.last_name}
                  onChange={(e) => {
                    const onlyLetters = e.target.value.replace(
                      /[^a-zA-Z\s]/g,
                      ""
                    ); // Allow letters and spaces
                    handleChange({
                      target: { name: "last_name", value: onlyLetters },
                    });
                  }}
                  error={!!InternErrors?.last_name}
                  helperText={InternErrors.last_name}
                  inputProps={{ maxLength: 30 }}
                />
                <TextField
                  fullWidth
                  label="Intern code"
                  name="intern_code"
                  value={Intern?.intern_code}
                  onChange={handleChange}
                  error={!!InternErrors?.intern_code}
                  helperText={InternErrors?.intern_code}
                  inputProps={{ maxLength: 10 }}
                  required
                />
                <TextField
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  name="date_of_birth"
                  value={Intern?.date_of_birth}
                  onChange={handleChange}
                  error={!!InternErrors?.date_of_birth}
                  helperText={InternErrors?.date_of_birth}
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  name="gender"
                  value={Intern?.gender}
                  onChange={handleChange}
                  error={!!InternErrors?.gender}
                  helperText={InternErrors?.gender}
                  required
                >
                  {genderOptions?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Marital Status"
                  name="marital_status"
                  value={Intern?.marital_status}
                  onChange={handleChange}
                  error={!!InternErrors?.marital_status}
                  helperText={InternErrors?.marital_status}
                  required
                >
                  {maritalStatusOptions?.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Organization Unit"
                  name="organization_unit_id"
                  value={Intern?.organization_unit_id}
                  onChange={handleChange}
                  error={!!InternErrors?.organization_unit_id}
                  helperText={InternErrors.organization_unit_id}
                >
                  {(DropDownData?.Units || []).map((option) => (
                    <MenuItem
                      key={option?.organization_unit_id}
                      value={option?.organization_unit_id}
                    >
                      {option?.unit_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Department"
                  name="organization_department_id"
                  value={Intern?.organization_department_id || ""}
                  onChange={handleChange}
                  error={!!InternErrors?.organization_department_id}
                  helperText={InternErrors.organization_department_id}
                  required
                >
                  {(DropDownData?.departments || []).map((option) => (
                    <MenuItem
                      key={option?.organization_department_id}
                      value={option?.organization_department_id}
                    >
                      {option?.department_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Location"
                  name="organization_department_location_id"
                  value={Intern?.organization_department_location_id || ""}
                  onChange={handleChange}
                  error={!!InternErrors?.organization_department_location_id}
                  helperText={InternErrors?.organization_department_location_id}
                  required
                >
                  {(departmentlocation || []).map((option) => (
                    <MenuItem
                      key={option?.organization_department_location_id}
                      value={option?.organization_department_location_id}
                    >
                      {option?.location?.location_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Internship Type"
                  name="organization_internship_type_id"
                  value={Intern?.organization_internship_type_id}
                  onChange={handleChange}
                  error={!!InternErrors?.organization_internship_type_id}
                  helperText={InternErrors?.organization_internship_type_id}
                  required
                >
                  {(DropDownData?.InternshipTypes || []).map((option) => (
                    <MenuItem
                      key={option?.organization_internship_type_id}
                      value={option?.organization_internship_type_id}
                    >
                      {option?.internship_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="WorkShift"
                  name="organization_work_shift_id"
                  value={Intern?.organization_work_shift_id}
                  onChange={handleChange}
                  error={!!InternErrors?.organization_work_shift_id}
                  helperText={!!InternErrors?.organization_work_shift_id}
                  required
                >
                  {DropDownData?.WorkShifts?.map((option) => (
                    <MenuItem
                      key={option?.organization_work_shift_id}
                      value={option?.organization_work_shift_id}
                    >
                      {option?.work_shift_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Internship Stages"
                  name="organization_internship_stage_id"
                  value={Intern?.organization_internship_stage_id || ""}
                  onChange={handleChange}
                  error={!!InternErrors.organization_internship_stage_id}
                  helperText={InternErrors.organization_internship_stage_id}
                  required
                >
                  {DropDownData?.InternStages?.map((option) => (
                    <MenuItem
                      key={option?.organization_internship_stage_id}
                      value={option?.organization_internship_stage_id}
                    >
                      {option?.internship_stage_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  type="date"
                  label="Date of Joining"
                  name="internship_start_date"
                  value={Intern?.internship_start_date}
                  onChange={handleChange}
                  error={!!InternErrors?.internship_start_date}
                  helperText={InternErrors?.internship_start_date}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  name="internship_end_date"
                  value={Intern?.internship_end_date}
                  onChange={handleChange}
                  error={!!InternErrors?.internship_end_date}
                  helperText={InternErrors?.internship_end_date}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <p style={{ margin: 0 }}>Stipend Applicable</p>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Intern?.is_paid === 1}
                        onChange={(e) =>
                          setInternData({ is_paid: e.target.checked ? 1 : 0 })
                        }
                        color="primary"
                      />
                    }
                    label={Intern?.is_paid === 1 ? "Yes" : "No"}
                    labelPlacement="end"
                  />
                </div>

                <TextField
                  fullWidth
                  type="number"
                  label="Stipend Amount"
                  name="stipend_amount"
                  value={Intern?.stipend_amount || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numbers with up to 2 decimal places
                    if (/^\d{0,10}(\.\d{0,2})?$/.test(value) || value === "") {
                      handleChange(e);
                    }
                  }}
                  error={!!InternErrors.stipend_amount}
                  helperText={InternErrors.stipend_amount}
                  inputProps={{
                    step: "0.01", // ensures increments by 0.01
                    min: 0, // prevent negative values
                  }}
                  disabled={Intern?.is_paid !== 1}
                />

                <TextField
                  select
                  fullWidth
                  label="Mentor"
                  name="mentor_employee_id"
                  value={Intern?.mentor_employee_id || ""}
                  onChange={handleChange}
                  error={!!InternErrors?.mentor_employee_id}
                  helperText={InternErrors?.mentor_employee_id}
                >
                  <MenuItem value="">
                    <em>Select a Manager</em>
                  </MenuItem>
                  {DropDownData?.Employees?.map((option) => {
                    const firstName = option?.first_name
                      ? option?.first_name.charAt(0).toUpperCase() +
                        option?.first_name?.slice(1)
                      : "";
                    return (
                      <MenuItem
                        key={option?.employee_id}
                        value={option?.employee_id}
                      >
                        {`${option?.designation?.designation_name || ""} -> ${firstName}`}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default InternForm;
