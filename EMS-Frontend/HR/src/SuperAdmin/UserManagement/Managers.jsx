import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getEmployee } from "../../Services/employeeService";
import LoadingSpinner from "../../Components/LoadingSpinner";

function Managers() {
  const navigate = useNavigate();
  const location = useLocation();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const data = await getEmployee();
        const employeeProfiles = data.employees || [];

        setManagers(
          employeeProfiles.filter(
            (employee) => employee.user?.role === "Manager"
          )
        );
      } catch (requestError) {
        console.error("Get managers error:", requestError);
        setError(
          requestError.response?.data?.message || "Failed to load managers"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  const handleViewManager = (id) => {
    if (location.pathname.startsWith("/superadmin")) {
      navigate(`/superadmin/employee/${id}`);
    } else {
      navigate(`/hr/employee/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner label="Loading managers..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto mb-6 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800">Managers</h1>
        <p className="mt-1 text-gray-500">Manage managers from employee profiles</p>
      </div>

      {error && (
        <div className="mx-auto mb-5 max-w-6xl rounded-md bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {!error && managers.length === 0 && (
        <div className="mx-auto max-w-6xl rounded-xl bg-white p-10 text-center shadow">
          <p className="text-gray-500">No managers found.</p>
        </div>
      )}

      {managers.length > 0 && (
        <div className="mx-auto max-w-6xl overflow-hidden rounded-xl bg-white shadow">
          <div className="grid grid-cols-6 gap-4 bg-gray-800 px-6 py-4 font-semibold text-white">
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Position</div>
            <div>Department</div>
            <div>Action</div>
          </div>

          {managers.map((manager) => (
            <div
              key={manager._id}
              className="grid grid-cols-6 items-center gap-4 border-b px-6 py-5 hover:bg-gray-50"
            >
              <div className="font-semibold text-gray-800">
                {manager.user?.name || manager.name}
              </div>
              <div className="break-words text-gray-600">
                {manager.user?.email || manager.email}
              </div>
              <div className="text-gray-600">{manager.phone}</div>
              <div className="text-gray-600">{manager.position}</div>
              <div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  {manager.department?.name || "N/A"}
                </span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleViewManager(manager._id)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Managers;
