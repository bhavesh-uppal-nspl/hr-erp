// "use client"

// import { useEffect, useRef, useState } from "react"
// import {
//   Card,
//   CardContent,
//   Avatar,
//   Typography,
//   Box,
//   Grid,
//   Button,
//   useTheme, // add useTheme for adaptive theming
// } from "@mui/material"
// import { Dot, ChevronLeft, ChevronRight } from "lucide-react"
// import { useLocation } from "react-router-dom"
// import { MAIN_URL } from "../../../Configurations/Urls"
// import useAuthStore from "../../../Zustand/Store/useAuthStore"

// /**
//  * Capitalizes the first letter of each word in a string
//  */
// function capitalizeWords(str) {
//   if (!str || typeof str !== "string") return "N/A"
//   return str.replace(/\b\w/g, (char) => char.toUpperCase())
// }

// /**
//  * Calculates age from date of birth
//  */
// function calculateAge(dob) {
//   if (!dob) return "N/A"
//   const birthDate = new Date(dob)
//   const today = new Date()
//   let age = today.getFullYear() - birthDate.getFullYear()
//   const monthDiff = today.getMonth() - birthDate.getMonth()

//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--
//   }

//   return age >= 0 ? age : "N/A"
// }

// /**
//  * Converts 24-hour time format to 12-hour format
//  */
// function formatTime24to12(time24) {
//   if (!time24 || typeof time24 !== "string") return "N/A"
//   const [hh, mm] = time24.split(":")
//   const hour = Number.parseInt(hh, 10)
//   if (isNaN(hour) || !mm) return "N/A"
//   const ampm = hour >= 12 ? "PM" : "AM"
//   const hour12 = hour % 12 || 12
//   return `${hour12}:${mm} ${ampm}`
// }

// /**
//  * Calculates tenure since joining date in a human-readable format
//  */
// function getTenureSinceJoining(joinDateStr) {
//   if (!joinDateStr) return "N/A"

//   const joinDate = new Date(joinDateStr)
//   if (isNaN(joinDate.getTime())) return "N/A"

//   const today = new Date()

//   let years = today.getFullYear() - joinDate.getFullYear()
//   let months = today.getMonth() - joinDate.getMonth()
//   let days = today.getDate() - joinDate.getDate()

//   // Adjust for negative days
//   if (days < 0) {
//     months--
//     // Get days in previous month
//     const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
//     days += prevMonth.getDate()
//   }

//   // Adjust for negative months
//   if (months < 0) {
//     years--
//     months += 12
//   }

//   if (years > 0 && months > 0) {
//     return `${years} Year${years > 1 ? "s" : ""} ${months} Month${months > 1 ? "s" : ""}`
//   }
//   if (years > 0) {
//     return `${years} Year${years > 1 ? "s" : ""}`
//   }
//   if (months > 0) {
//     return `${months} Month${months > 1 ? "s" : ""}`
//   }
//   if (days > 1) {
//     return `${days} Days`
//   }
//   if (days === 1) {
//     return "1 Day"
//   }
//   if (days === 0) {
//     return "Today"
//   }

//   return "N/A"
// }

// const EmployeePagination = ({
//   currentEmployee,
//   totalEmployees,
//   onPrevious,
//   onNext,
//   canNavigatePrev,
//   canNavigateNext,
// }) => {
//   const theme = useTheme() // useTheme for colors

//   const buttonStyles = {
//     minWidth: "100px",
//     textTransform: "none",
//     borderColor: theme.palette.divider, // adaptive border color
//     "&:hover": {
//       borderColor: theme.palette.divider, // adaptive hover border
//       backgroundColor: theme.palette.action.hover, // adaptive hover background
//     },
//     "&:disabled": {
//       borderColor: theme.palette.action.disabledBackground, // adaptive disabled border
//       color: theme.palette.text.disabled, // adaptive disabled text
//     },
//   }

//   return (
//     <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//       <Typography variant="body2" sx={{ color: "text.secondary", minWidth: "120px" }}>
//         Employee {currentEmployee} of {totalEmployees}
//       </Typography>

//       <Box sx={{ display: "flex", gap: 1 }}>
//         <Button
//           variant="outlined"
//           size="small"
//           onClick={onPrevious}
//           disabled={!canNavigatePrev}
//           startIcon={<ChevronLeft size={16} />}
//           sx={{
//             ...buttonStyles,
//             color: !canNavigatePrev ? theme.palette.text.disabled : theme.palette.text.primary, // adaptive text color
//           }}
//         >
//           Prev Emp
//         </Button>

//         <Button
//           variant="outlined"
//           size="small"
//           onClick={onNext}
//           disabled={!canNavigateNext}
//           endIcon={<ChevronRight size={16} />}
//           sx={{
//             ...buttonStyles,
//             color: !canNavigateNext ? theme.palette.text.disabled : theme.palette.text.primary, // adaptive text color
//           }}
//         >
//           Next Emp
//         </Button>
//       </Box>
//     </Box>
//   )
// }

// const ProfileImageCard = ({ imageUrl, name }) => {
//   const theme = useTheme() // useTheme for adaptive theming

//   return (
//     <Card
//       elevation={3}
//       sx={{
//         borderRadius: 3,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: 400,
//         width: 420,
//         minWidth: 180,
//         bgcolor: theme.palette.background.paper, // use theme-based paper background instead of hard-coded white
//       }}
//     >
//       <Avatar
//         alt={typeof name === "string" ? name : ""}
//         src={typeof imageUrl === "string" ? imageUrl : ""}
//         sx={{
//           width: 300,
//           height: 300,
//           border: "6px solid",
//           borderColor: theme.palette.divider, // use divider token for border color
//         }}
//       />
//     </Card>
//   )
// }

// const EmployeeDetailsCard = ({ employee }) => {
//   const theme = useTheme() // useTheme for adaptive theming

//   return (
//     <Card
//       elevation={3}
//       sx={{
//         borderRadius: 3,
//         padding: 3,
//         width: 420,
//         bgcolor: theme.palette.background.paper,
//         height: 400,
//         display: "flex",
//         alignItems: "center",
//       }}
//     >
//       <CardContent>
//         <Typography variant="h5" fontWeight="bold">
//           {typeof employee.name === "string" ? capitalizeWords(employee.name) : "N/A"}
//         </Typography>
//         <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1.2 }}>
//           {typeof employee.designation === "string" ? capitalizeWords(employee.designation) : "N/A"}
//         </Typography>
//         <Typography variant="subtitle2">
//           {typeof employee.department === "string" ? capitalizeWords(employee.department) : "N/A"}
//         </Typography>
//         <Typography variant="subtitle2">
//           {typeof employee.location === "string" ? capitalizeWords(employee.location) : "N/A"}
//         </Typography>

//         <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.2 }}>
//           {typeof employee.organization === "string" ? capitalizeWords(employee.organization) : "N/A"}
//         </Typography>
//         <Typography variant="subtitle2">
//           {typeof employee.division === "string" ? capitalizeWords(employee.division) : "Division N/A"}
//         </Typography>

//         <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.2 }}>
//           With us for: {typeof employee.withUsFor === "string" ? employee.withUsFor : "N/A"}
//         </Typography>
//         <Typography variant="subtitle2">
//           Total Experience: {employee.totalExperience || "N/A"} ({employee.organizations || "N/A"} Organizations)
//         </Typography>

//         <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.2 }}>
//           Current CTC {typeof employee.currentCtc === "string" ? employee.currentCtc : "N/A"}
//         </Typography>
//         <Typography variant="subtitle2">
//           Last Increment {typeof employee.lastIncrement === "string" ? capitalizeWords(employee.lastIncrement) : "N/A"}{" "}
//           on {employee.incrementDate || "N/A"}
//         </Typography>

