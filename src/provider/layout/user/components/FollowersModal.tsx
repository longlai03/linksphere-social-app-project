import { Modal } from "antd";
import { useSelector } from "react-redux";
import { selectFollowers, selectUserLoadingStates } from "../../../../store/user";
import UserList from "./UserList";

interface FollowersModalProps {
    visible: boolean;
    onCancel: () => void;
}

const FollowersModal: React.FC<FollowersModalProps> = ({ visible, onCancel }) => {
    const followers = useSelector(selectFollowers);
    const loadingStates = useSelector(selectUserLoadingStates);

    return (
        <Modal
            title="Người theo dõi"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={400}
            confirmLoading={loadingStates.getFollowers}
        >
            {loadingStates.getFollowers ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <div className="mt-2 text-gray-500">Đang tải...</div>
                </div>
            ) : (
                <UserList
                    users={followers}
                    emptyMessage="Chưa có người theo dõi"
                    onUserClick={onCancel}
                />
            )}
        </Modal>
    );
};

export default FollowersModal; 