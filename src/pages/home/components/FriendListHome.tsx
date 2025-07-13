import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DefaultImage from "@assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png";
import type { User } from "@context/interface";
import Avatar from "@components/Avatar";
import Button from "@components/Button";
import { userLogout } from "@store/auth";
import type { AppDispatch, RootState } from "@store/redux";
import { getFollowers, getUserSuggestion, followUser, unfollowUser } from "@store/user";
import { useMountApiCall } from "@hooks/hooks";
import Text from "@components/Text";

interface FriendListHomeProp {
    currentUser: User;
}

const FriendListHome = ({ currentUser }: FriendListHomeProp) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const loadingStates = useSelector((state: RootState) => state.user.loadingStates);
    const followers = useSelector((state: RootState) => state.user.followers);
    const userSuggestion = useSelector((state: RootState) => state.user.userSuggestion);
    const error = useSelector((state: RootState) => state.user.error);
    const [followLoading, setFollowLoading] = useState<number | null>(null);

    const fetchFollowers = useMountApiCall(getFollowers, [currentUser?.id], !!currentUser?.id && !loadingStates.getFollowers);
    const fetchUserSuggestion = useMountApiCall(getUserSuggestion, [], !loadingStates.getUserSuggestion);

    useEffect(() => {
        if (currentUser?.id && !loadingStates.getFollowers) {
            fetchFollowers(currentUser.id);
        }
    }, [fetchFollowers, currentUser?.id, loadingStates.getFollowers]);

    useEffect(() => {
        if (!loadingStates.getUserSuggestion) {
            fetchUserSuggestion(null);
        }
    }, [fetchUserSuggestion, loadingStates.getUserSuggestion]);
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

    const handleFollowUser = async (userId: number) => {
        if (!currentUser?.id) return;

        setFollowLoading(userId);
        try {
            await dispatch(followUser(userId)).unwrap();
            // Refresh user suggestions after following
            fetchUserSuggestion(null);
        } catch (error: any) {
            console.error("Error following user:", error);
        } finally {
            setFollowLoading(null);
        }
    };

    const handleUnfollowUser = async (userId: number) => {
        if (!currentUser?.id) return;

        setFollowLoading(userId);
        try {
            await dispatch(unfollowUser(userId)).unwrap();
            // Refresh user suggestions after unfollowing
            fetchUserSuggestion(null);
        } catch (error: any) {
            console.error("Error unfollowing user:", error);
        } finally {
            setFollowLoading(null);
        }
    };

    const handleUserClick = (userId: number) => {
        navigate(`/user/${userId}`);
    };

    return (
        <div className="flex flex-col gap-5">
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
            <div className="bg-white rounded-lg p-6 shadow-sm">
                {/* Friend Suggestions Section */}
                <div className="mb-4 flex justify-between text-sm text-gray-500 font-medium">
                    <p>Gợi ý kết bạn</p>
                </div>

                {loadingStates.getUserSuggestion ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                        <div className="mt-2 text-gray-500 text-sm">Đang tải...</div>
                    </div>
                ) : userSuggestion.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-sm">
                        <div>Không có gợi ý kết bạn</div>
                        <div className="text-xs mt-1">Vào tìm kiếm để khám phá thêm các người dùng khác</div>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {userSuggestion.slice(0, 5).map((user: any) => (
                            <li key={user.id} className="flex items-center justify-start p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div
                                    className="flex items-center gap-3 flex-1 cursor-pointer"
                                    onClick={() => handleUserClick(user.id)}
                                >
                                    <Avatar
                                        src={user.avatar_url
                                            ? `http://localhost:8000/${user.avatar_url}`
                                            : DefaultImage}
                                        size={32}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">
                                            {user.nickname || user.username}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.username}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUserClick(user.id)
                                        }}
                                    >
                                        {followLoading === user.id ? (
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                        ) : (
                                            "Theo dõi"
                                        )}
                                    </button>
                                </div>
                            </li>
                        ))}

                        {userSuggestion.length > 5 && (
                            <li className="text-center pt-2">
                                <button
                                    className="text-blue-500 text-xs font-medium hover:text-blue-600 transition-colors"
                                    onClick={() => navigate('/search')}
                                >
                                    Xem thêm {userSuggestion.length - 5} gợi ý khác
                                </button>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FriendListHome;

