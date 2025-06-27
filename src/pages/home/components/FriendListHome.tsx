import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DefaultImage from "../../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png";
import type { User } from "../../../context/interface";
import Avatar from "../../../components/Avatar";
import Button from "../../../components/Button";
import { useMessage } from "../../../layout/MessageProvider";
import { userLogout } from "../../../store/auth";
import type { AppDispatch, RootState } from "../../../store/redux";
import { getFollowers } from "../../../store/user";
import { useMountApiCall } from "../../../utils/hooks";
import Text from "../../../components/Text";

interface FriendListHomeProp {
    currentUser: User;
}

const FriendListHome = ({ currentUser }: FriendListHomeProp) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const loadingStates = useSelector((state: RootState) => state.user.loadingStates);
    const followers = useSelector((state: RootState) => state.user.followers);
    const error = useSelector((state: RootState) => state.user.error);
    const { error: showError, success: showSuccess } = useMessage();

    // Sử dụng custom hook để tránh gọi API nhiều lần
    const fetchFollowers = useMountApiCall(getFollowers, [currentUser?.id], !!currentUser?.id && !loadingStates.getFollowers);

    useEffect(() => {
        if (currentUser?.id && !loadingStates.getFollowers) {
            fetchFollowers(currentUser.id);
        }
    }, [fetchFollowers, currentUser?.id, loadingStates.getFollowers]);

    // Show error message when there's an error
    useEffect(() => {
        if (error) {
            showError(error);
        }
    }, [error, showError]);

    const handleLogout = async () => {
        try {
            const res = await dispatch(userLogout()).unwrap();
            console.log("Success log out:", res);
            navigate('/login');
        } catch (e: any) {
            console.error("Error logging out: ", e);
        }
    };

    const handleViewAllFollowers = () => {
        navigate('/profile');
    };

    const handleFollowerClick = (followerId: number) => {
        navigate(`/user/${followerId}`);
    };

    if (loadingStates.getFollowers) {
        return (
            <div className="bg-white rounded-lg p-4">
                <Text type="body" className="font-semibold mb-4">Bạn bè</Text>
                <div className="text-center text-gray-500">Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg p-4">
                <Text type="body" className="font-semibold mb-4">Bạn bè</Text>
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            {/* User Profile Section */}
            <div className="flex items-center gap-3 mb-6">
                <Avatar
                    src={currentUser?.avatar_url
                        ? `http://localhost:8000/${currentUser.avatar_url}`
                        : DefaultImage}
                    size={40}
                />
                <div>
                    <p className="text-sm font-semibold">{currentUser.username ?? "Guest"}</p>
                    <p className="text-xs text-gray-500">{currentUser.nickname ?? ""}</p>
                </div>
                <Button
                    onClick={handleLogout}
                    variant="plain"
                    className="ml-auto text-xs font-medium text-blue-500"
                    fullWidth={false}
                >
                    Đăng xuất
                </Button>
            </div>

            {/* Followers Section */}
            <div className="mb-4 flex justify-between text-sm text-gray-500 font-medium">
                <p>Người theo dõi bạn</p>
                <button
                    className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                    onClick={handleViewAllFollowers}
                >
                    Xem tất cả
                </button>
            </div>

            {loadingStates.getFollowers ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <div className="mt-2 text-gray-500 text-sm">Đang tải...</div>
                </div>
            ) : error ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                    <div>Không thể tải danh sách người theo dõi</div>
                    <button
                        className="text-blue-500 text-xs mt-2 hover:text-blue-600"
                        onClick={() => currentUser?.id && dispatch(getFollowers(currentUser.id))}
                    >
                        Thử lại
                    </button>
                </div>
            ) : followers.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                    <div>Chưa có người theo dõi nào</div>
                    <div className="text-xs mt-1">Hãy chia sẻ profile của bạn để có thêm người theo dõi</div>
                </div>
            ) : (
                <ul className="space-y-3">
                    {followers.slice(0, 5).map((follower: any) => (
                        <li key={follower.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <div
                                className="flex items-center gap-3 flex-1 cursor-pointer"
                                onClick={() => handleFollowerClick(follower.id)}
                            >
                                <Avatar
                                    src={follower.avatar_url
                                        ? `http://localhost:8000/${follower.avatar_url}`
                                        : DefaultImage}
                                    size={32}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">
                                        {follower.nickname || follower.username}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {follower.username}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}

                    {followers.length > 5 && (
                        <li className="text-center pt-2">
                            <button
                                className="text-blue-500 text-xs font-medium hover:text-blue-600 transition-colors"
                                onClick={handleViewAllFollowers}
                            >
                                Xem thêm {followers.length - 5} người khác
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default FriendListHome;

