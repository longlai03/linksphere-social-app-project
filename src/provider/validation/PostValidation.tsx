import * as yup from "yup"

export const PostValidation = yup.object({
    privacy: yup.string().required("Tình trạng bài viết là bắt buộc"),
    caption: yup.string().required("Nội dung này là bắt buộc"),
    media: yup.array().notRequired(),
})