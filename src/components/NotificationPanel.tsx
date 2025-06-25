import React, { useEffect } from 'react';
import NotificationItem from './NotificationItem';
import { CloseOutlined } from '@ant-design/icons';
import Button from './Button';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/redux';
import { getNotifications } from '../store/notification';
import type { NotificationItem as NotificationItemType } from '../context/interface';

interface NotificationPanelProps {
    onClose?: () => void;
    isOpen?: boolean;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose, isOpen }: NotificationPanelProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { notifications, loading, error } = useSelector((state: RootState) => state.notification);

    useEffect(() => {
        if (isOpen) {
            const getApiData = async () => {
                try {
                    await dispatch(getNotifications()).unwrap();
                } catch (error) {
                    console.error('Error loading notifications:', error);
                }
            }
            getApiData();
        }
    }, [dispatch, isOpen]);

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
                    <CloseOutlined />
                </Button>
            </div>

            {loading && (
                <div className="text-center text-gray-500 py-4">Đang tải thông báo...</div>
            )}

            {error && (
                <div className="text-center text-red-500 py-4">{error}</div>
            )}

            {!loading && !error && (
                <div className="space-y-2">
                    {notifications.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                            Không có thông báo nào.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((notification: NotificationItemType) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;
