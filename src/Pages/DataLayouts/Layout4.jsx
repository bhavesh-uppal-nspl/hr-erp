// Layout1.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
} from "@mui/material";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import usePermissionDataStore from "../../Zustand/Store/usePermissionDataStore";
import NotAllowed from "../../Exceptions/NotAllowed";
import { Bold } from "lucide-react";

const Layout4 = ({
  loading,
  heading,
  Route,
  btnName,
  Data,
  tableHeaders,
  setData,
  Icons,
  messages,
  DeleteFunc,
  showActions,
  showHeaders,
  delete_action,
  add_action,
}) => {
  const navigate = useNavigate();
  const [view, setView] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const { Permission, setPermission } = usePermissionDataStore();

  // Check if user has ADD permission
  const hasAddPermission = useMemo(() => {
    // If no add_action specified, show button by default
    if (!add_action) {
      return true;
    }
    // Check if permission exists in Permission array
    return Permission && Array.isArray(Permission) && Permission.includes(add_action);
  }, [add_action, Permission]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(6);
  const [showNotAllowed, setShowNotAllowed] = useState(false);

  const offset = page * perPage;
  const current = Data?.slice(offset, offset + perPage);
  const totalPages = Math.ceil(Data?.length / perPage);

  const confirmDelete = async () => {
    const permissionArray = Object.values(Permission);
    if (!permissionArray.includes(delete_action)) {
      setDeleteDialog(null);
      setShowNotAllowed(true);
      return;
    }
    await DeleteFunc(deleteDialog).catch(() => toast.error("Delete failed"));
    setData((prev) => prev.filter((i) => i.id !== deleteDialog));
    toast.success(`${messages[3]} deleted`);
    setDeleteDialog(null);
  };

  const changeView = (_, v) => v && setView(v);
  const changePage = (delta) => {
    const np = page + delta;
    if (np >= 0 && np < totalPages) setPage(np);
  };

  if (showNotAllowed) {
    return <NotAllowed />;
  }

  return (
    <Box p={4}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={-3}
          >
            <Typography  fontWeight="bold" variant="h5">{heading}</Typography>
            <Box display="flex" gap={1} alignItems="center">
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={changeView}
                size="small"
              ></ToggleButtonGroup>
              {btnName && hasAddPermission && (
                <Button
                  variant="contained"
                  onClick={() => navigate(`${Route}/add`)}
                >
                  {btnName}
                </Button>
              )}
            </Box>
          </Box>

          {/* <TextField
            placeholder="Search by name..."
            fullWidth
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ mb: 3 }}
          /> */}

          {/* {!Data?.length ? (
            <Box textAlign="center" mt={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No results found for “{search}”
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Try adjusting your search or&nbsp;
                <Button size="small" onClick={() => navigate(`${Route}/add`)}>
                  Add {messages[1]}
                </Button>
                .
              </Typography>
            </Box>
          ) : view === "card" ? (
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit,minmax(250px,1fr))"
              gap={2}
            >
              {current.map((i) => (
                <Box
                  key={i.id}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    height: 240,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "transform .2s",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Box>
                    <Typography variant="h6">{i.cardname}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {i.carddescription}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      onClick={() => navigate(`${Route}/edit/${i.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => setDeleteDialog(i.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box component="ul" sx={{ p: 0, listStyle: "none" }}>
              {current.map((i) => (
                <Box
                  component="li"
                  key={i.id}
                  sx={{
                    borderBottom: "1px solid #eee",
                    py: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">{i.cardname}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {i.carddescription}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      onClick={() => navigate(`${Route}/edit/${i.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => setDeleteDialog(i.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )} */}

          {/* Shared Pagination */}
          {/* {Data?.length > perPage && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
              mt={3}
            >
              <Button disabled={page === 0} onClick={() => changePage(-1)}>
                Previous
              </Button>
              <Typography>
                Page {page + 1} of {totalPages}
              </Typography>
              <Button
                disabled={page + 1 === totalPages}
                onClick={() => changePage(1)}
              >
                Next
              </Button>
            </Box>
          )} */}
          {/* 
          <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this {messages[3]}?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
              <Button color="error" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog> */}
        </>
      )}
    </Box>
  );
};

export default Layout4;
