import { HomeOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DefaultImage from '../../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import { Avatar, Card, Divider, Modal, Button as AntButton } from "antd";
import Button from "../components/Button";
import { getAllPostsByUser, selectPostLoadingStates } from "../../../store/post";
import { getUserById, getFollowers, getFollowing, getFollowStatus, followUser, unfollowUser } from "../../../store/user";
import type { AppDispatch, RootState } from "../../../store/redux";
import Text from "../components/Text";
import PostUserList from "../post/PostUserList";

const profileTabs = [
    { id: "posts", label: "Bài viết", icon: <HomeOutlined /> },
    { id: "share", label: "Chia sẻ", icon: <ShareAltOutlined /> },
];

const ProfileDetail = () => {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { user: authUser, token } = useSelector((state: RootState) => state.auth);
    const { loadingStates, selectedUser, followStatus, followers, following } = useSelector((state: RootState) => state.user);
    const { posts } = useSelector((state: RootState) => state.post);
    const postLoadingStates = useSelector(selectPostLoadingStates);
    const [activeTab, setActiveTab] = useState("posts");
    const [followLoading, setFollowLoading] = useState(false);
    const [userError, setUserError] = useState<string | null>(null);
    const [followersModalVisible, setFollowersModalVisible] = useState(false);
    const [followingModalVisible, setFollowingModalVisible] = useState(false);
    const [modalFollowStatuses, setModalFollowStatuses] = useState<Record<number, string>>({});
    const [modalFollowLoading, setModalFollowLoading] = useState<number | null>(null);

    const currentUserId = userId ? parseInt(userId) : authUser?.id;
    const isOwnProfile = !userId || currentUserId === authUser?.id;
    const displayUser = isOwnProfile ? authUser : selectedUser;

    console.log('ProfileDetail render:', {
        userId,
        authUser,
        selectedUser,
        currentUserId,
        isOwnProfile,
        displayUser,
        followStatus,
        followers,
        following
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId && token) {
                // Nếu user đang đăng nhập xem profile của chính mình, redirect về /profile
                if (parseInt(userId) === authUser?.id) {
                    navigate('/profile', { replace: true });
                    return;
                }

                try {
                    setUserError(null);
                    await dispatch(getUserById(parseInt(userId))).unwrap();
                } catch (error: any) {
                    console.error('Error fetching user:', error);
                    setUserError(error.message || 'Không thể tải thông tin người dùng');
                }
            }
        };

        fetchUserData();
    }, [userId, token, dispatch, authUser?.id, navigate]);

    useEffect(() => {
        const fetchFollowStatus = async () => {
            if (userId && token && !isOwnProfile) {
                try {
                    await dispatch(getFollowStatus(parseInt(userId))).unwrap();
                } catch (error: any) {
                    console.error('Error fetching follow status:', error);
                }
            }
        };

        fetchFollowStatus();
    }, [userId, token, isOwnProfile, dispatch]);

    useEffect(() => {
        const fetchFollowersAndFollowing = async () => {
            if (currentUserId && token) {
                try {
                    await Promise.all([
                        dispatch(getFollowers(currentUserId)).unwrap(),
                        dispatch(getFollowing(currentUserId)).unwrap()
                    ]);
                } catch (error: any) {
                    console.error('Error fetching followers/following:', error);
                }
            }
        };

        fetchFollowersAndFollowing();
    }, [currentUserId, token, dispatch]);

    useEffect(() => {
        const getUserAPI = async () => {
            if (activeTab === "posts" && currentUserId && token) {
                await dispatch(getAllPostsByUser(currentUserId)).unwrap();
            }
        }
        getUserAPI();
        // eslint-disable-next-line
    }, [currentUserId, activeTab]);

    // Fetch posts when tab changes or user changes
    const fetchTabData = async (tabId: string) => {
        if (tabId === "posts" && currentUserId && token) {
            await dispatch(getAllPostsByUser(currentUserId)).unwrap();
        }
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        fetchTabData(tabId);
    };

    const handleEditProfileOnClick = () => {
        navigate('/edit-account');
    };

    const handleFollowClick = async () => {
        if (!displayUser?.id || !token) return;
        setFollowLoading(true);
        try {
            const isFollowing = (displayUser as any)?.is_following ?? false;
            if (isFollowing) {
                await dispatch(unfollowUser(displayUser.id)).unwrap();
            } else {
                await dispatch(followUser(displayUser.id)).unwrap();
            }

            // Refresh user data to get updated follow status
            if (userId) {
                await dispatch(getUserById(parseInt(userId))).unwrap();
                await dispatch(getFollowStatus(parseInt(userId))).unwrap();
            }

            // Refresh followers/following lists
            if (currentUserId) {
                await Promise.all([
                    dispatch(getFollowers(currentUserId)).unwrap(),
                    dispatch(getFollowing(currentUserId)).unwrap()
                ]);
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        } finally {
            setFollowLoading(false);
        }
    };

    const handleMessageClick = () => {
        console.log('Message user:', displayUser?.id);
    };

    const handleFollowersClick = () => {
        setFollowersModalVisible(true);
    };

    const handleFollowingClick = () => {
        setFollowingModalVisible(true);
    };

    // Check follow statuses when modals are opened
    useEffect(() => {
        if (followersModalVisible && followers) {
            checkModalFollowStatuses(followers);
        }
    }, [followersModalVisible, followers]);

    useEffect(() => {
        if (followingModalVisible && following) {
            checkModalFollowStatuses(following);
        }
    }, [followingModalVisible, following]);

    const handleModalFollow = async (userId: number) => {
        try {
            setModalFollowLoading(userId);
            await dispatch(followUser(userId)).unwrap();

            // Update follow status
            setModalFollowStatuses(prev => ({
                ...prev,
                [userId]: 'following'
            }));
        } catch (error: any) {
            console.error('Error following user in modal:', error);
        } finally {
            setModalFollowLoading(null);
        }
    };

    const checkModalFollowStatuses = async (users: any[]) => {
        if (users.length > 0 && token) {
            const statuses: Record<number, string> = {};

            for (const user of users) {
                try {
                    const result = await dispatch(getFollowStatus(user.id)).unwrap();
                    statuses[user.id] = result.status;
                } catch (error) {
                    console.error(`Error checking follow status for user ${user.id}:`, error);
                    statuses[user.id] = 'not_following';
                }
            }

            setModalFollowStatuses(statuses);
        }
    };

    const handleFormatGender = (userGender: string | undefined) => {
        if (userGender) {
            if (userGender === 'male')
                return "Nam"
            if (userGender === 'female')
                return "Nữ"
            return "Không xác định"
        }
    }

    const getFollowButtonText = () => {
        if (isOwnProfile || followStatus?.status === 'self') return null;

        if (followLoading) return 'Đang xử lý...';

        if (followStatus?.status === 'following') return 'Đang theo dõi';
        if (followStatus?.status === 'pending') return 'Đã gửi yêu cầu';
        if (followStatus?.status === 'not_following') return 'Theo dõi';

        // Fallback to old logic
        const isFollowing = (displayUser as any)?.is_following ?? false;
        return isFollowing ? 'Đang theo dõi' : 'Theo dõi';
    };

    const getFollowButtonVariant = () => {
        if (isOwnProfile || followStatus?.status === 'self') return 'secondary';

        if (followStatus?.status === 'following' || followStatus?.status === 'pending') {
            return 'secondary';
        }

        return 'primary';
    };

    const renderUserList = (users: any[], title: string) => (
        <div className="max-h-96 overflow-y-auto">
            {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {title === 'Người theo dõi' ? 'Chưa có người theo dõi' : 'Chưa theo dõi ai'}
                </div>
            ) : (
                users.map((user) => {
                    const followStatus = modalFollowStatuses[user.id];
                    const isLoading = modalFollowLoading === user.id;

                    const getFollowButtonProps = () => {
                        if (isLoading) {
                            return {
                                text: 'Đang xử lý...',
                                disabled: true
                            };
                        }

                        switch (followStatus) {
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
                                    text: 'Theo dõi',
                                    disabled: false
                                };
                        }
                    };

                    const buttonProps = getFollowButtonProps();

                    return (
                        <div
                            key={user.id}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <div
                                className="flex items-center gap-3 flex-1 cursor-pointer"
                                onClick={() => {
                                    navigate(`/user/${user.id}`);
                                    setFollowersModalVisible(false);
                                    setFollowingModalVisible(false);
                                }}
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
                            <AntButton
                                type="primary"
                                size="small"
                                disabled={buttonProps.disabled}
                                loading={isLoading}
                                onClick={() => handleModalFollow(user.id)}
                                className="text-xs"
                            >
                                {buttonProps.text}
                            </AntButton>
                        </div>
                    );
                })
            )}
        </div>
    );

    if (loadingStates.getUserById) {
        return <div className="w-full max-w-4xl mx-auto px-4 py-8">Loading...</div>;
    }

    if (userError) {
        return <div className="w-full max-w-4xl mx-auto px-4 py-8 text-red-500">{userError}</div>;
    }

    if (!displayUser) {
        return <div className="w-full max-w-4xl mx-auto px-4 py-8">User not found</div>;
    }

    const followersCount = followers?.length || 0;
    const followingCount = following?.length || 0;

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 min-h-[500px]">
            <div className="flex items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <Avatar
                        src={displayUser?.avatar_url
                            ? `http://localhost:8000/${displayUser.avatar_url}`
                            : DefaultImage}
                        size={40}
                    />
                    <div>
                        <Text type="h2" className="text-xl font-semibold">{displayUser.username ?? "Guest"}</Text>
                        <Text type="caption">{displayUser.nickname ?? "Không có"}</Text>
                    </div>
                </div>

                <div className="flex align-bottom mb-4 text-sm">
                    <div className="flex gap-10">
                        <div>
                            <Text type="body"><strong>{posts ? posts.length : 0}</strong> bài viết</Text>
                        </div>
                        <div
                            className="cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={handleFollowersClick}
                        >
                            <Text type="body"><strong>{followersCount}</strong> người theo dõi</Text>
                        </div>
                        <div
                            className="cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={handleFollowingClick}
                        >
                            <Text type="body"><strong>{followingCount}</strong> đang theo dõi</Text>
                        </div>
                    </div>
                </div>

                {isOwnProfile || followStatus?.status === 'self' ? (
                    <Button
                        variant="secondary"
                        className="px-4 py-1 border text-sm rounded"
                        fullWidth={false}
                        onClick={handleEditProfileOnClick}
                    >
                        Chỉnh sửa trang cá nhân
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button
                            variant={getFollowButtonVariant()}
                            className="px-4 py-1 text-sm rounded"
                            fullWidth={false}
                            onClick={handleFollowClick}
                            disabled={followLoading}
                        >
                            {getFollowButtonText()}
                        </Button>
                        <Button
                            variant="secondary"
                            className="px-4 py-1 border text-sm rounded"
                            fullWidth={false}
                            onClick={handleMessageClick}
                        >
                            Nhắn tin
                        </Button>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <Card>
                    <Text type="h3" className="text-lg font-semibold text-center">Thông tin cá nhân</Text>
                    <Divider />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-500"><i className="fas fa-map-marker-alt"></i></span>
                            <Text type="body"><strong>Địa chỉ:</strong> {displayUser.address ?? "Không có"}</Text>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500"><i className="fas fa-user"></i></span>
                            <Text type="body"><strong>Giới tính:</strong> {handleFormatGender(displayUser?.gender) ?? "Chưa cập nhật"}</Text>
                        </div>
                        <div className="flex items-center gap-2 md:col-span-2">
                            <span className="text-purple-500"><i className="fas fa-birthday-cake"></i></span>
                            <Text type="body"><strong>Ngày sinh:</strong> {displayUser.birthday ?? "Chưa cập nhật"}</Text>
                        </div>
                        <div className="flex items-center gap-2 md:col-span-2">
                            <span className="text-yellow-500"><i className="fas fa-star"></i></span>
                            <Text type="body"><strong>Sở thích:</strong> {displayUser.hobbies ?? "Không có"}</Text>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                        <Text type="body" className="block text-gray-700 mb-1 font-semibold">
                            <span className="text-pink-500 mr-2"><i className="fas fa-info-circle"></i></span>
                            Tiểu sử:
                        </Text>
                        <Text type="body" className="text-gray-600 italic">
                            {displayUser.bio ?? "Không có"}
                        </Text>
                    </div>
                </Card>
            </div>

            <PostUserList
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={profileTabs}
                loading={postLoadingStates.getAllPostsByUser}
                posts={posts}
            />

            {/* Followers Modal */}
            <Modal
                title="Người theo dõi"
                open={followersModalVisible}
                onCancel={() => setFollowersModalVisible(false)}
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
                    renderUserList(followers || [], 'Người theo dõi')
                )}
            </Modal>

            {/* Following Modal */}
            <Modal
                title="Đang theo dõi"
                open={followingModalVisible}
                onCancel={() => setFollowingModalVisible(false)}
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
                    renderUserList(following || [], 'Đang theo dõi')
                )}
            </Modal>
        </div>
    );
};

export default ProfileDetail;
