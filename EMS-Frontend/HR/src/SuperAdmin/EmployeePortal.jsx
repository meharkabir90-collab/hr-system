import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { startImpersonation, exitImpersonation, isImpersonating, startEmployeeView, 
  getEmployeePortalUsers
} from "../Services/superAdminService";



const EmployeePortal = () => {
  const [employees, setEmployees] = useState([]);
   const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getEmployeePortalUsers();

        if (data?.success) {
          setEmployees(data.employees || []);
        }
      } catch (error) {
        console.error("Failed to load employees:", error);
      }
    };

    loadEmployees();
  }, []);

  const handleEmployeeClick = async (employee) => {
    setError("");
    try {
      setLoadingId(employee._id);

      const res = await startEmployeeView(employee._id);

      if (res?.success) {
        startImpersonation(res.token, employee?.user?.name || employee?.name, {
          id: employee?.user?._id || employee?._id,
          name: employee?.user?.name || employee?.name,
          email: employee?.user?.email || employee?.email,
          role: "Employee",
        });
        navigate("/employee/dashboard");
      } else {
        setError("Could not open this employee's portal. Please try again.");
      }
    } catch (error) {
      console.error("Failed to open employee portal:", error);
      setError("Could not open this employee's portal. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleLogout = () => {
  if (isImpersonating()) {
    // Restore original SuperAdmin token
    exitImpersonation();

    // Reload app so ProtectedRoute reads SuperAdmin token
    window.location.href = "/superadmin/dashboard";

    return;
  }

  // Normal employee logout
  localStorage.removeItem("token");
  window.location.href = "/login";
};

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mb-8 flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold text-slate-800">
              Employee Portal
           </h1>

           <p className="mt-1 text-sm text-slate-500">
               Select an employee to access their portal.
           </p>
         </div>

  <button
    onClick={handleLogout}
    className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
  >
    Logout
  </button>
</div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Employees
          </h2>

          <p className="text-sm text-slate-500">
            {employees.length} employees available
          </p>
        </div>

        {employees.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {employees.map((employee) => (
              <button
                key={employee._id}
                onClick={() => handleEmployeeClick(employee)}
                 disabled={loadingId === employee._id}
                type="button"
                className="rounded-xl border border-sky-200 bg-sky-50 p-5 text-left transition hover:bg-sky-100"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-2xl">
                  👤
                </div>

                <h3 className="font-semibold text-slate-800">
                  {employee.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {employee.email}
                </p>

                <p className="mt-3 text-xs font-medium text-sky-600">
                  {loadingId === employee._id
                   ? "Opening Employee Portal..."
                  : "Open Employee Portal →"}
                </p>
              </button>
            ))}

          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No employees found.
          </p>
        )}

      </div>
    </div>
  );
};

export default EmployeePortal;

