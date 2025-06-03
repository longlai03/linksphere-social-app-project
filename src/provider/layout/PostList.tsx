import Post from "./components/Post";

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

interface PostListProps {
    posts: PostItem[];
}

const PostList = ({ posts }: PostListProps) => {
    if (!posts || posts.length === 0) {
        return <p className="text-center text-sm text-gray-400">Không có bài viết nào để hiển thị</p>;
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <Post
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

export default PostList;
