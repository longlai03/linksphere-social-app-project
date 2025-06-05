import { LockOutlined } from '@ant-design/icons'; 
import Text from "../../provider/layout/components/Text";
import TextField from "../../provider/input/TextField";
import Button from "../../provider/layout/components/Button";
import LinkText from "../../provider/layout/components/LinkText";
import { ForgotPasswordDefaultValue } from "../../store/auth/constant";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: ForgotPasswordDefaultValue as any,
    });

    const {
        control,
        getValues,
        trigger,
        formState: { errors },
    } = methods;

    const handleSubmit = () => {
        trigger()
            .then((res) => {
                if (res) {
                    const data = getValues();
                    console.log("Original data", data);
                } else {
                    console.log(errors);
                }
            })
            .catch((e) => console.error(e));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="max-w-sm mx-auto bg-white p-8 rounded text-center space-y-4">
                <div className="flex justify-center">
                    <LockOutlined />
                </div>
                <Text type="h2">Bạn gặp sự cố khi đăng nhập?</Text>
                <Text type="body">
                    Nhập email, số điện thoại hoặc tên người dùng của bạn và chúng tôi sẽ
                    gửi cho bạn một liên kết để truy cập lại vào tài khoản.
                </Text>
                <TextField
                    name="identity"
                    control={control}
                    type="text"
                    placeholder="Email, điện thoại hoặc tên người dùng"
                />
                <Button onClick={handleSubmit}>Gửi liên kết đặt lại</Button>
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
                <Text>
                    <LinkText to="/login" className="text-sm font-semibold">
                        Quay lại đăng nhập
                    </LinkText>
                </Text>
            </div>
        </div>
    );
};

export default ForgotPassword;
