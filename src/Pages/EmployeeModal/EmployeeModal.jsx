"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Avatar,
  Chip,
  Grid,
  IconButton,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { ViewModule, ViewList, Close, Email, Phone, Work, CalendarToday } from "@mui/icons-material"

const getInitials = (firstName, lastName) => {
  const first = firstName && typeof firstName === "string" ? firstName.charAt(0).toUpperCase() : "?"
  const last = lastName && typeof lastName === "string" ? lastName.charAt(0).toUpperCase() : "?"
  return `${first}${last}`
}

const EmployeeCards = ({ employees }) => {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {employees.map((employee) => (
        <Grid item xs={12} sm={6} md={4} key={employee.employee_id}>
          <Card
            sx={{
              height: "100%",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    mr: 2,
                    bgcolor: "#1976d2",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  {getInitials(employee.first_name, employee.last_name)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
                    {`${employee.first_name || ""} ${employee.last_name || ""}`.trim() || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {employee.employee_id}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {employee.email && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Email sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                      {employee.email}
                    </Typography>
                  </Box>
                )}

                {employee.phone && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                      {employee.phone}
                    </Typography>
                  </Box>
                )}

                {employee.designation && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Work sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                      {employee.designation}
                    </Typography>
                  </Box>
                )}

                {employee.department && (
                  <Chip
                    label={employee.department}
                    size="small"
                    variant="outlined"
                    sx={{ alignSelf: "flex-start", mt: 1 }}
                  />
                )}

                {employee.joining_date && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                      Joined: {new Date(employee.joining_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default function EmployeeModal({ open, onClose, widgetType, apiBaseUrl, organizationId }) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("cards")

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${apiBaseUrl}/organizations/${organizationId}/filter-employee`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Handle nested array structure [[employees]] or [employees]
      let processedEmployees = []
      if (Array.isArray(data)) {
        if (data?.length > 0 && Array.isArray(data[0])) {
          // Nested array structure [[employees]]
          processedEmployees = data[0]
        } else {
          // Direct array structure [employees]
          processedEmployees = data
        }
      } else if (data && data.employees) {
        processedEmployees = Array.isArray(data.employees) ? data.employees : []
      }

      setEmployees(processedEmployees)
    } catch (err) {
      console.error("Error fetching employees:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchEmployees()
    }
  }, [open, apiBaseUrl, organizationId])

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode)
    }
  }

  const getFilteredEmployees = () => {
    if (!widgetType) return employees

    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    switch (widgetType) {
      case "total":
        return employees
      case "new":
        return employees.filter((emp) => {
          const joinDate = new Date(emp.joining_date)
          return joinDate >= thirtyDaysAgo
        })
      case "birthdays":
        return employees.filter((emp) => {
          if (!emp.date_of_birth) return false
          const birthDate = new Date(emp.date_of_birth)
          return birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate()
        })
      case "anniversaries":
        return employees.filter((emp) => {
          if (!emp.joining_date) return false
          const joinDate = new Date(emp.joining_date)
          return joinDate.getMonth() === today.getMonth() && joinDate.getDate() === today.getDate()
        })
      default:
        return employees
    }
  }

  const filteredEmployees = getFilteredEmployees()

  const getModalTitle = () => {
    switch (widgetType) {
      case "total":
        return "All Employees"
      case "new":
        return "New Joinings (Last 30 Days)"
      case "birthdays":
        return "Today's Birthdays"
      case "anniversaries":
        return "Today's Anniversaries"
      default:
        return "Employee Details"
    }
  }

  const columns = [
    { field: "employee_id", headerName: "ID", width: 80 },
    { field: "first_name", headerName: "First Name", width: 120 },
    { field: "last_name", headerName: "Last Name", width: 120 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 130 },
    { field: "designation", headerName: "Designation", width: 150 },
    { field: "department", headerName: "Department", width: 130 },
    { field: "gender", headerName: "Gender", width: 100 },
    {
      field: "joining_date",
      headerName: "Joining Date",
      width: 130,
      valueFormatter: (params) => {
        return params ? new Date(params).toLocaleDateString() : "N/A"
      },
    },
    {
      field: "date_of_birth",
      headerName: "Date of Birth",
      width: 130,
      valueFormatter: (params) => {
        return params ? new Date(params).toLocaleDateString() : "N/A"
      },
    },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: "70vh" },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" component="div">
          {getModalTitle()}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="cards" aria-label="card view">
              <ViewModule />
            </ToggleButton>
            <ToggleButton value="table" aria-label="table view">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading employee data: {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Showing {filteredEmployees?.length} employee{filteredEmployees?.length !== 1 ? "s" : ""}
            </Typography>

            {viewMode === "cards" ? (
              <EmployeeCards employees={filteredEmployees} />
            ) : (
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={filteredEmployees}
                  columns={columns}
                  getRowId={(row) => row.employee_id}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  disableSelectionOnClick
                  sx={{
                    "& .MuiDataGrid-cell": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#f5f5f5",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
