import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TextField from "../../../provider/input/TextField";
import Button from "../../../provider/layout/components/Button";
import LinkText from "../../../provider/layout/components/LinkText";
import Text from "../../../provider/layout/components/Text";
import type { StepComponentProps } from "../../../provider/layout/MultiStepForm";
import { ForgotPasswordEmailValidation } from "../../../provider/validation/AuthValidation";
import { handleWatchForgotPasswordEmailForm, sendResetCode, setForgotPasswordEmail } from "../../../store/auth";
import type { AppDispatch, RootState } from "../../../store/redux";
import { useEffect } from "react";

const EmailForm = ({ onNext }: StepComponentProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { emailForm } = useSelector((state: RootState) => state.auth.form.forgotPassword);

    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: {
            email: emailForm.email || "",
        },
        resolver: yupResolver(ForgotPasswordEmailValidation) as any,
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
        watch((e) => dispatch(handleWatchForgotPasswordEmailForm(JSON.stringify(e))));
    }, [watch]);

    const handleSubmit = () => {
        trigger().then(async (isValid) => {
            if (!isValid) {
                console.log(errors);
                return;
            }
            const data = getValues();
            try {
                await dispatch(sendResetCode(data.email)).unwrap();
                dispatch(setForgotPasswordEmail(data.email));
                onNext?.();
            } catch (e: any) {
                console.error("Error sending reset code:", e);
                setError("email", { message: typeof e === "string" ? e : (e?.message || "Đã xảy ra lỗi. Vui lòng thử lại.") });
            }
        });
    };

    return (
        <div className="max-w-sm mx-auto bg-white p-8 rounded text-center space-y-4">
            <Text type="h2">Bạn gặp sự cố khi đăng nhập?</Text>
            <Text type="body">
                Nhập email của bạn và chúng tôi sẽ gửi cho bạn một mã xác thực để đặt lại mật khẩu.
            </Text>
            <TextField
                name="email"
                control={control}
                type="email"
                placeholder="Email của bạn"
            />
            <div className="flex gap-2">
                <Button onClick={() => window.history.back()} variant="secondary" className="flex-1">
                    Quay lại đăng nhập
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                    Gửi mã xác thực
                </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex-1 h-px bg-gray-300" />
                HOẶC
                <div className="flex-1 h-px bg-gray-300" />
            </div>
            <Text>
                <LinkText to="/register" className="font-medium text-sm">
                    Tạo tài khoản mới
                </LinkText>
            </Text>
        </div>
    );
};

export default EmailForm;