import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
} from "./thunk";

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  isOwn: boolean;
}

export interface MessageState {
  conversations: Conversation[];
  selectedConversationId: string | null;
  selectedConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  loadingStates: {
    fetchConversations: boolean;
    fetchMessages: boolean;
    sendMessage: boolean;
  };
}

const initialState: MessageState = {
  conversations: [
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
  ],
  selectedConversationId: null,
  selectedConversation: null,
  messages: [],
  loading: false,
  error: null,
  loadingStates: {
    fetchConversations: false,
    fetchMessages: false,
    sendMessage: false,
  },
};

export const MessageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    clearMessageError: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearSelectedConversation: (state) => {
      state.selectedConversationId = null;
      state.selectedConversation = null;
      state.messages = [];
    },
    selectConversation: (state, action: PayloadAction<string>) => {
      state.selectedConversationId = action.payload;
      state.selectedConversation =
        state.conversations.find((c) => c.id === action.payload) || null;
      // reset messages khi chọn hội thoại mới
      state.messages = action.payload === "1"
        ? [
            { id: "m1", conversationId: "1", content: "Chào bạn!", isOwn: false },
            { id: "m2", conversationId: "1", content: "Bạn khỏe không?", isOwn: true },
          ]
        : action.payload === "2"
        ? [
            { id: "m3", conversationId: "2", content: "Hẹn gặp lại!", isOwn: false },
          ]
        : [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loadingStates.fetchConversations = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loadingStates.fetchConversations = false;
        state.error = null;
        state.conversations = action.payload || state.conversations;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loadingStates.fetchConversations = false;
        state.error = action.payload as string || "Lỗi khi tải hội thoại";
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loadingStates.fetchMessages = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loadingStates.fetchMessages = false;
        state.error = null;
        state.messages = action.payload || state.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loadingStates.fetchMessages = false;
        state.error = action.payload as string || "Lỗi khi tải tin nhắn";
      })
      .addCase(sendMessage.pending, (state) => {
        state.loadingStates.sendMessage = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loadingStates.sendMessage = false;
        state.error = null;
        if (action.payload) state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loadingStates.sendMessage = false;
        state.error = action.payload as string || "Lỗi khi gửi tin nhắn";
      });
  },
});

export const {
  clearMessageError,
  clearMessages,
  clearSelectedConversation,
  selectConversation,
} = MessageSlice.actions;

export * from "./thunk";
export default MessageSlice.reducer;
