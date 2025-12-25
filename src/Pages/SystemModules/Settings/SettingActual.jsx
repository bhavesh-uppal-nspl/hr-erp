import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Button,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  fetchOrganizationSetting,
  fetchOrganizationSettingType,
} from "../../../Apis/OrganizationSetting-api";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { MAIN_URL } from "../../../Configurations/Urls";

export default function SettingActual() {
  const [settingsByType, setSettingsByType] = useState({});
  const [typeNames, setTypeNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const { userData } = useAuthStore();
  const org = userData?.organization;

  useEffect(() => {
    const fetchSettings = async () => {
      if (!org?.organization_id) return;
      setLoading(true);

      try {
        // Fetch organization settings
        const data = await fetchOrganizationSetting(org.organization_id);
        // Fetch all setting types for mapping type_id to name
        const typeData = await fetchOrganizationSettingType(); // Should return { settingtypes: { data: [{organization_setting_type_id, setting_type_name}] } }
        const typesArr = typeData?.settingtypes?.data || [];
        const typeNameMap = {};
        typesArr.forEach((t) => {
          typeNameMap[t.organization_setting_type_id] = t.setting_type_name;
        });
        setTypeNames(typeNameMap);

        // Group settings by organization_setting_type_id
        const grouped = {};
        data.settings.forEach((item) => {
          const typeId = item.organization_setting_type_id;
          if (!grouped[typeId]) grouped[typeId] = [];
          const predefinedArray = item.predefined_values
            ? item.predefined_values.split(",").map((v) => v.trim())
            : [];
          const selectedValue = item.setting_value || item.default_value || "";
          grouped[typeId].push({
            ...item,
            predefinedArray,
            selectedValue,
          });
        });
        setSettingsByType(grouped);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [org]);

  // const handlePredefinedChange = (settingId, value, typeId) => {
  //   setSettingsByType((prev) => {
  //     const updatedTypeGroup = (prev[typeId] || []).map((s) =>
  //       s.organization_setting_id === settingId
  //         ? { ...s, selectedValue: s.selectedValue === value ? "" : value }
  //         : s
  //     );
  //     return { ...prev, [typeId]: updatedTypeGroup };
  //   });

  //   setPendingChanges((prev) => ({
  //     ...prev,
  //     [settingId]: value,
  //   }));
  // };


  const handlePredefinedChange = (settingId, value, typeId) => {
  let newValue = "";
  
  setSettingsByType((prev) => {
    const updatedTypeGroup = (prev[typeId] || []).map((s) => {
      if (s.organization_setting_id === settingId) {
        newValue = s.selectedValue === value ? "" : value;
        return { ...s, selectedValue: newValue };
      }
      return s;
    });
    return { ...prev, [typeId]: updatedTypeGroup };
  });

  setPendingChanges((prev) => {
    const updated = { ...prev };
    if (newValue === "") {
      delete updated[settingId]; // Remove from pending if unchecked
    } else {
      updated[settingId] = newValue; // Add to pending if checked
    }
    return updated;
  });
};



  const handleSaveAllSettings = async () => {
    if (!confirmChecked) {
      toast.error("Please confirm the changes before saving!");
      return;
    }

    if (Object.keys(pendingChanges).length === 0) {
      toast.info("No changes to save!");
      return;
    }

    setSaving(true);
    try {
      const updatePromises = Object.entries(pendingChanges).map(
        ([settingId, value]) =>
          axios.put(
            `${MAIN_URL}/api/organizations/${org.organization_id}/setting/${settingId}`,
            { setting_value: value },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
      );

      await Promise.all(updatePromises);
      toast.success("All settings updated successfully!");
      setPendingChanges({});
      setConfirmChecked(false);
    } catch (err) {
      toast.error("Failed to update some settings!");
    } finally {
      setSaving(false);
    }
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa", py: 4 }}>
      <Box sx={{ maxWidth: 1000, mx: "auto", px: 3 }}>
        {/* Header Section */}
        <Card
          sx={{
            mb: 4,
            background: "#6B8DD6",
            color: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ py: 4 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <SettingsIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Organization Settings
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  Manage your organization preferences and configurations
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Settings Sections */}
            <Box sx={{ mb: 4 }}>
              {Object.entries(settingsByType).map(([typeId, group]) => (
                <Accordion
                  key={typeId}
                  expanded={expanded === typeId}
                  onChange={(_, isExpanded) =>
                    setExpanded(isExpanded ? typeId : false)
                  }
                  TransitionProps={{ unmountOnExit: true }}
                  sx={{
                    mb: 2,
                    borderRadius: "12px !important",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    "&:before": { display: "none" },
                    overflow: "hidden",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: "#fff",
                      borderBottom: expanded === typeId ? "1px solid #e0e0e0" : "none",
                      "&:hover": {
                        backgroundColor: "#fafafa",
                      },
                    }}
                  >
                    <Typography fontWeight={600} fontSize="1.1rem" color="#333">
                      {typeNames[typeId] || "Other Settings"}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: "#fafafa", p: 3 }}>
                    <Grid container spacing={3}>
                      {group.map((setting, index) => (
                        <React.Fragment key={setting.organization_setting_id}>
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                alignItems: { xs: "flex-start", md: "center" },
                                gap: 3,
                                p: 2.5,
                                backgroundColor: "#fff",
                                borderRadius: 2,
                                border: "1px solid #e8e8e8",
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  minWidth: "200px",
                                  color: "#2c3e50",
                                }}
                              >
                                {setting.setting_name}
                              </Typography>
                              {Array.isArray(setting.predefinedArray) &&
                              setting.predefinedArray.length > 0 ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 2,
                                    flexWrap: "wrap",
                                    flexGrow: 1,
                                  }}
                                >
                                  {setting.predefinedArray.map((val) => (
                                    <FormControlLabel
                                      key={val}
                                      control={
                                        <Checkbox
                                          checked={setting.selectedValue === val}
                                          onChange={() =>
                                            handlePredefinedChange(
                                              setting.organization_setting_id,
                                              val,
                                              typeId
                                            )
                                          }
                                          sx={{
                                            color: "#6B8DD6",
                                            "&.Mui-checked": {
                                              color: "#6B8DD6",
                                            },
                                          }}
                                        />
                                      }
                                      label={
                                        <Typography
                                          variant="body2"
                                          sx={{ fontWeight: 500 }}
                                        >
                                          {val}
                                        </Typography>
                                      }
                                      sx={{ minWidth: "140px" }}
                                    />
                                  ))}
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  fontStyle="italic"
                                >
                                  No predefined values available
                                </Typography>
                              )}
                            </Box>
                          </Grid>
                        </React.Fragment>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Confirmation Section */}
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                border: hasPendingChanges ? "2px solid #6B8DD6" : "1px solid #e0e0e0",
                transition: "all 0.3s ease",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Typography variant="h6" fontWeight={700} color="#2c3e50">
                    Confirm & Save Changes
                  </Typography>
                  {hasPendingChanges && (
                    <Box
                      sx={{
                        backgroundColor: "#6B8DD6",
                        color: "white",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {Object.keys(pendingChanges).length} Change(s) Pending
                    </Box>
                  )}
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Box
                  sx={{
                    backgroundColor: "#f8f9ff",
                    p: 2.5,
                    borderRadius: 2,
                    mb: 3,
                    border: "1px solid #e8eaff",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={confirmChecked}
                        onChange={(e) => setConfirmChecked(e.target.checked)}
                        sx={{
                          color: "#6B8DD6",
                          "&.Mui-checked": {
                            color: "#6B8DD6",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body1" fontWeight={500} color="#2c3e50">
                        I confirm that I want to save all the changes made to the
                        settings above
                      </Typography>
                    }
                  />
                </Box>

                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      setPendingChanges({});
                      setConfirmChecked(false);
                      window.location.reload();
                    }}
                    disabled={saving || !hasPendingChanges}
                    sx={{
                      borderColor: "#e0e0e0",
                      color: "#666",
                      px: 3,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#666",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={saving ? null : <SaveIcon />}
                    onClick={handleSaveAllSettings}
                    disabled={!confirmChecked || saving}
                    sx={{
                      background: "#6B8DD6",
                      px: 4,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px rgba(107, 141, 214, 0.4)",
                      "&:hover": {
                        boxShadow: "0 6px 16px rgba(107, 141, 214, 0.5)",
                        background: "#5a7bc5",
                      },
                      "&:disabled": {
                        background: "#e0e0e0",
                        color: "#999",
                      },
                    }}
                  >
                    {saving ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Save All Settings"
                    )}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
}