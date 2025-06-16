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
}

export interface AttachtmentItem {
    position: number,
    tagged_user?: string,
    base64?: string,
}

export interface PostItem {
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
    // Optionally, you can add:
    // user?: User;
    // replies?: Comment[];
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
}

export interface PostEdit {
    id?: number;
    caption?: string;
    privacy?: string;
    media?: MediaItem[];
}

export interface FeedPosts {
    data: PostData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface Post {
    posts: PostData[];
    specificPost: PostData;
    postEdit: PostEdit;
    feedPosts: FeedPosts;
    loading: boolean;
    error: string | null;
}

