import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myProfile } from "../Services/myProfile";
import LoadingSpinner from "../Components/LoadingSpinner";

function EmployeeDetails() {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const data = await myProfile();

        setEmployee(data.employee);
      } catch (error) {
        console.error("Get profile error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <LoadingSpinner label="Loading your profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full border border-sky-100">

          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-500">!</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Profile
          </h2>

          <p className="text-red-500 mb-6">
            {error}
          </p>

          <button
            onClick={() => navigate("/employee/dashboard")}
            className="px-6 py-2.5 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <p className="text-gray-600">
          Employee profile not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-8"
    >

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">

        <button
          onClick={() => navigate("/employee-dashboard")}
          className="mb-5 inline-flex items-center gap-2 px-4 py-2 bg-white text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-100 hover:border-sky-400 transition-all duration-200"
        >
          &larr; Dashboard
        </button>

        <div>
          <p className="text-sky-400 font-semibold text-sm uppercase tracking-wide">
            Employee Portal
          </p>

          <h1 className="text-4xl font-bold text-gray-800 mt-1"
          style={{ fontFamily: "times-new-roman" }}>
            My Profile
          </h1>

          <p className="text-gray-500 text-lg mt-2"
          style={{ fontFamily: "times-new-roman" }}>
            View your personal and employment information
          </p>
        </div>

      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-sky-100 overflow-hidden">

        {/* Profile Banner */}
        <div className="bg-gradient-to-r from-sky-200 to-sky-400 px-6 md:px-8 py-8">

          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5"
          style={{ fontFamily: "times-new-roman" }}>

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-md border-4 border-white/70">

              <span className="text-4xl font-bold text-sky-400">
                {employee.name?.charAt(0).toUpperCase()}
              </span>

            </div>

            {/* Basic Info */}
            <div className="text-center sm:text-left">

              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {employee.name}
              </h2>

              <p className="text-white/90 mt-1">
                {employee?.user?.role}
              </p>

              <div className="flex justify-center sm:justify-start mt-3">

                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 text-sky-600 rounded-full text-sm font-medium">

                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>

                  Active

                </span>

              </div>

            </div>

          </div>

        </div>

        <div className="p-6 md:p-8">

          {/* Personal Information */}
          <Section
            title="Personal Information"
            description="Your basic personal information"
          >

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
              label="Position"
              value={employee.position}
            />

          </Section>


          {/* Employment Information */}
         
<Section
  title="Employment Information"
  description="Information about your role in the organization"
>
  <InfoItem
    label="Role"
    value={employee.user?.role || "Employee"}
  />

  <InfoItem
    label="Position"
    value={employee.position || "N/A"}
  />

  <InfoItem
    label="Department"
    value={employee.department?.name || "N/A"}
  />

  <InfoItem
    label="Department Manager"
    value={employee.department?.manager?.name || "Not Assigned"}
  />

  <InfoItem
    label="Manager Email"
    value={employee.department?.manager?.email || "N/A"}
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
    label="Joined"
    value={
      employee.createdAt
        ? new Date(employee.createdAt).toLocaleDateString()
        : "N/A"
    }
  />
</Section>


          {/* Account Information */}
          <Section
            title="Account Information"
            description="Your employee portal account"
          >

            <InfoItem
              label="Username"
              value={employee.user?.username}
            />

            <InfoItem
              label="Account Name"
              value={employee.user?.name}
            />

            <InfoItem
              label="Account Email"
              value={employee.user?.email}
            />

            <InfoItem
              label="Account Role"
              value={employee.user?.role || "Employee"}
            />

            <InfoItem
              label="User ID"
              value={employee.user?._id || employee.user}
            />

          </Section>


          {/* Portal Actions */}
          <div className="mt-8 pt-6 border-t border-sky-100">

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                onClick={() => navigate("/my-attendance")}
                className="px-5 py-3 bg-sky-400 text-white rounded-lg font-medium hover:bg-sky-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                View My Attendance
              </button>

              <button
                onClick={() => navigate("/employee-dashboard")}
                className="px-5 py-3 bg-sky-100 text-sky-700 rounded-lg font-medium hover:bg-sky-200 transition-all duration-200"
              >
                Employee Dashboard
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


/* Section Component */
function Section({ title, description, children }) {
  return (
    <div className="mb-10">

      <div className="mb-5">

        <div className="flex items-center gap-3">

          <div className="w-1 h-7 bg-sky-400 rounded-full"></div>

          <h3 className="text-xl font-bold text-gray-800">
            {title}
          </h3>

        </div>

        <p className="text-sm text-gray-500 mt-1 ml-4">
          {description}
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>

    </div>
  );
}


/* Information Item */
function InfoItem({ label, value }) {
  return (
    <div className="group border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-sky-50 hover:border-sky-200 transition-all duration-200">

      <p className="text-sm text-gray-500 mb-1">
        {label}
      </p>

      <p className="font-semibold text-gray-800 break-words group-hover:text-sky-700 transition-colors">
        {value || "N/A"}
      </p>

    </div>
  );
}

export default EmployeeDetails;

