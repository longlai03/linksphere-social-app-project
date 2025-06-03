import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "../../provider/input/TextField";
import TextareaField from "../../provider/input/TextareaField";
import { EditProfileDefaultValue } from "../../store/auth/constant";
import { yupResolver } from "@hookform/resolvers/yup";
import ComboBoxField from "../../provider/input/ComboBoxField";
import Button from "../../provider/layout/components/Button";
import AvatarEditField from "../../provider/input/AvatarEditField";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/redux";

export default function ProfileEditForm() {
    const { user } = useSelector((state: RootState) => state.auth);
    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: EditProfileDefaultValue,
        // resolver: yupResolver(EditProfileDefaultValue),
    });
    const {
        control,
        getValues,
        setError,
        trigger,
        watch,
        formState: { errors },
    } = methods;

    const handleSubmit = () => {
        trigger()
            .then(async (isValid) => {
                if (!isValid) {
                    console.log(errors);
                    return;
                }
                const data = getValues();
                console.log("data", data);
                // try {
                //     const res = await dispatch(userLogin(data)).unwrap();
                //     console.log("Login success:", res);
                //     navigate('/');
                // } catch (e: any) {
                //     console.error("Error login:", e);
                //     if (e?.errors) {
                //         Object.entries(e.errors).forEach(([field, messages]) => {
                //             setError(field as keyof typeof data, {
                //                 type: "server",
                //                 message: (messages as string[]).join(', '),
                //             });
                //         });
                //     } else {
                //         const errorMsg = typeof e === 'string'
                //             ? e
                //             : e?.message || e?.error || 'Đăng nhập thất bại.';
                //         setError("email", {
                //             type: "server",
                //             message: errorMsg,
                //         });
                //     }
                // }
            })
            .catch((e) => console.error("Trigger error:", e));
    };
    return (
        <div className="max-w-full mx-auto p-6">
            {/* Avatar upload */}
            <div className="mb-6 flex items-center space-x-4">
                <AvatarEditField control={control} name="avatar" size={80} />
            </div>

            {/* Nickname */}
            <div className="mb-6">
                <TextField
                    name="Nhập tên"
                    control={control}
                    label="Nickname"
                    placeholder="Nhập tên"
                    type="text"
                />
            </div>

            {/* Gender */}
            <div className="mb-6">
                <ComboBoxField
                    name="gender"
                    control={control}
                    label="Giới tính"
                    options={[
                        { value: "", label: "Chọn giới tính" },
                        { value: "male", label: "Nam" },
                        { value: "female", label: "Nữ" },
                        { value: "other", label: "Khác" },
                    ]}
                />
            </div>

            {/* Birthday */}
            <div className="mb-6">
                <TextField
                    name="birthday"
                    control={control}
                    label="Ngày sinh"
                    type="date"
                />
            </div>

            {/* Address */}
            <div className="mb-6">
                <TextField
                    name="address"
                    control={control}
                    label="Địa chỉ"
                    placeholder="Nhập địa chỉ"
                    type="text"
                />
            </div>

            {/* Bio */}
            <div className="mb-6">
                <TextareaField
                    name="bio"
                    control={control}
                    label="Tiểu sử"
                    placeholder="Nhập tiểu sử"
                    rows={4}
                />
            </div>

            {/* Hobbies */}
            <div className="mb-6">
                <TextareaField
                    name="hobbies"
                    control={control}
                    label="Sở thích"
                    placeholder="Nhập sở thích"
                    rows={3}
                />
            </div>

            <Button
                className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
                onClick={handleSubmit}
            >
                Lưu thay đổi
            </Button>
        </div>
    );
}
