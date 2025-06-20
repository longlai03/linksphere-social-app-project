import PostFeed from "./components/PostFeed";

//dispatch getFeedPost
interface PostItem {
    id: string | number;
    user: {
        name: string;
        avatar: string;
    };
    image: string;
    caption: string;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    liked: boolean;
}

interface PostFeedListProps {
    posts: PostItem[];
}

const PostFeedList = ({ posts }: PostFeedListProps) => {
    if (!posts || posts.length === 0) {
        return <p className="text-center text-sm text-gray-400">Không có bài viết nào để hiển thị</p>;
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <PostFeed
                    key={post.id}
                    post={post}
                />
            ))}
        </div>
    );
};

export default PostFeedList;
