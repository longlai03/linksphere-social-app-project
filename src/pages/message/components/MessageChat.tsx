import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "../../../components/Avatar";
import TextFieldComment from "../../../components/input/TextFieldComment";
import { useForm, Controller } from "react-hook-form";
import { Button } from "antd";
// import { RootState } from "../../../store/redux";
// import { fetchMessages, sendMessage } from "../../../store/message";

const MessageChat = () => {
  const dispatch = useDispatch();
  const { selectedConversation, messages = [], loadingMessages = false } = useSelector(
    (state: any) => state.message || {}
  );
  const { control, handleSubmit, reset } = useForm({ defaultValues: { content: "" } });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConversation) {
      // dispatch(fetchMessages(selectedConversation.id));
    }
  }, [dispatch, selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = (data: { content: string }) => {
    if (data.content.trim()) {
      // dispatch(sendMessage({ conversationId: selectedConversation.id, content: data.content }));
      reset();
    }
  };

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Chọn một hội thoại để bắt đầu nhắn tin
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Avatar src={selectedConversation.avatar} size={40} />
        <div>
          <div className="font-medium">{selectedConversation.name}</div>
          <div className="text-xs text-gray-500">Đang hoạt động</div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {loadingMessages ? (
          <div>Đang tải tin nhắn...</div>
        ) : (
          messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.isOwn
                    ? "bg-blue-500 text-white"
                    : "bg-white border text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form
        onSubmit={handleSubmit(onSend)}
        className="p-4 border-t flex items-center gap-2 bg-white"
      >
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextFieldComment
              {...field}
              name="content"
              control={control}
              type="text"
              placeholder="Nhập tin nhắn..."
              fullWidth
            />
          )}
        />
        <Button type="primary" htmlType="submit">
          Gửi
        </Button>
      </form>
    </div>
  );
};

export default MessageChat;