//         <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.2 }}>
//           Day {typeof employee.workingHours === "string" ? employee.workingHours : "N/A"}{" "}
//           <Dot
//             size="30px"
//             color={
//               employee?.isClockedOut
//                 ? theme.palette.error.main
//                 : employee?.isClockedIn
//                   ? theme.palette.success.main
//                   : theme.palette.error.main
//             }
//           />
//         </Typography>
//         <Typography variant="subtitle2">
//           {employee.workshiftType} | {employee.workshift}
//         </Typography>
//       </CardContent>
//     </Card>
//   )
// }

// const FamilyDetailsCard = ({ employee }) => {
//   const theme = useTheme() // Declare theme variable

//   return (
//     <Card
//       elevation={3}
//       sx={{
//         borderRadius: 3,
//         padding: 3,
//         bgcolor: theme.palette.background.paper,
//         height: 400,
//         width: 420,
//         display: "flex",
//         alignItems: "flex-start",
//         overflow: "auto",
//       }}
//     >
//       <CardContent>
//         <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 3 }}>
//           Age {employee.age || "N/A"} Years
//         </Typography>
//         <Typography variant="subtitle2">
//           {typeof employee.maritalStatus === "string" ? capitalizeWords(employee.maritalStatus) : "N/A"}
//         </Typography>

//         <Typography variant="subtitle2" sx={{ mt: 1.2, fontWeight: "bold" }}>
//           {typeof employee.education === "string" ? capitalizeWords(employee.education) : "N/A"}
//         </Typography>
//         <Typography variant="subtitle2">
//           {typeof employee.college === "string" ? capitalizeWords(employee.college) : "N/A"}
//         </Typography>

//         <Typography variant="subtitle2" sx={{ mt: 1.2, fontWeight: "bold" }}>
//           Recruitment Source:{" "}
//           {typeof employee.recruitmentSource === "string" ? capitalizeWords(employee.recruitmentSource) : "N/A"}
//         </Typography>
//         <Typography variant="subtitle2">Joining Year: {employee.joiningYear || "N/A"}</Typography>

//         <Typography variant="subtitle2" sx={{ mt: 1.2, fontWeight: "bold" }}>
//           Family {employee.familyMembers || 0} Members {employee.dependents || 0} Dependent
//         </Typography>

//         {employee.familyMembersList && employee.familyMembersList?.length > 0 ? (
//           <Box sx={{ mt: 1 }}>
//             {employee.familyMembersList.map((member, index) => (
//               <Typography key={index} variant="subtitle2" sx={{ mt: 0.5, pl: 1 }}>
//                 • {member.name} ({member.relation}) - Age: {member.age || "N/A"}
//               </Typography>
//             ))}
//           </Box>
//         ) : (
//           <Typography variant="subtitle2">
//             {typeof employee.livingWith === "string" ? capitalizeWords(employee.livingWith) : "N/A"}
//           </Typography>
//         )}

//         <Typography variant="subtitle2" sx={{ mt: 1.2 }}>
//           <b>Home Town:</b> {typeof employee.homeTown === "string" ? capitalizeWords(employee.homeTown) : "N/A"}
//         </Typography>
//         <Typography variant="subtitle2">
//           {typeof employee.housingStatus === "string" ? capitalizeWords(employee.housingStatus) : "N/A"}
//         </Typography>

//         <Typography variant="subtitle2" sx={{ mt: 1.2 }}>
//           <b>Reporting Manager:</b> {employee.manager || "N/A"}
//         </Typography>
//       </CardContent>
//     </Card>
//   )
// }

// const AttendancePerformanceCard = ({ employee }) => {
//   const theme = useTheme() // Declare theme variable

//   return (
//     <Card
//       elevation={3}
//       sx={{
//         borderRadius: 3,
//         padding: 3,
//         bgcolor: theme.palette.background.paper,
//         height: 400,
//         width: 420,
//         display: "flex",
//         alignItems: "flex-start",
//       }}
//     >
//       <CardContent>
//         <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
//           Current Month Attendance
//         </Typography>
//         <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1.2 }}>
//           Attendance: {employee.attendance || "N/A"}%
//         </Typography>
//         <Typography variant="subtitle2" sx={{ mt: 1.2 }}>
//           Leaves: {employee.leaves || "N/A"}
//         </Typography>
//       </CardContent>
//     </Card>
//   )
// }

// function mapEmployeeData(emp, userData) {
//   const location = emp.address
//     ? [emp.address.address_line1, emp.address.address_line2, emp.address.address_line3].filter(Boolean).join(", ")
//     : "N/A"

//   const workingHours =
//     emp.workshift?.work_shift_start_time && emp.workshift?.work_shift_end_time
//       ? `${formatTime24to12(emp.workshift.work_shift_start_time)} - ${formatTime24to12(emp.workshift.work_shift_end_time)}`
//       : "N/A"

//   const age = emp.date_of_birth ? calculateAge(emp.date_of_birth) : "N/A"
//   const joinYear = emp.date_of_joining ? new Date(emp.date_of_joining).getFullYear() : null

//   let totalExperience = "N/A"
//   if (emp.experience?.start_date) {
//     const joinDate = new Date(emp.experience?.start_date)
//     const today = new Date()

//     let years = today.getFullYear() - joinDate.getFullYear()
//     let months = today.getMonth() - joinDate.getMonth()
//     let days = today.getDate() - joinDate.getDate()

//     if (days < 0) {
//       months--
//       const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
//       days += prevMonth.getDate()
//     }

//     if (months < 0) {
//       years--
//       months += 12
//     }

//     if (years > 0 && months > 0) {
//       totalExperience = `${years} Years ${months} Months`
//     } else if (years > 0) {
//       totalExperience = `${years} Years`
//     } else if (months > 0) {
//       totalExperience = `${months} Months`
//     } else if (days > 0) {
//       totalExperience = `${days} Days`
//     } else {
//       totalExperience = "Today"
//     }
//   }

//   const withUsFor = getTenureSinceJoining(emp.date_of_joining)

//   const familyMembersList = []
//   let familyMembersCount = 0
//   let dependentsCount = 0

//   if (emp.family) {
//     if (Array.isArray(emp.family)) {
//       familyMembersCount = emp.family?.length
//       dependentsCount = emp.family.filter((member) => member.is_dependent || member.dependent)?.length
//     } else if (typeof emp.family === "object") {
//       familyMembersCount = 1
//       dependentsCount = emp.family.is_dependent || emp.family.dependent ? 1 : 0
//     }
//   }

//   if (emp.family_members && Array.isArray(emp.family_members)) {
//     familyMembersCount = emp.family_members?.length
//     dependentsCount = emp.family_members.filter((member) => member.is_dependent || member.dependent)?.length
//   }

//   const safeString = (val) => (typeof val === "string" ? val : "N/A")

//   function getHighestEducation(educationArray) {
//     if (!Array.isArray(educationArray) || educationArray?.length === 0) {
//       return "Education N/A"
//     }
//     for (let i = educationArray?.length - 1; i >= 0; i--) {
//       const item = educationArray[i]
//       if (Array.isArray(item.degree) && item.degree?.length > 0 && item.degree[0].education_degree_name) {
//         return `${item.degree[0].education_degree_name}`
//       }
//     }
//     return educationArray[educationArray?.length - 1].institute_name || "Education N/A"
//   }

//   function getWorkshiftLabel(workModel) {
//     if (workModel) {
//       return `${workModel}`
//     } else {
//       return "Workshift N/A"
//     }
//   }

//   function getWorkshiftType(employmentType) {
//     if (employmentType) {
//       return `${employmentType}`
//     } else return "Workshift N/A"
//   }

