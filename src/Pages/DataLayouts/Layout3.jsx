// Layout1.jsx
import React, { useState } from "react";
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

const Layout3 = ({
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
  onAddBtClick,
  onEditBtClick,
}) => {
  console.log("table ", tableHeaders);

  const navigate = useNavigate();
  const [view, setView] = useState("table");
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(6);

  const confirmDelete = async () => {
    await DeleteFunc(deleteDialog).catch(() => toast.error("Delete failed"));
    setData((prev) => prev.filter((i) => i.id !== deleteDialog));
    toast.success(`${messages[3]} deleted`);
    setDeleteDialog(null);
  };

  const changeView = (_, v) => v && setView(v);

  return (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            padding="0 25px"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5">{heading}</Typography>
            <Box display="flex" gap={1} alignItems="center">
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={changeView}
                size="small"
              >
                <ToggleButton value="table">
                  <TableRowsIcon />
                </ToggleButton>
                <ToggleButton value="card">
                  <ViewModuleIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="contained"
                onClick={() => {
                  onAddBtClick();
                  navigate(`${Route}/add`);
                }}
              >
                {btnName}
              </Button>
            </Box>
          </Box>
          </>
          )
};

export default Layout3;
