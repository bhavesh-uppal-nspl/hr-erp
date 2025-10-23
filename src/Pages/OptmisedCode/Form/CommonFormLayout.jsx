import React from "react";
import { Box, Paper, Grid, Button, CircularProgress } from "@mui/material";
import Header from "../../DataLayouts/Header";

export default function CommonFormLayout({
  mode,
  loading,
  btnLoading,
  headerProps,
  onSubmit,
  children,
}) {
  return (
    <Box px={4} py={4}>
      <Header {...headerProps} mode={mode} />

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper elevation={4} sx={{ p: 3 }}>
              <Grid container spacing={2}>{children}</Grid>

              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={onSubmit}
                disabled={loading || btnLoading}
                sx={{
                  borderRadius: 2,
                  minWidth: 120,
                  textTransform: "capitalize",
                  fontWeight: 500,
                  mt: 2,
                }}
              >
                {loading || btnLoading ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : mode === "edit" ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