//   const attendanceTypeRaw =
//     emp?.today_latest_attendance?.attendance_log_type ??emp?.today_latest_attendance?.log_type ??""
//   const attendanceTypeLower = typeof attendanceTypeRaw === "string" ? attendanceTypeRaw.toLowerCase() : ""

//   const isClockedIn =
//     attendanceTypeLower.includes("clock in") ||
//     attendanceTypeLower.includes("break start") ||
//     attendanceTypeLower.includes("break end")
//   const isClockedOut = attendanceTypeLower.includes("clock out")

//   const organizationsCountFromApi =
//     typeof emp.organizations_count === "number"
//       ? emp.organizations_count
//       : typeof emp.total_organizations === "number"
//         ? emp.total_organizations
//         : typeof emp.unique_organizations_count === "number"
//           ? emp.unique_organizations_count
//           : typeof emp.organizations === "number"
//             ? emp.organizations
//             : null

//   // Count unique organizations from experience array
//   const organizationsCount =
//     organizationsCountFromApi ?.
//     (Array.isArray(emp.experience)
//       ? new Set(emp.experience.map((exp) => exp?.organization_name).filter(Boolean)).size
//       : emp.experience && emp.experience.organization_name
//         ? 1
//         : 0)

//   return {
//     imageUrl: safeString(emp.profile_image_url),
//     name: [emp.first_name, emp.middle_name, emp.last_name].filter(Boolean).join(" "),
//     designation: emp.designation?.designation_name || "N/A",
//     department: emp.department_location?.[0]?.department?.department_name || "N/A",
//     location: "Amritsar",
//     division: "Division N/A",
//     totalExperience,
//     organizations: organizationsCount || "",
//     currentCtc: emp.experience?.current_amount ? `₹${emp.experience.current_amount}` : "N/A",
//     lastIncrement: safeString(emp.last_increment_amount) || "N/A",
//     incrementDate: safeString(emp.last_increment_date) || "N/A",
//     workingHours,
//     workshift: getWorkshiftLabel(emp.workmodel?.work_model_name),
//     workshiftType: getWorkshiftType(emp.employemnettype?.employment_type_name),
//     age,
//     maritalStatus: safeString(emp.marital_status) || "N/A",
//     education: getHighestEducation(emp.education),
//     college:
//       Array.isArray(emp?.education) && emp.education?.length > 0
//         ? emp.education[emp.education?.length - 1]?.institute_name || "College N/A"
//         : "College N/A",
//     recruitmentSource: safeString(emp?.occupation_details) || "N/A",
//     joiningYear: joinYear || "N/A",
//     familyMembers: familyMembersCount,
//     dependents: dependentsCount,
//     familyMembersList: familyMembersList,
//     livingWith: "",
//     homeTown: location,
//     housingStatus: emp.address?.residential_owner_type.residential_ownership_type_name || "Housing N/A",
//     manager:
//       [emp.manager?.first_name, emp.manager?.middle_name, emp.manager?.last_name].filter(Boolean).join(" ") || "N/A",
//     attendance: "",
//     leaves: "Leaves N/A",
//     organization: userData?.organization?.organization_name || "N/A",
//     withUsFor,
//     isClockedIn,
//     isClockedOut,
//   }
// }

// export default function EmployeeProfile() {
//   const location = useLocation()
//   const search = (location && location.search) || (typeof window !== "undefined" ? window.location.search : "")
//   const params = new URLSearchParams(search)

//   const navState = location?.state ??{}
//   const urlId = params.get("id")
//   const urlPage = Number(params.get("page"))
//   const urlIndex = Number(params.get("index"))
//   const urlPageSize = Number(params.get("pageSize"))

//   const getStored = (key, def) => {
//     if (typeof window === "undefined") return def
//     const v = window.localStorage.getItem(key)
//     const n = v ? Number.parseInt(v, 10) : Number.NaN
//     return Number.isFinite(n) ? n : def
//   }

//   const targetEmployeeId =
//     urlId ??(typeof window !== "undefined" ? window.localStorage.getItem("selectedEmployeeId") : null) ??null

//   const [apiUrl, setApiUrl] = useState(null)
//   const [employeeList, setEmployeeList] = useState([])
//   const [employee, setEmployee] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const [currentPage, setCurrentPage] = useState(() => {
//     if (Number.isFinite(urlPage) && urlPage > 0) return urlPage
//     if (typeof navState?.page === "number" && navState.page > 0) return navState.page
//     return getStored("employeeCurrentPage", 1)
//   })

//   const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(() => {
//     if (Number.isFinite(urlIndex) && urlIndex >= 0) return urlIndex
//     if (typeof navState?.index === "number" && navState.index >= 0) return navState.index
//     return getStored("employeeCurrentIndex", 0)
//   })

//   const [totalPages, setTotalPages] = useState(1)
//   const [totalEmployees, setTotalEmployees] = useState(0)

//   const PAGE_SIZE =
//     (Number.isFinite(urlPageSize) && urlPageSize > 0
//       ? urlPageSize
//       : typeof navState?.pageSize === "number" && navState.pageSize > 0
//         ? navState.pageSize
//         : typeof window !== "undefined"
//           ? Number.parseInt(localStorage.getItem("employeePageSize") || "", 10)
//           : Number.NaN) || 10

//   const { userData } = useAuthStore()
//   const selectedEmployee = navState?.employee
//   const passedEmployees = Array.isArray(navState?.employees) ? navState.employees : null

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("employeeCurrentPage", String(currentPage))
//     }
//   }, [currentPage])

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("employeeCurrentIndex", String(currentEmployeeIndex))
//       if (selectedEmployee) {
//         const id =
//           selectedEmployee?.employee_id ?.
//           selectedEmployee?.id ?.
//           selectedEmployee?.employeeId ?.
//           selectedEmployee?.emp_code ?.
//           selectedEmployee?.code
//         if (id != null) localStorage.setItem("selectedEmployeeId", String(id))
//       }
//     }
//   }, [currentEmployeeIndex, selectedEmployee])

//   const navAppliedRef = useRef(false)

//   useEffect(() => {
//     if (navAppliedRef.current) return

//     if (selectedEmployee) {
//       if (passedEmployees?.length) {
//         const safeIdx =
//           typeof navState?.index === "number" && navState.index >= 0
//             ? Math.min(navState.index, passedEmployees?.length - 1)
//             : 0
//         setEmployeeList(passedEmployees)
//         setCurrentEmployeeIndex(safeIdx)
//         setEmployee(mapEmployeeData(passedEmployees[safeIdx], userData))
//         const tc = typeof navState?.totalCount === "number" ? navState.totalCount : passedEmployees?.length
//         const tp =
//           typeof navState?.totalPages === "number" ? navState.totalPages : Math.max(1, Math.ceil(tc / PAGE_SIZE))
//         setTotalEmployees(tc)
//         setTotalPages(tp)
//         navAppliedRef.current = true
//         setLoading(false)
//         return
//       } else {
//         setEmployeeList([selectedEmployee])
//         setCurrentEmployeeIndex(0)
//         setEmployee(mapEmployeeData(selectedEmployee, userData))
//         setTotalEmployees(typeof navState?.totalCount === "number" ? navState.totalCount : 1)
//         setTotalPages(typeof navState?.totalPages === "number" ? navState.totalPages : 1)
//         navAppliedRef.current = true
//         setLoading(false)
//         return
//       }
//     }

//     navAppliedRef.current = true
//   }, [
//     selectedEmployee,
//     passedEmployees,
//     navState?.index,
//     navState?.totalCount,
//     navState?.totalPages,
//     PAGE_SIZE,
//     userData,
//   ])

