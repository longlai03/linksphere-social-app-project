import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@services/api";
import { handleApiError, logApiError } from "@utils/errorHandler";

// Theo dõi người dùng
export const followUser = createAsyncThunk(
    "user/follow",
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/user/${userId}/follow`);
            return response.data;
        } catch (error: any) {
            logApiError("User Follow", error, { userId });
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Hủy theo dõi người dùng
export const unfollowUser = createAsyncThunk(
    "user/unfollow",
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/user/${userId}/unfollow`);
            return response.data;
        } catch (error: any) {
            logApiError("User Unfollow", error, { userId });
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Chấp nhận yêu cầu theo dõi người dùng
export const acceptFollowRequest = createAsyncThunk(
    "user/acceptFollow",
    async ({ followerId, notificationId }: { followerId: number; notificationId?: number }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.post('/api/accept-follow', { follower_id: followerId });
            if (notificationId) {
                const { deleteNotification } = await import('../notification/thunk');
                dispatch(deleteNotification(notificationId));
            }

            return response.data;
        } catch (error: any) {
            logApiError("User Accept Follow", error, { followerId, notificationId });
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Từ chối yêu cầu theo dõi người dùng
export const declineFollowRequest = createAsyncThunk(
    "user/declineFollow",
    async ({ followerId, notificationId }: { followerId: number; notificationId?: number }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.post('/api/decline-follow', { follower_id: followerId });
            if (notificationId) {
                const { deleteNotification } = await import('../notification/thunk');
                dispatch(deleteNotification(notificationId));
            }

            return response.data;
        } catch (error: any) {
            logApiError("User Decline Follow", error, { followerId, notificationId });
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Lấy danh sách người theo dõi
export const getFollowers = createAsyncThunk(
    "user/getFollowers",
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/users/${userId}/followers`);
            return response.data.data;
        } catch (error: any) {
            logApiError("User Get Followers", error, { userId });
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Lấy danh sách người đang theo dõi
export const getFollowing = createAsyncThunk(
    "user/getFollowing",
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/users/${userId}/following`);
            return response.data.data;
        } catch (error: any) {
            logApiError("User Get Following", error, { userId });
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Lấy danh sách yêu cầu theo dõi
export const getPendingFollowRequests = createAsyncThunk(
    "user/getPendingRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/pending-follow-requests');
            return response.data.pending_requests;
        } catch (error: any) {
            logApiError("User Get Pending Requests", error);
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Lấy người dùng theo ID
export const getUserById = createAsyncThunk(
    "user/getUserById",
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/users/${userId}`);
            return response.data.data;
        } catch (error: any) {
            logApiError("User Get By ID", error, { userId });
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Lấy danh sách người dùng có tham số
export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (searchQuery: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/users', {
                params: { search: searchQuery }
            });
            return response.data.data;
        } catch (error: any) {
            logApiError("User Get All", error, { searchQuery });
            return rejectWithValue(handleApiError(error));
        }
    }
);

//Lấy danh sách gợi ý theo dõi
export const getUserSuggestion = createAsyncThunk(
    "user/getUserSuggestion",
    async (_: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/users/suggestions');
            return response.data.data;
        } catch (error: any) {
            logApiError("User Get All", error);
            return rejectWithValue(handleApiError(error));
        }
    }
)

// Lấy trạng thái theo dõi
export const getFollowStatus = createAsyncThunk(
    "user/getFollowStatus",
    async (targetUserId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/users/${targetUserId}/follow-status`);
            return { targetUserId, status: response.data.data };
        } catch (error: any) {
            logApiError("User Get Follow Status", error, { targetUserId });
            return rejectWithValue(handleApiError(error));
        }
    }
);

