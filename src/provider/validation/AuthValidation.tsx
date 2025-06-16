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
        .required('Vui lòng nhập mật khẩu mới')
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
        .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
        .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số"),
    confirmPassword: yup
        .string()
        .required('Vui lòng xác nhận mật khẩu')
        .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
});

export const ForgotPasswordValidation = yup.object({
    identity: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ"),
    otp: yup
        .string()
        .required("Vui lòng nhập mã OTP")
        .length(6, "Mã OTP phải có 6 chữ số"),
    newPassword: yup
        .string()
        .when('$step', {
            is: 2,
            then: (schema) => schema
                .required('Vui lòng nhập mật khẩu mới')
                .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
                .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
                .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
                .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số"),
            otherwise: (schema) => schema.optional()
        }),
    confirmPassword: yup
        .string()
        .when(['$step', 'newPassword'], {
            is: (step: number, newPassword: string) => step === 2 && newPassword,
            then: (schema) => schema
                .required('Vui lòng xác nhận mật khẩu')
                .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
            otherwise: (schema) => schema.optional()
        })
})