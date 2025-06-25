import { Modal } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/redux";
import Avatar from "../../../components/Avatar";
import Text from "../../../components/Text";
import DefaultImage from "../../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png";

interface FollowersModalProps {
    visible: boolean;
    onClose: () => void;
}

const FollowersModal = ({ visible, onClose }: FollowersModalProps) => {
    const following = useSelector((state: RootState) => state.user.followers);
    const loadingStates = useSelector((state: RootState) => state.user.loadingStates);

    return (
        <Modal
            title="Người theo dõi"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={400}
        >
            {loadingStates.getFollowers ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <Text type="body" className="mt-4">Đang tải...</Text>
                </div>
            ) : following.length === 0 ? (
                <div className="text-center py-8">
                    <Text type="body" className="text-gray-500">Chưa có người theo dõi nào</Text>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {following.map((follower: any) => (
                        <div key={follower.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                            <Avatar
                                src={follower.avatar_url ? `http://localhost:8000/${follower.avatar_url}` : DefaultImage}
                                size={40}
                            />
                            <div className="flex-1">
                                <Text type="body" className="font-medium">{follower.username}</Text>
                                <Text type="caption" className="text-gray-500">{follower.nickname}</Text>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
};

export default FollowersModal; 