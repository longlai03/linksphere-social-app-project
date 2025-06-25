import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import postReducer from './post';
import userReducer from './user';
import notificationReducer from './notification';
import messageReducer from './message';

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
