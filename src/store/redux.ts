import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth'
import postSlice from './post'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        post: postSlice,
    },
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
