import { create } from "zustand";
import { MAIN_URL } from "../../Configurations/Urls";
import axios from "axios";

const useInternDataStore = create((set, get) => ({
  Intern: {
    intern_code: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    intern_id: "",
    organization_id: "",
    gender: "",
    marital_status: "",
    profile_image_url: "",
    organization_unit_id: "",
    stipend_amount: "",
    organization_department_location_id: "",
    organization_department_id: "",
    organization_designation_id: "",
    organization_internship_type_id: "",
    organization_internship_status_id: "",
    organization_internship_stage_id :"",
    organization_work_shift_id: "",
    organization_user_id: "",
    internship_start_date: "",
    internship_end_date: "",
    organization_user_id: "",
    mentor_employee_id: "",
    is_paid:"",
  },
  InternErrors: {},
  setIntern: (data) => set({ Intern: data }),
  setInternErrors: (data) => set({ InternErrors: data }),
  setInternData: (data) =>
    set((state) => {
      const updatedErrors = { ...state.InternErrors };
      Object.keys(data).forEach((key) => {
        if (updatedErrors[key]) {
          delete updatedErrors[key];
        }
      });

      return {
        Intern: { ...state.Intern, ...data },
        InternErrors: updatedErrors,
      };
    }),


  // education error and data
  Education: [
    {
      intern_education_id: "",
      organization_education_level_id: "",
      organization_education_degree_id: "",
      organization_education_stream_id: "",
      institute_name: "",
      board_name: "",
      marks_percentage: "",
      year_of_passing: "",
      is_pursuing: "",
      intern_id: "",
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
      board_name: "",
      institute_name: "",
      marks_percentage: "",
      year_of_passing: "",
      is_pursuing: "",
      intern_id: "",
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
      intern_language_id: "",
      intern_id: "",
      organization_language_id: "",
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
      intern_id: "",
      organization_language_id: "",
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
      intern_family_member_id: "",
      intern_id: "",
      full_name: "",
      relationship_type: "",
      phone_number: "",
      date_of_birth: "",
      email: "",
      address: "",
      is_emergency_contact: "",
      gender: "",
      organization_id: "",
      is_dependent: "",
      is_active: "",
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
      intern_id: "",
      organization_id: "",
      full_name: "",
      relationship_type: "",
      date_of_birth: "",
      gender: "",
      phone_number: "",
      email: "",
      address: "",
      is_emergency_contact: "",
      is_dependent: "",
      is_active: "",
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
      intern_address_id: "",
      address_line1: "",
      address_line2: "",
      address_line3: "",
      general_city_id: "",
      postal_code: "",
      intern_id: "",
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
      address_line1: "",
      address_line2: "",
      address_line3: "",
      general_city_id: "",
      postal_code: "",
      intern_id: "",
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
      intern_contact_id: "",
      intern_id: "",
      personal_phone_number: "",
      alternate_phone_number: "",
      organization_id: "",
      personal_email: "",
      emergency_contact_name: "",
      emergency_contact_relation: "",
      emergency_contact_phone: "",
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
      intern_id: "",
      organization_id: "",
      personal_phone_number: "",
      alternate_phone_number: "",
      personal_email: "",
      emergency_contact_name: "",
      emergency_contact_relation: "",
      emergency_contact_phone: "",
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
      intern_experience_id: "",
      intern_id: "",
      experience_type: "",
      organization_name: "",
      general_industry_id: "",
      location: "",
      work_title: "",
      description: "",
      work_mode: "",
      compensation_status: "",
      compensation_amount: "",
      currency_code: "",
      start_date: "",
      end_date: "",
      reporting_manager_name: "",
      reporting_manager_contact: "",
      is_verified: "",
      verified_by: "",
      verification_date: "",
      verification_notes: "",
      organization_id: "",
      is_active: "",
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
      intern_id: "",
      experience_type: "",
      organization_name: "",
      general_industry_id: "",
      location: "",
      work_title: "",
      description: "",
      work_mode: "",
      compensation_status: "",
      compensation_amount: "",
      currency_code: "",
      start_date: "",
      end_date: "",
      reporting_manager_name: "",
      reporting_manager_contact: "",
      is_verified: "",
      verified_by: "",
      verification_date: "",
      verification_notes: "",
      organization_id: "",
      is_active: "",
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
      intern_medical_id: "",
      intern_id: "",
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
      intern_id: "",
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
      organization_id: "",
      intern_id: "",
      bank_name: "",
      branch_name: "",
      account_number: "",
      ifsc_code: "",
      swift_code: "",
      iban_number: "",
      upi_id: "",
      is_primary:"",
      wallet_id: "",
      remarks: "",
      account_holder_name: "",
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
      intern_id: "",
      bank_name: "",
      branch_name: "",
      account_number: "",
      ifsc_code: "",
      swift_code: "",
      iban_number: "",
      upi_id: "",
      is_primary:"",
      wallet_id: "",
      remarks: "",
      account_holder_name: "",
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
      intern_document_id: "",
      intern_id: "",
      intern_document_type_id: "",
      organization_id: "",
      organization_entity_id: "",
      document_name: "",
      document_url: "",
      document_size_kb: "",
      organization_employee_profile_section_id: "",
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
      intern_id: "",
      intern_document_type_id: "",
      organization_id: "",
      document_name: "",
      document_url: "",
      organization_employee_profile_section_id: "",
      document_size_kb: "",
      sectionlinks: [],
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
      Intern: {
        intern_code: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth: "",
        intern_id: "",
        organization_id: "",
        gender: "",
        marital_status: "",
        profile_image_url: "",
        organization_unit_id: "",
        stipend_amount: "",
        organization_department_location_id: "",
        organization_work_shift_id: "",
        organization_internship_type_id: "",
        organization_internship_status_id: "",
        organization_internship_stage_id :"",
        organization_department_id: "",
        organization_designation_id: "",
        organization_user_id: "",
        internship_start_date: "",
        internship_end_date: "",
        organization_user_id: "",
        mentor_employee_id: "",
        is_paid:"",
      },
      InternErrors: {},
      Education: [
        {
          intern_education_id: "",
          organization_education_level_id: "",
          organization_education_degree_id: "",
          organization_education_stream_id: "",
          institute_name: "",
          board_name: "",
          marks_percentage: "",
          year_of_passing: "",
          is_pursuing: "",
          intern_id: "",
          organization_id: "",
        },
      ],
      EducationErrors: {},
      Language: [
        {
          intern_language_id: "",
          intern_id: "",
          organization_language_id: "",
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
          intern_family_member_id: "",
          intern_id: "",
          full_name: "",
          relationship_type: "",
          phone_number: "",
          date_of_birth: "",
          email: "",
          address: "",
          is_emergency_contact: "",
          gender: "",
          organization_id: "",
          is_dependent: "",
          is_active: "",
        },
      ],
      FamilyErrors: {},
      Address: [
        {
          intern_address_id: "",
          address_line1: "",
          address_line2: "",
          address_line3: "",
          general_city_id: "",
          postal_code: "",
          intern_id: "",
          organization_id: "",
        },
      ],
      AddressErrors: {},
      Contact: [
        {
          intern_contact_id: "",
          intern_id: "",
          personal_phone_number: "",
          alternate_phone_number: "",
          organization_id: "",
          personal_email: "",
          emergency_contact_name: "",
          emergency_contact_relation: "",
          emergency_contact_phone: "",
        },
      ],
      ContactErrors: {},
      Experience: [
        {
          intern_experience_id: "",
          intern_id: "",
          experience_type: "",
          organization_name: "",
          general_industry_id: "",
          location: "",
          work_title: "",
          description: "",
          work_mode: "",
          compensation_status: "",
          compensation_amount: "",
          currency_code: "",
          start_date: "",
          end_date: "",
          reporting_manager_name: "",
          reporting_manager_contact: "",
          is_verified: "",
          verified_by: "",
          verification_date: "",
          verification_notes: "",
          organization_id: "",
          is_active: "",
        },
      ],
      ExperienceErrors: {},
      Medical: [
        {
          intern_medical_id: "",
          intern_id: "",
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
          intern_bank_account_id: "",
          organization_id: "",
          intern_id: "",
          bank_name: "",
          branch_name: "",
          account_number: "",
          ifsc_code: "",
          swift_code: "",
          iban_number: "",
          upi_id: "",
          is_primary:"",
          wallet_id: "",
          remarks: "",
          account_holder_name: "",
        },
      ],
      PaymentMethodErrors: {},
      Document: [
        {
          intern_document_id: "",
          intern_id: "",
          intern_document_type_id: "",
          organization_id: "",
          organization_entity_id: "",
          document_name: "",
          document_url: "",
          document_size_kb: "",
          organization_employee_profile_section_id: "",
        },
      ],
      DocumentErrors: {},
    });
  },

  DropDownData: {
    departments: [],
    Units: [],
    InternshipTypes: [],
    WorkModels: [],
    designations: [],
    WorkShifts: [],
    InternStatus: [],
    Employees: [],
    Languages: [],
    EmploymentAddressType: [],
    InternStages: [],
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
      .get(`${MAIN_URL}/api/organizations/${orgId}/internship-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.InternStatus = response?.data?.intership?.data;
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
      .get(`${MAIN_URL}/api/organizations/${orgId}/internship-stages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.InternStages = response?.data?.intership?.data;
      });

    axios
      .get(`${MAIN_URL}/api/organizations/${orgId}/internship-type`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        DropDownData.InternshipTypes = response?.data?.intership?.data;
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

export default useInternDataStore;
