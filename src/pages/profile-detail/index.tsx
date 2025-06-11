import { HomeOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DefaultImage from '../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import Avatar from "../../provider/layout/components/Avatar";
import Button from "../../provider/layout/components/Button";
import Text from "../../provider/layout/components/Text";
import UserPostList from "./component/UserPostList";
import type { AppDispatch, RootState } from "../../store/redux";
import { getAllPostsByUser } from "../../store/post/thunk";
import { Card } from "antd";

const profileTabs = [
    { id: "posts", label: "Bài viết", icon: <HomeOutlined /> },
    { id: "share", label: "Chia sẻ", icon: <ShareAltOutlined /> },
];

const ProfileDetail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { loading, posts } = useSelector((state: RootState) => state.post);
    const [activeTab, setActiveTab] = useState("posts");

    useEffect(() => {
        const getUserAPI = async () => {
            if (activeTab === "posts" && user?.id && token) {
                await dispatch(getAllPostsByUser(user.id)).unwrap();
            }
        }
        getUserAPI();
        // eslint-disable-next-line
    }, []);

    // Fetch posts when tab changes or user changes
    const fetchTabData = async (tabId: string) => {
        if (tabId === "posts" && user?.id && token) {
            await dispatch(getAllPostsByUser({ userId: user.id, token: token })).unwrap();
        }
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        fetchTabData(tabId);
    };

    const handleEditProfileOnClick = () => {
        navigate('/edit-account');
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

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 min-h-[500px]">
            <div className="flex items-center justify-between gap-6 mb-10">
                {/* Avatar and Username */}
                <div className="flex items-center gap-4">
                    <Avatar
                        src={user?.avatar_url
                            ? `http://localhost:8000/${user.avatar_url}`
                            : DefaultImage}
                        size={40}
                    />
                    <div>
                        <Text type="h2" className="text-xl font-semibold">{user.username ?? "Guest"}</Text>
                        <Text type="caption">{user.nickname ?? "Không có"}</Text>
                    </div>
                </div>

                {/* Stats Section (Posts, Following, Followers) */}
                <div className="flex align-bottom mb-4 text-sm">
                    <div className="flex gap-10">
                        <div>
                            <Text type="body"><strong>{posts ? posts.length : 0}</strong> bài viết</Text>
                        </div>
                        <div>
                            <Text type="body"><strong>2</strong> người theo dõi</Text>
                        </div>
                        <div>
                            <Text type="body"><strong>2</strong> người theo dõi</Text>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Button */}
                <Button
                    variant="secondary"
                    className="px-4 py-1 border text-sm rounded"
                    fullWidth={false}
                    onClick={handleEditProfileOnClick}
                >
                    Chỉnh sửa trang cá nhân
                </Button>
            </div>

            {/* Personal Info */}
            <div className="mt-4">
                <Card>
                    <Text type="h3" className="text-lg font-semibold mb-3">Thông tin cá nhân</Text>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-500"><i className="fas fa-map-marker-alt"></i></span>
                            <Text type="body"><strong>Địa chỉ:</strong> {user.address ?? "Không có"}</Text>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500"><i className="fas fa-user"></i></span>
                            <Text type="body"><strong>Giới tính:</strong> {handleFormatGender(user?.gender) ?? "Chưa cập nhật"}</Text>
                        </div>
                        <div className="flex items-center gap-2 md:col-span-2">
                            <span className="text-purple-500"><i className="fas fa-birthday-cake"></i></span>
                            <Text type="body"><strong>Ngày sinh:</strong> {user.birthday ?? "Chưa cập nhật"}</Text>
                        </div>
                        <div className="flex items-center gap-2 md:col-span-2">
                            <span className="text-yellow-500"><i className="fas fa-star"></i></span>
                            <Text type="body"><strong>Sở thích:</strong> {user.hobbies ?? "Không có"}</Text>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                        <Text type="body" className="block text-gray-700 mb-1 font-semibold">
                            <span className="text-pink-500 mr-2"><i className="fas fa-info-circle"></i></span>
                            Tiểu sử:
                        </Text>
                        <Text type="body" className="text-gray-600 italic">
                            {user.bio ?? "Không có"}
                        </Text>
                    </div>
                </Card>
            </div>

            {/* Tabs and Content Section moved to UserPostList */}
            <UserPostList
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={profileTabs}
                loading={loading}
                posts={posts}
            />
        </div>
    );
};

export default ProfileDetail;
