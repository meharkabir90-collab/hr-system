import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getEmployeeById } from "../../../Services/employeeService";

function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const employeesPath = location.pathname.startsWith("/superadmin")
    ? "/superadmin/employees"
    : "/hr/employees";

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);

        const data = await getEmployeeById(id);

        setEmployee(data.employee);
      } catch (error) {
        console.error("Get employee error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load employee"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading employee...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>

          <button
            onClick={() => navigate(employeesPath)}
            className="bg-blue-600 text-white px-5 py-2 rounded-md"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Employee not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Details
          </h1>

          <p className="text-gray-500 mt-1">
            Complete employee information
          </p>
        </div>

        <button
          onClick={() => navigate(employeesPath)}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          Back
        </button>

      </div>

      {/* Employee Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">

        {/* Profile Header */}
        <div className="flex items-center gap-5 border-b pb-6">

          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-600">
              {employee.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {employee.name}
            </h2>

            <p className="text-gray-500">
              {employee.position}
            </p>

            <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
              Active
            </span>
          </div>

        </div>

        {/* Personal Information */}
        <div className="mt-6">

          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <InfoItem
              label="Full Name"
              value={employee.name}
            />

            <InfoItem
              label="Email"
              value={employee.email}
            />

            <InfoItem
              label="Phone"
              value={employee.phone}
            />
            <InfoItem
              label="role"
              value={employee?.user?.role}
            />


          </div>

        </div>

        {/* Employment Information */}
        <div className="mt-8">

          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Employment Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <InfoItem
              label="Department"
              value={employee.department?.name || "N/A"}
            />

             <InfoItem
              label="Position"
              value={employee.position}
            />

            <InfoItem
              label="Salary"
              value={
                employee.salary
                  ? `PKR ${employee.salary.toLocaleString()}`
                  : "N/A"
              }
            />

            <InfoItem
              label="Employee ID"
              value={employee._id}
            />

            <InfoItem
              label="Created"
              value={
                employee.createdAt
                  ? new Date(employee.createdAt).toLocaleDateString()
                  : "N/A"
              }
            />

            
           

          </div>

        </div>

        {/* User Account Information */}
        <div className="mt-8">

  <h3 className="text-xl font-semibold text-gray-800 mb-4">
    Account Information
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

    <InfoItem
      label="Username"
      value={employee.user?.username || "N/A"}
    />

    <InfoItem
      label="Account Name"
      value={employee.user?.name || "N/A"}
    />

    <InfoItem
      label="Account Email"
      value={employee.user?.email || "N/A"}
    />

    <InfoItem
      label="Account Role"
      value={employee.user?.role || "Employee"}
    />

    <InfoItem
      label="User ID"
      value={employee.user?._id || employee.user || "N/A"}
    />

  </div>

</div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t flex gap-3">

          <button
            onClick={() => navigate(`${employeesPath.replace("employees", "employee")}/${employee._id}/edit`)}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Employee
          </button>

          <button
            onClick={() => navigate(employeesPath)}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Back to List
          </button>

        </div>

      </div>
    </div>
  );
}


// Reusable information component
function InfoItem({ label, value }) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <p className="text-sm text-gray-500 mb-1">
        {label}
      </p>

      <p className="font-medium text-gray-800 break-words">
        {value || "N/A"}
      </p>
    </div>
  );
}

export default EmployeeDetails;

