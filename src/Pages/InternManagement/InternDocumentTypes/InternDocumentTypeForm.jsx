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
import { MAIN_URL } from "../../../Configurations/Urls";

function InternDocumentTypeForm({ mode }) {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  const [formData, setFormData] = useState({
    document_type_name: "",
    document_type_short_name: "",
    description: "",
  });

  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-document-type/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("employment by id response", response);
      let a = response?.data?.intership;
      setFormData(a);
      setLoading(false);
    };
    if (mode === "edit" || mode === "view" && id) {
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

    if (!formData.document_type_name)
      errors.document_type_name = "Type's Name is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  console.log("id is ", id);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);
    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-document-type/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("formdatavhb", formData);
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-document-type`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit" ? "Document Type updated!" : "Document Type created!"
      );
      setFormErrors({});
      navigate(-1);
    } catch (err) {
      if (err.response && err.response.status === 401) {
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
      <Header
        mode={mode}
        updateMessage={"Document Type"}
        addMessage={"Document Type"}
        homeLink={"/intern/document/types"}
        homeText={"Document Types"}
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
                  label="Document Type"
                  name="document_type_name"
                  disabled={mode === "view"}
                  value={formData.document_type_name}
                  onChange={handleChange}
                  error={!!formErrors.document_type_name}
                  helperText={formErrors.document_type_name}
                  inputProps={{ maxLength: 100 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Document Type ShortName"
                  name="document_type_short_name"
                  disabled={mode === "view"}
                  
                  value={formData.document_type_short_name}
                  onChange={handleChange}
                  error={!!formErrors.document_type_short_name}
                  helperText={formErrors.document_type_short_name}
                  inputProps={{ maxLength: 50 }}
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

export default InternDocumentTypeForm;
