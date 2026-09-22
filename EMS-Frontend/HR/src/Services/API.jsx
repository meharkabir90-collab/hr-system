import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// ---- Token helpers ----
// Centralizing these here (instead of scattering localStorage calls
// across components) avoids key-name typos and keeps impersonation
// logic in one place.

export const setToken = (token) => {
    localStorage.setItem("token", token);
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const clearToken = () => {
    localStorage.removeItem("token");
};

// Call this right before overwriting "token" with an impersonation token.
// Guards against double-saving if impersonation is somehow triggered twice.
export const startImpersonation = (impersonationToken, employeeName, impersonatedUser = null) => {
    const currentToken = getToken();
    const currentUser = localStorage.getItem("user");
    if (currentToken && !localStorage.getItem("superAdminToken")) {
        localStorage.setItem("superAdminToken", currentToken);
        if (currentUser) {
            localStorage.setItem("superAdminUser", currentUser);
        }
    }
    setToken(impersonationToken);
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
        setToken(originalToken);
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

// ---- Request interceptor ----
API.interceptors.request.use((config) => {
    const token = config._candidateRequest
        ? localStorage.getItem("candidateToken")
        : getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ---- Response interceptor ----
// If a token becomes invalid/expired mid-impersonation (e.g. the
// short-lived impersonation token times out), fall back to the
// superadmin's real token instead of just logging the user out.
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            if (error?.config?._candidateRequest) {
                localStorage.removeItem("candidateToken");
                localStorage.removeItem("candidate");
                window.location.href = "/candidate-login";
                return Promise.reject(error);
            }

            if (isImpersonating()) {
                exitImpersonation();
                window.location.href = "/admin/dashboard";
            } else {
                clearToken();
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default API;