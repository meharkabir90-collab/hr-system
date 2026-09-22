import API from './API';

export const createJob = async (jobData) => {
    const response = await API.post('/job/', jobData);
    return response.data;
};

export const getJobs = async (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value);
        }
    });

    const response = await API.get(`/job/?${params.toString()}`);
    return response.data;
};

export const getJobById = async (id) => {
    const response = await API.get(`/job/${id}`);
    return response.data;
};

export const updateJob = async (id, jobData) => {
    const response = await API.put(`/job/${id}`, jobData);
    return response.data;
};

export const closeJob = async (id) => {
    const response = await API.patch(`/job/${id}/close`);
    return response.data;
};

export const deleteJob = async (id) => {
    const response = await API.delete(`/job/${id}`);
    return response.data;
};
