// src/Routes/router.jsx
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "../Pages/AuthPages/Login/Login";
import Dashboard from "../Pages/DashBoard/Dashboard";
import PageNotFound from "../Exceptions/PageNotFound";
import RouteProtector from "./Layouts/IndexPageLayout";
import ForgotPassword from "../Pages/AuthPages/Forgot_Password/ForgotPassword";
import ResetPassword from "../Pages/AuthPages/Reset_Password/ResetPassword";
import Users from "../Pages/Users/Users";
import MyTasks from "../Pages/Tasks/MyTasks";
import Features from "../Components/Footer/Features";
import Pricing from "../Components/Footer/Pricing";
import Faq from "../Components/Footer/Faq";
import Terms from "../Components/Footer/Terms";
import Privacy from "../Components/Footer/Privacy";
import Cookies from "../Components/Footer/Cookies";
import Support from "../Components/Footer/Support";
import SystemStatus from "../Components/Footer/SystemStatus";
import Attendance from "../Pages/Attendance/Attendance";
import ChangePassword from "../Pages/Settings/ChangePassword";
import UpdateCredentials from "../Pages/Settings/UpdateCredentials";
import Organisation from "../Pages/Orgnaization/Organisation/Organisation";
import OrganizationProfile from "../Pages/Orgnaization/Profile/OrganizationProfile";
import BusinessDivisionForm from "../Pages/Business/Divisions/BusinessDivisionsForm";
import BusinessRegistrationsForm from "../Pages/Orgnaization/Registrations/OrganizationRegistrationsForm";
import OrganizationLocationForm from "../Pages/Orgnaization/Location/OrganizationLocationForm";
import BusinessUnitForm from "../Pages/Business/Unit/BusinessUnitForm";
import OrganizationLocationList from "../Pages/Orgnaization/Location/OrganizationLocationList";
import BusinessDivisionsList from "../Pages/Business/Divisions/BusinessDivisionsList";
import CoverLayout from "../Pages/DataLayouts/CoverLayout";
import BusinessRegistrationsList from "../Pages/Orgnaization/Registrations/OrganizationRegistrationsList";
import BusinessUnitList from "../Pages/Business/Unit/BusinessUnitList";
import { Configurations } from "../Pages/OptmisedCode/FormConfigurations";
import OrganizationDepartmentForm from "../Pages/Orgnaization/Department/OrganizationDepartmentsForm";
import OrganizationDepartmentsList from "../Pages/Orgnaization/Department/OrganizationDepartmentsList";
import OrganizationDepartmentsLocationList from "../Pages/Departments/Locations/OrganizationDepartmentsLocationList";
import OrganizationDepartmentLocationsForm from "../Pages/Departments/Locations/OrganizationDepartmentLocationsForm";
import UsersAdd from "../Pages/Users/UsersAdd";
import UsersEdit from "../Pages/Users/UserEdit";
import OrganizationEmployementExitReasonsList from "../Pages/OrganizationConfigration/ExitReasons/OrganizationEmployementExitReasonsList";
import OrganizationEmployementExitReasonsForm from "../Pages/OrganizationConfigration/ExitReasons/OrganizationEmployementExitReasonsForm";
import OrganizationEmployementTypesForm from "../Pages/OrganizationConfigration/Types/OrganizationEmployementTypesForm";
import OrganizationEmployementStatusesList from "../Pages/OrganizationConfigration/Statuses/OrganizationEmployementStatusesList";
import OrganizationEmployementStatusesForm from "../Pages/OrganizationConfigration/Statuses/OrganizationEmployementStatusesForm";
import OrganizationEmployementTypesList from "../Pages/OrganizationConfigration/Types/OrganizationEmployementTypesList";
import OrganizationEmployeeAddressTypeForm from "../Pages/OrganizationConfigration/AddressType/OrganizationEmployeeAddressTypeForm";
import OrganizationEmployeeAddressTypeList from "../Pages/OrganizationConfigration/AddressType/OrganizationEmployeeAddressTypeList";
import HolidayCalendarForm from "../Pages/LeaveManagement/Holiday-Calendar/HolidayCalendarForm";
import HolidayCalendarList from "../Pages/LeaveManagement/Holiday-Calendar/HolidayCalendarList";
import HolidayTypesList from "../Pages/OrganizationConfigration/HolidayTypes/HolidayTypesList";
import HolidayTypesForm from "../Pages/OrganizationConfigration/HolidayTypes/HolidayTypesForm";
import HolidayList from "../Pages/Holidays/Holiday'/HolidayList";
import HolidayForm from "../Pages/Holidays/Holiday'/HolidayForm";
import LeaveCategoryList from "../Pages/OrganizationConfigration/LeaveCategory/LeaveCategoryList";
import LeaveCategoryForm from "../Pages/OrganizationConfigration/LeaveCategory/LeaveCategoryForm";
import LeaveTypeList from "../Pages/OrganizationConfigration/LeaveType/LeaveTypeList";
import LeaveTypeForm from "../Pages/OrganizationConfigration/LeaveType/LeaveTypeForm";
import LeaveReasonList from "../Pages/OrganizationConfigration/LeaveReason/LeaveReasonList";
import LeaveReasonForm from "../Pages/OrganizationConfigration/LeaveReason/LeaveReasonForm";
import MyProfile from "../Pages/MyProfile/MyProfilePage";
import EmployeeList from "../Pages/EmployeeManagement/Employees/EmployeesList";
import EmployeeForm from "../Pages/EmployeeManagement/Employees/EmployeesForm";
import EmployeeAddressList from "../Pages/EmployeeManagement/EmployeeAddress/EmployeeAddressList";
import EmployeeAddressForm from "../Pages/EmployeeManagement/EmployeeAddress/EmployeeAddressForm";
import EmployeeExitList from "../Pages/EmployeeManagement/EmployeeExits/EmployeeExitList";
import EmployeeExitForm from "../Pages/EmployeeManagement/EmployeeExits/EmployeeExitForm";
import EmployeeLeaveList from "../Pages/LeaveManagement/EmployeeLeaves/EmployeeLeaveList";
import EmployeeLeaveForm from "../Pages/LeaveManagement/EmployeeLeaves/EmployeeLeaveForm";
import EmployeeContactList from "../Pages/EmployeeManagement/EmployeeContactDetails/EmployeeContactList";
import EmployeeContactForm from "../Pages/EmployeeManagement/EmployeeContactDetails/EmployeeContactForm";
import UserRoleList from "../Pages/User Management/UserRoles/UserRoleList";
import UserRoleForm from "../Pages/User Management/UserRoles/UserRoleForm";
import UserModuleList from "../Pages/ApplicationManagement/UserModules/UserModuleList";
import UserModuleForm from "../Pages/ApplicationManagement/UserModules/UserModulesForm";
import UserList from "../Pages/User Management/User/UserList";
import UserForm from "../Pages/User Management/User/UserForm";
import ApplicationErrorLogList from "../Pages/ApplicationManagement/ApplicationErrorLogs/ApplicationErrorLogList";
import ApplicationErrorLogForm from "../Pages/ApplicationManagement/ApplicationErrorLogs/ApplicationErrorLogForm";
import RoleAssignmentList from "../Pages/User Management/RoleAssignment/RoleAssignmentList";
import RoleAssignmentForm from "../Pages/User Management/RoleAssignment/RoleAssignmentForm";
import FreeTrialPage from "../Pages/AuthPages/FreeTrailPage/TrialPage";
import OtpVerify from "../Pages/AuthPages/OtpVerify/OtpVerify";
import OrganizationDetails from "../Pages/SignUpPages/OrganizationDetails";
import OrganizationUnitList from "../Pages/Orgnaization/Units/OrganizationUnitList";
import OrganizationUnitForms from "../Pages/Orgnaization/Units/OrganizationUnitForm";
import OrganizationDesignationsForm from "../Pages/Orgnaization/Designations/OrganizationDesignationsForm";
import OrganizationDesignationsList from "../Pages/Orgnaization/Designations/OrganizationDesignationsList";
import OrganizationRegistrationsForm from "../Pages/Orgnaization/Registrations/OrganizationRegistrationsForm";
import OrganizationRegistrationsList from "../Pages/Orgnaization/Registrations/OrganizationRegistrationsList";
import BusinessOwnershipTypeForm from "../Pages/OrganizationConfigration/BusinessOwnershipTypes/BusinessOwnershipTypeForm";
import BusinessOwnershipTypeList from "../Pages/OrganizationConfigration/BusinessOwnershipTypes/BusinessOwnershipTypeList";
import BusinessRegistrationTypeForm from "../Pages/OrganizationConfigration/BusinessRegistrationType/BusinessRegistrationTypeForm";
import BusinessRegistrationTypeList from "../Pages/OrganizationConfigration/BusinessRegistrationType/BusinessRegistrationTypeList";
import BusinessUnitTypeForm from "../Pages/OrganizationConfigration/BusinessUnitsTypes/BusinessUnitTypeForm";
import BusinessUnitTypeList from "../Pages/OrganizationConfigration/BusinessUnitsTypes/BusinessUnitTypeList";
import ResidentialOwnershipTypeForm from "../Pages/OrganizationConfigration/ResidentialOwnershipType/ResidentialOwnershipTypeForm";
import ResidentialOwnershipTypeList from "../Pages/OrganizationConfigration/ResidentialOwnershipType/ResidentialOwnershipTypeList";
import LocationOwnershipTypeList from "../Pages/OrganizationConfigration/LocationOwnershipTypes/LocationOwnershipTypeList";
import LocationOwnershipTypeForm from "../Pages/OrganizationConfigration/LocationOwnershipTypes/LocationOwnershipTypeForm";
import OrganizationEmployementExitReasonTypeForm from "../Pages/OrganizationConfigration/ExitReasonType/OrganizationEmployementExitReasonTypeForm";
import OrganizationEmployementExitReasonTypeList from "../Pages/OrganizationConfigration/ExitReasonType/OrganizationEmployementExitReasonTypeList";
import LeaveReasonTypeList from "../Pages/OrganizationConfigration/LeaveReasonType/LeaveReasonTypeList";
import LeaveReasonTypeForm from "../Pages/OrganizationConfigration/LeaveReasonType/LeaveReasonTypeForm";
import WorkModelList from "../Pages/OrganizationConfigration/WorKModel/WorkModelList";
import WorkModelForm from "../Pages/OrganizationConfigration/WorKModel/WorkModelFormForm";
import UserTypeList from "../Pages/OrganizationConfigration/UserTypes/UserTypeList";
import UserTypeForm from "../Pages/OrganizationConfigration/UserTypes/UserTypeForm";
import WorkShiftList from "../Pages/Time & Attendence/WorkShifts/WorkShiftList";
import WorkShiftForm from "../Pages/Time & Attendence/WorkShifts/WorkShiftForm";
import WorkShiftTypeForm from "../Pages/OrganizationConfigration/WorkShiftTypes/WorkShiftTypeForm";
import WorkShiftTypeList from "../Pages/OrganizationConfigration/WorkShiftTypes/WorkShiftTypeList";
import SystemModulesForm from "../Pages/SystemModules/System Modules/SystemModulesForm";
import SystemModulesList from "../Pages/SystemModules/System Modules/SystemModulesList";
import ModuleActionList from "../Pages/SystemModules/ModuleAction/ModuleActionList";
import ModuleActionForm from "../Pages/SystemModules/ModuleAction/ModuleActionForm";
import SettingTypeForm from "../Pages/SystemModules/SettingTypes/SettingTypeForm";
import SettingTypeList from "../Pages/SystemModules/SettingTypes/SettingTypeList";
import SettingList from "../Pages/SystemModules/Settings/SettingList";
import SettingForm from "../Pages/SystemModules/Settings/SettingForm";
import OrganizationAddInList from "../Pages/Orgnaization/Organisation/OrganizationAddInList";
import OrganizationAddInForm from "../Pages/Orgnaization/Organisation/OrganizationAddInForm";
import DynamicFormPage from "../Pages/DataLayouts/DynamicFormPage";
import OrganizationLanguageList from "../Pages/OrganizationConfigration/Languages/OrganizationLanguageList";
import OrganizationLanguageForm from "../Pages/OrganizationConfigration/Languages/OrganizationLanguageForm";
import RolePermissionList from "../Pages/User Management/RolePermission/RolePermissionList";
import RolePermissionForm from "../Pages/User Management/RolePermission/RolePermissionForm";
import ViewRolePermissionForm from "../Pages/User Management/RolePermission/ViewRolePermissionForm";
import PermissionGate from "./PermissionGate";
import PersonalizationModal from "../Pages/DashBoard/PersonalizationModal";
import EmployeesForm from "../Pages/EmployeeManagement/Employees/EmployeesForm";
import EmployeeLeaveEntitlementList from "../Pages/LeaveManagement/EmployeeLeaveEntitlement/EmployeeLeaveEntitlementList";
import EmployeeLeaveEntitlmentForm from "../Pages/LeaveManagement/EmployeeLeaveEntitlement/EmployeeLeaveEntitlmentForm";
import FaceAuth from "../Pages/Time & Attendence/WorkShifts/FaceAuth";

