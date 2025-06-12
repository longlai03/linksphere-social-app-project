import type { Post } from '../../context/interface';
import { createSlice } from "@reduxjs/toolkit";
import { createPost, deletePost, getAllPostsByUser, getSpecificPost, updatePost } from './thunk';


const initialState: Post = {
    posts: [],
    specificPost: {},
    postEdit: {},
    loading: false,
    error: null,
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
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPostsByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.posts = action.payload.posts;
            })
            .addCase(getAllPostsByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getSpecificPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSpecificPost.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.specificPost = action.payload.post;
            })
            .addCase(getSpecificPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createPost.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.posts.unshift(action.payload.post);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updatePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false;
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
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.posts = state.posts.filter(post => post.id !== action.meta.arg);
                if (state.specificPost.id === action.meta.arg) {
                    state.specificPost = {};
                }
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
})

export const { setPostEdit, clearPostEdit } = PostSlice.actions;
export * from "./thunk";
export default PostSlice.reducer;
