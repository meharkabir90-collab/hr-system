import { useEffect, useState } from "react";
import { getMyPayroll } from "../Services/payrollService";
import LoadingSpinner from "../Components/LoadingSpinner";

function MyPayroll() {
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const data = await getMyPayroll();
      setPayroll(data.payroll || null);
      setError("");
    } catch (err) {
      console.error("My payroll fetch error:", err);
      setError(err.response?.data?.message || "Failed to load payroll details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner label="Loading your payroll..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Payroll</h1>
            <p className="text-gray-500 mt-1">Your salary summary</p>
          </div>

          <button
            onClick={fetchPayroll}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-md bg-red-100 text-red-700">{error}</div>
        )}

        {!payroll ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm">
            No payroll information available.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{payroll.name}</h2>
              <p className="text-gray-600 mt-1">{payroll.department}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Basic Salary</p>
                <p className="text-2xl font-bold text-gray-800">PKR {Number(payroll.salary || 0).toLocaleString()}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Allowance</p>
                <p className="text-2xl font-bold text-green-600">PKR {Number(payroll.allowance || 0).toLocaleString()}</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Deduction</p>
                <p className="text-2xl font-bold text-red-600">PKR {Number(payroll.deduction || 0).toLocaleString()}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Net Salary</p>
                <p className="text-2xl font-bold text-blue-700">PKR {Number(payroll.netSalary || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPayroll;
