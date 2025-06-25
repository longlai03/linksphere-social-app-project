import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextField from "../../../components/input/TextField";
import Button from "../../../components/Button";
import Text from "../../../components/Text";
import type { StepComponentProps } from "../../../layout/MultiStepForm";
import { ForgotPasswordResetValidation } from "../../../provider/validation/AuthValidation";
import { handleWatchForgotPasswordResetForm, resetPassword } from "../../../store/auth";
import type { AppDispatch, RootState } from "../../../store/redux";
import { useEffect } from "react";
import { useMessage } from "../../../layout/MessageProvider";

const ResetPasswordForm = ({ onBack }: StepComponentProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const message = useMessage();
    const navigate = useNavigate();
    const { email, code, resetForm } = useSelector((state: RootState) => state.auth.form.forgotPassword);

    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: {
            newPassword: resetForm.newPassword || "",
            confirmPassword: resetForm.confirmPassword || "",
        },
        resolver: yupResolver(ForgotPasswordResetValidation) as any,
    });

    const {
        control,
        getValues,
        setError,
        trigger,
        watch,
        formState: { errors },
    } = methods;

    useEffect(() => {
        watch((e) => dispatch(handleWatchForgotPasswordResetForm(JSON.stringify(e))));
    }, [watch]);

    const handleSubmit = () => {
        trigger().then(async (isValid) => {
            if (!isValid) {
                console.log(errors);
                return;
            }
            const data = getValues();
            try {
                await dispatch(resetPassword({
                    email,
                    code,
                    password: data.newPassword,
                    confirmPassword: data.confirmPassword
                })).unwrap();
                message.success('Đặt lại mật khẩu thành công! Sẽ điều hướng tới trang đăng nhập...');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } catch (e: any) {
                console.error("Error resetting password:", e);
                setError("newPassword", { type: "server", message: typeof e === "string" ? e : (e?.message || "Đã xảy ra lỗi. Vui lòng thử lại.") });
            }
        });
    };

    return (
        <div className="max-w-sm mx-auto bg-white p-8 rounded text-center space-y-4">
            <Text type="h2">Đặt lại mật khẩu</Text>
            <Text type="body">
                Vui lòng nhập mật khẩu mới của bạn.
            </Text>
            <TextField
                name="newPassword"
                control={control}
                type="password"
                placeholder="Mật khẩu mới"
            />
            <TextField
                name="confirmPassword"
                control={control}
                type="password"
                placeholder="Xác nhận mật khẩu"
            />
            <div className="flex gap-2">
                <Button onClick={onBack} variant="secondary" className="flex-1">
                    Quay lại
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                    Đặt lại mật khẩu
                </Button>
            </div>
        </div>
    );
};

export default ResetPasswordForm;