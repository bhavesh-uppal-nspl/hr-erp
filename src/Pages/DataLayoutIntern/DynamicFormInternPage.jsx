// src/Pages/SystemModules/DynamicFormPage.jsx
import React, { useState, useEffect } from "react";

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

import { MAIN_URL } from "../../Configurations/Urls";
import BusinessIcon from "@mui/icons-material/Business";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import axios from "axios";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import DocumentForm from "../DocumentRecord/Documents/DocumentForm";
import DocumentForm1 from "../DocumentRecord/Documents/DocumentForm1";
import Header from "../DataLayouts/Header";
import InternForm from "../InternManagement/Interns/InternForm";
import InternLanguageForm from "../InternManagement/InternLanguages/InternLanguageForm";
import InternEducationForm from "../InternManagement/InternEducation/InternEducationForm";
import InternFamilyMemberForm from "../InternManagement/InternFamily/InternFamilyMemberForm";
import InterAddressForm from "../InternManagement/InternAddress/InterAddressForm";
import InternContactForm from "../InternManagement/InternContact/InternContactForm";
import InternExperience from "../InternManagement/InternExperience/InternExperience";
import InterPaymentMethod from "../InternManagement/InternPaymentStipend/InterPaymentMethod";
import InternMedicalForm from "../InternManagement/InternMedical/InternMedicalForm";
import SubmitButtonIntern from "./SubmitButtonIntern";
import AccordionFormLayout from "../DataLayouts/AccordionFormLayout";
 import useInternDataStore from "../../Zustand/Store/useInternDataStore";
import AccordionFormLayout1 from "./AccordianFormLayout1";
const sections = [
  {
    id: "Profile",
    title: "Profile",
    customComponent: InternForm,
  },
  {
    id: "Education",
    title: "Education",
    customComponent: InternEducationForm,
  },
  {
    id: "Languages",
    title: "Languages",
    customComponent: InternLanguageForm,
  },
  {
    id: "Family",
    title: "Family",
    customComponent: InternFamilyMemberForm,
  },
  {
    id: "Addresses",
    title: "Addresses",
    customComponent: InterAddressForm,
  },
  {
    id: "Contacts",
    title: "Contacts",
    customComponent: InternContactForm,
  },
  {
    id: "Experiences",
    title: "Experiences",
    customComponent: InternExperience,
  },
  {
    id: "Medical",
    title: "Medical",
    customComponent: InternMedicalForm,
  },
  {
    id: "Payment Methods",
    title: "Payment Methods",
    customComponent: InterPaymentMethod,
  },
   {
    id: "Document Records",
    title: "Document Records",
    customComponent: DocumentForm1,
  },
];

const DynamicFormInternPage = ({ mode }) => {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const internStore =useInternDataStore()


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
    } catch (error) {
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
    } catch (error) {
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
              updateMessage={"Interns"}
              addMessage={"Interns"}
              homeLink={"/organization/intern/intern-details"}
              homeText={"Interns"}
            />
            <AccordionFormLayout1 sections={sections} mode={mode} />
            <SubmitButtonIntern mode={mode} />
          </>
        )}
      </>
    )}
  </Box>
);



};

export default DynamicFormInternPage;
