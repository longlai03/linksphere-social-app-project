import { PaperClipOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, Empty, Spin } from "antd";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import DefaultImage from '../../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import Avatar from "../../../components/Avatar";
import TextFieldComment from "../../../components/input/TextFieldComment";
import { fetchMessages, markAsRead, sendMessage } from "../../../store/message";
import type { AppDispatch } from "../../../store/redux";
import { convertDefaultToTimeZone } from '../../../utils/helpers';

interface MessageChatProps {
  conversationId?: string;
}

const MessageChat = ({ conversationId }: MessageChatProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedConversation, selectedConversationId, messages, loadingStates } = useSelector((state: any) => state.message);
  const { control, handleSubmit, reset, watch } = useForm({ defaultValues: { content: "" } });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContent = watch("content");

  useEffect(() => {
    if (
      conversationId &&
      selectedConversation &&
      selectedConversation.id === conversationId &&
      selectedConversationId === conversationId
    ) {
      dispatch(fetchMessages(conversationId));
      dispatch(markAsRead(conversationId));
    }
  }, [dispatch, conversationId, selectedConversation, selectedConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = async (data: { content: string }) => {
    if (data.content.trim() && selectedConversation) {
      try {
        await dispatch(sendMessage({
          conversationId: selectedConversation.id,
          content: data.content
        })).unwrap();
        reset();
      } catch (error) {
        console.error('Send message error:', error);
      }
    }
  };

  const formatMessageTime = (dateString: string) => {
    if (!dateString) return "";
    const localTime = convertDefaultToTimeZone(dateString);
    const date = new Date(localTime);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 1) {
      return "Vừa xong";
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} phút trước`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  if (!conversationId || !selectedConversation || selectedConversation.id !== conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="text-xl font-medium mb-2">Chọn một cuộc trò chuyện</div>
          <div className="text-sm">Bắt đầu nhắn tin với bạn bè của bạn</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3 bg-white">
        <div className="relative">
          <Avatar src={selectedConversation.avatar ? `http://localhost:8000/${selectedConversation.avatar}` : DefaultImage} size={40} />
          {selectedConversation.otherParticipant?.is_online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium">{selectedConversation.name}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loadingStates.fetchMessages ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : messages.length === 0 ? (
          <Empty
            description="Chưa có tin nhắn nào"
            className="mt-8"
          />
        ) : (
          messages.map((msg: any, idx: number) => {
            const senderName = msg.sender?.username || (msg.sender_id === selectedConversation?.otherParticipant?.id ? "Người dùng" : "Bạn");
            const isOwn = msg.sender_id !== selectedConversation?.otherParticipant?.id;
            const isLastOwn = isOwn && (
              messages.slice(idx + 1).findIndex((m: any) => m.sender_id !== selectedConversation?.otherParticipant?.id) === -1
            );
            let statusText = '';
            if (isOwn) {
              if (msg.status === 'read') statusText = 'Đã đọc';
              else if (msg.status === 'delivered') statusText = 'Đã nhận';
              else if (msg.status === 'sent') statusText = 'Đã gửi';
              else statusText = 'Chưa gửi';
            }
            return (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === selectedConversation?.otherParticipant?.id ? "justify-start" : "justify-end"}`}
              >
                <div className={`flex flex-col items-${msg.sender_id === selectedConversation?.otherParticipant?.id ? "start" : "end"} gap-1 max-w-xs ${msg.sender_id !== selectedConversation?.otherParticipant?.id ? "flex-row-reverse" : ""}`}>
                  {/* Tên người nhắn */}
                  <div className="flex items-end gap-2">
                    {msg.sender_id === selectedConversation?.otherParticipant?.id && (
                      <Avatar src={msg.sender?.avatar_url ? `http://localhost:8000/${msg.sender.avatar_url}` : DefaultImage} size={32} />
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-full ${msg.sender_id !== selectedConversation?.otherParticipant?.id
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-gray-200 text-gray-800 rounded-bl-md"
                        }`}
                    >
                      <span className={`text-xs font-bold mb-1 ${msg.sender_id !== selectedConversation?.otherParticipant?.id ? "text-white" : "text-gray-700"}`}>{senderName}</span>
                      <div>{msg.content}</div>
                      <div className={`flex items-center gap-1 mt-1 ${msg.sender_id !== selectedConversation?.otherParticipant?.id ? "justify-end" : "justify-start"
                        }`}>
                        <span className={`text-xs ${msg.sender_id !== selectedConversation?.otherParticipant?.id ? "text-blue-100" : "text-gray-400"
                          }`}>
                          {formatMessageTime(msg.sent_at)}
                        </span>
                      </div>
                      {isOwn && isLastOwn && (
                        <div className="text-xs mt-1 text-right" style={{ color: '#a0aec0' }}>{statusText}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit(onSend)}
        className="p-4 border-t bg-white"
      >
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <TextFieldComment
              name="content"
              control={control}
              type="text"
              placeholder="Nhập tin nhắn"
              fullWidth
            />
          </div>
          <Button
            type="primary"
            htmlType="submit"
            loading={loadingStates.sendMessage}
            disabled={!messageContent?.trim()}
            icon={<SendOutlined />}
            className="flex items-center"
          >
            Gửi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageChat;
