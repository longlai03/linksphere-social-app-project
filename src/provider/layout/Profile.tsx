import Avatar from "./components/Avatar";

interface ProfileProps {
    avatar: string;
    username: string;
    fullName: string;
    actionText?: string;
}

const Profile = ({ avatar, username, fullName, actionText = "Switch" }: ProfileProps) => {
    return (
        <div className="flex items-center gap-3 mb-6">
            <Avatar src={avatar} size={40} />
            <div>
                <p className="text-sm font-semibold">{username}</p>
                <p className="text-xs text-gray-500">{fullName}</p>
            </div>
            <button className="ml-auto text-xs font-medium text-blue-500">{actionText}</button>
        </div>
    );
};

export default Profile;
