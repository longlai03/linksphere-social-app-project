import Avatar from "./components/Avatar";

interface FriendProps {
    avatar: string;
    username: string;
    subtitle?: string;
    actionText?: string;
}

const Friend = ({ avatar, username, subtitle, actionText = "View" }: FriendProps) => {
    return (
        <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar src={avatar} size={32} />
                <div>
                    <p className="text-sm font-semibold">{username}</p>
                    {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
                </div>
            </div>
            <button className="text-blue-500 text-xs font-medium">{actionText}</button>
        </li>
    );
};

export default Friend;