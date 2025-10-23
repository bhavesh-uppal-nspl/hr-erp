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
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";

import {
  fetchLeaveCategory,
  fetchLeaveReason,
  fetchLeaveTypes,
  fetchOrganizationLeaveReasonTypes,
} from "../../../Apis/Leave-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import dayjs from "dayjs";
import { Category } from "@mui/icons-material";

function EmployeeLeaveForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    employee_id: "",
    organization_leave_type_id: "",
    organization_leave_category_id: "",
    organization_leave_reason_id: "",
    leave_duration_type: "",
    total_leave_days: "",
    leave_start_date: "",
    leave_end_date: "",
    employee_remarks: "",
    leave_status: "",
    rejection_date: "",
    rejected_by: "",
    approved_by: "",
    approval_date: "",
    supporting_document_url: "",
    leave_rejection_reason: "",
    rejection_date: "",
    rejected_by: "",
    organization_leave_reason_type_id: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [leavecategory, setLeaveCategory] = useState([]);
  const [leavetype, setLeaveType] = useState([]);
  const [leaveReason, setLeaveReason] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [LeaveReasonType, setLeaveReasonType] = useState([]);

const [disablecat, setDisablecat] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchOrganizationEmployee(org?.organization_id)
        .then((data) => {
          setEmployee(data?.employees);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  console.log("employee is ", employee);
  console.log("leave types is ", leavetype);

  useEffect(() => {
    {
      fetchLeaveCategory(org.organization_id)
        .then((data) => {
          setLeaveCategory(data?.leavecategory?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  console.log("category ", leavecategory);

  useEffect(() => {
    {
      fetchOrganizationLeaveReasonTypes(org?.organization_id)
        .then((data) => {
          setLeaveReasonType(data?.leavereasontype);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    if (!formData.organization_leave_reason_type_id || !org?.organization_id) {
      setLeaveReason([]);
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/leave-reason-types/${formData?.organization_leave_reason_type_id}/leave-reasons`
        );

        if (!res.ok) throw new Error("Failed to fetch leave reasons");

        const data = await res.json();
        setLeaveReason(data.leavereasons || []);
      } catch (err) {
        setFormErrors((prev) => ({
          ...prev,
          organization_leave_reason_id: err.message,
        }));
      }
    })();
  }, [formData.organization_leave_reason_type_id, org?.organization_id]);

  useEffect(() => {
    {
      fetchLeaveTypes(org.organization_id)
        .then((data) => {
          setLeaveType(data?.leavetypes?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-leave/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.employeeleave;
      console.log("data of leave is", a);
      setFormData(a);
      setLoading(false);
    };
    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   setFormData((prev) => {
  //     let updatedData = { ...prev, [name]: value };

  //     if (name === "organization_leave_type_id") {
  //       const selectedType = leavetype?.find(
  //         (lt) => lt.organization_leave_type_id === value
  //       );
  //       if (selectedType?.leave_compensation_type !== "paid") {
  //         updatedData.organization_leave_category_id = "";
  //       }
  //     }

  //     return updatedData;
  //   });
  // };



  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    let updatedData = { ...prev, [name]: value };

    if (name === "organization_leave_type_id") {
      const selectedType = leavetype?.find(
        (lt) => String(lt.organization_leave_type_id) === String(value)
      );

      if (selectedType) {
        // Try to find matching category by compensation_code
        const matchedCategory = leavecategory?.find(
          (cat) => cat.leave_category_code === selectedType.compensation_code
        );

        if (matchedCategory) {
          updatedData.organization_leave_category_id =
            matchedCategory.organization_leave_category_id;
            setDisablecat(true)
        } else {
          updatedData.organization_leave_category_id = "";
         setDisablecat(false);  
        }
      } else {
        updatedData.organization_leave_category_id = "";
        setDisablecat(false);  
      }
    }

    return updatedData;
  });
};



  const validateForm = () => {
    const errors = {};

    if (!formData.employee_id) {
      errors.employee_id = "Employee Name  is required.";
    }

    if (!formData.organization_leave_type_id) {
      errors.organization_leave_type_id = "Leave type is required.";
    }

    if (!formData.organization_leave_reason_id) {
      errors.organization_leave_reason_id = "Leave reason is required.";
    }

    if (!formData.organization_leave_reason_type_id) {
      errors.organization_leave_reason_type_id =
        "Leave reason Type is required.";
    }

    if (!formData.leave_duration_type) {
      errors.leave_duration_type = "Leave duration type is required.";
    }

    const today = dayjs().startOf("day");

    // Validate total_leave_days
    if (!formData.total_leave_days || isNaN(formData.total_leave_days)) {
      errors.total_leave_days = "Valid total leave days are required.";
    } else if (formData.total_leave_days <= 0) {
      errors.total_leave_days = "Total leave days must be greater than 0.";
    }
    // Validate leave_start_date

    // Validate leave_end_date
    if (!formData.leave_end_date) {
      errors.leave_end_date = "Leave end date is required.";
    } else if (formData.leave_start_date > formData.leave_end_date) {
      errors.leave_end_date = "End date cannot be before start date.";
    }

    // Validate leave date duration
    const startDate = dayjs(formData.leave_start_date);
    const endDate = dayjs(formData.leave_end_date);
    if (startDate.isValid() && endDate.isValid()) {
      const totalDays = endDate.diff(startDate, "day") + 1;
      if (totalDays > 30) {
        errors.leave_end_date = "Leave duration cannot exceed 30 days.";
      }
    }

    // Validate leave start time
    if (!formData.leave_start_date) {
      errors.leave_start_date = "Leave start time is required.";
    }

    // Validate leave end time
    if (!formData.leave_end_date) {
      errors.leave_end_time = "Leave end time is required.";
    } else if (
      formData.leave_start_date &&
      formData.leave_end_date &&
      formData.leave_start_date === formData.leave_end_time
    ) {
      errors.leave_end_time =
        "Leave end time must be different from start time.";
    } else {
      // Time comparison
      const refDate = "2000-01-01";
      const start = dayjs(
        `${refDate} ${formData.leave_start_date}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      const end = dayjs(
        `${refDate} ${formData.leave_end_date}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      if (start.isValid() && end.isValid() && end.isBefore(start)) {
        errors.leave_end_time = "Leave end time must be after start time.";
      }
    }
    if (!formData.leave_status) {
      errors.leave_status = "Leave status is required.";
    }

    if (formData.leave_status === "Approved" && !formData.approval_date) {
      errors.approval_date = "Approval date is required.";
    }

    if (
      formData.leave_status === "Rejected" &&
      !formData.leave_rejection_reason
    ) {
      errors.leave_rejection_reason = "Leave rejection reason is required.";
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
          `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-leave/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/employee-leave`,
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
          ? "Employee Leave Details Updated!"
          : "Employee Leave Details Created!"
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
  const calculateTotalLeaveHours = (startTime, endTime) => {
    if (!startTime || !endTime) return "0 hours 0 minutes";

    const refDate = "2000-01-01"; // arbitrary fixed date
    const start = dayjs(`${refDate} ${startTime}`, "YYYY-MM-DD HH:mm:ss");
    const end = dayjs(`${refDate} ${endTime}`, "YYYY-MM-DD HH:mm:ss");

    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      return "0 hours 0 minutes";
    }

    const diffMinutes = end.diff(start, "minute");
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return ` ${hours} hours ${minutes} minutes `;
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
        updateMessage={"Employee Leave"}
        addMessage={"Employee Leave"}
        homeLink={"/leave/employee-leaves"}
        homeText={"Employee Leaves"}
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
                  label="Leave Type"
                  name="organization_leave_type_id"
                  value={formData.organization_leave_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_leave_type_id}
                  helperText={formErrors.organization_leave_type_id}
                  required
                >
                  {leavetype?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_leave_type_id}
                        value={option.organization_leave_type_id}
                      >
                        {option.leave_type_name}
                      </MenuItem>
                    );
                  })}
                </TextField>


               
               <TextField
  select
  fullWidth
  label="Leave Category"
  name="organization_leave_category_id"
  value={formData.organization_leave_category_id}
  onChange={handleChange}
  error={!!formErrors.organization_leave_category_id}
  helperText={formErrors.organization_leave_category_id}
  disabled={disablecat}   
>
  {leavecategory?.map((option) => (
    <MenuItem
      key={option.organization_leave_category_id}
      value={option.organization_leave_category_id}
    >
      {option.leave_category_name}
    </MenuItem>
  ))}
</TextField>


                <TextField
                  select
                  fullWidth
                  label="Leave Reason Type"
                  name="organization_leave_reason_type_id"
                  value={formData.organization_leave_reason_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_leave_reason_type_id}
                  helperText={formErrors.organization_leave_reason_type_id}
                  required
                >
                  {LeaveReasonType?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_leave_reason_type_id}
                        value={option.organization_leave_reason_type_id}
                      >
                        {option.leave_reason_type_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Leave Reason"
                  name="organization_leave_reason_id"
                  value={formData.organization_leave_reason_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_leave_reason_id}
                  helperText={formErrors.organization_leave_reason_id}
                  required
                >
                  {leaveReason?.map((option) => {
                    return (
                      <MenuItem
                        key={option.organization_leave_reason_id}
                        value={option.organization_leave_reason_id}
                      >
                        {option.leave_reason_name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Leave Duration Type"
                  name="leave_duration_type"
                  value={formData.leave_duration_type}
                  onChange={handleChange}
                  error={!!formErrors.leave_duration_type}
                  helperText={formErrors.leave_duration_type}
                  required
                >
                  <MenuItem value="full_day">Full Day</MenuItem>
                  <MenuItem value="half_day">Half Day</MenuItem>
                  <MenuItem value="short_leave">Short Leave</MenuItem>
                </TextField>

              <TextField
  fullWidth
  type="number"
  label="Total Leave Days"
  name="total_leave_days"
  value={formData.total_leave_days}
  onChange={(e) => {
    const value = e.target.value;
    
    // Allow empty input
    if (value === '') {
      handleChange(e);
      return;
    }
    
    const numValue = parseFloat(value);
    
    // Check if it's a valid number and a multiple of 0.5
    if (!isNaN(numValue) && (numValue * 2) % 1 === 0) {
      handleChange(e);
    }
    // If not valid, don't update (prevent typing invalid values)
  }}
  error={!!formErrors.total_leave_days}
  helperText={formErrors.total_leave_days}
  required
  InputLabelProps={{ shrink: true }}
  inputProps={{ 
    step: "0.5",
    min: "0",
    max: "100" 
  }}
/>

                <TextField
                  fullWidth
                  type="date"
                  label="Leave Start Date"
                  name="leave_start_date"
                  value={formData.leave_start_date}
                  onChange={handleChange}
                  error={!!formErrors.leave_start_date}
                  helperText={formErrors.leave_start_date}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="date"
                  label="Leave End Date"
                  name="leave_end_date"
                  value={formData.leave_end_date}
                  onChange={handleChange}
                  error={!!formErrors.leave_end_date}
                  helperText={formErrors.leave_end_date}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  label="Supporting Documents URL"
                  name="supporting_document_url"
                  value={formData.supporting_document_url}
                  onChange={handleChange}
                  error={!!formErrors.supporting_document_url}
                  helperText={formErrors.supporting_document_url}
                  inputProps={{ maxLength: 512 }}
                />

                <TextField
                  fullWidth
                  label="Employee Remarks"
                  name="employee_remarks"
                  value={formData.employee_remarks}
                  onChange={handleChange}
                  error={!!formErrors.employee_remarks}
                  helperText={formErrors.employee_remarks}
                  inputProps={{ maxLength: 100 }}
                  multiline
                  minRows={3}
                  maxRows={5}
                />

                <TextField
                  select
                  fullWidth
                  label="Leave Status"
                  name="leave_status"
                  value={formData.leave_status}
                  onChange={(e) => {
                    const { value } = e.target;
                    handleChange(e);

                    if (value === "Approved") {
                      resetFields([
                        "leave_rejection_reason",
                        "rejection_date",
                        "rejected_by",
                      ]);
                    } else if (value === "Rejected") {
                      resetFields(["approved_by", "approval_date"]);
                    } else if (value === "Pending") {
                      resetFields([
                        "approved_by",
                        "approval_date",
                        "leave_rejection_reason",
                        "rejection_date",
                        "rejected_by",
                      ]);
                    }
                  }}
                  error={!!formErrors.leave_status}
                  helperText={formErrors.leave_status}
                  required
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </TextField>

                {formData.leave_status === "Pending" && (
                  <p
                    style={{
                      marginTop: "8px",
                      color: "#555",
                      fontStyle: "normal",
                      fontWeight: "bold",
                    }}
                  >
                    Leave request is pending for approval.
                  </p>
                )}

                {/* Approval Date */}
                <TextField
                  fullWidth
                  type="date"
                  label="Approval Date"
                  name="approval_date"
                  value={formData.approval_date}
                  onChange={handleChange}
                  error={!!formErrors.approval_date}
                  helperText={formErrors.approval_date}
                  InputLabelProps={{ shrink: true }}
                  disabled={formData.leave_status !== "Approved"} // Enable only when Approved
                  required={formData.leave_status === "Approved"} // Required only when Approved
                />

                <TextField
                  select
                  fullWidth
                  label="Approved By"
                  name="approved_by"
                  value={formData.approved_by}
                  onChange={handleChange}
                  error={!!formErrors.approved_by}
                  helperText={formErrors.approved_by}
                  disabled={formData.leave_status !== "Approved"} // Enable only when Approved
                >
                  {employee
                    .filter(
                      (option) => option.employee_id !== formData.employee_id
                    )
                    .map((option) => {
                      const fullName =
                        `${option.first_name || ""} ${option.middle_name || ""} ${option.last_name || ""}`.trim();
                      return (
                        <MenuItem
                          key={option.employee_id}
                          value={option.employee_id}
                        >
                          {fullName || option.employee_id}
                        </MenuItem>
                      );
                    })}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Rejected By"
                  name="rejected_by"
                  value={formData.rejected_by}
                  onChange={handleChange}
                  error={!!formErrors.rejected_by}
                  helperText={formErrors.rejected_by}
                  disabled={formData.leave_status !== "Rejected"} // Enable only when Rejected
                >
                  {employee
                    .filter(
                      (option) => option.employee_id !== formData.employee_id
                    )
                    .map((option) => {
                      const fullName =
                        `${option.first_name || ""} ${option.middle_name || ""} ${option.last_name || ""}`.trim();
                      return (
                        <MenuItem
                          key={option.employee_id}
                          value={option.employee_id}
                        >
                          {fullName || option.employee_id}
                        </MenuItem>
                      );
                    })}
                </TextField>

                <TextField
                  fullWidth
                  type="date"
                  label="Rejection Date"
                  name="rejection_date"
                  value={formData.rejection_date}
                  onChange={handleChange}
                  error={!!formErrors.rejection_date}
                  helperText={formErrors.rejection_date}
                  InputLabelProps={{ shrink: true }}
                  disabled={formData.leave_status !== "Rejected"}
                  required={formData.leave_status === "Rejected"}
                />

                <TextField
                  fullWidth
                  label="Leave Rejection Reason"
                  name="leave_rejection_reason"
                  value={formData.leave_rejection_reason}
                  onChange={handleChange}
                  error={!!formErrors.leave_rejection_reason}
                  helperText={formErrors.leave_rejection_reason}
                  inputProps={{ maxLength: 512 }}
                  disabled={formData.leave_status !== "Rejected"} // Enable only when Rejected
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

export default EmployeeLeaveForm;
