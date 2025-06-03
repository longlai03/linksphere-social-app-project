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

export const getUser = createAsyncThunk(
    "auth/getUser",
    async (token: any, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/api/user', { headers: { Authorization: `Bearer ${token}` } });
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