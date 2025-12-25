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
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";

function UserRoleForm({ mode }) {

    const { id } = useParams(); // only used in edit mode

    const [formData, setFormData] = useState({
        	user_role_name: "",
             description: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(mode === "edit");
    const [btnLoading, setbtnLoading] = useState(false);

    let navigate = useNavigate();


    useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/application/userrole/${id}`,  
      );
      let a = response.data.userroles;
      console.log("a",a)
      setFormData(a);
      setLoading(false);
    };
    if ((mode === "edit" || mode === "view") && id) {
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

        if (!formData.user_role_name)
            errors.user_role_name = "User Role name is required.";

        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
    };



      const handleSubmit = async () => {
        if (!validateForm()) return;
        setbtnLoading(true);
    
        try {
          if (mode === "edit") {
            // Call edit API
            await axios.put(
              `${MAIN_URL}/api/application/userrole/${id}`,
              formData
            );
          } else {
            await axios.post(
              `${MAIN_URL}/api/application/userrole`,
              formData
            );
          }
    
          toast.success(
            mode === "edit"
              ? "User Role Updated!"
              : "User Role Created!"
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
            <Header mode={mode}
                updateMessage={"User Roles"}
                addMessage={"User Role"}
                homeLink={"/application/user-roles"}
                homeText={"User Roles"}
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
                                    label="User Role Name"
                                    name="user_role_name"
                                    value={formData.user_role_name }
                                    onChange={handleChange}
                                    disabled={mode === "view"}
                                    error={!!formErrors.user_role_name }
                                    helperText={formErrors.user_role_name }
                                    required
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

export default UserRoleForm;
