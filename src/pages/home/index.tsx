import { useMountApiCall } from "@hooks/hooks";
import { getFeedPosts } from "@store/post";
import type { RootState } from "@store/redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import FriendListHome from "./components/FriendListHome";
import PostListHome from "./components/PostListHome";

const Home = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { feedPosts, loading, error } = useSelector((state: RootState) => state.post);
    const fetchFeedPosts = useMountApiCall(getFeedPosts, [user?.id], !!user?.id);

    useEffect(() => {
        if (user?.id) {
            fetchFeedPosts();
        }
    }, [fetchFeedPosts, user?.id]);

    return (
        <div className="flex w-full justify-center items-stretch flex-row max-w-7xl mx-auto px-6 py-6">
            <main className="flex-1 w-full max-w-[630px]">
                {loading ? (
                    
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                        <div className="mt-2 text-gray-500 text-sm">Đang tải...</div>
                    </div>
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
