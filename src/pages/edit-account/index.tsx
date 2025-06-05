import { useForm } from 'react-hook-form';
import TextField from "../../provider/input/TextField";
import TextareaField from "../../provider/input/TextareaField";
import ComboBoxField from "../../provider/input/ComboBoxField";
import Button from "../../provider/layout/components/Button";
import AvatarEditField from "../../provider/input/AvatarEditField";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from '../../store/redux';
import { notification } from "antd";

export default function ProfileEditForm() {
    const { user, token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: {
            avatar_url: user.avatar_url ?? "",
            nickname: user.nickname ?? "",
            address: user.address ?? "",
            bio: user.bio ?? "",
            hobbies: user.hobbies ?? "",
            gender: user.gender ?? "",
            birthday: user.birthday ?? "",
        },
    });

    const {
        control,
        getValues,
        setError,
        trigger,
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

                try {
                    if (user?.id) {
                        const res = await dispatch(updateUser({ userId: user.id, userData: data, token })).unwrap();
                        console.log("Profile updated successfully:", res);
                        navigate('/user');
                        notification.success({
                            message: "Cập nhật tài khoản thành công",
                            description: "Thông tin của bạn đã được cập nhật thành công.",
                        });
                    } else {
                        console.error('User ID is not available');
                    }
                } catch (error) {
                    console.error("Error updating profile:", error);
                    notification.error({
                        message: "Cập nhật tài khoản thất bại",
                        description: "Có lỗi khi cập nhật thông tin tài khoản của bạn.",
                    });
                }
            })
            .catch((e) => console.error("Trigger error:", e));
    };


    return (
        <div className="max-w-full mx-auto p-6">
            {/* Avatar upload */}
            <div className="mb-6 flex items-center space-x-4">
                <AvatarEditField defaultValue={user.avatar_url} control={control} name="avatar_url" size={80} />
            </div>

            {/* Nickname */}
            <div className="mb-6">
                <TextField
                    name="nickname"
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
