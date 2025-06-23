import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/api";
import { handleApiError, logApiError } from "../../utils/errorHandler";

export const getNotifications = createAsyncThunk(
    "notification/getNotifications",
    async (_, { rejectWithValue }) => {
        try {
            console.log('Fetching notifications...');
            const response = await axiosInstance.get('/api/notifications');
            console.log('Notifications response:', response.data);
            return response.data.data;
        } catch (error: any) {
            logApiError("Notification Get All", error);
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const deleteNotification = createAsyncThunk(
    "notification/deleteNotification",
    async (notificationId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/api/notifications/${notificationId}`);
            return { notificationId, data: response.data };
        } catch (error: any) {
            logApiError("Notification Delete", error, { notificationId });
            return rejectWithValue(handleApiError(error));
        }
    }
); 