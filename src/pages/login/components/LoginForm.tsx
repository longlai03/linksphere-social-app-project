import { useForm } from "react-hook-form";
import TextField from "@components/input/TextField";
import Button from "@components/Button";
import LinkText from "@components/LinkText";
import Text from "@components/Text";
import { LoginDefaultValue } from "@store/auth/constant";
import LogoTitle from '@assets/images/logotitle.png'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@store/redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginValidation } from "@provider/validation/AuthValidation";
import { handleWatchLoginForm, userLogin } from "@store/auth";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: LoginDefaultValue,
        resolver: yupResolver(LoginValidation),
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
        watch((e) => dispatch(handleWatchLoginForm(JSON.stringify(e))));
    }, [watch]);

    const handleSubmit = () => {
        trigger()
            .then(async (isValid) => {
                if (!isValid) {
                    console.log(errors);
                    return;
                }
                const data = getValues();
                console.log("Original data", data);
                try {
                    const res = await dispatch(userLogin(data)).unwrap();
                    console.log("Login success:", res);
                    navigate('/');
                } catch (e: any) {
                    console.error("Error login:", e);
                    if (e?.errors) {
                        Object.entries(e.errors).forEach(([field, messages]) => {
                            setError(field as keyof typeof data, {
                                type: "server",
                                message: (messages as string[]).join(', '),
                            });
                        });
                    } else {
                        const errorMsg = typeof e === 'string'
                            ? e
                            : e?.message || e?.error || 'Đăng nhập thất bại.';
                        setError("email", {
                            type: "server",
                            message: errorMsg,
                        });
                    }
                }
            })
            .catch((e) => console.error("Trigger error:", e));
    };

    return (
        <div className="bg-white p-8 space-y-4">
            <div className="flex justify-center mb-4">
                <img
                    src={LogoTitle}
                    alt="Linksphere Logo"
                    className="h-12 w-auto object-contain"
                />
            </div>
            <TextField
                name="email"
                type="email"
                control={control}
                placeholder="Nhập email"
                label="Email"
            />
            <TextField
                name="password"
                type="password"
                control={control}
                placeholder="Nhập mật khẩu"
                label="Mật khẩu"
            />
            <Button onClick={handleSubmit}>
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
