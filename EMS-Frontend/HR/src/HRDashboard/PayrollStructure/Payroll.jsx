import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getPayrollSummary,
  generatePayroll,
  updatePayrollStatus,
} from "../../Services/payrollService";
import LoadingSpinner from "../../Components/LoadingSpinner";

function Payroll() {
  const location = useLocation();
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear();

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const data = await getPayrollSummary({ month: currentMonth, year: currentYear });
      setPayroll(data.payroll || []);
      setError("");
    } catch (err) {
      console.error("Payroll fetch error:", err);
      setError(err.response?.data?.message || "Failed to load payroll summary");
    } finally {
      setLoading(false);
    }
  };

 

  const handleUpdateStatus = async (id, status) => {
    try {
      setProcessing(true);
      setError("");
      await updatePayrollStatus(id, status);
      await fetchPayroll();
    } catch (err) {
      console.error("Update payroll status error:", err);
      setError(err.response?.data?.message || "Failed to update payroll status");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const totalGross = payroll.reduce((sum, item) => sum + Number(item.grossSalary || 0), 0);
  const totalNet = payroll.reduce((sum, item) => sum + Number(item.netSalary || 0), 0);

  const headerText = location.pathname.startsWith("/superadmin") ? "Payroll Summary" : "Payroll";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner label="Loading payroll data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{headerText}</h1>
            <p className="text-gray-500 mt-1">
              {currentMonth} {currentYear} payroll overview
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchPayroll}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-md bg-red-100 text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <p className="text-sm text-gray-500">Employees</p>
            <p className="text-2xl font-bold text-gray-800">{payroll.length}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <p className="text-sm text-gray-500">Gross Salary</p>
            <p className="text-2xl font-bold text-green-600">PKR {totalGross.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <p className="text-sm text-gray-500">Net Salary</p>
            <p className="text-2xl font-bold text-blue-600">PKR {totalNet.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="grid grid-cols-7 gap-4 bg-gray-800 text-white px-6 py-4 font-semibold">
            <div>Name</div>
            <div>Department</div>
            <div>Salary</div>
            <div>Allowance</div>
            <div>Deduction</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {payroll.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No payroll records found.</div>
          ) : (
            payroll.map((person) => (
              <div
                key={person._id}
                className="grid grid-cols-7 gap-4 items-center px-6 py-4 border-b hover:bg-gray-50"
              >
                <div className="font-semibold text-gray-800">{person.name}</div>
                <div className="text-gray-600">{person.department || "N/A"}</div>
                <div className="text-gray-600">PKR {Number(person.salary || 0).toLocaleString()}</div>
                <div className="text-green-600">PKR {Number(person.allowance || 0).toLocaleString()}</div>
                <div className="text-red-600">PKR {Number(person.deduction || 0).toLocaleString()}</div>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    {person.paymentStatus || "Pending"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(person.payrollId || person._id, "Approved")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-xs"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(person.payrollId || person._id, "Paid")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs"
                  >
                    Paid
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Payroll;
