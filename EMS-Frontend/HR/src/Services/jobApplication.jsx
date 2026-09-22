import API from './API';

export const submitJobApplication = async (applicationData) => {
    const candidateToken = localStorage.getItem('candidateToken');
    const response = await API.post('/job-application/apply', applicationData, {
        headers: {
            Authorization: `Bearer ${candidateToken}`,
        },
        _candidateRequest: true,
    });
    return response.data;
};

export const getApplicationsByJob = async (jobId) => {
    const response = await API.get(`/job-application/job/${jobId}`);
    return response.data;
};

export const getAllApplications = async () => {
    const response = await API.get('/job-application/all');
    return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
    const response = await API.patch(`/job-application/${applicationId}/status`, { status });
    return response.data;
};
