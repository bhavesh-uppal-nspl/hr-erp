import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";
import { fetchIncrementTypes } from "../../../Apis/Salary";

function IncrementForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [employee, setEmployee] = useState([]);
  const [increments, setIncrements] = useState([]);

  const MAX_INCREMENT = 999999999.99;

  const [formData, setFormData] = useState({
    employee_id: "",
    organization_employee_increment_type_id: "",
    previous_ctc_amount: "",
    increment_percentage: "",
    increment_amount: "",
    new_ctc_amount: "",
    effective_date: "",
    remarks: "",
  });

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

  useEffect(() => {
    {
      fetchIncrementTypes(org?.organization_id)
        .then((data) => {
          setIncrements(data?.increments);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/increment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.increments;
      console.log("data of leave is", a);
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
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organization_employee_increment_type_id ) {
      errors.organization_employee_increment_type_id  = "Increment type is required.";
    }

    if (!formData.previous_ctc_amount ) {
      errors.previous_ctc_amount  = "previous CTC is required.";
    }

    if (!formData.new_ctc_amount ) {
      errors.new_ctc_amount  = "new CTC is required.";
    }

    if (!formData.increment_amount ) {
      errors.increment_amount  = "Increment amount  is required.";
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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/increment/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/increment`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      toast.success(
        mode === "edit" ? "Increment Updated!" : "Increment Created!"
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
        updateMessage={"Employee Increments"}
        addMessage={"Employee Increment"}
        homeLink={"/employee/increment"}
        homeText={"Employee Increment"}
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
                  select
                  fullWidth
                  label="Increment Type"
                  name="organization_employee_increment_type_id"
                  value={formData.organization_employee_increment_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_employee_increment_type_id}
                  helperText={
                    formErrors.organization_employee_increment_type_id
                  }
                  required
                >
                  {increments?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_employee_increment_type_id}
                        value={option.organization_employee_increment_type_id}
                      >
                        {option?.employee_increment_type_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  fullWidth
                  label="Previous CTC"
                  name="previous_ctc_amount"
                  type="number"
                  value={formData?.previous_ctc_amount}
                   onChange={(e) => {
                    let value = e.target.value;

                    // Allow only numbers or empty value
                    if (/^\d*$/.test(value)) {
                      if (value === "" || Number(value) <= MAX_INCREMENT) {
                        handleChange(e);
                      } else {
                        e.target.value = MAX_INCREMENT;
                        handleChange(e);
                      }
                    }
                  }}
                  error={!!formErrors.previous_ctc_amount}
                  helperText={
                    formErrors.previous_ctc_amount 
                  }
                  required
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 13,
                  }}
                />

                <TextField
                  fullWidth
                  label="Increment %"
                  name="increment_percentage"
                  type="number"
                  value={formData?.increment_percentage}
                  onChange={handleChange}
                  required
                  error={!!formErrors.increment_percentage}
                  helperText={formErrors.increment_percentage}
                  inputProps={{ min: 0 }}
                />
                <TextField
                  fullWidth
                  label="Increment Amount"
                  name="increment_amount"
                  type="number"
                  value={formData?.increment_amount}
                  onChange={(e) => {
                    let value = e.target.value;

                    // Allow only numbers or empty value
                    if (/^\d*$/.test(value)) {
                      if (value === "" || Number(value) <= MAX_INCREMENT) {
                        handleChange(e);
                      } else {
                        e.target.value = MAX_INCREMENT;
                        handleChange(e);
                      }
                    }
                  }}
                  required
                  error={!!formErrors.increment_amount}
                  helperText={
                    formErrors.increment_amount 
                  }
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 13, // Prevent typing more than 13 digits
                  }}
                />
                <TextField
                  fullWidth
                  label="New CTC"
                  name="new_ctc_amount"
                  type="number"
                  value={formData?.new_ctc_amount}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      if (value === "" || Number(value) <= MAX_INCREMENT) {
                        handleChange(e);
                      } else {
                        e.target.value = MAX_INCREMENT;
                        handleChange(e);
                      }
                    }
                  }}
                  required
                  error={!!formErrors.new_ctc_amount}
                  helperText={
                    formErrors.new_ctc_amount 
                  }
                  inputProps={{
                    min: 0,
                    max: MAX_INCREMENT,
                    maxLength: 13, 
                  }}
                />

                <TextField
                  fullWidth
                  label="Increment Date"
                  name="increment_date"
                  type="date"
                  value={formData.increment_date}
                  onChange={handleChange}
                  error={!!formErrors.increment_date}
                  helperText={formErrors.increment_date}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  fullWidth
                  label="Effective Date"
                  name="effective_date"
                  type="date"
                  value={formData.effective_date}
                  onChange={handleChange}
                  error={!!formErrors.effective_date}
                  helperText={formErrors.effective_date}
                  InputLabelProps={{ shrink: true }}
                  required
                />

                <TextField
                  fullWidth
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  error={!!formErrors.remarks}
                  helperText={formErrors.remarks}
                  inputProps={{ maxLength: 256 }}
                  multiline
                  minRows={3}
                  maxRows={5}
                />

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
                    <CircularProgress size={24} color="inherit" />
                  ) : mode === "edit" ? (
                    "Submit"
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
                      mt: 2,
                      backgroundColor: "#1976d2",
                      "&:hover": { backgroundColor: "#115293" },
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default IncrementForm;
