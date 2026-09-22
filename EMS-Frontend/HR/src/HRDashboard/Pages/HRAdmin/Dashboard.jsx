import {
  UsersIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
import { getAllAttendance } from "../../../Services/attendanceService";
import {
  getPendingLeaves,
  getApprovedLeaves,
  getRejectedLeaves,
} from "../../../Services/leaveService";
import { getEmployeePortalUsers } from "../../../Services/superAdminService";

const getDateKey = (date) => {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getStartOfWeek = (date) => {
  const start = new Date(date);
  const day = start.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - daysFromMonday);

  return start;
};

const isAttended = (status) =>
  ["Present", "Late", "Half Day"].includes(status);

function Dashboard() {
  const [attendance, setAttendance] = useState([]);
  const [period, setPeriod] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaveCounts, setLeaveCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          attendanceResponse,
          pendingResponse,
          approvedResponse,
          rejectedResponse,
          portalUsersResponse,
        ] =
          await Promise.all([
            getAllAttendance(),
            getPendingLeaves(),
            getApprovedLeaves(),
            getRejectedLeaves(),
            getEmployeePortalUsers(),
          ]);

        setAttendance(attendanceResponse.attendance || []);
        setLeaveCounts({
          pending: pendingResponse.leaves?.length || 0,
          approved: approvedResponse.leaves?.length || 0,
          rejected: rejectedResponse.leaves?.length || 0,
        });
        setEmployees(portalUsersResponse.employees || []);
        setManagers(portalUsersResponse.managers || []);
      } catch (requestError) {
        console.error("Failed to load attendance:", requestError);
        setError(
          requestError.response?.data?.message ||
          "Failed to load attendance analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (parseError) {
        console.error("Failed to load dashboard user:", parseError);
      }
    }

    loadAttendance();
  }, []);

  const analytics = useMemo(() => {
    const today = new Date();
    let startDate;
    let endDate;
    let labels;

    if (period === "week") {
      startDate = getStartOfWeek(today);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    } else {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      labels = Array.from(
        { length: endDate.getDate() },
        (_, index) => String(index + 1)
      );
    }

    endDate.setHours(23, 59, 59, 999);

    const filteredAttendance = attendance.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });

    const statusCounts = filteredAttendance.reduce((counts, record) => {
      const status = record.Status || record.status || "Unknown";
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});

    const chartData = labels.map((label, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const dailyRecords = filteredAttendance.filter(
        (record) => getDateKey(record.date) === getDateKey(date)
      );
      const attended = dailyRecords.filter((record) =>
        isAttended(record.Status || record.status)
      ).length;

      return {
        label,
        total: dailyRecords.length,
        percentage: dailyRecords.length
          ? Math.round((attended / dailyRecords.length) * 100)
          : 0,
      };
    });

    const total = filteredAttendance.length;
    const attended = filteredAttendance.filter((record) =>
      isAttended(record.Status || record.status)
    ).length;

    return {
      chartData,
      total,
      attendanceRate: total ? Math.round((attended / total) * 100) : 0,
      statusCounts,
    };
  }, [attendance, period]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-gray-800">
          Welcome back, {user?.name || user?.username || "HR Admin"}
        </h1>
        <p className="mt-1 text-sm text-blue-gray-500">
          Here's what's happening with your organization today.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-blue-gray-800">
                Attendance Overview
              </h2>
              <p className="text-sm text-blue-gray-500">
                {loading
                  ? "Loading attendance analytics..."
                  : `${analytics.total} attendance records in the selected period`}
              </p>
            </div>

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="rounded-lg border border-blue-gray-100 px-3 py-2 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["Attendance Rate", `${analytics.attendanceRate}%`, "text-blue-600", ClipboardDocumentCheckIcon],
              ["Present", analytics.statusCounts.Present || 0, "text-green-600", UsersIcon],
              ["Absent", analytics.statusCounts.Absent || 0, "text-red-500", UserGroupIcon],
              ["Late", analytics.statusCounts.Late || 0, "text-orange-500", CalendarDaysIcon],
            ].map(([label, value, color, Icon]) => (
              <div key={label} className="rounded-lg bg-blue-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <span className="text-xs text-blue-gray-500">{label}</span>
                </div>
                <p className="mt-2 text-xl font-bold text-blue-gray-800">
                  {loading ? "-" : value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 h-64 w-full overflow-hidden">
            <div
              className="grid h-full w-full items-end gap-1 sm:gap-2"
              style={{
                gridTemplateColumns: `repeat(${analytics.chartData.length}, minmax(0, 1fr))`,
              }}
            >
              {analytics.chartData.map(({ label, percentage, total }) => (
                <div
                  key={label}
                  className="flex h-full min-w-0 flex-col justify-end text-center"
                >
                  <span className="mb-1 truncate text-[10px] text-blue-gray-500 sm:text-xs">
                    {loading ? "-" : `${percentage}%`}
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-blue-500"
                    style={{ height: `${Math.max(percentage, 2)}%` }}
                  />
                  <span className="mt-2 truncate text-[10px] text-blue-gray-500 sm:text-xs">
                    {label}
                  </span>
                  <span className="truncate text-[9px] text-blue-gray-400 sm:text-[10px]">
                    {total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-blue-gray-800">
            Leave Summary
          </h2>
          <p className="text-sm text-blue-gray-500">Current leave requests</p>
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-gray-600">Approved</span>
              <span className="font-bold text-green-600">
                {leaveCounts.approved}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-gray-600">Pending</span>
              <span className="font-bold text-orange-500">
                {leaveCounts.pending}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-gray-600">Rejected</span>
              <span className="font-bold text-red-500">
                {leaveCounts.rejected}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-blue-gray-800">
                Employees
              </h2>
              <p className="text-sm text-blue-gray-500">
                {employees.length} employees from the portal
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            {employees.length === 0 ? (
              <p className="text-sm text-blue-gray-500">No employees found.</p>
            ) : (
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="border-b border-blue-gray-100">
                    <th className="pb-3 text-left text-xs font-semibold text-blue-gray-500">EMPLOYEE</th>
                    <th className="pb-3 text-left text-xs font-semibold text-blue-gray-500">DEPARTMENT</th>
                    <th className="pb-3 text-left text-xs font-semibold text-blue-gray-500">POSITION</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id} className="border-b border-blue-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                            {employee.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-blue-gray-800">
                              {employee.name || "Unknown"}
                            </p>
                            <p className="text-xs text-blue-gray-500">
                              {employee.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-blue-gray-600">
                        {employee.department?.name || "Unassigned"}
                      </td>
                      <td className="py-4 text-sm text-blue-gray-600">
                        {employee.position || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-blue-gray-800">Managers</h2>
            <p className="text-sm text-blue-gray-500">
              {managers.length} managers from the portal
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            {managers.length === 0 ? (
              <p className="text-sm text-blue-gray-500">No managers found.</p>
            ) : (
              <table className="w-full min-w-[360px]">
                <thead>
                  <tr className="border-b border-blue-gray-100">
                    <th className="pb-3 text-left text-xs font-semibold text-blue-gray-500">MANAGER</th>
                    <th className="pb-3 text-left text-xs font-semibold text-blue-gray-500">ROLE</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((manager) => (
                    <tr key={manager._id} className="border-b border-blue-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                            {manager.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-blue-gray-800">
                              {manager.name || "Unknown"}
                            </p>
                            <p className="text-xs text-blue-gray-500">
                              {manager.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-blue-gray-600">
                        {manager.role || "Manager"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
