import API from './API';


export const myProfile = async() => {
    const response =  await API.get("/employee/me");
    return response.data;
};