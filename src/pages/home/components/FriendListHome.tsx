import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store/redux";
import type { User, FollowUser } from "../../../context/interface";
import { getFollowers } from "../../../store/user";
import { userLogout } from "../../../store/auth";
import Avatar from "../../../provider/layout/components/Avatar";
import Button from "../../../provider/layout/components/Button";
import DefaultImage from "../../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png";

interface FriendListHomeProp {
    currentUser: User;
}

const FriendListHome = ({ currentUser }: FriendListHomeProp) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { followers, loading, error } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (currentUser?.id) {
            dispatch(getFollowers(currentUser.id));
        }
    }, [dispatch, currentUser?.id]);

    const handleLogout = async () => {
        try {
            const res = await dispatch(userLogout()).unwrap();
            console.log("Success log out:", res);
            navigate('/login');
        } catch (e: any) {
            console.error("Error logging out: ", e);
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
                <button className="text-xs font-semibold">Xem tất cả</button>
            </div>

            {loading ? (
                <div className="text-center py-4">Đang tải...</div>
            ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
            ) : followers.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                    Chưa có người theo dõi nào
                </div>
            ) : (
                <ul className="space-y-4">
                    {followers.map((follower: FollowUser) => (
                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-3" key={follower.id}>
                                <Avatar src={follower.avatar_url || `https://i.pravatar.cc/150?img=${follower.id}`} size={32} />
                                <div>
                                    <p className="text-sm font-semibold">{follower.username}</p>
                                    {follower.is_following_back && <p className="text-xs text-gray-400">{follower.is_following_back ? "Đang theo dõi bạn" : ""}</p>}
                                </div>
                            </div>
                            <button className="text-blue-500 text-xs font-medium">{follower.is_following_back ? "Đang theo dõi" : "Theo dõi lại"}</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FriendListHome;

