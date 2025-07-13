import * as yup from "yup";

export const EditAccountValidation = yup.object({
    avatar_url: yup.string().optional(),
    nickname: yup
        .string()
        .required('Nickname là bắt buộc')
        .min(2, 'Nickname phải có ít nhất 2 ký tự')
        .max(50, 'Nickname không được quá 50 ký tự')
        .matches(/^[a-zA-ZÀ-ỹ\s]+$/, 'Nickname chỉ được chứa chữ cái và khoảng trắng'),
    gender: yup
        .string()
        .oneOf(['male', 'female', 'other', ''], 'Vui lòng chọn giới tính hợp lệ'),
    birthday: yup
        .string()
        .test('is-valid-date', 'Ngày sinh không hợp lệ', function (value) {
            if (!value) return true;
            const date = new Date(value);
            const today = new Date();
            const minDate = new Date('1900-01-01');
            return date >= minDate && date <= today;
        }),
    phone: yup
        .string()
        .matches(/^[0-9+\-\s()]*$/, 'Số điện thoại chỉ được chứa số và ký tự đặc biệt')
        .min(9, 'Số điện thoại phải có ít nhất 9 số')
        .max(15, 'Số điện thoại không được quá 15 số'),
    address: yup
        .string()
        .max(200, 'Địa chỉ không được quá 200 ký tự'),
    bio: yup
        .string()
        .max(500, 'Tiểu sử không được quá 500 ký tự'),
    hobbies: yup
        .string()
        .max(300, 'Sở thích không được quá 300 ký tự'),
})