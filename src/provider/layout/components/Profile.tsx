import Avatar from "./Avatar";
import Button from "./Button";

interface ProfileProps {
    avatar: string;
    username: string;
    fullName: string;
}

const Profile = ({ avatar, username, fullName }: ProfileProps) => {
    return (
        <div className="flex items-center gap-3 mb-6">
            <Avatar src={avatar} size={40} />
            <div>
                <p className="text-sm font-semibold">{username}</p>
                <p className="text-xs text-gray-500">{fullName}</p>
            </div>
            <Button variant="plain" className="ml-auto text-xs font-medium text-blue-500" fullWidth={false}>Log out</Button>
        </div>
    );
};

export default Profile;
