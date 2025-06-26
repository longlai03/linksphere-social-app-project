import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "../../../components/Avatar";
import { Spin, Input, Modal, List } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { 
  fetchConversations, 
  selectConversation, 
  fetchMessages, 
  createConversation,
  searchUsers,
  markAsRead
} from "../../../store/message";
import type { AppDispatch } from "../../../store/redux";
import { useNavigate } from "react-router-dom";
import { convertDefaultToTimeZone } from '../../../utils/helpers';
import DefaultImage from '../../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';

const { Search } = Input;

const MessageList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations = [], loadingStates = {}, selectedConversationId } = useSelector(
    (state: any) => state.message || {}
  );
  
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleSelect = async (id: string) => {
    dispatch(selectConversation(id));
    dispatch(fetchMessages(id));
    dispatch(markAsRead(id));
    navigate(`/messages/${id}`);
  };

  const handleSearchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    try {
      const results = await dispatch(searchUsers(query)).unwrap();
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleStartConversation = async (userId: string) => {
    try {
      const conversation = await dispatch(createConversation({ userId })).unwrap();
      dispatch(selectConversation(conversation.id));
      dispatch(fetchMessages(conversation.id));
      setSearchModalVisible(false);
      setSearchQuery("");
      setSearchResults([]);
      // Refresh conversations list
      dispatch(fetchConversations());
    } catch (error) {
      console.error('Create conversation error:', error);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const localTime = convertDefaultToTimeZone(dateString);
    const date = new Date(localTime);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Tin nhắn</h2>
          <button
            onClick={() => setSearchModalVisible(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <PlusOutlined className="text-lg" />
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loadingStates.fetchConversations ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
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
            const participant = conv.otherParticipant || conv.participant || {};
            const avatar = participant.avatar_url || DefaultImage;
            const name = participant.nickname || participant.username || 'Người dùng';
            const username = participant.username ? `@${participant.username}` : '';
            const lastMessage = conv.lastMessage || 'Chưa có tin nhắn';
            const isOnline = participant.is_online;
            const isActive = selectedConversationId === conv.id;
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
                    {conv.updatedAt && (
                      <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                        {formatTime(conv.updatedAt)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{username}</div>
                  <div className="text-sm text-gray-600 truncate mt-1">{lastMessage}</div>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-bold min-w-[20px] text-center ml-2">
                    {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Search Users Modal */}
      <Modal
        title="Tìm kiếm người dùng"
        open={searchModalVisible}
        onCancel={() => {
          setSearchModalVisible(false);
          setSearchQuery("");
          setSearchResults([]);
        }}
        footer={null}
        width={400}
      >
        <div className="space-y-4">
          <Search
            placeholder="Tìm kiếm theo tên hoặc username..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearchUsers(e.target.value);
            }}
            loading={searchLoading}
            onSearch={handleSearchUsers}
          />
          
          <List
            dataSource={searchResults}
            loading={searchLoading}
            renderItem={(user: any) => (
              <List.Item
                className="cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => handleStartConversation(user.id.toString())}
              >
                <List.Item.Meta
                  avatar={<Avatar src={user.avatar_url} size={40} />}
                  title={user.nickname || user.username}
                  description={`@${user.username}`}
                />
              </List.Item>
            )}
            locale={{
              emptyText: searchQuery.length < 2 
                ? "Nhập ít nhất 2 ký tự để tìm kiếm" 
                : "Không tìm thấy người dùng"
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default MessageList;
