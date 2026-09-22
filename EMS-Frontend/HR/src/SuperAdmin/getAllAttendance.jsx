import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAttendance } from "../Services/attendanceService";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setError("");

        const response = await getAllAttendance();

        setAttendance(response.attendance);
      } catch (error) {
        console.error("Failed to load Attendance:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load attendance"
        );
      }
    };

    loadAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Attendance
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View employee attendance records.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {attendance.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            No attendance records found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="min-w-full">

            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Employee
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Check In
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Check Out
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((record) => (
                <tr
                  key={record._id}
                  className="border-b last:border-b-0 hover:bg-slate-50"
                >

                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {record.employee?.name || "Unknown"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {record.date
                      ? new Date(record.date).toLocaleDateString()
                      : "--"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {record.checkIn
                      ? new Date(record.checkIn).toLocaleTimeString()
                      : "--"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {record.checkOut
                      ? new Date(record.checkOut).toLocaleTimeString()
                      : "--"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {record.Status || record.status || "--"}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}

export default Attendance;
