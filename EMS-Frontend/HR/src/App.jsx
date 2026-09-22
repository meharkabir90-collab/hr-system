import { Routes, Route } from "react-router-dom";

import Register from "./Pages/Register";
import CandidateRegister from "./Pages/CandidateRegister";
import CandidateLogin from "./Pages/CandidateLogin";
import Login from "./Pages/Login";



import AddDepartment from "./SuperAdmin/Department/addDepartment";
import EditDepartment from "./SuperAdmin/Department/editDepartment";
import Departments from "./SuperAdmin/Department/viewDepartment";
import SingleDepartment from "./HRDashboard/Department/viewSingleDepartment";


import EmployeeDetails from "./Employee Module/MyProfile";
import EmployeeAttendance from "./Employee Module/Attendance";
import Leave from "./Employee Module/Leave";
import MyPayroll from "./Employee Module/MyPayroll";

import DashboardLayout from "./Employee Module/Layout/DashboardLayout";
import EmployeeDashboard from "./Employee Module/Page/Dashboard/EmployeeDashboard";

import ManagerDasboardLayout from "./Manager/Layout/Dashboard"
import ManagerDashboard from "./Manager/Pages/Manager/Dashboard"
import ManagerDetails from "./Manager/MyProfile";
import ManagerAttendance from "./Manager/Attendance";
import TeamAttendance from "./Manager/teamAttendance";

import HRDashboard from "./HRDashboard/Pages/HRAdmin/Dashboard";
import HRProfile from "./HRDashboard/MyProfile";
import Dashboard from "./HRDashboard/Layout/Dashboard"
import Payroll from "./HRDashboard/PayrollStructure/Payroll";
import GeneratePayroll from "./HRDashboard/PayrollStructure/generatePayroll";
import Vacancy from "./HRDashboard/Recruitment/Vacancy";
import CreateJob from "./HRDashboard/Recruitment/createJob";
import JobApplications from "./HRDashboard/Recruitment/jobApplications";
import Vacancies from "./Components/Job Portal/Vacancies";
import ApplyJob from "./Components/Job Portal/applyJob";
import CandidateDashboard from "./Components/Job Portal/candidateDashboard";
import LandingPage from "./Components/LandingPage";


import Employees from "./SuperAdmin/UserManagement/Employees List/View Employees";
import Managers from "./SuperAdmin/UserManagement/Managers"
import SingleEmployee from "./SuperAdmin/UserManagement/Employees List/ViewSingleEmployee";
import AddEmployee from "./SuperAdmin/UserManagement/Employees List/Add Employee";
import EditEmployee from "./SuperAdmin/UserManagement/Employees List/Edit Employee";
import SuperAdminDasboardLayout from "./SuperAdmin/Layout/DashboardLayout"
import SuperAdminDashboard from "./SuperAdmin/Pages/SuperAdmin/Dashboard"
import EmployeePortal from "./SuperAdmin/EmployeePortal"
import ManagerPortal from "./SuperAdmin/ManagerPortal"
import HRPortal from "./SuperAdmin/HRPortal"
import HRAdmins from "./SuperAdmin/UserManagement/HRAdmins"
import AddHR from "./SuperAdmin/HRManagement/addHR"
import ViewHR from "./SuperAdmin/HRManagement/viewHR"
import SuperAdminProfile from "./SuperAdmin/myProfile"
import Attendance from "./SuperAdmin/getAllAttendance"
import PendingLeaves from "./SuperAdmin/LeaveManagement/pendingLeaves";
import ApprovedLeaves from "./SuperAdmin/LeaveManagement/approvedLeaves";
import RejectedLeaves from "./SuperAdmin/LeaveManagement/rejectedLeaves";


import ProtectedRoute from "./Components/protectedRoutes"
import CandidateProtectedRoute from "./Components/candidateProtectedRoute";

import "./App.css";

