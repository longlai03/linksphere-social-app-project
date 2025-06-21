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

export const getNotifications = createAsyncThunk(
    "notification/getNotifications",
    async (_, { rejectWithValue }) => {
        try {
            console.log('Fetching notifications...');
            const response = await axiosInstance.get('/api/notifications');
            console.log('Notifications response:', response.data);
            return response.data.data;
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
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
            return rejectWithValue(handleApiError(error));
        }
    }
); 