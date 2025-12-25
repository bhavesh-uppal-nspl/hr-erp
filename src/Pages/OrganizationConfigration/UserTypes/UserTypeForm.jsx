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

function UserTypeForm({ mode }) {
  const { id } = useParams(); // only used in edit mode
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    user_type_name: "",
    user_type_code: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/user-type/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response.data.userTypes;
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

    if (!formData.user_type_name)
      errors.user_type_name = "User Type Name is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/user-type/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/user-type`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit" ? "User Type updated!" : "User Type created!"
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
        updateMessage={"User Type"}
        addMessage={"User Type"}
        homeLink={"/organization-configration/user-types"}
        homeText={"User Type"}
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
                  label="User Type Name"
                  name="user_type_name"
                  value={formData.user_type_name}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  error={!!formErrors.user_type_name}
                  helperText={formErrors.user_type_name}
                  inputProps={{ maxLength: 50 }}
                  required
                />

                <TextField
                  fullWidth
                  label="User Type Code"
                  name="user_type_code"
                  value={formData.user_type_code}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  error={!!formErrors.user_type_code}
                  helperText={formErrors.user_type_code}
                  inputProps={{ maxLength: 30 }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  disabled={mode === "view"}
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

export default UserTypeForm;
