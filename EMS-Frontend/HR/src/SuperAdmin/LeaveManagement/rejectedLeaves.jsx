import { useEffect, useState } from "react";
import { getRejectedLeaves } from "../../Services/leaveService";

const RejectedLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRejectedLeaves = async () => {
    try {
      setLoading(true);


      console.log("rejectedleave:", getRejectedLeaves);
      const response = await getRejectedLeaves();

      if (response?.success) {
        setLeaves(response.leaves || []);
      } else {
        setLeaves([]);
      }
    } catch (error) {
      console.error("Get rejected leaves error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to load rejected leaves"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedLeaves();
  }, []);

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString();
  };

  const formatDateTime = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Rejected Leaves
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View all rejected employee leave requests.
        </p>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-xl border  shadow-sm">

        {/* Loading */}
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading rejected leaves...
          </div>
        ) : leaves.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No rejected leaves found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] border-collapse">

              <thead>
                <tr className="bg-sky-50 text-left">

                  <th className="border border-red-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    Employee
                  </th>

                  <th className="border border-red-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    Email
                  </th>

                  <th className="border border-red-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    Leave Type
                  </th>

                  <th className="border border-red-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    Start Date
                  </th>

                  <th className="border border-red-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    End Date
                  </th>

                  <th className="border border-red-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    Total Days
                  </th>

                  <th className="border border-red-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    Reason
                  </th>

                  <th className="border border-red-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    Rejected By
                  </th>

                  <th className="border border-red-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    Rejected At
                  </th>

                  <th className="border border-red-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    Rejection Reason
                  </th>

                  <th className="border border-red-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="hover:bg-slate-50"
                  >

                    <td className="border border-red-100 px-4 py-3 text-sm text-slate-700">
                      {leave.employee?.name || "--"}
                    </td>

                    <td className="border border-red-100 px-4 py-3 text-sm text-slate-600">
                      {leave.employee?.email || "--"}
                    </td>

                    <td className="border border-red-100 px-4 py-3 text-sm text-slate-600">
                      {leave.leaveType || "--"}
                    </td>

                    <td className="border border-red-100 px-4 py-3 text-sm text-slate-600">
                      {formatDate(leave.startDate)}
                    </td>

                    <td className="border border-red-100 px-4 py-3 text-sm text-slate-600">
                      {formatDate(leave.endDate)}
                    </td>

                    <td className="border border-red-100 px-4 py-3 text-sm text-slate-600">
                      {leave.totalDays ?? "--"}
                    </td>

                    <td className="border border-red-100 px-4 py-3 text-sm text-slate-600">
                      {leave.reason || "--"}
                    </td>

                    <td className="border border-red-100 px-4 py-3 text-sm text-slate-600">
                      {leave.approvedBy?.name || "--"}
                    </td>

                    <td className="border border-red-100 px-4 py-3 text-sm text-slate-600">
                      {formatDateTime(leave.approvedAt)}
                    </td>

                    <td className="border border-red-100 px-4 py-3 text-sm text-red-600">
                      {leave.rejectionReason || "--"}
                    </td>

                    <td className="border border-red-100 px-4 py-3">
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        {leave.status}
                      </span>
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
};

export default RejectedLeaves;