//   useEffect(() => {
//     if (!userData?.organization?.organization_id) return
//     const url = `${MAIN_URL}/api/organization/${userData.organization.organization_id}/employee-all`
//     setApiUrl(url)
//   }, [userData?.organization?.organization_id])

//   useEffect(() => {
//     if (!apiUrl) return
//     if (passedEmployees?.length && navState?.page === currentPage) return

//     const getId = (e) => e?.employee_id ??e?.id ??e?.employeeId ??e?.emp_code ??e?.code ??null

//     const fetchEmployees = async () => {
//       setLoading(true)
//       try {
//         const res = await fetch(apiUrl)
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

//         const data = await res.json()
//         let employees = data.employees || data
//         const totalCount = data.totalCount || 0

//         employees = [...employees].sort((a, b) => {
//           const idA = a.employee_id || a.id || 0
//           const idB = b.employee_id || b.id || 0
//           return idB - idA
//         })

//         setEmployeeList(employees)
//         setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)))
//         setTotalEmployees(totalCount || employees?.length)

//         let idx = 0
//         if (targetEmployeeId) {
//           const foundIndex = employees.findIndex((e) => String(getId(e)) === String(targetEmployeeId))
//           if (foundIndex >= 0) idx = foundIndex
//         }
//         setCurrentEmployeeIndex(idx)
//         const chosen = employees[idx] || employees[0]

//         if (chosen) {
//           setEmployee(mapEmployeeData(chosen, userData))
//         }
//       } catch (err) {
//         setError(err?.message || "An error occurred")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchEmployees()
//   }, [apiUrl, passedEmployees, navState?.page, PAGE_SIZE, targetEmployeeId, userData, currentPage])

//   useEffect(() => {
//     if (employeeList?.length > 0 && currentEmployeeIndex >= 0 && currentEmployeeIndex < employeeList?.length) {
//       setEmployee(mapEmployeeData(employeeList[currentEmployeeIndex], userData))
//     }
//   }, [currentEmployeeIndex, employeeList, userData])

//   const handleEmployeeNavigation = (direction) => {
//     if (employeeList?.length === 0) return

//     // Get current employee's code
//     const currentEmp = employeeList[currentEmployeeIndex]
//     const currentEmpCode = currentEmp?.employee_code || currentEmp?.emp_code || currentEmp?.code

//     if (currentEmpCode) {
//       // Create a sorted list of employees by employee_code
//       const sortedEmployees = [...employeeList].sort((a, b) => {
//         const codeA = a?.employee_code || a?.emp_code || a?.code
//         const codeB = b?.employee_code || b?.emp_code || b?.code

//         const numA = Number(codeA)
//         const numB = Number(codeB)
//         if (!isNaN(numA) && !isNaN(numB)) {
//           return numA - numB
//         }
//         return String(codeA).localeCompare(String(codeB))
//       })

//       // Find current position in sorted list
//       const currentSortedIndex = sortedEmployees.findIndex((emp) => {
//         const empCode = emp?.employee_code || emp?.emp_code || emp?.code
//         return String(empCode) === String(currentEmpCode)
//       })

//       if (currentSortedIndex >= 0) {
//         let nextSortedIndex = -1

//         if (direction === "next" && currentSortedIndex < sortedEmployees?.length - 1) {
//           nextSortedIndex = currentSortedIndex + 1
//         } else if (direction === "prev" && currentSortedIndex > 0) {
//           nextSortedIndex = currentSortedIndex - 1
//         }

//         if (nextSortedIndex >= 0) {
//           const nextEmployee = sortedEmployees[nextSortedIndex]
//           const nextEmployeeId = nextEmployee?.employee_id || nextEmployee?.id || nextEmployee?.employeeId

//           const nextArrayIndex = employeeList.findIndex((emp) => {
//             const empId = emp?.employee_id || emp?.id || emp?.employeeId
//             return empId === nextEmployeeId
//           })

//           if (nextArrayIndex >= 0) {
//             setCurrentEmployeeIndex(nextArrayIndex)
//             return
//           }
//         }
//       }
//     }

//     // Fallback to original array-based navigation if employee_code navigation fails
//     if (direction === "next") {
//       if (currentEmployeeIndex < employeeList?.length - 1) {
//         setCurrentEmployeeIndex(currentEmployeeIndex + 1)
//       } else if (currentPage < totalPages) {
//         setCurrentPage(currentPage + 1)
//         setCurrentEmployeeIndex(0)
//       }
//     } else {
//       if (currentEmployeeIndex > 0) {
//         setCurrentEmployeeIndex(currentEmployeeIndex - 1)
//       } else if (currentPage > 1) {
//         setCurrentPage(currentPage - 1)
//         setCurrentEmployeeIndex(PAGE_SIZE - 1)
//       }
//     }
//   }

//   const getCurrentEmployeeNumber = () => {
//     if (employeeList?.length > 0 && currentEmployeeIndex >= 0 && currentEmployeeIndex < employeeList?.length) {
//       const currentEmp = employeeList[currentEmployeeIndex]
//       const currentEmpCode = currentEmp?.employee_code || currentEmp?.emp_code || currentEmp?.code

//       if (currentEmpCode) {
//         const sortedEmployeeCodes = employeeList
//           .map((emp) => emp?.employee_code || emp?.emp_code || emp?.code)
//           .filter((code) => code != null)
//           .sort((a, b) => {
//             const numA = Number(a)
//             const numB = Number(b)
//             if (!isNaN(numA) && !isNaN(numB)) {
//               return numA - numB
//             }
//             return String(a).localeCompare(String(b))
//           })

//         const position = sortedEmployeeCodes.findIndex((code) => String(code) === String(currentEmpCode))
//         return position >= 0 ? position + 1 : (currentPage - 1) * PAGE_SIZE + currentEmployeeIndex + 1
//       }
//     }
//     return (currentPage - 1) * PAGE_SIZE + currentEmployeeIndex + 1
//   }

//   const canNavigateNext = () => {
//     if (employeeList?.length === 0) return false

//     const currentEmp = employeeList[currentEmployeeIndex]
//     const currentEmpCode = currentEmp?.employee_code || currentEmp?.emp_code || currentEmp?.code

//     if (currentEmpCode) {
//       const sortedEmployeeCodes = employeeList
//         .map((emp) => emp?.employee_code || emp?.emp_code || emp?.code)
//         .filter((code) => code != null)
//         .sort((a, b) => {
//           const numA = Number(a)
//           const numB = Number(b)
//           if (!isNaN(numA) && !isNaN(numB)) {
//             return numA - numB
//           }
//           return String(a).localeCompare(String(b))
//         })

//       const currentPosition = sortedEmployeeCodes.findIndex((code) => String(code) === String(currentEmpCode))
//       return currentPosition >= 0 && currentPosition < sortedEmployeeCodes?.length - 1
//     }

//     return currentEmployeeIndex < employeeList?.length - 1 || currentPage < totalPages
//   }

//   const canNavigatePrev = () => {
//     if (employeeList?.length === 0) return false

//     const currentEmp = employeeList[currentEmployeeIndex]
//     const currentEmpCode = currentEmp?.employee_code || currentEmp?.emp_code || currentEmp?.code

//     if (currentEmpCode) {
//       const sortedEmployeeCodes = employeeList
//         .map((emp) => emp?.employee_code || emp?.emp_code || emp?.code)
//         .filter((code) => code != null)
//         .sort((a, b) => {
//           const numA = Number(a)
//           const numB = Number(b)
//           if (!isNaN(numA) && !isNaN(numB)) {
//             return numA - numB
//           }
//           return String(a).localeCompare(String(b))
//         })

//       const currentPosition = sortedEmployeeCodes.findIndex((code) => String(code) === String(currentEmpCode))
//       return currentPosition > 0
//     }

