import { useForm } from "react-hook-form";
import TextField from "../../../provider/input/TextField";
import Button from "../../../provider/input/Button";
import LinkText from "../../../provider/input/LinkText";
import Text from "../../../provider/input/Text";
import { LoginDefaultValue } from "../../../store/auth/constant";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
// import { yupResolver } from "@hookform/resolvers/yup";
// import LoginValidation from "../../../provider/validation/LoginValidation";

const LoginForm = () => {
    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: LoginDefaultValue as any,
        // resolver: yupResolver(LoginValidation),
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
        <div className="bg-white p-8 space-y-4">
            <Text type="h2" className="block text-center font-logo mb-6">
                Linksphere
            </Text>

            <TextField
                icon={<EmailOutlinedIcon />}
                name="email"
                type="email"
                control={control}
                placeholder="Nhập email"
                label="Email"
            />
            <TextField
                icon={<PasswordOutlinedIcon />}
                name="password"
                type="password"
                control={control}
                placeholder="Nhập mật khẩu"
                label="Mật khẩu"
            />
            <Button type="submit" onClick={handleSubmit}>
                Đăng nhập
            </Button>
            <LinkText to="/forgot-password" className="block text-center">Quên mật khẩu?</LinkText>
            <Text type="body" className="block text-center mt-4">
                Bạn chưa có tài khoản?{" "}
                <LinkText to="/register" className="text-blue-500 font-medium">
                    Đăng ký
                </LinkText>
            </Text>
        </div>
    );
};

export default LoginForm;
