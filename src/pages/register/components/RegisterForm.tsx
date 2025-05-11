import { useForm } from "react-hook-form";
import TextField from "../../../provider/input/TextField";
import Text from "../../../provider/input/Text";
import Button from "../../../provider/input/Button";
import LinkText from "../../../provider/input/LinkText";
import { RegisterDefaultValue } from "../../../store/auth/constant";
import type { StepComponentProps } from "../../../provider/layout/MultiStepForm";


const RegisterForm = ({ onNext }: StepComponentProps) => {
    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: RegisterDefaultValue as any,
        // resolver: yupResolver(RegisterValidation),
    });

    const {
        control,
        getValues,
        trigger,
        formState: { errors },
    } = methods;

    const handleSubmit = () => {
        trigger().then((valid) => {
            if (valid) {
                const values = getValues();
                console.log("Register Data", values);
                onNext?.();
            }
        });
    };

    return (
        <div className="max-w-sm mx-auto bg-white rounded p-8 space-y-4">
            <Text type="h2" className="block text-center font-logo text-3xl mb-2">
                Linksphere
            </Text>

            <Text type="body" className="block text-center">
                Đăng ký ngay để xem ảnh và video từ bạn bè.
            </Text>
            <TextField
                name="email"
                type="text"
                control={control}
                label="Email"
                placeholder="Nhập email"
            />
            <TextField
                name="password"
                type="password"
                control={control}
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
            />
            <TextField
                name="full_name"
                type="text"
                control={control}
                label="Tên đầy đủ"
                placeholder="Nhập tên bạn"
            />
            <TextField
                name="user_name"
                type="text"
                control={control}
                label="Tên người dùng"
                placeholder="username_123"
            />
            <Text type="caption" className="block text-center">
                Bằng cách đăng ký, bạn đồng ý với{" "}
                <LinkText to="#" className="text-blue-500 font-medium">
                    Điều khoản
                </LinkText>
                ,{" "}
                <LinkText to="#" className="text-blue-500 font-medium">
                    Chính sách quyền riêng tư
                </LinkText>
                {" "}
                và{" "}
                <LinkText to="#" className="text-blue-500 font-medium">
                    Chính sách cookie
                </LinkText>
                {" "}
                của chúng tôi.
            </Text>
            <Button type="submit" onClick={handleSubmit}>
                Đăng ký
            </Button>
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex-1 h-px bg-gray-300" />
                HOẶC
                <div className="flex-1 h-px bg-gray-300" />
            </div>
            <Text type="body" className="block text-center">
                Bạn có tài khoản?{" "}
                <LinkText to="/login" className="text-blue-500 font-medium">
                    Đăng nhập
                </LinkText>
            </Text>
        </div>
    );
};

export default RegisterForm;
