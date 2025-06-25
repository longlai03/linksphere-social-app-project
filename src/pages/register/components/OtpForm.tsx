import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import TextField from "../../../components/input/TextField";
import Button from "../../../components/Button";
import LinkText from "../../../components/LinkText";
import Text from "../../../components/Text";
import type { StepComponentProps } from "../../../layout/MultiStepForm";
import { OTPValidation } from "../../../provider/validation/AuthValidation";
import { OTPDefaultValue } from "../../../store/auth/constant";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/redux";

const OtpForm = ({ onBack }: StepComponentProps) => {
    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: OTPDefaultValue,
        resolver: yupResolver(OTPValidation),
    });
    const { control, getValues, trigger, formState: { errors } } = methods;
    const { registerForm } = useSelector((state: RootState) => state.auth.form.register)

    const handleSubmit = () => {
        trigger().then(async (res) => {
            if (res) {
                const data = getValues();
                console.log("Mã xác nhận:", data);
            } else {
                console.log(errors)
            }
        }).catch((e) => {
            console.log(e);
        });
    };

    const handleOnBack = () => {
        console.log('go back')
        onBack?.();
    }

    return (
        <div className="max-w-sm mx-auto bg-white p-8 rounded text-center space-y-4">
            <Text type="h2">Nhập mã xác nhận</Text>
            <Text type="body">
                Nhập mã xác nhận mà chúng tôi đã gửi đến địa chỉ{" "}
                <strong>{registerForm.email}</strong>.{" "}
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

