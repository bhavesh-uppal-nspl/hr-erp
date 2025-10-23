import { create } from "zustand";
import { MAIN_URL } from "../../Configurations/Urls";
import axios from "axios";

const useEmployeeDataStore = create((set, get) => ({
  Employee: {
    employee_code: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    employee_id: "",
    organization_id: "",
    gender: "",
    marital_status: "",
    profile_image_url: "",
    organization_unit_id: "",
    organization_department_location_id: "",
    organization_employment_type_id: "",
    organization_department_id: "",
    organization_designation_id: "",
    organization_employment_type_id: "",
    organization_work_model_id: "",
    organization_work_shift_id: "",
    organization_employment_status_id: "",
    organization_employment_stage_id:"",
    organization_user_id: "",
    date_of_joining: "",
    organization_user_id: "",
    reporting_manager_id: "",
  },
  EmployeeErrors: {},
  setEmployee: (data) => set({ Employee: data }),
  setEmployeeErrors: (data) => set({ EmployeeErrors: data }),
  setEmployeeData: (data) =>
    set((state) => {
      const updatedErrors = { ...state.EmployeeErrors };
      Object.keys(data).forEach((key) => {
        if (updatedErrors[key]) {
          delete updatedErrors[key];
        }
      });

      return {
        Employee: { ...state.Employee, ...data },
        EmployeeErrors: updatedErrors,
      };
    }),

  // education error and data
  Education: [
    {
      organization_education_id: "",
      organization_education_level_id: "",
      organization_education_degree_id: "",
      organization_education_stream_id: "",
      institute_name: "",
      board_university_name: "",
      marks_percentage: "",
      year_of_passing: "",
      is_pursuing: "",
      employee_id: "",
      organization_id: "",
    },
  ],
  EducationErrors: {},
  setEducation: (data) => set({ Education: data }),
  setEducationError: (data) => set({ EducationErrors: data }),
  setEducationData: (name, value, index) => {
    const { Education, EducationErrors } = get();

    // Update the specific Education entry
    const updatedEducation = [...Education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [name]: value,
    };

    // Deep copy errors
    const updatedErrors = { ...EducationErrors };

    // Clear the error for the specific field of that index, if it exists
    if (updatedErrors[index]?.[name]) {
      updatedErrors[index] = { ...updatedErrors[index] }; // shallow clone the index block
      delete updatedErrors[index][name];

      // If that index has no more errors left, remove the index key
      if (Object.keys(updatedErrors[index])?.length === 0) {
        delete updatedErrors[index];
      }
    }

    set({
      Education: updatedEducation,
      EducationErrors: updatedErrors,
    });
  },
  addEducation: () => {
    let { Education } = get();

    Education.push({
      organization_education_level_id: "",
      organization_education_degree_id: "",
      organization_education_stream_id: "",
      institute_name: "",
      board_university_name: "",
      marks_percentage: "",
      year_of_passing: "",
      is_pursuing: "",
      employee_id: "",
      organization_id: "",
    });

    set({ Education });
  },
  removeEducation: (index) => {
    let { Education } = get();

    Education.splice(index, 1); // remove 1 item at the given index

    set({ Education: [...Education] }); // spread to trigger state update
  },

  Language: [
    {
      employee_language_id: "",
      employee_id: "",
      language_id: "",
      can_read: false,
      can_write: false,
      can_speak: false,
      is_native: false,
      description: "",
      organization_id: "",
    },
  ],
  LanguageErrors: {},
  setLanguage: (data) => set({ Language: data }),
  setLanguageErrors: (data) => set({ LanguageErrors: data }),
  setLanguageData: (name, value, index) => {
    const { Language, LanguageErrors } = get();

    // Update the specific Language entry
    const updatedLanguage = [...Language];
    updatedLanguage[index] = {
      ...updatedLanguage[index],
      [name]: value,
    };

    // Deep copy errors
    const updatedErrors = { ...LanguageErrors };

    // Clear the error for the specific field of that index, if it exists
    if (updatedErrors[index]?.[name]) {
      updatedErrors[index] = { ...updatedErrors[index] }; // shallow clone the index block
      delete updatedErrors[index][name];

      // If that index has no more errors left, remove the index key
      if (Object.keys(updatedErrors[index])?.length === 0) {
        delete updatedErrors[index];
      }
    }

    set({
      Language: updatedLanguage,
      LanguageErrors: updatedErrors,
    });
  },
  addLanguage: () => {
    let { Language } = get();

    Language.push({
      employee_id: "",
      language_id: "",
      can_read: false,
      can_write: false,
      can_speak: false,
      is_native: false,
      description: "",
      organization_id: "",
    });

    set({ Language });
  },
  removeLanguage: (index) => {
    let { Language } = get();

    Language.splice(index, 1); // remove 1 item at the given index

    set({ Language: [...Language] }); // spread to trigger state update
  },

  // set family data
  Family: [
    {
      employee_family_member_id: "",
      employee_id: "",
      name: "",
      relationship: "",
      phone: "",
      date_of_birth: "",
      is_dependent: "",
      marital_status: "",
      current_status: "",
      education_details: "",
      occupation_details: "",
      email: "",
      description: "",
      organization_id: "",
    },
  ],
  FamilyErrors: {},
  setFamily: (data) => set({ Family: data }),
  setFamilyError: (data) => set({ FamilyErrors: data }),
  setFamilyData: (name, value, index) => {
    const { Family, FamilyErrors } = get();

    // Update the specific Family entry
    const updatedFamily = [...Family];
    updatedFamily[index] = {
      ...updatedFamily[index],
      [name]: value,
    };

    // Deep copy errors
    const updatedErrors = { ...FamilyErrors };

    // Clear the error for the specific field of that index, if it exists
    if (updatedErrors[index]?.[name]) {
      updatedErrors[index] = { ...updatedErrors[index] }; // shallow clone the index block
      delete updatedErrors[index][name];

      // If that index has no more errors left, remove the index key
      if (Object.keys(updatedErrors[index])?.length === 0) {
        delete updatedErrors[index];
      }
    }

    set({
      Family: updatedFamily,
      FamilyErrors: updatedErrors,
    });
  },
  addFamily: () => {
    let { Family } = get();

    Family.push({
      employee_id: "",
      name: "",
      relationship: "",
      phone: "",
      date_of_birth: "",
      is_dependent: "",
      organization_id: "",
    });

    set({ Family });
  },
  removeFamily: (index) => {
    let { Family } = get();

    Family.splice(index, 1); // remove 1 item at the given index

    set({ Family: [...Family] }); // spread to trigger state update
  },

  Address: [
    {
      employee_address_id: "",
      organization_employee_address_type_id: "",
      address_line1: "",
      address_line2: "",
      address_line3: "",
      general_city_id: "",
      postal_code: "",
      organization_residential_ownership_type_id: "",
      employee_id: "",
      organization_id: "",
    },
  ],
  AddressErrors: {},
  setAddress: (data) => set({ Address: data }),
  setAddressError: (data) => set({ AddressErrors: data }),
  setAddressData: (name, value, index) => {
    const { Address, AddressErrors } = get();

    // Update the specific Address entry
    const updatedAddress = [...Address];
    updatedAddress[index] = {
      ...updatedAddress[index],
      [name]: value,
    };

    // Deep copy errors
    const updatedErrors = { ...AddressErrors };

    // Clear the error for the specific field of that index, if it exists
    if (updatedErrors[index]?.[name]) {
      updatedErrors[index] = { ...updatedErrors[index] }; // shallow clone the index block
      delete updatedErrors[index][name];

      // If that index has no more errors left, remove the index key
      if (Object.keys(updatedErrors[index])?.length === 0) {
        delete updatedErrors[index];
      }
    }

    set({
      Address: updatedAddress,
      AddressErrors: updatedErrors,
    });
  },
  addAddress: () => {
    let { Address } = get();

    Address.push({
      organization_employee_address_type_id: "",
      address_line1: "",
      address_line2: "",
      address_line3: "",
      general_city_id: "",
      postal_code: "",
      organization_residential_ownership_type_id: "",
      employee_id: "",
      organization_id: "",
    });

    set({ Address });
  },
  removeAddress: (index) => {
    let { Address } = get();

    Address.splice(index, 1); // remove 1 item at the given index

    set({ Address: [...Address] }); // spread to trigger state update
  },

  Contact: [
    {
      employee_contact_id: "",
      employee_id: "",
      personal_phone_number: "",
      alternate_personal_phone_number: "",
      personal_email: "",
      alternate_personal_email: "",
      preferred_contact_method: "",
      emergency_person_phone_number_1: "",
      emergency_person_name_1: "",
      emergency_person_relation_1: "",
      emergency_person_phone_number_2: "",
      emergency_person_name_2: "",
      emergency_person_relation_2: "",
      work_phone_number: "",
      work_email: "",
      organization_id: "",
    },
  ],
  ContactErrors: {},
  setContact: (data) => set({ Contact: data }),
  setContactError: (data) => set({ ContactErrors: data }),
  setContactData: (name, value, index) => {
    const { Contact, ContactErrors } = get();

    // Update the specific Contact entry
    const updatedContact = [...Contact];
    updatedContact[index] = {
      ...updatedContact[index],
      [name]: value,
    };

    // Deep copy errors
    const updatedErrors = { ...ContactErrors };

    // Clear the error for the specific field of that index, if it exists
    if (updatedErrors[index]?.[name]) {
      updatedErrors[index] = { ...updatedErrors[index] }; // shallow clone the index block
      delete updatedErrors[index][name];

      // If that index has no more errors left, remove the index key
      if (Object.keys(updatedErrors[index])?.length === 0) {
        delete updatedErrors[index];
      }
    }

    set({
      Contact: updatedContact,
      ContactErrors: updatedErrors,
    });
  },
  addContact: () => {
    let { Contact } = get();

    Contact.push({
      employee_id: "",
      personal_phone_number: "",
      alternate_personal_phone_number: "",
      personal_email: "",
      alternate_personal_email: "",
      preferred_contact_method: "",
      emergency_person_phone_number_1: "",
      emergency_person_name_1: "",
      emergency_person_relation_1: "",
      emergency_person_phone_number_2: "",
      emergency_person_name_2: "",
      emergency_person_relation_2: "",
      work_phone_number: "",
      work_email: "",
      organization_id: "",
    });

    set({ Contact });
  },
  removeContact: (index) => {
    let { Contact } = get();

    Contact.splice(index, 1); // remove 1 item at the given index

    set({ Contact: [...Contact] }); // spread to trigger state update
  },

  // experience error and data
  Experience: [
    {
      employee_experience_id: "",
      employee_id: "",
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
      compensation_payout_model: "",
      compensation_amount: "",
      reporting_manager_name: "",
      reporting_manager_contact: "",
      is_verified: "",
      verified_by: "",
      verification_date: "",
      verification_notes: "",
      organization_id: "",
    },
  ],
  ExperienceErrors: {},
  setExperience: (data) => set({ Experience: data }),
  setExperienceError: (data) => set({ ExperienceErrors: data }),
  setExperienceData: (name, value, index) => {
    const { Experience, ExperienceErrors } = get();

    // Update the specific Experience entry
    const updatedExperience = [...Experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [name]: value,
    };

    // Deep copy errors
    const updatedErrors = { ...ExperienceErrors };

    // Clear the error for the specific field of that index, if it exists
    if (updatedErrors[index]?.[name]) {
      updatedErrors[index] = { ...updatedErrors[index] }; // shallow clone the index block
      delete updatedErrors[index][name];

      // If that index has no more errors left, remove the index key
      if (Object.keys(updatedErrors[index])?.length === 0) {
        delete updatedErrors[index];
      }
    }

    set({
      Experience: updatedExperience,
      ExperienceErrors: updatedErrors,
    });
  },
  addExperience: () => {
    let { Experience } = get();

    Experience.push({
      employee_id: "",
      organization_name: "",
      job_title: "",
      employment_type: "",
      internship_compensation_type: "",
      general_industry_id: "",
      start_date: "",
      end_date: "",
      is_current_job: "",
      last_drawn_ctc: "",
      currency_code: "",
      location: "",
      reporting_manager_name: "",
      reporting_manager_contact: "",
      description: "",
      is_verified: "",
      verified_by: "",
      verification_date: "",
      verification_notes: "",
      organization_id: "",
    });

    set({ Experience });
  },
  removeExperience: (index) => {
    let { Experience } = get();

    Experience.splice(index, 1); // remove 1 item at the given index

    set({ Experience: [...Experience] }); // spread to trigger state update
  },

  // medical error and data
  Medical: [
    {
      employee_medical_id: "",
      employee_id: "",
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
  ],
  MedicalErrors: {},
  setMedical: (data) => set({ Medical: data }),
  setMedicalError: (data) => set({ MedicalErrors: data }),
  setMedicalData: (name, value, index) => {
    const { Medical, MedicalErrors } = get();

    // Update the specific Medical entry
    const updatedMedical = [...Medical];
    updatedMedical[index] = {
      ...updatedMedical[index],
      [name]: value,
    };

    // Deep copy errors
    const updatedErrors = { ...MedicalErrors };


    if (updatedErrors[index]?.[name]) {
      updatedErrors[index] = { ...updatedErrors[index] }; // shallow clone the index block
      delete updatedErrors[index][name];


      if (Object.keys(updatedErrors[index])?.length === 0) {
        delete updatedErrors[index];
      }
    }
    set({
      Medical: updatedMedical,
      MedicalErrors: updatedErrors,
    });
  },
  addMedical: () => {
    let { Medical } = get();
    Medical.push({
      employee_id: "",
      blood_group: "",
      allergies: "",
      diseases: "",
      disability_status: "",
      disability_description: "",
      is_fit_for_duty: "",
      last_health_check_date: "",
      medical_notes: "",
      organization_id: "",
    });

    set({ Medical });
  },
  removeMedical: (index) => {
    let { Medical } = get();

    Medical.splice(index, 1); // remove 1 item at the given index

    set({ Medical: [...Medical] }); // spread to trigger state update
  },

  // payment method and data

  PaymentMethod: [
    {
      employee_bank_account_id: "",
      organization_id: "",
      employee_id: "",
      account_holder_name: "",
      bank_name: "",
      ifsc_code: "",
      account_number: "",
      account_type: false,
      is_primary: false,
      qr_code_url: "",
      remarks: "",
    },
  ],
  PaymentMethodErrors: {},
  setPaymentMethod: (data) => set({ PaymentMethod: data }),
  setPaymentMethodError: (data) => set({ PaymentMethodErrors: data }),
  setPaymentMethodData: (name, value, index) => {
    const { PaymentMethod, PaymentMethodErrors } = get();

    // Update the specific PaymentMethod entry
    const updatedPaymentMethod = [...PaymentMethod];
    updatedPaymentMethod[index] = {
      ...updatedPaymentMethod[index],
      [name]: value,
    };

    // Deep copy errors
    const updatedErrors = { ...PaymentMethodErrors };

    // Clear the error for the specific field of that index, if it exists
    if (updatedErrors[index]?.[name]) {
      updatedErrors[index] = { ...updatedErrors[index] }; // shallow clone the index block
      delete updatedErrors[index][name];

      // If that index has no more errors left, remove the index key
      if (Object.keys(updatedErrors[index])?.length === 0) {
        delete updatedErrors[index];
      }
    }

    set({
      PaymentMethod: updatedPaymentMethod,
      PaymentMethodErrors: updatedErrors,
    });
  },
  addPaymentMethod: () => {
    let { PaymentMethod } = get();
    PaymentMethod.push({
      organization_id: "",
      employee_id: "",
      account_holder_name: "",
      bank_name: "",
      ifsc_code: "",
      account_number: "",
      account_type: "",
      is_primary: false,
      upi_id:"",
      qr_code_url: "",
      remarks: "",
    });

    set({ PaymentMethod });
  },
  removePaymentMethod: (index) => {
    let { PaymentMethod } = get();

    PaymentMethod.splice(index, 1); 

    set({ PaymentMethod: [...PaymentMethod] });
  },



  Document: [
    {
      employee_document_id: "",
      employee_id: "",
      employee_document_type_id: "",
      organization_id : "",
      organization_entity_id: "",
      document_name: "",
      document_url: "",
      document_size_kb:"",
      organization_employee_profile_section_id:""
    
    },
  ],
  DocumentErrors: {},
  setDocument: (data) => set({ Document: data }),
  setDocumentError: (data) => set({ DocumentErrors: data }),
  setDocumentData: (name, value, index) => {
    const { Document, DocumentErrors } = get();

    // Update the specific Family entry
    const updatedDocument = [...Document];
    updatedDocument[index] = {
      ...updatedDocument[index],
      [name]: value,
    };

    // Deep copy errors
    const updatedErrors = { ...DocumentErrors };

    // Clear the error for the specific field of that index, if it exists
    if (updatedErrors[index]?.[name]) {
      updatedErrors[index] = { ...updatedErrors[index] }; // shallow clone the index block
      delete updatedErrors[index][name];

      if (Object.keys(updatedErrors[index])?.length === 0) {
        delete updatedErrors[index];
      }
    }

    set({
      Document: updatedDocument,
      DocumentErrors: updatedErrors,
    });
  },
  addDocument: () => {
    let { Document } = get();

    Document.push({
      employee_id: "",
      employee_document_type_id: "",
      organization_id: "",
      document_name: "",
      document_url: "",
      organization_employee_profile_section_id:"",
      document_size_kb:"",
      sectionlinks:[]
    });

    set({ Document });
  },
  removeDocument: (index) => {
    let { Document } = get();

    Document.splice(index, 1); // remove 1 item at the given index

    set({ Document: [...Document] }); // spread to trigger state update
  },


  resetData: () => {
    set({
      Employee: {
        employee_code: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth: "",
        employee_id: "",
        organization_id: "",
        gender: "",
        marital_status: "",
        profile_image_url: "",
        organization_unit_id: "",
        organization_department_location_id: "",
        organization_employment_type_id: "",
        organization_department_id: "",
        organization_designation_id: "",
        organization_employment_type_id: "",
        organization_work_model_id: "",
        organization_work_shift_id: "",
        organization_employment_status_id: "",
        organization_employment_stage_id:"",
        organization_user_id: "",
        date_of_joining: "",
        organization_user_id: "",
        reporting_manager_id: "",
      },
      EmployeeErrors: {},
      Education: [
        {
          organization_education_id: "",
          organization_education_level_id: "",
          organization_education_degree_id: "",
          organization_education_stream_id: "",
          institute_name: "",
          board_university_name: "",
          marks_percentage: "",
          year_of_passing: "",
          is_pursuing: "",
          employee_id: "",
          organization_id: "",
        },
      ],
      EducationErrors: {},
      Language: [
        {
          employee_language_id: "",
          employee_id: "",
          language_id: "",
          can_read: false,
          can_write: false,
          can_speak: false,
          is_native: false,
          description: "",
          organization_id: "",
        },
      ],
      LanguageErrors: {},
      Family: [
        {
          employee_family_member_id: "",
          employee_id: "",
          name: "",
          relationship: "",
          phone: "",
          date_of_birth: "",
          is_dependent: "",
          marital_status: "",
          current_status: "",
          education_details: "",
          occupation_details: "",
          email: "",
          description: "",
          organization_id: "",
        },
      ],
      FamilyErrors: {},
      Address: [
        {
          employee_address_id: "",
          organization_employee_address_type_id: "",
          address_line1: "",
          address_line2: "",
          address_line3: "",
          general_city_id: "",
          postal_code: "",
          organization_residential_ownership_type_id: "",
          employee_id: "",
          organization_id: "",
        },
      ],
      AddressErrors: {},
      Contact: [
        {
          employee_contact_id: "",
          employee_id: "",
          personal_phone_number: "",
          alternate_personal_phone_number: "",
          personal_email: "",
          alternate_personal_email: "",
          preferred_contact_method: "",
          emergency_person_phone_number_1: "",
          emergency_person_name_1: "",
          emergency_person_relation_1: "",
          emergency_person_phone_number_2: "",
          emergency_person_name_2: "",
          emergency_person_relation_2: "",
          work_phone_number: "",
          work_email: "",
          organization_id: "",
        },
      ],
      ContactErrors: {},
      Experience: [
        {
          employee_experience_id: "",
          employee_id: "",
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
          compensation_payout_model: "",
          compensation_amount: "",
          reporting_manager_name: "",
          reporting_manager_contact: "",
          is_verified: "",
          verified_by: "",
          verification_date: "",
          verification_notes: "",
          organization_id: "",
        },
      ],
      ExperienceErrors: {},
      Medical: [
        {
          employee_medical_id: "",
          employee_id: "",
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
      ],
      MedicalErrors: {},
      PaymentMethod: [
        {
          employee_bank_account_id: "",
          organization_id: "",
          employee_id: "",
          account_holder_name: "",
          bank_name: "",
          ifsc_code: "",
          account_number: "",
          account_type: false,
          is_primary: false,
          qr_code_url: "",
          upi_id:"",
          remarks: "",
        },
      ],
      PaymentMethodErrors: {},
      Document:[
        {
            employee_id: "",
            employee_document_type_id: "",
            organization_id: "",
            document_name: "",
            document_url: "",
            document_size_kb:"",
            organization_employee_profile_section_id:""
        }

      ],
      DocumentErrors:{}
    });
  },





  // setEducationData: (name, value, id) => {
  //   let { Education } = get();
  //   Education[id] = { ...Education[id], [name]: value };
  //   set(Education);
  // },

  // setLanguageData: (name, value, id) => {
  //   let { Language } = get();

  //   Language[id] = { ...Language[id], [name]: value };
  //   set(Language);
  // },

  // setFamilyData: (name, value, id) => {
  //   let { Family } = get();

  //   Family[id] = { ...Family[id], [name]: value };
  //   set(Family);
  // },

  // setAddressData: (name, value, id) => {
  //   let { Address } = get();

  //   Address[id] = { ...Address[id], [name]: value };
  //   set(Address);
  // },

  // setContactData: (name, value, id) => {
  //   let { Contact } = get();

  //   Contact[id] = { ...Contact[id], [name]: value };
  //   set(Contact);
  // },

  // setExperienceData: (name, value, id) => {
  //   let { Experience } = get();

  //   Experience[id] = { ...Experience[id], [name]: value };
  //   set(Experience);
  // },

  // setMedicalData: (name, value, id) => {
  //   let { Medical } = get();

  //   Medical[id] = { ...Medical[id], [name]: value };
  //   set(Medical);
  // },
  // setPaymentMethodData: (name, value, id) => {
  //   let { PaymentMethod } = get();

  //   PaymentMethod[id] = { ...PaymentMethod[id], [name]: value };
  //   set(PaymentMethod);
  // },

  DropDownData: {
    departments: [],
    Units: [],
    EmploymentTypes: [],
    WorkModels: [],
    designations: [],
    WorkShifts: [],
    EmploymentStatus: [],
    Employees: [],
    Languages: [],
    EmploymentAddressType: [],
    EmployeeStages:[]
  },

  getDropdowndata: async (orgId) => {
    let { DropDownData } = get();

    const token = localStorage.getItem("token");

    axios
      .get(`${MAIN_URL}/api/organizations/${orgId}/department`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.departments = response?.data?.Departments;
      });

    axios
      .get(`${MAIN_URL}/api/organizations/${orgId}/units`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.Units = response?.data?.Unit?.data;
      });

    axios
      .get(`${MAIN_URL}/api/organizations/${orgId}/work-model`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.WorkModels = response?.data?.workmodel.data;
      });

    axios
      .get(`${MAIN_URL}/api/organizations/${orgId}/workshift`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.WorkShifts = response?.data?.workshifts?.data;
      });

    axios
      .get(`${MAIN_URL}/api/organizations/${orgId}/designation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.designations = response?.data?.organizationdesignation;
      });

    axios
      .get(`${MAIN_URL}/api/organizations/${orgId}/employment-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.EmploymentStatus = response?.data?.status?.data;
      });

    axios
      .get(`${MAIN_URL}/api/organizations/${orgId}/employment-stages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.EmployeeStages = response?.data?.stages?.data;
      });

    axios
      .get(`${MAIN_URL}/api/organizations/${orgId}/employee?mode=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.Employees = response?.data?.employees;
      });

    axios
      .get(`${MAIN_URL}/api/organizations/${orgId}/employemnt-type`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.EmploymentTypes = response?.data?.employemtType?.data;
      });

    axios
      .get(`${MAIN_URL}/api/organizations/${orgId}/language`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.Languages = response?.data?.Languages?.data;
      });

    axios
      .get(`${MAIN_URL}/api/organizations/${orgId}/employemnt-addresstype`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.EmploymentAddressType = response.data.addresstype.data;
      });

    set({ DropDownData });
  },
}));


export default useEmployeeDataStore;
