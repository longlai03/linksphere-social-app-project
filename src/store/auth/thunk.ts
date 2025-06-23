import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Auth } from "../../context/interface";
import axiosInstance from "../../services/api";
import { tokenService } from "../../services/tokenService";
import { handleApiError, logApiError } from "../../utils/errorHandler";

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
            logApiError("Auth Register", error, { user: { email: user.email, username: user.username } });
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
            logApiError("Auth Login", error, { user: { email: user.email } });
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
            console.log('API response:', res.data);
            if (!res.data?.user) {
                throw new Error('Invalid user info response');
            }
            return {
                user: res.data.user,
            };
        } catch (error: any) {
            logApiError("Auth Get User Info", error);
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
            logApiError("Auth Logout", error);
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
            logApiError("Auth Update User", error, { userId, userData });
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const sendResetCode = createAsyncThunk(
    "auth/sendResetCode",
    async (email: string, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/forgot-password/send-code', { email });
            return res.data;
        } catch (error: any) {
            logApiError("Auth Send Reset Code", error, { email });
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const verifyResetCode = createAsyncThunk(
    "auth/verifyResetCode",
    async ({ email, code }: { email: string; code: string }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/forgot-password/verify-code', { email, code });
            return res.data;
        } catch (error: any) {
            logApiError("Auth Verify Reset Code", error, { email });
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ email, code, password, confirmPassword }: { email: string; code: string; password: string; confirmPassword: string }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/forgot-password/reset', {
                email,
                code,
                password,
                password_confirmation: confirmPassword
            });
            return res.data;
        } catch (error: any) {
            logApiError("Auth Reset Password", error, { email });
            return rejectWithValue(handleApiError(error));
        }
    }
);