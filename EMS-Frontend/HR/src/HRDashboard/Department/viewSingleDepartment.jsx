import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getDepartmentById } from "../../Services/departmentService";
import { getEmployee } from "../../Services/employeeService";
import { assignDepartmentManager } from '../../Services/departmentService'
import LoadingSpinner from "../../Components/LoadingSpinner";

function SingleDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const departmentsPath = location.pathname.startsWith("/superadmin")
    ? "/superadmin/departments"
    : "/hr/departments";

  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const departmentData = await getDepartmentById(id);
      const employeeData = await getEmployee();

      setDepartment(departmentData.department);
      setEmployees(employeeData.employees || []);

    } catch (error) {
      console.error("Get department details error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load department"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner label="Loading department..." />
      </div>
    );
  }

  const handleSetManager = async (employeeId) => {
  try {
    await assignDepartmentManager(id, employeeId);

    alert("Manager assigned successfully");

    fetchData();
  } catch (error) {
    console.error("Assign manager error:", error);

    alert(
      error.response?.data?.message ||
        "Failed to assign manager"
    );
  }
};

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">

          <button
            onClick={() => navigate(departmentsPath)}
            className="mb-5 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            ← Back
          </button>
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            {error}
          </div>

        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Department not found.
        </p>
      </div>
    );
  }

  // Only employees belonging to this department
  const departmentEmployees = employees.filter(
    (employee) =>
      employee.department?._id === department._id ||
      employee.department === department._id
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">

        <button
            onClick={() => navigate(departmentsPath)}
          className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          Department Details
        </h1>

        <p className="text-gray-500 mt-1">
          View department information and employees
        </p>

      </div>

      {/* Department Information */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Name */}
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Department Name
            </p>

            <p className="text-xl font-semibold text-gray-800">
              {department.name}
            </p>
          </div>

          {/* Manager */}
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Manager
            </p>

            <p className="text-lg font-medium text-gray-800">
              {department.manager?.name || "Not Assigned"}
            </p>
          </div>

          {/* Employee Count */}
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Employees
            </p>

            <p className="text-xl font-semibold text-gray-800">
              {departmentEmployees.length}
            </p>
          </div>

          {/* Description */}
          <div className="md:col-span-3">
            <p className="text-sm text-gray-500 mb-1">
              Description
            </p>

            <p className="text-gray-700">
              {department.description || "No description available"}
            </p>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">

          <button
            onClick={() =>
              navigate(`${departmentsPath}/${department._id}/edit`)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
          >
            Edit Department
          </button>
          <button
            onClick={() => navigate(departmentsPath)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md"
          >
            Back to Departments
          </button>

        </div>

      </div>

      {/* Employees */}
      <div className="max-w-6xl mx-auto mt-6 bg-white rounded-xl shadow-md overflow-hidden">

        <div className="px-6 py-4 bg-gray-800 text-white">
          <h2 className="text-xl font-semibold">
            Department Employees
          </h2>
        </div>

        {departmentEmployees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No employees assigned to this department.
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-100 font-semibold text-gray-700">
              <div>Name</div>
              <div>Email</div>
              <div>Position</div>
              <div>Action</div>
            </div>

            {/* Employees */}
             {departmentEmployees.map((employee) => (
  <div
    key={employee._id}
    className="grid grid-cols-5 gap-4 items-center px-6 py-4 border-t"
  >

    <div className="font-medium text-gray-800">
      {employee.name}
    </div>

    <div className="text-gray-600">
      {employee.email}
    </div>

    <div className="text-gray-600">
      {employee.position || "N/A"}
    </div>

    <div className="text-gray-600">
      {department.manager?._id === employee._id
        ? "Manager"
        : ""}
    </div>

    <div>
      <button
        onClick={() => handleSetManager(employee._id)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
      >
        Set as Manager
      </button>
    </div>

  </div>
))}
          </>
        )}

      </div>

    </div>
  );
}

export default SingleDepartment;