import LevaeBalanceReportList from "../Pages/LeaveManagement/LeaveBalanceReport/LevaeBalanceReportList";
import LeaveSummaryMonthlyReport from "../Pages/LeaveManagement/LevaeSummaryReport/LevaeSummaryMonthlyReportList";
import AttendenceStatusTypeList from "../Pages/AttendenceRecord/AttendenceStatusType/AttendenceStatusTypeList";
import AttendenceStatusTypeForm from "../Pages/AttendenceRecord/AttendenceStatusType/AttendenceStatusTypeForm";
import AttendenceSourceList from "../Pages/AttendenceRecord/AttendenceSource/AttendenceSourceList";
import AttendenceSourceForm from "../Pages/AttendenceRecord/AttendenceSource/AttendenceSourceForm";
import AttendenceDeviationReasonTypeForm from "../Pages/AttendenceRecord/AttendanceDeiationReasonType/AttendenceDeviationReasonTypeForm";
import AttendenceDeviationReasonTypeList from "../Pages/AttendenceRecord/AttendanceDeiationReasonType/AttendenceDeviationReasonTypeList";
import AttendanceDeviationReasonList from "../Pages/AttendenceRecord/AttendanceDeviationReason/AttendanceDeviationReasonList";
import AttendanceDeviationReasonForm from "../Pages/AttendenceRecord/AttendanceDeviationReason/AttendanceDeviationReasonForm";
import AttendenceBreakTypesList from "../Pages/AttendenceRecord/AttendenceBreakType/AttendenceBreakTypesList";
import AttendenceBreakTypesForm from "../Pages/AttendenceRecord/AttendenceBreakType/AttendenceBreakTypesForm";
import AttendanceRecordList from "../Pages/AttendenceRecord/AttendanceRecord/AttendanceRecordList";
import AttendanceRecordForm from "../Pages/AttendenceRecord/AttendanceRecord/AttendanceRecordForm";
import AttendanceTimelogsList from "../Pages/AttendenceRecord/AttendanceTimelogs/AttendanceTimelogsList";
import AttendanceTimelogsForm from "../Pages/AttendenceRecord/AttendanceTimelogs/AttendanceTimelogsForm";
import AttendanceDeviationRecordList from "../Pages/AttendenceRecord/AttendanceDeviationRecord/AttendanceDeviationRecordList";
import AttendanceDeviationRecordForm from "../Pages/AttendenceRecord/AttendanceDeviationRecord/AttendanceDeviationRecordForm";
import CustomisetableReport from "../Components/Table/CustomisetableReport";
import RecordWithoutBreakList from "../Pages/AttendenceRecord/AttendanceReportDailyWithoutBreak/RecordWithoutBreakList";

