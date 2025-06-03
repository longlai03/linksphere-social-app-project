import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth'

export const store = configureStore({
    reducer: {
        auth: authSlice,
    },
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
