import { createSlice } from "@reduxjs/toolkit";
import type { Auth } from '../../context/interface';
import { getLoginUserInformation, updateUser, userLogin, userLogout, userRegister } from './thunk';
import { setPendingStatus, setRejectStatus } from './utlis';
import { tokenService } from '../../services/tokenService';

const initialState: Auth = {
    user: {},
    token: tokenService.getToken() || "",
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
            try {
                const formData = JSON.parse(action.payload);
                state.form.register.registerForm = {
                    ...state.form.register.registerForm,
                    ...formData
                };
            } catch (error) {
                console.error('Invalid register form data:', error);
                state.error = 'Invalid form data';
            }
        },
        handleWatchLoginForm: (state, action) => {
            try {
                const formData = JSON.parse(action.payload);
                state.form.login.loginForm = {
                    ...state.form.login.loginForm,
                    ...formData
                };
            } catch (error) {
                console.error('Invalid login form data:', error);
                state.error = 'Invalid form data';
            }
        },
        handleRegisterChangeStep: (state, action) => {
            if (typeof action.payload === 'number' && action.payload >= 0) {
                state.form.register.step = action.payload;
            }
        },
        clearAuthError: (state) => {
            state.error = null;
        },
        resetAuthState: (state) => {
            Object.assign(state, initialState);
            tokenService.removeTokens();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userRegister.pending, (state) => {
                setPendingStatus(state);
                state.error = null;
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                if (!action.payload?.user || !action.payload?.token) {
                    state.error = 'Invalid response from server';
                    return;
                }
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
                state.token = action.payload.token;
                tokenService.setToken(action.payload.token);
            })
            .addCase(userRegister.rejected, (state, action) => {
                setRejectStatus(state, action);
                tokenService.removeTokens();
            })
            .addCase(userLogin.pending, (state) => {
                setPendingStatus(state);
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                if (!action.payload?.user || !action.payload?.token) {
                    state.error = 'Invalid response from server';
                    return;
                }
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
                state.token = action.payload.token;
                tokenService.setToken(action.payload.token);
            })
            .addCase(userLogin.rejected, (state, action) => {
                setRejectStatus(state, action);
                tokenService.removeTokens();
            })
            .addCase(getLoginUserInformation.pending, (state) => {
                setPendingStatus(state);
                state.error = null;
            })
            .addCase(getLoginUserInformation.fulfilled, (state, action) => {
                if (!action.payload?.user) {
                    state.error = 'Invalid user info response';
                    return;
                }
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
            })
            .addCase(getLoginUserInformation.rejected, (state, action) => {
                setRejectStatus(state, action);
                state.user = initialState.user;
                state.token = "";
                tokenService.removeTokens();
            })
            .addCase(userLogout.pending, (state) => {
                setPendingStatus(state);
                state.error = null;
            })
            .addCase(userLogout.fulfilled, (state) => {
                state.loading = false;
                state.user = initialState.user;
                state.token = "";
                tokenService.removeTokens();
            })
            .addCase(userLogout.rejected, (state, action) => {
                setRejectStatus(state, action);
                state.user = initialState.user;
                state.token = "";
                tokenService.removeTokens();
            })
            .addCase(updateUser.pending, (state) => {
                setPendingStatus(state);
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                if (!action.payload?.user) {
                    state.error = 'Invalid update response';
                    return;
                }
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
            })
            .addCase(updateUser.rejected, (state, action) => {
                setRejectStatus(state, action);
            });
    }
});

export const {
    handleWatchRegisterForm,
    handleWatchLoginForm,
    handleRegisterChangeStep,
    clearAuthError,
    resetAuthState,
} = AuthSlice.actions;

export * from './thunk';

export default AuthSlice.reducer;