import AttendanceBreakList from "../Pages/Orgnaization/AttendanceBreaks/AttendanceBreakList";
import AttendanceBreakForm from "../Pages/Orgnaization/AttendanceBreaks/AttendanceBreakForm";
import WorkshiftBreakForm from "../Pages/Orgnaization/WorkShiftBreaks/WorkshiftBreakForm";
import WorkshiftBreakList from "../Pages/Orgnaization/WorkShiftBreaks/WorkshiftBreakList";
import WorkshiftAssignmentList from "../Pages/Time & Attendence/WorkShiftAssignment/WorkShiftAssignmentList";
import WorkshiftAssignmentForm from "../Pages/Time & Attendence/WorkShiftAssignment/WorkShiftAssignmentForm";
import WorkShiftRotationPatternList from "../Pages/Time & Attendence/WorkShiftRotationPattern/WorkShiftRotationPatternList";
import WorkShiftRotationPatternForm from "../Pages/Time & Attendence/WorkShiftRotationPattern/WorkShiftRotationPatternForm";
import WorkShiftRotationDayList from "../Pages/Time & Attendence/WorkShiftRotationDays/WorkShiftRotationDayList";
import WorkShiftRotationDayForm from "../Pages/Time & Attendence/WorkShiftRotationDays/WorkShiftRotationDayForm";
import WorkShiftRotationAssignmentForm from "../Pages/Time & Attendence/WorkShiftRotationAssigment/WorkShiftRotationAssigmentForm";
import WorkShiftRotationAssignmentList from "../Pages/Time & Attendence/WorkShiftRotationAssigment/WorkShiftRotationAssigmentList";
import LeavePolicyList from "../Pages/Orgnaization/LeavePolicies/LeavePolicyList";
import LeavePolicyForm from "../Pages/Orgnaization/LeavePolicies/LeavePolicyForm";
import SalaryIncrementTypesList from "../Pages/SalaryGrowth/IncrementTypes/SalaryIncrementTypesList";
import SalaryIncrementTypesForm from "../Pages/SalaryGrowth/IncrementTypes/SalaryIncrementTypesForm";
import IncrementList from "../Pages/SalaryGrowth/Increments/IncrementList";
import IncrementForm from "../Pages/SalaryGrowth/Increments/IncrementForm";
import EmployeeRecordList from "../Pages/EmployeeManagement/EmployeeRecord/EmployeeRecordList";
import EmployeeRecordForm from "../Pages/EmployeeManagement/EmployeeRecord/EmployeeRecordForm";
import ComponentTypesList from "../Pages/Payroll System/ComponentTypes/ComponentTypesList";
import ComponentTypesForm from "../Pages/Payroll System/ComponentTypes/ComponentTypesForm";
import ComponentList from "../Pages/Payroll System/Components/ComponentList";
import ComponentForm from "../Pages/Payroll System/Components/ComponentForm";
import PayrollSlabsList from "../Pages/Payroll System/PayrollSlabs/PayrollSlabsList";
import PayrollSlabsForm from "../Pages/Payroll System/PayrollSlabs/PayrollSlabsForm";
import PayrollCycleList from "../Pages/Payroll System/PayrollCycle/PayrollCycleList";
import PayrollCycleForm from "../Pages/Payroll System/PayrollCycle/PayrollCycleForm";
import SalaryStructureList from "../Pages/Payroll System/SalaryStructure/SalaryStructureList";
import SalaryStructureForm from "../Pages/Payroll System/SalaryStructure/SalaryStructureForm";
import SalaryStructureComponentList from "../Pages/Payroll System/SalaryStructureComponent/SalaryStructureComponentList";
import SalaryStructureComponentForm from "../Pages/Payroll System/SalaryStructureComponent/SalaryStructureComponentForm";
import AdvancePayrollList from "../Pages/Payroll System/PayrollAdvances/AdvancePayrollList";
import AdvancePayrollForm from "../Pages/Payroll System/PayrollAdvances/AdvancePayrollForm";
import PayrollLoanTypesList from "../Pages/Payroll System/PayrollLoanTypes/PayrollLoanTypesList";
import PayrollLoanTypesForm from "../Pages/Payroll System/PayrollLoanTypes/PayrollLoanTypesForm";
import PayrollLoanList from "../Pages/Payroll System/PayrollLoans/PayrollLoanList";
import PayrollLoanForm from "../Pages/Payroll System/PayrollLoans/PayrollLoanForm";
import PayrollLoanTransactionForm from "../Pages/Payroll System/PayrollLoanTransaction/PayrollLoanTransactionForm";
import PayrollLoanTransactionList from "../Pages/Payroll System/PayrollLoanTransaction/PayrollLoanTransactionList";
import PayrollSecurityList from "../Pages/Payroll System/PayrollSecurities/PayrollSecurityList";
import PayrollSecurityForm from "../Pages/Payroll System/PayrollSecurities/PayrollSecurityForm";
import PayrollSecurityTransactionForm from "../Pages/Payroll System/PayrollSecurityTransaction/PayrollSecurityTransactionForm";
import PayrollSecurityTransactionList from "../Pages/Payroll System/PayrollSecurityTransaction/PayrollSecurityTransactionList";
import PayrollRunList from "../Pages/Payroll System/PayrollRuns/PayrollRunList";
import PayrollRunForm from "../Pages/Payroll System/PayrollRuns/PayrollRunForm";
import PayrollRunEmployeeForm from "../Pages/Payroll System/PayrollRunEmployees/PayrollRunEmployeeForm";
import PayrollRunEmployeeList from "../Pages/Payroll System/PayrollRunEmployees/PayrollRunEmployeeList";
import PayrollRunEmployeeComponentForm from "../Pages/Payroll System/PayrollRunEmployeeComponent/PayrollRunEmployeeComponentForm";
import PayrollRunEmployeeComponentList from "../Pages/Payroll System/PayrollRunEmployeeComponent/PayrollRunEmployeeComponentList";
import PayrollPeriodForm from "../Pages/Payroll System/PayrollPeriods/PayrollPeriodForm";
import PayrollPeriodList from "../Pages/Payroll System/PayrollPeriods/PayrollPeriodList";
import PayslipPaymentList from "../Pages/Payroll System/PayslipPayments/PayslipPaymentList";
import PayslipPaymentForm from "../Pages/Payroll System/PayslipPayments/PayslipPaymentForm";
import EmployeePayslipComponentForm from "../Pages/Payroll System/EmployeePayslipComponent/EmployeePayslipComponentForm";
import EmployeePayslipComponentList from "../Pages/Payroll System/EmployeePayslipComponent/EmployeePayslipComponentList";
import PayrollReimbursementTypeList from "../Pages/Payroll System/PayrollReimbursementTypes/PayrollReimbursementTypeList";
import PayrollReimbursementTypeForm from "../Pages/Payroll System/PayrollReimbursementTypes/PayrollReimbursementTypeForm";
import PayrollReimbursementList from "../Pages/Payroll System/PayrollReimbursement/PayrollReimbursementList";
import PayrollReimbursementForm from "../Pages/Payroll System/PayrollReimbursement/PayrollReimbursementForm";
import PayrollAdjustmentTypeForm from "../Pages/Payroll System/PayrollAdjustmentTypes/PayrollAdjustmentTypeForm";
import PayrollAdjustmentTypeList from "../Pages/Payroll System/PayrollAdjustmentTypes/PayrollAdjustmentTypeList";
import PayrollAdjustmentList from "../Pages/Payroll System/PayrollAdjustments/PayrollAdjustmentList";
import PayrollAdjustmentForm from "../Pages/Payroll System/PayrollAdjustments/PayrollAdjustmentForm";
import PayrollJourneyEntriesForm from "../Pages/Payroll System/PayrollJournalEntries/PayrollJourneyEntriesForm";
import PayrollJourneyEntriesList from "../Pages/Payroll System/PayrollJournalEntries/PayrollJourneyEntriesList";
import PayrollAccountMappingList from "../Pages/Payroll System/PayrollAccountMapping/PayrollAccountMappingList";
import PayrollAccountMappingForm from "../Pages/Payroll System/PayrollAccountMapping/PayrollAccountMappingForm";
import DocumentLinkList from "../Pages/DocumentRecord/Links/DocumentLinkList";
import DocumentLinkForm from "../Pages/DocumentRecord/Links/DocumentLinkForm";
import Documentist from "../Pages/DocumentRecord/Documents/Documentist";
import DocumentForm from "../Pages/DocumentRecord/Documents/DocumentForm";
import DocumentTypesForm from "../Pages/DocumentRecord/Types/DocumentTypesForm";
import DocumentTypesList from "../Pages/DocumentRecord/Types/DocumentTypesList";
import EmployeeProfile from "../Pages/EmployeeManagement/Employees/EmployeeProfile";
import IntershipTypesForm from "../Pages/InternManagement/InternshipTypes/IntershipTypesForm";
import IntershipTypesList from "../Pages/InternManagement/InternshipTypes/IntershipTypesList";
import IntershipStatusForm from "../Pages/InternManagement/Status/IntershipStatusForm";
import DynamicFormInternPage from "../Pages/DataLayoutIntern/DynamicFormInternPage";
import InternList from "../Pages/InternManagement/Interns/InternList";
import MultiTableConfig from "../Pages/TableConfigForm/MultiTableConfig";
import InterExitRecordList from "../Pages/InternManagement/InterExitRecord/InterExitRecordList";
import InterExitRecordForm from "../Pages/InternManagement/InterExitRecord/InterExitRecordForm";
import InternLeaveForm from "../Pages/InternManagement/InternLeaves/InternLeaveForm";
import InternLeaveList from "../Pages/InternManagement/InternLeaves/InternLeaveList";
import InternDocumentTypeList from "../Pages/InternManagement/InternDocumentTypes/InternDocumentTypeList";
import InternDocumentTypeForm from "../Pages/InternManagement/InternDocumentTypes/InternDocumentTypeForm";
import InternStipendList from "../Pages/InternManagement/InternStipend/InternStipendList";
import InternStipendForm from "../Pages/InternManagement/InternStipend/InternStipendForm";
import InternAttendanceTimelogsForm from "../Pages/InternManagement/InternAttendanceTimelogs/InternAttendanceTimelogsForm";
import InternAttendanceTimelogsList from "../Pages/InternManagement/InternAttendanceTimelogs/InternAttendanceTimelogsList";
import InterAttendanceRecordList from "../Pages/InternManagement/InternAttendanceRecord/InterAttendanceRecordList";
import IntershipStatusList from "../Pages/InternManagement/Status/IntershipStatusList";
import InternCertificateList from "../Pages/InternManagement/InternCertificate/InternCertificateList";
import InternCertificateForm from "../Pages/InternManagement/InternCertificate/InternCertificateForm";
import FunctionalRoleForm from "../Pages/FunctionalRoles/OrganizationFunctionRoles/FunctionalRoleForm";
import FunctionRolesList from "../Pages/FunctionalRoles/OrganizationFunctionRoles/FunctionRolesList";
import FunctionRoleSpecializationList from "../Pages/FunctionalRoles/FunctionRoleSpecialization/FunctionRoleSpecializationList";
import FunctionRoleSpecializationForm from "../Pages/FunctionalRoles/FunctionRoleSpecialization/FunctionRoleSpecializationForm";
import EmployeeRoleList from "../Pages/FunctionalRoles/EmployeeRoles/EmployeeRoleList";
import EmployeeRoleForm from "../Pages/FunctionalRoles/EmployeeRoles/EmployeeRoleForm";
import CommonList from "../Pages/OptmisedCode/List/CommonList";
import CommonForm from "../Pages/OptmisedCode/Form/CommonForm";
import InternStaagesList from "../Pages/InternManagement/InternStages/InternStaagesList";
import InternStagesForm from "../Pages/InternManagement/InternStages/InternStagesForm";
import EmploymentStagesList from "../Pages/EmployeeManagement/EmploymentStages/EmploymentStagesList";
import EmploymentStagesForm from "../Pages/EmployeeManagement/EmploymentStages/EmploymentStagesForm";
import EmploymentCategoryList from "../Pages/OrganizationConfigration/EmploymentCategory/EmploymentCategoryList";
import EmploymentCategoryForm from "../Pages/OrganizationConfigration/EmploymentCategory/EmploymentCategoryForm";
import SettingActual from "../Pages/SystemModules/Settings/SettingActual";
import EmployeeTransferForm from "../Pages/ToolsAndUtility/EmployeeTransferForm";
import InternRoleList from "../Pages/FunctionalRoles/InternRoles/InternRoleList";
import InternRoleForm from "../Pages/FunctionalRoles/InternRoles/InternRoleForm";
import OrganizationEntityList from "../Pages/Orgnaization/OrganizationEntity/OrganizationEntityList";
import OrganizationEntityForm from "../Pages/Orgnaization/OrganizationEntity/OrganizationEntityForm";
import WorkShiftDayList from "../Pages/Time & Attendence/WorkShiftDays/WorkShiftDayList";
import WorkShiftDayForm from "../Pages/Time & Attendence/WorkShiftDays/WorkShiftDayForm";
import WorkModelDayList from "../Pages/Time & Attendence/WorkModelDays/WorkModelDayList";
import WorkModelDayForm from "../Pages/Time & Attendence/WorkModelDays/WorkModelDayForm";
import SkillCategoryList from "../Pages/Skills/SkillCategory/SkillCategoryList";
import SkillCategoryForm from "../Pages/Skills/SkillCategory/SkillCategoryForm";
import SkillSubCategoryForm from "../Pages/Skills/SkillSubCategory/SkillSubCategoryForm";
import SkillForm from "../Pages/Skills/Skills/SkillForm";
import SkillGroupList from "../Pages/Skills/SkillGroup/SkillGroupList";
import SkillGroupForm from "../Pages/Skills/SkillGroup/SkillGroupForm";
import SkillElementForm from "../Pages/Skills/SkillElement/SkillElementForm";
import FunctionalRoleSkillList from "../Pages/Skills/FunctionalRoleSkill/FunctionalRoleSkillList";
import FunctionalRoleSkillForm from "../Pages/Skills/FunctionalRoleSkill/FunctionalRoleSkillForm";
import RoleSkillElementList from "../Pages/Skills/RoleSkillElement/RoleSkillElementList";
import RoleSkillElementForm from "../Pages/Skills/RoleSkillElement/RoleSkillElementForm";
import PersonalizeDataGrid from "../Components/Table/PersonalizeDataGrid";
import { MAIN_URL } from "../Configurations/Urls";
import useAuthStore from "../Zustand/Store/useAuthStore";
import NotAuthorized from "../Exceptions/NotAuthorized";
import LearningProviderTypeList from "../Pages/Learning/LearningProviderTypes/LearningProviderTypeList";
import LearningProviderTypeForm from "../Pages/Learning/LearningProviderTypes/LearningProviderTypeForm";
import LearningProviderList from "../Pages/Learning/LearningProviders/LearningProviderList";
import LearningProviderForm from "../Pages/Learning/LearningProviders/LearningProviderForm";
import LearningResourcesList from "../Pages/Learning/LearningResources/LearningResourcesList";
import LearningResourcesForm from "../Pages/Learning/LearningResources/LearningResourcesForm";
import LearningFunctionalRoleList from "../Pages/Learning/LearningFunctionalRole/LearningFunctionalRoleList";
import LearningFunctionalRoleForm from "../Pages/Learning/LearningFunctionalRole/LearningFunctionalRoleForm";
import ResourceSkillElementList from "../Pages/Learning/LearningResourceSkillElement/ResourceSkillElementList";
import ResourceSkillElementForm from "../Pages/Learning/LearningResourceSkillElement/ResourceSkillElementForm";
import UserPermissionList from "../Pages/User Management/UserPermission/UserPermissionList";
import UserPermissionForm from "../Pages/User Management/UserPermission/UserPermissionForm";
import ViewUserPermissionForm from "../Pages/User Management/UserPermission/ViewUserPermissionForm";

