import axios from 'axios';
import { tokenService } from './tokenService';

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
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