//     return currentEmployeeIndex > 0 || currentPage > 1
//   }

//   const theme = useTheme() // use theme to drive container/background and text

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <Typography variant="h6">Loading employee data...</Typography>
//       </Box>
//     )
//   }

//   if (error) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <Typography variant="h6" color="error">
//           Error: {error}
//         </Typography>
//       </Box>
//     )
//   }

//   if (!employee) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <Typography variant="h6">No employee data found</Typography>
//       </Box>
//     )
//   }

//   return (
//     <Box
//       sx={{
//         padding: 2,
//         bgcolor: theme.palette.background.default,
//         minHeight: "100vh",
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 2,
//         }}
//       >
//         <Typography variant="h5" fontWeight="semibold" sx={{ p: 2, mb: 1, color: theme.palette.text.primary }}>
//           Employee Profile
//         </Typography>

//         <EmployeePagination
//           currentEmployee={getCurrentEmployeeNumber()}
//           totalEmployees={Math.max(totalEmployees, employeeList?.length)}
//           onPrevious={() => handleEmployeeNavigation("prev")}
//           onNext={() => handleEmployeeNavigation("next")}
//           canNavigatePrev={canNavigatePrev()}
//           canNavigateNext={canNavigateNext()}
//         />
//       </Box>

//       <Grid container spacing={1.5} alignItems="center">
//         <Grid item>
//           <ProfileImageCard imageUrl={employee.imageUrl} name={employee.name} />
//         </Grid>
//         <Grid item>
//           <EmployeeDetailsCard employee={employee} />
//         </Grid>
//         <Grid item>
//           <FamilyDetailsCard employee={employee} />
//         </Grid>
//         <Grid item>
//           <AttendancePerformanceCard employee={employee} />
//         </Grid>
//       </Grid>
//     </Box>
//   )
// }







"use client"

import { useEffect, useRef, useState } from "react"
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Grid,
  Button,
  useTheme, // add useTheme for adaptive theming
} from "@mui/material"
import { Dot, ChevronLeft, ChevronRight } from "lucide-react"
import { useLocation } from "react-router-dom"
import { MAIN_URL } from "../../../Configurations/Urls"
import useAuthStore from "../../../Zustand/Store/useAuthStore"

/**
 * Capitalizes the first letter of each word in a string
 */
function capitalizeWords(str) {
  if (!str || typeof str !== "string") return "N/A"
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Calculates age from date of birth
 */
function calculateAge(dob) {
  if (!dob) return "N/A"
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age >= 0 ? age : "N/A"
}

/**
 * Converts 24-hour time format to 12-hour format
 */
function formatTime24to12(time24) {
  if (!time24 || typeof time24 !== "string") return "N/A"
  const [hh, mm] = time24.split(":")
  const hour = Number.parseInt(hh, 10)
  if (isNaN(hour) || !mm) return "N/A"
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  return `${hour12}:${mm} ${ampm}`
}

/**
 * Calculates tenure since joining date in a human-readable format
 */
function getTenureSinceJoining(joinDateStr) {
  if (!joinDateStr) return "N/A"

  const joinDate = new Date(joinDateStr)
  if (isNaN(joinDate.getTime())) return "N/A"

  const today = new Date()

  let years = today.getFullYear() - joinDate.getFullYear()
  let months = today.getMonth() - joinDate.getMonth()
  let days = today.getDate() - joinDate.getDate()

  // Adjust for negative days
  if (days < 0) {
    months--
    // Get days in previous month
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += prevMonth.getDate()
  }

  // Adjust for negative months
  if (months < 0) {
    years--
    months += 12
  }

  if (years > 0 && months > 0) {
    return `${years} Year${years > 1 ? "s" : ""} ${months} Month${months > 1 ? "s" : ""}`
  }
  if (years > 0) {
    return `${years} Year${years > 1 ? "s" : ""}`
  }
  if (months > 0) {
    return `${months} Month${months > 1 ? "s" : ""}`
  }
  if (days > 1) {
    return `${days} Days`
  }
  if (days === 1) {
    return "1 Day"
  }
  if (days === 0) {
    return "Today"
  }

  return "N/A"
}

const EmployeePagination = ({
  currentEmployee,
  totalEmployees,
  onPrevious,
  onNext,
  canNavigatePrev,
  canNavigateNext,
}) => {
  const theme = useTheme() // useTheme for colors

  const buttonStyles = {
    minWidth: "100px",
    textTransform: "none",
    borderColor: theme.palette.divider, // adaptive border color
    "&:hover": {
      borderColor: theme.palette.divider, // adaptive hover border
      backgroundColor: theme.palette.action.hover, // adaptive hover background
    },
    "&:disabled": {
      borderColor: theme.palette.action.disabledBackground, // adaptive disabled border
      color: theme.palette.text.disabled, // adaptive disabled text
    },
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="body2" sx={{ color: "text.secondary", minWidth: "120px" }}>
        Employee {currentEmployee} of {totalEmployees}
      </Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={onPrevious}
          disabled={!canNavigatePrev}
          startIcon={<ChevronLeft size={16} />}
          sx={{
            ...buttonStyles,
            color: !canNavigatePrev ? theme.palette.text.disabled : theme.palette.text.primary, // adaptive text color
          }}
        >
          Prev Emp
        </Button>

        <Button
          variant="outlined"
          size="small"
          onClick={onNext}
          disabled={!canNavigateNext}
          endIcon={<ChevronRight size={16} />}
          sx={{
            ...buttonStyles,
            color: !canNavigateNext ? theme.palette.text.disabled : theme.palette.text.primary, // adaptive text color
          }}
        >
          Next Emp
        </Button>
      </Box>
    </Box>
  )
}

const ProfileImageCard = ({ imageUrl, name }) => {
  const theme = useTheme() // useTheme for adaptive theming

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 400,
        width: 420,
        minWidth: 180,
        bgcolor: theme.palette.background.paper, // use theme-based paper background instead of hard-coded white
      }}
    >
      <Avatar
        alt={typeof name === "string" ? name : ""}
        src={typeof imageUrl === "string" ? imageUrl : ""}
        sx={{
          width: 300,
          height: 300,
          border: "6px solid",
          borderColor: theme.palette.divider, // use divider token for border color
        }}
      />
    </Card>
  )
}

const EmployeeDetailsCard = ({ employee }) => {
  const theme = useTheme() // useTheme for adaptive theming

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        padding: 3,
        width: 420,
        bgcolor: theme.palette.background.paper,
        height: 400,
        display: "flex",
        alignItems: "center",
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold">
          {typeof employee.name === "string" ? capitalizeWords(employee.name) : "N/A"}
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1.2 }}>
          {typeof employee.designation === "string" ? capitalizeWords(employee.designation) : "N/A"}
        </Typography>
        <Typography variant="subtitle2">
          {typeof employee.department === "string" ? capitalizeWords(employee.department) : "N/A"}
        </Typography>
        <Typography variant="subtitle2">
          {typeof employee.location === "string" ? capitalizeWords(employee.location) : "N/A"}
        </Typography>

        <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.2 }}>
          {typeof employee.organization === "string" ? capitalizeWords(employee.organization) : "N/A"}
        </Typography>
        <Typography variant="subtitle2">
          {typeof employee.division === "string" ? capitalizeWords(employee.division) : "Division N/A"}
        </Typography>

        <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.2 }}>
          With us for: {typeof employee.withUsFor === "string" ? employee.withUsFor : "N/A"}
        </Typography>
        <Typography variant="subtitle2">
          Total Experience: {employee.totalExperience || "N/A"} ({employee.organizations || "N/A"} Organizations)
        </Typography>

        <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.2 }}>
          Current CTC {typeof employee.currentCtc === "string" ? employee.currentCtc : "N/A"}
        </Typography>
        <Typography variant="subtitle2">
          Last Increment {typeof employee.lastIncrement === "string" ? capitalizeWords(employee.lastIncrement) : "N/A"}{" "}
          on {employee.incrementDate || "N/A"}
        </Typography>

        <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.2 }}>
          Day {typeof employee.workingHours === "string" ? employee.workingHours : "N/A"}{" "}
          <Dot
            size="30px"
            color={
              employee?.isClockedOut
                ? theme.palette.error.main
                : employee?.isClockedIn
                  ? theme.palette.success.main
                  : theme.palette.error.main
            }
          />
        </Typography>
        <Typography variant="subtitle2">
          {employee.workshiftType} | {employee.workshift}
        </Typography>
      </CardContent>
    </Card>
  )
}


