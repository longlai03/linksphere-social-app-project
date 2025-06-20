import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "../../context/interface";
import { setPendingStatus, setRejectStatus } from "../auth/utlis";
import {
    followUser,
    unfollowUser,
    acceptFollowRequest,
    declineFollowRequest,
    getFollowers,
    getFollowing,
    getPendingFollowRequests,
    getUserById,
    getAllUsers,
} from "./thunk";

const initialState: UserState = {
    followers: [],
    following: [],
    pendingRequests: [],
    searchUsers: [],
    searchParams:{
        query: "",
    },
    loading: false,
    error: null,
    selectedUser: null
};

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
        resetUserState: (state) => {
            Object.assign(state, initialState);
        }
    },
    extraReducers: (builder) => {
        builder
            // Follow user
            .addCase(followUser.pending, setPendingStatus)
            .addCase(followUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(followUser.rejected, setRejectStatus)

            // Unfollow user
            .addCase(unfollowUser.pending, setPendingStatus)
            .addCase(unfollowUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(unfollowUser.rejected, setRejectStatus)

            // Accept follow request
            .addCase(acceptFollowRequest.pending, setPendingStatus)
            .addCase(acceptFollowRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.pendingRequests = state.pendingRequests.filter(
                    request => request.id !== action.meta.arg
                );
                // Optionally update followers list if needed
            })
            .addCase(acceptFollowRequest.rejected, setRejectStatus)

            // Decline follow request
            .addCase(declineFollowRequest.pending, setPendingStatus)
            .addCase(declineFollowRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.pendingRequests = state.pendingRequests.filter(
                    request => request.id !== action.meta.arg
                );
            })
            .addCase(declineFollowRequest.rejected, setRejectStatus)

            // Get followers
            .addCase(getFollowers.pending, setPendingStatus)
            .addCase(getFollowers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.followers = action.payload;
            })
            .addCase(getFollowers.rejected, setRejectStatus)

            // Get following
            .addCase(getFollowing.pending, setPendingStatus)
            .addCase(getFollowing.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.following = action.payload;
            })
            .addCase(getFollowing.rejected, setRejectStatus)

            // Get pending requests
            .addCase(getPendingFollowRequests.pending, setPendingStatus)
            .addCase(getPendingFollowRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.pendingRequests = action.payload;
            })
            .addCase(getPendingFollowRequests.rejected, setRejectStatus)

            // Get user by ID
            .addCase(getUserById.pending, setPendingStatus)
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.selectedUser = action.payload;
            })
            .addCase(getUserById.rejected, setRejectStatus)

            // Get all users
            .addCase(getAllUsers.pending, setPendingStatus)
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.searchUsers = action.payload;
            })
            .addCase(getAllUsers.rejected, setRejectStatus)
    }
});

export const {
    clearUserError,
    resetUserState
} = UserSlice.actions;

export * from './thunk';

export default UserSlice.reducer;
