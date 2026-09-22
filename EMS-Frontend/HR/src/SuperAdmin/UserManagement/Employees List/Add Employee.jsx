import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { employee } from "../../../Services/employeeService";
import API from "../../../Services/API";

function AddEmployee() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "employee",
    position: "",
    salary: "",
    department: "",
  });

  // Get departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await API.get("/department");

        setDepartments(response.data.departments || []);
      } catch (error) {
        console.error("Get departments error:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const employeesPath = location.pathname.startsWith("/superadmin")
    ? "/superadmin/employees"
    : "/hr/employees";

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await employee(formData);

      alert(data.message || "Employee created successfully");

      navigate(employeesPath);
    } catch (error) {
      console.error("Create employee error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create employee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">

        <button
          onClick={() => navigate(employeesPath)}
          className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          Add Employee
        </h1>

        <p className="text-gray-500 mt-1">
          Create an employee account and employment information
        </p>

      </div>

      {/* Form Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ================================================= */}
          {/* ACCOUNT INFORMATION */}
          {/* ================================================= */}

          <div>

            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              Account Information
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Login credentials used to access the employee portal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Username */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Employee username"
                  className="w-full border border-gray-300 rounded-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* Account Email */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="employee@example.com"
                  className="w-full border border-gray-300 rounded-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* Password */}
              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temporary Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Set employee password"
                    className="w-full border border-gray-300 rounded-md p-3 pr-20 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

                <p className="text-sm text-gray-500 mt-1">
                  HR can set a temporary password for the employee.
                </p>

              </div>

            </div>

            <p className="text-sm text-gray-500 mt-3">
              The employee can use these credentials to access the
              employee portal.
            </p>

          </div>


          {/* ================================================= */}
          {/* EMPLOYEE INFORMATION */}
          {/* ================================================= */}

          <div>

            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              Employee Information
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Personal and employment information of the employee.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Full Name */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full border border-gray-300 rounded-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>


              {/* Phone */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XXXXXXXXX"
                  className="w-full border border-gray-300 rounded-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>


              {/* Role */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  System Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >

                  <option value="employee">
                    Employee
                  </option>

                  <option value="manager">
                    Manager
                  </option>

                </select>

                <p className="text-xs text-gray-500 mt-1">
                  Determines the employee's system access.
                </p>

              </div>


              {/* Position */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>

                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full border border-gray-300 rounded-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <p className="text-xs text-gray-500 mt-1">
                  Enter the employee's specific job title.
                </p>

              </div>


              {/* Salary */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>

                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="80000"
                  min="0"
                  className="w-full border border-gray-300 rounded-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>


              {/* Department */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >

                  <option value="">
                    Select Department
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department._id}
                      value={department._id}
                    >
                      {department.name}
                    </option>
                  ))}

                </select>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* ROLE INFORMATION */}
          {/* ================================================= */}

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">

            <h3 className="font-semibold text-blue-800 mb-2">
              Role & Position
            </h3>

            <div className="text-sm text-blue-700 space-y-1">

              <p>
                <strong>Role:</strong> Controls system permissions
                and portal access.
              </p>

              <p>
                <strong>Position:</strong> Represents the employee's
                specific job title.
              </p>

              <p className="pt-1">
                Example:{" "}
                <strong>
                  Manager → Senior Software Engineering Manager
                </strong>
              </p>

            </div>

          </div>


          {/* ================================================= */}
          {/* BUTTONS */}
          {/* ================================================= */}

          <div className="pt-6 border-t flex gap-3">

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading
                ? "Creating Employee..."
                : "Create Employee"}
            </button>

            <button
              type="button"
              onClick={() => navigate(employeesPath)}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddEmployee;



