import DefaultImage from "@assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png";
import Avatar from "@components/Avatar";
import Button from "@components/Button";
import type { User } from "@context/interface";
import { useMountApiCall } from "@hooks/hooks";
import { userLogout } from "@store/auth";
import type { AppDispatch, RootState } from "@store/redux";
import { getFollowers, getUserSuggestion } from "@store/user";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface FriendListHomeProp {
    currentUser: User;
}

const FriendListHome = ({ currentUser }: FriendListHomeProp) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const loadingStates = useSelector((state: RootState) => state.user.loadingStates);
    const followers = useSelector((state: RootState) => state.user.followers);
    const userSuggestion = useSelector((state: RootState) => state.user.userSuggestion);
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

    const handleUserClick = (userId: number) => {
        navigate(`/user/${userId}`);
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="bg-white rounded-lg p-6 shadow-sm">
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
                        {followers.slice(0, 10).map((follower: any) => (
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
                    </ul>
                )}
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="mb-4 flex justify-between text-sm text-gray-500 font-medium">
                    <p>Gợi ý theo dõi</p>
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
                                            {user.username}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.nickname}
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
                                        Theo dõi
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FriendListHome;

