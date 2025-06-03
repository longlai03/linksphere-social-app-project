import PostList from "../../../provider/layout/PostList"

interface PostListHomeProp {
    mockPosts: any;
}
const PostListHome = ({ mockPosts }: PostListHomeProp) => {
    return (
        <PostList posts={mockPosts} />
    )
}
export default PostListHome