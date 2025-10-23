
import React, { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { getIndustry } from "../../../Apis/Organization-apis";
import {fetchOwnershipTypeCategory,} from "../../../Apis/OrganizationLocation";
import {
  MenuItem,
  TextField,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import useAuthStore from "../../../Zustand/Store/useAuthStore";

function OrganizationData({ data }) {
  const [industries, setIndustries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generalCategories, setGeneralCategories] = useState([]);
  const [formData, setFormData] = useState();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [Countrydata, setCountryData] = useState([]);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const { isLoggedIn, login, setAccess } = useAuthStore();
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


  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${MAIN_URL}/api/general/countries/v1`);
        console.log("responres for countries ", res);
        setCountryData(res?.data?.data || []);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Session Expired!");
          window.location.href = "/login";
        }
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
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
        if (error.response && error.response.status === 401) {
          toast.error("Session Expired!");
          window.location.href = "/login";
        }
        console.error("Error fetching states:", error);
      }
    };
    console.log("response for states ", states);
    if (formData?.general_country_id) {
      fetchStates();
    }
  }, [formData?.general_country_id]);

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
        if (error.response && error.response.status === 401) {
          toast.error("Session Expired!");
          window.location.href = "/login";
        }
        console.error("Error fetching cities:", error);
      }
    };

    if (formData?.general_country_id && formData?.general_state_id) {
      fetchCities();
    }
  }, [formData?.general_country_id, formData?.general_state_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedData = {
        ...prev,
        [name]: value,
        ...(name === "general_country_id" && { general_state_id: "" }),
        ...(name === "general_state_id" && { general_city_id: "" }),
      };
      if (name === "general_business_ownership_type_category_id") {
        const selected = generalCategories.find(
          (item) => item.general_business_ownership_type_category_id === value
        );
      }
      return updatedData;
    });
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

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
    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  console.log("formdata", formData);

  const handleSubmit = async (e) => {
    try {
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
    }
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      let res = await axios.post(`${MAIN_URL}/api/organizations`, formData);
      console.log("response", res);
      toast.success("Organization created successfully!");
      if (res?.data?.token) {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        setAccess(user?.role?.role?.system_role_name);
        login(user);
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session Expired!");
        window.location.href = "/login";
      }
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

  const getSelectedOwnershipTypeName = () => {
    const selected = generalCategories.find(
      (item) =>
        item.general_business_ownership_type_category_id ===
        formData.general_business_ownership_type_category_id
    );
    return selected ? selected.business_ownership_type_category_name : "";
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Organization Name"
        name="organization_name"
        value={formData?.organization_name}
        onChange={handleChange}
        margin="normal"
        error={!!formErrors.organization_name}
        helperText={formErrors.organization_name}
        sx={{
          maxWidth: "80%",
          mx: "auto",
          display: "block",
          "& .MuiInputBase-root": {
            height: 50,
            fontSize: "0.9rem",
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.9rem",
          },
          "& .MuiFormHelperText-root": {
            fontSize: "0.75rem",
          },
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
        sx={{
          maxWidth: "80%",
          mx: "auto",
          display: "block",
          "& .MuiInputBase-root": {
            height: 50,
            fontSize: "0.9rem",
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.9rem",
          },
          "& .MuiFormHelperText-root": {
            fontSize: "0.75rem",
          },
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
        error={!!formErrors.general_business_ownership_type_category_id}
        helperText={formErrors.general_business_ownership_type_category_id}
        sx={{
          maxWidth: "80%",
          mx: "auto",
          display: "block",
          "& .MuiInputBase-root": {
            height: 50,
            fontSize: "0.9rem",
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.9rem",
          },
          "& .MuiFormHelperText-root": {
            fontSize: "0.75rem",
          },
        }}
      >
        {generalCategories.map((option) => (
          <MenuItem
            key={option?.general_business_ownership_type_category_id}
            value={option?.general_business_ownership_type_category_id}
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
        sx={{
          maxWidth: "80%",
          mx: "auto",
          display: "block",
          "& .MuiInputBase-root": {
            height: 50,
            fontSize: "0.9rem",
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.9rem",
          },
          "& .MuiFormHelperText-root": {
            fontSize: "0.75rem",
          },
        }}
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
        sx={{
          mt: 2,
          maxWidth: "80%",
          mx: "auto",
          display: "block",
          "& .MuiInputBase-root": {
            height: 50,
            fontSize: "0.9rem",
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.9rem",
          },
          "& .MuiFormHelperText-root": {
            fontSize: "0.75rem",
          },
        }}
        fullWidth
        options={Array.isArray(Countrydata) ? Countrydata : []}
        getOptionLabel={(option) => option.country_name || ""}
        value={
          Countrydata?.find(
            (c) => c.general_country_id === formData?.general_country_id
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
        sx={{
          mt: 2,
          maxWidth: "80%",
          mx: "auto",
          display: "block",
          "& .MuiInputBase-root": {
            height: 50,
            fontSize: "0.9rem",
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.9rem",
          },
          "& .MuiFormHelperText-root": {
            fontSize: "0.75rem",
          },
        }}
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
        sx={{
          mt: 2,
          maxWidth: "80%",
          mx: "auto",
          display: "block",
          "& .MuiInputBase-root": {
            height: 50,
            fontSize: "0.9rem",
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.9rem",
          },
          "& .MuiFormHelperText-root": {
            fontSize: "0.75rem",
          },
        }}
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

      <input
        type="submit"
        className="btn btn-primary w-100 mt-3"
        value={loading ? "Submitting..." : "Add Organization"}
        disabled={loading}
      />
    </form>
  );
}

export default OrganizationData;
