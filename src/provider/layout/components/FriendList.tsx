import type { User } from "../../../context/interface";
import Friend from "./Friend";
import Profile from "./Profile";
import DefaultImage from "../../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png"

interface FriendItem {
    avatar: string;
    username: string;
    subtitle?: string;
    actionText?: string;
}

interface FriendListProps {
    currentUser: User
    friends: FriendItem[];
}

const FriendList = ({ currentUser, friends }: FriendListProps) => {
    return (
        <div>
            <Profile
                avatar={currentUser.avatar_url ?? DefaultImage}
                username={currentUser.username ?? "Guest"}
                fullName={currentUser.nickname ?? ""}
            />
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

export default FriendList;
