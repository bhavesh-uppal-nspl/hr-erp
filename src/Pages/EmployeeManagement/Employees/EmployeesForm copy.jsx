import React, { useState, useEffect } from "react";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import { fetchOrganizationUnit } from "../../../Apis/OrganizationUnit";
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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import useEmployeeDataStore from "../../../Zustand/Store/useEmployeeDataStore";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";

function EmployeeForm({ mode, setEmployeeId, employeeId }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const {
    setEmployeeData,
    Employee,
    EmployeeErrors,
    getDropdowndata,
    DropDownData,
  } = useEmployeeDataStore();

  console.log("Employee", Employee);

  const genderOptions = ["Male", "Female", "Other"];
  const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];

  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  const [departmentlocation, setDepartmentLocation] = useState([]);
  const [departmentdesignation, setDepartmentDesignation] = useState([]);

  let navigate = useNavigate();
  console.log("employeess all is ", DropDownData.Employees);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // setEmployeeData({ [name]: value });

    if (name === "organization_department_id") {
      setEmployeeData({
        [name]: value,
        organization_designation_id: "",
        organization_department_location_id: "",
      });
      return;
    }

    if (name == "organization_employment_stage_id") {
      let fl = DropDownData?.EmployeeStages?.find(
        (item) => item.organization_employment_stage_id == value
      );
      console.log("fll is ", fl);

      if (fl) {
        setEmployeeData({
          organization_employment_stage_id: fl.organization_employment_stage_id,
          organization_employment_status_id:
            fl.organization_employment_status_id,
        });
      }
      return;
    } else {
      setEmployeeData({ [name]: value });
    }
  };

  useEffect(() => {
    const fetchDepartmentLocations = async () => {
      if (!Employee?.organization_department_id || !org?.organization_id) {
        setDepartmentLocation([]); // ✅ Clear when no department
        return;
      }

      try {
        const res = await axios.get(
          `${MAIN_URL}/api/department-locations/all`,
          {
            params: {
              department_id: Employee.organization_department_id,
              organization_id: org.organization_id,
            },
          }
        );
        setDepartmentLocation(res?.data?.data);
      } catch (error) {
        console.error("Failed to fetch department locations", error);
        setDepartmentLocation([]); // ✅ Clear on error
      }
    };

    fetchDepartmentLocations();
  }, [Employee?.organization_department_id, org?.organization_id]);

  useEffect(() => {
    const fetchDepartmentDesignation = async () => {
      if (!Employee?.organization_department_id || !org?.organization_id) {
        setDepartmentDesignation([]);
        return;
      }

      try {
        const res = await axios.get(
          `${MAIN_URL}/api/department-designation/all`,
          {
            params: {
              department_id: Employee.organization_department_id,
              organization_id: org.organization_id,
            },
          }
        );
        setDepartmentDesignation(res?.data?.data);
      } catch (error) {
        console.error("Failed to fetch department designation", error);
        setDepartmentDesignation([]); // ✅ Clear on error
      }
    };

    fetchDepartmentDesignation();
  }, [Employee?.organization_department_id, org?.organization_id]);

  useEffect(() => {
    const fetchDepartmentDesignation = async () => {
      if (!Employee?.organization_department_id || !org?.organization_id)
        return;

      try {
        const res = await axios.get(
          `${MAIN_URL}/api/department-designation/all`,
          {
            params: {
              department_id: Employee.organization_department_id,
              organization_id: org.organization_id,
            },
          }
        );
        setDepartmentDesignation(res?.data?.data);
      } catch (error) {
        console.error("Failed to fetch department designation", error);
      }
    };

    fetchDepartmentDesignation();
  }, [Employee?.organization_department_id, org?.organization_id]);

  useEffect(() => {
    if (!DropDownData?.Entities?.length) return; // wait for dropdown data
    if (!Employee) return; // wait for API data

    // If value already set, DO NOT update again
    if (Employee?.organization_entity_id) return;

    // Set only when editing
    if (Employee?.organization_entity_id) {
      setEmployeeData({
        organization_entity_id: Employee.organization_entity_id,
      });
    }
  }, [DropDownData?.Entities, Employee]);

  console.log("department designation srae  is  ", departmentdesignation);

  const handleChangeImage = (name, value) => {
    setEmployeeData({ [name]: value });
  };

  const handleRemoveImage = () => {
    setEmployeeData({ profile_image_url: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmployeeId("gbfgrkk");
    // setEmployeeData(Employee?.);
  };

  const handleChangeDate = (date, key) => {
    console.log("Date 122", date);

    if (!date) {
      setEmployeeData((prev) => ({ ...prev, [key]: "" }));
      return;
    }

    // // format YYYY-MM-DD for backend
    const formatted = new Date(date);

    const fimalformat = `${formatted.getFullYear()}/${formatted.getMonth() + 1}/${formatted.getDate()}`;

    console.log("finalformat", fimalformat);

    setEmployeeData((prev) => ({
      ...prev,
      [key]: fimalformat,
    }));
  };

  const handleChangeDOB = (date) => {
    if (!date) {
      setEmployeeData((prev) => ({ ...prev, date_of_birth: "" }));
      return;
    }

    // format YYYY-MM-DD for backend
    const formatted = date.toISOString().split("T")[0];

    setEmployeeData((prev) => ({
      ...prev,
      date_of_birth: formatted,
    }));
  };
  const handleChangeDOJ = (date) => {
    if (!date) {
      setEmployeeData((prev) => ({
        ...prev,
        date_of_joining: "",
      }));
      return;
    }

    const formatted = date.toISOString().split("T")[0]; // YYYY-MM-DD
    setEmployeeData((prev) => ({
      ...prev,
      date_of_joining: formatted,
    }));
  };

  return (
    <Box px={4}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              py={1}
            >
              <Box
                position="relative"
                sx={{
                  "&:hover .remove-icon": {
                    opacity:
                      Employee?.profile_image_url && mode !== "view" ? 1 : 0,
                  },
                }}
              >
                <Avatar
                  src={
                    Employee?.profile_image_url instanceof File
                      ? URL.createObjectURL(Employee?.profile_image_url)
                      : Employee?.profile_image_url
                        ? `${Employee?.profile_image_url}`
                        : ""
                  }
                  alt="Profile"
                  sx={{ width: 96, height: 96 }}
                />
                {Employee?.profile_image_url && mode !== "view" && (
                  <Box
                    className="remove-icon"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "50%",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={handleRemoveImage}
                  >
                    <CloseIcon
                      sx={{
                        color: "white",
                        fontSize: 40,
                      }}
                    />
                  </Box>
                )}
              </Box>

              <Button
                disabled={mode === "view"}
                variant="outlined"
                component="label"
                size="small"
                sx={{ mt: 1, textTransform: "none" }}
              >
                {mode === "edit" ? "Change Image" : "Upload Image"}
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
              {EmployeeErrors?.profile_image_url && (
                <FormHelperText error>
                  {EmployeeErrors?.profile_image_url}
                </FormHelperText>
              )}
            </Box>
          </Grid>

          {/* Main Form Fields */}
          <Grid item xs={12} md={8}>
            <Paper elevation={4} sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "32%", // ensures proper centering
                  }}
                >
                  <TextField
                    disabled={mode === "view"}
                    fullWidth
                    label="Employee code"
                    name="employee_code"
                    value={Employee?.employee_code}
                    onChange={handleChange}
                    error={!!EmployeeErrors?.employee_code}
                    helperText={EmployeeErrors?.employee_code}
                    inputProps={{ maxLength: 10 }}
                    required
                  />

                  {/* <TextField
                    disabled={mode === "view"}
                    fullWidth
                    type="date"
                    label="Date of Joining"
                    name="date_of_joining"
                    value={Employee?.date_of_joining || ""}
                    onChange={handleChange}
                    error={!!EmployeeErrors?.date_of_joining}
                    helperText={EmployeeErrors?.date_of_joining}
                    required
                    InputLabelProps={{ shrink: true }}
                  /> */}
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
                    disabled={mode === "view"}
                    fullWidth
                    label="First Name"
                    name="first_name"
                    value={Employee?.first_name}
                    onChange={(e) => {
                      const onlyLetters = e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      ); // Allow letters and spaces
                      handleChange({
                        target: { name: "first_name", value: onlyLetters },
                      });
                    }}
                    error={!!EmployeeErrors?.first_name}
                    helperText={EmployeeErrors?.first_name}
                    required
                    inputProps={{ maxLength: 30 }}
                  />

                  <TextField
                    disabled={mode === "view"}
                    fullWidth
                    label="Middle Name"
                    name="middle_name"
                    value={Employee?.middle_name}
                    onChange={(e) => {
                      const onlyLetters = e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      ); // Allow letters and spaces
                      handleChange({
                        target: { name: "middle_name", value: onlyLetters },
                      });
                    }}
                    error={!!EmployeeErrors?.middle_name}
                    helperText={EmployeeErrors?.middle_name}
                    inputProps={{ maxLength: 30 }}
                  />

                  <TextField
                    disabled={mode === "view"}
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={Employee?.last_name}
                    onChange={(e) => {
                      const onlyLetters = e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      ); // Allow letters and spaces
                      handleChange({
                        target: { name: "last_name", value: onlyLetters },
                      });
                    }}
                    error={!!EmployeeErrors?.last_name}
                    helperText={EmployeeErrors.last_name}
                    inputProps={{ maxLength: 30 }}
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
                  {/* <TextField
                    disabled={mode === "view"}
                    fullWidth
                    type="date"
                    label="Date of Birth"
                    name="date_of_birth"
                    value={Employee?.date_of_birth || ""}
                    onChange={handleChange}
                    error={!!EmployeeErrors?.date_of_birth}
                    helperText={EmployeeErrors?.date_of_birth}
                    required
                    InputLabelProps={{ shrink: true }}
                  /> */}

                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={enGB}
                  >
                    <DatePicker
                      label="Date of Birth"
                      format="dd/MM/yyyy"
                      disabled={mode === "view"}
                      value={
                        Employee?.date_of_birth
                          ? new Date(Employee.date_of_birth)
                          : null
                      }
                      onChange={(date) =>
                        handleChangeDate(date, "date_of_birth")
                      }
                      // onChange={(date) => handleChangeDOB(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!EmployeeErrors?.date_of_birth,
                          helperText: EmployeeErrors?.date_of_birth,
                          InputLabelProps: { shrink: true },
                        },
                      }}
                    />
                  </LocalizationProvider>

                  <TextField
                    disabled={mode === "view"}
                    fullWidth
                    select
                    label="Gender"
                    name="gender"
                    value={Employee?.gender}
                    onChange={handleChange}
                    error={!!EmployeeErrors?.gender}
                    helperText={EmployeeErrors?.gender}
                    required
                  >
                    {genderOptions?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    disabled={mode === "view"}
                    fullWidth
                    select
                    label="Marital Status"
                    name="marital_status"
                    value={Employee?.marital_status}
                    onChange={handleChange}
                    error={!!EmployeeErrors?.marital_status}
                    helperText={EmployeeErrors?.marital_status}
                    required
                  >
                    {maritalStatusOptions?.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "32%", // ensures proper centering
                  }}
                >
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={enGB}
                  >
                    <DatePicker
                      label="Date of Joining"
                      format="dd/MM/yyyy"
                      disabled={mode === "view"}
                      value={
                        Employee?.date_of_joining
                          ?Employee.date_of_joining
                          // ? new Date(Employee.date_of_joining)
                          : null
                      }
                      onChange={(date) =>
                        handleChangeDate(date, "date_of_joining")
                      }
                      //    onChange={(date) => handleChangeDOJ(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!EmployeeErrors?.date_of_joining,
                          helperText: EmployeeErrors?.date_of_joining,
                          InputLabelProps: { shrink: true },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "100%", // ensures proper centering
                    mt: 4,
                  }}
                >
                  {DropDownData?.Entities?.length > 1 && (
                    <TextField
                      disabled={mode === "view"}
                      select
                      fullWidth
                      label="Organization Entity"
                      name="organization_entity_id"
                      value={Employee?.organization_entity_id}
                      onChange={handleChange}
                      error={!!EmployeeErrors?.organization_entity_id}
                      helperText={EmployeeErrors?.organization_entity_id}
                    >
                      {DropDownData?.Entities?.map((option) => (
                        <MenuItem
                          key={option?.organization_entity_id}
                          value={option?.organization_entity_id}
                        >
                          {option?.entity_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}

                  <TextField
                    disabled={
                      mode === "view" || DropDownData?.Units?.length === 0
                    }
                    select
                    fullWidth
                    label="Organization Unit"
                    name="organization_unit_id"
                    value={Employee?.organization_unit_id}
                    onChange={handleChange}
                    error={!!EmployeeErrors?.organization_unit_id}
                    helperText={EmployeeErrors.organization_unit_id}
                  >
                    {DropDownData?.Units?.map((option) => (
                      <MenuItem
                        key={option?.organization_unit_id}
                        value={option?.organization_unit_id}
                      >
                        {option?.unit_name}
                      </MenuItem>
                    ))}
                  </TextField>
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
                    disabled={
                      mode === "view" || DropDownData?.departments?.length === 0
                    }
                    select
                    fullWidth
                    label="Department"
                    name="organization_department_id"
                    value={Employee?.organization_department_id || ""}
                    onChange={handleChange}
                    error={!!EmployeeErrors?.organization_department_id}
                    helperText={EmployeeErrors.organization_department_id}
                    required
                  >
                    {DropDownData?.departments?.map((option) => (
                      <MenuItem
                        key={option?.organization_department_id}
                        value={option?.organization_department_id}
                      >
                        {option?.department_name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    disabled={
                      mode === "view" || departmentdesignation?.length === 0
                    }
                    select
                    fullWidth
                    label="Designation"
                    name="organization_designation_id"
                    value={Employee?.organization_designation_id || ""}
                    onChange={handleChange}
                    error={!!EmployeeErrors?.organization_designation_id}
                    helperText={EmployeeErrors?.organization_designation_id}
                    required
                  >
                    {departmentdesignation?.map((option) => (
                      <MenuItem
                        key={option?.organization_designation_id}
                        value={option?.organization_designation_id}
                      >
                        {option?.designation_name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    disabled={
                      mode === "view" || departmentlocation?.length === 0
                    }
                    select
                    fullWidth
                    label="Location"
                    name="organization_department_location_id"
                    value={Employee?.organization_department_location_id || ""}
                    onChange={handleChange}
                    error={
                      !!EmployeeErrors?.organization_department_location_id
                    }
                    helperText={
                      EmployeeErrors?.organization_department_location_id
                    }
                    required
                  >
                    {departmentlocation?.map((option) => (
                      <MenuItem
                        key={option?.organization_department_location_id}
                        value={option?.organization_department_location_id}
                      >
                        {option?.location?.location_name}
                      </MenuItem>
                    ))}
                  </TextField>
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
                    disabled={
                      mode === "view" || DropDownData?.Categories?.length === 0
                    }
                    select
                    fullWidth
                    label="Employment Category"
                    name="organization_employment_category_id"
                    value={Employee?.organization_employment_category_id}
                    onChange={handleChange}
                    error={
                      !!EmployeeErrors?.organization_employment_category_id
                    }
                    helperText={
                      EmployeeErrors?.organization_employment_category_id
                    }
                    required
                  >
                    {DropDownData?.Categories?.map((option) => (
                      <MenuItem
                        key={option?.organization_employment_category_id}
                        value={option?.organization_employment_category_id}
                      >
                        {option?.employment_category_name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    disabled={
                      mode === "view" ||
                      DropDownData?.EmploymentTypes?.length === 0
                    }
                    select
                    fullWidth
                    label="Employment Type"
                    name="organization_employment_type_id"
                    value={Employee?.organization_employment_type_id}
                    onChange={handleChange}
                    error={!!EmployeeErrors?.organization_employment_type_id}
                    helperText={EmployeeErrors?.organization_employment_type_id}
                    required
                  >
                    {DropDownData?.EmploymentTypes?.map((option) => (
                      <MenuItem
                        key={option?.organization_employment_type_id}
                        value={option?.organization_employment_type_id}
                      >
                        {option?.employment_type_name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    disabled={
                      mode === "view" ||
                      DropDownData?.EmployeeStages?.length === 0
                    }
                    select
                    fullWidth
                    label="Employment Stages"
                    name="organization_employment_stage_id"
                    value={Employee?.organization_employment_stage_id}
                    onChange={handleChange}
                    error={!!EmployeeErrors.organization_employment_stage_id}
                    helperText={EmployeeErrors.organization_employment_stage_id}
                    required
                  >
                    {DropDownData?.EmployeeStages?.map((option) => (
                      <MenuItem
                        key={option?.organization_employment_stage_id}
                        value={option?.organization_employment_stage_id}
                      >
                        {option?.employment_stage_name}
                      </MenuItem>
                    ))}
                  </TextField>
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
                    disabled={
                      mode === "view" || DropDownData?.WorkModels?.length === 0
                    }
                    select
                    fullWidth
                    label="Work Model"
                    name="organization_work_model_id"
                    value={Employee?.organization_work_model_id}
                    onChange={handleChange}
                    error={!!EmployeeErrors?.organization_work_model_id}
                    helperText={EmployeeErrors?.organization_work_model_id}
                  >
                    {DropDownData?.WorkModels?.map((option) => (
                      <MenuItem
                        key={option?.organization_work_model_id}
                        value={option?.organization_work_model_id}
                      >
                        {option?.work_model_name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    disabled={
                      mode === "view" || DropDownData?.WorkShifts?.length === 0
                    }
                    select
                    fullWidth
                    label="WorkShift"
                    name="organization_work_shift_id"
                    value={Employee?.organization_work_shift_id}
                    onChange={handleChange}
                    error={!!EmployeeErrors.organization_work_shift_id}
                    helperText={EmployeeErrors.organization_work_shift_id}
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

                  {/* <TextField
                    disabled={mode === "view"}
                    select
                    fullWidth
                    label="Reporting Manager"
                    name="reporting_manager_id"
                    value={Employee?.reporting_manager_id || ""}
                    onChange={handleChange}
                    error={!!EmployeeErrors?.reporting_manager_id}
                    helperText={EmployeeErrors?.reporting_manager_id}
                  >
                    <MenuItem value="">
                      <em>Select a Manager</em>
                    </MenuItem>
                    {DropDownData?.Employees
                    ?.filter((option) => option.employee_id !== Employee?.employee_id)
                    
                    ?.map((option) => {
                      const firstName =
                        (option?.first_name
                          ? option.first_name.charAt(0).toUpperCase() +
                            option.first_name.slice(1)
                          : "") +
                        (option?.middle_name
                          ? " " +
                            option.middle_name.charAt(0).toUpperCase() +
                            option.middle_name.slice(1)
                          : "") +
                        (option?.last_name
                          ? " " +
                            option.last_name.charAt(0).toUpperCase() +
                            option.last_name.slice(1)
                          : "");

                      return (
                        <MenuItem
                          key={option?.employee_id}
                          value={option?.employee_id}
                        >
                          {`${firstName}  (${option?.designation?.designation_name || ""})`}
                        </MenuItem>
                      );
                    })}
                  </TextField> */}

                  <TextField
                    disabled={mode === "view"}
                    select
                    fullWidth
                    label="Reporting Manager"
                    name="reporting_manager_id"
                    value={Employee?.reporting_manager_id || ""}
                    onChange={handleChange}
                    error={!!EmployeeErrors?.reporting_manager_id}
                    helperText={EmployeeErrors?.reporting_manager_id}
                  >
                    <MenuItem value="">
                      <em>Select a Manager</em>
                    </MenuItem>

                    {DropDownData?.Employees?.filter(
                      (option) => option.employee_id !== Employee?.employee_id
                    )?.map((option) => (
                      <MenuItem
                        key={option?.employee_id}
                        value={option?.employee_id}
                      >
                        {`${option?.name || ""}   (${option?.employee_code})`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default EmployeeForm;
