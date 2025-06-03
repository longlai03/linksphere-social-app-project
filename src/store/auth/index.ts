import type { Auth } from '../../context/interface';
import { createSlice } from "@reduxjs/toolkit";
import { getUser, userLogin, userRegister } from './thunk';

const initialState: Auth = {
    user: {},
    token: "",
    form: {
        register: {
            registerForm: {
                email: "",
                password: "",
                username: "",
                nickname: "",
            },
            step: 0,
        },
        login: {
            loginForm: {
                email: "",
                password: "",
            },
        },
        otp: {
            otpForm: {
                otp: "",
            },
        },
        forgotPassword: {
            forgotPasswordForm: {
                email: "",
            }
        }
    },
    loading: false,
    error: null,
}

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        handleWatchRegisterForm: (state, action) => {
            state.form.register.registerForm = JSON.parse(action.payload);
        },
        handleWatchLoginForm: (state, action) => {
            state.form.login.loginForm = JSON.parse(action.payload);
        },
        handleRegisterChangeStep: (state, action) => {
            state.form.register.step = action.payload;
        },
        setUserTokenFromLocalStorage: (state, action) => {
            state.token = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userRegister.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
                console.log(state.user);
            })
            .addCase(userRegister.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string;
                state.user = initialState.user;
                state.token = initialState.token
                localStorage.removeItem("token");
            })
    }
})

export * from "./thunk";
export const {
    handleWatchRegisterForm,
    handleWatchLoginForm,
    handleRegisterChangeStep,
    setUserTokenFromLocalStorage,
} = AuthSlice.actions;
export default AuthSlice.reducer;

