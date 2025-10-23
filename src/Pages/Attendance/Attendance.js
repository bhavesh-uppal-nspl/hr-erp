import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  Box,
  Typography,
  Paper,
  InputAdornment,
  useTheme,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";

const mockData = [
  {
    id: 1,
    date: "2025-04-01",
    checkIn: "09:00 AM",
    breakStart: "12:30 PM",
    breakEnd: "01:00 PM",
    checkOut: "06:00 PM",
    status: "Present",
    remarks: "On time",
  },
  {
    id: 2,
    date: "2025-04-02",
    checkIn: "-",
    breakStart: "-",
    breakEnd: "-",
    checkOut: "-",
    status: "Half Day Leave",
    remarks: "Medical",
  },
  {
    id: 3,
    date: "2025-04-03",
    checkIn: "09:15 AM",
    breakStart: "01:00 PM",
    breakEnd: "01:30 PM",
    checkOut: "06:30 PM",
    status: "Present",
    remarks: "Late check-in",
  },
];

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "date", headerName: "Date", width: 130 },
  { field: "checkIn", headerName: "Check-In", width: 120 },
  { field: "breakStart", headerName: "Break Start", width: 130 },
  { field: "breakEnd", headerName: "Break End", width: 130 },
  { field: "checkOut", headerName: "Check-Out", width: 120 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "remarks", headerName: "Remarks", flex: 1 },
];

function Attendance() {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(mockData);
  const [status, setStatus] = useState("Present");
  const [remarks, setRemarks] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const lowercased = searchText.toLowerCase();
    const filtered = mockData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(lowercased)
      )
    );
    setFilteredData(filtered);
  }, [searchText]);

  const handleMarkAttendance = () => {
    const today = dayjs().format("YYYY-MM-DD");
    const now = dayjs();

    const newRecord = {
      id: filteredData?.length + 1,
      date: today,
      checkIn: now.format("hh:mm A"),
      breakStart: "-",
      breakEnd: "-",
      checkOut: "-",
      status,
      remarks,
    };

    const updatedData = [...filteredData, newRecord];
    setFilteredData(updatedData);
    setRemarks("");
    setStatus("Present");
  };

  const handleFilterClick = () => {
    alert("Open your custom Filter options here");
  };

  const handleManageColumnsClick = () => {
    alert("Open your custom Manage Columns settings here");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={4}
        sx={{ width: "100%", maxWidth: 1200, padding: 4, borderRadius: 4 }}
      >
        <Typography variant="h5" mb={3} fontWeight="bold">
          Attendance Tracker
        </Typography>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Search Attendance"
              variant="outlined"
              fullWidth
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={3} alignItems={"center"}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Half Day Leave">Half Day Leave</MenuItem>
                <MenuItem value="Full Day Leave">Full Day Leave</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Remarks"
              variant="outlined"
              fullWidth
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleMarkAttendance}
            >
              Mark Attendance
            </Button>
          </Grid>
        </Grid>

        {/* Custom Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 1 }}>
          <Button variant="outlined" onClick={handleFilterClick}>
            Filter
          </Button>
          <Button variant="outlined" onClick={handleManageColumnsClick}>
            Manage Columns
          </Button>
        </Box>

        {/* Table */}
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            pagination
            disableSelectionOnClick
            disableColumnMenu // <- hides the sort asc/desc & column menu
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default Attendance;
