import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FriendListHome from "./components/FriendListHome";
import PostListHome from "./components/PostListHome";
import type { RootState } from "../../store/redux";
import type { AppDispatch } from "../../store/redux";
import { getFeedPosts } from "../../store/post";
import { useMountApiCall } from "../../utils/hooks";

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { feedPosts, loading, error } = useSelector((state: RootState) => state.post);

    // Sử dụng custom hook để tránh gọi API nhiều lần
    const fetchFeedPosts = useMountApiCall(getFeedPosts, [user?.id], !!user?.id);

    useEffect(() => {
        if (user?.id) {
            fetchFeedPosts(1);
        }
    }, [fetchFeedPosts, user?.id]);

    // console.log(feedPosts);

    return (
        <div className="flex w-full justify-center items-stretch flex-row max-w-7xl mx-auto px-6 py-6">
            <main className="flex-1 w-full max-w-[630px]">
                {loading ? (
                    <div className="text-center py-4">Loading posts...</div>
                ) : error ? (
                    <div className="text-center py-4 text-red-500">{error}</div>
                ) : (
                    <PostListHome posts={feedPosts.data} />
                )}
            </main>
            <aside className="hidden xl:block w-[320px] ml-10">
                <FriendListHome currentUser={user} />
            </aside>
        </div>
    );
};

export default Home;
