"use client"

import { useState, useEffect, useRef } from "react"

import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  useTheme,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import SearchIcon from "@mui/icons-material/Search"
import useAuthStore from "../../../Zustand/Store/useAuthStore"
import { MAIN_URL } from "../../../Configurations/Urls"


const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : "#ffffff",
  minHeight: "90vh",
  padding: theme.spacing(3, 2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}))

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(3),
  color: "text.primary",
}))

const CircleContainer = styled(Box)(({ theme }) => ({
  width: 200,
  height: 200,
  border: "2px solid #4caf50",
  borderRadius: "50%",
  margin: theme.spacing(3, 0),
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : "#ffffff",
  color:"text.primary",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  overflow: "hidden",
  position: "relative",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : "#ffffff",
  },
}))

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: theme.spacing(3),
}))

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: 80,
  minHeight: 50,
  border: "1px solid #4caf50",
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : "#ffffff",
  color: "text.primary",
  fontSize: "12px",
  fontWeight: "normal",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#f0f8f0",
  },
}))

const VideoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 320,
  height: 240,
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  backgroundColor: "#000",
}))

const CaptureButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: "#4caf50",
  color: "white",
  "&:hover": {
    backgroundColor: "#45a049",
  },
}))

const ChangePhotoButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontSize: "10px",
  minHeight: "24px",
  padding: theme.spacing(0.5, 1),
  backgroundColor: "#4caf50",
  color: "white",
  textTransform: "none",
  borderRadius: theme.spacing(1),
  "&:hover": {
    backgroundColor: "#45a049",
  },
}))

const ImageContainer = styled(Box)({
  width: "100%",
  height: "100%",
  position: "relative",
  "&:hover .edit-overlay": {
    opacity: 1,
  },
})

const SearchContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 400,
  marginBottom: theme.spacing(2),
  position: "relative",
  color:"text.primary",
  
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : "#ffffff",
    borderRadius: theme.spacing(1),
    "& fieldset": {
      borderColor: "#4caf50",
    },
    "&:hover fieldset": {
      borderColor: "#45a049",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4caf50",
    },
  },
  "& .MuiInputLabel-root": {
    color: "text.primary",
    "&.Mui-focused": {
      color: "text.primary",
    },
  },
}))

const SearchResultsContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1000,
  maxHeight: 200,
  overflowY: "auto",
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : "#ffffff",
  color: "text.primary",
  border: "1px solid #4caf50",
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(0.5),
}))

const SearchResultItem = styled(ListItem)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : "#ffffff",
  },
  borderBottom: "1px solid #e0e0e0",
  "&:last-child": {
    borderBottom: "none",
  },
}))

