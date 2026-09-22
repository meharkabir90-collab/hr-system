import { Navigate, Outlet } from "react-router-dom";

function CandidateProtectedRoute() {
  const candidateToken = localStorage.getItem("candidateToken");
  const candidate = JSON.parse(localStorage.getItem("candidate") || "null");

  if (!candidateToken || !candidate) {
    return <Navigate to="/candidate-login" replace />;
  }

  return <Outlet />;
}

export default CandidateProtectedRoute;
