import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Conversation, Message } from "./index";

export const fetchConversations = createAsyncThunk<Conversation[]>(
  "message/fetchConversations",
  async (_, { rejectWithValue }) => {
    // Dữ liệu mẫu, giả lập delay
    return new Promise<Conversation[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            name: "Nguyễn Văn A",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            lastMessage: "Chào bạn!",
            unreadCount: 2,
          },
          {
            id: "2",
            name: "Trần Thị B",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            lastMessage: "Hẹn gặp lại!",
            unreadCount: 0,
          },
        ]);
      }, 500);
    });
  }
);

export const fetchMessages = createAsyncThunk<Message[], string>(
  "message/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    // Dữ liệu mẫu, giả lập delay
    return new Promise<Message[]>((resolve) => {
      setTimeout(() => {
        if (conversationId === "1") {
          resolve([
            { id: "m1", conversationId: "1", content: "Chào bạn!", isOwn: false },
            { id: "m2", conversationId: "1", content: "Bạn khỏe không?", isOwn: true },
          ]);
        } else if (conversationId === "2") {
          resolve([
            { id: "m3", conversationId: "2", content: "Hẹn gặp lại!", isOwn: false },
          ]);
        } else {
          resolve([]);
        }
      }, 500);
    });
  }
);

export const sendMessage = createAsyncThunk<Message, { conversationId: string; content: string }>(
  "message/sendMessage",
  async ({ conversationId, content }, { rejectWithValue }) => {
    // Giả lập gửi tin nhắn
    return new Promise<Message>((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now().toString(),
          conversationId,
          content,
          isOwn: true,
        });
      }, 200);
    });
  }
);
