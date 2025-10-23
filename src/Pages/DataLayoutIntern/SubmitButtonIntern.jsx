import { Button, Grid } from "@mui/material";
import axios from "axios";
import { MAIN_URL } from "../../Configurations/Urls";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import useInternDataStore from "../../Zustand/Store/useInternDataStore";

const SubmitButtonIntern = ({ mode }) => {
  let {
    Intern,
    setInternErrors,
    setLanguageErrors,
    setEducationError,
    setFamilyError,
    setAddressError,
    setContactError,
    setExperienceError,
    setMedicalError,
    setPaymentMethodError,
    Education,
    EducationErrors,
    LanguageErrors,
    FamilyErrors,
    AddressErrors,
    ContactErrors,
    ExperienceErrors,
    MedicalErrors,
    PaymentMethodErrors,
    Language,
    setIntern,
    Family,
    Address,
    Contact,
    Experience,
    Medical,
    PaymentMethod,
    resetData,
    setEducation,
    setLanguage,
    setFamily,
    setAddress,
    setContact,
    setExperience,
    setMedical,
    setPaymentMethod,
    DocumentErrors,
    setDocument,
    Document,
    setDocumentError,
  } = useInternDataStore();

  const { userData } = useAuthStore();
  const org = userData?.organization;

  let navigate = useNavigate();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  console.log("is is ", id);

  console.log("Intern:", Intern);
  console.log("Education:", Education);
  console.log("Language:", Language);
  console.log("Family:", Family);
  console.log("Address:", Address);
  console.log("Contact:", Contact);
  console.log("Experience:", Experience);
  console.log("Medical:", Medical);
  console.log("PaymentMethod:", PaymentMethod);
  console.log("document is ", Document);

  console.log("education errtor", EducationErrors);

  console.log("language  errtor ", LanguageErrors);

  console.log("family  errtor", FamilyErrors);

  console.log("address  errtor ", AddressErrors);
  console.log("document  errtor ", DocumentErrors);

  console.log("contact  errtor", ContactErrors);
  console.log("experience  errtor", ExperienceErrors);

  console.log("medical  errtor", MedicalErrors);
  console.log("payment   errtor", PaymentMethodErrors);

  const validateForm1 = () => {
    const errors = {};

    if (!Intern.intern_code)
      errors.intern_code = "Intern Code is required.";

    if (!Intern.first_name) errors.first_name = "First Name is required.";

    if (!Intern?.date_of_birth)
      errors.date_of_birth = "Date of Birth is required.";

    if (!Intern?.gender) errors.gender = "Gender is required.";

    if (!Intern?.marital_status)
      errors.marital_status = "Marital Status is required.";

    if (!Intern?.organization_department_id)
      errors.organization_department_id = "Location/Department is required.";

    if (!Intern.organization_work_shift_id)
      errors.organization_work_shift_id = "Workshift is required.";

    if (!Intern.organization_internship_type_id )
      errors.organization_internship_type_id  = "Internship Type is required.";


    if (!Intern.organization_internship_stage_id )
      errors.organization_internship_stage_id  =
        "Internship Satge is required.";

    if (!Intern.internship_start_date)
      errors.internship_start_date = "Start Date is required.";

    if (!Intern.internship_end_date)
      errors.internship_end_date = "End Date is required.";

    // Optional: Validate specific formats
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (Intern.date_of_birth && !dateRegex.test(Intern.date_of_birth)) {
      errors.date_of_birth = "Date of Birth must be in YYYY-MM-DD format.";
    }
    if (Intern.internship_start_date && !dateRegex.test(Intern.internship_start_date)) {
      errors.internship_start_date = "Date of Joining must be in YYYY-MM-DD format.";
    }
     if (Intern.internship_end_date && !dateRegex.test(Intern.internship_end_date)) {
      errors.internship_end_date = "End Date  must be in YYYY-MM-DD format.";
    }

    if (Object.keys(errors)?.length > 0) {
      const firstKey = Object.keys(errors)[0];
      const firstError = errors[firstKey];
      toast.error(firstError); // ✔ Show most recent (first) error
      setInternErrors(errors);
      return false;
    }
    setInternErrors({});
    return true;
  };

  const validateForm2 = () => {
    const allErrors = {};
    let firstErrorMessage = null;

    const isFilled = (item) =>
      item.organization_education_level_id ||
      item.organization_education_degree_id ||
      item.organization_education_stream_id ||
      item.institute_name ||
      item.board_name ||
      (item.marks_percentage !== "" &&
        item.marks_percentage !== null &&
        item.marks_percentage !== undefined) ||
      item.year_of_passing ||
      item.is_pursuing ||
      item.intern_id ||
      item.organization_id;

    const filteredEducation = Education.filter(isFilled);

    // Now validate only filled entries
    filteredEducation.forEach((edu, index) => {
      const errors = {};

      if (!edu.organization_education_level_id)
        errors.organization_education_level_id = "Education Level is required.";

      // if (
      //   edu.organization_education_degree_id &&
      //   edu.organization_education_stream_id
      // ) 

      if (!edu.institute_name)
        errors.institute_name = "Institute name is required.";

      if (!edu.board_name)
        errors.board_name = "Board name is required.";

      if (Object.keys(errors)?.length > 0) {
        allErrors[index] = errors;
        if (!firstErrorMessage) {
          const firstKey = Object.keys(errors)[0];
          firstErrorMessage = errors[firstKey];
        }
      }
    });

    if (firstErrorMessage) {
      toast.error(firstErrorMessage);
      setEducationError(allErrors);
      return false;
    }

    setEducationError({});
    setEducation(filteredEducation);

    return true;
  };

  const validateForm3 = () => {
    const allErrors = {};
    let firstError = null;

    const isFilled = (item) =>
      item.intern_id  ||
      item.organization_language_id  ||
      item.can_read ||
      item.can_write ||
      item.can_speak ||
      item.is_native ||
      item.description ||
      item.organization_id;

    const filtered = Language.filter(isFilled);

    filtered.forEach((item, idx) => {
      const errors = {};
      if (!item.organization_language_id) errors.organization_language_id = "Language is required.";

      if (Object.keys(errors)?.length > 0) {
        allErrors[idx] = errors;
        if (!firstError) firstError = errors[Object.keys(errors)[0]];
      }
    });

    if (firstError) {
      toast.error(firstError);
      setLanguageErrors(allErrors);
      setLanguage(filtered);
      return false;
    }

    setLanguageErrors({});
    setLanguage(filtered);
    return true;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validateForm4 = () => {
    const allErrors = {};
    let firstError = null;

    const isFilled = (item) =>
      item.address_line1 ||
      item.address_line2 ||
      item.address_line3 ||
      item.general_city_id ||
      item.postal_code ||
      item.intern_id ||
      item.organization_id;

    const filtered = Address.filter(isFilled);

    filtered.forEach((item, idx) => {
      const errors = {};
     

    
      if (!item.address_line1)
        errors.address_line1 = "Employee Address is required.";

      if (!item.general_city_id) errors.general_city_id = "City is required.";

      if (!item.postal_code) errors.postal_code = "Postal is required.";

      if (Object.keys(errors)?.length > 0) {
        allErrors[idx] = errors;
        if (!firstError) firstError = errors[Object.keys(errors)[0]];
      }
    });

    if (firstError) {
      toast.error(firstError);
      setAddressError(allErrors);
      setAddress(filtered);
      return false;
    }

    setAddressError({});
    setAddress(filtered);
    return true;
  };

  const validateForm5 = () => {
    const allErrors = {};
    let firstError = null;

    const isFilled = (item) =>
      item.intern_id  ||
      item.personal_phone_number ||
      item.alternate_phone_number ||
      item.personal_email ||
      item.emergency_contact_name ||
      item.emergency_contact_relation ||
      item.emergency_contact_phone ||
      item.organization_id;

    const isValidPhone = (phone) => /^(\+?\d{1,3}[- ]?)?\d{10}$/.test(phone);
    const isValidEmail = (email) => {
      // Local part + @ + domain + TLD (letters only, min 2)
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      return emailRegex.test(email.trim());
    };

    const validContactMethods = ["phone", "email", "message"];

    const filtered = Contact.filter(isFilled);

    filtered.forEach((item, idx) => {
      const errors = {};

      if (!item.personal_phone_number) {
        errors.personal_phone_number = "Personal phone number is required.";
      } else if (!isValidPhone(item.personal_phone_number)) {
        errors.personal_phone_number = "Enter a valid 10-digit phone number.";
      }

      if (!item.personal_email) {
        errors.personal_email = "Personal email is required.";
      } else if (!isValidEmail(item.personal_email)) {
        errors.personal_email = "Enter a valid personal email address.";
      }

      

      if (!item.emergency_contact_name)
        errors.emergency_contact_name =
          "Emergency contact  name is required.";

  

      if (!item.emergency_contact_phone) {
        errors.emergency_contact_phone =
          "Emergency contact  phone is required.";
      } else if (!isValidPhone(item.emergency_contact_phone)) {
        errors.emergency_contact_phone =
          "Enter a valid emergency contact  phone number.";
      }

      if (!item.emergency_contact_relation)
        errors.emergency_contact_relation =
          "Relation with emergency Person  is required.";

    

      if (Object.keys(errors)?.length > 0) {
        allErrors[idx] = errors;
        if (!firstError) firstError = errors[Object.keys(errors)[0]];
      }
    });

    if (firstError) {
      toast.error(firstError);
      setContactError(allErrors);
      setContact(filtered);
      return false;
    }

    setContactError({});
    setContact(filtered);
    return true;
  };

  const validateForm6 = () => {
    const allErrors = {};
    let firstError = null;

    const isFilled = (item) =>
      item.organization_name ||
      item.work_title ||
      item.intern_id ||
      item.work_mode ||
      item.experience_type ||
      item.compensation_status ||
      item.general_industry_id ||
      item.start_date ||
      item.end_date ||
      item.currency_code ||
      item.compensation_amount ||
      item.location ||
      item.reporting_manager_name ||
      item.reporting_manager_contact ||
      item.description ||
      item.is_verified ||
      item.verified_by ||
      item.verification_date ||
      item.verification_notes ||
      item.organization_id;

    const filtered = Experience.filter(isFilled);

    filtered.forEach((item, idx) => {
      const errors = {};

      if (!item.experience_type)
        errors.experience_type = "Experience Type is required.";

      if (!item.organization_name)
        errors.organization_name = "Company Name is required.";

      if (!item.start_date) errors.start_date = "start date is required.";

      if (!item.end_date) errors.end_date = "start date is required.";

      if (!item.general_industry_id)
        errors.general_industry_id = "Industry is required.";

      if (!item.location) errors.location = "Loaction is required.";

      if (!item.work_title) errors.work_title = "work title is required.";

      if (!item.work_mode) errors.work_mode = "work mode is required.";

      if (!item.compensation_status)
        errors.compensation_status = "work status is required.";

      if (item.is_verified) {
        if (!item.verified_by)
          errors.verified_by = "Verified Person Name is required";
        if (!item.verification_date)
          errors.verification_date = "Verification Date is required";
      }

      if (Object.keys(errors)?.length > 0) {
        allErrors[idx] = errors;
        if (!firstError) firstError = errors[Object.keys(errors)[0]];
      }
    });

    if (firstError) {
      toast.error(firstError);
      setExperienceError(allErrors);
      setExperience(filtered);
      return false;
    }

    setExperienceError({});
    setExperience(filtered);
    return true;
  };

  const validateForm7 = () => {
    const allErrors = {};
    let firstError = null;

    const isFilled = (item) =>
      item.intern_id ||
      item.blood_group ||
      item.allergies ||
      item.diseases ||
      item.disability_status ||
      item.disability_description ||
      item.is_fit_for_duty ||
      item.last_health_check_date ||
      item.medical_notes ||
      item.organization_id;

    const filtered = Medical.filter(isFilled);

    filtered.forEach((item, idx) => {
      const errors = {};

      if (!item.blood_group) errors.blood_group = "Blood Group is required.";

      if (!item.disability_status)
        errors.disability_status = "Disability Status is required.";

      if (Object.keys(errors)?.length > 0) {
        allErrors[idx] = errors;
        if (!firstError) firstError = errors[Object.keys(errors)[0]];
      }
    });

    if (firstError) {
      toast.error(firstError);
      setMedicalError(allErrors);
      setMedical(filtered);
      return false;
    }

    setMedicalError({});
    setMedical(filtered);
    return true;
  };

  const validateForm8 = () => {
    const allErrors = {};
    let firstError = null;

    const isFilled = (item) =>
      item.organization_id ||
      item.intern_id ||
      item.account_holder_name ||
      item.bank_name ||
      item.branch_name ||
      item.ifsc_code ||
      item.account_number ||
      item.swift_code ||
      item.is_primary ||
      item.iban_number ||
      item.upi_id ||
      item.wallet_id

    const uriPattern =
      /^(upi:\/\/pay\?.+|https?:\/\/[\w\-._~:/?#@!$&'()*+,;=%]+|bitcoin:[\w]+|BCD[\w\d]+)$/i;

    const filtered = PaymentMethod.filter(isFilled);

    filtered.forEach((item, idx) => {
      const errors = {};

      if (!item.bank_name) errors.bank_name = "Bank Name is required.";
      if (!item.account_holder_name)
        errors.account_holder_name = "A/C holder Name is required.";

      if (!item.account_number) {
        errors.account_number = "A/C No. is required.";
      } else if (!/^\d+$/.test(item.account_number)) {
        errors.account_number = "A/C No. must be numeric.";
      } else if (item.account_number?.length < 9) {
        errors.account_number = "A/C No. must be at least 9 digits.";
      } else if (item.account_number?.length > 18) {
        errors.account_number = "A/C No. must not exceed 18 digits.";
      }

      if (item.upi_id && !uriPattern.test(item.upi_id)) {
        errors.upi_id = "Enter a valid payment UPI ID (UPI, PayPal, etc.)";
      }

      if (!item.ifsc_code) {
        errors.ifsc_code = "IFSC Code is required";
      }
    

      if (Object.keys(errors)?.length > 0) {
        allErrors[idx] = errors;
        if (!firstError) firstError = errors[Object.keys(errors)[0]];
      }
    });

    if (firstError) {
      toast.error(firstError);
      setPaymentMethodError(allErrors);
      setPaymentMethod(filtered);
      return false;
    }

    setPaymentMethodError({});
    setPaymentMethod(filtered);
    return true;
  };

  const validateForm9 = () => {
    const allErrors = {};
    let firstError = null;

    const isFilled = (item) =>
      item.intern_id ||
      item.full_name ||
      item.relationship_type ||
      item.phone_number ||
      item.email ||
      item.description ||
      item.date_of_birth ||
      item.is_dependent ||
      item.organization_id;

    const filtered = Family.filter(isFilled);

    filtered.forEach((item, idx) => {
      const errors = {};

      if (!item.full_name) errors.full_name = "Name of Relative is required.";
      if (!item.relationship_type) errors.relationship_type = "Relationship is required.";
      

      if (item.email && !isValidEmail(item.email)) {
        errors.email = "Enter a valid  email address.";
      }

      if (Object.keys(errors)?.length > 0) {
        allErrors[idx] = errors;
        if (!firstError) firstError = errors[Object.keys(errors)[0]];
      }
    });

    if (firstError) {
      toast.error(firstError);
      setFamilyError(allErrors);
      setFamily(filtered);
      return false;
    }

    setFamilyError({});
    setFamily(filtered);
    return true;
  };

  function printFormData(formData) {
    console.log("----- FormData Contents -----");
    for (let pair of formData.entries()) {
      console.log("helloe ", pair[0], ":", pair[1]);
    }
    console.log("-----------------------------");
  }

  const validateForm10 = () => {
    const allErrors = {};
    let firstError = null;

    const isFilled = (item) =>
      item.intern_id ||
      item.intern_document_type_id ||
      item.organization_id ||
      item.document_name ||
      item.document_url ||
      item.document_size_kb||
      item.organization_employee_profile_section_id;

    const filtered = Document.filter(isFilled);

    filtered.forEach((item, idx) => {
      const errors = {};

      if (!item.intern_document_type_id) {
        errors.intern_document_type_id = "Document Type is required.";
      }

      if (!item.document_name) {
        errors.document_name = "Document Name  is required.";
      }
    });

    if (firstError) {
      toast.error(firstError);
      setDocumentError(allErrors);
      setDocument(filtered);
      return false;
    }

    setDocumentError({});
    setDocument(filtered);
    return true;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`; 
  };

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (mode === "edit") {
        try {
          const response = await axios.get(
            `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-store/update/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Employee fetched:", response?.data);
          response.data.intern.internship_start_date = formatDate(
            response.data.intern.internship_start_date
          );
          response.data.intern.internship_end_date = formatDate(
            response.data.intern.internship_end_date
          );
          response.data.intern.organization_department_id =
            response?.data?.intern?.department_location[0]?.organization_department_id;
          setIntern(response?.data?.intern);

          // setIntern(response.data.intern);
          // response?.data?.education?.organization_education_degree_id = response?.data?.education?.degree?.[0]?.organization_education_degree_id
          
          // setEducation(response?.data.education)
          setEducation(
            response.data.education?.length > 0
              ? response.data.education
              : [
                  {
                     organization_education_level_id:"",
                        organization_education_degree_id:"",
                        organization_education_stream_id:"",
                        institute_name:"",
                        board_name:"",
                        marks_percentage:"",
                        year_of_passing:"",
                        is_pursuing:"",
                        intern_id:"",
                        organization_id:""
                  },
                ]
          );
          setLanguage(
            response.data.language?.length > 0
              ? response.data.language
              : [
                  {
                    intern_language_id: "",
                    intern_id: "",
                    organization_language_id : "",
                    can_read: false,
                    can_write: false,
                    can_speak: false,
                    is_native: false,
                    description: "",
                    organization_id: "",
                  },
                ]
          );


          // last i did here  

          response.data.family = response.data?.family?.map((item) => ({
            ...item,
            date_of_birth:
              item.date_of_birth == null
                ? null
                : formatDate(item.date_of_birth),
          }));

          setFamily(
            response.data.family?.length > 0
              ? response.data.family
              : [
                  {
                    intern_family_member_id : "",
                    intern_id : "",
                    full_name: "",
                    relationship_type: "",
                    phone_number: "",
                    date_of_birth: "",
                    is_dependent: "",
                    gender:"",
                    email: "",
                    organization_id: "",
                  },
                ]
          );

          setAddress(
            response.data.address?.length > 0
              ? response.data.address
              : [
                  {
                 
                    address_line1: "",
                    address_line2: "",
                    address_line3: "",
                    general_city_id: "",
                    postal_code: "",
                    intern_id: "",
                    organization_id: "",
                  },
                ]
          );
          setContact(
            response.data.contact?.length > 0
              ? response.data.contact
              : [
                  {
                    intern_id : "",
                    personal_phone_number: "",
                    alternate_phone_number: "",
                    personal_email: "",
                    emergency_contact_name: "",
                    emergency_contact_relation: "",
                    emergency_contact_phone: "",
                    organization_id: "",
                  },
                ]
          );
          setExperience(
            response.data.experience?.length > 0
              ? response.data.experience
              : [
                  {
                    intern_experience_id : "",
                    intern_id : "",
                    organization_name: "",
                    work_title: "",
                    experience_type: "",
                    description: "",
                    general_industry_id: "",
                    work_mode: "",
                    start_date: "",
                    end_date: "",
                    currency_code: "",
                    location: "",
                    compensation_status: "",
                    compensation_amount: "",
                    reporting_manager_name: "",
                    reporting_manager_contact: "",
                    is_verified: false,
                    verified_by: "",
                    verification_date: "",
                    verification_notes: "",
                    organization_id: "",
                  },
                ]
          );
          setMedical(
            response.data.medical?.length > 0
              ? response.data.medical
              : [
                  {
                    intern_medical_id : "",
                    intern_id : "",
                    blood_group: "",
                    allergies: "",
                    diseases: "",
                    disability_status: "",
                    disability_description: "",
                    is_fit_for_duty: false,
                    last_health_check_date: "",
                    medical_notes: "",
                    organization_id: "",
                  },
                ]
          );
          setPaymentMethod(
            response.data.payment_method?.length > 0
              ? response.data.payment_method
              : [
                  {
                    intern_bank_account_id : "",
                    organization_id: "",
                    intern_id : "",
                    account_holder_name: "",
                    bank_name: "",
                    ifsc_code: "",
                    swift_code:"",
                    branch_name:"",
                    iban_number:"",
                    upi_id:"",
                    wallet_id:"",
                    account_number: "",
                    is_primary: "",
                  },
                ]
          );

          setDocument(
            response.data.document?.length > 0
              ? response?.data?.document?.map((item) => {
                  return {
                    ...item,

                    organization_employee_profile_section_id:
                      item.section_link.map((i) => {
                        return i.profile_section
                          .organization_employee_profile_section_id;
                      }),
                  };
                })
              : [
                  {
                    organization_id: "",
                    intern_id : "",
                    document_name: "",
                    document_url: "",
                    intern_document_type_id : "",
                    document_size_kb:"",
                    organization_employee_profile_section_id: "",
                  },
                ]
          );
        } catch (error) {
          console.error("Error fetching Intern data:", error);
        }
      }
    };

    fetchEmployeeData();
  }, [mode, id]);

  const handleSubmit = async () => {
    try {
      if (!validateForm1()) return;

      // check has education
      // let sectionData = {};

      let FiiledEducation = Education?.filter(
        (item) =>
          item.organization_education_level_id != "" ||
          item.organization_education_degree_id != "" ||
          item.organization_education_stream_id != "" ||
          item.institute_name != "" ||
          item.board_name != "" ||
          item.marks_percentage != "" ||
          item.year_of_passing != "" ||
          item.is_pursuing != "" ||
          item.intern_id  != "" ||
          item.organization_id != ""
      );

      let FiiledLanguage = Language?.filter(
        (item) =>
          item.intern_id  != "" ||
          item.organization_language_id  != "" ||
          item.can_read != false ||
          item.can_write != false ||
          item.can_speak != false ||
          item.is_native != false ||
          item.description != "" ||
          item.organization_id != ""
      );

      let FiiledFamily = Family?.filter(
        (item) =>
          item.intern_id  != "" ||
          item.full_name != "" ||
          item.relationship_type != "" ||
          item.phone_number != "" ||
          item.date_of_birth != "" ||
          item.gender != "" ||
          item.email != "" ||
          item.is_dependent != "" ||
          item.organization_id != ""
      );

      let FiiledAddress = Address?.filter(
        (item) =>
        
          item.address_line1 != "" ||
          item.address_line2 != "" ||
          item.address_line3 != "" ||
          item.general_city_id != "" ||
          item.postal_code != "" ||
          item.intern_id  != "" ||
          item.organization_id != ""
      );

      let FiiledContact = Contact?.filter(
        (item) =>
          item.intern_id != "" ||
          item.personal_phone_number != "" ||
          item.alternate_phone_number != "" ||
          item.personal_email != "" ||
          item.emergency_contact_name != "" ||
          item.emergency_contact_relation != "" ||
          item.emergency_contact_phone != "" ||
          item.organization_id != ""
      );

      let FiiledExperience = Experience?.filter(
        (item) =>
          item.organization_name ||
          item.work_title != "" ||
          item.intern_id  != "" ||
          item.work_mode != "" ||
          item.experience_type != "" ||
          item.compensation_status != "" ||
          item.general_industry_id != "" ||
          item.start_date != "" ||
          item.end_date != "" ||
          item.currency_code != "" ||
          item.compensation_amount != "" ||
          item.location != "" ||
          item.reporting_manager_name != "" ||
          item.reporting_manager_contact != "" ||
          item.description != "" ||
          item.is_verified != "" ||
          item.verified_by != "" ||
          item.verification_date != "" ||
          item.verification_notes != "" ||
          item.organization_id != ""
      );

      let FiiledMedical = Medical?.filter(
        (item) =>
          item.intern_id  != "" ||
          item.blood_group != "" ||
          item.allergies != "" ||
          item.diseases != "" ||
          item.disability_status != "" ||
          item.disability_description != "" ||
          item.is_fit_for_duty != false ||
          item.last_health_check_date != "" ||
          item.medical_notes != "" ||
          item.organization_id != ""
      );

      let FiiledPaymentMethod = PaymentMethod?.filter(
        (item) =>
          item.organization_id != "" ||
          item.intern_id  != "" ||
          item.account_holder_name != "" ||
          item.bank_name != "" ||
          item.branch_name != "" ||
          item.swift_code != "" ||
          item.iban_number != "" ||
          item.ifsc_code != "" ||
          item.account_number != "" ||
          item.is_primary != "" ||
          item.wallet_id != "" ||
          item.upi_id != "" ||
          item.remarks != "" 
      );

      let FiiledDocument = Document?.filter(
        (item) =>
          item.organization_id != "" ||
          item.intern_id != "" ||
          item.intern_document_type_id != "" ||
          item.document_name != "" ||
          item.document_url != "" ||
          item.document_size_kb!="" ||
          item.organization_employee_profile_section_id != ""
      );

      if (FiiledEducation?.length > 0) {
        if (!validateForm2()) return;
      }

      if (FiiledLanguage?.length > 0) {
        if (!validateForm3()) return;
      }
      if (FiiledFamily?.length > 0) {
        if (!validateForm9()) return;
      }
      if (FiiledAddress?.length > 0) {
        if (!validateForm4()) return;
      }
      if (FiiledContact?.length > 0) {
        if (!validateForm5()) return;
      }
      if (FiiledExperience?.length > 0) {
        if (!validateForm6()) return;
      }
      if (FiiledMedical?.length > 0) {
        if (!validateForm7()) return;
      }
      if (FiiledPaymentMethod?.length > 0) {
        if (!validateForm8()) return;
      }

      if (FiiledDocument?.length > 0) {
        if (!validateForm10()) return;
      }

      const formData = new FormData();

      // Employee fields
      Object.entries(Intern).forEach(([key, value]) => {
        if (key === "profile_image_url" && value instanceof File) {
          formData.append("profile_image_url", value);
        } else {
          formData.append(key, value ??"");
        }
      });

      // Ensure all nested sections are valid arrays before sending

      const response = await axios.post(
        `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-store/store1`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setIntern(response.data.employee);

      if (response.data.education?.length > 0) {
        setEducation(response.data.education);
      }
      if (response.data.language?.length > 0) {
        setLanguage(response.data.language);
      }
      if (response.data.family?.length > 0) {
        setFamily(response.data.family);
      }
      if (response.data.address?.length > 0) {
        setAddress(response.data.address);
      }
      if (response.data.contact?.length > 0) {
        setContact(response.data.contact);
      }
      if (response.data.experience?.length > 0) {
        setExperience(response.data.experience);
      }
      if (response.data.medical?.length > 0) {
        setMedical(response.data.medical);
      }
      if (response.data.payment_method?.length > 0) {
        setPaymentMethod(response.data.payment_method);
      }
      if (response.data.document?.length > 0) {
        setDocument(response.data.document);
      }


        let inter_id = response?.data?.intern?.intern_id;

      console.log("FiiledEducation is:", FiiledEducation);


      let sectionData = {}; // This will hold all sections

      // Prepare documents as FormData if there is any
      if (FiiledDocument?.length > 0) {
        sectionData.document = Document?.map((item) => ({
          ...item,
          intern_id: inter_id,
          document_url:
            item.document_url instanceof File
              ? item.document_url
              : item.document_url || "",
        }));
      }

      // Prepare other sections
      if (FiiledEducation?.length > 0) {
        sectionData.education = Education?.map((item) => ({
          ...item,
          intern_id: inter_id,
        }));
      }

      if (FiiledLanguage?.length > 0) {
        sectionData.language = Language?.map((item) => ({
          ...item,
          intern_id: inter_id,
        }));
      }

      if (FiiledFamily?.length > 0) {
        sectionData.family = Family?.map((item) => ({
          ...item,
          intern_id: inter_id,
        }));
      }

      if (FiiledAddress?.length > 0) {
        sectionData.address = Address?.map((item) => ({
          ...item,
          intern_id: inter_id,
        }));
      }

      if (FiiledContact?.length > 0) {
        sectionData.contact = Contact?.map((item) => ({
          ...item,
          intern_id: inter_id,
        }));
      }

      if (FiiledExperience?.length > 0) {
        sectionData.experience = Experience?.map((item) => ({
          ...item,
          intern_id: inter_id,
        }));
      }

      if (FiiledMedical?.length > 0) {
        sectionData.medical = Medical?.map((item) => ({
          ...item,
          intern_id: inter_id,
        }));
      }

      if (FiiledPaymentMethod?.length > 0) {
        sectionData.payment_method = PaymentMethod?.map((item) => ({
          ...item,
          intern_id: inter_id,
        }));
      }

      // Check if any section exists before sending
      if (
        FiiledEducation?.length > 0 ||
        FiiledLanguage?.length > 0 ||
        FiiledFamily?.length > 0 ||
        FiiledAddress?.length > 0 ||
        FiiledContact?.length > 0 ||
        FiiledExperience?.length > 0 ||
        FiiledMedical?.length > 0 ||
        FiiledPaymentMethod?.length > 0 ||
        FiiledDocument?.length > 0
      ) {
        // If there are documents as File objects, use FormData
        let finalData;
        let headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const hasFile = FiiledDocument?.some(
          (doc) => doc.document_url instanceof File
        );

        if (hasFile) {
          finalData = new FormData();

          Object.keys(sectionData).forEach((key) => {
            sectionData[key].forEach((item, index) => {
              Object.keys(item).forEach((field) => {
                const value = item[field];

                if (value instanceof File) {
                  finalData.append(`${key}[${index}][${field}]`, value);
                } else if (Array.isArray(value)) {
                  // Append each array element individually
                  value.forEach((v, arrIndex) => {
                    finalData.append(
                      `${key}[${index}][${field}][${arrIndex}]`,
                      v
                    );
                  });
                } else if (typeof value === "boolean") {
                  finalData.append(`${key}[${index}][${field}]`, value ? 1 : 0);
                } else if (typeof value === "number") {
                  finalData.append(`${key}[${index}][${field}]`, value);
                } else {
                  finalData.append(`${key}[${index}][${field}]`, value ??"");
                }
              });
            });
          });
        } else {
          finalData = sectionData;
          headers["Content-Type"] = "application/json";
        }

        try {
          console.log("----- FormData Contents -----");
          for (let pair of finalData.entries()) {
            console.log("helloe ", pair[0], ":", pair[1]);
          }
          console.log("-----------------------------");
        } catch (error) {
          console.log("erropr is ", error);
        }
        const response2 = await axios.post(
          `${MAIN_URL}/api/organizations/${org?.organization_id}/intern-store/store2`,
          finalData,
          { headers }
        );
      }

      console.log("Submitted successfully:", response.data);
      toast.success(
        `Intern data ${mode == "edit" ? "Edited" : "Added"} successfully!`
      );
      resetData();
      navigate(-1);
    } catch (error) {
      if (error.response?.data?.errors) {
        let hasEducationError =
          error.response.data.errors.education != undefined;
        let hasLanguageError = error.response.data.errors.language != undefined;
        let hasFamilyError = error.response.data.errors.family != undefined;
        let hasAddressError = error.response.data.errors.address != undefined;
        let hasContactError = error.response.data.errors.contact != undefined;

        let hasExperienceError =
          error.response.data.errors.experience != undefined;
        let hasMedicalError = error.response.data.errors.medical != undefined;
        let hasPaymentMethodError =
          error.response.data.errors.payment_method != undefined;

        let hasDocumentError = error.response.data.errors.document != undefined;

        if (error.response.data.section === "intern") {
          const errors = error.response.data.errors;
          const firstSection = Object.keys(errors)[0];
          setInternErrors(error.response.data.errors);
          toast.error(
            `Validation error in ${firstSection == "intern_code" && "Intern Code"}: ${firstSection == "intern_code" && "The Intern code is already taken"}`
          );
        } else if (hasEducationError) {
          const errors = error.response.data.errors;
          const educationErrorsArray = errors?.education ??[];
          if (educationErrorsArray?.length > 0) {
            const educationErrors = educationErrorsArray[0];
            setEducationError(educationErrors);
            const firstField = Object.keys(educationErrors)[0];
            const firstMessage = educationErrors[firstField][0];
            toast.error(`Validation error in ${firstField}: ${firstMessage}`);
          }
        } else if (hasLanguageError) {
          const errors = error.response.data.errors;
          const languageErrorsArray = errors?.language ??[];
          if (languageErrorsArray?.length > 0) {
            const languageErrors = languageErrorsArray[0];
            setLanguageErrors(languageErrors);
            const firstField = Object.keys(languageErrors)[0];
            const firstMessage = languageErrors[firstField][0];
            toast.error(`Validation error in ${firstField}: ${firstMessage}`);
          }
        } else if (hasFamilyError) {
          const errors = error.response.data.errors;
          const familyErrorsArray = errors?.family ??[];
          if (familyErrorsArray?.length > 0) {
            const familyErrors = familyErrorsArray[0];
            setFamilyError(familyErrors);
            const firstField = Object.keys(familyErrors)[0];
            const firstMessage = familyErrors[firstField][0];
            toast.error(`Validation error in ${firstField}: ${firstMessage}`);
          }
        } else if (hasAddressError) {
          const errors = error.response.data.errors;
          const addressErrorsArray = errors?.address ??[];
          if (addressErrorsArray?.length > 0) {
            const addressErrors = addressErrorsArray[0];
            setAddressError(addressErrors);
            const firstField = Object.keys(addressErrors)[0];
            const firstMessage = addressErrors[firstField][0];
            toast.error(`Validation error in ${firstField}: ${firstMessage}`);
          }
        } else if (hasContactError) {
          const errors = error.response.data.errors;
          const contactErrorsArray = errors?.contact ??[];
          if (contactErrorsArray?.length > 0) {
            const contactErrors = contactErrorsArray[0];
            setContactError(contactErrors);
            const firstField = Object.keys(contactErrors)[0];
            const firstMessage = contactErrors[firstField][0];
            toast.error(`Validation error in ${firstField}: ${firstMessage}`);
          }
        } else if (hasExperienceError) {
          const errors = error.response.data.errors;
          const experienceErrorsArray = errors?.experience ??[];
          if (experienceErrorsArray?.length > 0) {
            const experienceErrors = experienceErrorsArray[0];
            setExperienceError(experienceErrors);
            const firstField = Object.keys(experienceErrors)[0];
            const firstMessage = experienceErrors[firstField][0];
            toast.error(`Validation error in ${firstField}: ${firstMessage}`);
          }
        } else if (hasMedicalError) {
          const errors = error.response.data.errors;
          const medicalErrorsArray = errors?.medical ??[];
          if (medicalErrorsArray?.length > 0) {
            const medicalErrors = medicalErrorsArray[0];
            setEducationError(medicalErrors);
            const firstField = Object.keys(medicalErrors)[0];
            const firstMessage = medicalErrors[firstField][0];
            toast.error(`Validation error in ${firstField}: ${firstMessage}`);
          }
        } else if (hasPaymentMethodError) {
          const errors = error.response.data.errors;
          const PaymentmethodErrorsArray = errors?.payment_method ??[];
          if (PaymentmethodErrorsArray?.length > 0) {
            const PaymentmethodErrors = PaymentmethodErrorsArray[0];
            setEducationError(PaymentmethodErrors);
            const firstField = Object.keys(PaymentmethodErrors)[0];
            const firstMessage = PaymentmethodErrors[firstField][0];
            toast.error(`Validation error in ${firstField}: ${firstMessage}`);
          }
        } else if (hasDocumentError) {
          const errors = error.response.data.errors;
          const DocumentErrorsArray = errors?.document ??[];
          if (DocumentErrorsArray?.length > 0) {
            const DocumentErrors = DocumentErrorsArray[0];
            setDocumentError(DocumentErrors);
            const firstField = Object.keys(DocumentErrors)[0];
            const firstMessage = DocumentErrors[firstField][0];
            toast.error(`Validation error in ${firstField}: ${firstMessage}`);
          }
        }
        console.error("Validation Errors:", error.response);
      } else {
        console.error("Submit Error:", error);
        alert("Submission failed.");
      }
    }
  };

  const handleSubmitClick = async () => {
    setLoading(true);
    try {
      await handleSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} mt={2}>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          sx={{
            borderRadius: 2,
            minWidth: 120,
            textTransform: "capitalize",
            fontWeight: 500,
          }}
          onClick={handleSubmitClick}
          disabled={loading} // disable while loading
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Submit"}
        </Button>
      </Grid>

      {mode === "edit" && (
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 2,
              minWidth: 120,
              textTransform: "capitalize",
              fontWeight: 500,
              ml: 2, // space between Submit/Edit and Cancel
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#115293" },
            }}
          >
            Cancel
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default SubmitButtonIntern;
