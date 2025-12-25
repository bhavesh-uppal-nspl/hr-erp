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

function OrganizationEmployementTypesForm({ mode }) {

  const { userData } = useAuthStore();
  const org = userData?.organization;
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  const [formData, setFormData] = useState({
    employment_type_name: ""
  });


  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(`${MAIN_URL}/api/organizations/${org.organization_id}/employemnt-type/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );
      console.log("employment by id response", response);
      let a = response.data.employmentTpe;
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

    if (!formData.employment_type_name)
      errors. employment_type_name = "Type's Name is required.";

  
    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  console.log("id is ",id);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);
    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employemnt-type/${id}`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
        console.log("formdatavhb",formData)
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/employemnt-type`,
          formData,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
        );
      }
      toast.success(
        mode === "edit"
          ? "Employment Type updated!"
          : "Employment Type created!"
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
        updateMessage={"Employment's Type"}
        addMessage={"Employment's Type"}
        homeLink={"/organization-configration/employement-type"}
        homeText={"Employment's Type"}
      />
      {loading ? (
        <Grid container spacing={2}>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        
            <Paper elevation={4} sx={{ p: 3 }}>
              <Grid container spacing={2}>

                <TextField
                  fullWidth
                  label="Employment Type"
                  name="employment_type_name"
                  value={formData.employment_type_name}
                  onChange={handleChange}
                  error={!!formErrors.employment_type_name}
                  helperText={formErrors.employment_type_name}
                   inputProps={{ maxLength: 60 }}
                  required
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
        
      )}
    </Box>
  );
}

export default OrganizationEmployementTypesForm;
