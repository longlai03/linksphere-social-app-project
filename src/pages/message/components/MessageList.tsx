import DefaultImage from '@assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import {
  fetchConversations,
  selectConversation
} from "@store/message";
import type { AppDispatch, RootState } from "@store/redux";
import { formatTime } from '@utils/helpers';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MessageList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, loadingStates, selectedConversation } = useSelector((state: RootState) => state.message);
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleSelect = async (id: string) => {
    dispatch(selectConversation(id));
    navigate(`/messages/${id}`);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{user.username}</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loadingStates.fetchConversations ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <div className="mt-2 text-gray-500 text-sm">Đang tải...</div>
            </div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
            <div className="text-center">
              <div className="font-medium mb-2">Chưa có cuộc trò chuyện nào</div>
              <div className="text-sm">Bắt đầu nhắn tin với bạn bè của bạn</div>
            </div>
          </div>
        ) : (
          conversations.map((conv: any) => {
            console.log(conv);
            const participant = conv.other_participant || {};
            const avatar = conv.avatar
              ? `http://localhost:8000/${conv.avatar}`
              : (participant.avatar_url ? `http://localhost:8000/${participant.avatar_url}` : DefaultImage);
            const name = conv.name || participant.nickname || participant.username || 'Người dùng';
            const username = participant.username ?? '';
            const lastMessageObj = conv.lastMessageFull || [];
            const lastMessage = lastMessageObj.content || 'Chưa có tin nhắn';
            const lastMessageStatus = lastMessageObj.status;
            const lastMessageSenderId = lastMessageObj.sender_id;
            const isOwnLastMessage = lastMessageSenderId && user.id && lastMessageSenderId === user.id;
            let statusText = '';
            if (isOwnLastMessage) {
              if (lastMessageStatus === 'read') statusText = 'Đã đọc';
              else if (lastMessageStatus === 'delivered') statusText = 'Đã nhận';
              else if (lastMessageStatus === 'sent') statusText = 'Đã gửi';
              else statusText = 'Chưa gửi';
            }
            const isOnline = (typeof conv.other_participant?.is_online !== 'undefined')
              ? conv.other_participant.is_online
              : (typeof participant.is_online !== 'undefined' ? participant.is_online : false);
            const isActive = selectedConversation?.id === conv.id;
            return (
              <div
                key={conv.id}
                className={`flex items-center gap-4 px-4 py-3 cursor-pointer rounded-lg transition-colors group 
                  ${isActive ? 'bg-blue-50 border-r-4 border-blue-500' : 'hover:bg-gray-50'}`}
                onClick={() => handleSelect(conv.id)}
              >
                <div className="relative">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm"
                  />
                  {isOnline && (
                    <span className="absolute bottom-1 right-1 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-base truncate">{name}</div>
                    {conv.updated_at && (
                      <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                        {formatTime(conv.updated_at)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{username}</div>
                  <div className="text-sm text-gray-600 truncate mt-1">
                    {lastMessage}
                    {isOwnLastMessage && statusText && (
                      <span className="ml-2 text-xs text-gray-400">({statusText})</span>
                    )}
                  </div>
                </div>
                {conv.unread_count > 0 && (
                  <div className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-bold min-w-[20px] text-center ml-2">
                    {conv.unread_count > 99 ? '99+' : conv.unread_count}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MessageList;
