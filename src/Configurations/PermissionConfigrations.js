import { PanelRightClose } from "lucide-react";

export let routes = [

  // start 

  // employee exits 
  { name: "/organization/employee/employee-details", action: "EMPLOYEE_VIEW_LIST" },
  { name: "/organization/employee/employee-details/add", action: "EMPLOYEE_ADD" },
  { name: "/organization/employee/employee-details/edit", action: "EMPLOYEE_EDIT" },

  // employee exits 
  { name: "/organization/employee/employee-exits", action: "EMPLOYEE_EXIT_VIEW_LIST" },
  { name: "/organization/employee/employee-exits/add", action: "EMPLOYEE_EXIT_ADD" },
  { name: "/organization/employee/employee-exits/edit", action: "EMPLOYEE_EXIT_EDIT" },

// employee records
  { name: "/organization/employee/records", action: "EMPLOYEE_RECORD_LIST" },
  { name: "/organization/employee/records/add", action: "EMPLOYEE_RECORD_ADD" },
  { name: "/organization/employee/records/edit", action: "EMPLOYEE_RECORD_EDIT" },

// functional role 
  { name: "/organization/employee/functional-role", action: "EMPLOYEE_FUNCTIONAL_ROLE_VIEW_LIST" },
  { name: "/organization/employee/functional-role/add", action: "EMPLOYEE_FUNCTIONAL_ROLE_ADD" },
  { name: "/organization/employee/functional-role/edit", action: "EMPLOYEE_FUNCTIONAL_ROLE_EDIT" },

  // employment stages 
  { name: "/employment/employee-stages", action: "EMPLOYEE_STAGE_VIEW_LIST" },
  { name: "/employment/employee-stages/add", action: "EMPLOYEE_STAGE_ADD" },
  { name: "/employment/employee-stages/edit", action: "EMPLOYEE_STAGE_EDIT" },

// document types
  { name: "/employee/document/types", action: "EMPLOYEE_DOCUMENT_TYPE_VIEW_LIST" },
  { name: "/employee/document/types/add", action: "EMPLOYEE_DOCUMENT_TYPE_ADD" },
  { name: "/employee/document/types/edit", action: "EMPLOYEE_DOCUMENT_TYPE_EDIT" },

// document 
  { name: "/employee/documents", action: "EMPLOYEE_DOCUMENT_VIEW_LIST" },
  { name: "/employee/documents/add", action: "EMPLOYEE_DOCUMENT_ADD" },
  { name: "/employee/documents/edit", action: "EMPLOYEE_DOCUMENT_EDIT" },


  // skills category
  { name: "/organization/skill-category", action: "SKILL_CATAGORY_LIST" },
  { name: "/organization/skill-category/add", action: "SKILL_CATAGORY_ADD" },
  { name: "/organization/skill-category/edit", action: "SKILL_CATAGORY_EDIT" },


  // skills category group
  { name: "/organization/skill-element-group", action: "SKILL_ELEMENT_GROUP_LIST" },
  { name: "/organization/skill-element-group/add", action: "SKILL_ELEMENT_GROUP_ADD" },
  { name: "/organization/skill-element-group/edit", action: "SKILL_ELEMENT_GROUP_EDIT" },

  // functional role skill
  { name: "/organization/func-role-skill", action: "FUNCTIONAL_ROLE_SKILL_LIST" },
  { name: "/organization/func-role-skill/add", action: "FUNCTIONAL_ROLE_SKILL_ADD" },
  { name: "/organization/func-role-skill/edit", action: "FUNCTIONAL_ROLE_SKILL_EDIT" },


  // functional role skill element
  { name: "/organization/func-role-skill-element", action: "FUNCTIONAL_ROLE_SKILL_ELEMENT_LIST" },
  { name: "/organization/func-role-skill-element/add", action: "FUNCTIONAL_ROLE_SKILL_ELEMENT_ADD" },
  { name: "/organization/func-role-skill-element/edit", action: "FUNCTIONAL_ROLE_SKILL_ELEMENT_EDIT" },



  // works shifts 
  { name: "/organization/work-shift", action: "SHIFT_VIEW_LIST" },
  { name: "/organization/work-shift/add", action: "SHIFT_ADD" },
  { name: "/organization/work-shift/edit", action: "SHIFT_EDIT" },

// WORKSHIFT DAYS 
  { name: "/organization/work-shift-days", action: "SHIFT_DAYS_LIST" },
  { name: "/organization/work-shift-days/add", action: "SHIFT_DAYS_ADD" },
  { name: "/organization/work-shift-days/edit", action: "SHIFT_DAYS_EDIT" },


  // work model days 
  { name: "/organization/work-model-days", action: "SHIFT_MODEL_DAYS_LIST" },
  { name: "/organization/work-model-days/add", action: "SHIFT_MODEL_DAYS_ADD" },
  { name: "/organization/work-model-days/edit", action: "SHIFT_MODEL_DAYS_EDIT" },

  // workshift assignments 
  { name: "/organization/work-shift-assignment", action: "SHIFT_ASSIGNMENT_LIST" },
  { name: "/organization/work-shift-assignment/add", action: "SHIFT_ASSIGNMENT_ADD" },
  { name: "/organization/work-shift-assignment/edit", action: "SHIFT_ASSIGNMENT_EDIT" },

// workshift rotation pattern
   { name: "/organization/work-shift-rotation-pattern", action: "SHIFT_ROTATION_PATTERN_LIST" },
  { name: "/organization/work-shift-rotation-pattern/add", action: "SHIFT_ROTATION_PATTERN_ADD" },
  { name: "/organization/work-shift-rotation-pattern/edit", action: "SHIFT_ROTATION_PATTERN_EDIT" },

  // rotation days
   { name: "/organization/work-shift-rotation-days", action: "SHIFT_ROTATION_DAYS_LIST" },
  { name: "/organization/work-shift-rotation-days/add", action: "SHIFT_ROTATION_DAYS_ADD" },
  { name: "/organization/work-shift-rotation-days/edit", action: "SHIFT_ROTATION_DAYS_EDIT" },

  // shift rotation assignment
   { name: "/organization/work-shift-rotation-assignment", action: "SHIFT_ROTATION_ASSIGNMENT_LIST" },
  { name: "/organization/work-shift-rotation-assignment/add", action: "SHIFT_ROTATION_ASSIGNMENT_ADD" },
  { name: "/organization/work-shift-rotation-assignment/edit", action: "SHIFT_ROTATION_ASSIGNMENT_EDIT" },

  // attendance time logs
   { name: "/attendance/time-logs", action: "ATTENDANCE_VIEW_LIST" },
  { name: "/attendance/time-logs/add", action: "ATTENDANCE_TIME_LOG_ADD" },
  { name: "/attendance/time-logs/edit", action: "ATTENDANCE_TIME_LOG_EDIT" },

  // attendance records
   { name: "/attendance/employee-record", action: "ATTENDANCE_RECORDS_LIST" },

  //  attendance record without break 
    { name: "/attendance/employee-record-without-break", action: "ATTENDANCE_RECORD_WITHOUT_BREAK" },

    // holiday calendar
     { name: "/leave/holiday-calendar", action: "HOLIDAY_CALENDAR_LIST" },
  { name: "/leave/holiday-calendar/add", action: "HOLIDAY_CALENDAR_ADD" },
  { name: "/leave/holiday-calendar/edit", action: "HOLIDAY_CALENDAR_EDIT" },

  // employee leaves 
       { name: "/leave/employee-leaves", action: "EMPLOYEE_LEAVE_LIST" },
  { name: "/leave/employee-leaves/add", action: "EMPLOYEE_LEAVE_ADD" },
  { name: "/leave/employee-leaves/edit", action: "EMPLOYEE_LEAVE_EDIT" },

  // employee entitlments
      { name: "/leave/employee-entitlements", action: "EMPLOYEE_ENTITLEMENT_LIST" },
    { name: "/leave/employee-entitlements/add", action: "EMPLOYEE_ENTITLEMENT_ADD" },
    { name: "/leave/employee-entitlements/edit", action: "EMPLOYEE_ENTITLEMENT_EDIT" },


    // leave summary 
      { name: "/employee-leave-summary", action: "LEAVE_SUMMARY_LIST" },


      // leave balance report 
      { name: "/employee-leave-balance-report", action: "LEAVE_BALANCE_REPORT" },



      // increments types 
       { name: "/employee/increment-types", action: "INCREMENT_TYPE_LIST" },
    { name: "/employee/increment-types/add", action: "INCREMENT_TYPE_ADD" },
    { name: "/employee/increment-types/edit", action: "INCREMENT_TYPE_EDIT" },

    // increments 
     { name: "/employee/increment", action: "INCREMENT_LIST" },
    { name: "/employee/increment/add", action: "INCREMENT_ADD" },
    { name: "/employee/increment/edit", action: "INCREMENT_EDIT" },

    // skills category 
    { name: "/organization/skill-category", action: "SKILL_CATAGORY_LIST" },
    { name: "/organization/skill-category/add", action: "SKILL_CATAGORY_ADD" },
    { name: "/organization/skill-category/edit", action: "SKILL_CATAGORY_EDIT" },


    // skill element group
    { name: "/organization/skill-element-group", action: "SKILL_ELEMENT_GROUP_LIST" },
    { name: "/organization/skill-element-group/add", action: "SKILL_ELEMENT_GROUP_ADD" },
    { name: "/organization/skill-element-group/edit", action: "SKILL_ELEMENT_GROUP_EDIT" },


    // functional role skill 
    { name: "/organization/func-role-skill", action: "FUNCTIONAL_ROLE_SKILL_LIST" },
    { name: "/organization/func-role-skill/add", action: "FUNCTIONAL_ROLE_SKILL_ADD" },
    { name: "/organization/func-role-skill/edit", action: "FUNCTIONAL_ROLE_SKILL_EDIT" },



    // functional role skill element
    { name: "/organization/func-role-skill-element", action: "FUNCTIONAL_ROLE_SKILL_ELEMENT_LIST" },
    { name: "/organization/func-role-skill-element/add", action: "FUNCTIONAL_ROLE_SKILL_ELEMENT_ADD" },
    { name: "/organization/func-role-skill-element/edit", action: "FUNCTIONAL_ROLE_SKILL_ELEMENT_EDIT" },


    // learning directory 


    // provider types 
    { name: "/organization/learning-provider-type", action: "LEARNING_PROVIDER_TYPE_LIST" },
    { name: "/organization/learning-provider-type/add", action: "LEARNING_PROVIDER_TYPE_ADD" },
    { name: "/organization/learning-provider-type/edit", action: "LEARNING_PROVIDER_TYPE_EDIT" },



    { name: "/organization/learning-provider", action: "LEARNING_PROVIDER_LIST" },
    { name: "/organization/learning-provider/add", action: "LEARNING_PROVIDER_ADD" },
    { name: "/organization/learning-provider/edit", action: "LEARNING_PROVIDER_EDIT" },


    //  learning resources  
    { name: "/organization/learning-resources", action: "LEARNING_RESOURCE_LIST" },
    { name: "/organization/learning-resources/add", action: "LEARNING_RESOURCE_ADD" },
    { name: "/organization/learning-resources/edit", action: "LEARNING_RESOURCE_EDIT" },
    

// learning functioanl role 
       { name: "/organization/learning-functional-role", action: "LEARNING_FUNCTIONAL_ROLE_LIST" },
    { name: "/organization/learning-functional-role/add", action: "LEARNING_FUNCTIONAL_ROLE_ADD" },
    { name: "/organization/learning-functional-role/edit", action: "LEARNING_FUNCTIONAL_ROLE_EDIT" },




  // learning skill element 
       { name: "/organization/learning-skill-element", action: "LEARNING_SKILL_ELEMENT_LIST" },
    { name: "/organization/learning-skill-element/add", action: "LEARNING_SKILL_ELEMENT_ADD" },
    { name: "/organization/learning-skill-element/edit", action: "LEARNING_SKILL_ELEMENT_EDIT" },

    // organization setup 


    // organizations 
      { name: "/organization/details", action: "ORGANIZATION_LIST" },
    { name: "/organization/details/add", action: "ORGANIZATION_ADD" },
    { name: "/organization/details/edit", action: "ORGANIZATION_EDIT" },


    // organization entities 
     { name: "/organization/entity", action: "ENTITY_LIST" },
    { name: "/organization/entity/add", action: "ENTITY_ADD" },
    { name: "/organization/entity/edit", action: "ENTITY_EDIT" },

    // profile 
    { name: "/organization/profile", action: "ORGANIZATION_PROFILE_LIST" },

    // organization department 
     { name: "/organization/departments", action: "DEPARTMENT_LIST" },
    { name: "/organization/departments/add", action: "DEPARTMENT_ADD" },
    { name: "/organization/departments/edit", action: "DEPARTMENT_EDIT" },


    // organization designation
     { name: "/organization/designation", action: "DESIGNATION_LIST" },
    { name: "/organization/designation/add", action: "DESIGNATION_ADD" },
    { name: "/organization/designation/edit", action: "DESIGNATION_EDIT" },

    // location 
  { name: "/organization/location", action: "LOCATION_LIST" },
  { name: "/organization/location/add", action: "LOCATION_ADD" },
  { name: "/organization/location/edit", action: "LOCATION_EDIT" },

  // organization units 
  { name: "/organization/units", action: "UNITS_LIST" },
  { name: "/organization/units/add", action: "UNITS_ADD" },
  { name: "/organization/units/edit", action: "UNITS_EDIT" },

  // registrations
  { name: "/organization/registrations", action: "REGISTRATION_LIST" },
  { name: "/organization/registrations/add", action: "REGISTRATION_ADD" },
  { name: "/organization/registrations/edit", action: "REGISTRATION_EDIT" },


  // attendance status types 
  { name: "/attendance/status-type", action: "ATTENDANCE_STATUS_LIST" },
  { name: "/attendance/status-type/add", action: "ATTENDANCE_STATUS_ADD" },
  { name: "/attendance/status-type/edit", action: "ATTENDANCE_STATUS_EDIT" },

  // attendance deviation reason 
  { name: "/attendance/deviation-reason", action: "ATENDANCE_DEVIATION_REASON_LIST" },
  { name: "/attendance/deviation-reason/add", action: "ATENDANCE_DEVIATION_REASON_ADD" },
  { name: "/attendance/deviation-reason/edit", action: "ATENDANCE_DEVIATION_REASON_EDIT" },

  // attendance break type 

  { name: "/attendance/break-type", action: "ATTENDANCE_BREAK_TYPE_LIST" },
  { name: "/attendance/break-type/add", action: "ATTENDANCE_BREAK_TYPE_ADD" },
  { name: "/attendance/break-type/edit", action: "ATTENDANCE_BREAK_TYPE_EDIT" },

  // attendance source 
  { name: "/attendance/source", action: "ATTENDANCE_SOURCE_LIST" },
  { name: "/attendance/source/add", action: "ATTENDANCE_SOURCE_ADD" },
  { name: "/attendance/source/edit", action: "ATTENDANCE_SOURCE_EDIT" },

  // attendance break
  { name: "/organization/attendance-break", action: "ATTENDANCE_BREAK_TYPE_LIST" },
  { name: "/organization/attendance-break/add", action: "ATTENDANCE_BREAK_TYPE_ADD" },
  { name: "/organization/attendance-break/edit", action: "ATTENDANCE_BREAK_TYPE_EDIT" },


  // workshift break 
  { name: "/organization/workshift-break", action: "WORKSHIFT_BREAK_LIST" },
  { name: "/organization/workshift-break/add", action: "WORKSHIFT_BREAK_ADD" },
  { name: "/organization/workshift-break/edit", action: "WORKSHIFT_BREAK_EDIT" },



  // leave policy 
  { name: "/organization/leave-policy", action: "LEAVE_POLICY_LIST" },
  { name: "/organization/leave-policy/add", action: "LEAVE_POLICY_ADD" },
  { name: "/organization/leave-policy/edit", action: "LEAVE_POLICY_EDIT" },


  // organization functional role 
  { name: "/organization/functional-roles", action: "FUNCTIONAL_ROLE_LIST" },
  { name: "/organization/functional-roles/add", action: "FUNCTIONAL_ROLE_ADD" },
  { name: "/organization/functional-roles/edit", action: "FUNCTIONAL_ROLE_EDIT" },


  // organization functional role 
  { name: "/organization/functional-role-specialization", action: "FUNCTIONAL_ROLE_SPECIALIZATION" },
  { name: "/organization/functional-role-specialization/add", action: "FUNCTIONAL_ROLE_SPECIALIZATION_ADD" },
  { name: "/organization/functional-role-specialization/edit", action: "FUNCTIONAL_ROLE_SPECIALIZATION_EDIT" },


  // configrations 

  // organization business ownership type
   { name: "/organization-configration/business-ownership-type", action: "BUSINESS_OWNERSHIP_TYPE_LIST" },
  { name: "/organization-configration/business-ownership-type/add", action: "BUSINESS_OWNERSHIP_TYPE_ADD" },
  { name: "/organization-configration/business-ownership-type/edit", action: "BUSINESS_OWNERSHIP_TYPE_EDIT" },

  // business registration type
  { name: "/organization-configration/business-registration-type", action: "BUSINESS_REGISTRATION_TYPE_LIST" },
  { name: "/organization-configration/business-registration-type/add", action: "BUSINESS_REGISTRATION_TYPE_ADD" },
  { name: "/organization-configration/business-registration-type/edit", action: "BUSINESS_REGISTRATION_TYPE_EDIT" },

  // business unit types 
  { name: "/organization-configration/unit-types", action: "BUSINESS_UNIT_TYPE_LIST" },
  { name: "/organization-configration/unit-types/add", action: "BUSINESS_UNIT_TYPE_ADD" },
  { name: "/organization-configration/unit-types/edit", action: "BUSINESS_UNIT_TYPE_EDIT" },


  // residential ownership type 
   { name: "/organization-configration/residential-ownership-type", action: "RESIDENTIAL_OWNERSHIP_TYPE_LIST" },
  { name: "/organization-configration/residential-ownership-type/add", action: "RESIDENTIAL_OWNERSHIP_TYPE_ADD" },
  { name: "/organization-configration/residential-ownership-type/edit", action: "RESIDENTIAL_OWNERSHIP_TYPE_EDIT" },

  // location ownership type 
  { name: "/organization-configration/location-ownership-type", action: "LOCATION_OWNERSHIP_TYPE_LIST" },
  { name: "/organization-configration/location-ownership-type/add", action: "LOCATION_OWNERSHIP_TYPE_ADD" },
  { name: "/organization-configration/location-ownership-type/edit", action: "LOCATION_OWNERSHIP_TYPE_EDIT" },

  // address types 
  { name: "/organization-configration/employee-address-types", action: "ADDRESS_TYPE_LIST" },
  { name: "/organization-configration/employee-address-types/add", action: "ADDRESS_TYPE_ADD" },
  { name: "/organization-configration/employee-address-types/edit", action: "ADDRESS_TYPE_EDIT" },

  // employment stataus 
  { name: "/organization-configration/employee-status", action: "EMPLOYEMENT_STATUS_LIST" },
  { name: "/organization-configration/employee-status/add", action: "EMPLOYEMENT_STATUS_ADD" },
  { name: "/organization-configration/employee-status/edit", action: "EMPLOYEMENT_STATUS_EDIT" },


  // exit reason 
  { name: "/organization-configration/employement-exit-reason-type", action: "EMPLOYEE_EXIT_VIEW_LIST" },
  { name: "/organization-configration/employement-exit-reason-type/add", action: "EMPLOYEE_EXIT_ADD" },
  { name: "/organization-configration/employement-exit-reason-type/edit", action: "EMPLOYEE_EXIT_EDIT" },



  
  
  // employment category 
  { name: "/organization-configration/employement-category", action: "EMPLOYMENT_CATEGORY_LIST" },
  { name: "/organization-configration/employement-category/add", action: "EMPLOYMENT_CATEGORY_ADD" },
  { name: "/organization-configration/employement-category/edit", action: "EMPLOYMENT_CATEGORY_EDIT" },


    { name: "/organization-configration/employement-exit-reason", action: "EXIT_REASON_LIST" },
  { name: "/organization-configration/employement-exit-reason/add", action: "EXIT_REASON_ADD" },
  { name: "/organization-configration/employement-exit-reason/edit", action: "EXIT_REASON_EDIT" },

  // holiday types 
   { name: "/organization-configration/holiday-types", action: "HOLIDAY_TYPE_LIST" },
  { name: "/organization-configration/holiday-types/add", action: "HOLIDAY_TYPE_ADD" },
  { name: "/organization-configration/holiday-types/edit", action: "HOLIDAY_TYPE_EDIT" },

  // leave category 
    { name: "/organization-configration/leave-category", action: "LEAVE_CATEGORY_LIST" },
    { name: "/organization-configration/leave-category/add", action: "LEAVE_CATEGORY_ADD" },
    { name: "/organization-configration/leave-category/edit", action: "LEAVE_CATEGORY_EDIT" },

    // leave type 
    { name: "/organization-configration/leave-types", action: "LEAVE_TYPE_LIST" },
    { name: "/organization-configration/leave-types/add", action: "LEAVE_TYPE_ADD" },
    { name: "/organization-configration/leave-types/edit", action: "LEAVE_TYPE_EDIT" },

    // leave reason type 
    { name: "/organization-configration/leave-reason-type", action: "LEAVE_REASON_TYPE_LIST" },
    { name: "/organization-configration/leave-reason-type/add", action: "LEAVE_REASON_TYPE_ADD" },
    { name: "/organization-configration/leave-reason-type/edit", action: "LEAVE_REASON_TYPE_EDIT" },


    // leave reason 
    { name: "/organization-configration/leave-reason", action: "LEAVE_REASON_LIST" },
    { name: "/organization-configration/leave-reason/add", action: "LEAVE_REASON_ADD" },
    { name: "/organization-configration/leave-reason/edit", action: "LEAVE_REASON_EDIT" },


  // workshift types
   { name: "/organization-configration/workshift-types", action: "WORKSHIFT_TYPE_LIST" },
  { name: "/organization-configration/workshift-types/add", action: "WORKSHIFT_TYPE_ADD" },
  { name: "/organization-configration/workshift-types/edit", action: "WORKSHIFT_TYPE_EDIT" },

  // work models 
    { name: "/organization-configration/work-model", action: "WORK_MODEL_LIST" },
  { name: "/organization-configration/work-model/add", action: "WORK_MODEL_ADD" },
  { name: "/organization-configration/work-model/edit", action: "WORK_MODEL_EDIT" },


  // user types 
  { name: "/organization-configration/user-types", action: "USER_TYPE_LIST" },
  { name: "/organization-configration/user-types/add", action: "USER_TYPE_ADD" },
  { name: "/organization-configration/user-types/edit", action: "USER_TYPE_EDIT" },
  
  
  // langugages
   { name: "/organization-configration/languages", action: "LANGUAGE_LIST" },
  { name: "/organization-configration/languages/add", action: "LANGUAGE_ADD" },
  { name: "/organization-configration/languages/edit", action: "LANGUAGE_EDIT" },


  // data grid permissions
  
  { name: "/organization-configration/datagrid-config", action: "GRID_CONFIGRATION" },


// intern managment
  { name: "/intern/internship/status", action: "INTERNSHIP_STATUS_LIST" },
  { name: "/intern/internship/status/add", action: "INTERNSHIP_STATUS_ADD" },
  { name: "/intern/internship/status/edit", action: "INTERNSHIP_STATUS_EDIT" },

  // internship types 
    { name: "/intern/internship/types", action: "INTERNSHIP_TYPE_LIST" },
  { name: "/intern/internship/types/add", action: "INTERNSHIP_TYPE_ADD" },
  { name: "/intern/internship/types/edit", action: "INTERNSHIP_TYPE_EDIT" },

    // internship details  
    { name: "/organization/intern/intern-details", action: "INTERN_LIST" },
  { name: "/organization/intern/intern-details/add", action: "INTERN_ADD" },
  { name: "/organization/intern/intern-details/edit", action: "INTERN_EDIT" },


  // intern exits 
    { name: "/organization/intern/intern-exit", action: "INTERN_EXIT_LIST" },
  { name: "/organization/intern/intern-exit/add", action: "INTERN_EXIT_ADD" },
  { name: "/organization/intern/intern-exit/edit", action: "INTERN_EXIT_EDIT" },

  // intern leaves 
    { name: "organization/intern/intern-leaves", action: "INTERN_LEAVE" },
  { name: "organization/intern/intern-leaves/add", action: "INTERN_LEAVE_ADD" },
  { name: "organization/intern/intern-leaves/edit", action: "INTERN_LEAVE_EDIT" },




  // intern  document types 
  { name: "/intern/document/types", action: "INTERN_DOCUMENT" },
  { name: "/intern/document/types/add", action: "INTERN_DOCUMENT_ADD" },
  { name: "/intern/document/types/edit", action: "INTERN_DOCUMENT_EDIT" },

  // intern stipend
  { name: "/organization/intern/intern-stipend", action: "INTERN_STIPEND" },
  { name: "/organization/intern/intern-stipend/add", action: "INTERN_STIPEND_ADD" },
  { name: "/organization/intern/intern-stipend/edit", action: "INTERN_STIPEND_EDIT" },

  //  intern time logs 
  { name: "/intern/attendance/time-logs", action: "INTERN_TIME_LOG_LIST" },
  { name: "/intern/attendance/time-logs/add", action: "INTERN_TIME_LOG_ADD" },
  { name: "/intern/attendance/time-logs/edit", action: "INTERN_TIME_LOG_EDIT" },

  // intern attendance records 
  { name: "/intern/attendance/records", action: "INTERN_ATTENDANCE_RECORD_LIST" },
  { name: "/intern/attendance/records/add", action: "INTERN_ATTENDANCE_RECORD_ADD" },
  { name: "/intern/attendance/records/edit", action: "INTERN_ATTENDANCE_RECORD_EDIT" },


  // intern certificates 
  { name: "/intern/certificates", action: "INTERN_CERTIFICATE_LIST" },
  { name: "/intern/certificates/add", action: "INTERN_CERTIFICATE_ADD" },
  { name: "/intern/certificates/edit", action: "INTERN_CERTIFICATE_EDIT" },


  // intern stages 
  { name: "/intern/intern-stages", action: "INTERN_STAGES_LIST" },
  { name: "/intern/intern-stages/add", action: "INTERN_STAGES_ADD" },
  { name: "/intern/intern-stages/edit", action: "INTERN_STAGES_EDIT" },


  // intern functiona l role 
  { name: "/intern/functional-role", action: "INTERN_FUNCTIONAL_ROLE_LIST" },
  { name: "/intern/functional-role/add", action: "INTERN_FUNCTIONAL_ROLE_ADD" },
  { name: "/intern/functional-role/edit", action: "INTERN_FUNCTIONAL_ROLE_EDIT" },





  //  user managment 
  { name: "/users", action: "USER_VIEW_LIST" },
  { name: "/users/add", action: "USER_ADD" },
  { name: "/users/edit", action: "USER_EDIT" },

  // user roles 
  { name: "/application/user-roles", action: "USER_ROLE_LIST" },
  { name: "/application/user-roles/add", action: "USER_ROLE_ADD" },
  { name: "/application/user-roles/edit", action: "USER_ROLE_EDIT" },


  // user role permission 
  { name: "/application/user-role-permission", action: "USER_ROLE_PERMISSION_LIST" },
  { name: "/application/user-role-permission/add", action: "USER_ROLE_PERMISSION_ADD" },
  { name: "/application/user-role-permission/edit", action: "USER_ROLE_PERMISSION_EDIT" },


  // user permission 
  { name: "/application/user-permission", action: "USER_PERMISSION_LIST" },
  { name: "/application/user-permission/add", action: "USER_PERMISSION_ADD" },
  { name: "/application/user-permission/edit", action: "USER_PERMISSION_EDIT" },


 
// copy  employee 
  { name: "/organization/employee-shift", action: "COPY_EMPLOYEE_LIST" },

  // settings 
  { name: "/organization/settings/new", action: "SETTING_LIST" },


  // change password

  { name: "/settings/change-password", action: "USER_RESET_PASSWORD" },

































  

//   { name: "/leave/holiday-calendar", action: "" },
//   { name: "/leave/holiday-calendar/add", action: "" },
//   { name: "/leave/holiday-calendar/edit", action: "" },

  { name: "/leave/employee-leaves", action: "LEAVE_VIEW_LIST" },
  { name: "/leave/employee-leaves/add", action: "LEAVE_ADD" },
  { name: "/leave/employee-leaves/edit", action: "LEAVE_EDIT" },
  { name: "/leave/employee-leaves", action: "LEAVE_DELETE" },

//   { name: "/reset-password", action: "USER_RESET_PASSWORD" },

  { name: "/organization/work-shift", action: "SHIFT_VIEW_LIST" },
  { name: "/organization/work-shift/add", action: "SHIFT_ADD" },
  { name: "/organization/work-shift/edit", action: "SHIFT_EDIT" },
   { name: "/organization/work-shift", action: "Delete Shift" },
];
