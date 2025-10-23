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
import { fetchInterns } from "../../../Apis/InternManagement";
import { fetchOrganizationEmployee } from "../../../Apis/Employee-api";

function InternLeaveForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    intern_id: "",
    employee_id: "",
    organization_leave_type_id: "",
    organization_leave_category_id: "",
    organization_leave_reason_id: "",
    leave_duration_type: "",
    total_leave_days: "",
    leave_start_date: "",
    leave_end_date: "",
    intern_remarks: "",
    leave_status: "",
    rejection_date: "",
    rejected_by: "",
    approved_by: "",
    approval_date: "",
    leave_start_time:"",
    leave_end_time:"",
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
  const [Intern, setIntern] = useState([]);
  const [LeaveReasonType, setLeaveReasonType] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [disablecat, setDisablecat] = useState(false);

  let navigate = useNavigate();

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
    if (!formData?.organization_leave_reason_type_id || !org?.organization_id) {
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
  const getdataById = async () => {
    try {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-leaves/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const leaveData = response?.data?.intership;
      console.log("data of leave is", leaveData);

      setFormData((prev) => ({
        ...prev, // keep existing form data
        ...leaveData, // spread all fields from API response
        organization_leave_reason_type_id:
          leaveData?.leave_reason?.leave_reason_type?.[0]?.organization_leave_reason_type_id || "",

        approved_by:leaveData?.approved_by?.employee_id,
        rejected_by:leaveData?.rejected_by?.employee_id
      }));

      setLoading(false);
    } catch (err) {
      console.error("Error fetching intern leave:", err);
      setLoading(false);
    }
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

//     if (name === "intern_id" || name === "organization_leave_type_id") {
//       const selectedIntern = Intern?.find(
//         (i) => String(i.intern_id) === String(
//           name === "intern_id" ? value : updatedData.intern_id
//         )
//       );

//       if (selectedIntern) {
//         if (selectedIntern.is_paid === null || selectedIntern.is_paid === false) {
//           // Case: null or false → clear and disable
//           updatedData.organization_leave_category_id = "";
//           setDisablecat(true);
//           return updatedData; // skip auto-set logic
//         } else if (selectedIntern.is_paid === true) {
//           // Case: true → auto-set if leave type selected
//           const selectedType = leavetype?.find(
//             (lt) => String(lt.organization_leave_type_id) === String(updatedData.organization_leave_type_id)
//           );

//           if (selectedType) {
//             const matchedCategory = leavecategory?.find(
//               (cat) => cat.leave_category_code === selectedType.compensation_code
//             );
//             updatedData.organization_leave_category_id = matchedCategory
//               ? matchedCategory.organization_leave_category_id
//               : "";
//           }
//           setDisablecat(true); // always disabled when true
//           return updatedData;
//         }
//       }
//     }

//     // Keep existing Leave Type -> Leave Category auto-set logic for other cases
//     if (name === "organization_leave_type_id") {
//       const selectedType = leavetype?.find(
//         (lt) => String(lt.organization_leave_type_id) === String(value)
//       );

//       if (selectedType) {
//         const matchedCategory = leavecategory?.find(
//           (cat) => cat.leave_category_code === selectedType.compensation_code
//         );

//         if (matchedCategory) {
//           updatedData.organization_leave_category_id =
//             matchedCategory.organization_leave_category_id;
//           setDisablecat(true);
//         } else {
//           updatedData.organization_leave_category_id = "";
//           setDisablecat(false);
//         }
//       } else {
//         updatedData.organization_leave_category_id = "";
//         setDisablecat(false);
//       }
//     }

//     return updatedData;
//   });
// };



const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    let updatedData = { ...prev, [name]: value };

    if (name === "intern_id" || name === "organization_leave_type_id") {
      const selectedIntern = Intern?.find(
        (i) =>
          String(i.intern_id) ===
          String(name === "intern_id" ? value : updatedData.intern_id)
      );

      if (selectedIntern) {
        if (selectedIntern.is_paid === null || selectedIntern.is_paid === false) {
          // Null or false → clear & disable
          updatedData.organization_leave_category_id = "";
          setDisablecat(true);
          return updatedData;
        } else if (selectedIntern.is_paid === true) {
          // True → auto-set based on leave type
          const selectedType = leavetype?.find(
            (lt) =>
              String(lt.organization_leave_type_id) ===
              String(updatedData.organization_leave_type_id)
          );

          if (selectedType) {
            const matchedCategory = leavecategory?.find(
              (cat) => cat.leave_category_code === selectedType.compensation_code
            );
            if (matchedCategory) {
              updatedData.organization_leave_category_id =
                matchedCategory.organization_leave_category_id;
            }
          }
          // Keep existing value if leave type not selected
          setDisablecat(true);
          return updatedData;
        }
      }
    }

    // Existing leave type -> leave category auto-set logic
    if (name === "organization_leave_type_id") {
      const selectedType = leavetype?.find(
        (lt) => String(lt.organization_leave_type_id) === String(value)
      );

      if (selectedType) {
        const matchedCategory = leavecategory?.find(
          (cat) => cat.leave_category_code === selectedType.compensation_code
        );

        if (matchedCategory) {
          updatedData.organization_leave_category_id =
            matchedCategory.organization_leave_category_id;
          setDisablecat(true);
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

    if (!formData.intern_id) {
      errors.intern_id = "Employee Name  is required.";
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

    
    //  if (formData.organization_leave_category_id) {
    //   errors.organization_leave_category_id = "Leave Category is required.";
    // }

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

    if (!formData.intern_remarks) {
      errors.intern_remarks = "Intern Remarks is required.";
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

  console.log("formdata is ", formData)

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-leaves/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-leaves`,
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
          ? "Intern Leave Details Updated!"
          : "Intern Leave Details Created!"
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
        updateMessage={"Intern Leave"}
        addMessage={"Intern Leave"}
        homeLink={"/organization/intern/intern-leaves"}
        homeText={"Intern Leaves"}
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
                      `${option?.first_name || ""} ${option?.middle_name || ""} ${option?.last_name || ""} -- ${option?.intern_code || ""}`.trim();
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
                    if (value === "") {
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
                    max: "100",
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
                  label="Intern Remarks"
                  name="intern_remarks"
                  value={formData.intern_remarks}
                  onChange={handleChange}
                  error={!!formErrors.intern_remarks}
                  helperText={formErrors.intern_remarks}
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
                  label="Rejected By"
                  name="rejected_by"
                  value={formData.rejected_by}
                  onChange={handleChange}
                  error={!!formErrors.rejected_by}
                  helperText={formErrors.rejected_by}
                  disabled={formData.leave_status !== "Rejected"} // Enable only when Rejected
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

export default InternLeaveForm;
