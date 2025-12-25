import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";

import { fetchbusinessGeneralCategory } from "../../../Apis/Category";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";

function BusinessOwnershipTypeForm({ mode }) {
  const { id } = useParams(); // only used in edit mode
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [formData, setFormData] = useState({
    general_business_ownership_type_category_id: "",
    organization_business_ownership_type_name: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");

  const [category, setCategory] = useState([]);
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    {
      fetchbusinessGeneralCategory()
        .then((data) => {
          setCategory(data.businessownershiptypescategory);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/businessownershiptype/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response.data.businessownershiptype;
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

    if (!formData.general_business_ownership_type_category_id)
      errors.general_business_ownership_type_category_id =
        "Ownership Type Category is required.";

    if (!formData.organization_business_ownership_type_name)
      errors.organization_business_ownership_type_name =
        "Business Ownership type name is required.";

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
          `${MAIN_URL}/api/organizations/${org.organization_id}/businessownershiptype/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/businessownershiptype`,
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
          ? "Businees Ownership Type Updated!"
          : "Business Ownership Type  Created!"
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
        updateMessage={"Business Ownership Type"}
        addMessage={"Business Ownership Type"}
        homeLink={"/organization-configration/business-ownership-type"}
        homeText={"Business Ownership Type"}
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
               
                 <Autocomplete
                fullWidth
                  options={category || []}
                  getOptionLabel={(option) =>
                    option.business_ownership_type_category_name || ""
                  }
                  value={
                    category?.find(
                      (option) =>
                        option.general_business_ownership_type_category_id ===
                        formData.general_business_ownership_type_category_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "general_business_ownership_type_category_id",
                        value:
                          newValue?.general_business_ownership_type_category_id ||
                          "",
                      },
                    });
                  }}
                  disabled={mode === "view" || category?.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ownership Type"
                      error={
                        !!formErrors.general_business_ownership_type_category_id
                      }
                      helperText={
                        formErrors.general_business_ownership_type_category_id
                      }
                      required
                      fullWidth
                    />
                  )}
                />


                <TextField
                  fullWidth
                  label="Business Ownership Type Name"
                  disabled={mode === "view"}
                  name="organization_business_ownership_type_name"
                  value={formData.organization_business_ownership_type_name}
                  onChange={handleChange}
                  error={!!formErrors.organization_business_ownership_type_name}
                  helperText={
                    formErrors.organization_business_ownership_type_name
                  }
                  required
                  inputProps={{ maxLength: 100 }}
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

export default BusinessOwnershipTypeForm;
