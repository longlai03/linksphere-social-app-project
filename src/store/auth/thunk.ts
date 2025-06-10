import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/api";

export const userRegister = createAsyncThunk(
    "auth/userRegister",
    async (user: any, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/register', user);
            return {
                user: res.data.user,
                token: res.data.token,
            };;
        } catch (error: any) {
            console.log("Error get data register: ", error);
            return rejectWithValue(error.response?.data);
        }
    }
)

export const userLogin = createAsyncThunk(
    "auth/userLogin",
    async (user: any, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/login', user);
            return {
                user: res.data.user,
                token: res.data.token,
            };
        } catch (error: any) {
            console.log("Error get data login: ", error);
            return rejectWithValue(error.response?.data);
        }
    }
)

export const userLogout = createAsyncThunk(
    "auth/userLogout",
    async (token: any, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/logout', { headers: { Authorization: `Bearer ${token}` } });
            return {
                user: res.data.user,
                token: res.data.token,
            };
        } catch (error: any) {
            console.log("Error get data login: ", error);
            return rejectWithValue(error.response?.data);
        }
    }
)

export const getLoginUserInformation = createAsyncThunk(
    "auth/getLoginUserInformation",
    async (token: any, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/api/user/me', { headers: { Authorization: `Bearer ${token}` } });
            return {
                user: res.data.user,
                token: res.data.token,
            };
        } catch (error: any) {
            console.log("Error get data login: ", error);
            return rejectWithValue(error.response?.data);
        }
    }
)

export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async ({ userId, userData, token }: { userId: number, userData: any, token: string }, { rejectWithValue }) => {
        try {
            console.log(userData);
            const res = await axiosInstance.put(
                `/api/user/${userId}`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return {
                user: res.data.user,
            };
        } catch (error: any) {
            console.log("Error updating user: ", error);
            return rejectWithValue(error.response?.data);
        }
    }
);