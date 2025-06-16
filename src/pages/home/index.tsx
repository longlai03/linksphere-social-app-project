import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FriendListHome from "./components/FriendListHome";
import PostListHome from "./components/PostListHome";
import type { RootState } from "../../store/redux";
import type { AppDispatch } from "../../store/redux";
import { getFeedPosts } from "../../store/post";

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { feedPosts, loading, error } = useSelector((state: RootState) => state.post);

    // console.log(feedPosts);

    useEffect(() => {
        dispatch(getFeedPosts(1));
    }, [dispatch]);

    const friends = [
        {
            avatar: "https://i.pravatar.cc/150?img=10",
            username: "user10",
            subtitle: "Followed by ...",
        },
        {
            avatar: "https://i.pravatar.cc/150?img=11",
            username: "user11",
            subtitle: "Followed by ...",
        },
        {
            avatar: "https://i.pravatar.cc/150?img=12",
            username: "user12",
            subtitle: "Followed by ...",
        },
        {
            avatar: "https://i.pravatar.cc/150?img=13",
            username: "user13",
            subtitle: "Followed by ...",
        },
        {
            avatar: "https://i.pravatar.cc/150?img=14",
            username: "user14",
            subtitle: "Followed by ...",
        },
    ];

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
                <FriendListHome currentUser={user} friends={friends} />
            </aside>
        </div>
    );
};

export default Home;
