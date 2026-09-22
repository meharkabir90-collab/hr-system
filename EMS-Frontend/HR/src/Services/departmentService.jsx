import API from './API';

export const createDepartment = async(departmentData) => {
    const response =  await API.post("/department/", departmentData);
    return response.data;

};

export const getDepartment = async() => {
  const response =  await API.get("/department/");
    return response.data;
};

export const getDepartmentById = async(id) => {
  const response =  await API.get(`/department/${id}`);
    return response.data;
};

export const assignDepartmentManager = async (
  departmentId,
  employeeId
) => {
  const response = await API.put(
    `/department/${departmentId}/manager`,
    {
      employeeId,
    }
  );

  return response.data;
};

export const updateDepartment = async(id, departmentData) => {
  const response =  await API.put(`/department/${id}`, departmentData);
    return response.data;
};

export const deleteDepartment = async(id) => {
  const response =  await API.delete(`/department/${id}`);
    return response.data;
};