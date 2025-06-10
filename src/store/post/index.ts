import type { Post } from '../../context/interface';
import { createSlice } from "@reduxjs/toolkit";
import { createPost, getAllPostsByUser, getSpecificPost } from './thunk';


const initialState: Post = {
    posts: [],
    specificPost: {},
    loading: false,
    error: null,
}

export const PostSlice = createSlice({
    name: "Post",
    initialState,
    reducers: {
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
                state.specificPost = action.payload.post; // <-- this matches your API response
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
                state.posts.unshift(action.payload.posts);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
})

export * from "./thunk";
// export const {

// } = PostSlice.actions;
export default PostSlice.reducer;
