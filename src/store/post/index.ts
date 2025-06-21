import type { Post } from '../../context/interface';
import { createSlice } from "@reduxjs/toolkit";
import { createPost, deletePost, getAllPostsByUser, getSpecificPost, updatePost, getFeedPosts } from './thunk';


const initialState: Post = {
    posts: [],
    specificPost: {},
    postEdit: {},
    feedPosts: {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    },
    loading: false,
    error: null,
    loadingStates: {
        getAllPostsByUser: false,
        getSpecificPost: false,
        createPost: false,
        updatePost: false,
        deletePost: false,
        getFeedPosts: false,
    }
}

export const PostSlice = createSlice({
    name: "Post",
    initialState,
    reducers: {
        setPostEdit: (state, action) => {
            state.postEdit = action.payload;
        },
        clearPostEdit: (state) => {
            state.postEdit = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPostsByUser.pending, (state, action) => {
                state.loadingStates.getAllPostsByUser = true;
                state.error = null;
            })
            .addCase(getAllPostsByUser.fulfilled, (state, action) => {
                state.loadingStates.getAllPostsByUser = false;
                state.error = null;
                state.posts = action.payload.posts;
            })
            .addCase(getAllPostsByUser.rejected, (state, action) => {
                state.loadingStates.getAllPostsByUser = false;
                state.error = action.payload as string;
            })
            .addCase(getSpecificPost.pending, (state) => {
                state.loadingStates.getSpecificPost = true;
                state.error = null;
            })
            .addCase(getSpecificPost.fulfilled, (state, action) => {
                state.loadingStates.getSpecificPost = false;
                state.error = null;
                state.specificPost = action.payload.post;
            })
            .addCase(getSpecificPost.rejected, (state, action) => {
                state.loadingStates.getSpecificPost = false;
                state.error = action.payload as string;
            })
            .addCase(createPost.pending, (state, action) => {
                state.loadingStates.createPost = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loadingStates.createPost = false;
                state.error = null;
                state.posts.unshift(action.payload.post);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loadingStates.createPost = false;
                state.error = action.payload as string;
            })
            .addCase(updatePost.pending, (state) => {
                state.loadingStates.updatePost = true;
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loadingStates.updatePost = false;
                state.error = null;
                const updatedPost = action.payload.post;
                const index = state.posts.findIndex(p => p.id === updatedPost.id);
                if (index !== -1) {
                    state.posts[index] = updatedPost;
                }
                if (state.specificPost.id === updatedPost.id) {
                    state.specificPost = updatedPost;
                }
                state.postEdit = {};
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.loadingStates.updatePost = false;
                state.error = action.payload as string;
            })
            .addCase(deletePost.pending, (state) => {
                state.loadingStates.deletePost = true;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loadingStates.deletePost = false;
                state.error = null;
                state.posts = state.posts.filter(post => post.id !== action.meta.arg);
                if (state.specificPost.id === action.meta.arg) {
                    state.specificPost = {};
                }
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loadingStates.deletePost = false;
                state.error = action.payload as string;
            })
            .addCase(getFeedPosts.pending, (state) => {
                state.loadingStates.getFeedPosts = true;
                state.error = null;
            })
            .addCase(getFeedPosts.fulfilled, (state, action) => {
                state.loadingStates.getFeedPosts = false;
                state.error = null;
                state.feedPosts = action.payload.posts;
            })
            .addCase(getFeedPosts.rejected, (state, action) => {
                state.loadingStates.getFeedPosts = false;
                state.error = action.payload as string;
            });
    }
})

export const { setPostEdit, clearPostEdit } = PostSlice.actions;

// Selector helpers for loading states
export const selectPostLoadingStates = (state: { post: Post }) => state.post.loadingStates;
export const selectPostError = (state: { post: Post }) => state.post.error;
export const selectPosts = (state: { post: Post }) => state.post.posts;
export const selectSpecificPost = (state: { post: Post }) => state.post.specificPost;
export const selectFeedPosts = (state: { post: Post }) => state.post.feedPosts;

export * from "./thunk";
export default PostSlice.reducer;