const FaceAuth = () => {
  const { userData } = useAuthStore()
  const org = userData?.organization

  console.log("  Current userData:", userData)
  console.log("  Organization data:", org)
  console.log("  Organization name:", userData?.organization?.organization_name)

  const [currentDateTime, setCurrentDateTime] = useState("")
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [cameraError, setCameraError] = useState("")
  const [permissionState, setPermissionState] = useState("prompt")
  const [userData2, setUserData2] = useState({
    name: "Name",
    designation: "Designation",
    authorized: false,
    employee_id: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [organizationData, setOrganizationData] = useState({
    organization_id: org?.organization_id || 22,
    name: org?.organization_name || "Loading...",
  })
  const [clockInTime, setClockInTime] = useState(null)
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [breakStartTime, setBreakStartTime] = useState(null)
  const [isBreakStarted, setIsBreakStarted] = useState(false)
  const [breakEndTime, setBreakEndTime] = useState(null)
  const [isBreakEnded, setIsBreakEnded] = useState(false)
  const [clockOutTime, setClockOutTime] = useState(null)
  const [isClockedOut, setIsClockedOut] = useState(false)
  const [showAttendanceRecord, setShowAttendanceRecord] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const [allowed, setAllowed] = useState({
    clockin: true,
    breakstart: false,
    breakend: false,
    clockout: false,
  })

  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const theme = useTheme()

  const [apiUrl, setApiUrl] = useState(`${MAIN_URL}/api/organizations/${org?.organization_id || 22}/filter-employee`)

  const resetForNextEmployee = () => {
    setUserData2({
      name: "Name",
      designation: "Designation",
      authorized: false,
      employee_id: null,
    })
    setClockInTime(null)
    setIsClockedIn(false)
    setBreakStartTime(null)
    setIsBreakStarted(false)
    setBreakEndTime(null)
    setIsBreakEnded(false)
    setClockOutTime(null)
    setIsClockedOut(false)
    setShowAttendanceRecord(false)
    setSelectedEmployee(null)
    setSearchQuery("")
    setSearchResults([])
    setShowResults(false)
    setAllowed({ clockin: true, breakstart: false, breakend: false, clockout: false })
  }

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "camera" })
      setPermissionState(result.state)
      return result.state
    } catch (error) {
      console.log("  Permission API not supported, proceeding with getUserMedia")
      return "prompt"
    }
  }

  const captureImageDirectly = async () => {
    try {
      console.log("  Starting direct image capture...")
      setCameraError("")
      setIsCapturing(true)
      setIsLoading(true)

      const permissionStateResult = await checkCameraPermission()
      console.log("  Camera permission state:", permissionStateResult)

      if (permissionStateResult === "denied") {
        setCameraError("Camera access denied. Please enable camera permissions in your browser settings.")
        setIsCapturing(false)
        setIsLoading(false)
        return
      }

      console.log("  Requesting camera access...")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: "user",
        },
      })

      console.log("  Camera access granted, capturing image...")
      streamRef.current = stream

      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      video.onloadedmetadata = () => {
        const canvas = canvasRef.current
        if (canvas) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const context = canvas.getContext("2d")
          context.drawImage(video, 0, 0)

          const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8)
          setCapturedImage(imageDataUrl)

          canvas.toBlob(
            async (blob) => {
              if (blob) {
                await performFaceRecognition(blob)
              }
            },
            "image/jpeg",
            0.8,
          )
        }

        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      setPermissionState("granted")
    } catch (error) {
      console.error("  Error accessing camera:", error)

      let errorMessage = ""
      if (error.name === "NotAllowedError") {
        errorMessage = "Camera access denied. Please allow camera permissions and try again."
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera found. Please ensure your device has a camera connected."
      } else {
        errorMessage = `Camera error: ${error.message || "Unknown error occurred"}`
      }

      setCameraError(errorMessage)
      setIsCapturing(false)
      setIsLoading(false)
      setPermissionState("denied")
    }
  }

  const performFaceRecognition = async (imageBlob) => {
    try {
      console.log("  Starting face recognition...")

      const formData = new FormData()
      formData.append("image", imageBlob, "face.jpg")

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResponse = {
        success: Math.random() > 0.5,
        user: {
          name: "John Doe",
          designation: "Senior Software Engineer",
          id: 12345,
        },
      }

      console.log("  Face recognition result:", mockResponse)

      setUserData2({
        name: mockResponse.user.name,
        designation: mockResponse.user.designation,
        authorized: mockResponse.success,
        employee_id: mockResponse.user.id,
      })

      setIsLoading(false)
      setIsCapturing(false)
    } catch (error) {
      console.error("Face recognition failed:", error)
      setUserData2((prev) => ({ ...prev, authorized: false }))
      setIsLoading(false)
      setIsCapturing(false)
    }
  }

  const handleChangePhoto = (e) => {
    e.stopPropagation()
    console.log("  Changing photo - resetting captured image")
    setCapturedImage(null)
    setCameraError("")
    setUserData2((prev) => ({ ...prev, authorized: false }))
  }

  const handleCameraClick = () => {
    if (!capturedImage) {
      console.log("  Camera clicked - capturing image directly")
      captureImageDirectly()
    }
  }

  const searchEmployees = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    if (!apiUrl) {
      console.error("  API URL not available yet")
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      })

      console.log("  Search response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log("  Raw search API response:", data)

      let employees = Array.isArray(data) ? data : data.employees || data.data || []

      if (Array.isArray(employees) && employees?.length > 0 && Array.isArray(employees[0])) {
        employees = employees[0]
      }

      console.log("  Total employees from API:", employees?.length)

      const filteredEmployees = employees.filter((employee) => {
        const employeeName = (employee.Name || employee.name || "").toLowerCase()
        const employeeDesignation = (employee.Designation || employee.designation || "").toLowerCase()
        const employeeCode = (
          employee.Employee_Code ||
          employee.employee_code ||
          employee.employeeCode ||
          employee.code ||
          ""
        )
          .toString()
          .toLowerCase()
        const searchTerm = query.toLowerCase().trim()

        console.log("  Checking employee:", {
          id: employee.id || employee.employee_id,
          name: employeeName,
          designation: employeeDesignation,
          employeeCode: employeeCode,
          originalEmployeeCode: employee.Employee_Code,
          searchTerm: searchTerm,
        })

        const nameMatch = employeeName.includes(searchTerm)
        const designationMatch = employeeDesignation.includes(searchTerm)
        const codeMatch = employeeCode.includes(searchTerm)

        const isMatch = nameMatch || designationMatch || codeMatch

        if (isMatch) {
          console.log("  MATCH FOUND:", {
            employee: employee.Name || employee.name,
            code: employee.Employee_Code,
            matchType: nameMatch ? "name" : designationMatch ? "designation" : "code",
          })
        }

        return isMatch
      })

      console.log("  Filtered employees count:", filteredEmployees?.length)
      console.log("  Search query was:", query)

      setSearchResults(filteredEmployees)
      setShowResults(true)
    } catch (error) {
      console.error("  Detailed search error:", error)
      setSearchResults([])
      setShowResults(true)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (event) => {
    const value = event.target.value
    setSearchQuery(value)

    const timeoutId = setTimeout(() => {
      searchEmployees(value)
    }, 300)

    if (handleSearchChange.timeoutId) {
      clearTimeout(handleSearchChange.timeoutId)
    }
    handleSearchChange.timeoutId = timeoutId
  }

  const handleEmployeeSelect = (employee) => {
    const employeeName = employee.Name || employee.name || "Unknown Employee"
    const employeeDesignation = employee.Designation || employee.designation || "Employee"
    const employeeId = employee.id || employee.employee_id || employee.Employee_ID

    console.log("Selected employee:", employee)
    console.log("Extracted name:", employeeName)
    console.log("Extracted designation:", employeeDesignation)
    console.log("Extracted employee_id:", employeeId)

    setUserData2({
      name: employeeName,
      designation: employeeDesignation,
      authorized: false,
      employee_id: employeeId,
    })
    setSearchQuery(employeeName)
    setShowResults(false)
    setSearchResults([])

    setAllowed({
      clockin: Boolean(employee.clockin ??employee.allowed?.clockin ??true),
      breakstart: Boolean(employee.breakstart ??employee.allowed?.breakstart ??false),
      breakend: Boolean(employee.breakend ??employee.allowed?.breakend ??false),
      clockout: Boolean(employee.clockout ??employee.allowed?.clockout ??false),
    })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const refreshEmployeeStatus = async () => {
    try {
      if (!org?.organization_id) return
      if (!userData2?.employee_id && !userData2?.employee_code && !userData2?.name) return

      const token = localStorage.getItem("token")
      if (!token) return

      const employee = await fetchFilterEmployeeStatus({
        MAIN_URL,
        organizationId: org.organization_id,
        token,
        employeeId: userData2.employee_id,
        employeeCode: userData2.employee_code,
        name: userData2.name,
      })

      setIsClockedIn(Boolean(employee?.clockin))
      setIsBreakStarted(Boolean(employee?.breakstart))
      setIsBreakEnded(Boolean(employee?.breakend))
    } catch (err) {
      console.log("[v0] refreshEmployeeStatus error:", err)
    }
  }

  useEffect(() => {
    if (userData2.name !== "Name" && userData2.name !== "") {
      refreshEmployeeStatus()
    }
  }, [userData2.name, userData2.employee_id, org?.organization_id])

  const handleClockIn = async () => {
    if (userData2.name === "Name" || userData2.designation === "Designation") {
      alert("Please select an employee first")
      return
    }

    if (!userData2.employee_id) {
      alert("Employee ID is missing. Please select an employee from the search results.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      alert("Authentication token is missing. Please login again.")
      return
    }

    try {
      const now = new Date()
      const timestamp = now.toISOString()

      const formData = new FormData()
      formData.append("employee_id", userData2.employee_id.toString())
      formData.append("attendance_log_type", "Clock In")
      formData.append("timestamp", timestamp)
      formData.append("date", now.toISOString().split("T")[0])

      const apiEndpoint = `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-time-logs`

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await response.json().catch(() => null)

        setClockInTime(timestamp)
        setIsClockedIn(true)
        setSelectedEmployee(userData2)

        setAllowed({ clockin: false, breakstart: true, breakend: false, clockout: true })

        await refreshEmployeeStatus()

        setToastMessage("Employee Login Successfully")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)

        resetForNextEmployee()
      } else {
        const text = await response.text().catch(() => "")
        console.error("Clock in failed:", response.status, text)
        alert("Clock in failed. Please try again.")
      }
    } catch (error) {
      console.error("Error during Clock In:", error)
      alert("An error occurred while clocking in. Please try again.")
    }
  }

  const handleStartBreak = async () => {
    if (!userData2?.employee_id) {
      alert("Please select an employee first")
      return
    }
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Authentication token is missing. Please login again.")
      return
    }
    try {
      const now = new Date()
      const timestamp = now.toISOString()
      const formData = new FormData()
      formData.append("employee_id", String(userData2.employee_id))
      formData.append("attendance_log_type", "Break Start")
      formData.append("timestamp", timestamp)
      formData.append("date", now.toISOString().split("T")[0])

      const apiEndpoint = `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-time-logs`
      const res = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const t = await res.text().catch(() => "")
        throw new Error(`Break start failed: ${res.status} ${t}`)
      }

      setIsBreakStarted(true)
      setBreakStartTime(timestamp)

      setAllowed({ clockin: false, breakstart: false, breakend: true, clockout: true })
      await refreshEmployeeStatus()

      resetForNextEmployee()
    } catch (e) {
      console.error(e)
      alert("Failed to start break.")
    }
  }

  const handleEndBreak = async () => {
    if (!userData2?.employee_id) {
      alert("Please select an employee first")
      return
    }
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Authentication token is missing. Please login again.")
      return
    }
    try {
      const now = new Date()
      const timestamp = now.toISOString()
      const formData = new FormData()
      formData.append("employee_id", String(userData2.employee_id))
      formData.append("attendance_log_type", "Break End")
      formData.append("timestamp", timestamp)
      formData.append("date", now.toISOString().split("T")[0])

      const apiEndpoint = `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-time-logs`
      const res = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const t = await res.text().catch(() => "")
        throw new Error(`Break end failed: ${res.status} ${t}`)
      }

      setIsBreakEnded(true)
      setBreakEndTime(timestamp)

      setAllowed({ clockin: false, breakstart: true, breakend: false, clockout: true })
      await refreshEmployeeStatus()

      resetForNextEmployee()
    } catch (e) {
      console.error(e)
      alert("Failed to end break.")
    }
  }

  const handleClockOut = async () => {
    if (!userData2?.employee_id) {
      alert("Please select an employee first")
      return
    }
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Authentication token is missing. Please login again.")
      return
    }
    try {
      const now = new Date()
      const timestamp = now.toISOString()
      const formData = new FormData()
      formData.append("employee_id", String(userData2.employee_id))
      formData.append("attendance_log_type", "Clock Out")
      formData.append("timestamp", timestamp)
      formData.append("date", now.toISOString().split("T")[0])

      const apiEndpoint = `${MAIN_URL}/api/organizations/${org?.organization_id}/attendance-time-logs`
      const res = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const t = await res.text().catch(() => "")
        throw new Error(`Clock out failed: ${res.status} ${t}`)
      }

      setIsClockedIn(false)

      setAllowed({ clockin: true, breakstart: false, breakend: false, clockout: false })
      await refreshEmployeeStatus()

      resetForNextEmployee()
    } catch (e) {
      console.error(e)
      alert("Failed to clock out.")
    }
  }

  useEffect(() => {
    if (org?.organization_id) {
      setOrganizationData({
        organization_id: org.organization_id,
        name: org.organization_name || "Loading...",
      })
      setApiUrl(`${MAIN_URL}/api/organizations/${org.organization_id}/filter-employee`)
    }
  }, [org])

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      setCurrentDateTime(`${date} | ${time}`)
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <StyledContainer>
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : "#ffffff",
            color: "text.primary",
            padding: "12px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontSize: "16px",
            fontWeight: "500",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {toastMessage}
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      <HeaderSection>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: 1,
          }}
        >
          HR ERP
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            color: "text.secondary",
            marginBottom: 2,
          }}
        >
          {userData?.organization?.organization_name || "Organization"}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            fontSize: "14px",
            color: "text.primary",
          }}
        >
          {currentDateTime}
        </Typography>
      </HeaderSection>

      <SearchContainer className="search-container">
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Search by employee code..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "#4caf50", marginRight: 1 }} />,
            endAdornment: isSearching && <CircularProgress size={20} sx={{ color: "#4caf50" }} />,
          }}
          size="small"
        />

        {showResults && searchResults?.length > 0 && (
          <SearchResultsContainer elevation={3}>
            <List dense>
              {searchResults.map((employee, index) => (
                <SearchResultItem
                  key={employee.id || employee.employee_id || index}
                  onClick={() => handleEmployeeSelect(employee)}
                >
                  <ListItemText
                    primary={`${employee.Name || employee.name || "Unknown Employee"} (${employee.Employee_Code || employee.employee_code || "No Code"})`}
                    secondary={employee.Designation || employee.designation || "Employee"}
                    primaryTypographyProps={{ fontSize: "14px" }}
                    secondaryTypographyProps={{ fontSize: "12px", color: "text.primary" }}
                  />
                </SearchResultItem>
              ))}
            </List>
          </SearchResultsContainer>
        )}

        {showResults && searchResults?.length === 0 && !isSearching && searchQuery.trim() && (
          <SearchResultsContainer elevation={3}>
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color:"text.primary", fontSize: "12px" }}>
                No employees found matching "{searchQuery}"
              </Typography>
            </Box>
          </SearchResultsContainer>
        )}
      </SearchContainer>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <CircleContainer 
        // onClick={handleCameraClick}
        >
          {capturedImage ? (
            <img
              src={capturedImage || "/placeholder.svg"}
              alt="Captured face"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : isLoading ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <CircularProgress sx={{ color: "#4caf50", marginBottom: 1 }} />
              <Typography variant="body2" sx={{ fontSize: "10px", color: "text.secondary" }}>
                Processing...
              </Typography>
            </Box>
          ) : (
            <>
              <CameraAltIcon
                sx={{
                  fontSize: 60,
                  color: "#4caf50",
                  marginBottom: 1,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "10px",
                  color: "text.secondary",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                Click to face
                <br />
                recognition
              </Typography>
            </>
          )}
        </CircleContainer>

        {capturedImage && <ChangePhotoButton onClick={handleChangePhoto}>Change Photo</ChangePhotoButton>}
      </Box>

      {cameraError && (
        <Box sx={{ textAlign: "center", marginBottom: 2, padding: 2, backgroundColor: "#ffebee", borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: "#f44336", fontSize: "12px" }}>
            {cameraError}
          </Typography>
        </Box>
      )}

      <Box sx={{ textAlign: "center", marginBottom: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", marginBottom: 0.5 }}>
          {userData2.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {userData2.designation}
        </Typography>
      </Box>

      <ButtonContainer>
        <ActionButton
          variant="outlined"
          onClick={handleClockIn}
          disabled={!allowed.clockin}
          sx={{
            opacity: !allowed.clockin ? 0.7 : 1,
            backgroundColor: !allowed.clockin ? theme.palette.background.default : "#ffffff",
            color: !allowed.clockin ? "#2e7d32" : "#333",
            cursor: !allowed.clockin ? "not-allowed" : "pointer",
            "&:hover": {
              backgroundColor: !allowed.clockin ? theme.palette.background.default : "#f0f8f0",
            },
          }}
        >
          Clock
          <br />
          In
          {isClockedIn && (
            <Typography variant="caption" sx={{ fontSize: "8px", display: "block", marginTop: "2px" }}>
              {clockInTime && new Date(clockInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
        </ActionButton>
        <ActionButton
          variant="outlined"
          onClick={handleStartBreak}
          disabled={!allowed.breakstart}
          sx={{
            opacity: !allowed.breakstart ? 0.7 : 1,
            backgroundColor: !allowed.breakstart ? theme.palette.background.default : "white",
            color: !allowed.breakstart ? "#2e7d32" : "#333",
            cursor: !allowed.breakstart ? "not-allowed" : "pointer",
            "&:hover": {
              backgroundColor: !allowed.breakstart ? "#e8f5e8" : "#f0f8f0",
            },
          }}
        >
          Break
          <br />
          Start
          {isBreakStarted && (
            <Typography variant="caption" sx={{ fontSize: "8px", display: "block", marginTop: "2px" }}>
              {breakStartTime &&
                new Date(breakStartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
        </ActionButton>
        <ActionButton
          variant="outlined"
          onClick={handleEndBreak}
          disabled={!allowed.breakend}
          sx={{
            opacity: !allowed.breakend ? 0.7 : 1,
            backgroundColor: !allowed.breakend ? theme.palette.background.default : "white",
            color: !allowed.breakend ? "#2e7d32" : "#333",
            cursor: !allowed.breakend ? "not-allowed" : "pointer",
            "&:hover": {
              backgroundColor: !allowed.breakend ? "#e8f5e8" : "#f0f8f0",
            },
          }}
        >
          Break
          <br />
          End
          {isBreakEnded && (
            <Typography variant="caption" sx={{ fontSize: "8px", display: "block", marginTop: "2px" }}>
              {breakEndTime && new Date(breakEndTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
        </ActionButton>
        <ActionButton
          variant="outlined"
          onClick={handleClockOut}
          disabled={!allowed.clockout}
          sx={{
            opacity: !allowed.clockout ? 0.7 : 1,
            backgroundColor: !allowed.clockout ? theme.palette.background.default : "white",
            color: !allowed.clockout ? "#2e7d32" : "#333",
            cursor: !allowed.clockout ? "not-allowed" : "pointer",
            "&:hover": {
              backgroundColor: !allowed.clockout ? "#e8f5e8" : "#f0f8f0",
            },
          }}
        >
          Clock
          <br />
          Out
          {isClockedOut && (
            <Typography variant="caption" sx={{ fontSize: "8px", display: "block", marginTop: "2px" }}>
              {clockOutTime && new Date(clockOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
        </ActionButton>
      </ButtonContainer>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </StyledContainer>
  )
}

async function fetchFilterEmployeeStatus(opts) {
  const { MAIN_URL, organizationId, token, employeeId, employeeCode, name } = opts
  if (!organizationId) throw new Error("Missing organization id")
  const url = new URL(`${MAIN_URL}/api/organizations/${organizationId}/filter-employee`)
  if (employeeId) url.searchParams.set("employee_id", String(employeeId))
  if (employeeCode) url.searchParams.set("employee_code", String(employeeCode))
  if (name) url.searchParams.set("q", String(name))

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`filter-employee failed: ${res.status} ${text}`)
  }
  const data = await res.json()
  const employee = Array.isArray(data) ? data[0] : data
  return employee
}

export default FaceAuth
