import * as yup from "yup"

export const RegisterValidation = yup.object({
    email: yup
        .string()
        .required("Trường này là bắt buộc")
        .email("Email không hợp lệ"),
    password: yup
        .string()
        .required("Trường này là bắt buộc")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    username: yup
        .string()
        .required("Trường này là bắt buộc"),
    nickname: yup
        .string()
        .required("Trường này là bắt buộc"),
})

export const OTPValidation = yup.object({
    otp: yup
        .string()
        .required("Vui lòng nhập mã OTP")
        .length(6, "Mã OTP phải có 6 chữ số"),
})

export const LoginValidation = yup.object({
    email: yup
        .string()
        .required("Trường này là bắt buộc")
        .email("Email không hợp lệ"),
    password: yup
        .string()
        .required("Trường này là bắt buộc"),
})

export const ForgotPasswordEmailValidation = yup.object({
    email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ")
});

export const ForgotPasswordOtpValidation = yup.object({
    otp: yup
        .string()
        .required("Vui lòng nhập mã OTP")
        .length(6, "Mã OTP phải có 6 chữ số")
});

export const ForgotPasswordResetValidation = yup.object({
    newPassword: yup
        .string()
        .required("Trường này là bắt buộc")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: yup
        .string()
        .required('Vui lòng xác nhận mật khẩu')
        .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
});
