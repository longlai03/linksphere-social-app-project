import { useForm } from "react-hook-form";
import Text from "../../../provider/input/Text";
import TextField from "../../../provider/input/TextField";
import Button from "../../../provider/input/Button";
import LinkText from "../../../provider/input/LinkText";
import type { StepComponentProps } from "../../../provider/layout/MultiStepForm";
import { OTPDefaultValue } from "../../../store/auth/constant";

const OtpForm = ({ onBack }: StepComponentProps) => {
    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: OTPDefaultValue as any,
        // resolver: yupResolver(OTPValidation),
    });
    const {
        control,
        getValues,
        trigger,
        formState: { errors },
    } = methods
    const handleSubmit = () => {
        trigger().then((isValid) => {
            if (isValid) {
                const { otp } = getValues();
                console.log("Mã xác nhận:", otp);
                // Send OTP to Server
            }
        });
    };

    const handleOnBack = () => {
        console.log('go back')
        onBack?.();
    }

    return (
        <div className="max-w-sm mx-auto bg-white p-8 rounded text-center space-y-4">
            <div className="flex justify-center">
                <img src="/icons/mail-icon.png" alt="Mail icon" className="w-12 h-12" />
            </div>
            <Text type="h2">Nhập mã xác nhận</Text>
            <Text type="body">
                Nhập mã xác nhận mà chúng tôi đã gửi đến địa chỉ{" "}
                <strong>hoanglongdtd@gmail.com</strong>.{" "}
                <LinkText to="#" className="font-bold hover:underline">
                    Gửi lại mã.
                </LinkText>
            </Text>
            <TextField
                name="otp"
                type="text"
                control={control}
                placeholder="Mã xác nhận"
            />
            <Button onClick={handleSubmit}>Tiếp</Button>
            <LinkText to="#" className="block text-center text-sm" onClick={handleOnBack}>
                Quay lại
            </LinkText>
        </div>
    );
};

export default OtpForm;
