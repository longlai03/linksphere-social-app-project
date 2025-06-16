import axios from 'axios';
import { tokenService } from './tokenService';

// Create a callback registry for 401 handlers
let unauthorizedHandlers: (() => void)[] = [];

export const registerUnauthorizedHandler = (handler: () => void) => {
    unauthorizedHandlers.push(handler);
};

export const unregisterUnauthorizedHandler = (handler: () => void) => {
    unauthorizedHandlers = unauthorizedHandlers.filter(h => h !== handler);
};

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const token = tokenService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            tokenService.removeTokens();
            // Call all registered handlers
            unauthorizedHandlers.forEach(handler => handler());
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
