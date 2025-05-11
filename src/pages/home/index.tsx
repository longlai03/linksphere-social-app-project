import FeedList from "./components/FeedList";
import FriendList from "./components/FriendList";

const Home = () => {
    const mockPosts = [
        {
            id: 1,
            user: { name: "user1", avatar: "https://i.pravatar.cc/150?img=1" },
            image: "https://picsum.photos/seed/1/600/400",
            caption: "Caption of post 1",
            createdAt: "1 giờ trước",
            likesCount: 12,
            commentsCount: 3,
            liked: false,
        },
        {
            id: 2,
            user: { name: "user2", avatar: "https://i.pravatar.cc/150?img=2" },
            image: "https://picsum.photos/seed/2/600/400",
            caption: "Caption of post 2",
            createdAt: "2 giờ trước",
            likesCount: 20,
            commentsCount: 5,
            liked: true,
        },
        {
            id: 3,
            user: { name: "user3", avatar: "https://i.pravatar.cc/150?img=3" },
            image: "https://picsum.photos/seed/3/600/400",
            caption: "Caption of post 3",
            createdAt: "Hôm qua",
            likesCount: 7,
            commentsCount: 2,
            liked: false,
        },
    ];

    const currentUser = {
        avatar: "https://i.pravatar.cc/150?img=20",
        username: "User name",
        fullName: "Full name",
    };

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
                <FeedList posts={mockPosts} />
            </main>
            <aside className="hidden xl:block w-[320px] ml-10">
                <FriendList currentUser={currentUser} friends={friends} />
            </aside>
        </div>
    );
};

export default Home;
