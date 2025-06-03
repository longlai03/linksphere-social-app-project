import { useEffect, useState } from "react";
import Avatar from "../../provider/layout/components/Avatar";
import PostList from "../../provider/layout/PostList";
import Text from "../../provider/layout/components/Text";
import Button from "../../provider/layout/components/Button";
import Tabs from "../../provider/layout/components/Tabs";
import GridOnIcon from '@mui/icons-material/GridOn';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DefaultImage from '../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png'
import { useSelector } from "react-redux";
import type { RootState } from "../../store/redux";
import { useNavigate } from "react-router-dom";

const profileTabs = [
    { id: "posts", label: "Bài viết", icon: <GridOnIcon fontSize="small" /> },
    { id: "share", label: "Chia sẻ", icon: <ShareOutlinedIcon fontSize="small" /> },
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

    // const user = {
    //     username: "user-name",
    //     fullName: "full-name",
    //     avatar: "https://i.pravatar.cc/150?img=20",
    //     posts: 2,
    //     followers: 47,
    //     following: 38,
    // };

    const fetchTabData = async (tabId: string) => {
        setLoading(true);
        try {
            await new Promise((res) => setTimeout(res, 500)); // giả lập gọi API
            // if (tabId === "posts") {
            //     setPosts([
            //         {
            //             id: 1,
            //             user: { name: user.username, avatar: user.avatar_url },
            //             image: "https://picsum.photos/id/10/600/600",
            //             caption: "Caption of post 1",
            //             createdAt: "1 giờ trước",
            //             likesCount: 12,
            //             commentsCount: 3,
            //             liked: false,
            //         },
            //         {
            //             id: 2,
            //             user: { name: user.username, avatar: user.avatar },
            //             image: "https://picsum.photos/id/11/600/600",
            //             caption: "Caption of post 2",
            //             createdAt: "2 giờ trước",
            //             likesCount: 7,
            //             commentsCount: 1,
            //             liked: true,
            //         },
            //     ]);
            // } else {
            //     setPosts([]);
            // }
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
    }

    useEffect(() => {
        handleTabChange("posts");
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 min-h-[500px]">
            <div className="flex gap-10 items-center mb-10">
                <Avatar src={user.avatar_url ?? DefaultImage} size={80} />
                <div className="w-full">
                    <div className="flex items-center justify-between gap-4">
                        <Text type="h2" className="text-xl font-semibold">{user.username}</Text>
                        <Button
                            variant="secondary"
                            className="px-4 py-1 border text-sm rounded"
                            fullWidth={false}
                            onClick={handleEditProfileOnClick}
                        >
                            Chỉnh sửa trang cá nhân
                        </Button>
                    </div>
                    {/* <div className="flex gap-10 mt-3 text-sm">
                        <div>
                            <Text type="body"><strong>{user.posts}</strong> bài viết</Text>
                        </div>
                        <div onClick={() => { }} className="cursor-pointer">
                            <Text type="body"><strong>{user.followers}</strong> người theo dõi</Text>
                        </div>
                        <div onClick={() => { }} className="cursor-pointer">
                            <Text type="body">Đang theo dõi <strong>{user.following}</strong> người dùng</Text>
                        </div>
                    </div>
                    <Text type="body" className="mt-2 font-medium">{user.fullName}</Text> */}
                </div>
            </div>
            <Tabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={profileTabs}
            />
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
