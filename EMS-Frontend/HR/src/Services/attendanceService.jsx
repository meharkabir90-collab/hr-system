import API from "./API";

// Employee checks in
export const checkIn = async () => {
    const response = await API.post("/attendance/check-in");
    return response.data;
};

// Employee checks out
export const checkOut = async () => {
    const response = await API.put("/attendance/check-out");
    return response.data;
};

// Employee gets their own attendance
export const getMyAttendance = async () => {
    const response = await API.get("/attendance/my");
    return response.data;
};

//team attendance by manager
export const getTeamAttendance = async () => {
     const response = await API.get("/attendance/team-attendance");
      return response.data; };

// HR gets all attendance
export const getAllAttendance = async () => {
    const response = await API.get("/attendance/all");
    return response.data;
};

// HR updates attendance
export const updateAttendance = async (id, attendanceData) => {
    const response = await API.put(`/attendance/${id}`, attendanceData);
    return response.data;
};