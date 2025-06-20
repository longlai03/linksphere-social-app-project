import { createSlice } from "@reduxjs/toolkit";
import type { Auth } from '../../context/interface';
import { getLoginUserInformation, resetPassword, sendResetCode, updateUser, userLogin, userLogout, userRegister, verifyResetCode } from './thunk';
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
            emailForm: {
                email: "",
            },
            otpForm: {
                otp: "",
            },
            resetForm: {
                newPassword: "",
                confirmPassword: "",
            },
            step: 0, // 0: enter email, 1: enter code, 2: enter new password
            email: "", // Lưu email đã xác thực
            code: "", // Lưu code đã xác thực
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
        handleWatchForgotPasswordEmailForm: (state, action) => {
            try {
                const formData = JSON.parse(action.payload);
                state.form.forgotPassword.emailForm = {
                    ...state.form.forgotPassword.emailForm,
                    ...formData
                };
            } catch (error) {
                console.error('Invalid forgot password email form data:', error);
                state.error = 'Invalid form data';
            }
        },
        handleWatchForgotPasswordOtpForm: (state, action) => {
            try {
                const formData = JSON.parse(action.payload);
                state.form.forgotPassword.otpForm = {
                    ...state.form.forgotPassword.otpForm,
                    ...formData
                };
            } catch (error) {
                console.error('Invalid forgot password OTP form data:', error);
                state.error = 'Invalid form data';
            }
        },
        handleWatchForgotPasswordResetForm: (state, action) => {
            try {
                const formData = JSON.parse(action.payload);
                state.form.forgotPassword.resetForm = {
                    ...state.form.forgotPassword.resetForm,
                    ...formData
                };
            } catch (error) {
                console.error('Invalid forgot password reset form data:', error);
                state.error = 'Invalid form data';
            }
        },
        setForgotPasswordStep: (state, action) => {
            if (typeof action.payload === 'number' && action.payload >= 0 && action.payload <= 2) {
                state.form.forgotPassword.step = action.payload;
            }
        },
        setForgotPasswordEmail: (state, action) => {
            state.form.forgotPassword.email = action.payload;
        },
        setForgotPasswordCode: (state, action) => {
            state.form.forgotPassword.code = action.payload;
        },
        resetForgotPasswordState: (state) => {
            state.form.forgotPassword = initialState.form.forgotPassword;
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
                console.log('getLoginUserInformation.fulfilled called with:', action.payload);
                if (!action.payload?.user) {
                    console.error('Invalid user info response - no user in payload');
                    state.error = 'Invalid user info response';
                    return;
                }
                console.log('Setting user in state:', action.payload.user);
                state.user = action.payload.user;
                state.loading = false;
                state.error = null;
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
            })
            .addCase(sendResetCode.pending, (state) => {
                setPendingStatus(state);
                state.error = null;
            })
            .addCase(sendResetCode.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.form.forgotPassword.step = 1;
            })
            .addCase(sendResetCode.rejected, (state, action) => {
                setRejectStatus(state, action);
            })
            .addCase(verifyResetCode.pending, (state) => {
                setPendingStatus(state);
                state.error = null;
            })
            .addCase(verifyResetCode.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.form.forgotPassword.step = 2;
            })
            .addCase(verifyResetCode.rejected, (state, action) => {
                setRejectStatus(state, action);
            })
            .addCase(resetPassword.pending, (state) => {
                setPendingStatus(state);
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.form.forgotPassword = initialState.form.forgotPassword;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                setRejectStatus(state, action);
            });
    }
});

export const {
    handleWatchRegisterForm,
    handleWatchLoginForm,
    handleRegisterChangeStep,
    handleWatchForgotPasswordEmailForm,
    handleWatchForgotPasswordOtpForm,
    handleWatchForgotPasswordResetForm,
    setForgotPasswordStep,
    setForgotPasswordEmail,
    setForgotPasswordCode,
    resetForgotPasswordState,
    clearAuthError,
    resetAuthState,
} = AuthSlice.actions;

export * from './thunk';

export default AuthSlice.reducer;