// Routes
const router = (org)=>createBrowserRouter([
  {
    path: "/",
    element: (
      <RouteProtector>
        <Dashboard />
      </RouteProtector>
    ),
  },

  // {
  //   path: "/organization/employee/employee-details",
  //   element: <CustomisetableReport />,
  // },
  {
    path: "dashboard/Personalize-dashboard",
    element: (
      <RouteProtector>
        <PersonalizationModal />
      </RouteProtector>
    ),
  },
  {
    path: "/EmployeesForm",
    element: <EmployeesForm />,
  },

  {
    path: "/email-register",
    element: <FreeTrialPage />,
  },

  {
    path: "/otp-verify",
    element: <OtpVerify />,
  },

  {
    path: "/organization-details",
    element: <OrganizationDetails />,
  },

  {
    path: "/users",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <Users />,
      },
      {
        path: "add",
        element: <UsersAdd />,
      },
      {
        path: "edit/:id",
        element: <UsersEdit mode="edit" />,
      },
    ],
  },

  {
    path: "/employee/increment-types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <SalaryIncrementTypesList />,
      },
      {
        path: "add",
        element: <SalaryIncrementTypesForm />,
      },
      {
        path: "edit/:id",
        element: <SalaryIncrementTypesForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <SalaryIncrementTypesForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/work-shift-days",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <WorkShiftDayList />,
      },
      {
        path: "add",
        element: <WorkShiftDayForm />,
      },
      {
        path: "edit/:id",
        element: <WorkShiftDayForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <WorkShiftDayForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/work-model-days",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <WorkModelDayList />,
      },
      {
        path: "add",
        element: <WorkModelDayForm />,
      },
      {
        path: "edit/:id",
        element: <WorkModelDayForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <WorkModelDayForm mode="view" />,
      },
    ],
  },

  {
    path: "/intern/internship/types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <IntershipTypesList />,
      },
      {
        path: "add",
        element: <IntershipTypesForm />,
      },
      {
        path: "edit/:id",
        element: <IntershipTypesForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <IntershipTypesForm mode="view" />,
      },
    ],
  },
  {
    path: "/intern/certificates",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <InternCertificateList />,
      },
      {
        path: "add",
        element: <InternCertificateForm />,
      },
      {
        path: "edit/:id",
        element: <InternCertificateForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <InternCertificateForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/functional-roles",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <FunctionRolesList />,
      },
      {
        path: "add",
        element: <FunctionalRoleForm />,
      },
      {
        path: "edit/:id",
        element: <FunctionalRoleForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <FunctionalRoleForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/functional-role-specialization",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <FunctionRoleSpecializationList />,
      },
      {
        path: "add",
        element: <FunctionRoleSpecializationForm />,
      },
      {
        path: "edit/:id",
        element: <FunctionRoleSpecializationForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <FunctionRoleSpecializationForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/employee/functional-role",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <EmployeeRoleList />,
      },
      {
        path: "add",
        element: <EmployeeRoleForm />,
      },
      {
        path: "edit/:id",
        element: <EmployeeRoleForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <EmployeeRoleForm mode="view" />,
      },
    ],
  },

  {
    path: "/intern/internship/status",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <IntershipStatusList />,
      },
      {
        path: "add",
        element: <IntershipStatusForm />,
      },
      {
        path: "edit/:id",
        element: <IntershipStatusForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <IntershipStatusForm mode="view" />,
      },
    ],
  },

  ...Configurations?.map((item) => {
    return {
      path: item.route,
      element: (
        <RouteProtector>
          <CoverLayout />
        </RouteProtector>
      ),
      children: [
        {
          index: true,
          element: <CommonList {...item.ListProps} />,
        },
        {
          path: "add",
          element: <CommonForm {...item.FormProps} />,
        },
        {
          path: "edit/:id",
          element: <CommonForm {...item.FormProps} />,
        },
      ],
    };
  }),

  {
    path: "/intern/document/types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <InternDocumentTypeList />,
      },
      {
        path: "add",
        element: <InternDocumentTypeForm />,
      },
      {
        path: "edit/:id",
        element: <InternDocumentTypeForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <InternDocumentTypeForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/intern/intern-stipend",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <InternStipendList />,
      },
      {
        path: "add",
        element: <InternStipendForm />,
      },
      {
        path: "edit/:id",
        element: <InternStipendForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <InternStipendForm mode="view" />,
      },
    ],
  },
  {
    path: "/intern/attendance/time-logs",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <InternAttendanceTimelogsList />,
      },
      {
        path: "add",
        element: <InternAttendanceTimelogsForm />,
      },
      {
        path: "edit/:id",
        element: <InternAttendanceTimelogsForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <InternAttendanceTimelogsForm mode="view" />,
      },
    ],
  },

  {
    path: "/intern/attendance/records",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <InterAttendanceRecordList />,
      },
    ],
  },

  {
    path: "/employee/increment",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <IncrementList />,
      },
      {
        path: "add",
        element: <IncrementForm />,
      },
      {
        path: "edit/:id",
        element: <IncrementForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <IncrementForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/employee/records",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <EmployeeRecordList />,
      },
      {
        path: "add",
        element: <EmployeeRecordForm />,
      },
      {
        path: "edit/:id",
        element: <EmployeeRecordForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <EmployeeRecordForm mode="view" />,
      },
    ],
  },

  {
    path: "/payroll/component-types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <ComponentTypesList />,
      },
      {
        path: "add",
        element: <ComponentTypesForm />,
      },
      {
        path: "edit/:id",
        element: <ComponentTypesForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <ComponentTypesForm mode="view" />,
      },
    ],
  },
  {
    path: "/payroll/components",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <ComponentList />,
      },
      {
        path: "add",
        element: <ComponentForm />,
      },
      {
        path: "edit/:id",
        element: <ComponentForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <ComponentForm mode="view" />,
      },
    ],
  },
  {
    path: "/payroll/component-slabs",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollSlabsList />,
      },
      {
        path: "add",
        element: <PayrollSlabsForm />,
      },
      {
        path: "edit/:id",
        element: <PayrollSlabsForm mode="edit" />,
      },
    ],
  },

  {
    path: "/payroll/cycles",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollCycleList />,
      },
      {
        path: "add",
        element: <PayrollCycleForm />,
      },
      {
        path: "edit/:id",
        element: <PayrollCycleForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <PayrollCycleForm mode="view" />,
      },
    ],
  },

  {
    path: "/payroll/employee-salary-structure",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <SalaryStructureList />,
      },
      {
        path: "add",
        element: <SalaryStructureForm />,
      },
      {
        path: "edit/:id",
        element: <SalaryStructureForm mode="edit" />,
      },
        {
        path: "view/:id",
        element: <SalaryStructureForm mode="view" />,
      },
    ],
  },

  {
    path: "/payroll/salary-structure/components",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <SalaryStructureComponentList />,
      },
      {
        path: "add",
        element: <SalaryStructureComponentForm />,
      },
      {
        path: "edit/:id",
        element: <SalaryStructureComponentForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <SalaryStructureComponentForm mode="view" />,
      },
    ],
  },

  {
    path: "/payroll/advance",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <AdvancePayrollList />,
      },
      {
        path: "add",
        element: <AdvancePayrollForm />,
      },
      {
        path: "edit/:id",
        element: <AdvancePayrollForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <AdvancePayrollForm mode="view" />,
      },
    ],
  },
  {
    path: "/payroll/loan-types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollLoanTypesList />,
      },
      {
        path: "add",
        element: <PayrollLoanTypesForm />,
      },
      {
        path: "edit/:id",
        element: <PayrollLoanTypesForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <PayrollLoanTypesForm mode="view" />,
      },
    ],
  },

  {
    path: "/payroll/loans",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollLoanList />,
      },
      {
        path: "add",
        element: <PayrollLoanForm />,
      },
      {
        path: "edit/:id",
        element: <PayrollLoanForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <PayrollLoanForm mode="view" />,
      },
    ],
  },

  {
    path: "/payroll/loan-transactions",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollLoanTransactionList />,
      },
      {
        path: "add",
        element: <PayrollLoanTransactionForm />,
      },
      {
        path: "edit/:id",
        element: <PayrollLoanTransactionForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <PayrollLoanTransactionForm mode="view" />,
      },
    ],
  },
  {
    path: "/payroll/securities",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollSecurityList />,
      },
      {
        path: "add",
        element: <PayrollSecurityForm />,
      },
      {
        path: "edit/:id",
        element: <PayrollSecurityForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <PayrollSecurityForm mode="view" />,
      },
    ],
  },
  {
    path: "/payroll/securities-transactions",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollSecurityTransactionList />,
      },
      {
        path: "add",
        element: <PayrollSecurityTransactionForm />,
      },
      {
        path: "edit/:id",
        element: <PayrollSecurityTransactionForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <PayrollSecurityTransactionForm mode="view" />,
      },
    ],
  },

  {
    path: "/attendance/employee-record-without-break",
    element: (
      <RouteProtector>
        <RecordWithoutBreakList />
      </RouteProtector>
    ),
  },

  {
    path: "/my-profile",
    element: (
      <RouteProtector>
        <MyProfile />
      </RouteProtector>
    ),
  },

  {
    path: "/organization/details",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationAddInList />,
      },
      {
        path: "add",
        element: <OrganizationAddInForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationAddInForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <OrganizationAddInForm mode="view" />,
      },
    ],
  },

  {
    path: "/system/dynamic-forms",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <DynamicFormPage />,
      },
    ],
  },

  {
    path: "/organization/employee-shift",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <EmployeeTransferForm />,
      },
    ],
  },

  {
    path: "/organization/settings/new",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <SettingActual />,
      },
    ],
  },

  {
    path: "/organization/work-shift-assignment",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <WorkshiftAssignmentList />,
      },
      {
        path: "add",
        element: <WorkshiftAssignmentForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <WorkshiftAssignmentForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <WorkshiftAssignmentForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/work-shift-rotation-pattern",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <WorkShiftRotationPatternList />,
      },
      {
        path: "add",
        element: <WorkShiftRotationPatternForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <WorkShiftRotationPatternForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <WorkShiftRotationPatternForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/work-shift-rotation-days",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <WorkShiftRotationDayList />,
      },
      {
        path: "add",
        element: <WorkShiftRotationDayForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <WorkShiftRotationDayForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <WorkShiftRotationDayForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/work-shift-rotation-assignment",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <WorkShiftRotationAssignmentList />,
      },
      {
        path: "add",
        element: <WorkShiftRotationAssignmentForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <WorkShiftRotationAssignmentForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <WorkShiftRotationAssignmentForm mode="view" />,
      },
    ],
  },

  {
    path: "/my-tasks",
    element: (
      <RouteProtector>
        <MyTasks />
      </RouteProtector>
    ),
  },
  {
    path: "/settings/change-password",
    element: (
      <RouteProtector>
        <ChangePassword />
      </RouteProtector>
    ),
  },
  {
    path: "/settings/update-credentials",
    element: (
      <RouteProtector>
        <UpdateCredentials />
      </RouteProtector>
    ),
  },
  {
    path: "/organization/data",
    element: (
      <RouteProtector>
        <Organisation />
      </RouteProtector>
    ),
  },
  {
    path: "/organization/profile",
    element: (
      <RouteProtector>
        <OrganizationProfile />
      </RouteProtector>
    ),
  },
  {
    path: "/organization/attendance-kiosk",
    element: (
      <RouteProtector>
        <FaceAuth />
      </RouteProtector>
    ),
  },

  {
    path: "/organization/workshift-break",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <WorkshiftBreakList />,
      },
      {
        path: "add",
        element: <WorkshiftBreakForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <WorkshiftBreakForm mode="edit" />,
      },
        {
        path: "view/:id",
        element: <WorkshiftBreakForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/attendance-break",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <AttendanceBreakList />,
      },
      {
        path: "add",
        element: <AttendanceBreakForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <AttendanceBreakForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <AttendanceBreakForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/departments",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationDepartmentsList />,
      },
      {
        path: "add",
        element: <OrganizationDepartmentForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationDepartmentForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <OrganizationDepartmentForm mode="view" />,
      },
    ],
  },



  {
    path: "/organization/learning-provider-type",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <LearningProviderTypeList />,
      },
      {
        path: "add",
        element: <LearningProviderTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <LearningProviderTypeForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <LearningProviderTypeForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/units",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationUnitList />,
      },
      {
        path: "add",
        element: <OrganizationUnitForms mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationUnitForms mode="edit" />,
      },
      {
        path: "view/:id",
        element: <OrganizationUnitForms mode="view" />,
      },
    ],
  },

  {
    path: "/organization/learning-provider",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <LearningProviderList />,
      },
      {
        path: "add",
        element: <LearningProviderForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <LearningProviderForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <LearningProviderForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/learning-resources",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <LearningResourcesList />,
      },
      {
        path: "add",
        element: <LearningResourcesForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <LearningResourcesForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <LearningResourcesForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/learning-functional-role",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <LearningFunctionalRoleList />,
      },
      {
        path: "add",
        element: <LearningFunctionalRoleForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <LearningFunctionalRoleForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <LearningFunctionalRoleForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/learning-skill-element",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <ResourceSkillElementList />,
      },
      {
        path: "add",
        element: <ResourceSkillElementForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <ResourceSkillElementForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <ResourceSkillElementForm mode="view" />,
      },
    ],
  },

  {
    path: "/payroll/runs",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollRunList />,
      },
      {
        path: "add",
        element: <PayrollRunForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <PayrollRunForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <PayrollRunForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/skill-category",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <SkillCategoryList />,
      },
      {
        path: "add",
        element: <SkillCategoryForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <SkillCategoryForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <SkillCategoryForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/skill-subcategory",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        path: "add",
        element: <SkillSubCategoryForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <SkillSubCategoryForm mode="edit" />,
      },
        {
        path: "view/:id",
        element: <SkillSubCategoryForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/skills",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      
      {
        path: "add",
        element: <SkillForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <SkillForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <SkillForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/skill-element-group",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <SkillGroupList />,
      },
      {
        path: "add",
        element: <SkillGroupForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <SkillGroupForm mode="edit" />,
      },
        {
        path: "view/:id",
        element: <SkillGroupForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/skill-element",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      
      {
        path: "add",
        element: <SkillElementForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <SkillElementForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <SkillElementForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/func-role-skill",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <FunctionalRoleSkillList />,
      },
      
      {
        path: "add",
        element: <FunctionalRoleSkillForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <FunctionalRoleSkillForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <FunctionalRoleSkillForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/func-role-skill-element",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <RoleSkillElementList />,
      },
      
      {
        path: "add",
        element: <RoleSkillElementForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <RoleSkillElementForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <RoleSkillElementForm mode="view" />,
      },
    ],
  },

  {
    path: "/payroll/employee-runs",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollRunEmployeeList />,
      },
      {
        path: "add",
        element: <PayrollRunEmployeeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <PayrollRunEmployeeForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <PayrollRunEmployeeForm mode="view" />,
      },
    ],
  },
  {
    path: "/payroll/employee-run/components",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollRunEmployeeComponentList />,
      },
      {
        path: "add",
        element: <PayrollRunEmployeeComponentForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <PayrollRunEmployeeComponentForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <PayrollRunEmployeeComponentForm mode="view" />,
      },
    ],
  },
  {
    path: "/payroll/periods",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollPeriodList />,
      },
      {
        path: "add",
        element: <PayrollPeriodForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <PayrollPeriodForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <PayrollPeriodForm mode="view" />,
      },
    ],
  },
  {
    path: "/payslips/payments",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayslipPaymentList />,
      },
      {
        path: "add",
        element: <PayslipPaymentForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <PayslipPaymentForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <PayslipPaymentForm mode="view" />,
      },
    ],
  },
  {
    path: "/payslips/components",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <EmployeePayslipComponentList />,
      },
      {
        path: "add",
        element: <EmployeePayslipComponentForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <EmployeePayslipComponentForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <EmployeePayslipComponentForm mode="view" />,
      },
    ],
  },
  {
    path: "/payroll/reimbursement-types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollReimbursementTypeList />,
      },
      {
        path: "add",
        element: <PayrollReimbursementTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <PayrollReimbursementTypeForm mode="edit" />,
      },
    ],
  },
  {
    path: "/payroll/reimbursements",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollReimbursementList />,
      },
      {
        path: "add",
        element: <PayrollReimbursementForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <PayrollReimbursementForm mode="edit" />,
      },
    ],
  },
  {
    path: "/payroll/adjustment-types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollAdjustmentTypeList />,
      },
      {
        path: "add",
        element: <PayrollAdjustmentTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <PayrollAdjustmentTypeForm mode="edit" />,
      },
    ],
  },
  {
    path: "/payroll/adjustments",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollAdjustmentList />,
      },
      {
        path: "add",
        element: <PayrollAdjustmentForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <PayrollAdjustmentForm mode="edit" />,
      },
    ],
  },
  {
    path: "/organization/designation",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationDesignationsList />,
      },
      {
        path: "add",
        element: <OrganizationDesignationsForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationDesignationsForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <OrganizationDesignationsForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization/registrations",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationRegistrationsList />,
      },
      {
        path: "add",
        element: <OrganizationRegistrationsForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationRegistrationsForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <OrganizationRegistrationsForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/business-ownership-type",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <BusinessOwnershipTypeList />,
      },
      {
        path: "add",
        element: <BusinessOwnershipTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <BusinessOwnershipTypeForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <BusinessOwnershipTypeForm mode="view" />,
      },
    ],
  },
  {
    path: "/payroll/journal-entries",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollJourneyEntriesList />,
      },
      {
        path: "add",
        element: <PayrollJourneyEntriesForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <PayrollJourneyEntriesForm mode="edit" />,
      },
    ],
  },
  {
    path: "/payroll/account-mapping",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <PayrollAccountMappingList />,
      },
      {
        path: "add",
        element: <PayrollAccountMappingForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <PayrollAccountMappingForm mode="edit" />,
      },
    ],
  },

  {
    path: "/organization-configration/business-registration-type",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <BusinessRegistrationTypeList />,
      },
      {
        path: "add",
        element: <BusinessRegistrationTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <BusinessRegistrationTypeForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <BusinessRegistrationTypeForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/unit-types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <BusinessUnitTypeList />,
      },
      {
        path: "add",
        element: <BusinessUnitTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <BusinessUnitTypeForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <BusinessUnitTypeForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization-configration/languages",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationLanguageList />,
      },
      {
        path: "add",
        element: <OrganizationLanguageForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationLanguageForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <OrganizationLanguageForm mode="view" />,
      },
    ],
  },

  {
    path: "/intern/intern-stages",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <InternStaagesList />,
      },
      {
        path: "add",
        element: <InternStagesForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <InternStagesForm mode="edit" />,
      },
        {
        path: "view/:id",
        element: <InternStagesForm mode="view" />,
      },
    ],
  },
  {
    path: "/employment/employee-stages",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <EmploymentStagesList />,
      },
      {
        path: "add",
        element: <EmploymentStagesForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <EmploymentStagesForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <EmploymentStagesForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/residential-ownership-type",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <ResidentialOwnershipTypeList />,
      },
      {
        path: "add",
        element: <ResidentialOwnershipTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <ResidentialOwnershipTypeForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <ResidentialOwnershipTypeForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/location-ownership-type",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <LocationOwnershipTypeList />,
      },
      {
        path: "add",
        element: <LocationOwnershipTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <LocationOwnershipTypeForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <LocationOwnershipTypeForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/employee-address-types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationEmployeeAddressTypeList />,
      },
      {
        path: "add",
        element: <OrganizationEmployeeAddressTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationEmployeeAddressTypeForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <OrganizationEmployeeAddressTypeForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/employee-status",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationEmployementStatusesList />,
      },
      {
        path: "add",
        element: <OrganizationEmployementStatusesForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationEmployementStatusesForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <OrganizationEmployementStatusesForm mode="view" />,
      },
    ],
  },

  {
    path: "/employee/document/types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <DocumentTypesList />,
      },
      {
        path: "add",
        element: <DocumentTypesForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <DocumentTypesForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <DocumentTypesForm mode="view" />,
      },
    ],
  },

  {
    path: "/employee/document/links",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <DocumentLinkList />,
      },
      {
        path: "add",
        element: <DocumentLinkForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <DocumentLinkForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <DocumentLinkForm mode="view" />,
      },
    ],
  },

  {
    path: "/employee/documents",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <Documentist />,
      },
      {
        path: "add",
        element: <DocumentForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <DocumentForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <DocumentForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/employee/employee-details/employee-profile",
    element: (
      <RouteProtector>
        <EmployeeProfile />
      </RouteProtector>
    ),
  },

  {
    path: "/organization-configration/employement-type",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationEmployementTypesList />,
      },
      {
        path: "add",
        element: <OrganizationEmployementTypesForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationEmployementTypesForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <OrganizationEmployementTypesForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/employement-exit-reason-type",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationEmployementExitReasonTypeList />,
      },
      {
        path: "add",
        element: <OrganizationEmployementExitReasonTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationEmployementExitReasonTypeForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <OrganizationEmployementExitReasonTypeForm mode="view" />,
      },
    ],
  },

  {
    path: "/intern/functional-role",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <InternRoleList />,
      },
      {
        path: "add",
        element: <InternRoleForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <InternRoleForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <InternRoleForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/employement-exit-reason",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationEmployementExitReasonsList />,
      },
      {
        path: "add",
        element: <OrganizationEmployementExitReasonsForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationEmployementExitReasonsForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <OrganizationEmployementExitReasonsForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/entity",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationEntityList />,
      },
      {
        path: "add",
        element: <OrganizationEntityForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationEntityForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <OrganizationEntityForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/holiday-types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <HolidayTypesList />,
      },
      {
        path: "add",
        element: <HolidayTypesForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <HolidayTypesForm mode="edit" />,
      },
        {
        path: "view/:id",
        element: <HolidayTypesForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization-configration/leave-category",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <LeaveCategoryList />,
      },
      {
        path: "add",
        element: <LeaveCategoryForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <LeaveCategoryForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <LeaveCategoryForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/leave-types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <LeaveTypeList />,
      },
      {
        path: "add",
        element: <LeaveTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <LeaveTypeForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <LeaveTypeForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization-configration/leave-reason",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <LeaveReasonList />,
      },
      {
        path: "add",
        element: <LeaveReasonForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <LeaveReasonForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <LeaveReasonForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/leave-reason-type",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <LeaveReasonTypeList />,
      },
      {
        path: "add",
        element: <LeaveReasonTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <LeaveReasonTypeForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <LeaveReasonTypeForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization-configration/workshift-types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <WorkShiftTypeList />,
      },
      {
        path: "add",
        element: <WorkShiftTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <WorkShiftTypeForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <WorkShiftTypeForm mode="view" />,
      },
    ],
  },
  {
    path: "/organization-configration/work-model",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <WorkModelList />,
      },
      {
        path: "add",
        element: <WorkModelForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <WorkModelForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <WorkModelForm mode="view" />,
      },
    ],
  },

  {
    path: "/application/user-role-permission",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <RolePermissionList />,
      },
      {
        path: "add",
        element: <RolePermissionForm mode="add" />,
      },
      {
        path: "view/:id",
        element: <ViewRolePermissionForm mode="edit" />,
      },
      {
        path: "edit/:id",
        element: <RolePermissionForm mode="edit" />,
      },
    ],
  },






    {
    path: "/application/user-permission",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <UserPermissionList />,
      },
      {
        path: "add",
        element: <UserPermissionForm mode="add" />,
      },
      {
        path: "view/:id",
        element: <ViewUserPermissionForm mode="edit" />,
      },
      {
        path: "edit/:id",
        element: <UserPermissionForm mode="edit" />,
      },
    ],
  },






  {
    path: "/application/userrole-assignments",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <RoleAssignmentList />,
      },
      {
        path: "add",
        element: <RoleAssignmentForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <RoleAssignmentForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <RoleAssignmentForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/user-types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <UserTypeList />,
      },
      {
        path: "add",
        element: <UserTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <UserTypeForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <UserTypeForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/setting-types",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <SettingTypeList />,
      },
      {
        path: "add",
        element: <SettingTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <SettingTypeForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <SettingTypeForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/settings",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <SettingList />,
      },
      {
        path: "add",
        element: <SettingForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <SettingForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <SettingForm mode="view" />,
      },
    ],
  },

  // {
  //   path: "/organization/employee/employee-details",
  //   element: (
  //     <RouteProtector>
  //       <CoverLayout />
  //     </RouteProtector>
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       element: <EmployeeList />,
  //     },
  //     {
  //       path: "add",
  //       element: <DynamicFormPage mode="add" />,
  //     },
  //     {
  //       path: "edit/:id",
  //       element: <DynamicFormPage mode="edit" />,
  //     },
  //     {
  //       path: "view/:id",
  //       element: <DynamicFormPage mode="view" />,
  //     },
  //   ],
  // },


     {
      path: "/organization/employee/employee-details",
      element: (
        <RouteProtector>
          <CoverLayout />
        </RouteProtector>
      ),
      children: [
        {
          index: true,
          element: <EmployeeList />,
        },
        {
          path: "add",
          element: <DynamicFormPage mode="add" />,
        },
        {
          path: "edit/:id",
          element: <DynamicFormPage mode="edit" />,
        },
        {
          path: "view/:id",
          element: <DynamicFormPage mode="view" />,
        },
        {
          path: "personalize-view",
          element: (
            <PersonalizeDataGrid
              tableName="Employees"
              dataApi={`${MAIN_URL}/api/organizations/${org?.organization_id}/employee?mode=2`}
              contextId="employees"
              mode="personalize-view"
              orgId={org?.organization_id}
            />
          ),
        },
      ],
    },




  {
    path: "/organization/intern/intern-details",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <InternList />,
      },
      {
        path: "add",
        element: <DynamicFormInternPage mode="add" />,
      },
      {
        path: "edit/:id",
        element: <DynamicFormInternPage mode="edit" />,
      },
      {
        path: "view/:id",
        element: <DynamicFormInternPage mode="view" />,
      },
    ],
  },

  {
    path: "/organization/freelancer/freelancer-details",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <EmployeeList />,
      },
      {
        path: "add",
        element: <DynamicFormInternPage mode="add" />,
      },
      {
        path: "edit/:id",
        element: <DynamicFormInternPage mode="edit" />,
      },
    ],
  },

  {
    path: "/organization/intern/intern-exit",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <InterExitRecordList />,
      },
      {
        path: "add",
        element: <InterExitRecordForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <InterExitRecordForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <InterExitRecordForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/intern/intern-leaves",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <InternLeaveList />,
      },
      {
        path: "add",
        element: <InternLeaveForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <InternLeaveForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <InternLeaveForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/datagrid-config",
    element: (
      <RouteProtector>
        <MultiTableConfig />
      </RouteProtector>
    ),
  },

  {
    path: "/organization/employee/employee-exits",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <EmployeeExitList />,
      },
      {
        path: "add",
        element: <EmployeeExitForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <EmployeeExitForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <EmployeeExitForm mode="view" />,
      },
    ],
  },

  {
    path: "/leave/holiday-calendar",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <HolidayCalendarList />,
      },
      {
        path: "add",
        element: <HolidayCalendarForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <HolidayCalendarForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <HolidayCalendarForm mode="view" />,
      },
    ],
  },

  {
    path: "/leave/employee-entitlements",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <EmployeeLeaveEntitlementList />,
      },
      {
        path: "add",
        element: <EmployeeLeaveEntitlmentForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <EmployeeLeaveEntitlmentForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <EmployeeLeaveEntitlmentForm mode="view" />,
      },
    ],
  },

  {
    path: "/attendance/employee-record",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <AttendanceRecordList />,
      },
      {
        path: "add",
        element: <AttendanceRecordForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <AttendanceRecordForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <AttendanceRecordForm mode="view" />,
      },
    ],
  },

  {
    path: "/attendance/time-logs",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <AttendanceTimelogsList />,
      },
      {
        path: "add",
        element: <AttendanceTimelogsForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <AttendanceTimelogsForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <AttendanceTimelogsForm mode="view" />,
      },
    ],
  },

  {
    path: "/attendance/deviation-records",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <AttendanceDeviationRecordList />,
      },
      {
        path: "add",
        element: <AttendanceDeviationRecordForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <AttendanceDeviationRecordForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <AttendanceDeviationRecordForm mode="view" />,
      },
    ],
  },

  {
    path: "/attendance/status-type",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <AttendenceStatusTypeList />,
      },
      {
        path: "add",
        element: <AttendenceStatusTypeForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <AttendenceStatusTypeForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <AttendenceStatusTypeForm mode="view" />,
      },
    ],
  },

  {
    path: "employee-leave-balance-report",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <LevaeBalanceReportList />,
      },
    ],
  },

  {
    path: "/employee-leave-summary",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <LeaveSummaryMonthlyReport />,
      },
    ],
  },

  {
    path: "/attendance/source",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <AttendenceSourceList />,
      },
      {
        path: "add",
        element: <AttendenceSourceForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <AttendenceSourceForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <AttendenceSourceForm mode="view" />,
      },
    ],
  },

  {
    path: "/attendance/deviation-reason",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <AttendanceDeviationReasonList />,
      },
      {
        path: "add",
        element: <AttendanceDeviationReasonForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <AttendanceDeviationReasonForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <AttendanceDeviationReasonForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization-configration/employement-category",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <EmploymentCategoryList />,
      },
      {
        path: "add",
        element: <EmploymentCategoryForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <EmploymentCategoryForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <EmploymentCategoryForm mode="view" />,
      },
    ],
  },

  {
    path: "/attendance/break-type",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <AttendenceBreakTypesList />,
      },
      {
        path: "add",
        element: <AttendenceBreakTypesForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <AttendenceBreakTypesForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <AttendenceBreakTypesForm mode="view" />,
      },
    ],
  },

  {
    path: "/leave/employee-leaves",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <EmployeeLeaveList />,
      },
      {
        path: "add",
        element: <EmployeeLeaveForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <EmployeeLeaveForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <EmployeeLeaveForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/work-shift",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <WorkShiftList />,
      },
      {
        path: "add",
        element: <WorkShiftForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <WorkShiftForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <WorkShiftForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/location",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationLocationList />,
      },
      {
        path: "add",
        element: <OrganizationLocationForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationLocationForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <OrganizationLocationForm mode="view" />,
      },
    ],
  },
  {
    path: "/business/division",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <BusinessDivisionsList />,
      },
      {
        path: "add",
        element: <BusinessDivisionForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <BusinessDivisionForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <BusinessDivisionForm mode="view" />,
      },
    ],
  },

  {
    path: "/business/unit",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <BusinessUnitList />,
      },
      {
        path: "add",
        element: <BusinessUnitForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <BusinessUnitForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <BusinessUnitForm mode="view" />,
      },
    ],
  },

  {
    path: "/departments/locations",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationDepartmentsLocationList />,
      },
      {
        path: "add",
        element: <OrganizationDepartmentLocationsForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationDepartmentLocationsForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <OrganizationDepartmentLocationsForm mode="view" />,
      },
    ],
  },
  {
    path: "/employement/status",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <OrganizationEmployementStatusesList />,
      },
      {
        path: "add",
        element: <OrganizationEmployementStatusesForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <OrganizationEmployementStatusesForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <OrganizationEmployementStatusesForm mode="view" />,
      },
    ],
  },

  {
    path: "/holiday/holiday",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <HolidayList />,
      },
      {
        path: "add",
        element: <HolidayForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <HolidayForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <HolidayForm mode="view" />,
      },
    ],
  },

  {
    path: "/employee/employee-contacts",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <EmployeeContactList />,
      },
      {
        path: "add",
        element: <EmployeeContactForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <EmployeeContactForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <EmployeeContactForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/system-modules",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <SystemModulesList />,
      },
      {
        path: "add",
        element: <SystemModulesForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <SystemModulesForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <SystemModulesForm mode="view" />,
      },
    ],
  },

  {
    path: "/organization/module-action",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <ModuleActionList />,
      },
      {
        path: "add",
        element: <ModuleActionForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <ModuleActionForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <ModuleActionForm mode="view" />,
      },
    ],
  },

  // Application Managment Routes
  {
    path: "/application/user-roles",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <UserRoleList />,
      },
      {
        path: "add",
        element: <UserRoleForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <UserRoleForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <UserRoleForm mode="view" />,
      },
    ],
  },

  {
    path: "/application/user-modules",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <UserModuleList />,
      },
      {
        path: "add",
        element: <UserModuleForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <UserModuleForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <UserModuleForm mode="view" />,
      },
    ],
  },

  {
    path: "/application/user",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <UserList />,
      },
      {
        path: "add",
        element: <UserForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <UserForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <UserForm mode="view" />,
      },
    ],
  },

  {
    path: "/application/user-errorlogs",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <ApplicationErrorLogList />,
      },
      {
        path: "add",
        element: <ApplicationErrorLogForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <ApplicationErrorLogForm mode="edit" />,
      },
    ],
  },

  {
    path: "/organization/leave-policy",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <LeavePolicyList />,
      },
      {
        path: "add",
        element: <LeavePolicyForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <LeavePolicyForm mode="edit" />,
      },
      {
        path: "view/:id",
        element: <LeavePolicyForm mode="view" />,
      },
    ],
  },

  {
    path: "/application/user-role-assignment",
    element: (
      <RouteProtector>
        <CoverLayout />
      </RouteProtector>
    ),
    children: [
      {
        index: true,
        element: <RoleAssignmentList />,
      },
      {
        path: "add",
        element: <RoleAssignmentForm mode="add" />,
      },
      {
        path: "edit/:id",
        element: <RoleAssignmentForm mode="edit" />,
      },
       {
        path: "view/:id",
        element: <RoleAssignmentForm mode="view" />,
      },
    ],
  },

  {
    path: "/attendance",
    element: (
      <RouteProtector>
        <Attendance />
      </RouteProtector>
    ),
  },

  {
    path: "/login",
    element: <Login title={"Login"} />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword title={"Forgot Password"} />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword title={"Reset Password"} />,
  },
  // footer
  {
    path: "/features",
    element: <Features />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/faq",
    element: <Faq />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/cookies",
    element: <Cookies />,
  },
  {
    path: "/support",
    element: <Support />,
  },
  {
    path: "/system-status",
    element: <SystemStatus />,
  },
  {
    path: "/not-authorised",
    element: <NotAuthorized />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);






  export default function AppRouter() {
  const { userData } = useAuthStore();
  const org = userData?.organization;
  return <RouterProvider router={router(org)} />;
  

}
