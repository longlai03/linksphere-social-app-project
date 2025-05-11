import Feed from "../../../provider/layout/Feed";

interface Post {
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

interface FeedListProps {
    posts: Post[];
}

const FeedList = ({ posts }: FeedListProps) => {
    if (!posts || posts.length === 0) {
        return <p className="text-center text-sm text-gray-400">Không có bài viết nào để hiển thị</p>;
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <Feed
                    key={post.id}
                    user={post.user}
                    image={post.image}
                    createdAt={post.createdAt}
                    caption={post.caption}
                    likesCount={post.likesCount}
                    commentsCount={post.commentsCount}
                    liked={post.liked}
                />
            ))}
        </div>
    );
};

export default FeedList;
