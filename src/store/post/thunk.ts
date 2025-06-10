import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/api";

export const createPost = createAsyncThunk(
    "post/createPost",
    async ({ postData, token }: { postData: any, token: string }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                '/api/post',
                postData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                },
            );
            return {
                posts: res.data.post,
            };;
        } catch (error: any) {
            console.log("Error get data register: ", error);
            return rejectWithValue(error.response?.data);
        }
    }
)

export const getAllPostsByUser = createAsyncThunk(
    "post/getAllPostsByUser",
    async ({ userId, token }: { userId: any; token: string }, { rejectWithValue }) => {
        try {
            console.log('call me');
            const res = await axiosInstance.get(
                `/api/user/${userId}/post`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                },
            );
            return {
                posts: res.data.posts,
            };;
        } catch (error: any) {
            console.log("Error get all data post: ", error);
            return rejectWithValue(error.response?.data);
        }
    }
)

export const getSpecificPost = createAsyncThunk(
    "post/getSpecificPost",
    async ({ postId, token }: { postId: any; token: string }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(
                `/api/post/${postId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                },
            );
            return {
                post: res.data.post,
            };;
        } catch (error: any) {
            console.log("Error get all data post: ", error);
            return rejectWithValue(error.response?.data);
        }
    }
)
