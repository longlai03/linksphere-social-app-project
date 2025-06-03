import React from 'react';
import Avatar from './Avatar';

interface NotificationItemProps {
    avatar: string;
    username: string;
    time: string;
    status: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    avatar,
    username,
    time,
    status,
}) => {
    return (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-3">
                <Avatar src={avatar} alt={username} size={40} />
                <div className="text-sm">
                    <p>
                        <strong>{username}</strong> đã bắt đầu theo dõi bạn.
                    </p>
                    <p className="text-gray-500 text-xs">{time}</p>
                </div>
            </div>
            <button className="px-3 py-1 bg-gray-200 rounded text-sm whitespace-nowrap">
                {status}
            </button>
        </div>
    );
};

export default NotificationItem;
