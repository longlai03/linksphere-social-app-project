import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HomeOutlined, ShareAltOutlined, UserOutlined } from "@ant-design/icons";
import Avatar from "../../provider/layout/components/Avatar";
import PostList from "../../provider/layout/PostList";
import Text from "../../provider/layout/components/Text";
import Button from "../../provider/layout/components/Button";
import Tabs from "../../provider/layout/components/Tabs";
import DefaultImage from '../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import type { RootState } from "../../store/redux";

const profileTabs = [
    { id: "posts", label: "Bài viết", icon: <HomeOutlined /> },
    { id: "share", label: "Chia sẻ", icon: <ShareAltOutlined /> },
];

type Post = {
    id: number;
    user: { name: string; avatar: string };
    image: string;
    caption: string;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    liked: boolean;
};

const ProfileDetail = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = useState("posts");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTabData = async (tabId: string) => {
        setLoading(true);
        try {
            await new Promise((res) => setTimeout(res, 500)); // Giả lập gọi API
        } catch (err) {
            console.error("Lỗi khi fetch dữ liệu:", err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        fetchTabData(tabId);
    };

    const handleEditProfileOnClick = () => {
        navigate('/edit-account');
    };

    useEffect(() => {
        handleTabChange("posts");
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 min-h-[500px]">
            <div className="flex items-center justify-between gap-6 mb-10">
                {/* Avatar and Username */}
                <div className="flex items-center gap-4">
                    <Avatar src={user.avatar_url ?? DefaultImage} size={80} />
                    <div>
                        <Text type="h2" className="text-xl font-semibold">{user.username ?? "Guest"}</Text>
                        <Text type="caption">{user.nickname ?? "Không có"}</Text>
                    </div>
                </div>

                {/* Stats Section (Posts, Following, Followers) */}
                <div className="flex align-bottom mb-4 text-sm">
                    <div className="flex gap-10">
                        <div>
                            <Text type="body"><strong>2</strong> bài viết</Text>
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
            <div className="mt-4 text-sm">
                <div className="mb-2">
                    <Text type="body"><strong>Địa chỉ:</strong> {user.address ?? "Không có"}</Text>
                </div>
                <div className="mb-2">
                    <Text type="body"><strong>Tiểu sử:</strong> {user.bio ?? "Không có"}</Text>
                </div>
                <div className="mb-2">
                    <Text type="body"><strong>Sở thích:</strong> {user.hobbies ?? "Không có"}</Text>
                </div>
                <div className="mb-2">
                    <Text type="body"><strong>Giới tính:</strong> {user.gender ?? "Chưa cập nhật"}</Text>
                </div>
                <div className="mb-2">
                    <Text type="body"><strong>Ngày sinh:</strong> {user.birthday ?? "Chưa cập nhật"}</Text>
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={profileTabs}
            />

            {/* Content Section */}
            <div className="pt-6">
                {loading ? (
                    <p className="text-center text-sm text-gray-400 py-20">Đang tải dữ liệu...</p>
                ) : posts.length > 0 ? (
                    <PostList posts={posts} />
                ) : (
                    <p className="text-center text-sm text-gray-400 py-20">Không có nội dung</p>
                )}
            </div>
        </div>
    );
};

export default ProfileDetail;
