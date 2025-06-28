import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  fetchConversationById
} from "./thunk";
import type { MessageState } from "../../context/interface";

const initialState: MessageState = {
  conversations: [],
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
      state.selectedConversation = null;
      state.messages = [];
    },
    selectConversation: (state, action: PayloadAction<string>) => {
      state.selectedConversation =
        state.conversations.find((c) => c.id === action.payload) || null;
      state.messages = [];
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
        state.conversations = action.payload || [];
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
        const arr = Array.isArray(action.payload.data) ? action.payload.data : (action.payload.data?.data || []);
        state.messages = [...arr].reverse();
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
        if (action.payload?.data) state.messages.push(action.payload.data);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loadingStates.sendMessage = false;
        state.error = action.payload as string || "Lỗi khi gửi tin nhắn";
      })
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        const exists = state.conversations.some(c => c.id === action.payload.id);
        if (!exists) {
          state.conversations.push(action.payload);
        }
        state.selectedConversation = action.payload;
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.error = action.payload as string || "Lỗi khi lấy chi tiết hội thoại";
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
