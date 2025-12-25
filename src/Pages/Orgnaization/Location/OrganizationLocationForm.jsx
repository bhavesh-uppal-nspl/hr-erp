import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import {
  fetchOrganizationLocation,
  fetchLocationOwnership,
  fetchcities,
} from "../../../Apis/OrganizationLocation";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";

function OrganizationLocationForm({ mode }) {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [ownershipTypes, setOwnershipTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [btnLoading, setbtnLoading] = useState(false);
  const { id } = useParams();

  const [formData, setFormData] = useState({
    location_name: "",
    organization_location_ownership_type_id: "",
    general_city_id: "",
    general_state_id: "",
    location_longitude: "",
    location_latitude: "",
    addressline1: "",
    addressline2: "",
    postal_code: "",
    number_of_floors: "",
    area_sq_ft: "",
    general_country_id: 104,
  });

  useEffect(() => {
    if (org?.organization_id) {
      fetchLocationOwnership(org.organization_id)
        .then((data) => {
          setOwnershipTypes(data.ownershiptypes.data);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);

  useEffect(() => {
    if (org?.organization_id) {
      fetchOrganizationLocation(org.organization_id)
        .then((data) => {
          setLocations(data.locations);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);

  console.log("formdata is ", formData);

  // call for general states
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

    console.log("states ", states);

    if (formData?.general_country_id) {
      fetchStates();
    }
  }, [formData.general_country_id]);

  // call for general citites
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(
          `${MAIN_URL}/api/general/countries/${formData?.general_country_id}/states/${formData?.general_state_id}/cities`
        );

        console.log("responres vh", res);
        setCities(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    if (formData?.general_country_id && formData?.general_state_id) {
      fetchCities();
    }
  }, [formData?.general_country_id, formData?.general_state_id]);

  console.log("locationss", locations);

  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/location/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let a = response?.data?.location;

      console.log("updated data is ", a);

      setFormData(a);
      setLoading(false);
    };
    if ((mode === "edit" || mode === "view") && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    console.log("e i ", e);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  console.log("formdata ", formData);

  const validateForm = () => {
    const errors = {};
    if (!formData.location_name)
      errors.location_name = "Location Name is required.";
    else if (formData.location_name?.length > 50)
      errors.location_name = "Max 50 characters.";

    if (!formData.organization_location_ownership_type_id)
      errors.organization_location_ownership_type_id =
        "Ownership Type is required.";

    // if (!formData.general_city_id) errors.general_city_id = "Cityis required.";

    if (!formData.addressline1) errors.addressline1 = "address1 is required.";

    if (
      formData.addressline2 &&
      formData.addressline1 &&
      formData.addressline2.trim() === formData.addressline1.trim()
    ) {
      errors.addressline2 =
        "Address Line 2 should not be the same as Address Line 1.";
    }

    if (
      !formData.postal_code ||
      (formData.postal_code && !/^\d{5,6}$/.test(formData.postal_code))
    )
      errors.postal_code = "Postal code must be 5-6 digits.";
    if (
      formData.number_of_floors !== "" &&
      Number(formData.number_of_floors) < 0
    ) {
      errors.number_of_floors = "Floors must be 0 or more.";
    }

    if (formData.area_sq_ft !== "" && Number(formData.area_sq_ft) < 0) {
      errors.area_sq_ft = "Area must be a positive number.";
    }

    setFormErrors(errors);
    console.log(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setbtnLoading(true);
    try {
      if (mode === "edit") {
        // Call edit API
        await axios.put(
          `${MAIN_URL}/api/organizations/${org.organization_id}/location/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/location`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit" ? "Location updated!" : "Location created!"
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

  console.log("formdata", formData);

  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Location"}
        addMessage={" Location"}
        homeLink={"/organization/location"}
        homeText={" Locations"}
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
                  label="Location Name"
                  name="location_name"
                  disabled={mode === "view"}
                  value={formData.location_name}
                  onChange={handleChange}
                  error={!!formErrors.location_name}
                  helperText={formErrors.location_name}
                  inputProps={{
                    maxLength: 100,
                  }}
                  required
                />

                <TextField
                  select
                  fullWidth
                  label="Ownership Type"
                  name="organization_location_ownership_type_id"
                  value={formData.organization_location_ownership_type_id}
                  onChange={handleChange}
                  error={!!formErrors.organization_location_ownership_type_id}
                  helperText={
                    formErrors.organization_location_ownership_type_id
                  }
                  required
                  disabled={ownershipTypes?.length === 0 || mode === "view"}
                >
                  {ownershipTypes.map((type) => (
                    <MenuItem
                      key={type.organization_location_ownership_type_id}
                      value={type.organization_location_ownership_type_id}
                    >
                      {type.location_ownership_type_name}
                    </MenuItem>
                  ))}
                </TextField>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "100%", // ensures proper centering
                  }}
                >
                  <TextField
                    fullWidth
                    label="Country"
                    value={locations[0]?.country?.country_name || ""}
                    disabled
                  />

                  <Autocomplete
                    fullWidth
                    disabled={mode === "view"}
                    options={Array.isArray(states) ? states : []}
                    getOptionLabel={(option) => option.state_name || ""} // ✔ Use correct field
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
                    fullWidth
                    disabled={mode === "view"}
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
                </Box>

                <TextField
                  fullWidth
                  disabled={mode === "view"}
                  label="Address Line 1"
                  name="addressline1"
                  value={formData.addressline1}
                  onChange={handleChange}
                  error={!!formErrors.addressline1}
                  helperText={formErrors.addressline1}
                  inputProps={{
                    maxLength: 100,
                  }}
                  required
                />

                <TextField
                  fullWidth
                  disabled={mode === "view"}
                  label="Address Line 2"
                  name="addressline2"
                  value={formData.addressline2}
                  onChange={handleChange}
                  error={!!formErrors.addressline2}
                  helperText={formErrors.addressline2}
                  inputProps={{
                    maxLength: 100,
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // centers the row
                    gap: 2, // space between fields
                    width: "100%", // ensures proper centering
                  }}
                >
                  <TextField
                    fullWidth
                    disabled={mode === "view"}
                    label="Postal Code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    error={!!formErrors.postal_code}
                    helperText={formErrors.postal_code}
                    required
                    inputProps={{
                      maxLength: 8,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Number of Floors"
                    disabled={mode === "view"}
                    name="number_of_floors"
                    value={formData.number_of_floors}
                    onChange={handleChange}
                    type="number"
                    error={!!formErrors.number_of_floors}
                    helperText={formErrors.number_of_floors}
                  />

                  <TextField
                    fullWidth
                    label="Area (Sq Ft)"
                    name="area_sq_ft"
                    disabled={mode === "view"}
                    value={formData.area_sq_ft}
                    onChange={handleChange}
                    type="number"
                    error={!!formErrors.area_sq_ft}
                    helperText={formErrors.area_sq_ft}
                  />
                </Box>
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

export default OrganizationLocationForm;
