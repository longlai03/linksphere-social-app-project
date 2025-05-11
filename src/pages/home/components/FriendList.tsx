import Friend from "../../../provider/layout/Friend";
import Profile from "../../../provider/layout/Profile";

interface FriendItem {
    avatar: string;
    username: string;
    subtitle?: string;
    actionText?: string;
}

interface FriendListProps {
    currentUser: {
        avatar: string;
        username: string;
        fullName: string;
    };
    friends: FriendItem[];
}

const FriendList = ({ currentUser, friends }: FriendListProps) => {
    return (
        <div>
            <Profile
                avatar={currentUser.avatar}
                username={currentUser.username}
                fullName={currentUser.fullName}
                actionText="Switch"
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
