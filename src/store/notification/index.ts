import { createSlice } from "@reduxjs/toolkit";
import type { NotificationState } from "@context/interface";
import { getNotifications, deleteNotification } from "./thunk";

const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null,
};

export const NotificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        clearNotificationError: (state) => {
            state.error = null;
        },
        resetNotificationState: (state) => {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.error = null;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Lỗi tải thông báo";
            })
            .addCase(deleteNotification.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(
                    notification => notification.id !== action.payload.notificationId
                );
                state.error = null;
            })
            .addCase(deleteNotification.rejected, (state, action) => {
                state.error = action.payload as string || "Lỗi xóa thông báo";
            });
    },
});

export const { clearNotificationError, resetNotificationState } = NotificationSlice.actions;
export * from './thunk';
export default NotificationSlice.reducer; 