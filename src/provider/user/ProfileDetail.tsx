import { CalendarOutlined, EnvironmentOutlined, HomeOutlined, InfoCircleOutlined, ManOutlined, PhoneOutlined, ShareAltOutlined, StarOutlined, UserOutlined, WomanOutlined } from "@ant-design/icons";
import DefaultImage from '@assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import { createConversation, selectConversation } from '@store/message';
import { Avatar, Card, Divider } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@components/Button";
import Text from "@components/Text";
import { useMessage } from "@layout/MessageProvider";
import { clearPosts, getAllPostsByUser } from "@store/post";
import type { AppDispatch, RootState } from "@store/redux";
import {
    followUser,
    getFollowers,
    getFollowing,
    getFollowStatus,
    getUserById,
    resetUserState,
    setFollowersModalVisible,
    setFollowingModalVisible,
    setFollowLoading,
    unfollowUser
} from "../../store/user";
import PostUserList from "../post/PostUserList";
import FollowersModal from "./components/FollowersModal";
import FollowingModal from "./components/FollowingModal";
import { ProfileDetailSkeleton } from "./components/ProfileDetailSkeleton";

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
    const postLoadingStates = useSelector((state: RootState) => state.post.loadingStates);
    const { error: showError } = useMessage();

    const followLoading = useSelector((state: RootState) => state.user.profileDetailStates.followLoading);
    const followersModalVisible = useSelector((state: RootState) => state.user.profileDetailStates.followersModalVisible);
    const followingModalVisible = useSelector((state: RootState) => state.user.profileDetailStates.followingModalVisible);

    const [activeTab, setActiveTab] = useState("posts");
    const [userError, setUserError] = useState<string | null>(null);

    const currentUserId = userId ? parseInt(userId) : authUser?.id;
    const isOwnProfile = !userId || currentUserId === authUser?.id;
    const displayUser = isOwnProfile ? authUser : selectedUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId && token) {
                if (parseInt(userId) === authUser?.id) {
                    navigate('/profile', { replace: true });
                    return;
                }
                // Chỉ reset state khi thực sự chuyển sang user khác
                if (selectedUser?.id !== parseInt(userId)) {
                    dispatch(resetUserState());
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
    }, [userId, token, authUser?.id, navigate, dispatch, selectedUser?.id]);

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
                // Clear posts when user changes
                dispatch(clearPosts());
                await dispatch(getAllPostsByUser(currentUserId)).unwrap();
            }
        }
        getUserAPI();
    }, [currentUserId, activeTab, token, dispatch]);

    // Clear posts when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearPosts());
            dispatch(resetUserState());
        };
    }, [dispatch]);

    // Fetch posts when tab changes or user changes
    const fetchTabData = async (tabId: string) => {
        if (tabId === "posts" && currentUserId && token) {
            dispatch(clearPosts());
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
        dispatch(setFollowLoading(true));
        try {
            if (followStatus?.status === 'accepted') {
                await dispatch(unfollowUser(displayUser.id)).unwrap();
            } else if (followStatus?.status === 'not_following' || !followStatus) {
                await dispatch(followUser(displayUser.id)).unwrap();
            }

            if (userId) {
                await dispatch(getFollowStatus(parseInt(userId))).unwrap();
            }

            if (currentUserId) {
                await Promise.all([
                    dispatch(getFollowers(currentUserId)).unwrap(),
                    dispatch(getFollowing(currentUserId)).unwrap()
                ]);
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        } finally {
            dispatch(setFollowLoading(false));
        }
    };

    const handleMessageClick = async () => {
        if (!displayUser?.id || isOwnProfile) return;
        try {
            const resultAction = await dispatch(createConversation({ userId: displayUser.id.toString() }));
            if (createConversation.fulfilled.match(resultAction)) {
                const conversation = resultAction.payload;
                dispatch(selectConversation(conversation.id));
                navigate('/messages');
            } else {
                showError('Không thể tạo cuộc hội thoại.');
            }
        } catch (error) {
            showError('Đã xảy ra lỗi khi tạo cuộc hội thoại.');
        }
    };

    const handleFollowersClick = () => {
        dispatch(setFollowersModalVisible(true));
    };

    const handleFollowingClick = () => {
        dispatch(setFollowingModalVisible(true));
    };

    const handleFormatGender = (userGender: string | undefined) => {
        if (!userGender) return "Chưa cập nhật";
        return userGender === "male" ? "Nam" : userGender === "female" ? "Nữ" : "Khác";
    };

    const getFollowButtonText = () => {
        if (followLoading) return "Đang xử lý...";
        if (!followStatus) return "Theo dõi";

        switch (followStatus.status) {
            case 'accepted':
                return "Hủy theo dõi";
            case 'pending':
                return "Đã gửi yêu cầu";
            case 'not_following':
            default:
                return "Theo dõi";
        }
    };

    const getFollowButtonVariant = () => {
        if (followLoading) return 'secondary';
        if (!followStatus) return 'primary';

        switch (followStatus.status) {
            case 'accepted':
                return 'secondary';
            case 'pending':
                return 'secondary';
            case 'not_following':
            default:
                return 'primary';
        }
    };

    const isFollowButtonDisabled = () => {
        return followLoading || followStatus?.status === 'pending';
    };

    if (loadingStates.getUserById) {
        return <ProfileDetailSkeleton />;
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
                            disabled={isFollowButtonDisabled()}
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
                    <Text type="h3" className="text-lg font-semibold text-center mb-4">Thông tin cá nhân</Text>
                    <Divider />
                    <div className="flex flex-col gap-4 px-2 md:px-8">
                        <div className="flex items-center gap-3">
                            <UserOutlined className="text-blue-500 text-lg" />
                            <Text type="body"><strong>Họ tên:</strong> {displayUser.username ?? "Guest"}</Text>
                        </div>
                        <div className="flex items-center gap-3">
                            <UserOutlined className="text-purple-500 text-lg" />
                            <Text type="body"><strong>Nickname:</strong> {displayUser.nickname ?? "Không có"}</Text>
                        </div>
                        <div className="flex items-center gap-3">
                            {displayUser.gender === "male" ? (
                                <ManOutlined className="text-blue-400 text-lg" />
                            ) : displayUser.gender === "female" ? (
                                <WomanOutlined className="text-pink-400 text-lg" />
                            ) : (
                                <UserOutlined className="text-gray-400 text-lg" />
                            )}
                            <Text type="body"><strong>Giới tính:</strong> {handleFormatGender(displayUser?.gender) ?? "Chưa cập nhật"}</Text>
                        </div>
                        <div className="flex items-center gap-3">
                            <CalendarOutlined className="text-orange-400 text-lg" />
                            <Text type="body"><strong>Ngày sinh:</strong> {displayUser.birthday ?? "Chưa cập nhật"}</Text>
                        </div>
                        <div className="flex items-center gap-3">
                            <PhoneOutlined className="text-green-500 text-lg" />
                            <Text type="body"><strong>Số điện thoại:</strong> {displayUser.phone ?? "Chưa cập nhật"}</Text>
                        </div>
                        <div className="flex items-center gap-3">
                            <EnvironmentOutlined className="text-blue-400 text-lg" />
                            <Text type="body"><strong>Địa chỉ:</strong> {displayUser.address ?? "Không có"}</Text>
                        </div>
                        <div className="flex items-center gap-3">
                            <StarOutlined className="text-yellow-500 text-lg" />
                            <Text type="body"><strong>Sở thích:</strong> {displayUser.hobbies ?? "Không có"}</Text>
                        </div>
                    </div>
                    {/* Bio block riêng biệt, nổi bật */}
                    <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-2">
                            <InfoCircleOutlined className="text-pink-500 text-lg" />
                            <span className="font-semibold text-base text-gray-700">Tiểu sử</span>
                        </div>
                        <Text type="body" className="text-gray-600 italic text-base">
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

            {/* Modal Components */}
            <FollowersModal
                visible={followersModalVisible}
                onClose={() => dispatch(setFollowersModalVisible(false))}
            />

            <FollowingModal
                visible={followingModalVisible}
                onClose={() => dispatch(setFollowingModalVisible(false))}
            />
        </div>
    );
};

export default ProfileDetail;
