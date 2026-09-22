import API from './API';

export const getPayrollSummary = async (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await API.get(`/payroll/summary${query}`);
    return response.data;
};

export const getMyPayroll = async (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await API.get(`/payroll/me${query}`);
    return response.data;
};

export const generatePayroll = async (payload) => {
    const response = await API.post('/payroll/generate', payload);
    return response.data;
};

export const updatePayrollStatus = async (id, status) => {
    const response = await API.patch(`/payroll/${id}/status`, { status });
    return response.data;
};
