import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Conversation, Message } from "./index";
import axiosInstance from "../../services/api";
import { getCurrentUserId } from "../user";
import { convertDefaultToTimeZone, convertTimeZoneToDefault } from '../../utils/helpers';

// Lấy danh sách hội thoại
export const fetchConversations = createAsyncThunk<Conversation[], void, { rejectValue: string }>(
  "message/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/conversations");
      return (res.data.data || []).map((conv: any) => ({
        id: conv.id.toString(),
        name: conv.name || "Người dùng",
        avatar: conv.avatar || "",
        lastMessage: conv.last_message?.content || "",
        unreadCount: conv.unread_count || 0,
        otherParticipant: conv.other_participant,
        updatedAt: conv.updated_at
      }));
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi tải hội thoại");
    }
  }
);

// Lấy tin nhắn của hội thoại
export const fetchMessages = createAsyncThunk<Message[], string, { rejectValue: string }>(
  "message/fetchMessages",
  async (conversationId, { rejectWithValue, getState }) => {
    try {
      const res = await axiosInstance.get(`/api/conversations/${conversationId}/messages`);
      const userId = getCurrentUserId(getState());
      return (res.data.data?.data || []).map((msg: any) => ({
        id: msg.id.toString(),
        conversationId: msg.chat_id.toString(),
        content: msg.content,
        isOwn: msg.sender_id === userId,
        sender: msg.sender,
        sentAt: convertDefaultToTimeZone(msg.sent_at),
        status: msg.status
      }));
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi tải tin nhắn");
    }
  }
);

// Gửi tin nhắn
export const sendMessage = createAsyncThunk<Message, { conversationId: string; content: string }, { rejectValue: string }>(
  "message/sendMessage",
  async ({ conversationId, content }, { rejectWithValue, getState }) => {
    try {
      const res = await axiosInstance.post(`/api/conversations/${conversationId}/messages`, { content });
      const msg = res.data.data;
      const userId = getCurrentUserId(getState());
      return {
        id: msg.id.toString(),
        conversationId: msg.chat_id.toString(),
        content: msg.content,
        isOwn: msg.sender_id === userId,
        sender: msg.sender,
        sentAt: convertTimeZoneToDefault(msg.sent_at),
        status: msg.status
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi gửi tin nhắn");
    }
  }
);

// Tạo hoặc lấy cuộc hội thoại trực tiếp giữa hai người dùng (dùng userId)
export const createConversation = createAsyncThunk<
  Conversation,
  { userId: string },
  { rejectValue: string }
>(
  "message/createConversation",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/conversations/${userId}/direct`);
      const conv = res.data.data;
      return {
        id: conv.id.toString(),
        name: conv.name || "Người dùng",
        avatar: conv.avatar || "",
        lastMessage: conv.last_message?.content || "",
        unreadCount: conv.unread_count || 0,
        otherParticipant: conv.other_participant
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi tạo hoặc lấy hội thoại");
    }
  }
);

// Đánh dấu tin nhắn đã đọc
export const markAsRead = createAsyncThunk<void, string, { rejectValue: string }>(
  "message/markAsRead",
  async (conversationId, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/api/conversations/${conversationId}/read`);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi đánh dấu đã đọc");
    }
  }
);

// Tìm kiếm user để nhắn tin
export const searchUsers = createAsyncThunk<any[], string, { rejectValue: string }>(
  "message/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/users/search-for-messages?q=${encodeURIComponent(query)}`);
      return res.data.data || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi tìm kiếm user");
    }
  }
);
