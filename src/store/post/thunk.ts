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
            return res.data;
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
    "Post/deletePost",
    async (postId: number, { rejectWithValue }) => {
        try {
            if (!tokenService.hasValidToken()) {
                throw new Error('No token available');
            }
            const response = await axiosInstance.delete(`/api/post/${postId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to delete post");
        }
    }
);

export const updatePost = createAsyncThunk(
    "post/updatePost",
    async ({ postId, postData }: { postId: number, postData: any }, { rejectWithValue }) => {
        try {
            if (!tokenService.hasValidToken()) {
                throw new Error('No token available');
            }
            const res = await axiosInstance.put(`/api/post/${postId}`, postData);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);