const OtherDetailsCard = ({ employee }) => {
  const theme = useTheme() // Declare theme variable

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        padding: 3,
        bgcolor: theme.palette.background.paper,
        height: 400,
        width: 420,
        display: "flex",
        alignItems: "flex-start",
        overflow: "auto",
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 3 }}>
          Age {employee.age || "N/A"} Years
        </Typography>
        <Typography variant="subtitle2">
          {typeof employee.maritalStatus === "string" ? capitalizeWords(employee.maritalStatus) : "N/A"}
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 1.2, fontWeight: "bold" }}>
          {typeof employee.education === "string" ? capitalizeWords(employee.education) : "N/A"}
        </Typography>
        <Typography variant="subtitle2">
          {typeof employee.college === "string" ? capitalizeWords(employee.college) : "N/A"}
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 1.2, fontWeight: "bold" }}>
          Recruitment Source:{" "}
          {typeof employee.recruitmentSource === "string" ? capitalizeWords(employee.recruitmentSource) : "N/A"}
        </Typography>
        <Typography variant="subtitle2">Joining Year: {employee.joiningYear || "N/A"}</Typography>

        <Typography variant="subtitle2">
          {typeof employee.housingStatus === "string" ? capitalizeWords(employee.housingStatus) : "N/A"}
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 1.2 }}>
          <b>Reporting Manager:</b> {employee.manager || "N/A"}
        </Typography>
      </CardContent>
    </Card>
  )
}

const FamilyDetailsCard = ({ employee }) => {
  const theme = useTheme() // Declare theme variable

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        padding: 3,
        bgcolor: theme.palette.background.paper,
        height: 400,
        width: 420,
        display: "flex",
        alignItems: "flex-start",
        overflow: "auto",
      }}
    >
      <CardContent>


        <Typography variant="subtitle2" sx={{ mt: 1.2, fontWeight: "bold" }}>
          Family {employee.familyMembers || 0} Members {employee.dependents || 0} Dependent
        </Typography>

        {employee.familyMembersList && employee.familyMembersList?.length > 0 ? (
          <Box sx={{ mt: 1 }}>
            {employee.familyMembersList.map((member, index) => (
              <Typography key={index} variant="subtitle2" sx={{ mt: 0.5, pl: 1 }}>
                • {member.name} ({member.relation}) - Age: {member.age || "N/A"}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="subtitle2">
            {typeof employee.livingWith === "string" ? capitalizeWords(employee.livingWith) : "N/A"}
          </Typography>
        )}

        <Typography variant="subtitle2" sx={{ mt: 1.2 }}>
          <b>Home Town:</b> {typeof employee.homeTown === "string" ? capitalizeWords(employee.homeTown) : "N/A"}
        </Typography>
        <Typography variant="subtitle2">
          {typeof employee.housingStatus === "string" ? capitalizeWords(employee.housingStatus) : "N/A"}
        </Typography>

      </CardContent>
    </Card>
  )
}

const AttendancePerformanceCard = ({ employee }) => {
  const theme = useTheme() // Declare theme variable

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        padding: 3,
        bgcolor: theme.palette.background.paper,
        height: 400,
        width: 420,
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
          Current Month Attendance
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1.2 }}>
          Attendance: {employee.attendance || "N/A"}%
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 1.2 }}>
          Leaves: {employee.leaves || "N/A"}
        </Typography>
      </CardContent>
    </Card>
  )
}
const FunctionalRoleCard = ({ employee }) => {
  const theme = useTheme() // Declare theme variable

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        padding: 3,
        bgcolor: theme.palette.background.paper,
        height: 400,
        width: 420,
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
          
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1.2 }}>
         
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 1.2 }}>
       
        </Typography>
      </CardContent>
    </Card>
  )
}

function mapEmployeeData(emp, userData) {
  const location = emp.address
    ? [emp.address.address_line1, emp.address.address_line2, emp.address.address_line3].filter(Boolean).join(", ")
    : "N/A"

  const workingHours =
    emp.workshift?.work_shift_start_time && emp.workshift?.work_shift_end_time
      ? `${formatTime24to12(emp.workshift.work_shift_start_time)} - ${formatTime24to12(emp.workshift.work_shift_end_time)}`
      : "N/A"

  const age = emp.date_of_birth ? calculateAge(emp.date_of_birth) : "N/A"
  const joinYear = emp.date_of_joining ? new Date(emp.date_of_joining).getFullYear() : null

  let totalExperience = "N/A"
  if (emp.experience?.start_date) {
    const joinDate = new Date(emp.experience?.start_date)
    const today = new Date()

    let years = today.getFullYear() - joinDate.getFullYear()
    let months = today.getMonth() - joinDate.getMonth()
    let days = today.getDate() - joinDate.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += prevMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    if (years > 0 && months > 0) {
      totalExperience = `${years} Years ${months} Months`
    } else if (years > 0) {
      totalExperience = `${years} Years`
    } else if (months > 0) {
      totalExperience = `${months} Months`
    } else if (days > 0) {
      totalExperience = `${days} Days`
    } else {
      totalExperience = "Today"
    }
  }

  const withUsFor = getTenureSinceJoining(emp.date_of_joining)

  const familyMembersList = []
  let familyMembersCount = 0
  let dependentsCount = 0

  if (emp.family) {
    if (Array.isArray(emp.family)) {
      familyMembersCount = emp.family?.length
      dependentsCount = emp.family.filter((member) => member.is_dependent || member.dependent)?.length
    } else if (typeof emp.family === "object") {
      familyMembersCount = 1
      dependentsCount = emp.family.is_dependent || emp.family.dependent ? 1 : 0
    }
  }

  if (emp.family_members && Array.isArray(emp.family_members)) {
    familyMembersCount = emp.family_members?.length
    dependentsCount = emp.family_members.filter((member) => member.is_dependent || member.dependent)?.length
  }

  const safeString = (val) => (typeof val === "string" ? val : "N/A")

  function getHighestEducation(educationArray) {
    if (!Array.isArray(educationArray) || educationArray?.length === 0) {
      return "Education N/A"
    }
    for (let i = educationArray?.length - 1; i >= 0; i--) {
      const item = educationArray[i]
      if (Array.isArray(item.degree) && item.degree?.length > 0 && item.degree[0].education_degree_name) {
        return `${item.degree[0].education_degree_name}`
      }
    }
    return educationArray[educationArray?.length - 1].institute_name || "Education N/A"
  }

  function getWorkshiftLabel(workModel) {
    if (workModel) {
      return `${workModel}`
    } else {
      return "Workshift N/A"
    }
  }

  function getWorkshiftType(employmentType) {
    if (employmentType) {
      return `${employmentType}`
    } else return "Workshift N/A"
  }

  const attendanceTypeRaw =
    emp?.today_latest_attendance?.attendance_log_type ??emp?.today_latest_attendance?.log_type ??""
  const attendanceTypeLower = typeof attendanceTypeRaw === "string" ? attendanceTypeRaw.toLowerCase() : ""

  const isClockedIn =
    attendanceTypeLower.includes("clock in") ||
    attendanceTypeLower.includes("break start") ||
    attendanceTypeLower.includes("break end")
  const isClockedOut = attendanceTypeLower.includes("clock out")

  const organizationsCountFromApi =
    typeof emp.organizations_count === "number"
      ? emp.organizations_count
      : typeof emp.total_organizations === "number"
        ? emp.total_organizations
        : typeof emp.unique_organizations_count === "number"
          ? emp.unique_organizations_count
          : typeof emp.organizations === "number"
            ? emp.organizations
            : null

  // Count unique organizations from experience array
  const organizationsCount =
    organizationsCountFromApi ?.
    (Array.isArray(emp.experience)
      ? new Set(emp.experience.map((exp) => exp?.organization_name).filter(Boolean)).size
      : emp.experience && emp.experience.organization_name
        ? 1
        : 0)

  return {
    imageUrl: safeString(emp.profile_image_url),
    name: [emp.first_name, emp.middle_name, emp.last_name].filter(Boolean).join(" "),
    designation: emp.designation?.designation_name || "N/A",
    department: emp.department_location?.[0]?.department?.department_name || "N/A",
    location: "Amritsar",
    division: "Division N/A",
    totalExperience,
    organizations: organizationsCount || "",
    currentCtc: emp.experience?.current_amount ? `₹${emp.experience.current_amount}` : "N/A",
    lastIncrement: safeString(emp.last_increment_amount) || "N/A",
    incrementDate: safeString(emp.last_increment_date) || "N/A",
    workingHours,
    workshift: getWorkshiftLabel(emp.workmodel?.work_model_name),
    workshiftType: getWorkshiftType(emp.employemnettype?.employment_type_name),
    age,
    maritalStatus: safeString(emp.marital_status) || "N/A",
    education: getHighestEducation(emp.education),
    college:
      Array.isArray(emp?.education) && emp.education?.length > 0
        ? emp.education[emp.education?.length - 1]?.institute_name || "College N/A"
        : "College N/A",
    recruitmentSource: safeString(emp?.occupation_details) || "N/A",
    joiningYear: joinYear || "N/A",
    familyMembers: familyMembersCount,
    dependents: dependentsCount,
    familyMembersList: familyMembersList,
    livingWith: "",
    homeTown: location,
    housingStatus: emp.address?.residential_owner_type.residential_ownership_type_name || "Housing N/A",
    manager:
      [emp.manager?.first_name, emp.manager?.middle_name, emp.manager?.last_name].filter(Boolean).join(" ") || "N/A",
    attendance: "",
    leaves: "Leaves N/A",
    organization: userData?.organization?.organization_name || "N/A",
    withUsFor,
    isClockedIn,
    isClockedOut,
  }
}

