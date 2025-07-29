/* eslint-disable react-hooks/exhaustive-deps */
import { EditAccountValidation } from "@/provider/validation/UserValidation";
import { ProfileEditDefaultValue } from "@/store/auth/constant";
import { ArrowLeftOutlined } from "@ant-design/icons";
import DefaultImage from '@assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import AvatarEditField from "@components/input/AvatarEditField";
import ComboBoxField from "@components/input/ComboBoxField";
import TextField from "@components/input/TextField";
import TextareaField from "@components/input/TextareaField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMessage } from "@layout/MessageProvider";
import { updateUser } from "@store/auth";
import type { AppDispatch, RootState } from '@store/redux';
import { Button, Divider } from "antd";
import clsx from "clsx";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfileEditForm = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const message = useMessage();
    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: ProfileEditDefaultValue,
        resolver: yupResolver(EditAccountValidation)
    });
    const {
        control,
        getValues,
        trigger,
        reset,
        formState: { errors },
    } = methods;

    useEffect(() => {
        reset({
            avatar_url: "",
            nickname: user.nickname ?? "",
            address: user.address ?? "",
            bio: user.bio ?? "",
            hobbies: user.hobbies ?? "",
            gender: user.gender ?? "",
            birthday: user.birthday ?? "",
        });
    }, [user]);

    const handleSubmit = () => {
        trigger()
            .then(async (isValid) => {
                if (!isValid) {
                    console.log(errors);
                    return;
                }
                const data = getValues() as any;
                if (!data.avatar_url) {
                    delete data.avatar_url;
                }
                try {
                    if (user?.id) {
                        const res = await dispatch(updateUser({
                            userId: user.id,
                            userData: data
                        })).unwrap();
                        console.log("Profile updated successfully:", res);
                        message.success("Cập nhật tài khoản thành công!");
                        navigate(`/user/${user.id}`);

                    } else {
                        console.error('User ID is not available');
                    }
                } catch (error) {
                    console.error("Error updating profile:", error);
                    message.error("Có lỗi khi cập nhật thông tin tài khoản của bạn.");
                }
            })
            .catch((e) => console.error("Trigger error:", e));
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 w-full">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 transition-all duration-300">
                <div className="flex items-center">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        type="text"
                        onClick={handleGoBack}
                        className="flex items-center text-gray-500 hover:text-blue-600"
                    >
                        Quay lại
                    </Button>
                </div>

                <Divider className="mb-8" />

                <div className="flex flex-col items-center mb-8">
                    <AvatarEditField
                        previewUrl={user.avatar_url ? `http://localhost:8000/${user.avatar_url}` : DefaultImage}
                        control={control}
                        name="avatar_url"
                        size={104}
                    />
                </div>
                <div className="space-y-6">
                    <TextField
                        name="nickname"
                        control={control}
                        label="Nickname"
                        placeholder="Nhập tên"
                        type="text"
                    />
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
                    <TextField
                        name="birthday"
                        control={control}
                        label="Ngày sinh"
                        type="date"
                    />
                    <TextField
                        name="phone"
                        control={control}
                        label="Số điện thoại"
                        type="text"
                    />
                    <TextField
                        name="address"
                        control={control}
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ"
                        type="text"
                    />
                    <TextareaField
                        name="bio"
                        control={control}
                        label="Tiểu sử"
                        placeholder="Nhập tiểu sử"
                        rows={4}
                    />
                    <TextareaField
                        name="hobbies"
                        control={control}
                        label="Sở thích"
                        placeholder="Nhập sở thích"
                        rows={3}
                    />
                </div>
                <Button
                    type="primary"
                    block
                    size="large"
                    className={clsx(
                        "mt-10 font-semibold rounded-xl transition-all duration-200 shadow-md",
                        "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-none",
                        "hover:scale-105"
                    )}
                    onClick={handleSubmit}
                    style={{ fontSize: 18, letterSpacing: 1 }}
                >
                    Lưu thay đổi
                </Button>
            </div>
        </div>
    );
}

export default ProfileEditForm;