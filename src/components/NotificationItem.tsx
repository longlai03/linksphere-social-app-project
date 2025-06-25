import { DeleteOutlined } from '@ant-design/icons';
import React from 'react';
import { useDispatch } from 'react-redux';
import DefaultImage from '../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import type { NotificationItem as NotificationItemType } from '../context/interface';
import { deleteNotification } from '../store/notification';
import type { AppDispatch } from '../store/redux';
import { acceptFollowRequest, declineFollowRequest } from '../store/user';
import Avatar from './Avatar';

interface NotificationItemProps {
    notification: NotificationItemType;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification
}) => {
    const isUnread = !notification.read;
    const dispatch = useDispatch<AppDispatch>();
    const isSystemNotification = !notification.from_user?.id;

    const handleAccept = async () => {
        if (notification.from_user?.id) {
            try {
                await dispatch(acceptFollowRequest({
                    followerId: notification.from_user.id,
                    notificationId: notification.id
                })).unwrap();
                console.log('Follow request accepted successfully');
            } catch (error) {
                console.error('Error accepting follow request:', error);
            }
        }
    };

    const handleDecline = async () => {
        if (notification.from_user?.id) {
            try {
                await dispatch(declineFollowRequest({
                    followerId: notification.from_user.id,
                    notificationId: notification.id
                })).unwrap();
                console.log('Follow request declined successfully');
            } catch (error) {
                console.error('Error declining follow request:', error);
            }
        }
    };

    const handleDelete = () => {
        dispatch(deleteNotification(notification.id));
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    };

    return (
        <div
            className={`flex items-center justify-between rounded-lg p-3 shadow-sm transition border 
                ${isUnread ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
        >
            <div className="flex items-center gap-3">
                <Avatar
                    src={notification.from_user?.avatar_url
                        ? `http://localhost:8000/${notification.from_user.avatar_url}`
                        : DefaultImage}
                    alt={notification.from_user?.username || 'System'}
                    size={40}
                />
                <div className="text-sm">
                    <p>
                        {notification.content}
                    </p>
                    <p className="text-gray-500 text-xs">
                        {formatTime(notification.created_at)}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {notification.type === 'follow_request' && !isSystemNotification ? (
                    <>
                        <button
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm whitespace-nowrap hover:bg-green-600"
                            onClick={handleAccept}
                        >
                            Chấp nhận
                        </button>
                        <button
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm whitespace-nowrap hover:bg-red-600"
                            onClick={handleDecline}
                        >
                            Từ chối
                        </button>
                    </>
                ) : undefined
                }
                <button
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    onClick={handleDelete}
                    title="Xóa thông báo"
                >
                    <DeleteOutlined />
                </button>
            </div>
        </div>
    );
};

export default NotificationItem;
