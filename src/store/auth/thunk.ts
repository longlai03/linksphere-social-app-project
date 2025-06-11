import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Auth } from "../../context/interface";
import axiosInstance from "../../services/api";
import { tokenService } from "../../services/tokenService";

const handleApiError = (error: any) => {
    if (error.response) {
        // Server responded with error
        return error.response.data?.message || error.response.data || 'Server error';
    } else if (error.request) {
        // Request made but no response
        return 'No response from server';
    } else {
        // Other errors
        return error.message || 'Unknown error';
    }
};

export const userRegister = createAsyncThunk(
    "auth/userRegister",
    async (user: Auth["form"]["register"]["registerForm"], { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/register', user);
            if (!res.data?.user || !res.data?.token) {
                throw new Error('Invalid server response');
            }
            return {
                user: res.data.user,
                token: res.data.token,
            };
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const userLogin = createAsyncThunk(
    "auth/userLogin",
    async (user: Auth["form"]["login"]["loginForm"], { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/login', user);
            if (!res.data?.user || !res.data?.token) {
                throw new Error('Invalid server response');
            }
            return {
                user: res.data.user,
                token: res.data.token,
            };
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const getLoginUserInformation = createAsyncThunk(
    "auth/getLoginUserInformation",
    async (_, { rejectWithValue }) => {
        try {
            const token = tokenService.getToken();
            if (!token) {
                throw new Error('No token available');
            }
            const res = await axiosInstance.get('/api/user/me');
            if (!res.data?.user) {
                throw new Error('Invalid user info response');
            }
            return {
                user: res.data.user,
            };
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const userLogout = createAsyncThunk(
    "auth/userLogout",
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/api/logout');
            return null;
        } catch (error: any) {
            tokenService.removeTokens();
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async ({ userId, userData }: { userId: number, userData: Partial<Auth["user"]> }, { rejectWithValue }) => {
        try {
            const token = tokenService.getToken();
            if (!token) {
                throw new Error('No token available');
            }
            const res = await axiosInstance.put(`/api/user/${userId}`, userData);
            if (!res.data?.user) {
                throw new Error('Invalid update response');
            }
            return {
                user: res.data.user,
            };
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);