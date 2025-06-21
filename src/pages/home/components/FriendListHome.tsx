import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store/redux";
import type { User, FollowUser } from "../../../context/interface";
import { getFollowers, followUser, getFollowStatus, selectUserLoadingStates, selectFollowers, selectUserError } from "../../../store/user";
import { userLogout } from "../../../store/auth";
import Avatar from "../../../provider/layout/components/Avatar";
import Button from "../../../provider/layout/components/Button";
import { useMessage } from "../../../provider/layout/MessageProvider";
import DefaultImage from "../../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png";

interface FriendListHomeProp {
    currentUser: User;
}

const FriendListHome = ({ currentUser }: FriendListHomeProp) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const loadingStates = useSelector(selectUserLoadingStates);
    const followers = useSelector(selectFollowers);
    const error = useSelector(selectUserError);
    const [followBackLoading, setFollowBackLoading] = useState<number | null>(null);
    const [followStatuses, setFollowStatuses] = useState<Record<number, string>>({});
    const { error: showError, success: showSuccess } = useMessage();

    useEffect(() => {
        if (currentUser?.id) {
            dispatch(getFollowers(currentUser.id));
        }
    }, [dispatch, currentUser?.id]);

    // Check follow status for each follower
    useEffect(() => {
        const checkFollowStatuses = async () => {
            if (followers.length > 0 && currentUser?.id) {
                const statuses: Record<number, string> = {};
                
                for (const follower of followers) {
                    try {
                        const result = await dispatch(getFollowStatus(follower.id)).unwrap();
                        statuses[follower.id] = result.status;
                    } catch (error) {
                        console.error(`Error checking follow status for user ${follower.id}:`, error);
                        statuses[follower.id] = 'not_following';
                    }
                }
                
                setFollowStatuses(statuses);
            }
        };

        checkFollowStatuses();
    }, [followers, currentUser?.id, dispatch]);

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

    const handleFollowBack = async (followerId: number) => {
        try {
            setFollowBackLoading(followerId);
            await dispatch(followUser(followerId)).unwrap();
            showSuccess("Đã theo dõi thành công!");
            
            // Update follow status for this user
            setFollowStatuses(prev => ({
                ...prev,
                [followerId]: 'following'
            }));
            
            // Refresh followers list to update the UI
            if (currentUser?.id) {
                dispatch(getFollowers(currentUser.id));
            }
        } catch (error: any) {
            console.error('Error following back user:', error);
            showError(error.message || "Có lỗi xảy ra khi theo dõi. Vui lòng thử lại.");
        } finally {
            setFollowBackLoading(null);
        }
    };

    const getFollowButtonProps = (followerId: number) => {
        const status = followStatuses[followerId];
        const isLoading = followBackLoading === followerId;
        
        if (isLoading) {
            return {
                text: 'Đang xử lý...',
                disabled: true
            };
        }
        
        switch (status) {
            case 'following':
                return {
                    text: 'Đang theo dõi',
                    disabled: true
                };
            case 'pending':
                return {
                    text: 'Đã gửi yêu cầu',
                    disabled: true
                };
            case 'not_following':
            default:
                return {
                    text: 'Theo dõi lại',
                    disabled: false
                };
        }
    };

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
                    <div className="mb-2">⚠️</div>
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
                    <div className="mb-2">👥</div>
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
                                        @{follower.username}
                                    </p>
                                </div>
                            </div>
                            <button 
                                className="text-blue-500 text-xs font-medium hover:text-blue-600 transition-colors px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleFollowBack(follower.id)}
                                disabled={getFollowButtonProps(follower.id).disabled}
                            >
                                {getFollowButtonProps(follower.id).text}
                            </button>
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

