import React, { useEffect } from "react";
import MessageList from "./components/MessageList";
import MessageChat from "./components/MessageChat";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/redux";
import { selectConversation, fetchConversationById } from "../../store/message";

const Messages = () => {
  const { conversationId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const selectedConversationId = useSelector((state: any) => state.message.selectedConversationId);
  const conversations = useSelector((state: any) => state.message.conversations);

  useEffect(() => {
    if (conversationId && conversationId !== selectedConversationId) {
      const found = conversations.find((c: any) => c.id === conversationId);
      if (!found) {
        dispatch(fetchConversationById(conversationId));
      } else {
        dispatch(selectConversation(conversationId));
      }
    }
  }, [conversationId, selectedConversationId, conversations, dispatch]);

  return (
    <div className="flex w-full h-full min-h-[100vh] min-w-0 flex-1">
      <div className="w-[360px] border-r min-w-0 max-h-[100vh]">
        <MessageList />
      </div>
      <div className="flex-1 min-w-0 max-h-[100vh]">
        <MessageChat conversationId={conversationId} /> 
      </div>
    </div>
  );
};

export default Messages;