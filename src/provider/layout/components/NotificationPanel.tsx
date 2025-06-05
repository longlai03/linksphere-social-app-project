import React from 'react';
import NotificationItem from './NotificationItem';
import { CloseOutlined } from '@ant-design/icons';
import Button from './Button';

const notifications = [
    {
        username: 'dt._minh',
        time: '1 tuần',
        status: 'Đang theo dõi',
        avatar: '/avatars/minh.jpg',
    },
    {
        username: '_huogw.lmaz',
        time: '4 tuần',
        status: 'Đang theo dõi',
        avatar: '/avatars/huogw.jpg',
    },
    {
        username: '_d.phong',
        time: '7 tuần',
        status: 'Đang theo dõi',
        avatar: '/avatars/phong.jpg',
    },
];

interface NotificationPanelProps {
    onClose?: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }: NotificationPanelProps) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Thông báo</h2>
                <Button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Đóng thông báo"
                    variant="plain"
                    fullWidth={false}
                >
                    <CloseOutlined /> {/* Sử dụng CloseOutlined từ Ant Design */}
                </Button>
            </div>
            <div className="space-y-2">
                <p className="font-semibold text-sm text-gray-500">Tháng này</p>
                {notifications.slice(0, 4).map((item, index) => (
                    <NotificationItem key={index} {...item} />
                ))}
            </div>

            <div className="space-y-2">
                <p className="font-semibold text-sm text-gray-500">Trước đó</p>
                {notifications.slice(4).map((item, index) => (
                    <NotificationItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};

export default NotificationPanel;
