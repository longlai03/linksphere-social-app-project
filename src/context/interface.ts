export interface User {
    id?: number;
    email?: string;
    email_verified_at?: boolean;
    phone?: string;
    password?: string;
    username?: string;
    nickname?: string;
    avatar_url?: string;
    gender?: string;
    address?: string;
    birthday?: string;
    bio?: string;
    hobbies?: string;
    friends?: string;
    created_at?: string;
    updated_at?: string;
    stats?: UserStats;
    is_following?: boolean;
    follow_status?: string;
}

export interface UserState extends User {
    followers: FollowUser[];
    following: FollowUser[];
    pendingRequests: FollowUser[];
    searchUsers: User[];
    userSuggestion: User[];
    searchParams: {
        query: string;
    };
    loading: boolean;
    error: string | null;
    selectedUser: User | null;
    followStatus: {
        targetUserId: number;
        status: string;
    } | null;
    profileDetailStates: {
        followLoading: boolean;
        modalFollowStatuses: Record<number, string>;
        modalFollowLoading: number | null;
        followersModalVisible: boolean;
        followingModalVisible: boolean;
    };
    loadingStates: {
        getUserById: boolean;
        getFollowers: boolean;
        getFollowing: boolean;
        getFollowStatus: boolean;
        followUser: boolean;
        unfollowUser: boolean;
        acceptFollowRequest: boolean;
        declineFollowRequest: boolean;
        getPendingFollowRequests: boolean;
        getAllUsers: boolean;
        getUserSuggestion: boolean,
    };
}

export interface UserStats {
    followers_count: number;
    following_count: number;
    posts_count: number;
}

export interface AttachtmentItem {
    position: number,
    tagged_user?: string,
    base64?: string,
}

export interface PostFormItem {
    caption: string,
    privacy: string, // "public", "friends", or "private",
    media?: AttachtmentItem[],
}

export interface Auth {
    user: {
        id?: number;
        username?: string;
        nickname?: string;
        email?: string;
        avatar_url?: string;
        gender?: string;
        birthday?: string;
        phone?: string;
        address?: string;
        hobbies?: string;
        bio?: string;
    };
    token: string;
    form: {
        register: {
            registerForm: {
                email: string;
                password: string;
                username: string;
                nickname: string;
            };
            step: number;
        };
        login: {
            loginForm: {
                email: string;
                password: string;
            };
        };
        otp: {
            otpForm: {
                otp: string;
            };
        };
        forgotPassword: {
            emailForm: {
                email: string;
            };
            otpForm: {
                otp: string;
            };
            resetForm: {
                newPassword: string;
                confirmPassword: string;
            };
            step: number; // 0: enter email, 1: enter code, 2: enter new password
            email: string;
            code: string;
        };
    };
    loading: boolean;
    error: string | null;
}

export interface Attachment {
    id: number;
    user_id: number;
    post_media_id: number;
    file_url: string;
    file_type: string;
    original_file_name: string;
    size: number;
    uploaded_at: string;
    created_at: string;
    updated_at: string;
}

export interface MediaItem {
    id: number;
    post_id: number;
    user_id: number;
    position: number;
    tagged_user: string | null;
    uploaded_at: string;
    created_at: string;
    updated_at: string;
    attachment: Attachment | null;
}

export interface Comment {
    id: number;
    reply_comment_id?: number | null;
    post_id: number;
    user_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    user?: User;
    replies?: Comment[];
}

export interface PostData {
    id?: number;
    user_id?: number;
    caption?: string;
    privacy?: string;
    created_at?: string;
    updated_at?: string;
    media?: MediaItem[];
    user?: User;
    likesCount?: number;
    commentsCount?: number;
    comments?: Comment[];
    liked?: boolean;
}

export interface PostEdit {
    id?: number;
    caption?: string;
    privacy?: string;
    media?: MediaItem[];
}

export interface FeedPosts {
    data: PostData[];
}

export interface Post {
    posts: PostData[];
    specificPost: PostData;
    postEdit: PostEdit;
    feedPosts: FeedPosts;
    loading: boolean;
    error: string | null;
    loadingStates: {
        getAllPostsByUser: boolean;
        getSpecificPost: boolean;
        createPost: boolean;
        updatePost: boolean;
        deletePost: boolean;
        getFeedPosts: boolean;
        likePost: boolean;
        unlikePost: boolean;
    };
}

export interface FollowUser {
    id: number;
    username: string;
    nickname: string;
    avatar_url: string | null;
    is_following_back?: boolean;
    request_at?: string;
}

export interface NotificationItem {
    id: number;
    user_id: number;
    content: string;
    type: string;
    read: boolean;
    created_at: string;
    updated_at: string;
    from_user?: {
        id: number | null;
        username: string;
        nickname: string;
        avatar_url?: string;
    };
}

export interface NotificationState {
    notifications: NotificationItem[];
    loading: boolean;
    error: string | null;
}

export interface Conversation {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    unreadCount: number;
    otherParticipant?: any;
    updatedAt?: string;
    lastMessageFull?: any;
}

export interface Message {
    id: string;
    conversationId: string;
    content: string;
    isOwn: boolean;
}

export interface MessageState {
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    messages: Message[];
    loading: boolean;
    error: string | null;
    loadingStates: {
        fetchConversations: boolean;
        fetchMessages: boolean;
        sendMessage: boolean;
    };
}

export interface PostFormData {
    privacy: string;
    caption: string;
    media: AttachtmentItem[];
}

export interface PostItem {
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


