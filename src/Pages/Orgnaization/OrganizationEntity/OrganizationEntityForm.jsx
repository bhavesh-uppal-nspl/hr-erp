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
import { fetchOrganizationUnitTypes } from "../../../Apis/OrganizationUnit";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import axios from "axios";
import { fetchOrganizationLocation } from "../../../Apis/OrganizationLocation";
import { getIndustry } from "../../../Apis/Organization-apis";
import { fetchGeneralEntityType } from "../../../Apis/Entity";

function OrganizationEntityForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [unitTypes, setUnitTypes] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [location, setLocation] = useState([]);
  const [type, setType] = useState([]);

  const [formData, setFormData] = useState({
    organization_location_id: "",
    entity_name: "",
    entity_code: "",
    general_industry_id: "",
    general_organization_entity_type_id: "",
    organization_location_id: "",
  });

  // fetch organization units types
  useEffect(() => {
    if (org?.organization_id) {
      fetchGeneralEntityType()
        .then((data) => {
          setType(data?.GenEntityType);
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
          setLocation(data?.locations);
        })
        .catch((err) => {
          setFormErrors(err.message);
        });
    }
  }, [org]);

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

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/entity/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      let a = response.data.entity;
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

    if (!formData.organization_location_id)
      errors.organization_location_id = "Location is required.";

    if (!formData.entity_name) errors.entity_name = "Entity Name is required.";

    if (!formData.general_organization_entity_type_id)
      errors.general_organization_entity_type_id = "Entity Type is required.";

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
          `${MAIN_URL}/api/organizations/${org.organization_id}/entity/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org.organization_id}/entity`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(mode === "edit" ? "Entity updated!" : "Entity created!");
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



  const updateEntityName = (selectedType, selectedLocation) => {
  const orgName = org?.organization_name || "";
  const typeName = selectedType?.organization_entity_type_name || "";
  const locationName = selectedLocation?.location_name || "";

  // Join parts that are not empty
  const combinedName = [orgName, locationName, typeName]
    .filter(Boolean)
    .join(" - ");

  setFormData((prev) => ({ ...prev, entity_name: combinedName }));
};




  return (
    <Box px={4} py={4}>
      <Header
        mode={mode}
        updateMessage={"Organization Entity "}
        addMessage={" Organization Entity"}
        homeLink={"/organization/entity"}
        homeText={"Organization Entity"}
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
                <Autocomplete
                  fullWidth
                  options={type || []}
                  getOptionLabel={(option) =>
                    option.organization_entity_type_name || ""
                  }
                  value={
                    type?.find(
                      (option) =>
                        option.general_organization_entity_type_id ===
                        formData.general_organization_entity_type_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "general_organization_entity_type_id",
                        value:
                          newValue?.general_organization_entity_type_id || "",
                      },
                    });

                    updateEntityName(
                      newValue,
                      location?.find(
                        (loc) =>
                          loc.organization_location_id ===
                          formData.organization_location_id
                      )
                    );
                  }}
                  disabled={mode === "view" || type?.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Entity Type"
                      error={!!formErrors.general_organization_entity_type_id}
                      helperText={
                        formErrors.general_organization_entity_type_id
                      }
                      required
                      fullWidth
                    />
                  )}
                />

                <Autocomplete
                  fullWidth
                  options={location || []}
                  getOptionLabel={(option) => option.location_name || ""}
                  value={
                    location?.find(
                      (option) =>
                        option.organization_location_id ===
                        formData.organization_location_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "organization_location_id",
                        value: newValue?.organization_location_id || "",
                      },
                    });
                    updateEntityName(
                      type?.find(
                        (t) =>
                          t.general_organization_entity_type_id ===
                          formData.general_organization_entity_type_id
                      ),
                      newValue
                    );
                  }}
                  disabled={mode === "view" || location?.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Location"
                      error={!!formErrors.organization_location_id}
                      helperText={formErrors.organization_location_id}
                      required
                      fullWidth
                    />
                  )}
                />

                <TextField
                  fullWidth
                  label="Entity Name"
                  name="entity_name"
                  value={formData.entity_name}
                  onChange={handleChange}
                  error={!!formErrors.entity_name}
                  helperText={formErrors.entity_name}
                  required
                inputProps={{ maxLength: 50, readOnly: true }}
                />

                <TextField
                  fullWidth
                  label="Entity Code"
                  name="entity_code"
                  value={formData.entity_code}
                  onChange={handleChange}
                  error={!!formErrors.entity_code}
                  helperText={formErrors.entity_code}
                  inputProps={{ maxLength: 20 }}
                />

                {/* <Autocomplete
                  fullWidth
                  options={industries}
                  getOptionLabel={(option) => option.industry_name || ""}
                  value={
                    industries.find(
                      (item) =>
                        item.general_industry_id ===
                        formData.general_industry_id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "general_industry_id",
                        value: newValue ? newValue.general_industry_id : "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Industry"
                      margin="normal"
                      error={!!formErrors.general_industry_id}
                      helperText={formErrors.general_industry_id}
                    />
                  )}
                /> */}
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

export default OrganizationEntityForm;
