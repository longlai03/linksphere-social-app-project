import type { Auth } from '../../context/interface';
import { createSlice } from "@reduxjs/toolkit";
import { getUser, userLogin, userLogout, userRegister, updateUser } from './thunk';
import { setPendingStatus, setRejectStatus } from './utlis';

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
                setPendingStatus(state);
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
                console.log(state.user);
            })
            .addCase(userRegister.rejected, (state, action) => {
                setRejectStatus(state, action);
            })
            .addCase(userLogin.pending, (state) => {
                setPendingStatus(state);
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(userLogin.rejected, (state, action) => {
                setRejectStatus(state, action);
            })
            .addCase(getUser.pending, (state) => {
                setPendingStatus(state);
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(getUser.rejected, (state, action) => {
                setRejectStatus(state, action);
                state.user = initialState.user;
                state.token = initialState.token
                localStorage.removeItem("token");
            })
            .addCase(userLogout.pending, (state) => {
                setPendingStatus(state)
            })
            .addCase(userLogout.fulfilled, (state) => {
                state.loading = false;
                state.user = initialState.user;
                state.token = initialState.token;
                localStorage.removeItem("token");
            })
            .addCase(userLogout.rejected, (state, action) => {
                setRejectStatus(state, action);
            })
            .addCase(updateUser.pending, (state) => {
                setPendingStatus(state)
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
            })
            .addCase(updateUser.rejected, (state, action) => {
                setRejectStatus(state, action);
            });
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
