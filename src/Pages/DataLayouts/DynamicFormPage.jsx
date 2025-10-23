
import React, { useState, useEffect } from "react";
import AccordionFormLayout from "./AccordionFormLayout";
import EmployeeForm from "../EmployeeManagement/Employees/EmployeesForm";
import EmployeeContactForm from "../EmployeeManagement/EmployeeContactDetails/EmployeeContactForm";
import EmployeeAddressForm from "../EmployeeManagement/EmployeeAddress/EmployeeAddressForm";
import EmployeeEducationForm from "../EmployeeManagement/EmployeeEducation/EmployeeEducationForm";
import EmployeeLanguageForm from "../EmployeeManagement/EmployeeLanguage/EmployeeLanguageForm";
import EmployementExperienceForm from "../EmployeeManagement/EmployeeExperience/EmployementExperienceForm";
import EmployeeFamilyMemberForm from "../EmployeeManagement/EmployeeFamilyMember/EmployeeFamilyMemberForm";
import EmployeeMedicalForm from "../EmployeeManagement/EmployeeMedical/EmployeeMedicalForm";
import EmployeeBankForm from "../EmployeeManagement/EmployeeBankDetails/EmployeeBankForm";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import SubmitButton from "./SubmitButton";
import Header from "./Header";
import { MAIN_URL } from "../../Configurations/Urls";
import BusinessIcon from "@mui/icons-material/Business";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import axios from "axios";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import DocumentForm1 from "../DocumentRecord/Documents/DocumentForm1";
const sections = [
  {
    id: "Profile",
    title: "Profile",
    customComponent: EmployeeForm,
  },
  {
    id: "Education",
    title: "Education",
    customComponent: EmployeeEducationForm,
  },
  {
    id: "Languages",
    title: "Languages",
    customComponent: EmployeeLanguageForm,
  },
  {
    id: "Family",
    title: "Family",
    customComponent: EmployeeFamilyMemberForm,
  },
  {
    id: "Addresses",
    title: "Addresses",
    customComponent: EmployeeAddressForm,
  },
  {
    id: "Contacts",
    title: "Contacts",
    customComponent: EmployeeContactForm,
  },
  {
    id: "Experiences",
    title: "Experiences",
    customComponent: EmployementExperienceForm,
  },
  {
    id: "Medical",
    title: "Medical",
    customComponent: EmployeeMedicalForm,
  },
  {
    id: "Payment Methods",
    title: "Payment Methods",
    customComponent: EmployeeBankForm,
  },
  {
    id: "Documents",
    title: "Documents",
    customComponent: DocumentForm1,
  },
];

const DynamicFormPage = ({ mode }) => {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
 const [mainLoading, setMainLoading] = useState(mode === "add" ? 0 : 2);

  const fetchdepartments = () => {
    try {
      axios
        .get(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/department`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setDepartment(response?.data?.Departments);
          // setDepartment([]);
          setMainLoading((prev) => prev + 1);
        });
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.log("error is :", error);
    }
  };

  const fetchdesignation = () => {
    try {
      axios
        .get(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/designation`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setDesignation(response?.data?.organizationdesignation);
          // setDesignation([]);
          setMainLoading((prev) => prev + 1);
        });
    } catch (error) { if (error.response && error.response.status === 401) {
  toast.error("Session Expired!");
  window.location.href = "/login";
}
      console.log("error is :", error);
    }
  };


  let navigate = useNavigate();

  useEffect(() => {
    if (mode == "add") {
      fetchdesignation();
      fetchdepartments();
    } else {
      setMainLoading(2);
    }
  }, [mode]);


return (
  <Box px={4} py={4}>
     {mainLoading < 2 ? (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100px"
      >
        <CircularProgress />
      </Box>
    ) : (
      <>
        {mode == "add" && (department?.length == 0 || designation?.length == 0) ? (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              maxWidth: 600,
              mx: "auto",
              borderRadius: 3,
              backgroundColor: "#f8f9fa",
              border: "1px solid #ddd",
            }}
          >
            <Typography variant="h5" gutterBottom color="text.primary">
              Required Organizational Setup Missing
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={2}>
              Please add missing departments or designations before continuing.
            </Typography>

            {/* Department Section */}
            <Box display="flex" justifyContent="center" gap={2} my={3}>
              {department?.length == 0 && (
                <>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <BusinessIcon color="error" sx={{ fontSize: 40 }} />
                    <Typography variant="body1" color="text.secondary">
                      No departments found
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/organization/departments")}
                  >
                    Go to Department Page
                  </Button>
                </>
              )}
            </Box>

            {/* Designation Section */}
            <Box display="flex" justifyContent="center" gap={2} my={3}>
              {designation?.length == 0 && (
                <>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <WorkOutlineIcon color="warning" sx={{ fontSize: 40 }} />
                    <Typography variant="body1" color="text.secondary">
                      No designations found
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/organization/designation")}
                  >
                    Go to Designation Page
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        ) : (
          <>
            <Header
              mode={mode}
              updateMessage={"Employee"}
              addMessage={"Employee"}
              homeLink={"/organization/employee/employee-details"}
              homeText={"Employees"}
            />
            <AccordionFormLayout sections={sections} mode={mode} />
            <SubmitButton mode={mode} />
          </>
        )}
      </>
    )}
  </Box>
);






};

export default DynamicFormPage;
