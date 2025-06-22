import { Modal } from "antd";
import { useSelector } from "react-redux";
import { selectFollowing, selectUserLoadingStates } from "../../../../store/user";
import UserList from "./UserList";

interface FollowingModalProps {
    visible: boolean;
    onCancel: () => void;
}

const FollowingModal: React.FC<FollowingModalProps> = ({ visible, onCancel }) => {
    const following = useSelector(selectFollowing);
    const loadingStates = useSelector(selectUserLoadingStates);

    return (
        <Modal
            title="Đang theo dõi"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={400}
            confirmLoading={loadingStates.getFollowing}
        >
            {loadingStates.getFollowing ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <div className="mt-2 text-gray-500">Đang tải...</div>
                </div>
            ) : (
                <UserList
                    users={following}
                    emptyMessage="Chưa theo dõi ai"
                    onUserClick={onCancel}
                />
            )}
        </Modal>
    );
};

export default FollowingModal; 