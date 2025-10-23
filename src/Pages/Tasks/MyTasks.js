import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Grid,
  Collapse,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import RemoveIcon from "@mui/icons-material/Remove";
const statusOptions = ["To Do", "In Progress", "Done"];
const priorityOptions = ["Low", "Medium", "High"];

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "To Do",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false); // <-- NEW

  const handleFormSubmit = () => {
    if (!formData.title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (isEditing) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = formData;
      setTasks(updatedTasks);
      setIsEditing(false);
    } else {
      setTasks([...tasks, formData]);
    }
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      status: "To Do",
    });
    setShowForm(false); // Close form after submit
  };

  const handleEdit = (index) => {
    setFormData(tasks[index]);
    setIsEditing(true);
    setEditingIndex(index);
    setShowForm(true); // Open form while editing
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box p={2} height={"100vh"}>
      <Typography variant="h5" mb={3} fontWeight="bold">
        Task Management
      </Typography>

      {/* Search Section */}
      <Box component={Paper} p={2} mb={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              fullWidth
              label="Search Tasks..."
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid item xs={12} sm={4} md={6} textAlign="left">
        <Button
          variant="contained"
          startIcon={showForm ? <RemoveIcon /> : <Add />}
          onClick={() => {
            setShowForm(!showForm);
            setFormData({
              title: "",
              description: "",
              dueDate: "",
              priority: "Medium",
              status: "To Do",
            });
            setIsEditing(false);
          }}
        >
          {showForm ? "Cancel" : "Add Task"}
        </Button>
      </Grid>
      {/* Form Section */}
      <Collapse in={showForm}>
        <Box component={Paper} p={2} mb={4}>
          <Typography variant="h6" mb={2}>
            {isEditing ? "Edit Task" : "Add New Task"}
          </Typography>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => handleFormFieldChange("title", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  handleFormFieldChange("description", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                InputLabelProps={{ shrink: true }}
                value={formData.dueDate}
                onChange={(e) =>
                  handleFormFieldChange("dueDate", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) =>
                    handleFormFieldChange("priority", e.target.value)
                  }
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) =>
                    handleFormFieldChange("status", e.target.value)
                  }
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="success"
                onClick={handleFormSubmit}
              >
                {isEditing ? "Update Task" : "Save Task"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      {/* Task List Section */}
      <Box component={Paper} p={2}>
        <Typography variant="h6" mb={2}>
          Task List ({filteredTasks?.length})
        </Typography>
        {filteredTasks?.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task, index) => (
                <TableRow key={index}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.dueDate || "-"}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(index)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(index)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography color="textSecondary" align="center" py={2}>
            No tasks found.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default MyTasks;
