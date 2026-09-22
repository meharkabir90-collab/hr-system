import { useEffect, useState } from "react";
import LoadingSpinner from "../Components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

import {
    LogIn,
    LogOutIcon,
  Users,
  CalendarDays,
  Clock,
  RefreshCw,
  ArrowLeft,
  UserCheck,
  UserX,
  AlertCircle,
} from "lucide-react";

import { getTeamAttendance } from "../Services/attendanceService";

function TeamAttendance() {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH TEAM ATTENDANCE
  // =========================

  const fetchTeamAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTeamAttendance();

      console.log("TEAM ATTENDANCE RESPONSE:", data);

      if (data?.success) {
        setAttendance(data.attendance || []);
      } else {
        setError(
          data?.message || "Unable to load team attendance"
        );
      }
    } catch (error) {
      console.error("TEAM ATTENDANCE ERROR:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load team attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamAttendance();
  }, []);

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================
  // FORMAT TIME
  // =========================

  const formatTime = (time) => {
    if (!time) return "--";

    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =========================
  // STATUS
  // =========================

  const getStatus = (record) => {
    return record?.status || record?.Status || "--";
  };

  // =========================
  // WORKING HOURS
  // =========================

  const getWorkingHours = (record) => {
    const hours =
      record?.workingHours ??
      record?.WorkingHours;

    if (hours === undefined || hours === null) {
      return "--";
    }

    return `${hours} hrs`;
  };

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";

      case "Late":
        return "bg-yellow-100 text-yellow-700";

      case "Absent":
        return "bg-red-100 text-red-700";

      case "Half Day":
        return "bg-orange-100 text-orange-700";

      case "On Leave":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // =========================
  // STATISTICS
  // =========================

  const presentCount = attendance.filter(
    (record) =>
      getStatus(record) === "Present"
  ).length;

  const lateCount = attendance.filter(
    (record) =>
      getStatus(record) === "Late"
  ).length;

  const absentCount = attendance.filter(
    (record) =>
      getStatus(record) === "Absent"
  ).length;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner label="Loading team attendance..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <Users
              size={28}
              className="text-sky-600"
            />

            <h1 className="text-2xl font-bold text-gray-800">
              Team Attendance
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Monitor attendance records of your team members
          </p>
        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={fetchTeamAttendance}
            className="
              inline-flex items-center gap-2
              rounded-lg
              border border-gray-200
              bg-white
              px-4 py-2.5
              text-sm font-medium
              text-gray-600
              shadow-sm
              transition
              hover:bg-gray-50
            "
          >
            <RefreshCw size={17} />

            Refresh
          </button>

          <button
            type="button"
            onClick={() => navigate("/manager/dashboard")}
            className="
              inline-flex items-center gap-2
              rounded-lg
              bg-sky-600
              px-4 py-2.5
              text-sm font-medium
              text-white
              transition
              hover:bg-sky-700
            "
          >
            <ArrowLeft size={17} />

            Dashboard
          </button>

        </div>
      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div
          className="
            flex items-start gap-3
            rounded-lg
            border border-red-200
            bg-red-50
            p-4
            text-red-700
          "
        >
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-medium">
              Unable to load attendance
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      )}


      {/* =========================
          STATISTICS
      ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Total */}
        <div
          className="
            rounded-xl
            border border-gray-100
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Records
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {attendance.length}
              </h2>
            </div>

            <div className="rounded-lg bg-sky-100 p-3">
              <Users
                size={22}
                className="text-sky-600"
              />
            </div>

          </div>
        </div>


        {/* Present */}
        <div
          className="
            rounded-xl
            border border-gray-100
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Present
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600">
                {presentCount}
              </h2>
            </div>

            <div className="rounded-lg bg-green-100 p-3">
              <UserCheck
                size={22}
                className="text-green-600"
              />
            </div>

          </div>
        </div>


        {/* Late / Absent */}
        <div
          className="
            rounded-xl
            border border-gray-100
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Late / Absent
              </p>

              <h2 className="mt-2 text-2xl font-bold text-orange-600">
                {lateCount + absentCount}
              </h2>
            </div>

            <div className="rounded-lg bg-orange-100 p-3">
              <UserX
                size={22}
                className="text-orange-600"
              />
            </div>

          </div>
        </div>

      </div>


      {/* =========================
          ATTENDANCE TABLE
      ========================= */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border border-gray-100
          bg-white
          shadow-sm
        "
      >

        {/* Table Header */}

        <div
          className="
            flex flex-col gap-3
            border-b border-gray-100
            px-5 py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>
            <h2 className="font-semibold text-gray-800">
              Team Attendance Records
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              {attendance.length} attendance record
              {attendance.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays size={17} />

            Attendance History
          </div>

        </div>


        {/* Empty State */}

        {attendance.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

            <div className="rounded-full bg-sky-50 p-4">
              <Users
                size={32}
                className="text-sky-500"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              No Team Attendance
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-400">
              There are currently no attendance records
              available for your team.
            </p>

          </div>
        ) : (

          /* =========================
             RESPONSIVE TABLE
          ========================= */

          <div className="overflow-x-auto">

            <table className="min-w-[1000px] w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th
                    className="
                      px-5 py-3
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Employee
                  </th>

                  <th
                    className="
                      px-5 py-3
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Position
                  </th>

                  <th
                    className="
                      px-5 py-3
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Date
                  </th>

                  <th
                    className="
                      px-5 py-3
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Check In
                  </th>

                  <th
                    className="
                      px-5 py-3
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Check Out
                  </th>

                  <th
                    className="
                      px-5 py-3
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Status
                  </th>

                  <th
                    className="
                      px-5 py-3
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Working Hours
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {attendance.map((record) => {

                  const employee = record.employee;

                  const status = getStatus(record);

                  return (
                    <tr
                      key={record._id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Employee */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex h-10 w-10
                              shrink-0
                              items-center justify-center
                              rounded-full
                              bg-sky-100
                              text-sm
                              font-semibold
                              text-sky-600
                            "
                          >
                            {employee?.name
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </div>

                          <div>

                            <p className="font-medium text-gray-800">
                              {employee?.name || "Unknown"}
                            </p>

                            <p className="text-xs text-gray-400">
                              {employee?.email || "--"}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Position */}

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {employee?.position || "--"}
                      </td>


                      {/* Date */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <CalendarDays
                            size={16}
                            className="text-gray-400"
                          />

                          {formatDate(record.date)}

                        </div>

                      </td>


                      {/* Check In */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <LogIn
                            size={16}
                            className="text-green-500"
                          />

                          {formatTime(record.checkIn)}

                        </div>

                      </td>


                      {/* Check Out */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <LogOutIcon
                            size={16}
                            className="text-red-500"
                          />

                          {formatTime(record.checkOut)}

                        </div>

                      </td>


                      {/* Status */}

                      <td className="px-5 py-4">

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-3 py-1
                            text-xs
                            font-semibold
                            ${getStatusStyle(status)}
                          `}
                        >
                          {status}
                        </span>

                      </td>


                      {/* Working Hours */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <Clock
                            size={16}
                            className="text-sky-500"
                          />

                          {getWorkingHours(record)}

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default TeamAttendance;

