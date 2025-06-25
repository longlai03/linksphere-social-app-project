import { Modal } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/redux";
import Avatar from "../../../components/Avatar";
import Text from "../../../components/Text";
import DefaultImage from "../../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png";

interface FollowingModalProps {
    visible: boolean;
    onClose: () => void;
}

const FollowingModal = ({ visible, onClose }: FollowingModalProps) => {
    const following = useSelector((state: RootState) => state.user.following);
    const loadingStates = useSelector((state: RootState) => state.user.loadingStates);

    return (
        <Modal
            title="Đang theo dõi"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={400}
        >
            {loadingStates.getFollowing ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <Text type="body" className="mt-4">Đang tải...</Text>
                </div>
            ) : following.length === 0 ? (
                <div className="text-center py-8">
                    <Text type="body" className="text-gray-500">Chưa theo dõi ai</Text>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {following.map((user: any) => (
                        <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                            <Avatar
                                src={user.avatar_url ? `http://localhost:8000/${user.avatar_url}` : DefaultImage}
                                size={40}
                            />
                            <div className="flex-1">
                                <Text type="body" className="font-medium">{user.username}</Text>
                                <Text type="caption" className="text-gray-500">{user.nickname}</Text>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
};

export default FollowingModal; 