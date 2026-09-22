import API from './API';

export const employee = async(employeeData) => {
    const response =  await API.post("/employee", employeeData);
    return response.data;

};

export const getEmployee = async() => {
    const response =  await API.get("/employee");
    return response.data;
};

export const getEmployeeById = async(id) => {
    const response =  await API.get(`/employee/${id}`);
    return response.data;
};

export const updateEmployee = async(id, employeeData) => {
    const response =  await API.put(`/employee/${id}`, employeeData);
    return response.data;
};

export const deleteEmployee = async(id) => {
    const response =  await API.delete(`/employee/${id}`);
    return response.data;
};

export const getManagerDashboard = async() => {
    const response =  await API.get("/employee/manager/dashboard");
    return response.data;
};