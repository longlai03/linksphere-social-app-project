import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@store/auth';
import postReducer from '@store/post';
import userReducer from '@store/user';
import notificationReducer from '@store/notification';
import messageReducer from '@store/message';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
        user: userReducer,
        notification: notificationReducer,
        message: messageReducer,
    },
})

// Export types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
