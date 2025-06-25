import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import DefaultImage from '../../../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';

interface User {
    id: number;
    username: string;
    nickname?: string;
    avatar_url?: string | null;
}

interface UserListProps {
    users: User[];
    emptyMessage: string;
    onUserClick?: () => void;
}

const UserList: React.FC<UserListProps> = ({ users, emptyMessage, onUserClick }) => {
    const navigate = useNavigate();

    const handleUserClick = (userId: number) => {
        navigate(`/user/${userId}`);
        if (onUserClick) {
            onUserClick();
        }
    };

    return (
        <div className="max-h-96 overflow-y-auto">
            {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {emptyMessage}
                </div>
            ) : (
                users.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                        onClick={() => handleUserClick(user.id)}
                    >
                        <Avatar
                            src={user.avatar_url
                                ? `http://localhost:8000/${user.avatar_url}`
                                : DefaultImage}
                            size={40}
                        />
                        <div className="flex-1">
                            <div className="font-medium">{user.nickname || user.username}</div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default UserList; 