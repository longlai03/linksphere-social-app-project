import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TextField from "../../../provider/input/TextField";
import Button from "../../../provider/layout/components/Button";
import Text from "../../../provider/layout/components/Text";
import type { StepComponentProps } from "../../../provider/layout/MultiStepForm";
import { ForgotPasswordOtpValidation } from "../../../provider/validation/AuthValidation";
import { handleWatchForgotPasswordOtpForm, verifyResetCode, setForgotPasswordCode } from "../../../store/auth";
import type { AppDispatch, RootState } from "../../../store/redux";
import { useEffect } from "react";

const VerifyCodeForm = ({ onNext, onBack }: StepComponentProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { email, otpForm } = useSelector((state: RootState) => state.auth.form.forgotPassword);

    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: {
            otp: otpForm.otp || "",
        },
        resolver: yupResolver(ForgotPasswordOtpValidation) as any,
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
        watch((e) => dispatch(handleWatchForgotPasswordOtpForm(JSON.stringify(e))));
    }, [watch]);

    const handleSubmit = () => {
        trigger().then(async (isValid) => {
            if (!isValid) {
                console.log(errors);
                return;
            }
            const data = getValues();
            try {
                dispatch(setForgotPasswordCode(data.otp));
                await dispatch(verifyResetCode({ email, code: data.otp })).unwrap();
                onNext?.();
            } catch (e: any) {
                console.error("Error verifying code:", e);
                setError("otp", { type: "server", message: typeof e === "string" ? e : (e?.message || "Đã xảy ra lỗi. Vui lòng thử lại.") });
            }
        });
    };

    return (
        <div className="max-w-sm mx-auto bg-white p-8 rounded text-center space-y-4">
            <Text type="h2">Nhập mã xác thực</Text>
            <Text type="body">
                Chúng tôi đã gửi mã xác thực đến email {email}. Vui lòng kiểm tra và nhập mã vào đây.
            </Text>
            <TextField
                name="otp"
                control={control}
                type="text"
                placeholder="Mã xác thực"
            />
            <div className="flex gap-2">
                <Button onClick={onBack} variant="secondary" className="flex-1">
                    Quay lại
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                    Xác thực
                </Button>
            </div>
        </div>
    );
};

export default VerifyCodeForm;