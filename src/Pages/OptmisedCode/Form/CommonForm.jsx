import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  FormControl,
  Box,
  Button,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
import axios from "axios";
import useFormHandler from "../useFormHandler";
import CommonFormLayout from "./CommonFormLayout";
import { MAIN_URL } from "../../../Configurations/Urls";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

function CommonForm({
  validateForm,
  baseUrl,
  initialData,
  successMessages,
  redirectPath,
  headerProps,
  Inputs,
  DataFetchers,
}) {
  const {
    mode,
    formData,
    setFormData,
    formErrors,
    handleSubmit,
    loading,
    btnLoading,
    userData,
    handleChange,
    handleChangeImage,
    handleFileChange,
    handleRemoveFile,
    handlePreview,
  } = useFormHandler({
    baseUrl,
    initialData,
    validateForm,
    successMessages,
    redirectPath,
  });

  const [selectOptions, setSelectOptions] = useState({});
  const token = localStorage.getItem("token");
  const organizationId = userData?.organization?.organization_id;

  let addorg = (url) => {
    let d = url.split("${org_id}");
    let finalurl = `${d[0]}${organizationId}${d[1]}`;
    return finalurl;
  };
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const results = await Promise.all(
          DataFetchers?.map(async (fetcher) => {
            if (fetcher.Type === "Fetch") {
              const res = await axios.get(
                `${MAIN_URL}${addorg(fetcher.link)}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                  // params: { per_page: "all", organization_id: organizationId },
                }
              );
              return {
                [fetcher.name]:
                  res.data.data ||
                  res.data.countries ||
                  res.data.states ||
                  res.data.cities ||
                  res.data?.status?.data ||
                  [],
              };
            } else if (fetcher.Type === "NoFetch") {
              return { [fetcher.name]: fetcher.Options || [] };
            } else {
              return { [fetcher.name]: [] };
            }
          })
        );

        const merged = results.reduce((acc, cur) => ({ ...acc, ...cur }), {});
        setSelectOptions(merged);
      } catch (err) {
        console.error("Error fetching DataFetchers:", err);
      }
    };

    if (DataFetchers?.length > 0 && token && organizationId) fetchInitialData();
  }, [DataFetchers, token, organizationId]);

  const fetchDependentData = async (fetcher) => {
    try {
      const dependKey = fetcher.dependKey;
      const dependValue = formData[dependKey];

      if (!dependValue) {
        setSelectOptions((prev) => ({ ...prev, [fetcher.name]: [] }));
        return;
      }

      const dynamicLink = fetcher.link
        .replace("${country_id}", formData.country_id || "")
        .replace("${state_id}", formData.state_id || "");

      const res = await axios.get(`${MAIN_URL}${dynamicLink}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { per_page: "all", organization_id: organizationId },
      });

      console.log("res.data.data is : ", res.data.data);

      setSelectOptions((prev) => ({
        ...prev,
        [fetcher.name]: res.data.data || [],
      }));
    } catch (error) {
      console.error(
        `Failed to fetch dependent data for ${fetcher.name}:`,
        error
      );
    }
  };

  useEffect(() => {
    if (!DataFetchers?.length) return;

    DataFetchers.forEach((fetcher) => {
      if (fetcher.Type === "FetchDepend") {
        const dependKey = fetcher.dependKey;

        if (formData[dependKey]) {
          fetchDependentData(fetcher);
        } else {
          setSelectOptions((prev) => ({ ...prev, [fetcher.name]: [] }));
        }
      }
    });
  }, [formData.country_id, formData.state_id]);

  return (
    <CommonFormLayout
      mode={mode}
      loading={loading}
      btnLoading={btnLoading}
      onSubmit={handleSubmit}
      headerProps={headerProps}
    >
      {Inputs?.map((item, idx) => {
        if (item.type == "Select") {
          return (
            <TextField
              select
              fullWidth
              label={item.label}
              name={item.mainKey}
              value={formData?.[item.mainKey]}
              onChange={handleChange}
              error={!!formErrors?.[item.mainKey]}
              helperText={formErrors?.[item.mainKey]}
              disabled={selectOptions?.[item.OptionMainKey]?.length == 0}
            >
              {selectOptions?.[item.OptionMainKey]?.map((a) => (
                <MenuItem
                  key={item.menuKey == null ? a : a?.[item.menuKey]}
                  value={item.menuKey == null ? a : a?.[item.menuKey]}
                >
                  {item.formatValue(a)}
                </MenuItem>
              ))}
            </TextField>
          );
        } else if (item.type == "Text") {
          return (
            <TextField
              fullWidth
              label={item.label}
              name={item.mainKey}
              value={formData?.[item?.mainKey]}
              onChange={handleChange}
              error={!!formErrors?.[item?.mainKey]}
              helperText={formErrors?.[item?.mainKey]}
            />
          );
        } else if (item.type == "Date") {
          return (
            <TextField
              fullWidth
              type="date"
              label={item.label}
              name={item.mainKey}
              value={formData?.[item?.mainKey]}
              onChange={handleChange}
              error={!!formErrors?.[item?.mainKey]}
              helperText={formErrors?.[item?.mainKey]}
              InputLabelProps={{ shrink: true }}
            />
          );
        } else if (item.type == "Time") {
          return (
            <TextField
              fullWidth
              type="time"
              label={item.label}
              name={item.mainKey}
              value={formData?.[item?.mainKey]}
              onChange={handleChange}
              error={!!formErrors?.[item?.mainKey]}
              helperText={formErrors?.[item?.mainKey]}
              InputLabelProps={{ shrink: true }}
            />
          );
        } else if (item.type == "Number") {
          return (
            <TextField
              fullWidth
              type="number"
              label={item.label}
              name={item.mainKey}
              value={formData?.[item?.mainKey]}
              onChange={handleChange}
              error={!!formErrors?.[item?.mainKey]}
              helperText={formErrors?.[item?.mainKey]}
            />
          );
        } else if (item.type == "MultiRow") {
          return (
            <TextField
              fullWidth
              label={item.label}
              name={item.mainKey}
              value={formData?.[item?.mainKey]}
              onChange={handleChange}
              error={!!formErrors?.[item?.mainKey]}
              helperText={formErrors?.[item?.mainKey]}
              multiline
              rows={3}
            />
          );
        } else if (item.type === "Picture") {
          const file = formData?.[item.mainKey];
          return (
            <Box
              key={idx}
              display="flex"
              flexDirection="column"
              alignItems="center"
              py={1}
            >
              <Avatar
                src={
                  file instanceof File
                    ? URL.createObjectURL(file)
                    : file
                      ? `${file}`
                      : ""
                }
                alt="Profile"
                sx={{ width: 96, height: 96 }}
              />

              <Button
                variant="outlined"
                component="label"
                size="small"
                sx={{ mt: 1, textTransform: "none" }}
              >
                {mode === "edit" ? "Edit Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    handleChangeImage(item.mainKey, e.target.files[0])
                  }
                />
              </Button>
              {formErrors?.[item.mainKey] && (
                <FormHelperText error>
                  {formErrors?.[item.mainKey]}
                </FormHelperText>
              )}
            </Box>
          );
        } else if (item.type === "File") {
          const file = formData?.[item.mainKey];
          return (
            <Box
              key={idx}
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    py: 1,
                    borderRadius: 2,
                    flexGrow: 1,
                  }}
                >
                  {file ? `Change ${item.label}` : `Choose ${item.label}`}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleFileChange(e, item.mainKey)}
                  />
                </Button>

                {file && (
                  <>
                    <IconButton
                      size="small"
                      onClick={() => handlePreview(file)}
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        "&:hover": { backgroundColor: "#bbdefb" },
                        border: "1px solid #ddd",
                        width: 32,
                        height: 32,
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFile(item.mainKey)}
                      sx={{
                        backgroundColor: "#f5f5f5",
                        "&:hover": {
                          backgroundColor: "#e57373",
                          color: "#fff",
                        },
                        border: "1px solid #ddd",
                        width: 32,
                        height: 32,
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>

              {file && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#2e7d32",
                    fontWeight: 500,
                    mt: 0.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Selected: {file.name}
                </Typography>
              )}
              {formErrors?.[item.mainKey] && (
                <FormHelperText error>
                  {formErrors?.[item.mainKey]}
                </FormHelperText>
              )}
            </Box>
          );
        } else if (item.type === "DateTime") {
          return (
            <TextField
              fullWidth
              type="datetime-local"
              label={item.label}
              name={item.mainKey}
              value={formData?.[item?.mainKey] || ""}
              onChange={handleChange}
              error={!!formErrors?.[item?.mainKey]}
              helperText={formErrors?.[item?.mainKey]}
              InputLabelProps={{ shrink: true }}
            />
          );
        } else if (item.type === "Checkbox") {
          return (
            <FormControl
              key={idx}
              error={!!formErrors?.[item.mainKey]}
              component="fieldset"
              sx={{ mb: 2 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!formData?.[item.mainKey]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [item.mainKey]: e.target.checked,
                      }))
                    }
                    name={item.mainKey}
                  />
                }
                label={item.label}
              />
              {formErrors?.[item.mainKey] && (
                <FormHelperText>{formErrors[item.mainKey]}</FormHelperText>
              )}
            </FormControl>
          );
        }
      })}
    </CommonFormLayout>
  );
}

export default CommonForm;
