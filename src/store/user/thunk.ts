import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/api";

const handleApiError = (error: any) => {
    if (error.response) {
        const data = error.response.data;
        if (typeof data === "string") return data;
        if (data?.message) return data.message;
        if (data?.error) return data.error;
        if (data?.errors) {
            if (Array.isArray(data.errors)) return data.errors.join(", ");
            if (typeof data.errors === "object") return Object.values(data.errors).flat().join(", ");
            return String(data.errors);
        }
        return JSON.stringify(data) || 'Server error';
    } else if (error.request) {
        return 'No response from server';
    } else {
        return error.message || 'Unknown error';
    }
};

// Follow a user
export const followUser = createAsyncThunk(
    "user/follow",
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/follow', { followed_id: userId });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Unfollow a user
export const unfollowUser = createAsyncThunk(
    "user/unfollow",
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/unfollow', { followed_id: userId });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Accept follow request
export const acceptFollowRequest = createAsyncThunk(
    "user/acceptFollow",
    async (followerId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/accept-follow', { follower_id: followerId });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Decline follow request
export const declineFollowRequest = createAsyncThunk(
    "user/declineFollow",
    async (followerId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/decline-follow', { follower_id: followerId });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Get user's followers
export const getFollowers = createAsyncThunk(
    "user/getFollowers",
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/followers', { params: { user_id: userId } });
            return response.data.followers;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Get user's following
export const getFollowing = createAsyncThunk(
    "user/getFollowing",
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/following', { params: { user_id: userId } });
            return response.data.following;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Get pending follow requests
export const getPendingFollowRequests = createAsyncThunk(
    "user/getPendingRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/pending-follow-requests');
            return response.data.pending_requests;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Get user by ID
export const getUserById = createAsyncThunk(
    "user/getUserById",
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/users/${userId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Get all users with search
export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (searchQuery: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/users', {
                params: { search: searchQuery }
            });
            return response.data.data.data; // Access the paginated data
        } catch (error: any) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

