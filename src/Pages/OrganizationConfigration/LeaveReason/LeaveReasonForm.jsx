import React, { useState, useEffect } from "react";
import MenuItem from '@mui/material/MenuItem';
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
import {fetchLeaveReasonTypes} from '../../../Apis/Leave-api'
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import {MAIN_URL } from "../../../Configurations/Urls";

function LeaveReasonForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [leaveReasonType,setLeaveReasonType]=useState([]);

  const [formData, setFormData] = useState({
    leave_reason_name: "",
    description: "",
    organization_leave_reason_type_id: "",
  });


  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

    useEffect(() => {
      {
        fetchLeaveReasonTypes(org.organization_id)
          .then((data) => {
            setLeaveReasonType(data?.leavereasontype);
          })
          .catch((err) => {
            setFormErrors(err.message);
          });
      }
    }, []);

    console.log("leave reason types", leaveReasonType)

    useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/leave-reason/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
      let a = response.data.leavereason;
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

    if (!formData.leave_reason_name)
      errors.leave_reason_name = "Leave Reason Name is required.";

   

    if (!formData.organization_leave_reason_type_id)
      errors.organization_leave_reason_type_id = "Leave Reason Type is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };


    const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/leave-reason/${id}`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/leave-reason`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      }
      toast.success(mode === "edit" ? "Leave Reason updated!" : "Leave Reason created!");
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
        updateMessage={"Leave Reason"}
        addMessage={"Leave Reason"}
        homeLink={"/organization-configration/leave-reason"}
        homeText={"Leave Reason"}
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
                  label="Leave Reason Name"
                  name="leave_reason_name"
                  value={formData.leave_reason_name}
                  onChange={handleChange}
                  error={!!formErrors.leave_reason_name}
                  helperText={formErrors.leave_reason_name}
                  required
                      inputProps={{ maxLength: 50 }}
                />

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
                  {leaveReasonType?.map((option) => (
                    <MenuItem
                      key={option.organization_leave_reason_type_id}
                      value={option.organization_leave_reason_type_id}
                    >
                      {option.leave_reason_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                      inputProps={{ maxLength: 255 }}
                  
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

export default LeaveReasonForm;
