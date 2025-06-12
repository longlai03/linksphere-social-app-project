import * as yup from "yup"
import type { AttachtmentItem } from "../../context/interface";

const attachmentSchema = yup.object({
    position: yup.number().required(),
    tagged_user: yup.string().optional(),
    base64: yup.string().optional()
});

export const PostValidation = yup.object({
    privacy: yup.string().required("Tình trạng bài viết là bắt buộc"),
    caption: yup.string().required("Nội dung này là bắt buộc"),
    media: yup.array().of(attachmentSchema).default([])
});