import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@services/api";

// Lấy danh sách hội thoại
export const fetchConversations = createAsyncThunk(
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
        updatedAt: conv.updated_at,
        lastMessageFull: conv.last_message || null,
      }));
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi tải hội thoại");
    }
  }
);

// Lấy tin nhắn của hội thoại
export const fetchMessages = createAsyncThunk(
  "message/fetchMessages",
  async (conversationId: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/conversations/${conversationId}/messages`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi tải tin nhắn");
    }
  }
);

// Gửi tin nhắn
export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({ conversationId, content }: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/conversations/${conversationId}/messages`, { content });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi gửi tin nhắn");
    }
  }
);

export const createConversation = createAsyncThunk(
  "message/createConversation",
  async ({ userId }: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/conversations/${userId}/direct`);
      const conv = res.data.data;
      return {
        id: conv.id.toString(),
        name: conv.name || "Người dùng",
        avatar: conv.avatar || "",
        lastMessage: conv.last_message?.content || "",
        unreadCount: conv.unread_count || 0,
        otherParticipant: conv.other_participant,
        updatedAt: conv.updated_at,
        lastMessageFull: conv.last_message || null,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi tạo hoặc lấy hội thoại");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "message/markAsRead",
  async (conversationId: any, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/api/conversations/${conversationId}/read`);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi đánh dấu đã đọc");
    }
  }
);

// Lấy chi tiết hội thoại theo id
export const fetchConversationById = createAsyncThunk(
  "message/fetchConversationById",
  async (conversationId: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/conversations/${conversationId}`);
      const conv = res.data.data;
      return {
        id: conv.id.toString(),
        name: conv.name || "Người dùng",
        avatar: conv.avatar || "",
        lastMessage: conv.last_message?.content || "",
        unreadCount: conv.unread_count || 0,
        otherParticipant: conv.other_participant,
        updatedAt: conv.updated_at,
        lastMessageFull: conv.last_message || null,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi lấy chi tiết hội thoại");
    }
  }
);
