import { useEffect, useState } from "react";

import {
  checkIn,
  checkOut,
  getMyAttendance,
} from "../../../Services/attendanceService";
import { getMyLeaves } from "../../../Services/leaveService";
import { myProfile } from '../../../Services/myProfile'
import { getManagerDashboard } from "../../../Services/employeeService";

function EmployeeDashboard() {

      useEffect(() => {
  const loadEmployee = async () => {
    try {
      const data = await myProfile();

      setEmployee(data.employee);
    } catch (error) {
      console.error("Get employee profile error:", error);
    }
  };

  loadEmployee();
}, []);

useEffect(() => {
  const loadManagerDashboard = async () => {
    try {
      const data = await getManagerDashboard();

      console.log("MANAGER DASHBOARD RESPONSE:", data);

      setDashboard(data);
    } catch (error) {
      console.error("Manager dashboard error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load manager dashboard"
      );
    }
  };

  loadManagerDashboard();
}, []);

  const [attendance, setAttendance] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [employee, setEmployee] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  // Get today's attendance
 const fetchAttendance = async () => {

  try {
    console.log("FETCH ATTENDANCE RUNNING");

    setLoading(true);
    setError("");

    const data = await getMyAttendance();

    console.log("ATTENDANCE API RESPONSE:", data);

    const records = data.attendance || [];

    setAttendanceRecords(records);

    const today = new Date().toDateString();

    const todayAttendance = records.find(
      (record) =>
        new Date(record.date).toDateString() === today
    );

   

    setAttendance(todayAttendance || null);

  } catch (error) {
    console.error("Get attendance error:", error);

    setError(
      error.response?.data?.message ||
      "Unable to load attendance"
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchAttendance();

  const loadLeaves = async () => {
    try {
      const data = await getMyLeaves();
      setLeaves(data.leaves || []);
    } catch (error) {
      console.error("Get leaves error:", error);
      setError(
        error.response?.data?.message ||
        "Unable to load leave summary"
      );
    }
  };

  loadLeaves();
}, []);

const attendanceSummary = attendanceRecords.reduce(
  (summary, record) => {
    const status = record.Status || record.status;

    if (status === "Present" || status === "Half Day") {
      summary.present += 1;
    } else if (status === "Absent") {
      summary.absent += 1;
    } else if (status === "Late") {
      summary.late += 1;
    } else if (status === "Leave") {
      summary.leave += 1;
    }

    return summary;
  },
  { present: 0, absent: 0, late: 0, leave: 0 }
);

const leaveSummary = leaves.reduce(
  (summary, leave) => {
    const status = leave.status || leave.Status;
    const totalDays = Number(leave.totalDays) || 0;

    if (status === "Approved") {
      summary.approved += 1;
      summary.approvedDays += totalDays;
    } else if (status === "Pending") {
      summary.pending += 1;
    }

    return summary;
  },
  { approved: 0, approvedDays: 0, pending: 0 }
);
  // Check In
  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setMessage("");
      setError("");

      const data = await checkIn({});

      setMessage(
        data.message || "Check-in successful"
      );

      // Refresh today's attendance
      await fetchAttendance();

    } catch (error) {
      console.error("Check-in error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to check in"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Check Out
  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setMessage("");
      setError("");

      const data = await checkOut({});

      setMessage(
        data.message || "Check-out successful"
      );

      // Refresh today's attendance
      await fetchAttendance();

    } catch (error) {
      console.error("Check-out error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to check out"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Format time
  const formatTime = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Today's date
  const today = new Date().toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-sky-50">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =========================
            WELCOME
        ========================== */}

        <div className="mb-6 rounded-2xl bg-gradient-to-r from-sky-700 to-sky-600 p-6 shadow-sm">

          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Welcome back, {dashboard?.name || employee?.name} 👋
          </h1>

          <p className="mt-2 text-sky-50">
            Here's your manager dashboard overview.
          </p>

          <p className="mt-1 text-sm text-white/80">
            {today}
          </p>

        </div>


        {/* =========================
            MESSAGES
        ========================== */}

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}


        {/* =========================
            STATISTICS
        ========================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Today's Status"
            value={
              attendance?.Status ||
              attendance?.status ||
              "Not Marked"
            }
            description="Attendance status"
          />

          <StatCard
            title="Check In"
            value={formatTime(
              attendance?.checkIn ||
              attendance?.CheckIn
            )}
            description="Today's check-in"
          />

          <StatCard
            title="Check Out"
            value={formatTime(
              attendance?.checkOut ||
              attendance?.CheckOut
            )}
            description="Today's check-out"
          />

          <StatCard
            title="Working Hours"
            value={
              attendance?.WorkingHours ||
              attendance?.workingHours ||
              "0 hrs"
            }
            description="Today's working time"
          />

        </div>


       {/* =========================
    DEPARTMENT INFORMATION
========================== */}

<div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

  <div className="mb-5">
    <h2 className="text-xl font-bold text-gray-800">
      Department Information
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Your department and reporting manager
    </p>
  </div>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

    {/* Department */}

    <div className="rounded-xl bg-sky-50 p-5">

      <p className="text-sm font-medium text-gray-500">
        Department
      </p>

      <p className="mt-2 text-xl font-bold text-sky-700">
        {dashboard?.department?.name || "--"}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        Your assigned department
      </p>

    </div>


    {/* Department Manager */}

    <div className="rounded-xl bg-sky-50 p-5">

      <p className="text-sm font-medium text-gray-500">
        Your Position
      </p>

      <p className="mt-2 text-xl font-bold text-sky-700">
        {dashboard?.department?.manager?.position || "--"}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        Department Manager
      </p>

    </div>

  </div>

</div>
{/* =========================
    DEPARTMENT EMPLOYEES
========================== */}

<div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

  <div className="mb-5">
    <h2 className="text-xl font-bold text-gray-800">
      Department Employees
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Employees working in your department
    </p>
  </div>

  {dashboard?.employees?.length > 0 ? (

    <div className="overflow-x-auto">

      <table className="w-full text-left">

        <thead>
          <tr className="border-b border-gray-200 text-sm text-gray-500">

            <th className="px-4 py-3 font-medium">
              Employee
            </th>

            <th className="px-4 py-3 font-medium">
              Position
            </th>

            <th className="px-4 py-3 font-medium">
              Email
            </th>

            <th className="px-4 py-3 font-medium">
              Phone
            </th>

          </tr>
        </thead>

        <tbody>

          {dashboard.employees.map((employee) => (

            <tr
              key={employee._id}
              className="border-b border-gray-100 hover:bg-sky-50"
            >

              <td className="px-4 py-4 font-medium text-gray-800">
                {employee.name}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {employee.position}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {employee.email}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {employee.phone}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  ) : (

    <div className="rounded-xl bg-sky-50 p-6 text-center">

      <p className="text-gray-500">
        No employees found in your department.
      </p>

    </div>

  )}

</div>


        {/* =========================
            OVERVIEW
        ========================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Attendance Overview */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-800">
              Attendance Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your attendance summary
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">

              <OverviewCard
                title="Present"
                value={attendanceSummary.present}
              />

              <OverviewCard
                title="Absent"
                value={attendanceSummary.absent}
              />

              <OverviewCard
                title="Late"
                value={attendanceSummary.late}
              />

              <OverviewCard
                title="Leave"
                value={attendanceSummary.leave}
              />

            </div>

          </div>


          {/* Leave Summary */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-800">
              Leave Summary
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your leave information
            </p>

            <div className="mt-5 space-y-4">

              <LeaveItem
                title="Approved Requests"
                value={leaveSummary.approved}
              />

              <LeaveItem
                title="Approved Leave Days"
                value={leaveSummary.approvedDays}
              />

              <LeaveItem
                title="Pending Requests"
                value={leaveSummary.pending}
              />

            </div>

          </div>

        </div>


        {/* =========================
            QUICK ACTIONS
        ========================== */}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-800">
            Quick Actions
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <QuickAction
              title="My Profile"
              description="View your employee information"
              href="/employee/profile"
            />

            <QuickAction
              title="My Attendance"
              description="View your attendance history"
              href="/employee/attendance"
            />

            <QuickAction
              title="Apply Leave"
              description="Submit a new leave request"
              href="/employee/leave"
            />

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================
   STAT CARD
========================================= */

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-sky-600">
        {value}
      </h3>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>

    </div>
  );
}


/* =========================================
   ATTENDANCE ITEM
========================================= */

function AttendanceItem({ label, value }) {
  return (
    <div className="rounded-xl bg-sky-50 p-4">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-sky-600">
        {value}
      </p>

    </div>
  );
}


/* =========================================
   OVERVIEW CARD
========================================= */

function OverviewCard({ title, value }) {
  return (
    <div className="rounded-xl border border-sky-100 p-4">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-gray-800">
        {value}
      </p>

    </div>
  );
}


/* =========================================
   LEAVE ITEM
========================================= */

function LeaveItem({ title, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-sky-50 p-4">

      <span className="text-sm font-medium text-gray-600">
        {title}
      </span>

      <span className="text-lg font-bold text-sky-600">
        {value}
      </span>

    </div>
  );
}


/* =========================================
   QUICK ACTION
========================================= */

function QuickAction({
  title,
  description,
  href,
}) {
  return (
    <a
      href={href}
      className="rounded-xl border border-sky-100 p-5 transition hover:border-sky-300 hover:bg-sky-50"
    >

      <h3 className="font-semibold text-sky-700">
        {title}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>

    </a>
  );
}


export default EmployeeDashboard;

