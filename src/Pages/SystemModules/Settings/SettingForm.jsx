import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Switch,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../DataLayouts/Header";
import toast from "react-hot-toast";
import {
  fetchGeneralSettingType,
  fetchGeneralSettingDataType,
  fetchOrganizationSettingType,
  fetchOrganizationSettingDataType,
} from "../../../Apis/OrganizationSetting-api";
import axios from "axios";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { Checkbox, FormControlLabel } from "@mui/material";
import { MAIN_URL } from "../../../Configurations/Urls";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function SettingForm({ mode }) {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [settingType, setSettingType] = useState([]);
  const [datatypes, setDataTypes] = useState([]);

  // Initialize default form structure
  const getInitialFormData = (settingTypeId = "") => ({
    organization_setting_data_type_id: "",
    setting_name: "",
    default_value: "self",
    setting_value: "",
    customizable: false,
    has_predefined_values: false,
    predefined_values: "",
    min_value: "",
    max_value: "",
    unit: "",
    min_date: "",
    max_date: "",
    pattern: "",
    is_required: false,
    organization_setting_type_id: settingTypeId,
  });

  // Store separate form data for each setting type
  const [formDataByType, setFormDataByType] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [btnLoading, setbtnLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  let navigate = useNavigate();

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    
    // Initialize form data for this type if it doesn't exist
    if (isExpanded && !formDataByType[panel]) {
      setFormDataByType(prev => ({
        ...prev,
        [panel]: getInitialFormData(panel)
      }));
    }
  };

  // Get current form data based on expanded accordion
  const getCurrentFormData = () => {
    if (!expanded) return getInitialFormData();
    return formDataByType[expanded] || getInitialFormData(expanded);
  };

  console.log("respones ", org?.organization_id);
  
  useEffect(() => {
    fetchOrganizationSettingType()
      .then((data) => {
        const types = data?.settingtypes?.data || [];
        setSettingType(types);
        
        // Initialize form data for each setting type
        const initialFormData = {};
        types.forEach(type => {
          initialFormData[type.organization_setting_type_id] = getInitialFormData(type.organization_setting_type_id);
        });
        setFormDataByType(initialFormData);
      })
      .catch((err) => {
        setFormErrors(err.message);
      });
  }, []);

  useEffect(() => {
    fetchOrganizationSettingDataType()
      .then((data) => {
        setDataTypes(data?.settingtypes);
      })
      .catch((err) => {
        setFormErrors(err.message);
      });
  }, []);

  useEffect(() => {
    let getdataById = async () => {
      const response = await axios.get(
        `${MAIN_URL}/api/organizations/${org.organization_id}/setting/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let settingData = response.data.setting;
      
      // Set the form data for the specific setting type
      setFormDataByType(prev => ({
        ...prev,
        [settingData.organization_setting_type_id]: settingData
      }));
      
      // Expand the accordion for this setting type
      setExpanded(settingData.organization_setting_type_id);
      setLoading(false);
    };
    if (mode === "edit" && id) {
      setLoading(true);
      getdataById();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    if (!expanded) return;
    
    const { name, value, type, checked } = e.target;
    const updatedValue =
      type === "checkbox" || type === "switch" ? checked : value;

    setFormDataByType(prev => ({
      ...prev,
      [expanded]: {
        ...prev[expanded],
        [name]: updatedValue,
        ...(name === "predefined_values" && {
          setting_value: value.toLowerCase(),
        }),
      }
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};
    const currentData = getCurrentFormData();

    if (!currentData.organization_setting_type_id)
      errors.organization_setting_type_id = "Setting Type is required.";

    if (!currentData.setting_name)
      errors.setting_name = "Setting Name is required.";

    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setbtnLoading(true);

    const currentData = getCurrentFormData();

    try {
      if (mode === "edit") {
        await axios.put(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/setting/${id}`,
          currentData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/setting`,
          currentData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast.success(
        mode === "edit"
          ? "Organization Setting updated!"
          : "Organization Setting created!"
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

  const currentFormData = getCurrentFormData();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box 
        sx={{
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, sm: 4 },
          py: 4,
          '& .MuiGrid-root': {
            maxWidth: '100%',
            width: '100%',
          }
        }}
      >
        <Header
          mode={mode}
          updateMessage={"Organization Setting"}
          addMessage={"Organization Setting"}
          homeLink={"/organization/settings"}
          homeText={"Organization Settings"}
        />
        {loading ? (
          <Grid container spacing={2}>
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : (
          <Grid container spacing={2} sx={{ maxWidth: '100% !important', margin: 0 }}>
            <Grid item xs={12} sx={{ maxWidth: '100% !important', padding: '0 !important' }}>
              {settingType.map((type) => (
                <Accordion
                  key={type.organization_setting_type_id}
                  expanded={expanded === type.organization_setting_type_id}
                  onChange={handleAccordionChange(
                    type.organization_setting_type_id
                  )}
                  sx={{
                    width: '100%',
                    mb: 1,
                    "&:before": {
                      display: "none",
                    },
                    borderRadius: "4px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                    border: "1px solid #e0e0e0",
                    "&:first-of-type": {
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                    },
                    "&:last-of-type": {
                      borderBottomLeftRadius: "4px",
                      borderBottomRightRadius: "4px",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${type.organization_setting_type_id}-content`}
                    id={`panel${type.organization_setting_type_id}-header`}
                    sx={{
                      width: '100%',
                      backgroundColor: "white",
                      borderBottom:
                        expanded === type.organization_setting_type_id
                          ? "1px solid #e0e0e0"
                          : "none",
                      minHeight: "64px",
                      "& .MuiAccordionSummary-content": {
                        my: 1.5,
                      },
                      "& .MuiAccordionSummary-expandIconWrapper": {
                        transform:
                          expanded === type.organization_setting_type_id
                            ? "rotate(180deg)"
                            : "none",
                        transition: "transform 0.2s",
                        color: "#666",
                      },
                      "&:hover": {
                        backgroundColor: "#fafafa",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      {type.setting_type_name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ width: '100%', p: 3, backgroundColor: "#fafafa" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        width: '100%',
                        p: 3,
                        backgroundColor: "white",
                        borderRadius: "4px",
                        "& .MuiGrid-item": {
                          mt: 2,
                        },
                        "& .MuiTextField-root": {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "4px",
                            backgroundColor: "white",
                          },
                        },
                        "& .MuiFormControl-root": {
                          width: "100%",
                        },
                      }}
                    >
                      <Grid
                        container
                        spacing={3}
                        sx={{
                          width: '100%',
                          maxWidth: '100%',
                          margin: '0 !important',
                          "& .MuiTextField-root": {
                            mb: 3,
                            width: '100%',
                          },
                          "& .MuiFormControlLabel-root": {
                            mb: 2,
                            width: '100%',
                          },
                          "& .MuiGrid-item": {
                            display: "flex",
                            flexDirection: "column",
                            width: '100%',
                            maxWidth: '100%',
                            padding: '16px !important',
                          },
                        }}
                      >
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Setting Name"
                            name="setting_name"
                            value={currentFormData.setting_name}
                            onChange={handleChange}
                            error={!!formErrors.setting_name}
                            helperText={formErrors.setting_name}
                            required
                            inputProps={{ maxLength: 100 }}
                            sx={{
                              mb: 3,
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                          <TextField
                            select
                            fullWidth
                            label="Setting Type"
                            name="organization_setting_type_id"
                            value={currentFormData?.organization_setting_type_id}
                            onChange={handleChange}
                            error={!!formErrors.organization_setting_type_id}
                            helperText={formErrors.organization_setting_type_id}
                            required
                            disabled // This should be disabled since it's already set by accordion selection
                          >
                            {settingType?.map((option) => (
                              <MenuItem
                                key={option.organization_setting_type_id}
                                value={option.organization_setting_type_id}
                              >
                                {option?.setting_type_name}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            select
                            fullWidth
                            label="Predefined Values"
                            name="predefined_values"
                            value={currentFormData.predefined_values}
                            onChange={handleChange}
                            error={!!formErrors.predefined_values}
                            helperText={formErrors.predefined_values}
                            required
                          >
                            <MenuItem value="manager">manager</MenuItem>
                            <MenuItem value="self">self</MenuItem>
                          </TextField>
                          <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            onClick={handleSubmit}
                            disabled={loading || btnLoading || !expanded}
                            sx={{
                              borderRadius: 2,
                              minWidth: 120,
                              textTransform: "capitalize",
                              fontWeight: 500,
                            }}
                          >
                            {loading || btnLoading ? (
                              <CircularProgress
                                size={22}
                                sx={{ color: "#fff" }}
                              />
                            ) : mode === "edit" ? (
                              "Update"
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
        )}
      </Box>
    </LocalizationProvider>
  );
}

export default SettingForm;