import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "../../../components/Avatar";
import { Spin } from "antd";
// import { RootState } from "../../../store/redux";
// import { fetchConversations, selectConversation } from "../../../store/message";

const MessageList = () => {
  const dispatch = useDispatch();
  const { conversations = [], loading = false, selectedConversationId } = useSelector(
    (state: any) => state.message || {}
  );

  useEffect(() => {
    // dispatch(fetchConversations());
  }, [dispatch]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 font-bold text-lg">Tin nhắn</div>
      {loading ? (
        <Spin className="mt-8" />
      ) : (
        conversations.map((conv: any) => (
          <div
            key={conv.id}
            className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedConversationId === conv.id ? "bg-gray-200" : ""
            }`}
            // onClick={() => dispatch(selectConversation(conv.id))}
          >
            <Avatar src={conv.avatar} size={48} />
            <div className="flex-1">
              <div className="font-medium">{conv.name}</div>
              <div className="text-xs text-gray-500 truncate">
                {conv.lastMessage}
              </div>
            </div>
            {conv.unreadCount > 0 && (
              <span className="bg-blue-500 text-white rounded-full px-2 text-xs">
                {conv.unreadCount}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
