import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/api";
import { tokenService } from "../../services/tokenService";

export const createPost = createAsyncThunk(
    "post/createPost",
    async (postData: any, { rejectWithValue }) => {
        try {
            if (!tokenService.hasValidToken()) {
                throw new Error('No token available');
            }
            const res = await axiosInstance.post('/api/post', postData);
            return res.data; // <-- trả về object post, không phải { posts: ... }
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const getAllPostsByUser = createAsyncThunk(
    "post/getAllPostsByUser",
    async (userId: any, { rejectWithValue }) => {
        try {
            if (!tokenService.hasValidToken()) {
                throw new Error('No token available');
            }
            const res = await axiosInstance.get(`/api/user/${userId}/post`);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const getSpecificPost = createAsyncThunk(
    "post/getSpecificPost",
    async (postId: any, { rejectWithValue }) => {
        try {
            if (!tokenService.hasValidToken()) {
                throw new Error('No token available');
            }
            const res = await axiosInstance.get(`/api/post/${postId}`);
            return {
                post: res.data.post,
            };
        } catch (error: any) {
            console.log("Error get all data post: ", error);
            return rejectWithValue(error.response?.data);
        }
    }
);

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (postId: any, { rejectWithValue }) => {
        try {
            if (!tokenService.hasValidToken()) {
                throw new Error('No token available');
            }
            const res = await axiosInstance.delete(`/api/post/${postId}`);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);
