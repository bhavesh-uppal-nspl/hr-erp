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
import {MAIN_URL } from "../../../Configurations/Urls";

function SettingTypeForm({ mode }) {

  const { id } = useParams(); // only used in edit mode
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    setting_type_name : ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();



  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/setting-type/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
      let a = response.data.settingtype;
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

    if (!formData.setting_type_name)
      errors. setting_type_name  = "Setting type is required.";

  
    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/setting-type/${id}`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/setting-type`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      }
      toast.success(mode === "edit" ? "Setting Type updated!" : "Setting Type created!");
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
      <Header mode={mode}
        updateMessage={"Organization Setting Type"}
        addMessage={"Organization Setting Type"}
        homeLink={"/setting/setting-type"}
        homeText={"Setting Types"}
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
                  label="Setting Type Name"
                  name="setting_type_name"
                  value={formData.setting_type_name }
                  onChange={handleChange}
                  error={!!formErrors.setting_type_name }
                  helperText={formErrors.setting_type_name }
    
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
                    mode === "edit" ? "Update" : "Submit"
                  )}
                </Button>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default SettingTypeForm;
