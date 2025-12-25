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
import { MAIN_URL } from "../../../Configurations/Urls";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";

function DocumentLinkForm({ mode }) {
    const { userData } = useAuthStore();
    const org = userData?.organization;
  const { id } = useParams(); // only used in edit mode

  const [formData, setFormData] = useState({
    work_model_name : ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

;

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/work-model/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response.data.workmodel;
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

    if (!formData.work_model_name)
      errors.work_model_name = "Work Mode is required.";

  
    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);
    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/work-model/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } 
      else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/work-model`,
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
          ? " Work Mode Updated!"
          : "Work Mode Created!"
      );
      setFormErrors({});
      navigate(-1);
    } catch (err) { if (err.response && err.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
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
      <Header mode={mode}
        updateMessage={"Work Model"}
        addMessage={"Work Model"}
        homeLink={"/organization-configration/work-model"}
        homeText={"Work Model"}
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
                  label="Work mode"
                  name="work_model_name"
                  value={formData.work_model_name}
                  onChange={handleChange}
                  error={!!formErrors.work_model_name}
                  helperText={formErrors.work_model_name}
                        inputProps={{ maxLength: 50 }}
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
                  {(loading || btnLoading) ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : (
                    mode === "edit" ? "Submit" : "Submit"
                  )}
                </Button>
              </Grid>
            </Paper>
              {mode === "edit" && (
                            <Grid item>
                              <Button
                                variant="contained"
                                color="primary" // blue color
                                size="medium"
                                onClick={() => navigate(-1)} // cancel navigates back
                                sx={{
                                  borderRadius: 2,
                                  minWidth: 120,
                                  textTransform: "capitalize",
                                  fontWeight: 500,
                                  mt:2,
                                  backgroundColor: "#1976d2", // standard blue
                                  "&:hover": { backgroundColor: "#115293" },
                                }}
                              >
                                Cancel
                              </Button>
                            </Grid>
                          )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default DocumentLinkForm;
