interface UserPostProps {
    image: string;
    likesCount: number;
    commentsCount: number;
}

const UserPost: React.FC<UserPostProps> = ({ image, likesCount, commentsCount }) => {
    return (
        <div className="relative group cursor-pointer">
            <img
                src={image}
                alt="Post Image"
                className="w-full h-auto rounded-lg"
            />
            <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 p-2 rounded-lg">
                <p>{likesCount} Likes</p>
                <p>{commentsCount} Comments</p>
            </div>
        </div>
    );
};

export default UserPost;
