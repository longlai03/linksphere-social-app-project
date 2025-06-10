import { HeartOutlined, MessageOutlined, GlobalOutlined, LockOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserPostProps {
    post: any;
}

function getPrivacyIcon(privacy: string) {
    switch (privacy) {
        case 'public':
            return <GlobalOutlined style={{ color: "#fff", fontSize: 20 }} title="Công khai" />;
        case 'friends':
            return <UsergroupAddOutlined style={{ color: "#fff", fontSize: 20 }} title="Bạn bè" />;
        case 'private':
            return <LockOutlined style={{ color: "#fff", fontSize: 20 }} title="Chỉ mình tôi" />;
        default:
            return <span style={{ color: "#fff", fontSize: 20 }} title="Không xác định">?</span>;
    }
}

const UserPost: React.FC<UserPostProps> = ({ post }) => {
    const navigate = useNavigate();

    const imageMedia = post.media?.find(
        (m: any) =>
            m.attachment &&
            m.attachment.file_url &&
            m.attachment.file_type &&
            m.attachment.file_type.startsWith('image/')
    );
    if (!imageMedia) return null;
    const imageUrl = `http://localhost:8000/${imageMedia.attachment.file_url}`;

    const handleClick = () => {
        navigate(`/post/${post.id}`);
    };

    return (
        <div
            className="relative aspect-square bg-gray-100 cursor-pointer group overflow-hidden"
            onClick={handleClick}
        >
            {/* Privacy icon in top right */}
            <div className="absolute top-2 right-2 z-10 bg-black bg-opacity-40 rounded-full p-1 flex items-center justify-center">
                {getPrivacyIcon(post.privacy)}
            </div>
            <img
                src={imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <div className="flex gap-6 text-white text-lg font-semibold">
                    <span className="flex items-center gap-1">
                        <HeartOutlined className="text-xl" />
                        {post.likesCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageOutlined className="text-xl" />
                        {post.commentsCount ?? 0}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserPost;
