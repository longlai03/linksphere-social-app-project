import type { User } from "../../../context/interface";
import FriendList from "../../../provider/layout/components/FriendList";

interface FriendListHomeProp {
    currentUser: User;
    friends: any;
}
const FriendListHome = ({ currentUser, friends }: FriendListHomeProp) => {
    return (
        <FriendList currentUser={currentUser} friends={friends} />
    )
}

export default FriendListHome;