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
    getFollowStatus,
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
    selectedUser: null,
    followStatus: null,
    // New states for ProfileDetail button management
    profileDetailStates: {
        followLoading: false,
        modalFollowStatuses: {} as Record<number, string>,
        modalFollowLoading: null as number | null,
        followersModalVisible: false,
        followingModalVisible: false,
    },
    loadingStates: {
        getUserById: false,
        getFollowers: false,
        getFollowing: false,
        getFollowStatus: false,
        followUser: false,
        unfollowUser: false,
        acceptFollowRequest: false,
        declineFollowRequest: false,
        getPendingFollowRequests: false,
        getAllUsers: false,
    }
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
        },
        removeNotificationById: (state, action) => {
            // This will be used to remove notifications from the notification store
            // when accepting/declining follow requests
        },
        // New reducers for ProfileDetail state management
        setFollowLoading: (state, action) => {
            state.profileDetailStates.followLoading = action.payload;
        },
        setModalFollowStatus: (state, action) => {
            const { userId, status } = action.payload;
            state.profileDetailStates.modalFollowStatuses[userId] = status;
        },
        setModalFollowStatuses: (state, action) => {
            state.profileDetailStates.modalFollowStatuses = action.payload;
        },
        setModalFollowLoading: (state, action) => {
            state.profileDetailStates.modalFollowLoading = action.payload;
        },
        setFollowersModalVisible: (state, action) => {
            state.profileDetailStates.followersModalVisible = action.payload;
        },
        setFollowingModalVisible: (state, action) => {
            state.profileDetailStates.followingModalVisible = action.payload;
        },
        clearModalFollowStatuses: (state) => {
            state.profileDetailStates.modalFollowStatuses = {};
        },
        clearProfileDetailStates: (state) => {
            state.profileDetailStates = initialState.profileDetailStates;
        }
    },
    extraReducers: (builder) => {
        builder
            // Follow user
            .addCase(followUser.pending, (state) => {
                state.loadingStates.followUser = true;
                state.error = null;
            })
            .addCase(followUser.fulfilled, (state) => {
                state.loadingStates.followUser = false;
                state.error = null;
            })
            .addCase(followUser.rejected, (state, action) => {
                state.loadingStates.followUser = false;
                state.error = action.payload as string || "Lỗi khi theo dõi người dùng";
            })

            // Unfollow user
            .addCase(unfollowUser.pending, (state) => {
                state.loadingStates.unfollowUser = true;
                state.error = null;
            })
            .addCase(unfollowUser.fulfilled, (state) => {
                state.loadingStates.unfollowUser = false;
                state.error = null;
            })
            .addCase(unfollowUser.rejected, (state, action) => {
                state.loadingStates.unfollowUser = false;
                state.error = action.payload as string || "Lỗi khi hủy theo dõi người dùng";
            })

            // Accept follow request
            .addCase(acceptFollowRequest.pending, (state) => {
                state.loadingStates.acceptFollowRequest = true;
                state.error = null;
            })
            .addCase(acceptFollowRequest.fulfilled, (state, action) => {
                state.loadingStates.acceptFollowRequest = false;
                state.error = null;
                state.pendingRequests = state.pendingRequests.filter(
                    request => request.id !== action.meta.arg.notificationId
                );
            })
            .addCase(acceptFollowRequest.rejected, (state, action) => {
                state.loadingStates.acceptFollowRequest = false;
                state.error = action.payload as string || "Lỗi khi chấp nhận yêu cầu theo dõi";
            })

            // Decline follow request
            .addCase(declineFollowRequest.pending, (state) => {
                state.loadingStates.declineFollowRequest = true;
                state.error = null;
            })
            .addCase(declineFollowRequest.fulfilled, (state, action) => {
                state.loadingStates.declineFollowRequest = false;
                state.error = null;
                state.pendingRequests = state.pendingRequests.filter(
                    request => request.id !== action.meta.arg.notificationId
                );
            })
            .addCase(declineFollowRequest.rejected, (state, action) => {
                state.loadingStates.declineFollowRequest = false;
                state.error = action.payload as string || "Lỗi khi từ chối yêu cầu theo dõi";
            })

            // Get followers
            .addCase(getFollowers.pending, (state) => {
                state.loadingStates.getFollowers = true;
                state.error = null;
            })
            .addCase(getFollowers.fulfilled, (state, action) => {
                state.loadingStates.getFollowers = false;
                state.error = null;
                state.followers = action.payload;
            })
            .addCase(getFollowers.rejected, (state, action) => {
                state.loadingStates.getFollowers = false;
                state.error = action.payload as string || "Lỗi khi tải danh sách người theo dõi";
            })

            // Get following
            .addCase(getFollowing.pending, (state) => {
                state.loadingStates.getFollowing = true;
                state.error = null;
            })
            .addCase(getFollowing.fulfilled, (state, action) => {
                state.loadingStates.getFollowing = false;
                state.error = null;
                state.following = action.payload;
            })
            .addCase(getFollowing.rejected, (state, action) => {
                state.loadingStates.getFollowing = false;
                state.error = action.payload as string || "Lỗi khi tải danh sách đang theo dõi";
            })

            // Get pending requests
            .addCase(getPendingFollowRequests.pending, (state) => {
                state.loadingStates.getPendingFollowRequests = true;
                state.error = null;
            })
            .addCase(getPendingFollowRequests.fulfilled, (state, action) => {
                state.loadingStates.getPendingFollowRequests = false;
                state.error = null;
                state.pendingRequests = action.payload;
            })
            .addCase(getPendingFollowRequests.rejected, (state, action) => {
                state.loadingStates.getPendingFollowRequests = false;
                state.error = action.payload as string || "Lỗi khi tải yêu cầu theo dõi đang chờ";
            })

            // Get user by ID
            .addCase(getUserById.pending, (state) => {
                state.loadingStates.getUserById = true;
                state.error = null;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loadingStates.getUserById = false;
                state.error = null;
                state.selectedUser = action.payload;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loadingStates.getUserById = false;
                state.error = action.payload as string || "Lỗi khi tải thông tin người dùng";
            })

            // Get all users
            .addCase(getAllUsers.pending, (state) => {
                state.loadingStates.getAllUsers = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loadingStates.getAllUsers = false;
                state.error = null;
                state.searchUsers = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loadingStates.getAllUsers = false;
                state.error = action.payload as string || "Lỗi khi tải danh sách người dùng";
            })

            // Get follow status
            .addCase(getFollowStatus.pending, (state) => {
                state.loadingStates.getFollowStatus = true;
                state.error = null;
            })
            .addCase(getFollowStatus.fulfilled, (state, action) => {
                state.loadingStates.getFollowStatus = false;
                state.error = null;
                state.followStatus = action.payload;
            })
            .addCase(getFollowStatus.rejected, (state, action) => {
                state.loadingStates.getFollowStatus = false;
                state.error = action.payload as string || "Lỗi khi kiểm tra trạng thái theo dõi";
            });
    }
});

