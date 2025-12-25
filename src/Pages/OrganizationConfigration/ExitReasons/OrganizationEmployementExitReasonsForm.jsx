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
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { fetchOrganizationEmploymenentExiReasonTpes } from "../../../Apis/Employment-exit-reason";

function OrganizationEmployementExitReasonsForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [exitReasonType, setExitReasonType] = useState([]);

  const [formData, setFormData] = useState({
    employment_exit_reason_name: "",
    description: "",
    organization_employment_exit_reason_type_id: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchOrganizationEmploymenentExiReasonTpes(org.organization_id)
        .then((data) => {
          setExitReasonType(data?.exitreason?.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/employemnt-exit-reason/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response.data.exitreason;
      console.log("reponse of exit reason ", a);
      setFormData(a);
      setLoading(false);
    };
    if ((mode === "edit" || mode === "view" )&& id) {
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

    if (!formData.employment_exit_reason_name)
      errors.employment_exit_reason_name = "Exit Reason is required.";

    if (!formData.description) errors.description = "Description is required.";

    if (!formData.organization_employment_exit_reason_type_id)
      errors.organization_employment_exit_reason_type_id =
        "Exit Reason is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employemnt-exit-reason/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employemnt-exit-reason`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit" ? "ExitReason updated!" : "ExitReason created!"
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
        updateMessage={"Exit Reason"}
        addMessage={"Exit Reason"}
        homeLink={"/organization-configration/employement-exit-reason"}
        homeText={"Exit Reason"}
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
                  label="Exit Reason Name"
                  name="employment_exit_reason_name"
                  value={formData.employment_exit_reason_name}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  error={!!formErrors.employment_exit_reason_name}
                  helperText={formErrors.employment_exit_reason_name}
                  required
                  inputProps={{ maxLength: 50 }}
                />

                <TextField
                  select
                  fullWidth
                  label="ExitReason Type"
                  name="organization_employment_exit_reason_type_id"
                  value={formData.organization_employment_exit_reason_type_id}
                  onChange={handleChange}
                  error={
                    !!formErrors.organization_employment_exit_reason_type_id
                  }
                  helperText={
                    formErrors.organization_employment_exit_reason_type_id
                  }
                  disabled={exitReasonType?.length === 0 || mode === "view"}
                >
                  {exitReasonType.map((type) => (
                    <MenuItem
                      key={type.organization_employment_exit_reason_type_id}
                      value={type.organization_employment_exit_reason_type_id}
                    >
                      {type?.employment_exit_reason_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  required
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

export default OrganizationEmployementExitReasonsForm;
