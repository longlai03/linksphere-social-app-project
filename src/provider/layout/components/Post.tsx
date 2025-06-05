import { useState } from "react";
import { HeartOutlined, HeartFilled, MessageOutlined, ShareAltOutlined } from "@ant-design/icons"; // Import icon từ Ant Design
import Avatar from "./Avatar";

interface PostProps {
    user: {
        name: string;
        avatar: string;
    };
    image: string;
    caption: string;
    createdAt?: string;
    likesCount: number;
    commentsCount: number;
    liked: boolean;
}

const Post = ({ user, image, caption, createdAt = "Just now", likesCount: initialLikes, commentsCount, liked: initiallyLiked }: PostProps) => {
    const [liked, setLiked] = useState(initiallyLiked);
    const [likesCount, setLikesCount] = useState(initialLikes);

    const handleLike = () => {
        setLiked(!liked);
        setLikesCount((prev) => prev + (liked ? -1 : 1));
    };

    const handleComment = () => {
        console.log("Comment clicked");
    };

    const handleShare = () => {
        console.log("Share clicked");
    };

    return (
        <div className="border border-gray-200 rounded-md">
            <div className="flex items-center gap-3 p-3">
                <Avatar src={user.avatar} size={32} />
                <div className="flex-1">
                    <div className="text-sm font-semibold">{user.name}</div>
                    <p className="text-[11px] text-gray-400 leading-none mt-0.5">{createdAt}</p>
                </div>
            </div>
            <div className="w-full aspect-square overflow-hidden">
                <img
                    src={image}
                    alt="post"
                    className="w-full h-full object-cover object-center"
                />
            </div>
            <div className="flex gap-4 px-3 pt-3">
                <button onClick={handleLike}>
                    {liked ? (
                        <HeartFilled className="text-red-500" style={{ fontSize: "20px" }} />
                    ) : (
                        <HeartOutlined style={{ fontSize: "20px" }} />
                    )}
                </button>
                <button onClick={handleComment}>
                    <MessageOutlined style={{ fontSize: "20px" }} />
                </button>
                <button onClick={handleShare}>
                    <ShareAltOutlined style={{ fontSize: "20px" }} />
                </button>
            </div>
            <div className="px-3 pt-2 text-sm font-medium">
                {likesCount} lượt thích &bull; {commentsCount} bình luận
            </div>
            <div className="px-3 pt-1 pb-3 text-sm">
                <span className="font-semibold mr-2">{user.name}</span>
                {caption}
            </div>
        </div>
    );
};

export default Post;
