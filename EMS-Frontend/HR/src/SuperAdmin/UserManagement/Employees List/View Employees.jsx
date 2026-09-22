import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteEmployee, getEmployee } from "../../../Services/employeeService";
import LoadingSpinner from "../../../Components/LoadingSpinner";

function Employees() {

  const navigate = useNavigate();
  const location = useLocation();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const data = await getEmployee();

      setEmployees(data.employees || []);
    } catch (error) {
      console.error("Get employees error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner label="Loading employees..." />
      </div>
    );
  }

  
  const handleAddEmployee = () => {
  if (location.pathname.startsWith("/superadmin")) {
    navigate("/superadmin/employee/add");
  } else {
    navigate("/hr/employee/add");
  }
};

const handleViewEmployee = (id) => {
  if (location.pathname.startsWith("/superadmin")) {
    navigate(`/superadmin/employee/${id}`);
  } else {
    navigate(`/hr/employee/${id}`);
  }
};

const handleEditEmployee = (id) => {
  if (location.pathname.startsWith("/superadmin")) {
    navigate(`/superadmin/employee/${id}/edit`);
  } else {
    navigate(`/hr/employee/${id}/edit`);
  }
};

const handleDeleteEmployee = async (id) => {
  if (!window.confirm("Are you sure you want to delete this employee?")) return;

  try {
    await deleteEmployee(id);
    alert("Employee deleted successfully");
    fetchEmployees();
  } catch (error) {
    console.error("Delete employee error:", error);
    alert(error.response?.data?.message || "Failed to delete employee");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Employees
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all employees
          </p>
        </div>

        <button
          onClick={handleAddEmployee}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
        >
          + Add Employee
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="max-w-6xl mx-auto mb-5 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Empty */}
      {!error && employees.length === 0 && (
        <div className="max-w-6xl mx-auto bg-white rounded-xl p-10 text-center shadow">
          <p className="text-gray-500">
            No employees found.
          </p>
        </div>
      )}

      {/* Employee List */}
      {employees.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 bg-gray-800 text-white px-6 py-4 font-semibold">

            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Position</div>
            <div>Department</div>
            <div>Actions</div>
            <div>Action</div>

          </div>

          {/* Employees */}
          {employees.map((employee) => (

            <div
              key={employee._id}
              className="grid grid-cols-7 gap-4 items-center px-6 py-5 border-b hover:bg-gray-50"
            >

              {/* Name */}
              <div className="font-semibold text-gray-800">
                {employee.name}
              </div>

              {/* Email */}
              <div className="text-gray-600 break-words">
                {employee.email}
              </div>

              {/* Phone */}
              <div className="text-gray-600">
                {employee.phone}
              </div>

              {/* Position */}
              <div className="text-gray-600">
                {employee.position}
              </div>

              {/* Department */}
              <div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {employee.department?.name || "N/A"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleEditEmployee(employee._id)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>

              {/* View */}
              <div>
                <button
                  onClick={ () => 
                    navigate(handleViewEmployee(employee._id))
                  }                
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
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

export default Employees;