function App() {
  return (
    <Routes>

      <Route path="/" element={<LandingPage />} />

      {/* Authentication */}
      <Route path="/register" element={<Register />} />
      <Route path="/candidate-register" element={<CandidateRegister />} />
      <Route path="/candidate-login" element={<CandidateLogin />} />
      <Route element={<CandidateProtectedRoute />}>
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/vacancies" element={<Vacancies />} />
      <Route path="/vacancies/apply/:jobId" element={<ApplyJob />} />

      {/* HR */}
      <Route element={<ProtectedRoute allowedRoles={["HRAdmin", "SuperAdmin"]}  />}>
          <Route path="/hr" element={<Dashboard />}>
             <Route path="dashboard" element={<HRDashboard />} />
              <Route path="myprofile" element={<HRProfile />} />
              <Route path="employees" element={<Employees />} />
              <Route path="employee/:id" element={<SingleEmployee />} />
              <Route path="employee/add" element={<AddEmployee />} />
              <Route path="employee/:id/edit" element={<EditEmployee />} />
              <Route path="department/add" element={<AddDepartment />} />
              <Route path="departments" element={<Departments />} />
              <Route path="departments/:id" element={<SingleDepartment />} />
              <Route path="departments/:id/edit" element={<EditDepartment />} />

              <Route path="get-all-attendance" element={<Attendance />} />
              <Route path="pending-leaves"  element={<PendingLeaves />} />
              <Route path="approved-leaves" element={<ApprovedLeaves />} />
              <Route path="rejected-leaves" element={<RejectedLeaves />} />
              <Route path="generate-payroll" element={<GeneratePayroll />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="recruitment" element={<Vacancy />} />
              <Route path="recruitment/add" element={<CreateJob />} />
              <Route path="recruitment/:id/edit" element={<CreateJob />} />
              <Route path="job-applications" element={<JobApplications />} />
          </Route>

      </Route>
      
     


      {/* Employee Portal */}

      <Route element={<ProtectedRoute allowedRoles={["Employee", "SuperAdmin"]} />}>
  <Route path="/employee" element={<DashboardLayout />}>
    
    <Route
      path="dashboard"
      element={<EmployeeDashboard />}
    />

    <Route
      path="profile"
      element={<EmployeeDetails />}
    />

    <Route
      path="attendance"
      element={<EmployeeAttendance />}
    />

    <Route
      path="leave"
      element={<Leave />}
    />

    <Route
      path="payroll"
      element={<MyPayroll />}
    />

    <Route 
    path="vacancies"
     element={<Vacancies />} 
    />
    

  </Route>
</Route>

      {/*Manager */}

     <Route element={<ProtectedRoute allowedRoles={["Manager",  "SuperAdmin"]} />}>
       <Route path="/manager" element={<ManagerDasboardLayout />}>

      <Route
         path="dashboard"
         element={<ManagerDashboard />}
      />

      <Route
        path="profile"
        element={<ManagerDetails />}
      />

    <Route
      path="attendance"
      element={<ManagerAttendance />}
    />

    <Route
      path="leave"
      element={<Leave />}
    />

    <Route
      path="payroll"
      element={<MyPayroll />}
    />
    
    <Route 
    path="vacancies"
     element={<Vacancies />} 
    />
    

     <Route
      path="team-attendance"
      element={<TeamAttendance />}
    />
    <Route
      path="pending-leaves"
      element={<PendingLeaves />}
    />
    <Route
      path="approved-leaves"
      element={<ApprovedLeaves />}
    />
    <Route
      path="rejected-leaves"
      element={<RejectedLeaves />}
    />

  </Route>
</Route>

<Route element={ <ProtectedRoute allowedRoles={["SuperAdmin"]} /> } 
>
   <Route path="/superadmin" element={<SuperAdminDasboardLayout />} >
      <Route path="dashboard" element={<SuperAdminDashboard />} />
      <Route path="employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="manager/dashboard" element={<ManagerDashboard />}/>
      <Route path="hr/dashboard" element={<HRDashboard />} />
      <Route path="profile" element={<SuperAdminProfile />} />

      <Route path="employee-portal" element={<EmployeePortal />} />
      <Route path="manager-portal" element={<ManagerPortal />} />
      <Route path="hr-portal" element={<HRPortal />} />
      <Route path="hr-admins" element={<HRAdmins />} />
      <Route path="hr/add" element={<AddHR />} />
      <Route path="hr/:id" element={<ViewHR />} />
 
 
      <Route path="employee/add" element={<AddEmployee />} />
      <Route path="employee/:id/edit" element={<EditEmployee />} />
      <Route path="employees" element={<Employees />} />
      <Route path="employee/:id" element={<SingleEmployee />} />

      <Route path="managers" element={<Managers />} />

        <Route path="department/add" element={<AddDepartment />} />
        <Route path="departments" element={<Departments />} />
        <Route path="departments/:id" element={<SingleDepartment />} />
        <Route path="departments/:id/edit" element={<EditDepartment />} />

        <Route path="get-all-attendance" element={<Attendance />} />

        <Route path="pending-leaves"  element={<PendingLeaves />} />
        <Route path="approved-leaves" element={<ApprovedLeaves />} />
        <Route path="rejected-leaves" element={<RejectedLeaves />} />

        <Route path="payroll" element={<Payroll />} />
        <Route path="generate-payroll" element={<GeneratePayroll />} />

            <Route path="recruitment" element={<Vacancy />} />
            <Route path="recruitment/add" element={<CreateJob />} />
            <Route path="recruitment/:id/edit" element={<CreateJob />} />
            <Route path="job-applications" element={<JobApplications />} />
   </Route> 
</Route>


</Routes>
  );
}

export default App;