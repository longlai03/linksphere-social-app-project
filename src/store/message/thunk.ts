import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/api";
import { getCurrentUserId } from "../user";
import { convertDefaultToTimeZone, convertTimeZoneToDefault } from '../../utils/helpers';
import type { Conversation, Message } from "../../context/interface";

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
        updatedAt: conv.updated_at,
        lastMessageFull: conv.last_message || null,
      }));
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi tải hội thoại");
    }
  }
);

// Lấy tin nhắn của hội thoại
export const fetchMessages = createAsyncThunk<any, string, { rejectValue: string }>(
  "message/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/conversations/${conversationId}/messages`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi tải tin nhắn");
    }
  }
);

// Gửi tin nhắn
export const sendMessage = createAsyncThunk<any, { conversationId: string; content: string }, { rejectValue: string }>(
  "message/sendMessage",
  async ({ conversationId, content }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/conversations/${conversationId}/messages`, { content });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi gửi tin nhắn");
    }
  }
);

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
        otherParticipant: conv.other_participant,
        updatedAt: conv.updated_at,
        lastMessageFull: conv.last_message || null,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Lỗi khi tạo hoặc lấy hội thoại");
    }
  }
);

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

// Lấy chi tiết hội thoại theo id
export const fetchConversationById = createAsyncThunk<Conversation, string, { rejectValue: string }>(
  "message/fetchConversationById",
  async (conversationId, { rejectWithValue }) => {
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
