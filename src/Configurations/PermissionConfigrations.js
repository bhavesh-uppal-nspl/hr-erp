export let routes = [
  { name: "/organization/details", action: "View_Organization_List" },
  { name: "/organization/details/add", action: "All_Organization" },
  { name: "/organization/details/edit", action: "Edit_Organization" },
  { name: "/organization/details", action: "Delete_Organization" },
    { name: "/organization/details", action: "Switch_Organization" },
  { name: "/users", action: "USER_VIEW_LIST" },
  { name: "/users/add", action: "USER_ADD" },
  { name: "/users/edit", action: "USER_EDIT" },
   { name: "/users", action: "USER_DELETE" },
     { name: "/settings/change-password", action: "USER_RESET_PASSWORD" },
  { name: "/organization/departments", action: "ORG_STRUCTURE_VIEW" },
  { name: "/organization/departments/add", action: "ORG_STRUCTURE_ADD" },
  { name: "/organization/departments/edit", action: "ORG_STRUCTURE_EDIT" },
  { name: "/organization/units", action: "ORG_STRUCTURE_VIEW" },
  { name: "/organization/units/add", action: "ORG_STRUCTURE_ADD" },
  { name: "/organization/units/edit", action: "ORG_STRUCTURE_EDIT" },
    { name: "/organization/profile", action: "ORG_STRUCTURE_VIEW" },
  { name: "/organization/designation", action: "ORG_STRUCTURE_VIEW" },
  { name: "/organization/designation/add", action: "ORG_STRUCTURE_ADD" },
  { name: "/organization/designation/edit", action: "ORG_STRUCTURE_EDIT" },

    { name: "/organization/location", action: "ORG_STRUCTURE_VIEW" },
  { name: "/organization/location/add", action: "ORG_STRUCTURE_ADD" },
  { name: "/organization/location/edit", action: "ORG_STRUCTURE_EDIT" },

  { name: "/organization/registrations", action: "ORG_STRUCTURE_VIEW" },
  { name: "/organization/registrations/add", action: "ORG_STRUCTURE_ADD" },
  { name: "/organization/registrations/edit", action: "ORG_STRUCTURE_EDIT" },



  { name: "/organization-configration/employee-status/add", action: "" },
  { name: "/intern/internship/status/add", action: "" },

    {
    name: "/organization-configration/business-ownership-type/add",
    action: "ORG_CONFIG_ADD",
  },

  {
    name: "/organization-configration/business-ownership-type/edit",
    action: "ORG_CONFIG_EDIT",
  },
   {
    name: "/organization-configration/business-ownership-type",
    action: "ORG_CONFIG_VIEW",
  },



  
    {
    name: "/organization-configration/unit-types/add",
    action: "ORG_CONFIG_ADD",
  },
    
    {
    name: "/organization-configration/unit-types/edit",
    action: "ORG_CONFIG_EDIT",
  },
    {
    name: "/organization-configration/unit-types",
    action: "ORG_CONFIG_VIEW",
  },

      {
    name: "/organization-configration/residential-ownership-type/add",
    action: "ORG_CONFIG_ADD",
  },
       {
    name: "/organization-configration/residential-ownership-type/edit",
    action: "ORG_CONFIG_EDIT",
  },
       {
    name: "/organization-configration/residential-ownership-type",
    action: "ORG_CONFIG_VIEW",
  },



  
      {
    name: "/organization-configration/location-ownership-type",
    action: "ORG_CONFIG_VIEW",
  },
  
      {
    name: "/organization-configration/location-ownership-type/add",
    action: "ORG_CONFIG_ADD",
  },
      {
    name: "/organization-configration/location-ownership-type/edit",
    action: "ORG_CONFIG_EDIT",
  },




  
       {
    name: "/organization-configration/work-model",
    action: "ORG_CONFIG_VIEW",
  },
     {
    name: "/organization-configration/work-model/add",
    action: "ORG_CONFIG_ADD",
  },
       {
    name: "/organization-configration/work-model/edit",
    action: "ORG_CONFIG_EDIT",
  },

    


    {
    name: "/organization-configration/languages",
    action: "ORG_CONFIG_VIEW",
  },
  
  {
    name: "/organization-configration/languages/add",
    action: "ORG_CONFIG_ADD",
  },

          {
    name: "/organization-configration/languages/edit",
    action: "ORG_CONFIG_EDIT",
  },



  {
    name: "/organization-configration/business-registration-type",
    action: "ORG_CONFIG_VIEW",
  },
  {
    name: "/organization-configration/business-registration-type/add",
    action: "ORG_CONFIG_ADD",
  },
  { name: "/organization-configration/business-registration-type/edit", action: "ORG_CONFIG_EDIT" },



  { name: "/organization-configration/employee-address-types", action: "ORG_CONFIG_VIEW" },
  { name: "/organization-configration/employee-address-types/add", action: "ORG_CONFIG_ADD" },
  { name: "/organization-configration/employee-address-types/edit", action: "ORG_CONFIG_EDIT" },

  { name: "/organization-configration/employee-status", action: "ORG_CONFIG_VIEW" },
  { name: "/organization-configration/employee-status/add", action: "ORG_CONFIG_ADD" },
  { name: "/organization-configration/employee-status/edit", action: "ORG_CONFIG_EDIT" },

  { name: "/organization-configration/employement-type", action: "ORG_CONFIG_VIEW" },
  { name: "/organization-configration/employement-type/add", action: "ORG_CONFIG_ADD" },
  { name: "/organization-configration/employement-type/edit", action: "ORG_CONFIG_EDIT" },

  {
    name: "/organization-configration/employement-exit-reason-type",
    action: "ORG_CONFIG_VIEW",
  },
  {
    name: "/organization-configration/employement-exit-reason-type/add",
    action: "ORG_CONFIG_ADD",
  },
  {
    name: "/organization-configration/employement-exit-reason-type/edit",
    action: "ORG_CONFIG_EDIT",
  },

  { name: "/organization-configration/employement-exit-reason", action: "ORG_CONFIG_VIEW" },
  {
    name: "/organization-configration/employement-exit-reason/add",
    action: "ORG_CONFIG_ADD",
  },
  { name: "/organization-configration/employement-exit-reason/edit", action: "ORG_CONFIG_EDIT" },

  { name: "/organization-configration/holiday-types", action: "ORG_CONFIG_VIEW" },
  { name: "/organization-configration/holiday-types/add", action: "ORG_CONFIG_ADD" },
  { name: "/organization-configration/holiday-types/edit", action: "ORG_CONFIG_EDIT" },

  { name: "/organization-configration/leave-category", action: "ORG_CONFIG_VIEW" },
  { name: "/organization-configration/leave-category/add", action: "ORG_CONFIG_ADD" },
  { name: "/organization-configration/leave-category/edit", action: "ORG_CONFIG_EDIT" },

  { name: "/organization-configration/leave-types", action: "ORG_CONFIG_VIEW" },
  { name: "/organization-configration/leave-types/add", action: "ORG_CONFIG_ADD" },
  { name: "/organization-configration/leave-types/edit", action: "ORG_CONFIG_EDIT" },

  { name: "/organization-configration/leave-reason", action: "ORG_CONFIG_VIEW" },
  { name: "/organization-configration/leave-reason/add", action: "ORG_CONFIG_ADD" },
  { name: "/organization-configration/leave-reason/edit", action: "ORG_CONFIG_EDIT" },

  { name: "/organization-configration/leave-reason-type", action: "ORG_CONFIG_VIEW" },
  { name: "/organization-configration/leave-reason-type/add", action: "ORG_CONFIG_ADD" },
  { name: "/organization-configration/leave-reason-type/edit", action: "ORG_CONFIG_EDIT" },

  { name: "/organization-configration/workshift-types", action: "ORG_CONFIG_VIEW" },
  { name: "/organization-configration/workshift-types/add", action: "ORG_CONFIG_ADD" },
  { name: "/organization-configration/workshift-types/edit", action: "ORG_CONFIG_EDIT" },

  // { name: "/application/user-role-permission", action: "" },
  // { name: "/application/user-role-permission/add", action: "" },
  // { name: "/application/user-role-permission/edit", action: "" },

  // { name: "/application/userrole-assignments", action: "" },
  // { name: "/application/userrole-assignments/add", action: "" },
  // { name: "/application/userrole-assignments/edit", action: "" },

  // { name: "/organization-configration/user-types", action: "" },
  { name: "/organization-configration/user-types/add", action: "ORG_CONFIG_ADD" },
  { name: "/organization-configration/user-types/edit", action: "ORG_CONFIG_EDIT" },

//   { name: "/organization/setting-types", action: "" },
//   { name: "/organization/setting-types/add", action: "" },
//   { name: "/organization/setting-types/edit", action: "" },

//   { name: "/organization/settings", action: "" },
//   { name: "/organization/settings/add", action: "" },
//   { name: "/organization/settings/edit", action: "" },

  {
    name: "/organization/employee/employee-details",
    action: "EMPLOYEE_VIEW_LIST",
  },
  {
    name: "/organization/employee/employee-details/add",
    action: "EMPLOYEE_ADD",
  },
  {
    name: "/organization/employee/employee-details/edit",
    action: "EMPLOYEE_EDIT",
  },

  //   {
  //   name: "/organization/employee/employee-details",
  //   action: "Delete Employee",
  // },

//   { name: "/organization/employee/employee-exits", action: "" },
//   { name: "/organization/employee/employee-exits/add", action: "" },
//   { name: "/organization/employee/employee-exits/edit", action: "" },

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

//   { name: "/organization/location", action: "" },
//   { name: "/organization/location/add", action: "" },
//   { name: "/organization/location/edit", action: "" },

//   { name: "/employee/employee-contacts", action: "" },
//   { name: "/employee/employee-contacts/add", action: "" },
//   { name: "/employee/employee-contacts/edit", action: "" },

//   { name: "/organization/system-modules", action: "" },
//   { name: "/organization/system-modules/add", action: "" },
//   { name: "/organization/system-modules/edit", action: "" },

//   { name: "/organization/module-action", action: "" },
//   { name: "/organization/module-action/add", action: "" },
//   { name: "/organization/module-action/edit", action: "" },

//   { name: "/application/user-roles", action: "" },
//   { name: "/application/user-roles/add", action: "" },
//   { name: "/application/user-roles/edit", action: "" },

//   { name: "/application/user-modules", action: "" },
//   { name: "/application/user-modules/add", action: "" },
//   { name: "/application/user-modules/edit", action: "" },

//   { name: "/application/user", action: "USER_VIEW_LIST" },
//   { name: "/application/user/add", action: "USER_ADD" },
//   { name: "/application/user/edit", action: "USER_EDIT" },

//   { name: "/application/user-role-assignment", action: "" },
//   { name: "/application/user-role-assignment/add", action: "" },
//   { name: "/application/user-role-assignment/edit", action: "" },

//   { name: "/application/user-modules", action: "" },
//   { name: "/application/user-modules/add", action: "" },
//   { name: "/application/user-modules/edit", action: "" },

//   { name: "/application/user-modules", action: "" },
//   { name: "/application/user-modules/add", action: "" },
//   { name: "/application/user-modules/edit", action: "" },
];
