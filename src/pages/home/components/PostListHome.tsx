import type { PostData } from "@context/interface";
import moment from 'moment';
import PostFeedList from "@provider/post/PostFeedList";

interface PostListHomeProp {
    posts: PostData[];
}

const PostListHome = ({ posts }: PostListHomeProp) => {
    // Chuyển đổi dữ liệu từ API thành định dạng PostList mong đợi
    const formattedPosts = posts.map(post => ({
        id: post.id || 0, // Đảm bảo id luôn có giá trị
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
            ? moment(post.created_at).locale('vi').fromNow()
            : 'Vừa xong',
        likesCount: post.likesCount || 0,
        commentsCount: post.comments?.length || 0,
        liked: false // Mặc định là false, có thể cập nhật sau khi thêm chức năng like
    }));

    return (
        <PostFeedList posts={formattedPosts} />
    )
}

export default PostListHome