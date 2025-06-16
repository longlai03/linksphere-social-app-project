import { configureStore } from '@reduxjs/toolkit'
import type { Reducer } from '@reduxjs/toolkit'

// Lazy load reducers to avoid circular dependency
const authReducer = (await import('./auth')).default as Reducer
const postReducer = (await import('./post')).default as Reducer

export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
    },
})

// Export types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
