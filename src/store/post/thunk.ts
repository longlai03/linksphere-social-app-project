import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/api";
import { tokenService } from "../../services/tokenService";
import { handleApiError, logApiError } from "../../utils/errorHandler";

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
            logApiError("Post Create", error, { postData: { caption: postData.caption, privacy: postData.privacy } });
            return rejectWithValue(handleApiError(error));
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
            logApiError("Post Get All By User", error, { userId });
            return rejectWithValue(handleApiError(error));
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
            logApiError("Post Get Specific", error, { postId });
            return rejectWithValue(handleApiError(error));
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
            logApiError("Post Delete", error, { postId });
            return rejectWithValue(handleApiError(error));
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
            logApiError("Post Update", error, { postId, postData: { caption: postData.caption, privacy: postData.privacy } });
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const getFeedPosts = createAsyncThunk(
    "post/getFeedPosts",
    async (page: number = 1, { rejectWithValue }) => {
        try {
            if (!tokenService.hasValidToken()) {
                throw new Error('No token available');
            }
            const res = await axiosInstance.get(`/api/posts/feed?page=${page}`);
            console.log(res.data);
            return res.data;
        } catch (error: any) {
            logApiError("Post Get Feed", error, { page });
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const likePost = createAsyncThunk(
    "post/likePost",
    async (postId: number, { rejectWithValue }) => {
        try {
            if (!tokenService.hasValidToken()) {
                throw new Error('No token available');
            }
            const res = await axiosInstance.post(`/api/post/${postId}/like`);
            return { postId, ...res.data };
        } catch (error: any) {
            logApiError("Post Like", error, { postId });
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const unlikePost = createAsyncThunk(
    "post/unlikePost",
    async (postId: number, { rejectWithValue }) => {
        try {
            if (!tokenService.hasValidToken()) {
                throw new Error('No token available');
            }
            const res = await axiosInstance.delete(`/api/post/${postId}/like`);
            return { postId, ...res.data };
        } catch (error: any) {
            logApiError("Post Unlike", error, { postId });
            return rejectWithValue(handleApiError(error));
        }
    }
);