export default function EmployeeProfile() {
  const location = useLocation()
  const search = (location && location.search) || (typeof window !== "undefined" ? window.location.search : "")
  const params = new URLSearchParams(search)

  const navState = location?.state ??{}
  const urlId = params.get("id")
  const urlPage = Number(params.get("page"))
  const urlIndex = Number(params.get("index"))
  const urlPageSize = Number(params.get("pageSize"))

  const getStored = (key, def) => {
    if (typeof window === "undefined") return def
    const v = window.localStorage.getItem(key)
    const n = v ? Number.parseInt(v, 10) : Number.NaN
    return Number.isFinite(n) ? n : def
  }

  const targetEmployeeId =
    urlId ??(typeof window !== "undefined" ? window.localStorage.getItem("selectedEmployeeId") : null) ??null

  const [apiUrl, setApiUrl] = useState(null)
  const [employeeList, setEmployeeList] = useState([])
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [currentPage, setCurrentPage] = useState(() => {
    if (Number.isFinite(urlPage) && urlPage > 0) return urlPage
    if (typeof navState?.page === "number" && navState.page > 0) return navState.page
    return getStored("employeeCurrentPage", 1)
  })

  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(() => {
    if (Number.isFinite(urlIndex) && urlIndex >= 0) return urlIndex
    if (typeof navState?.index === "number" && navState.index >= 0) return navState.index
    return getStored("employeeCurrentIndex", 0)
  })

  const [totalPages, setTotalPages] = useState(1)
  const [totalEmployees, setTotalEmployees] = useState(0)

  const PAGE_SIZE =
    (Number.isFinite(urlPageSize) && urlPageSize > 0
      ? urlPageSize
      : typeof navState?.pageSize === "number" && navState.pageSize > 0
        ? navState.pageSize
        : typeof window !== "undefined"
          ? Number.parseInt(localStorage.getItem("employeePageSize") || "", 10)
          : Number.NaN) || 10

  const { userData } = useAuthStore()
  const selectedEmployee = navState?.employee
  const passedEmployees = Array.isArray(navState?.employees) ? navState.employees : null

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("employeeCurrentPage", String(currentPage))
    }
  }, [currentPage])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("employeeCurrentIndex", String(currentEmployeeIndex))
      if (selectedEmployee) {
        const id =
          selectedEmployee?.employee_id ?.
          selectedEmployee?.id ?.
          selectedEmployee?.employeeId ?.
          selectedEmployee?.emp_code ?.
          selectedEmployee?.code
        if (id != null) localStorage.setItem("selectedEmployeeId", String(id))
      }
    }
  }, [currentEmployeeIndex, selectedEmployee])

  const navAppliedRef = useRef(false)

  useEffect(() => {
    if (navAppliedRef.current) return

    if (selectedEmployee) {
      if (passedEmployees?.length) {
        const safeIdx =
          typeof navState?.index === "number" && navState.index >= 0
            ? Math.min(navState.index, passedEmployees?.length - 1)
            : 0
        setEmployeeList(passedEmployees)
        setCurrentEmployeeIndex(safeIdx)
        setEmployee(mapEmployeeData(passedEmployees[safeIdx], userData))
        const tc = typeof navState?.totalCount === "number" ? navState.totalCount : passedEmployees?.length
        const tp =
          typeof navState?.totalPages === "number" ? navState.totalPages : Math.max(1, Math.ceil(tc / PAGE_SIZE))
        setTotalEmployees(tc)
        setTotalPages(tp)
        navAppliedRef.current = true
        setLoading(false)
        return
      } else {
        setEmployeeList([selectedEmployee])
        setCurrentEmployeeIndex(0)
        setEmployee(mapEmployeeData(selectedEmployee, userData))
        setTotalEmployees(typeof navState?.totalCount === "number" ? navState.totalCount : 1)
        setTotalPages(typeof navState?.totalPages === "number" ? navState.totalPages : 1)
        navAppliedRef.current = true
        setLoading(false)
        return
      }
    }

    navAppliedRef.current = true
  }, [
    selectedEmployee,
    passedEmployees,
    navState?.index,
    navState?.totalCount,
    navState?.totalPages,
    PAGE_SIZE,
    userData,
  ])

  useEffect(() => {
    if (!userData?.organization?.organization_id) return
    const url = `${MAIN_URL}/api/organization/${userData.organization.organization_id}/employee-all`
    setApiUrl(url)
  }, [userData?.organization?.organization_id])

  useEffect(() => {
    if (!apiUrl) return
    if (passedEmployees?.length && navState?.page === currentPage) return

    const getId = (e) => e?.employee_id ??e?.id ??e?.employeeId ??e?.emp_code ??e?.code ??null

    const fetchEmployees = async () => {
      setLoading(true)
      try {
        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

        const data = await res.json()
        let employees = data.employees || data
        const totalCount = data.totalCount || 0

        employees = [...employees].sort((a, b) => {
          const idA = a.employee_id || a.id || 0
          const idB = b.employee_id || b.id || 0
          return idB - idA
        })

        setEmployeeList(employees)
        setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)))
        setTotalEmployees(totalCount || employees?.length)

        let idx = 0
        if (targetEmployeeId) {
          const foundIndex = employees.findIndex((e) => String(getId(e)) === String(targetEmployeeId))
          if (foundIndex >= 0) idx = foundIndex
        }
        setCurrentEmployeeIndex(idx)
        const chosen = employees[idx] || employees[0]

        if (chosen) {
          setEmployee(mapEmployeeData(chosen, userData))
        }
      } catch (err) {
        setError(err?.message || "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [apiUrl, passedEmployees, navState?.page, PAGE_SIZE, targetEmployeeId, userData, currentPage])

  useEffect(() => {
    if (employeeList?.length > 0 && currentEmployeeIndex >= 0 && currentEmployeeIndex < employeeList?.length) {
      setEmployee(mapEmployeeData(employeeList[currentEmployeeIndex], userData))
    }
  }, [currentEmployeeIndex, employeeList, userData])

  const handleEmployeeNavigation = (direction) => {
    if (employeeList?.length === 0) return

    // Get current employee's code
    const currentEmp = employeeList[currentEmployeeIndex]
    const currentEmpCode = currentEmp?.employee_code || currentEmp?.emp_code || currentEmp?.code

    if (currentEmpCode) {
      // Create a sorted list of employees by employee_code
      const sortedEmployees = [...employeeList].sort((a, b) => {
        const codeA = a?.employee_code || a?.emp_code || a?.code
        const codeB = b?.employee_code || b?.emp_code || b?.code

        const numA = Number(codeA)
        const numB = Number(codeB)
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB
        }
        return String(codeA).localeCompare(String(codeB))
      })

      // Find current position in sorted list
      const currentSortedIndex = sortedEmployees.findIndex((emp) => {
        const empCode = emp?.employee_code || emp?.emp_code || emp?.code
        return String(empCode) === String(currentEmpCode)
      })

      if (currentSortedIndex >= 0) {
        let nextSortedIndex = -1

        if (direction === "next" && currentSortedIndex < sortedEmployees?.length - 1) {
          nextSortedIndex = currentSortedIndex + 1
        } else if (direction === "prev" && currentSortedIndex > 0) {
          nextSortedIndex = currentSortedIndex - 1
        }

        if (nextSortedIndex >= 0) {
          const nextEmployee = sortedEmployees[nextSortedIndex]
          const nextEmployeeId = nextEmployee?.employee_id || nextEmployee?.id || nextEmployee?.employeeId

          const nextArrayIndex = employeeList.findIndex((emp) => {
            const empId = emp?.employee_id || emp?.id || emp?.employeeId
            return empId === nextEmployeeId
          })

          if (nextArrayIndex >= 0) {
            setCurrentEmployeeIndex(nextArrayIndex)
            return
          }
        }
      }
    }

    // Fallback to original array-based navigation if employee_code navigation fails
    if (direction === "next") {
      if (currentEmployeeIndex < employeeList?.length - 1) {
        setCurrentEmployeeIndex(currentEmployeeIndex + 1)
      } else if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1)
        setCurrentEmployeeIndex(0)
      }
    } else {
      if (currentEmployeeIndex > 0) {
        setCurrentEmployeeIndex(currentEmployeeIndex - 1)
      } else if (currentPage > 1) {
        setCurrentPage(currentPage - 1)
        setCurrentEmployeeIndex(PAGE_SIZE - 1)
      }
    }
  }

  const getCurrentEmployeeNumber = () => {
    if (employeeList?.length > 0 && currentEmployeeIndex >= 0 && currentEmployeeIndex < employeeList?.length) {
      const currentEmp = employeeList[currentEmployeeIndex]
      const currentEmpCode = currentEmp?.employee_code || currentEmp?.emp_code || currentEmp?.code

      if (currentEmpCode) {
        const sortedEmployeeCodes = employeeList
          .map((emp) => emp?.employee_code || emp?.emp_code || emp?.code)
          .filter((code) => code != null)
          .sort((a, b) => {
            const numA = Number(a)
            const numB = Number(b)
            if (!isNaN(numA) && !isNaN(numB)) {
              return numA - numB
            }
            return String(a).localeCompare(String(b))
          })

        const position = sortedEmployeeCodes.findIndex((code) => String(code) === String(currentEmpCode))
        return position >= 0 ? position + 1 : (currentPage - 1) * PAGE_SIZE + currentEmployeeIndex + 1
      }
    }
    return (currentPage - 1) * PAGE_SIZE + currentEmployeeIndex + 1
  }

  const canNavigateNext = () => {
    if (employeeList?.length === 0) return false

    const currentEmp = employeeList[currentEmployeeIndex]
    const currentEmpCode = currentEmp?.employee_code || currentEmp?.emp_code || currentEmp?.code

    if (currentEmpCode) {
      const sortedEmployeeCodes = employeeList
        .map((emp) => emp?.employee_code || emp?.emp_code || emp?.code)
        .filter((code) => code != null)
        .sort((a, b) => {
          const numA = Number(a)
          const numB = Number(b)
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB
          }
          return String(a).localeCompare(String(b))
        })

      const currentPosition = sortedEmployeeCodes.findIndex((code) => String(code) === String(currentEmpCode))
      return currentPosition >= 0 && currentPosition < sortedEmployeeCodes?.length - 1
    }

    return currentEmployeeIndex < employeeList?.length - 1 || currentPage < totalPages
  }

  const canNavigatePrev = () => {
    if (employeeList?.length === 0) return false

    const currentEmp = employeeList[currentEmployeeIndex]
    const currentEmpCode = currentEmp?.employee_code || currentEmp?.emp_code || currentEmp?.code

    if (currentEmpCode) {
      const sortedEmployeeCodes = employeeList
        .map((emp) => emp?.employee_code || emp?.emp_code || emp?.code)
        .filter((code) => code != null)
        .sort((a, b) => {
          const numA = Number(a)
          const numB = Number(b)
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB
          }
          return String(a).localeCompare(String(b))
        })

      const currentPosition = sortedEmployeeCodes.findIndex((code) => String(code) === String(currentEmpCode))
      return currentPosition > 0
    }

    return currentEmployeeIndex > 0 || currentPage > 1
  }

  const theme = useTheme() // use theme to drive container/background and text

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6">Loading employee data...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    )
  }

  if (!employee) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6">No employee data found</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        padding: 2,
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="semibold" sx={{ p: 2, mb: 1, color: theme.palette.text.primary }}>
          Employee Profile
        </Typography>

        <EmployeePagination
          currentEmployee={getCurrentEmployeeNumber()}
          totalEmployees={Math.max(totalEmployees, employeeList?.length)}
          onPrevious={() => handleEmployeeNavigation("prev")}
          onNext={() => handleEmployeeNavigation("next")}
          canNavigatePrev={canNavigatePrev()}
          canNavigateNext={canNavigateNext()}
        />
      </Box>

      <Grid container spacing={1.5} alignItems="center">
        <Grid item>
          <ProfileImageCard imageUrl={employee.imageUrl} name={employee.name} />
        </Grid>
        <Grid item>
          <EmployeeDetailsCard employee={employee} />
        </Grid>
        <Grid item>
          <OtherDetailsCard employee={employee} />
        </Grid>
        <Grid item>
          <FamilyDetailsCard employee={employee} />
        </Grid>
        <Grid item>
          <AttendancePerformanceCard employee={employee} />
        </Grid>
        <Grid item>
          <FunctionalRoleCard employee={employee} />
        </Grid>
      </Grid>
    </Box>
  )
}

