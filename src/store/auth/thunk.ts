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

export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async ({ userId, userData, token }: { userId: number, userData: any, token: string }, { rejectWithValue }) => {
        try {
            console.log(userData);
            const formData = new FormData();
            // Append the user data fields
            formData.append('nickname', userData.nickname);
            formData.append('address', userData.address);
            formData.append('bio', userData.bio);
            formData.append('gender', userData.gender);
            formData.append('birthday', userData.birthday);
            formData.append('hobbies', userData.hobbies);

            // Append the avatar file if available
            if (userData.avatar_url) {
                formData.append('avatar_url', userData.avatar_url[0]); // Append the file
            }

            // Log the form data for debugging (you may want to check its contents)
            console.log(formData);
            const res = await axiosInstance.post(
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