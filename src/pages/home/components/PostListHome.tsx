import type { PostData } from "@context/interface";
import moment from 'moment';
import PostFeedList from "@provider/post/PostFeedList";
import { formatMessageTime, formatTime } from "@/utils/helpers";

interface PostListHomeProp {
    posts: PostData[];
}

const PostListHome = ({ posts }: PostListHomeProp) => {
    const formattedPosts = posts.map(post => ({
        id: post.id || 0,
        user: {
            name: post.user?.username || 'Unknown',
            avatar: post.user?.avatar_url
                ? `http://localhost:8000/${post.user.avatar_url}`
                : 'https://i.pravatar.cc/150?img=1'
        },
        image: post.media?.[0]?.attachment?.file_url
            ? `http://localhost:8000/${post.media[0].attachment.file_url}`
            : 'https://picsum.photos/seed/1/600/400',
        caption: post.caption || '',
        createdAt: post.created_at
            ? formatMessageTime(post.created_at)
            : 'Vừa xong',
        likesCount: post.likesCount || 0,
        commentsCount: post.comments?.length || 0,
        liked: false
    }));

    return (
        <PostFeedList posts={formattedPosts} />
    )
}

export default PostListHome