export const {
    clearUserError,
    resetUserState,
    removeNotificationById,
    // New actions for ProfileDetail state management
    setFollowLoading,
    setModalFollowStatus,
    setModalFollowStatuses,
    setModalFollowLoading,
    setFollowersModalVisible,
    setFollowingModalVisible,
    clearModalFollowStatuses,
    clearProfileDetailStates
} = UserSlice.actions;


export const selectUserLoadingStates = (state: { user: UserState }) => state.user.loadingStates;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectSelectedUser = (state: { user: UserState }) => state.user.selectedUser;
export const selectFollowers = (state: { user: UserState }) => state.user.followers;
export const selectFollowing = (state: { user: UserState }) => state.user.following;
export const selectFollowStatus = (state: { user: UserState }) => state.user.followStatus;
// New selectors for ProfileDetail states
export const selectProfileDetailStates = (state: { user: UserState }) => state.user.profileDetailStates;
export const selectFollowLoading = (state: { user: UserState }) => state.user.profileDetailStates.followLoading;
export const selectModalFollowStatuses = (state: { user: UserState }) => state.user.profileDetailStates.modalFollowStatuses;
export const selectModalFollowLoading = (state: { user: UserState }) => state.user.profileDetailStates.modalFollowLoading;
export const selectFollowersModalVisible = (state: { user: UserState }) => state.user.profileDetailStates.followersModalVisible;
export const selectFollowingModalVisible = (state: { user: UserState }) => state.user.profileDetailStates.followingModalVisible;

export * from './thunk';

export default UserSlice.reducer;
