import { useState } from "react";
import { HeartOutlined, HeartFilled, MessageOutlined, ShareAltOutlined } from "@ant-design/icons";
import Avatar from "../../components/Avatar";
import { useNavigate } from "react-router-dom";

interface PostFeedProps {
    post: any;
}

const PostFeed = ({ post }: PostFeedProps) => {
    const [liked, setLiked] = useState(post.liked);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const navigate = useNavigate();

    const handleLike = () => {
        setLiked(!liked);
        setLikesCount((prev: number) => prev + (post.liked ? -1 : 1));
    };

    const handleComment = () => {
        navigate(`/post/${post.id}`);
    };

    const handleShare = () => {
        console.log("Share clicked");
    };

    return (
        <div className="border border-gray-200 rounded-md">
            <div className="flex items-center gap-3 p-3">
                <Avatar src={post.user.avatar} size={32} />
                <div className="flex-1">
                    <div className="text-sm font-semibold">{post.user.name}</div>
                    <p className="text-[11px] text-gray-400 leading-none mt-0.5">{post.createdAt}</p>
                </div>
            </div>
            <div className="w-full aspect-square overflow-hidden">
                <img
                    src={post.image}
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
                {likesCount} lượt thích &bull; {post.commentsCount} bình luận
            </div>
            <div className="px-3 pt-1 pb-3 text-sm">
                <span className="font-semibold mr-2">{post.user.name}</span>
                {post.caption}
            </div>
        </div>
    );
};

export default PostFeed;
