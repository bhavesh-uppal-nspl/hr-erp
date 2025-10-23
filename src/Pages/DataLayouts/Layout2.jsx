import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Layout2({
  loading,
  heading,
  Route,
  btnName,
  Data,
  setData,
  Icons,
  messages,
  DeleteFunc,
}) {
  const theme = useTheme();

  let navigate = useNavigate();

  const [deleteDialog, setDeleteDialog] = useState(null);

 const handleDeleteConfirm = async () => {
  try {
    await DeleteFunc(deleteDialog); 
    setData((prev) => prev.filter((a) => a.id !== deleteDialog));
    toast.success(`${messages[3]} deleted successfully`);
  } catch (e) {
    toast.error("Error deleting the item.");
  } finally {
    setDeleteDialog(null);
  }
};

  return (
    <Box p={4} minHeight={"100vh"}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" fontWeight={600}>
              {heading}
            </Typography>
            {Data?.length > 0 && (
              <Button
                variant="contained"
                onClick={() => navigate(`${Route}/add`)}
                sx={{ borderRadius: 2 }}
              >
                {btnName}
              </Button>
            )}
          </Box>

          {Data?.length === 0 ? (
            <Card
              elevation={2}
              sx={{
                textAlign: "center",
                p: 5,
                maxWidth: 500,
                mx: "auto",
                mt: 10,
                borderRadius: 3,
              }}
            >
              {Icons[0]}
              <Typography variant="h6" gutterBottom>
                No {messages[0]} added yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Get started by adding your first {messages[1]}.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(`${Route}/add`)}
              >
                {messages[2]}
              </Button>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {Data?.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      p: 2,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.background.paper
                          : theme.palette.grey[100],
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0px 4px 12px rgba(255, 255, 255, 0.1)"
                          : "0px 4px 12px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0px 6px 18px rgba(255, 255, 255, 0.15)"
                            : "0px 6px 18px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        mb={1}
                      >
                        {Icons[1]}
                        <Typography variant="h6" fontWeight={600}>
                          {item.name}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        {Icons[2]}
                        <Typography
                          variant="body2"
                          sx={{ marginBottom: "-8px !important" }}
                          color="text.secondary"
                        >
                          {item.description}
                        </Typography>
                      </Stack>

                       <Stack direction="row" spacing={1} alignItems="center">
                        {Icons[3]}
                        <Typography
                          variant="body2"
                          sx={{ marginBottom: "-8px !important" }}
                          color="text.secondary"
                        >
                          {item.info}
                        </Typography>
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          fullWidth
                          onClick={() => navigate(`${Route}/edit/${item.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          fullWidth
                          onClick={() => setDeleteDialog(item.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Delete Confirmation */}
          <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this {messages[3]}?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
              <Button color="error" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export default Layout2;
