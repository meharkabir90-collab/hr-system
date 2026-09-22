import API from './API';

export const register = async(userData) => {
    const response =  await API.post("/auth/register", userData);
    return response.data;

};

export const login = async(userData) => {
    const response =  await API.post("/auth/login", userData);
    return response.data;
};

export const logout = async (userData) => {
  try {
    const response = await API.post("/auth/logout", userData);
    return response.data;
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
};
