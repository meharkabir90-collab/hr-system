import API from "./API";

// =====================================================
// Employee / Manager
// Apply for leave
// =====================================================

export const applyLeave = async (leaveData) => {
  const response = await API.post("/leave/apply", leaveData);
  return response.data;
};


// =====================================================
// Employee / Manager
// Get my leaves
// =====================================================

export const getMyLeaves = async () => {
  const response = await API.get("/leave/my");
  return response.data;
};


// =====================================================
// Manager / HR
// Get pending leaves
// =====================================================

export const getPendingLeaves = async () => {
  const response = await API.get("/leave/pending");
  return response.data;
};


// =====================================================
// Manager / HR
// Approve leave
// =====================================================

export const approveLeave = async (leaveId) => {
  const response = await API.patch(
    `/leave/${leaveId}/approve`
  );

  return response.data;
};


// =====================================================
// Manager / HR
// Reject leave
// =====================================================

export const rejectLeave = async (leaveId, rejectionReason) => {
  const response = await API.patch(
    `/leave/${leaveId}/reject`,
    {
      rejectionReason
    }
  );

  return response.data;
};

export const getApprovedLeaves = async () => {
   const response = await API.get(
    "/leave/approved"); 
    return response.data; 
};


export const getRejectedLeaves = async () => {
   const response = await API.get(
    "/leave/rejected"); 
return response.data; 
};

