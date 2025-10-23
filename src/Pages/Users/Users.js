import React, { useState, useEffect } from "react";
import { createTheme } from "react-data-table-component";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Stack,
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import TableRowsIcon from "@mui/icons-material/TableRows";
import { getOrganizationUser } from "../../Apis/Organization-User";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import axios from "axios";
import {   MAIN_URL } from "../../Configurations/Urls";
import usePermissionDataStore from "../../Zustand/Store/usePermissionDataStore";
import NotAllowed from "../../Exceptions/NotAllowed";

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [filterStatus, setFilterStatus] = useState("all");
  const [view, setView] = useState("table"); // table, card, list
  const [deleteDialog, setDeleteDialog] = useState(null);
    const { Permission, setPermission } = usePermissionDataStore();
const [showNotAllowed, setShowNotAllowed]=useState(false)
  const navigate = useNavigate();

  const handleDeleteConfirm = async () => {
    if (!deleteDialog) return;
    const permissionArray = Object.values(Permission);
    if (!permissionArray.includes("USER_DELETE")) {
      setShowNotAllowed(true);
      return;
    }

    try {
      // Call the delete API
      await axios.delete(
        `${MAIN_URL}/api/organizations/${org.organization_id}/user/${deleteDialog}`,  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );

      // Remove user from local state after successful deletion
      setUsers((prev) =>
        prev.filter((u) => u.organization_user_id !== deleteDialog)
      );
      setDeleteDialog(null);
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        const validationErrors =
          err.response.data.messages ||
          err.response.data.error ||
          "Validation failed.";
        toast.error(
          Array.isArray(validationErrors)
            ? validationErrors.join(" ")
            : validationErrors
        );
      } else {
        toast.error("Something went wrong while deleting user.");
        setDeleteDialog(null);
      }
    }
  };




  const ToggleStatusTable = async (user, newStatus) => {
  try {

    console.log("roww is s", user);
    
    const response = await axios.put(
      `${MAIN_URL}/api/organizations/${org.organization_id}/user/${user.organization_user_id}/toggle`,
      { is_active: newStatus },  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
    );

    // Optionally show a success toast
    toast.success(`User status updated to ${newStatus ? 'Active' : 'Inactive'}`);
    setFilteredUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.organization_user_id === user.organization_user_id
          ? { ...u, is_active: newStatus }
          : u
      )
    );

    
  } catch (error) {
    console.error("Failed to update user status", error);
    toast.error("Failed to update user status");
  }
};

  const ToggleStatus = async (userId, is_active, id) => {
    console.log("userid", userId);
    console.log("New Status:", is_active);
    try {
      const response = await axios.put(
        `${MAIN_URL}/api/organizations/${org.organization_id}/user/${userId}`,
        { is_active },  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      );

      let a = [...users];
      a[id].is_active = is_active;
      setFilteredUsers(a);

      toast.success("User status updated.");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.error ||
        "An error occurred while updating status.";
      toast.error(message);
    }
  };

