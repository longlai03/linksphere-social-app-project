import axios from 'axios';
import { tokenService } from '@services/tokenService';

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
        const originalRequest = error.config;
        // Không thử refresh nếu lỗi đến từ chính /api/refresh
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/api/refresh')
        ) {
            originalRequest._retry = true;
            try {
                const refreshRes = await axiosInstance.post('/api/refresh', null, {
                    headers: {
                        Authorization: `Bearer ${tokenService.getToken()}`
                    }
                });
                const newToken = refreshRes.data.token;
                if (newToken) {
                    tokenService.setToken(newToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                tokenService.removeTokens();
                unauthorizedHandlers.forEach(handler => handler());
            }
        } else if (error.response?.status === 401) {
            tokenService.removeTokens();
            unauthorizedHandlers.forEach(handler => handler());
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
