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
import {fetchOrganizationUnitTypes} from '../../../Apis/OrganizationUnit'
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";

function OrganizationUnitForms({ mode }) {
  const { id } = useParams(); 
   const { userData } = useAuthStore();
    const org = userData?.organization;
    const [unitTypes, setUnitTypes]= useState([]);

  const [formData, setFormData] = useState({
    organization_unit_type_id : "",
    unit_name : "",
    unit_short_name:""
  });


  // fetch organization units types 
    useEffect(() => {
      if (org?.organization_id) {
        fetchOrganizationUnitTypes(org.organization_id)
          .then((data) => {
            setUnitTypes(data.unitTypes.data);
          })
          .catch((err) => {
            setFormErrors(err.message);
          });
      }
    }, [org]);
  
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(`${MAIN_URL}/api/organizations/${org.organization_id}/units/${id}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );

      let a = response.data.units;
      console.log("workshitsghbcv", a);
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

    if (!formData.organization_unit_type_id)
      errors.organization_unit_type_id = "Unit Type is required.";

    if (!formData.unit_name) errors.unit_name = "Unit Name is required.";

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
          `${MAIN_URL}/api/organizations/${org.organization_id}/units/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/units`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit" ? "Unit updated!" : "Unit created!"
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
        updateMessage={"Organization Unit "}
        addMessage={" Organization Unit"}
        homeLink={"/organization/units"}
        homeText={"Organization Units"}
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
                  label="Unit Type"
                  name="organization_unit_type_id"
                  value={formData.organization_unit_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_unit_type_id}
                  helperText={
                    formErrors.organization_unit_type_id
                  }
                >
                  {unitTypes.map((type) => (
                    <MenuItem
                      key={type.organization_unit_type_id}
                      value={type.organization_unit_type_id}
                    >
                      {type.unit_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Unit Name"
                  name="unit_name"
                  value={formData.unit_name}
                  onChange={handleChange}
                  error={!!formErrors.unit_name}
                  helperText={formErrors.unit_name}
                  required
                    inputProps={{ maxLength: 50 }}
                />

                <TextField
                  fullWidth
                  label="Unit Short Name"
                  name="unit_short_name"
                  value={formData.unit_short_name}
                  onChange={handleChange}
                  error={!!formErrors.unit_short_name}
                  helperText={formErrors.unit_short_name}
                    inputProps={{ maxLength: 20 }}
                  
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

export default OrganizationUnitForms;
