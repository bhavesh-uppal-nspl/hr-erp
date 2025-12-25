import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";

import toast from "react-hot-toast";
import { getIndustry } from "../../../Apis/Organization-apis";
import {
  fetchGeneralCountriesall,
  fetchOwnershipTypeCategory,
} from "../../../Apis/OrganizationLocation";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";

function OrganizationAddInForm({ mode }) {
  const [industries, setIndustries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [btnLoading, setbtnLoading] = useState(false);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [generalCategories, setGeneralCategories] = useState([]);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [Countrydata, setCountryData] = useState([]);

  const { id } = useParams();

  const [formData, setFormData] = useState({
    organization_name: "",
    organization_short_name: "",
    general_business_ownership_type_category_id: "",
    general_industry_id: "",
    general_country_id: "",
    general_state_id: "",
    general_city_id: "",
  });

  const { userData } = useAuthStore();
  const org = userData;

  let application_user_id;
  let client_id;

  if (org) {
    application_user_id = org.application_user_id;
    client_id = org.client_id;
  }

  console.log("application", application_user_id);
  console.log("client id", client_id);

  const { isLoggedIn, login, setAccess } = useAuthStore();

  // console.log("data is ",location.state.application_user_id);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    {
      fetchOwnershipTypeCategory()
        .then((data) => {
          setGeneralCategories(data.businessownershiptypescategory);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  useEffect(() => {
    {
      getIndustry()
        .then((data) => {
          setIndustries(data.industries);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, []);

  // for edit of organization
  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(`${MAIN_URL}/api/organizations/${id}`);
      let a = response?.data?.organization;
      console.log("a of edit", a);

      setFormData({
        organization_name: a.organization_name || "",
        organization_short_name: a.organization_short_name || "",
        general_country_id: a.locations?.country?.general_country_id || "",
        general_state_id: a.locations?.state?.general_state_id || "",
        general_city_id: a.locations?.city?.general_city_id || "",
        general_business_ownership_type_category_id:
          a.businessprofile?.general_business_ownership_type_category_id || "",
        general_industry_id: a.businessprofile?.general_industry_id || "",
      });
      setLoading(false);
    };
    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  console.log("formdata", formData);



  // fetch countries

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${MAIN_URL}/api/general/countries/v1`);

        console.log("responres for countries ", res);
        setCountryData(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    
      fetchCountries()
  }, []);

  // fetch state
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          `${MAIN_URL}/api/general/countries/${formData?.general_country_id}/states`
        );
        setStates(res?.data?.generalstates || []);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    console.log("response for states ", states);

    if (formData?.general_country_id) {
      fetchStates();
    }
  }, [formData.general_country_id]);

  // fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(
          `${MAIN_URL}/api/general/countries/${formData?.general_country_id}/states/${formData?.general_state_id}/cities`
        );

        console.log("responres for cities ", res);
        setCities(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    if (formData?.general_country_id && formData?.general_state_id) {
      fetchCities();
    }
  }, [formData?.general_country_id, formData?.general_state_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [generalCountries] = await Promise.all([fetchGeneralCountriesall()]);
        setCountries(generalCountries.countries || []);
      } catch (err) {
        toast.error("Failed to fetch countries or industries");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedData = {
        ...prev,
        [name]: value,
        ...(name === "general_country_id" && { general_state_id: "" }),
        ...(name === "general_state_id" && { general_city_id: "" }),
      };

      // Clear Industry field when Organization Type changes to anything except "Business"
      if (name === "general_business_ownership_type_category_id") {
        const selected = generalCategories.find(
          (item) => item.general_business_ownership_type_category_id === value
        );

        if (selected?.business_ownership_type_category_name !== "Business") {
          updatedData.general_industry_id = "";
        }
      }
      return updatedData;
    });

    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // handle validation
  const validateForm = () => {
    const errors = {};
    if (!formData.organization_name)
      errors.organization_name = "Organization Name is required";
    if (!formData.organization_short_name)
      errors.organization_short_name = "Short Name is required";
    if (!formData.general_country_id)
      errors.general_country_id = "Country is required";
    if (!formData.general_business_ownership_type_category_id)
      errors.general_business_ownership_type_category_id = "State is required";
     if (!formData.general_city_id)
      errors.general_city_id = "City is required";
 
    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  console.log("formdata", formData);

  const handleSubmit = async (e) => {
    try {
    } catch (error) {}
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const dataToSubmit = {
      ...formData,
      application_user_id,
      client_id,
    };

    try {

     if (mode === "edit") {
      await axios.put(
        `${MAIN_URL}/api/organizations/${id}`,
        dataToSubmit,
      );
      toast.success("Organization updated successfully!");
      navigate(-1)
    } 
    else{

      let res = await axios.post(`${MAIN_URL}/api/organizations`, dataToSubmit);
      console.log("response", res);
      toast.success("Organization created successfully!");
      setFormData();
      if (res?.data?.token) {
        const { token, user } = res.data;

        localStorage.setItem("token", token);
        setAccess(user?.role?.role?.system_role_name);
        navigate(-1);
      }

    }  
    } catch (error) {
      console.log("error", error);
      if (error?.response?.data?.errors !== undefined) {
        setFormErrors(error.response.data.errors);
      } else {
        toast.error("Failed to create Organization");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="mainSection d-flex align-items-center justify-content-center">
        <CircularProgress />
      </div>
    );
  }


  const getSelectedOwnershipTypeName = () => {
    const selected = generalCategories.find(
      (item) =>
        item.general_business_ownership_type_category_id ===
        formData.general_business_ownership_type_category_id
    );
    return selected ? selected.business_ownership_type_category_name : "";
  };

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Organization"}
        addMessage={"Organization"}
        homeLink={"/organization/details"}
        homeText={"Organizations"}
      />
      {loading ? (
        <Grid container spacing={2}>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        <Grid container spacing={1}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Grid container spacing={1}>
                <TextField
                  fullWidth
                  label="Organization Name"
                  name="organization_name"
                  value={formData?.organization_name}
                  onChange={handleChange}
                  margin="normal"
                  error={!!formErrors.organization_name}
                  helperText={formErrors.organization_name}
                  inputProps={{
                    maxLength: 100,
                  }}
                />

                <TextField
                  fullWidth
                  label="Organization Short Name"
                  name="organization_short_name"
                  value={formData?.organization_short_name}
                  onChange={handleChange}
                  margin="normal"
                  error={!!formErrors.organization_short_name}
                  helperText={formErrors.organization_short_name}
                  inputProps={{
                    maxLength: 20,
                  }}
                />

                <TextField
                  select
                  fullWidth
                  label="Organization Type"
                  name="general_business_ownership_type_category_id"
                  value={formData?.general_business_ownership_type_category_id}
                  onChange={handleChange}
                  margin="normal"
                  error={
                    !!formErrors.general_business_ownership_type_category_id
                  }
                  helperText={
                    formErrors.general_business_ownership_type_category_id
                  }
                >
                  {generalCategories.map((option) => (
                    <MenuItem
                      key={option?.general_business_ownership_type_category_id}
                      value={
                        option?.general_business_ownership_type_category_id
                      }
                    >
                      {option.business_ownership_type_category_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Industry"
                  name="general_industry_id"
                  value={formData?.general_industry_id}
                  onChange={handleChange}
                  margin="normal"
                  error={!!formErrors.general_industry_id}
                  helperText={formErrors.general_industry_id}
                  disabled={
                    !formData?.general_business_ownership_type_category_id ||
                    getSelectedOwnershipTypeName() !== "Business"
                  }
                >
                  {industries.map((option) => (
                    <MenuItem
                      key={option.general_industry_id}
                      value={option?.general_industry_id}
                    >
                      {option.industry_name}
                    </MenuItem>
                  ))}
                </TextField>

                <Autocomplete
                  sx={{ mt: 2 }}
                  fullWidth
                  options={Array.isArray(Countrydata) ? Countrydata : []}
                  getOptionLabel={(option) => option.country_name || ""}
                  value={
                    Countrydata?.find(
                      (c) =>
                        c.general_country_id === formData?.general_country_id
                    ) || null
                  }
                  onChange={(e, newValue) => {
                    handleChange({
                      target: {
                        name: "general_country_id",
                        value: newValue ? newValue.general_country_id : "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      error={!!formErrors?.general_country_id}
                      helperText={formErrors?.general_country_id}
                    />
                  )}
                />

                <Autocomplete
                  sx={{ mt: 2 }}
                  fullWidth
                  options={Array.isArray(states) ? states : []}
                  getOptionLabel={(option) => option.state_name || ""}
                  value={
                    states?.find(
                      (s) => s.general_state_id === formData?.general_state_id
                    ) || null
                  }
                  onChange={(e, newValue) => {
                    handleChange({
                      target: {
                        name: "general_state_id",
                        value: newValue ? newValue.general_state_id : "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      error={!!formErrors?.general_state_id}
                      helperText={formErrors?.general_state_id}
                    />
                  )}
                />

                <Autocomplete
                  sx={{ mt: 2  ,mb:2}}
                  fullWidth
                  options={Array.isArray(cities) ? cities : []}
                  getOptionLabel={(option) => option.city_name || ""}
                  value={
                    cities?.find(
                      (c) => c.general_city_id === formData?.general_city_id
                    ) || null
                  }
                  onChange={(e, newValue) => {
                    handleChange({
                      target: {
                        name: "general_city_id",
                        value: newValue ? newValue.general_city_id : "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      error={!!formErrors?.general_city_id}
                      helperText={formErrors?.general_city_id}
                    />
                  )}
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
                  {loading || btnLoading ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : mode === "edit" ? (
                    "Submit"
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>

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
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default OrganizationAddInForm;
