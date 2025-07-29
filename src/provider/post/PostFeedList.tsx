import type { PostItem } from "@/context/interface";
import PostFeed from "./components/PostFeed";

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
