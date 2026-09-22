import API from './API'


export const getEmployeePortalUsers = async() => {
    const response = await API.get('/superadmin/portal-users');
    return response.data;
};

export const addHR = async (hrData) => {
    const response = await API.post('/superadmin/hr', hrData);
    return response.data;
};


// Start viewing a specific employee
export const startEmployeeView = async (employeeId) => {
    const response = await API.post(`/employee/view/${employeeId}`);
    console.log("Employee view:", response);   
    return response.data;
};

export const startManagerView = async (managerId) => {
    const response = await API.post(`/employee/manager/view/${managerId}`);
    console.log("Manager view:", response);
    return response.data;
};

export const startHRView = async (hrId) => {
    const response = await API.post(`/employee/hr/view/${hrId}`);
    console.log("HR view:", response);
    return response.data;
};


// ---- Real impersonation (token swap) ----

export const startImpersonation = (impersonationToken, employeeName, impersonatedUser = null) => {
    const currentToken = localStorage.getItem("token");
    const currentUser = localStorage.getItem("user");
    if (currentToken && !localStorage.getItem("superAdminToken")) {
        localStorage.setItem("superAdminToken", currentToken);
        if (currentUser) {
            localStorage.setItem("superAdminUser", currentUser);
        }
    }
    localStorage.setItem("token", impersonationToken);
    localStorage.setItem("isImpersonating", "true");

    if (employeeName) {
        localStorage.setItem("impersonatedUserName", employeeName);
    }

    if (impersonatedUser) {
        localStorage.setItem("user", JSON.stringify(impersonatedUser));
        if (impersonatedUser.role) {
            localStorage.setItem("role", impersonatedUser.role);
        }
    }
};

export const exitImpersonation = () => {
    const originalToken = localStorage.getItem("superAdminToken");
    const originalUser = localStorage.getItem("superAdminUser");
    if (originalToken) {
        localStorage.setItem("token", originalToken);
        localStorage.removeItem("superAdminToken");
    }
    if (originalUser) {
        localStorage.setItem("user", originalUser);
        try {
            const parsedUser = JSON.parse(originalUser);
            if (parsedUser?.role) {
                localStorage.setItem("role", parsedUser.role);
            }
        } catch (error) {
            console.error("Failed to restore SuperAdmin user:", error);
        }
        localStorage.removeItem("superAdminUser");
    }
    localStorage.removeItem("isImpersonating");
    localStorage.removeItem("impersonatedUserName");
};

export const isImpersonating = () => {
    return localStorage.getItem("isImpersonating") === "true";
};

export const getImpersonatedUserName = () => {
    return localStorage.getItem("impersonatedUserName");
};



export const getViewingEmployeeId = () => {
    return localStorage.getItem("viewingEmployeeId");
};

export const getViewingEmployeeName = () => {
    return localStorage.getItem("viewingEmployeeName");
};

export const clearViewingEmployee = () => {
    localStorage.removeItem("viewingEmployeeId");
    localStorage.removeItem("viewingEmployeeName");
};