useEffect(() => {

  if (!org?.organization_id) return;
  setLoading(true);

  const fetchUsers = async () => {
    try {
      const data = await getOrganizationUser(org?.organization_id, search, filterStatus);
      console.log("data is ", data)
      setFilteredUsers(data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchUsers();
}, [org?.organization_id]);

useEffect(() => {
  if (!org?.organization_id) return;
  const fetchUsers = async () => {
    try {
   
       const data = await getOrganizationUser(org?.organization_id);
      console.log("saysgugugugugugs", data)
      setFilteredUsers(data?.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };
  fetchUsers();
}, [search, filterStatus, org?.organization_id]);





  const columns = [
    {
      name: "Name",
      width: "300px",
      selector: (row) => row?.applicationuser[0]?.full_name?.toUpperCase(),
      sortable: true,
    },
    { name: "Email", width: "290px", selector: (row) => row?.applicationuser[0]?.email},
    { name: "Phone", width: "290px", selector: (row) => row?.applicationuser[0]?.phone_number },
    {
      name: "Role",
      width: "200px",
      selector: (row) => row?.role_assignment?.application_user_role?.user_role_name,
    },
    {
      name: "User Type",
      width: "200px",
      selector: (row) => row?.user_types?.user_type_name,
    },
    {
      name: "Status",
      width: "100px",
      cell: (row) => (
        <Typography color={row.is_active ? "green" : "red"}>
          {row.is_active ? "Active" : "Inactive"}
        </Typography>
      ),
    },
    {
      name: "Actions",
      width: "180px",
      cell: (row) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="primary"
            onClick={() => navigate(`/users/edit/${row.organization_user_id}`)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color={row.is_active ? "success" : "default"}
            onClick={() => ToggleStatusTable(row, !row.is_active)}
          >
            <PowerSettingsNewIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => setDeleteDialog(row.organization_user_id)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

if(showNotAllowed)
{
  return <NotAllowed/>
}
  return (
    <Box p={4} minHeight="100%">
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
              Users Management
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(`/users/add`)}
              sx={{ borderRadius: 2 }}
            >
              Add User
            </Button>
          </Box>

          {/* Search, Filter & View Controls */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            mb={3}
            alignItems="center"
          >
            <TextField
              size="small"
              label="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              size="small"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => setView("table")}
                color={view === "table" ? "primary" : "default"}
              >
                <TableRowsIcon />
              </IconButton>
              <IconButton
                onClick={() => setView("card")}
                color={view === "card" ? "primary" : "default"}
              >
                <ViewModuleIcon />
              </IconButton>
              <IconButton
                onClick={() => setView("list")}
                color={view === "list" ? "primary" : "default"}
              >
                <ViewListIcon />
              </IconButton>
            </Stack>
          </Stack>

          {/* Views */}
          {view === "table" && (
            <DataTable
              columns={columns}
              data={filteredUsers}
              pagination
              highlightOnHover
              striped
              theme="muiTheme"
              customStyles={{
                headCells: {
                  style: {
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                  },
                },
                rows: {
                  style: {
                    fontSize: "14px",
                  },
                },
              }}
            />
          )}

          {view === "card" && (
            <Grid container spacing={2}>
              {filteredUsers.map((user, id) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={user.organization_user_id}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{user?.applicationuser[0]?.full_name}</Typography>
                      <Typography style={{marginTop:"2px"}} variant="body2">{user?.applicationuser[0]?.email}</Typography>
                      <Typography style={{marginTop:"2px"}} variant="body2">{user?.applicationuser[0]?.phone_number}</Typography>
                      <Typography style={{marginTop:"2px"}} variant="body2">
                        {user?.role?.system_role_name || "Admin"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={user.is_active ? "green" : "red"}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </Typography>

                      <Stack direction="row" spacing={1} mt={2}>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/users/edit/${user.organization_user_id}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color={user.is_active ? "success" : "default"}
                          onClick={() =>
                            ToggleStatus(
                              user.organization_user_id,
                              !user.is_active,
                              id
                            )
                          }
                        >
                          <PowerSettingsNewIcon />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() =>
                            setDeleteDialog(user.organization_user_id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {view === "list" && (
            <Box >
              {filteredUsers.map((user,id) => (
                <Box
                  key={user.organization_user_id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  border="1px solid #ddd"
                  borderRadius={2}
                  mb={1}
                >
                  <Box>
                    <Typography fontWeight={600}>{user?.applicationuser[0]?.full_name}</Typography>
                    <Typography variant="body2">{user?.applicationuser[0]?.email}</Typography>
                    <Typography variant="body2">{user?.applicationuser[0]?.phone_number}</Typography>
                    <Typography variant="body2">
                      {user?.role?.system_role_name || "Admin"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={user.is_active ? "green" : "red"}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/users/edit/${user.organization_user_id}`)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color={user.is_active ? "success" : "default"}
                      onClick={() =>
                        ToggleStatus(user.organization_user_id, !user.is_active,id)
                      }
                    >
                      <PowerSettingsNewIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setDeleteDialog(user.organization_user_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Box>
              ))}
            </Box>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this user?
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

export default Users;

