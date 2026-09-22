import API from "./API";

export const registerCandidate = async (candidateData) => {
  const response = await API.post("/candidate-auth/register", candidateData);
  return response.data;
};

export const loginCandidate = async (candidateData) => {
  const response = await API.post("/candidate-auth/login", candidateData);
  return response.data;
};

export const getMyCandidateApplications = async () => {
  const candidateToken = localStorage.getItem("candidateToken");
  if (!candidateToken) {
    throw new Error("Candidate authentication is required");
  }

  const response = await API.get("/job-application/my-applications", {
    headers: {
      Authorization: `Bearer ${candidateToken}`,
    },
    _candidateRequest: true,
  });
  return response.data;
};