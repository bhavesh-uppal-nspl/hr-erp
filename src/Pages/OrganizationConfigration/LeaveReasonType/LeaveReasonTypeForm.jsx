import React, { useState, useEffect } from "react";
import MenuItem from '@mui/material/MenuItem';
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import {fetchLeaveTypes} from '../../../Apis/Leave-api'
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import {MAIN_URL } from "../../../Configurations/Urls";

function LeaveReasonTypeForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [leaveType,setLeaveType]=useState([]);

  const [formData, setFormData] = useState({
    leave_reason_type_name: "",
    description: "",
    organization_leave_type_id: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

    useEffect(() => {
      {
        fetchLeaveTypes(org.organization_id)
          .then((data) => {
            setLeaveType(data.leavetypes.data);
          })
          .catch((err) => {
            setFormErrors(err.message);
          });
      }
    }, []);

    console.log("leave types", leaveType)

    useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/leave-reason-type/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
      let a = response.data.leavereasontype;
      setFormData(a);
      setLoading(false);
    };
    if ((mode === "edit" || mode === "view" )&& id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  console.log("fprmdata", formData)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.leave_reason_type_name)
      errors.leave_reason_type_name = "Leave Reason Name is required.";

   

    if (!formData.organization_leave_type_id)
      errors.organization_leave_type_id = "Leave Reason Type is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };


    const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/leave-reason-type/${id}`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/leave-reason-type`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      }
      toast.success(mode === "edit" ? "Leave Reason Type Updated!" : "Leave Reason Type Created!");
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
        // toast.error(errorMessages || "Validation failed.");
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
        updateMessage={"Leave Reason Type"}
        addMessage={"Leave Reason Type"}
        homeLink={"/organization-configration/leave-reason-type"}
        homeText={"Leave Reason Type"}
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
                  label="Leave Reason Type Name"
                  name="leave_reason_type_name"
                  value={formData.leave_reason_type_name}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  error={!!formErrors.leave_reason_type_name}
                  helperText={formErrors.leave_reason_type_name}
                  required
                      inputProps={{ maxLength: 50 }}
                />

                {/* <TextField
                  select
                  fullWidth
                  label="Leave Type"
                  name="organization_leave_type_id"
                  value={formData.organization_leave_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_leave_type_id}
                  helperText={formErrors.organization_leave_type_id}
                  required
                      disabled={leaveType?.length === 0}
                >
                  {leaveType?.map((option) => (
                    <MenuItem
                      key={option.organization_leave_type_id}
                      value={option.organization_leave_type_id}
                    >
                      {option.leave_type_name}
                    </MenuItem>
                  ))}
                </TextField> */}

                <Autocomplete
                fullWidth
                  options={leaveType || []}
                  getOptionLabel={(option) =>
                    option.leave_type_name || ""
                  }
                  value={
                    leaveType?.find(
                      (option) =>
                        option.organization_leave_type_id ===
                        formData.organization_leave_type_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "organization_leave_type_id",
                        value:
                          newValue?.organization_leave_type_id ||
                          "",
                      },
                    });
                  }}
                  disabled={mode === "view" || leaveType?.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Leave Type"
                      error={
                        !!formErrors.organization_leave_type_id
                      }
                      helperText={
                        formErrors.organization_leave_type_id
                      }
                      required
                      fullWidth
                    />
                  )}
                />


                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  
                />

               
              </Grid>

              
               <Grid container spacing={2} mt={2}>
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
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default LeaveReasonTypeForm;
