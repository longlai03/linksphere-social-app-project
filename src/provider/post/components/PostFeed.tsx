import { HeartOutlined, HeartFilled, MessageOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@components/Avatar";
import { useNavigate } from "react-router-dom";
import { likePost, unlikePost } from "@store/post";
import type { AppDispatch, RootState } from "@store/redux";
import { useErrorHandler } from "@hooks/useErrorHandler";

interface PostFeedProps {
    post: any;
}

const PostFeed = ({ post }: PostFeedProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loadingStates } = useSelector((state: RootState) => state.post);
    const { handleCatchError } = useErrorHandler();

    // Get the current post from Redux store to ensure we have the latest liked status
    const { feedPosts } = useSelector((state: RootState) => state.post);
    const currentPost = feedPosts.data.find(p => p.id === post.id) || post;

    const handleLike = async () => {
        if (!post.id) return;

        try {
            if (currentPost.liked) {
                // Unlike
                await dispatch(unlikePost(post.id)).unwrap();
            } else {
                // Like
                await dispatch(likePost(post.id)).unwrap();
            }
        } catch (error) {
            handleCatchError(error, 'Không thể thực hiện thao tác like/unlike');
        }
    };

    const handleComment = () => {
        navigate(`/post/${post.id}`);
    };

    const handleShare = () => {
        console.log("Share clicked");
    };

    const isLikeLoading = loadingStates.likePost || loadingStates.unlikePost;

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
                <button
                    onClick={handleLike}
                    disabled={isLikeLoading}
                    className={isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    {currentPost.liked ? (
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
                {currentPost.likesCount || 0} lượt thích &bull; {post.commentsCount} bình luận
            </div>
            <div className="px-3 pt-1 pb-3 text-sm">
                <span className="font-semibold mr-2">{post.user.name}</span>
                {post.caption}
            </div>
        </div>
    );
};

export default PostFeed;
