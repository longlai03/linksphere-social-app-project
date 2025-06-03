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

export interface Auth {
    user: User;
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
            }
        }
        otp: {
            otpForm: {
                otp: string;
            },
        },
        forgotPassword: {
            forgotPasswordForm: {
                email: string;
            }
        }
    }
    loading: boolean;
    error: string | null;
}
