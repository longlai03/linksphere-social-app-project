import type { User } from "../../../context/interface";
import DefaultImage from "../../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png";
import Avatar from "../../../provider/layout/components/Avatar";
import Button from "../../../provider/layout/components/Button";
import Friend from "../../../provider/layout/components/Friend";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/redux";
import { userLogout } from "../../../store/auth";
import { useNavigate } from "react-router-dom";

interface FriendItem {
    avatar: string;
    username: string;
    subtitle?: string;
    actionText?: string;
}

interface FriendListHomeProp {
    currentUser: User;
    friends: FriendItem[];
}

const FriendListHome = ({ currentUser, friends }: FriendListHomeProp) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { token } = useSelector((state: RootState) => state.auth);
    const handleLogout = async () => {
        try {
            const res = await dispatch(userLogout(token)).unwrap();
            console.log("Success log out:", res);
            navigate('/login');
            // onNext?.();
        } catch (e: any) {
            console.error("Error call register api: ", e);
        }
    }
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Avatar src={currentUser.avatar_url ?? DefaultImage} size={40} />
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
                    Log out
                </Button>
            </div>

            <div className="mb-4 flex justify-between text-sm text-gray-500 font-medium">
                <p>Bạn bè của bạn</p>
                <button className="text-xs font-semibold">Xem tất cả</button>
            </div>

            <ul className="space-y-4">
                {friends.map((friend, i) => (
                    <Friend
                        key={i}
                        avatar={friend.avatar}
                        username={friend.username}
                        subtitle={friend.subtitle}
                        actionText={friend.actionText || "View"}
                    />
                ))}
            </ul>
        </div>
    );
};

export default FriendListHome;
