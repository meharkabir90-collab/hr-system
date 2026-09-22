import { useEffect, useState } from "react";
import { getMyAttendance } from "../Services/attendanceService";
import LoadingSpinner from "../Components/LoadingSpinner";

function ManagerAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const data = await getMyAttendance();

        setAttendance(data.attendance || []);
      } catch (error) {
        console.error("Get attendance error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load attendance"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner label="Loading attendance..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="items-center max-w-6xl mx-auto mb-6">

         <button
          onClick={() => navigate("/employee-dashboard")}
          className="mb-5 inline-flex items-center gap-2 px-4 py-2 bg-white text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-100 hover:border-sky-400 transition-all duration-200"
        >
          &larr; Dashboard
        </button>
        <div className="py-4 flex flex-col gap-1"
        style={{ fontFamily: "times-new-roman" }}>
              <p className="text-sky-400 font-semibold text-sm uppercase tracking-wide">
            Manager Portal
          </p>

        <h1 className="text-4xl font-extrabold  text-sky-900">
          My Attendance
        </h1>

        <p className="text-sky-700 text-lg  mt-1"
        style={{ fontFamily: "times-new-roman" }}>
          Detailed Overview of your attendance history & Working hours
        </p>

        </div>
        

      </div>

      {/* Attendance Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      style={{ fontFamily: "times-new-roman" }}>

        {/* Card Header */}
        <div className="p-6 border-b bg-sky-600">

          <h2 className="text-2xl font-semibold text-white"
          >
            Daily History
          </h2>

          <p className="text-sm text-white mt-1">
            Your regular working records
          </p>

        </div>

        {attendance.length === 0 ? (

          /* Empty State */
          <div className="p-12 text-center">

            <p className="text-gray-500 text-lg">
              No attendance records found.
            </p>

          </div>

        ) : (

          /* Table */
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

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

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Working Hours
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y bg-sky-50">

                {attendance.map((record) => (

                  <tr
                    key={record._id}
                    className="hover:bg-gray-50"
                  >

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-800">

                      {record.date
                        ? new Date(record.date).toLocaleDateString()
                        : "N/A"}

                    </td>

                    {/* Check In */}
                    <td className="px-6 py-4 text-sm text-gray-700">

                      {record.checkIn
                        ? new Date(record.checkIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--"}

                    </td>

                    {/* Check Out */}
                    <td className="px-6 py-4 text-sm text-gray-700">

                      {record.checkOut
                        ? new Date(record.checkOut).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--"}

                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium
                          ${
                            record.Status === "Present"
                              ? "bg-green-100 text-green-700"
                              : record.Status === "Late"
                              ? "bg-yellow-100 text-yellow-700"
                              : record.Status === "Absent"
                              ? "bg-red-100 text-red-700"
                              : record.Status === "On Leave"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {record.Status || "N/A"}
                      </span>

                    </td>

                    {/* Working Hours */}
                    <td className="px-6 py-4 text-sm text-gray-700">

                      {record.WorkingHours
                        ? `${record.WorkingHours} hours`
                        : "--"}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default ManagerAttendance;