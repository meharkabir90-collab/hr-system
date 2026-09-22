import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployee } from "../../../Services/employeeService";
import { getDepartment } from "../../../Services/departmentService";
import { getAllAttendance } from "../../../Services/attendanceService";
import { getPendingLeaves } from "../../../Services/leaveService";

const SuperAdminDashboard = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    onLeave: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
         
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user:", error);
      }
    }

    const loadDashboardData = async () => {
      try {
        const [employeeData, departments, pendingLeaves, attendanceData] =
          await Promise.all([
            getEmployee(),
            getDepartment(),
            getPendingLeaves(),
            getAllAttendance(),
          ]);

        const employeeProfiles = employeeData?.employees || [];
        setEmployees(
          employeeProfiles.filter(
            (employee) => employee.user?.role === "Employee"
          )
        );
        setManagers(
          employeeProfiles.filter(
            (employee) => employee.user?.role === "Manager"
          )
        );
        setDepartmentCount((departments?.departments || []).length);
        setPendingLeaveCount((pendingLeaves?.leaves || []).length);

        const today = new Date().toISOString().slice(0, 10);
        const todayRecords = (attendanceData?.attendance || []).filter(
          (record) => new Date(record.date).toISOString().slice(0, 10) === today
        );

        setTodayAttendance({
          total: todayRecords.length,
          present: todayRecords.filter((record) => record.Status === "Present").length,
          late: todayRecords.filter((record) => record.Status === "Late").length,
          absent: todayRecords.filter((record) => record.Status === "Absent").length,
          onLeave: todayRecords.filter((record) => record.Status === "On Leave").length,
        });
      } catch (requestError) {
        console.error("Failed to load SuperAdmin dashboard data:", requestError);
        setError(
          requestError.response?.data?.message ||
            "Failed to load dashboard data"
        );
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          SuperAdmin Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back, {user?.name || "SuperAdmin"}. Here's an overview
          of your HR management system.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Employees */}
        <div className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Employees
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {employees.length}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                All registered employees
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-2xl">
              👥
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Departments
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {departmentCount}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Active departments
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-2xl">
              🏢
            </div>
          </div>
        </div>

        {/* Pending Leaves */}
        <div className="rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending Leaves
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {pendingLeaveCount}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Awaiting approval
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-2xl">
              🕐
            </div>
          </div>
        </div>

        {/* Managers */}
        <div className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Managers
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {managers.length}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Active managers
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl">
              👨‍💼
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Attendance */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Today's Attendance
              </h2>

              <p className="text-sm text-slate-500">
                {todayAttendance.total} attendance records today
              </p>
            </div>

            <span className="rounded-lg bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
              Today
            </span>
          </div>

          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Present
              </span>

              <span className="font-semibold text-green-600">
                {todayAttendance.present}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Late
              </span>

              <span className="font-semibold text-amber-600">
                {todayAttendance.late}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Absent
              </span>

              <span className="font-semibold text-red-600">
                {todayAttendance.absent}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                On Leave
              </span>

              <span className="font-semibold text-blue-600">
                {todayAttendance.onLeave}
              </span>
            </div>

          </div>
        </div>

        {/* Leave Overview */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Leave Overview
            </h2>

            <p className="text-sm text-slate-500">
              Current leave request status
            </p>
          </div>

          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Pending
              </span>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {pendingLeaveCount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Approved
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                0
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Rejected
              </span>

              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                0
              </span>
            </div>

          </div>
        </div>

        {/* Recruitment */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Recruitment
            </h2>

            <p className="text-sm text-slate-500">
              Hiring activity overview
            </p>
          </div>

          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Open Positions
              </span>

              <span className="font-semibold text-slate-800">
                0
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Applications
              </span>

              <span className="font-semibold text-slate-800">
                0
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Candidates
              </span>

              <span className="font-semibold text-slate-800">
                0
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Quick Actions
          </h2>

          <p className="text-sm text-slate-500">
            Frequently used system operations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <button
            type="button"
            onClick={() => navigate("/superadmin/employee/add")}
            className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-4 text-left transition hover:bg-sky-100"
          >
            <p className="font-semibold text-sky-800">
              Add Employee
            </p>

            <p className="mt-1 text-xs text-sky-600">
              Create a new employee
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/superadmin/department/add")}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-4 text-left transition hover:bg-indigo-100"
          >
            <p className="font-semibold text-indigo-800">
              Add Department
            </p>

            <p className="mt-1 text-xs text-indigo-600">
              Create a new department
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/superadmin/pending-leaves")}
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-left transition hover:bg-amber-100"
          >
            <p className="font-semibold text-amber-800">
              Pending Leaves
            </p>

            <p className="mt-1 text-xs text-amber-600">
              Review leave requests
            </p>
          </button>

          <button
            className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-4 text-left transition hover:bg-purple-100"
          >
            <p className="font-semibold text-purple-800">
              Reports
            </p>

            <p className="mt-1 text-xs text-purple-600">
              View system reports
            </p>
          </button>

        </div>
      </div>

      {/* System Modules */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            System Modules
          </h2>

          <p className="text-sm text-slate-500">
            SuperAdmin has access to all HR system modules.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

          <button
            type="button"
            onClick={() => navigate("/superadmin/employees")}
            className="rounded-lg bg-slate-50 p-4 text-center transition hover:bg-sky-50"
          >
            <div className="text-2xl">👥</div>
            <p className="mt-2 text-sm font-medium text-slate-700">
              Employees
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/superadmin/departments")}
            className="rounded-lg bg-slate-50 p-4 text-center transition hover:bg-indigo-50"
          >
            <div className="text-2xl">🏢</div>
            <p className="mt-2 text-sm font-medium text-slate-700">
              Departments
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/superadmin/get-all-attendance")}
            className="rounded-lg bg-slate-50 p-4 text-center transition hover:bg-sky-50"
          >
            <div className="text-2xl">🕐</div>
            <p className="mt-2 text-sm font-medium text-slate-700">
              Attendance
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/superadmin/pending-leaves")}
            className="rounded-lg bg-slate-50 p-4 text-center transition hover:bg-amber-50"
          >
            <div className="text-2xl">📋</div>
            <p className="mt-2 text-sm font-medium text-slate-700">
              Leaves
            </p>
          </button>

          <div className="rounded-lg bg-slate-50 p-4 text-center">
            <div className="text-2xl">💰</div>
            <p className="mt-2 text-sm font-medium text-slate-700">
              Payroll
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 text-center">
            <div className="text-2xl">🤖</div>
            <p className="mt-2 text-sm font-medium text-slate-700">
              AI
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;
